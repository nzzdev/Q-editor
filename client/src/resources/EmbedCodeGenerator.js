import { inject } from 'aurelia-framework'
import QConfig from 'resources/QConfig.js'

@inject(QConfig)
export default class EmbedCodeGenerator {

  embedCodes = {}

  constructor(qConfig) {
    this.qConfig = qConfig;
  }

  async getEmbedCodeForItem(item) {
    const browserLoaderUrl = await this.qConfig.get('browserLoaderUrl');
    if (!browserLoaderUrl) {
      return null;
    }
    const embedCode = `<div class="q-item" id="q-${item.id}"></div><script src="${browserLoaderUrl}"></script>`;
    return embedCode;
  }

}
