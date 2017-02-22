import { inject } from 'aurelia-framework'
import QConfig from 'resources/QConfig.js'

@inject(QConfig)
export default class EmbedCodeGenerator {

  embedCodes = {}

  constructor(qConfig) {
    this.qConfig = qConfig;
  }

  getEmbedCodeForItem(item) {
    return this.qConfig.get('browserLoaderUrl')
      .then(browserLoaderUrl => {
        let embedCode = `<div class="q-item" id="q-${item.id}"></div><script src="${browserLoaderUrl}"></script>`;
        return embedCode;
      })
  }

}
