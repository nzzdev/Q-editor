import { inject, LogManager, TaskQueue } from "aurelia-framework";
import { DialogController } from "aurelia-dialog";
import QConfig from "resources/QConfig.js";
import qEnv from "resources/qEnv.js";
const log = LogManager.getLogger("Q");

import { saveAs } from "file-saver";

import AvailabilityChecker from "resources/checkers/AvailabilityChecker.js";
import ToolEndpointChecker from "resources/checkers/ToolEndpointChecker.js";

@inject(
  DialogController,
  TaskQueue,
  QConfig,
  AvailabilityChecker,
  ToolEndpointChecker
)
export class ExportDialog {
  constructor(
    controller,
    taskQueue,
    qConfig,
    availabilityChecker,
    toolEndpointChecker
  ) {
    this.controller = controller;
    this.taskQueue = taskQueue;
    this.qConfig = qConfig;
    this.availabilityChecker = availabilityChecker;
    this.toolEndpointChecker = toolEndpointChecker;
  }

  async activate(config) {
    this.config = config;

    const QServerBaseUrl = await qEnv.QServerBaseUrl;

    const response = await fetch(
      `${QServerBaseUrl}/export-options-schema/${this.config.item.id}/${
        this.config.target.key
      }.json`
    );
    if (!response.ok || !(response.status >= 200 && response.status < 400)) {
      log.error("failed to load exportOptionsSchema");
      return;
    }
    this.schema = await response.json();

    if (!this.config.proceedText) {
      this.config.proceedText = this.i18n.tr("general.yes");
    }

    if (!this.config.cancelText) {
      this.config.cancelText = this.i18n.tr("general.no");
    }
    this.fetchRenderingInfo({ forPrewiew: true }).then(
      renderingInfo => (this.renderingInfo = renderingInfo)
    );
  }

  handleChange() {
    this.taskQueue.queueMicroTask(() => {
      // whenever we have a change in data, we need to reevaluate all the checks...
      this.availabilityChecker.triggerReevaluation();
      this.toolEndpointChecker.triggerReevaluation();
      // ... and update the preview
      // this.previewData = JSON.parse(JSON.stringify(this.item.conf));
      this.fetchRenderingInfo({ forPreview: true }).then(
        renderingInfo => (this.renderingInfo = renderingInfo)
      );
    });
  }

  fetchRenderingInfo({ forPreview }) {
    const toolRuntimeConfig = {
      size: {
        width: [
          {
            value: 500,
            comparison: "="
          }
        ]
      },
      isPure: true,
      exportOptions: this.exportOptions
    };

    const target = forPreview
      ? this.config.target.userExportable.preview.target
      : this.config.target.key;

    return qEnv.QServerBaseUrl.then(QServerBaseUrl => {
      if (this.config.item.id) {
        return fetch(
          `${QServerBaseUrl}/rendering-info/${
            this.config.item.id
          }/${target}?ignoreInactive=true&noCache=true&toolRuntimeConfig=${encodeURI(
            JSON.stringify(toolRuntimeConfig)
          )}`
        );
      }
    })
      .then(res => {
        if (res.ok && res.status >= 200 && res.status < 400) {
          if (res.headers.get("content-type") === "application/json") {
            return res.json();
          } else {
            return res.blob();
          }
        }
        throw res;
      })
      .then(renderingInfo => {
        return renderingInfo;
      });
  }

  async export() {
    try {
      const exportRenderingInfo = await this.fetchRenderingInfo({
        forPreview: false
      });
      saveAs(exportRenderingInfo, `${this.config.item.id}-print.pdf`);

      this.controller.ok();
    } catch (e) {
      console.error("failed to load renderingInfo for export");
    }
  }
}
