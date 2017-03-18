import { inject } from 'aurelia-framework';
import QTargets from 'resources/QTargets.js';

@inject(QTargets)
export default class EmbedCodeGenerator {

  embedCodes = {}

  constructor(qTargets) {
    this.qTargets = qTargets;
  }

  async getEmbedCodeForItem(item, target) {
    const availableTargets = await this.qTargets.get('availableTargets');
    let embedCode = null;

    if (!target) {
      target = availableTargets[0];
    }

    for (let availableTarget of availableTargets) {
      if (availableTarget.key === target.key) {
        if (availableTarget.browserLoaderUrl) {
          embedCode = `<div class="q-item" id="q-${item.id}"></div><script src="${availableTarget.browserLoaderUrl}"></script>`;
        }
        break;
      }
    }
    return embedCode;
  }

}
