import { inject } from 'aurelia-framework';
import { Container } from 'aurelia-dependency-injection';
import { DialogController } from 'aurelia-dialog';
import { DialogService } from 'aurelia-dialog';

@inject(DialogController, Container, DialogService)
export class ConfirmDialog {

  constructor(controller, diContainer, dialogService) {
    this.controller = controller;

    this.diContainer = diContainer;

    this.dialogService = dialogService;

    controller.settings.lock = false;
    controller.settings.centerHorizontalOnly = true;
  }

  activate(config) {
    this.config = config;
  }
}
