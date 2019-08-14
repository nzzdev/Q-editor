import { inject } from "aurelia-framework";
import { DialogController } from "aurelia-dialog";
import QConfig from "resources/QConfig.js";

@inject(DialogController, QConfig)
export class ExportDialog {
  faqSections = [];

  constructor(controller, qConfig) {
    this.qConfig = qConfig;
    this.controller = controller;
  }

  activate(config) {
    this.config = config;

    this.schema = {
      $schema: "http://json-schema.org/draft-04/schema#",
      type: "object",
      title: "Exportoptionen",
      properties: {
        columns: {
          title: "Anzahl Spalten",
          type: "number",
          enum: [1, 2, 3, 4, 5, 6],
          "Q:options": {
            selectType: "radio"
          }
        },
        titleStyle: {
          title: "Titelstil",
          type: "string",
          enum: ["normaler Titel", "Zwischentitel", "Titel ausblenden"], // normaler titel with kopflinie, andere ohne
          "Q:options": {
            selectType: "radio"
          }
        },
        printTitel: {
          title: "alternativen Titel erfassen",
          type: "string"
        }
      }
    };

    if (!this.config.proceedText) {
      this.config.proceedText = this.i18n.tr("general.yes");
    }

    if (!this.config.cancelText) {
      this.config.cancelText = this.i18n.tr("general.no");
    }
  }

  handleChange() {}
}
