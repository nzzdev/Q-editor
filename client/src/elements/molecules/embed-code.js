import { bindable, inject } from 'aurelia-framework';
import QConfig from 'resources/QConfig.js';
import EmbedCodeGenerator from 'resources/EmbedCodeGenerator.js';

@inject(QConfig, EmbedCodeGenerator)
export class EmbedCode {

  @bindable item
  @bindable target

  constructor(qConfig, embedCodeGenerator) {
    this.qConfig = qConfig;
    this.embedCodeGenerator = embedCodeGenerator;
  }

  async targetChanged() {
    if (!this.target) {
      this.embedCode = null;
      return;
    }
    this.embedCode = await this.embedCodeGenerator.getEmbedCodeForItem(this.item, this.target);
  }

}
