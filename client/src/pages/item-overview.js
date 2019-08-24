import { inject } from "aurelia-framework";
import { Notification } from "aurelia-notification";
import { HttpClient } from "aurelia-fetch-client";
import { Router } from "aurelia-router";
import { DialogService } from "aurelia-dialog";

import { ExportDialog } from "dialogs/export-dialog.js";

import ItemStore from "resources/ItemStore.js";
import ToolsInfo from "resources/ToolsInfo.js";
import qEnv from "resources/qEnv.js";
import ItemActionController from "resources/ItemActionController";
import QConfig from "resources/QConfig.js";
import User from "resources/User.js";
import QTargets from "resources/QTargets.js";
import CurrentItemProvider from "resources/CurrentItemProvider.js";

@inject(
  Notification,
  HttpClient,
  Router,
  ItemStore,
  ToolsInfo,
  ItemActionController,
  QConfig,
  User,
  DialogService,
  QTargets,
  CurrentItemProvider
)
export class ItemOverview {
  currentTarget;

  constructor(
    notification,
    httpClient,
    router,
    itemStore,
    toolsInfo,
    itemActionController,
    qConfig,
    user,
    dialogService,
    qTargets,
    currentItemProvider
  ) {
    this.notification = notification;
    this.httpClient = httpClient;
    this.router = router;
    this.itemStore = itemStore;
    this.toolsInfo = toolsInfo;
    this.itemActionController = itemActionController;
    this.qConfig = qConfig;
    this.user = user;
    this.dialogService = dialogService;
    this.qTargets = qTargets;
    this.currentItemProvider = currentItemProvider;
  }

  async attached() {
    this.currentItemProvider.setCurrentItem(this.item);
    this.isToolAvailable = await this.toolsInfo.isToolWithNameAvailable(
      this.item.conf.tool
    );
    if (await this.qConfig.get("metaInformation")) {
      this.loadMetaInformation();
    }
    this.userExportableTargets = await this.qTargets.getUserExportable();
  }

  async activate(routeParams) {
    try {
      this.itemId = routeParams.id;
      this.item = await this.itemStore.getItem(routeParams.id);
    } catch (e) {
      this.notification.error("notification.failedToLoadItem");
    }
  }

  async deleteItem() {
    try {
      await this.itemActionController.delete(this.item);
      this.router.navigate("index");
    } catch (e) {
      console.log(e);
    }
  }

  async loadMetaInformation() {
    let QServerBaseUrl = await qEnv.QServerBaseUrl;
    const metaInformationConfig = await this.qConfig.get("metaInformation");
    let requestUrl;
    if (
      metaInformationConfig.hasOwnProperty("articlesWithItem") &&
      metaInformationConfig.articlesWithItem.hasOwnProperty("endpoint")
    ) {
      const endpoint = metaInformationConfig.articlesWithItem.endpoint;
      if (endpoint.hasOwnProperty("path")) {
        requestUrl = `${QServerBaseUrl}/${endpoint.path}`.replace(
          "{id}",
          this.item.id
        );
      }
      const response = await this.httpClient.fetch(requestUrl);
      if (!response.ok || response.status >= 400) {
        return;
      }
      this.articlesWithItem = await response.json();
    }
  }

  async exportWithModal(target) {
    const openDialogResult = await this.dialogService.open({
      viewModel: ExportDialog,
      model: {
        item: this.item,
        target: target,
        proceedText: "herunterladen",
        cancelText: "abbrechen"
      }
    });
    const closeResult = await openDialogResult.closeResult;

    if (closeResult.wasCancelled) {
      return false;
    }
  }
}
