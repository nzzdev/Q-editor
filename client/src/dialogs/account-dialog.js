import { inject } from "aurelia-framework";
import { Container } from "aurelia-dependency-injection";
import { DialogController } from "aurelia-dialog";
import { Router } from "aurelia-router";

import { I18N } from "aurelia-i18n";

import QConfig from "resources/QConfig.js";
import User from "resources/User.js";
import Auth from "resources/Auth.js";
import ToolsInfo from "resources/ToolsInfo.js";

@inject(
  DialogController,
  Container,
  Router,
  I18N,
  User,
  Auth,
  QConfig,
  ToolsInfo
)
export class AccountDialog {
  toolSelectionTypes = [
    {
      value: "byUsage",
      label_i18n_key: "userConfig.toolSelectionType.byUsage"
    },
    {
      value: "byConfig",
      label_i18n_key: "userConfig.toolSelectionType.byConfig"
    }
  ];

  constructor(
    controller,
    diContainer,
    router,
    i18n,
    user,
    auth,
    qConfig,
    toolsInfo
  ) {
    this.controller = controller;
    this.diContainer = diContainer;
    this.router = router;
    this.i18n = i18n;
    this.user = user;
    this.auth = auth;
    this.qConfig = qConfig;
    this.toolsInfo = toolsInfo;

    this.loadData();
  }

  async loadData() {
    let departments = await this.qConfig.get("departments");
    this.departments = departments.sort();
    this.publications = await this.qConfig.get("publications");
  }

  async activate(config) {
    this.config = config;
    await this.user.loaded;
    if (!this.user.isLoggedIn) {
      this.router.navigateToRoute("login");
    }

    await this.loadToolSelectionConfig();
  }

  async loadToolSelectionConfig() {
    // load the tools in users order
    try {
      this.tools = await this.toolsInfo.getToolsOrderedForUser();
    } catch (e) {
      this.tools = await this.toolsInfo.getAvailableTools();
    }

    this.toolSelectionConfig = this.user.getUserConfig("toolSelection", {
      type: "byUsage",
      tools: {}
    });
    // check if the user has any tools selected for the initial tool selection ...
    let hasAnyToolSelectedForInitialToolSelection = false;
    for (const toolName in this.toolSelectionConfig.tools) {
      if (
        this.toolSelectionConfig.tools[toolName].inInitialToolSelection === true
      ) {
        hasAnyToolSelectedForInitialToolSelection = true;
        break;
      }
    }
    // .. if not we set the default to the first 4 most used ones
    if (!hasAnyToolSelectedForInitialToolSelection) {
      for (let i = 0; i < 4; i++) {
        if (
          !this.toolSelectionConfig.tools.hasOwnProperty(this.tools[i].name)
        ) {
          this.toolSelectionConfig.tools[this.tools[i].name] = {};
        }
        this.toolSelectionConfig.tools[
          this.tools[i].name
        ].inInitialToolSelection = true;
      }
    }
  }

  async logout() {
    this.controller.cancel();
    await this.auth.logout();
    this.router.navigateToRoute("index", { replace: true });
  }

  async saveUser() {
    this.userFormErrors = [];
    this.userFormMessage = null;
    try {
      const saved = await this.user.save();
      if (!saved) {
        throw saved;
      }
      this.userChanged = true;
      this.userFormMessage = this.i18n.tr("general.changesSaved");
    } catch (e) {
      this.userFormErrors.push(this.i18n.tr("general.failedToSaveChanges"));
    }
  }
}
