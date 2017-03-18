import { inject } from 'aurelia-framework';
import qEnv from 'resources/qEnv.js';
import User from 'resources/User.js';

@inject(User)
export default class Auth {

  loginError = null;

  loginCallbacks = [];

  constructor(user) {
    this.user = user;
  }

  async login(username, password) {
    const QServerBaseUrl = await qEnv.QServerBaseUrl;
    const response = await fetch(`${QServerBaseUrl}/authenticate`, {
      credentials: 'include',
      method: 'POST',
      body: JSON.stringify({
        username: username,
        password: password
      })
    });

    if (!response.ok) {
      throw response;
    }

    return this.user.load();
  }

  async logout() {
    try {
      const QServerBaseUrl = await qEnv.QServerBaseUrl;
      const response = await fetch(`${QServerBaseUrl}/logout`, {
        credentials: 'include',
        method: 'POST'
      });

      if (!response.ok) {
        throw response;
      }
    } finally {
      return this.user.load();
    }
  }

}
