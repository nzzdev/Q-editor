import { inject, TaskQueue } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';
import { DialogService } from 'aurelia-dialog';
import { I18N } from 'aurelia-i18n';

import { LogManager } from 'aurelia-framework';
const log = LogManager.getLogger('Q');

import { ConfirmDialog } from 'dialogs/confirm-dialog.js';

import qEnv from 'resources/qEnv.js';
import MessageService from 'resources/MessageService.js';
import ItemStore from 'resources/ItemStore.js';
import ToolEndpointChecker from 'resources/ToolEndpointChecker.js';

import generateFromSchema from 'helpers/generateFromSchema.js';

function getSchemaForSchemaEditor(schema) {
  if (schema.properties.hasOwnProperty('options')) {
    let newSchema = JSON.parse(JSON.stringify(schema));
    delete newSchema.properties.options;
    return newSchema;
  }

  return schema;
}

function getTranslatedSchema(schema, toolName, i18n) {
  schema = JSON.parse(JSON.stringify(schema));
  if (schema.title) {
    schema.title = i18n.tr(`${toolName}:${schema.title}`);
  }
  if (schema.hasOwnProperty('items')) {
    if (schema.items.hasOwnProperty('oneOf')) {
      schema.items.oneOf = schema.items.oneOf.map(oneOfSchema => getTranslatedSchema(oneOfSchema, toolName, i18n));
    } else {
      schema.items = getTranslatedSchema(schema.items, toolName, i18n);
    }
  }
  if (schema.hasOwnProperty('properties')) {
    Object.keys(schema.properties).forEach(propertyName => {
      schema.properties[propertyName] = getTranslatedSchema(schema.properties[propertyName], toolName, i18n);
    });
  }
  if (schema.hasOwnProperty('Q:options') && schema['Q:options'].hasOwnProperty('enum_titles')) {
    schema['Q:options'].enum_titles = schema['Q:options'].enum_titles.map(title => {
      return i18n.tr(`${toolName}:${title}`);
    });
  }
  return schema;
}

@inject(ItemStore, MessageService, ToolEndpointChecker, DialogService, I18N, EventAggregator, TaskQueue)
export class Editor {

  constructor(itemStore, messageService, toolEndpointChecker, dialogService, i18n, eventAggregator, taskQueue) {
    this.itemStore = itemStore;
    this.messageService = messageService;
    this.toolEndpointChecker = toolEndpointChecker;
    this.dialogService = dialogService;
    this.i18n = i18n;
    this.eventAggregator = eventAggregator;
    this.taskQueue = taskQueue;
  }

  async activate(routeParams) {
    this.toolName = routeParams.tool;

    let showMessageTimeout;
    let timeoutPromise = new Promise((resolve, reject) => {
      showMessageTimeout = setTimeout(() => {
        this.messageService.pushMessage('error', this.i18n.tr('editor.activatingEditorTakesTooLong'));
        reject(new Error('activating editor takes too long'));
      }, 5000);
    });

    const QServerBaseUrl = await qEnv.QServerBaseUrl;
    let allLoaded = fetch(`${QServerBaseUrl}/tools/${this.toolName}/schema.json`)
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        throw response;
      })
      .then(schema => {
        this.fullSchema = schema;
        this.setTranslatedEditorAndOptionsSchema(this.fullSchema, this.toolName);

        // whenever there is a language change, we calculate the schema and translate all title properties
        this.eventAggregator.subscribe('i18n:locale:changed', () => {
          this.setTranslatedEditorAndOptionsSchema(this.fullSchema, this.toolName);
        });
      })
      .then(() => {
        if (routeParams.hasOwnProperty('id') && routeParams.id !== undefined) {
          return this.itemStore.getItem(routeParams.id);
        }

        let item = this.itemStore.getNewItem();
        item.conf = generateFromSchema(this.fullSchema);
        item.conf.tool = this.toolName;
        return item;
      })
      .then(item => {
        if (item) {
          // set the toolName and the current item to toolEndpointChecker
          // whenever we activate the editor. The toolEndpointChecker is used
          // in the SchemaEditorInputAvailabilityChecker to send requests to the current tool
          this.toolEndpointChecker.setCurrentToolName(this.toolName);
          this.toolEndpointChecker.setCurrentItem(item);
          this.item = item;
        }
      });

    return Promise.race([timeoutPromise, allLoaded])
      .then(() => {
        clearTimeout(showMessageTimeout);
      });
  }

  setTranslatedEditorAndOptionsSchema(fullSchema, toolName) {
    const schemaForEditor = getSchemaForSchemaEditor(fullSchema);
    this.schema = getTranslatedSchema(schemaForEditor, toolName, this.i18n);
    if (fullSchema.properties.hasOwnProperty('options')) {
      this.optionsSchema = getTranslatedSchema(fullSchema.properties.options, toolName, this.i18n);
    }
  }

  attached() {
    if (this.item && !this.item.isActive) {
      this.startAutosave();
    }
    this.previewData = JSON.parse(JSON.stringify(this.item.conf));
  }

  async canDeactivate() {
    if (this.item.isSaved || this.deactivationConfirmed) {
      return true;
    }

    this.deactivationConfirmed = false;
    let dialogResponse = await this.dialogService.open({
      viewModel: ConfirmDialog,
      model: {
        confirmQuestion: this.i18n.tr('editor.questionLeaveWithUnsavedChanges')
      }
    });

    if (dialogResponse.wasCancelled) {
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

  handleChange() {
    this.taskQueue.queueMicroTask(() => {
      this.item.changed();

      // whenever we have a change in data, we need to reevaluate all the checks
      // that used the toolEndpoint as the result could be different after data
      // changes occured.
      this.toolEndpointChecker.triggerReevaluation();
      this.previewData = JSON.parse(JSON.stringify(this.item.conf));
    });
  }

  save() {
    this.item.save()
      .then(() => {
        log.info('item saved', this.item);
      })
      .catch(error => {
        log.error(error);
        this.messageService.pushMessage('error', this.i18n.tr('editor.failedToSave', { reason: error.message }));
      });
  }

  userSave() {
    let valid = true;
    if (!this.form.checkValidity()) {
      // this triggers the HTML5 Form Validation in the browser
      this.formSubmitButton.click();
      valid = false;
    }
    if (this.optionsForm && !this.optionsForm.checkValidity()) {
      // this triggers the HTML5 Form Validation in the browser
      this.optionsFormSubmitButton.click();
      valid = false;
    }
    if (valid) {
      this.save();
    }
  }

}
