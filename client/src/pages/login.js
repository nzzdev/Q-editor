import { inject } from "aurelia-framework";
import { Router } from "aurelia-router";

import { I18N } from "aurelia-i18n";

import { LogManager } from "aurelia-framework";
const log = LogManager.getLogger("Q");

import Auth from "resources/Auth.js";
import User from "resources/User.js";
import qEnv from "resources/qEnv.js";

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

    // Listen to the storage event to capture headers sent during the redirect
    window.addEventListener("storage", this.handleStorageEvent.bind(this));
  }

  async canActivate() {
    await this.user.loaded;
    if (this.user.isLoggedIn) {
      this.router.navigateToRoute("index");
    } else {
      return true;
    }
  }

  async activate() {
    this.loginMessage = await qEnv.loginMessage;
  }

  attached() {
    this.usernameInput.focus();
  }

  async tryAzureLogin() {
    this.tryLogin(true);
  }

  async tryLogin(isAzure) {
    this.loginError = null;
    try {
      if (isAzure) {
        const QServerBaseUrl = await qEnv.QServerBaseUrl;
        const azureLoginUrl = (await QServerBaseUrl) + "/auth/azure";
        window.open(azureLoginUrl, "_self");
      } else {
        await this.auth.login(this.username, this.password);
        this.router.navigateToRoute("index");
      }
    } catch (e) {
      log.error(e);
      if (e.status === 401) {
        this.loginError = this.i18n.tr("general.loginFailed");
      } else if (e.status === 504) {
        this.loginError = this.i18n.tr("general.loginTimeout");
      } else {
        this.loginError = this.i18n.tr("general.genericServerError");
      }
    }
  }

  handleStorageEvent(event) {
    console.log("Catched a storage event", event);
    if (event.key === 'X-Error-Code') {
      console.log("Catched an error header", event.key);
      // Retrieve the headers from the storage event
      const headers = JSON.parse(event.newValue);

      // Store the headers for later use
      this.headers = headers;

      // Handle the error or perform any necessary actions
      const errorMessage = this.headers['X-Error-Message'];
      const errorCode = this.headers['X-Error-Code'];

      if (errorMessage && errorCode) {
        console.log(`Error: ${errorMessage}, Code: ${errorCode}`);
        this.loginError = this.i18n.tr("general.loginFailed");
      }
    }
}
