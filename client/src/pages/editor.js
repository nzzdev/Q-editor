import { inject, TaskQueue } from "aurelia-framework";
import { EventAggregator } from "aurelia-event-aggregator";
import { DialogService } from "aurelia-dialog";
import { I18N } from "aurelia-i18n";
import { Notification } from "aurelia-notification";

import { LogManager } from "aurelia-framework";
const log = LogManager.getLogger("Q");

import { ConfirmDialog } from "dialogs/confirm-dialog.js";

import qEnv from "resources/qEnv.js";
import ItemStore from "resources/ItemStore.js";
import ToolEndpointChecker from "resources/checkers/ToolEndpointChecker.js";
import AvailabilityChecker from "resources/checkers/AvailabilityChecker.js";
import NotificationChecker from "resources/checkers/NotificationChecker.js";
import ToolsInfo from "resources/ToolsInfo.js";
import CurrentItemProvider from "resources/CurrentItemProvider.js";
import ObjectFromSchemaGenerator from "resources/ObjectFromSchemaGenerator.js";

function getEditorSchema(fullSchema) {
  if (fullSchema.properties.hasOwnProperty("options")) {
    const schema = JSON.parse(JSON.stringify(fullSchema));
    delete schema.properties.options;
    return schema;
  }
  return fullSchema;
}

function getOptionsSchema(fullSchema) {
  if (fullSchema.properties.hasOwnProperty("options")) {
    const schema = JSON.parse(JSON.stringify(fullSchema.properties.options));
    return schema;
  }
  return undefined;
}

@inject(
  ItemStore,
  Notification,
  ToolEndpointChecker,
  AvailabilityChecker,
  NotificationChecker,
  ToolsInfo,
  CurrentItemProvider,
  ObjectFromSchemaGenerator,
  DialogService,
  I18N,
  EventAggregator,
  TaskQueue
)
export class Editor {
  constructor(
    itemStore,
    notification,
    toolEndpointChecker,
    availabilityChecker,
    notificationChecker,
    toolsInfo,
    currentItemProvider,
    objectFromSchemaGenerator,
    dialogService,
    i18n,
    eventAggregator,
    taskQueue
  ) {
    this.itemStore = itemStore;
    this.notification = notification;
    this.toolEndpointChecker = toolEndpointChecker;
    this.availabilityChecker = availabilityChecker;
    this.notificationChecker = notificationChecker;
    this.toolsInfo = toolsInfo;
    this.currentItemProvider = currentItemProvider;
    this.objectFromSchemaGenerator = objectFromSchemaGenerator;
    this.dialogService = dialogService;
    this.i18n = i18n;
    this.eventAggregator = eventAggregator;
    this.taskQueue = taskQueue;

    // used to hold all the notifications appearing in
    // the schema-editor tree
    this.optionsNotifications = [];
    this.editorNotifications = [];
  }

