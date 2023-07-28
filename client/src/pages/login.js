import { inject } from "aurelia-framework";
import { Router } from "aurelia-router";

import { I18N } from "aurelia-i18n";

import { LogManager } from "aurelia-framework";
const log = LogManager.getLogger("Q");

import Auth from "resources/Auth.js";
import User from "resources/User.js";
import QConfig from "resources/QConfig.js";
import qEnv from "resources/qEnv.js";

@inject(Auth, User, QConfig, I18N, Router)
export class Login {
  username;
  password;
  authData;
  authConfig;

  constructor(auth, user, qConfig, i18n, router) {
    this.auth = auth;
    this.user = user;
    this.i18n = i18n;
    this.router = router;
    this.qConfig = qConfig;
    this.loadData();
    this.errorDetails = null;
  }

  async loadData() {
    this.authConfig = await this.qConfig.get("auth");
  }

  async canActivate() {
    await this.user.loaded;
    if (this.user.isLoggedIn) {
      this.router.navigateToRoute("index");
    } else {
      return true;
    }
  }

  async activate(routeParams) {
    // Clear error param if not coming from Azure
    if (
      document.referrer !== "https://login.microsoftonline.com/" &&
      routeParams.error &&
      routeParams.error === "403"
    ) {
      this.router.navigateToRoute("login");
    }

    this.loginMessage = await qEnv.loginMessage;
    this.handleAzureError(routeParams);
  }

  attached() {
    if (this.usernameInput) {
      this.usernameInput.focus();
    }
  }

  async tryAzureLogin() {
    this.tryLogin(true);
  }

  handleLoginSuccess(event) {
    // Ensure the message is coming from the editor to avoid potential security risks
    if (event.origin !== window.location.origin) {
      return;
    }

    if (event.data === "loginSuccess") {
      // Remove the event listener before navigating to the new route
      window.removeEventListener("message", this.handleLoginSuccess);

      // Perform the necessary actions for successful login
      this.router.navigateToRoute("index");
    }
  }

  createLoginSuccessListener() {
    this.loginSuccessListener = this.handleLoginSuccess.bind(this);
    return window.addEventListener("message", this.loginSuccessListener);
  }

  async tryLogin(isAzure) {
    this.loginError = null;
    this.loginTechnicalHelp = null;
    this.loginContactUsOnSlack = null;
    try {
      if (isAzure) {
        const QServerBaseUrl = await qEnv.QServerBaseUrl;
        const azureLoginUrl = (await QServerBaseUrl) + "/auth/azure";

        // Open popup-login if in iframe
        if (window !== window.parent) {
          this.createLoginSuccessListener();
          const stateUrlArg = "?origin=iframeLoginPopup";
          window.open(azureLoginUrl + stateUrlArg, "_blank");
        } else {
          window.open(azureLoginUrl, "_self");
        }
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
        this.loginTechnicalHelp = this.i18n.tr("general.loginTechnicalIssues");
        this.loginContactUsOnSlack = this.i18n.tr(
          "general.loginContactUsOnSlack"
        );
      }
    }
  }

  handleAzureError(routeParams) {
    this.loginError = null;
    this.loginTechnicalHelp = null;
    this.loginContactUsOnSlack = null;
    if (
      document.referrer === "https://login.microsoftonline.com/" &&
      routeParams.error &&
      routeParams.error === "403"
    ) {
      this.loginError = this.i18n.tr("general.loginFailedGeneric");
      this.loginTechnicalHelp = this.i18n.tr("general.loginTechnicalIssues");
      this.loginContactUsOnSlack = this.i18n.tr(
        "general.loginContactUsOnSlack"
      );
    }
  }
}
