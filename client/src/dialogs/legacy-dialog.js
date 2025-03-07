import { inject } from "aurelia-framework";
import { DialogController } from "aurelia-dialog";
import QConfig from "resources/QConfig.js";
import Cookie from "../resources/Cookie";

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
    // Add a small delay to ensure dialog is fully rendered
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  async closeDialog() {
    try {
      await this.cookie.setCookie("shown", 12); // Be explicit about the value we're setting
      this.controller.cancel();
    } catch (error) {
      console.error("Failed to set cookie:", error);
    }
  }
}