  async activate(routeParams) {
    this.toolName = routeParams.tool;

    const isToolAvailable = await this.toolsInfo.isToolWithNameAvailable(
      this.toolName
    );
    if (!isToolAvailable) {
      this.notification.error("notifications.toolNotAvailable");
      return false;
    }

    let showMessageTimeout;
    let timeoutPromise = new Promise((resolve, reject) => {
      showMessageTimeout = setTimeout(() => {
        this.notification.error("editor.activatingEditorTakesTooLong");
        reject(new Error("activating editor takes too long"));
      }, 5000);
    });

    const QServerBaseUrl = await qEnv.QServerBaseUrl;
    let allLoaded = fetch(
      `${QServerBaseUrl}/tools/${this.toolName}/schema.json`
    )
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        throw response;
      })
      .then(fullSchema => {
        this.fullSchema = fullSchema;
        this.schema = getEditorSchema(this.fullSchema);
        this.optionsSchema = getOptionsSchema(this.fullSchema);
      })
      .then(() => {
        if (routeParams.hasOwnProperty("id") && routeParams.id !== undefined) {
          return this.itemStore.getItem(routeParams.id);
        }

        let item = this.itemStore.getNewItem();
        item.conf = this.objectFromSchemaGenerator.generateFromSchema(
          this.fullSchema
        );
        item.conf.tool = this.toolName;
        return item;
      })
      .then(item => {
        if (item) {
          this.currentItemProvider.setCurrentItem(item);
          this.item = item;

          if (this.item.conf.updatedDate) {
            this.lastSavedDate = new Date(this.item.conf.updatedDate);
          }
        }
      });

    return Promise.race([timeoutPromise, allLoaded]).then(() => {
      clearTimeout(showMessageTimeout);
    });
  }

  attached() {
    if (this.item && !this.item.conf.active) {
      this.startAutosave();
    } else {
      this.notification.warning("editor.noAutosaveBecauseActive");
    }
    this.previewData = JSON.parse(JSON.stringify(this.item.conf));
  }

  async canDeactivate() {
    if (!this.item || this.item.isSaved || this.deactivationConfirmed) {
      return true;
    }

    this.deactivationConfirmed = false;

    const openDialogResult = await this.dialogService.open({
      viewModel: ConfirmDialog,
      model: {
        confirmQuestion: this.i18n.tr("editor.questionLeaveWithUnsavedChanges"),
        confirmQuestionSub: this.i18n.tr(
          "editor.questionLeaveWithUnsavedChangesSub"
        )
      }
    });
    const closeResult = await openDialogResult.closeResult;

    if (closeResult.wasCancelled) {
      return false;
    }

    this.deactivationConfirmed = true;
    return await this.item.reset();
  }

  deactivate() {
    this.stopAutosave();
  }

  startAutosave() {
    if (!this.autoSaveInterval) {
      this.autoSaveInterval = setInterval(() => {
        if (!this.item.isSaved) {
          if (this.form.checkValidity()) {
            this.save();
          }
        }
      }, 20 * 1000);
    }
  }

  stopAutosave() {
    if (this.autoSaveInterval) {
      clearInterval(this.autoSaveInterval);
      this.autoSaveInterval = undefined;
    }
  }

  triggerReevaluations() {
    // emtpy the notifications as we will get new ones
    this.editorNotifications = [];
    this.optionsNotifications = [];
    this.availabilityChecker.triggerReevaluation();
    this.notificationChecker.triggerReevaluation();
    this.toolEndpointChecker.triggerReevaluation();
  }

  handleChange() {
    this.taskQueue.queueMicroTask(() => {
      this.item.changed();

      // whenever we have a change in data, we need to reevaluate all the checks...
      this.triggerReevaluations();
      // ... and update thte previewData to fetch new renderingInfo from the tool
      this.previewData = JSON.parse(JSON.stringify(this.item.conf));
    });
  }

  save() {
    this.item
      .save()
      .then(() => {
        log.info("item saved", this.item);
        this.lastSavedDate = new Date();
        // whenever we save the item, we need to reevaluate all the checks
        this.triggerReevaluations();
      })
      .then(() => {
        // ensure url includes the item id (it does not before first save for a new item)
        if (!window.location.href.includes(this.item.id)) {
          window.history.replaceState(
            null,
            "",
            `${window.location.href}/${this.item.id}`
          );
        }
      })
      .catch(error => {
        if (error.message === "isSaving") {
          // this is fine, we do not show an error in this case
          return;
        }
        log.error(error);
        if (error.status === 409) {
          this.notification.warning("editor.conflictOnSave");
        } else {
          this.notification.warning("editor.failedToSave");
        }
      });
  }

  userSave() {
    let valid = true;
    if (!this.form.checkValidity()) {
      // this triggers the HTML5 Form Validation in the browser
      this.formSubmitButton.click();
      valid = false;
      this.addInvalidClass(this.form.elements);
    }
    if (this.optionsForm && !this.optionsForm.checkValidity()) {
      // this triggers the HTML5 Form Validation in the browser
      this.optionsFormSubmitButton.click();
      valid = false;
      this.addInvalidClass(this.optionsForm.elements);
    }
    if (valid) {
      this.save();
    }
  }

  addInvalidClass(elements) {
    for (const element of elements) {
      if (!element.checkValidity()) {
        element.classList.add("q-form-input--invalid");
      }
    }
  }
}
