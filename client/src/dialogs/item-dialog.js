import { inject } from 'aurelia-framework';
import { DialogController } from 'aurelia-dialog';
import { DialogService } from 'aurelia-dialog';
import EmbedCodeGenerator from 'resources/EmbedCodeGenerator.js';

@inject(DialogController, DialogService, EmbedCodeGenerator)
export class ItemDialog {

  constructor(controller, dialogService, embedCodeGenerator) {
    this.controller = controller;

    this.dialogService = dialogService;
    this.embedCodeGenerator = embedCodeGenerator;

    controller.settings.lock = false;
    controller.settings.centerHorizontalOnly = true;
  }

  async activate(config) {
    this.config = config;
    this.item = config.item;

    try {
      this.embedCode = await this.embedCodeGenerator.getEmbedCodeForItem(this.item);
    } catch (e) {
      console.log(e);
    }
  }

  activateItem() {
    this.item.activate();
  }

  deactivateItem() {
    this.item.deactivate();
  }
}
