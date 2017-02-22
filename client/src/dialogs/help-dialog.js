import { inject } from 'aurelia-framework';
import { Container } from 'aurelia-dependency-injection';
import { DialogController } from 'aurelia-dialog';
import QConfig from 'resources/QConfig.js';

@inject(DialogController, QConfig)
export class HelpDialog {

  faqSections = [];

  constructor(controller, qConfig) {
    this.qConfig = qConfig;

    this.controller = controller;

    this.controller.settings.lock = false;
    this.controller.settings.centerHorizontalOnly = true;
  }

  getOrdererFaq(faq) {
    let newOrderFaq = [];
    let half = Math.ceil(faq.length / 2);
    for (let i = 0; i < half; i++) {
      newOrderFaq.push(faq[i]);
      if (faq[i+half]) {
        newOrderFaq.push(faq[i+half]);
      }
    }
    return newOrderFaq;
  }

  activate(config) {
    this.config = config;

    this.qConfig.get('help')
      .then(helpConfig => {
        this.intro = helpConfig.intro;
        this.faq = helpConfig.faq;
      })
  }

  selectFaqSection(faqSection) {
    this.selectedFaqSection = faqSection;
  }
}
