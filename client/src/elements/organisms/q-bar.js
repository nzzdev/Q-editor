import { bindable, inject } from "aurelia-framework";
import { DialogService } from "aurelia-dialog";
import { Router } from "aurelia-router";
import { HelpDialog } from "dialogs/help-dialog";
import { LegacyDialog } from "dialogs/legacy-dialog"; // Corrected import

import User from "resources/User.js";
import Auth from "resources/Auth.js";
import Cookie from "../../resources/Cookie";

@inject(Element, User, Auth, Router, DialogService, Cookie)
export class QBar {
  @bindable router;
  @bindable size;

  constructor(element, user, auth, router, dialogService, cookie) {
    this.element = element;
    this.user = user;
    this.auth = auth;
    this.router = router;
    this.dialogService = dialogService;
    this.cookie = cookie;
    this.openLegacyDialog();
  }

  async openLegacyDialog() {
    const legacyCookie = await this.cookie.getCookie();
    if(!legacyCookie) {
      this.dialogService.open({
        viewModel: LegacyDialog,
        model: {}
      });
    }
  }

  sizeChanged(newValue, oldValue) {
    this.element.classList.remove(oldValue);
    this.element.classList.add(newValue);
  }

  showHelp() {
    this.dialogService.open({
      viewModel: HelpDialog,
      model: {}
    });
  }
}
