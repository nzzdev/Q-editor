import { bindable, inject, Loader, LogManager } from 'aurelia-framework';
import { Notification } from 'aurelia-notification';
import { I18N } from 'aurelia-i18n';
import { checkAvailability } from 'resources/schemaEditorDecorators.js';
import qEnv from 'resources/qEnv.js';
import { AuthService } from 'aurelia-authentication';
const log = LogManager.getLogger('Q');

@checkAvailability()
@inject(Loader, AuthService, Notification, I18N)
export class SchemaEditorFiles {

  @bindable schema;
  @bindable data;
  @bindable change;
  @bindable required;

  options = {
    maxFiles: null
  }

  constructor(loader, authService, notification, i18n) {
    this.loader = loader;
    this.authService = authService;
    this.notification = notification;
    this.i18n = i18n;
  }

  schemaChanged() {
    this.applyOptions();
  }

  applyOptions() {
    if (!this.schema) {
      return;
    }
    if (this.schema.hasOwnProperty('Q:options')) {
      this.options = Object.assign(this.options, this.schema['Q:options']);
    }
  }

  async attached() {
    // if window.Dropzone is not defined, we load it async here using the aurelia loader
    // as we need Dropzone later, we need to await the loading
    if (!window.Dropzone) {
      try {
        window.Dropzone = await this.loader.loadModule('dropzone');
        this.loader.loadModule('npm:dropzone@5.2.0/dist/min/dropzone.min.css!');
      } catch (e) {
        log.error(e);
      }
    }
    if (!window.Dropzone) {
      log.error('window.Dropzone is not defined after loading dropzone');
      return;
    }

    const QServerBaseUrl = await qEnv.QServerBaseUrl;

    const translations = {
      "dictDefaultMessage": this.i18n.tr('dropzone.dictDefaultMessage'),
      "dictFallbackMessage": this.i18n.tr('dropzone.dictFallbackMessage'),
      "dictFallbackText": this.i18n.tr('dropzone.dictFallbackText'),
      "dictFileTooBig": this.i18n.tr('dropzone.dictFileTooBig'),
      "dictInvalidFileType": this.i18n.tr('dropzone.dictInvalidFileType'),
      "dictResponseError": this.i18n.tr('dropzone.dictResponseError'),
      "dictCancelUpload": this.i18n.tr('dropzone.dictCancelUpload'),
      "dictCancelUploadConfirmation": this.i18n.tr('dropzone.dictCancelUploadConfirmation'),
      "dictRemoveFile": this.i18n.tr('dropzone.dictRemoveFile'),
      "dictMaxFilesExceeded": this.i18n.tr('dropzone.dictMaxFilesExceeded')
    }

    const dropzoneOptions = Object.assign({
      addRemoveLinks: true,
      url: `${QServerBaseUrl}/file`,
      headers: {
        "Authorization": `${this.authService.config.authTokenType} ${this.authService.getAccessToken()}`
      }
    }, this.options, translations);

    this.dropzone = new window.Dropzone(this.dropzoneElement, dropzoneOptions);

    this.dropzone.on('success', (file, response) => {
      if (this.options.maxFiles && this.options.maxFiles === 1) {
        this.data = response.url;
      } else {
        if (!Array.isArray(this.data)) {
          this.data = [];
        }
        this.data.push(response.url);
      }
      // the originalUrl property is used when deleting a file to delete it as well from the data
      file.originalUrl = response.url;
    });

    this.dropzone.on('removedfile', (file) => {
      if (Array.isArray(this.data)) {
        this.data.splice(this.data.indexOf(file.originalUrl), 1);
      } else {
        this.data = undefined;
      }
    });

    this.dropzone.on('maxfilesexceeded', (file) => {
      this.dropzone.removeFile(file);
      this.notification.error('notifications.maxNumberOfFilesExceed');
    });

    this.preloadExistingFiles();
  }

  preloadExistingFiles() {
    const fileUrls = [];
    if (this.data && this.schema.type === 'string') {
      fileUrls.push(this.data);
    }
    if (this.data && this.schema.type === 'array' && this.data.length > 0) {
      fileUrls.push(...this.data);
    }
    // preload images already uploaded
    for (let fileUrl of fileUrls) {
      const mockFile = {
        name: fileUrl,
        dataURL: fileUrl, // needed for dropzone to create the thumbnail in a canvas
        originalUrl: fileUrl, // the originalUrl property is used when deleting a file to delete it as well from the data
        size: 0,
        accepted: true
      }
      this.dropzone.files.push(mockFile);
      this.dropzone.emit('addedfile', mockFile);
      this.dropzone.createThumbnailFromUrl(mockFile, 120, 120, 'crop', false, thumbnail => {
        this.dropzone.emit("thumbnail", mockFile, thumbnail);
        this.dropzone.emit("complete", mockFile);
        this.dropzone.emit("accepted", mockFile);
        this.dropzone._updateMaxFilesReachedClass();
      }, 'anonymous');
    }
  }

}
