import qEnv from 'resources/qEnv.js'

export default class QConfig {

  constructor() {
    this.configLoaded = 
      qEnv.QServerBaseUrl
        .then(QServerBaseUrl => { 
          return fetch(`${QServerBaseUrl}/editor/config`) 
        })
        .then(response => {
          if (response.ok) {
            return response.json();
          } else {
            throw(response);
          }
        })
        .then(config => {
          this.config = config;
        })
        .catch((e) => {
          this.config = null;
        })
  }

  get(key) {
    return this.configLoaded
      .then(() => {
        return this.config[key];
      })
  }
}
