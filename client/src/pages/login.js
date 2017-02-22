import { inject } from 'aurelia-framework';
import { Router } from 'aurelia-router';

import { I18N } from 'aurelia-i18n';

import Auth from 'resources/Auth.js';
import User from 'resources/User.js';

@inject(Auth, User, I18N, Router)
export class Login {

  username;
  password;
  authData;

  constructor(auth, user, i18n, router) {
    this.auth = auth;
    this.user = user;
    this.i18n = i18n;
    this.router = router;
    this.isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
  }

  canActivate() {
    this.user.loaded
      .then(() => {
        if (this.user.isLoggedIn) {
          this.router.navigateToRoute('index');
        } else {
          return true;
        }
      })
  }

  tryLogin() {
    this.auth.login(this.username, this.password)
      .then(() => {
        this.router.navigateToRoute('index');
      })
      .catch(err => {
        this.loginError = this.i18n.tr('general.loginFailed');
      })
  }

}
