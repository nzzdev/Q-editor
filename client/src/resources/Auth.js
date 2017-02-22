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

  login(username, password) {
    return qEnv.QServerBaseUrl
      .then(QServerBaseUrl => {
        return fetch(`${QServerBaseUrl}/authenticate`, {
          credentials: 'include',
          method: 'POST',
          body: JSON.stringify({
            username: username,
            password: password
          })
        })
      })
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw response;
        }
      })
      .then(() => {
        return this.user.load();
      })
  }

  logout() {
    return qEnv.QServerBaseUrl
      .then(QServerBaseUrl => {
        return fetch(`${QServerBaseUrl}/logout`, {
          credentials: 'include',
          method: 'POST'
        })
      })
      .then(response => {
        if (response.ok) {
          return true;
        } else {
          throw response;
        }
      })
      .then(() => {
        return this.user.load();
      })
      .catch(err => {
        return this.user.load();
      })
  }

}
