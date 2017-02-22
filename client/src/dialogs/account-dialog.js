import { inject } from 'aurelia-framework';
import { Container } from 'aurelia-dependency-injection';
import { DialogController } from 'aurelia-dialog';
import { Router } from 'aurelia-router';

import { I18N } from 'aurelia-i18n';

import QConfig from 'resources/QConfig.js'
import User from 'resources/User.js';
import Auth from 'resources/Auth.js';

@inject(DialogController, Container, Router, I18N, User, Auth, QConfig)
export class AccountDialog {

  constructor(controller, diContainer, router, i18n, user, auth, qConfig) {
    this.controller = controller;
    this.diContainer = diContainer;
    this.router = router;
    this.i18n = i18n;
    this.user = user;
    this.auth = auth;
    this.qConfig = qConfig;

    controller.settings.lock = false;
    controller.settings.centerHorizontalOnly = true;

    this.qConfig.get('departments')
      .then(departments => {
        this.departments = departments.sort();
      })
  }

  activate(config) {
    this.config = config;
    this.user.loaded.then(() => {
      if (!this.user.isLoggedIn) {
        this.router.navigateToRoute('login');
      }
    })
  }

  logout() {
    this.controller.cancel();
    this.auth.logout()
      .then(() => {
        this.router.navigateToRoute('index', { replace: true });
      })
  }

  saveUser() {
    this.userFormErrors = [];
    this.userFormMessage = null;
    this.user.save()
      .then(saved => {
        if (saved) {
          this.userFormMessage = this.i18n.tr('general.changesSaved');
        } else {
          this.userFormErrors.push(this.i18n.tr('general.failedToSaveChanges'));
        }
      })
  }

}
