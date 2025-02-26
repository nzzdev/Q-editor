import { inject } from 'aurelia-framework';
import { DialogController } from 'aurelia-dialog';
import QConfig from 'resources/QConfig.js';
import Cookie from '../resources/Cookie';

@inject(DialogController, QConfig, Cookie)
export class LegacyDialog {
  faqSections = [];

  constructor(controller, qConfig, cookie) {
    this.cookie = cookie;
    this.qConfig = qConfig;
    this.controller = controller;
  }

  async activate(config) {
    this.config = config;
  }

  async closeDialog() {
    this.cookie.setCookie(true, 12); // set cookie to expire in 24 hours
    this.controller.cancel();
  }
}
