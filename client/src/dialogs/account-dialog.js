import { inject } from 'aurelia-framework';
import { Container } from 'aurelia-dependency-injection';
import { DialogController } from 'aurelia-dialog';
import { Router } from 'aurelia-router';

import { I18N } from 'aurelia-i18n';

import QConfig from 'resources/QConfig.js';
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

    this.loadData();
  }

  async loadData() {
    let departments = await this.qConfig.get('departments');
    this.departments = departments.sort();
    this.publications = await this.qConfig.get('publications');
  }

  async activate(config) {
    this.config = config;
    await this.user.loaded;
    if (!this.user.isLoggedIn) {
      this.router.navigateToRoute('login');
    }
  }

  async logout() {
    this.controller.cancel();
    await this.auth.logout();
    this.router.navigateToRoute('index', { replace: true });
  }

  async saveUser() {
    this.userFormErrors = [];
    this.userFormMessage = null;
    try {
      const saved = await this.user.save();
      if (!saved) {
        throw saved;
      }
      this.userFormMessage = this.i18n.tr('general.changesSaved');
    } catch (e) {
      this.userFormErrors.push(this.i18n.tr('general.failedToSaveChanges'));
    }
  }

}
