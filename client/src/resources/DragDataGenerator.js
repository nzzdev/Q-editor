import { inject } from 'aurelia-framework';
import EmbedCodeGenerator from 'resources/EmbedCodeGenerator.js';

@inject(EmbedCodeGenerator)
export default class DragDataGenerator {

  dragData = {}

  constructor(embedCodeGenerator) {
    this.embedCodeGenerator = embedCodeGenerator;
  }

  async getDragDataForItem(item, target) {
    if (!this.dragData[item.id]) {
      let embedCode = await this.embedCodeGenerator.getEmbedCodeForItem(item, target);
      this.dragData[item.id] = JSON.stringify({
        origin: window.location.origin,
        id: item.id,
        title: item.conf.title,
        tool: item.conf.tool,
        html: embedCode.replace(/"/g, "'")
      });
    }
    return this.dragData[item.id];
  }

  async addDragDataToDataTransfer(dataTransfer, item, target) {
    let data = await this.getDragDataForItem(item, target);
    dataTransfer.setData('application/nzz.q+json', data);
  }

}
