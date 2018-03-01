import { inject } from "aurelia-framework";
import { DialogController } from "aurelia-dialog";
import { I18N } from "aurelia-i18n";

@inject(DialogController, I18N)
export class ConfirmDialog {
  constructor(controller, i18n) {
    this.controller = controller;
    this.i18n = i18n;
  }

  activate(config) {
    this.config = config;

    if (!this.config.proceedText) {
      this.config.proceedText = this.i18n.tr("general.yes");
    }

    if (!this.config.cancelText) {
      this.config.cancelText = this.i18n.tr("general.no");
    }
  }
}
