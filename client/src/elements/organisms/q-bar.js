import { bindable, inject } from "aurelia-framework";
import { DialogService } from "aurelia-dialog";
import { Router } from "aurelia-router";
import { HelpDialog } from "dialogs/help-dialog";

import User from "resources/User.js";
import Auth from "resources/Auth.js";

@inject(Element, User, Auth, Router, DialogService)
export class QBar {
  @bindable router;
  @bindable size;

  constructor(element, user, auth, router, dialogService) {
    this.element = element;
    this.user = user;
    this.auth = auth;
    this.router = router;
    this.dialogService = dialogService;
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
