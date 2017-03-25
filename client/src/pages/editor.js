import { inject } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';
import { DialogService } from 'aurelia-dialog';
import { I18N } from 'aurelia-i18n';

import { LogManager } from 'aurelia-framework';
const log = LogManager.getLogger('Q');

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
  }

  return schema;
}

function getTranslatedSchema(schema, toolName, i18n) {
  schema = JSON.parse(JSON.stringify(schema));
  if (schema.title) {
    schema.title = i18n.tr(`${toolName}:${schema.title}`);
  }
  if (schema.hasOwnProperty('items')) {
    if (schema.items.hasOwnProperty('title')) {
      schema.items.title = i18n.tr(`${toolName}:${schema.title}`);
    }
    if (schema.items.hasOwnProperty('oneOf')) {
      schema.items.oneOf = schema.items.oneOf.map(oneOfSchema => getTranslatedSchema(oneOfSchema));
    }
  }
  if (schema.hasOwnProperty('properties')) {
    Object.keys(schema.properties).forEach(propertyName => {
      schema.properties[propertyName] = getTranslatedSchema(schema.properties[propertyName], toolName, i18n);
    });
  }
  return schema;
}

@inject(ItemStore, MessageService, DialogService, I18N, EventAggregator)
export class Editor {

  constructor(itemStore, messageService, dialogService, i18n, ea) {
    this.itemStore = itemStore;
    this.messageService = messageService;
    this.dialogService = dialogService;
    this.i18n = i18n;
    this.ea = ea;
  }

  activate(routeParams) {
    let showMessageTimeout;
    let timeoutPromise = new Promise((resolve, reject) => {
      showMessageTimeout = setTimeout(() => {
        this.messageService.pushMessage('error', this.i18n.tr('editor.activatingEditorTakesTooLong'));
        reject(new Error('activating editor takes too long'));
      }, 5000);
    });
    let allLoaded = qEnv.QServerBaseUrl
      .then(QServerBaseUrl => {
        return fetch(`${QServerBaseUrl}/tools/${routeParams.tool}/schema.json`);
      })
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        throw response;
      })
      .then(schema => {
        this.fullSchema = schema;
        const schemaForEditor = getSchemaForSchemaEditor(this.fullSchema);
        this.schema = getTranslatedSchema(schemaForEditor, routeParams.tool, this.i18n);
        if (this.fullSchema.properties.hasOwnProperty('options')) {
          this.optionsSchema = getTranslatedSchema(this.fullSchema.properties.options, routeParams.tool, this.i18n);
        }

        // whenever there is a language change, we calculate the schema and translate all title properties
        this.ea.subscribe('i18n:locale:changed', () => {
          this.schema = getTranslatedSchema(getSchemaForSchemaEditor(this.fullSchema), routeParams.tool, this.i18n);
          if (this.fullSchema.properties.hasOwnProperty('options')) {
            this.optionsSchema = getTranslatedSchema(this.fullSchema.properties.options, routeParams.tool, this.i18n);
          }
        });
      })
      .then(() => {
        if (routeParams.hasOwnProperty('id') && routeParams.id !== undefined) {
          return this.itemStore.getItem(routeParams.id);
        }

        let item = this.itemStore.getNewItem();
        item.conf = generateFromSchema(this.fullSchema);
        item.conf.tool = routeParams.tool;
        return item;
      })
      .then(item => {
        if (item) {
          this.item = item;
          this.optionsData = this.item.options;
        }
      });

    return Promise.race([timeoutPromise, allLoaded])
      .then(() => {
        clearTimeout(showMessageTimeout);
      });
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
    this.item.changed();
    this.previewData = JSON.parse(JSON.stringify(this.item.conf));
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
    if (!this.form.checkValidity()) {
      // this triggers the HTML5 Form Validation in the browser
      this.formSubmitButton.click();
      return;
    }
    this.save();
  }

}
