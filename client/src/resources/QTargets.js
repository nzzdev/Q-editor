import qEnv from 'resources/qEnv.js'

export default class QTargets {

  data = {}

  constructor() {
    this.loaded = qEnv.QServerBaseUrl
      .then(QServerBaseUrl => {
        return fetch(`${QServerBaseUrl}/editor/targets`);
      })
      .then(response => {
        if (response.ok && response.status >= 200 && response.status < 400) {
          return response.json();
        } else {
          throw new Error(response.statusText)
        }
      })
      .then(targets => {
        this.data.availableTargets = targets;
      })
      .catch(err => {
        this.messageService.pushMessage('error', 'failedLoadingTargets')
      })
  }

  get(key) {
    return this.loaded
      .then(() => {
        return this.data[key]
      })
  }

}
