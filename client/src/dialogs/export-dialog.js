import { inject, LogManager, TaskQueue, Loader } from "aurelia-framework";
import { DialogController } from "aurelia-dialog";
import QConfig from "resources/QConfig.js";
import qEnv from "resources/qEnv.js";
const log = LogManager.getLogger("Q");

import { saveAs } from "file-saver";

import AvailabilityChecker from "resources/checkers/AvailabilityChecker.js";
import ToolEndpointChecker from "resources/checkers/ToolEndpointChecker.js";
import ObjectFromSchemaGenerator from "resources/ObjectFromSchemaGenerator.js";

@inject(
  DialogController,
  TaskQueue,
  Loader,
  QConfig,
  AvailabilityChecker,
  ToolEndpointChecker,
  ObjectFromSchemaGenerator
)
export class ExportDialog {
  constructor(
    controller,
    taskQueue,
    loader,
    qConfig,
    availabilityChecker,
    toolEndpointChecker,
    objectFromSchemaGenerator
  ) {
    this.controller = controller;
    this.taskQueue = taskQueue;
    this.loader = loader;
    this.qConfig = qConfig;
    this.availabilityChecker = availabilityChecker;
    this.toolEndpointChecker = toolEndpointChecker;
    this.objectFromSchemaGenerator = objectFromSchemaGenerator;
    this.abortFetchRenderingInfoController = new AbortController();
  }

  async activate(config) {
    this.config = config;

    const QServerBaseUrl = await qEnv.QServerBaseUrl;

    const response = await fetch(
      `${QServerBaseUrl}/display-options-schema/${this.config.item.id}/${this.config.target.key}.json`
    );
    if (!response.ok || !(response.status >= 200 && response.status < 400)) {
      log.error("failed to load displayOptionsSchema");
      return;
    }
    this.schema = await response.json();
    this.displayOptions = this.objectFromSchemaGenerator.generateFromSchema(
      this.schema
    );

    if (!this.config.proceedText) {
      this.config.proceedText = this.i18n.tr("general.yes");
    }

    if (!this.config.cancelText) {
      this.config.cancelText = this.i18n.tr("general.no");
    }
    this.handleChange();

    this.mimeDb = await this.loader.loadModule("mime-db");
    this.slugify = await this.loader.loadModule("slugify");
  }

  handleChange() {
    this.abortFetchRenderingInfoController.abort();
    this.abortFetchRenderingInfoController = new AbortController();

    this.taskQueue.queueMicroTask(() => {
      // whenever we have a change in data, we need to reevaluate all the checks...
      this.availabilityChecker.triggerReevaluation();
      this.toolEndpointChecker.triggerReevaluation();
      // ... and update the preview
      this.renderingInfo = null;
      this.previewLoadingStatus = "loading";
      this.fetchRenderingInfo({
        forPreview: true,
        signal: this.abortFetchRenderingInfoController.signal,
      }).then((renderingInfo) => {
        this.previewLoadingStatus = "loaded";
        this.renderingInfo = renderingInfo;
      });
    });
  }

  fetchRenderingInfo({ forPreview, signal }) {
    const toolRuntimeConfig = {
      isPure: true,
      displayOptions: this.displayOptions,
    };

    const target = forPreview
      ? this.config.target.userExportable.preview.target
      : this.config.target.key;

    return qEnv.QServerBaseUrl.then((QServerBaseUrl) => {
      if (this.config.item.id) {
        return fetch(
          `${QServerBaseUrl}/rendering-info/${
            this.config.item.id
          }/${target}?ignoreInactive=true&noCache=true&toolRuntimeConfig=${encodeURIComponent(
            JSON.stringify(toolRuntimeConfig)
          )}`,
          { signal }
        );
      }
    })
      .then((res) => {
        if (res.ok && res.status >= 200 && res.status < 400) {
          if (res.headers.get("content-type").startsWith("application/json")) {
            return res.json();
          }
          // if we do not have application/json here, we return the result as a blob (it's probably an image)
          return res.blob();
        }
        throw res;
      })
      .then((renderingInfo) => {
        return renderingInfo;
      });
  }

  async export() {
    try {
      this.isExportLoading = true;
      const exportRenderingInfo = await this.fetchRenderingInfo({
        forPreview: false,
      });
      let extension = "";
      const mimeInfo = this.mimeDb[exportRenderingInfo.type];
      if (Array.isArray(mimeInfo.extensions) && mimeInfo.extensions[0]) {
        extension = `.${mimeInfo.extensions[0]}`;
      }

      let filename = `${this.slugify(this.config.item.conf.title)}-${
        this.config.item.id
      }`;

      if (
        this.config.target.userExportable.download &&
        this.config.target.userExportable.download.file &&
        Number.isInteger(
          this.config.target.userExportable.download.file.nameMaxLength
        )
      ) {
        filename = filename.substr(
          0,
          this.config.target.userExportable.download.file.nameMaxLength
        );
      }

      saveAs(exportRenderingInfo, `${filename}${extension}`);
      this.isExportLoading = false;
    } catch (e) {
      log.error("failed to load renderingInfo for export", e);
    }
  }
}
