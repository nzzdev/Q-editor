import qEnv from 'resources/qEnv.js';

export default class User {

  constructor() {
    this.isLoggedIn = false;    
    this.loaded = this.load();
  }

  load() {
    return qEnv.QServerBaseUrl
      .then(QServerBaseUrl => {
        return fetch(`${QServerBaseUrl}/user`, {
          credentials: 'include'
        })
      })
      .then(response => {
        if (response.ok) {
          return response.json()
        }
        return null;
      })
      .then(data => {
        this.data = data;
      })
      .catch(err => {
        this.data = null;
      })
      .then(() => {
        this.setLoggedInState();
      })
  }

  setLoggedInState() {
    this.isLoggedIn = this.data && this.data.username;
  }

  setUserConfig(key, value) {
    this.data.config[key] = value;
    this.save();
  }

  getUserConfig(key) {
    if (!this.data || !this.data.hasOwnProperty('config')) {
      return null;
    }
    return this.data.config[key];
  }

  get roles() {
    if (!this.data || !this.data.hasOwnProperty('roles')) {
      return null;
    }
    return this.data.config.roles;
  }

  save() {
    return qEnv.QServerBaseUrl
      .then(QServerBaseUrl => {
        return fetch(`${QServerBaseUrl}/user`, {
          credentials: 'include',
          method: 'PUT',
          body: JSON.stringify(this.data)
        })
      })
      .then(response => {
        if (!response.ok) {
          return false;
        }
        return true;
      })
  }

}
