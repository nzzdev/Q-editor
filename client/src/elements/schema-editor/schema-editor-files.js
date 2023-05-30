import { bindable, inject, Loader, LogManager } from "aurelia-framework";
import { Notification } from "aurelia-notification";
import { I18N } from "aurelia-i18n";
import qEnv from "resources/qEnv.js";
import { AuthService } from "aurelia-authentication";
const log = LogManager.getLogger("Q");

@inject(Loader, AuthService, Notification, I18N)
export class SchemaEditorFiles {
  @bindable
  schema;
  @bindable
  data;
  @bindable
  change;
  @bindable
  required;
  @bindable
  showNotifications;

  options = {
    maxFiles: null,
  };

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
    if (this.schema.hasOwnProperty("Q:options")) {
      this.options = Object.assign(this.options, this.schema["Q:options"]);
    }
  }

  async attached() {
    // if window.Dropzone is not defined, we load it async here using the aurelia loader
    // as we need Dropzone later, we need to await the loading
    if (!window.Dropzone) {
      try {
        window.Dropzone = await this.loader.loadModule("dropzone");
        this.loader.loadModule("dropzone/dist/min/dropzone.min.css!");
      } catch (e) {
        log.error(e);
      }
    }
    if (!window.Dropzone) {
      log.error("window.Dropzone is not defined after loading dropzone");
      return;
    }

    const QServerBaseUrl = await qEnv.QServerBaseUrl;

    let dictDefaultMessageTranslation = this.i18n.tr(
      "dropzone.dictDefaultMessage"
    );
    if (this.options && this.options.maxFiles === 1) {
      dictDefaultMessageTranslation = this.i18n.tr(
        "dropzone.dictDefaultMessageSingleFile"
      );
    }

    const translations = {
      dictDefaultMessage: dictDefaultMessageTranslation,
      dictFallbackMessage: this.i18n.tr("dropzone.dictFallbackMessage"),
      dictFallbackText: this.i18n.tr("dropzone.dictFallbackText"),
      dictFileTooBig: this.i18n.tr("dropzone.dictFileTooBig"),
      dictInvalidFileType: this.i18n.tr("dropzone.dictInvalidFileType"),
      dictResponseError: this.i18n.tr("dropzone.dictResponseError"),
      dictCancelUpload: this.i18n.tr("dropzone.dictCancelUpload"),
      dictCancelUploadConfirmation: this.i18n.tr(
        "dropzone.dictCancelUploadConfirmation"
      ),
      dictRemoveFile: this.i18n.tr("dropzone.dictRemoveFile"),
      dictMaxFilesExceeded: this.i18n.tr("dropzone.dictMaxFilesExceeded"),
    };

    const authorizationToken = [
      this.authService.config.authTokenType,
      this.authService.getAccessToken(),
    ].join(" ");

    this.dropzoneOptions = Object.assign(
      {
        addRemoveLinks: true,
        url: `${QServerBaseUrl}/file`,
        withCredentials: true,
        headers: {
          Authorization: authorizationToken,
        },
        thumbnailWidth: 120, // should keep aspect ratio,
        thumbnailHeight: null,
        thumbnailMethod: "contain",
        renameFile: (file) => {
          return file.fullPath || file.name;
        },
      },
      this.options,
      translations
    );

    this.dropzone = new window.Dropzone(
      this.dropzoneElement,
      this.dropzoneOptions
    );

    this.dropzone.on("success", (file, response) => {
      const newFile = {};
      const fileProperties = Object.assign(file, response);
      for (let prop in this.options.fileProperties) {
        // fileProperties option is a mapping like this
        // {
        //   "url": "imageUrl"
        // }
        // where url is the prop returned in the response and imageUrl is the prop of the data object to hold that value;
        // prop would be url in that example
        let value = fileProperties[prop];
        if (prop === "name") {
          // use the fullPath as the name if available
          value = fileProperties.fullPath || fileProperties.name;
        }
        newFile[this.options.fileProperties[prop]] = value;
      }
      if (this.options.maxFiles && this.options.maxFiles === 1) {
        this.data = newFile;
        this.change();
      } else {
        if (!Array.isArray(this.data)) {
          this.data = [];
        }
        this.data.push(newFile);
        this.change();
      }
    });

    this.dropzone.on("removedfile", (file) => {
      let dataArrayIndex;

      // if the file was never accepted (coming from maxfilesexceeded) we do not have to remove it from our datastructure
      if (!file.accepted) {
        return;
      }

      if (Array.isArray(this.data)) {
        // find the removed one in our data by
        dataArrayIndex = this.data.findIndex((data) => data.url === file.name);
        if (dataArrayIndex > -1) {
          this.data.splice(dataArrayIndex, 1);
          this.change();
        }
      } else {
        this.data = {};
        this.change();
      }
    });

    this.dropzone.on("maxfilesexceeded", (file) => {
      this.dropzone.removeFile(file);
      this.notification.error("notifications.maxNumberOfFilesExceed");
    });

    this.preloadExistingFiles();
  }

  preloadExistingFiles() {
    const files = [];
    if (this.data && this.schema.type === "object") {
      files.push(this.data);
    }
    if (this.data && this.schema.type === "array" && this.data.length > 0) {
      files.push(...this.data);
    }
    // preload images already uploaded
    files.forEach((file, index) => {
      if (file && file.url) {
        const mockFile = {
          name: file.url,
          size: file.size || 0,
          accepted: true,
        };

        this.dropzone.files.push(mockFile);
        this.dropzone.emit("addedfile", mockFile);
        if (file.type && file.type.includes("image/")) {
          mockFile.dataURL = file.url; // needed for dropzone to create the thumbnail in a canvas
          this.dropzone.createThumbnailFromUrl(
            mockFile,
            this.dropzoneOptions.thumbnailWidth,
            this.dropzoneOptions.thumbnailHeight,
            this.dropzoneOptions.thumbnailMethod,
            false,
            (thumbnail) => {
              this.dropzone.emit("thumbnail", mockFile, thumbnail);
              this.dropzone.emit("complete", mockFile);
              this.dropzone.emit("accepted", mockFile);
              this.dropzone._updateMaxFilesReachedClass();
            },
            "anonymous"
          );
        } else {
          this.dropzone.emit("complete", mockFile);
          this.dropzone.emit("accepted", mockFile);
          this.dropzone._updateMaxFilesReachedClass();
        }
      }
    });
  }
}
