import { inject } from 'aurelia-framework';
import { DialogService } from 'aurelia-dialog';
import { I18N } from 'aurelia-i18n';

import { ConfirmDialog } from 'dialogs/confirm-dialog.js';

import qEnv from 'resources/qEnv.js';
import MessageService from 'resources/MessageService.js';
import ItemStore from 'resources/ItemStore.js';
import generateFromSchema from 'helpers/generateFromSchema.js';


function getSchemaForSchemaEditor(schema) {
  if (schema.properties.hasOwnProperty('options')) {
    let newSchema = JSON.parse(JSON.stringify(schema));
    delete newSchema.properties.options;
    return newSchema;
  } else {
    return schema;
  }
}

@inject(ItemStore, MessageService, DialogService, I18N)
export class Editor {

  constructor(itemStore, messageService, dialogService, i18n) {
    this.itemStore = itemStore;
    this.messageService = messageService;
    this.dialogService = dialogService;
    this.i18n = i18n;
  }

  activate(routeParams) {
    let showMessageTimeout;
    let timeoutPromise = new Promise((resolve, reject) => {
      showMessageTimeout = setTimeout(() => {
        this.messageService.pushMessage('error', this.i18n.tr('editor.activatingEditorTakesTooLong'));
        reject(new Error('activating editor takes too long'))
      }, 5000)
    })
    let allLoaded = qEnv.QServerBaseUrl
      .then(QServerBaseUrl => {
        return fetch(`${QServerBaseUrl}/tools/${routeParams.tool}/schema.json`)
      })
      .then(response => {
        if (response.ok) {
          return response.json()
        } else {
          return Promise.reject();
        }
      })
      .then(schema => {
        this.fullSchema = schema;
        this.schema = getSchemaForSchemaEditor(schema);
        if (schema.properties.hasOwnProperty('options')) {
          this.optionsSchema = schema.properties.options;
        }
      })
      .then(() => {
        if (routeParams.hasOwnProperty('id') && routeParams.id !== undefined) {
          return this.itemStore.getItem(routeParams.id);
        } else {
          let item = this.itemStore.getNewItem();
          item.conf = generateFromSchema(this.fullSchema)
          item.conf.tool = routeParams.tool;
          item.changed();
          return item;
        }
      })
      .then(item => {
        if (item) {
          this.item = item;
          this.optionsData = this.item.options;
        }
      })

    return Promise.race([timeoutPromise, allLoaded])
      .then(() => {
        clearTimeout(showMessageTimeout)
      });
  }

  attached() {
    if (this.item && !this.item.isActive) {
      this.startAutosave();
    }
    this.previewData = JSON.parse(JSON.stringify(this.item.conf));
  }

  canDeactivate() {
    return new Promise((resolve, reject) => {
      if (this.item.isSaved || this.deactivationConfirmed) {
        resolve();
      } else {
        this.deactivationConfirmed = false;
        this.dialogService.open({
          viewModel: ConfirmDialog,
          model: {
            confirmQuestion: this.i18n.tr('editor.questionLeaveWithUnsavedChanges')
          }
        }).then(response => {
          if (response.wasCancelled) {
            reject();
          } else {
            this.deactivationConfirmed = true;
            resolve();
          }
        });
      }
    });
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
      },20*1000);
    }
  }

  stopAutosave() {
    if (this.autoSaveInterval) {
      clearInterval(this.autoSaveInterval);
      this.autoSaveInterval = undefined;
    }
  }

  handleChange() {
    this.item.changed();
    this.previewData = JSON.parse(JSON.stringify(this.item.conf));
  }

  save() {
    this.item.save()
      .then(() => {
        console.log('item saved', this.item);
      })
      .catch(error => {
        console.log(error)
        this.messageService.pushMessage('error', this.i18n.tr('editor.failedToSave', { reason: error.message }));
      });
  }

  userSave() {
    if (!this.form.checkValidity()) {
      // this triggers the HTML5 Form Validation in the browser
      this.formSubmitButton.click();
      return;
    }
    this.save();
  }

}
