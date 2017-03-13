import { inject } from 'aurelia-framework';
import { DialogController } from 'aurelia-dialog';
import { DialogService } from 'aurelia-dialog';

@inject(DialogController, DialogService)
export class ItemDialog {

  constructor(controller, dialogService) {
    this.controller = controller;

    this.dialogService = dialogService;

    controller.settings.lock = false;
    controller.settings.centerHorizontalOnly = true;
  }

  async activate(config) {
    this.config = config;
    this.item = config.item;
  }

  activateItem() {
    this.item.activate();
  }

  deactivateItem() {
    this.item.deactivate();
  }
}
