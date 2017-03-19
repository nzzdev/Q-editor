import qEnv from 'resources/qEnv.js';

export default class User {

  constructor() {
    this.isLoggedIn = false;
    this.loaded = this.load();
  }

  async load() {
    try {
      const QServerBaseUrl = await qEnv.QServerBaseUrl;
      const response = await fetch(`${QServerBaseUrl}/user`, {
        credentials: 'include'
      });

      if (!response.ok) {
        throw response;
      }

      this.data = await response.json();
      return true;
    } catch (e) {
      this.data = null;
    } finally {
      this.setLoggedInState();
      return true;
    }
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
    return this.data.roles;
  }

  async save() {
    try {
      const QServerBaseUrl = await qEnv.QServerBaseUrl;
      const response = await fetch(`${QServerBaseUrl}/user`, {
        credentials: 'include',
        method: 'PUT',
        body: JSON.stringify(this.data)
      });

      if (!response.ok) {
        throw response;
      }
      return true;
    } catch (e) {
      return false;
    }
  }

}
