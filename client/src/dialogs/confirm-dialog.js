import { inject } from 'aurelia-framework';
import { DialogController } from 'aurelia-dialog';

@inject(DialogController)
export class ConfirmDialog {

  constructor(controller) {
    this.controller = controller;
  }

  activate(config) {
    this.config = config;
  }
}
