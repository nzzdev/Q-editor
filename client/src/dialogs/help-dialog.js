import { inject } from "aurelia-framework";
import { DialogController } from "aurelia-dialog";
import QConfig from "resources/QConfig.js";

@inject(DialogController, QConfig)
export class HelpDialog {
  faqSections = [];

  constructor(controller, qConfig) {
    this.qConfig = qConfig;
    this.controller = controller;
  }

  getOrdererFaq(faq) {
    let newOrderFaq = [];
    let half = Math.ceil(faq.length / 2);
    for (let i = 0; i < half; i++) {
      newOrderFaq.push(faq[i]);
      if (faq[i + half]) {
        newOrderFaq.push(faq[i + half]);
      }
    }
    return newOrderFaq;
  }

  async activate(config) {
    this.config = config;
    const helpConfig = await this.qConfig.get("help");
    this.intro = helpConfig.intro;
    this.faq = helpConfig.faq;
  }

  selectFaqSection(faqSection) {
    this.selectedFaqSection = faqSection;
  }
}
