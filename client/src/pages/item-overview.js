import { inject } from "aurelia-framework";
import { Router } from "aurelia-router";
import { DialogService } from "aurelia-dialog";
import { ConfirmDialog } from "dialogs/confirm-dialog.js";
import { RelativeTime } from "aurelia-i18n";
import { I18N } from "aurelia-i18n";
import { Notification } from "aurelia-notification";
import { HttpClient } from "aurelia-fetch-client";

import ItemStore from "resources/ItemStore.js";
import ToolsInfo from "resources/ToolsInfo.js";
import QConfig from "resources/QConfig.js";
import qEnv from "resources/qEnv.js";

@inject(
  Router,
  RelativeTime,
  I18N,
  Notification,
  HttpClient,
  ItemStore,
  ToolsInfo,
  QConfig,
  DialogService
)
export class ItemOverview {
  currentTarget;

  constructor(
    router,
    relativeTime,
    i18n,
    notification,
    httpClient,
    itemStore,
    toolsInfo,
    qConfig,
    dialogService
  ) {
    this.router = router;
    this.relativeTime = relativeTime;
    this.i18n = i18n;
    this.notification = notification;
    this.httpClient = httpClient;
    this.itemStore = itemStore;
    this.toolsInfo = toolsInfo;
    this.qConfig = qConfig;
    this.dialogService = dialogService;
  }

  async activate(routeParams) {
    try {
      this.itemId = routeParams.id;
      this.item = await this.itemStore.getItem(routeParams.id);
    } catch (e) {
      this.notification.error("notification.failedToLoadItem");
    }
  }

  async attached() {
    this.isToolAvailable = await this.toolsInfo.isToolWithNameAvailable(
      this.item.conf.tool
    );
    if (await this.qConfig.get("metaInformation")) {
      this.loadMetaInformation();
    }
  }

  async edit() {
    const editorRoute = `/editor/${this.item.conf.tool}/${this.item.conf._id}`;

    // if the item is already active and the last edited and uiBehaviour.askBeforeEditIfActive is true in config, we
    // ask the user if she really wants to edit this item

    // if the item is not active, go to the editor
    if (this.item.conf.active === false) {
      this.router.navigate(editorRoute);
      return;
    }

    // otherwise we need to load the uiBehaviour Configuration
    const uiBehaviorConfig = await this.qConfig.get("uiBehavior");

    // if we do not have the config, go to the editor
    if (!uiBehaviorConfig || !uiBehaviorConfig.askBeforeEditIfActive) {
      this.router.navigate(editorRoute);
      return;
    }

    // otherwise compute the secondsSinceLastEdit
    const lastEditedDate = new Date(this.item.conf.updatedDate || Date.now());
    const now = new Date();
    const secondsSinceLastEdit =
      now.getTime() / 1000 - lastEditedDate.getTime() / 1000;

    // if the configured threshold is not reached, go to the editor
    if (
      !uiBehaviorConfig.askBeforeEditIfActive.lastEditSecondsThreshold ||
      secondsSinceLastEdit <
        uiBehaviorConfig.askBeforeEditIfActive.lastEditSecondsThreshold
    ) {
      this.router.navigate(editorRoute);
      return;
    }

    // open the dialog to ask the user if she wants to edit
    const openDialogResult = await this.dialogService.open({
      viewModel: ConfirmDialog,
      model: {
        confirmQuestion: this.i18n.tr("editor.questionReallyEditBecauseActive"),
        proceedText: this.i18n.tr("editor.confirmProceedToEditor"),
        cancelText: this.i18n.tr("editor.cancelProceedToEditor")
      }
    });
    const closeResult = await openDialogResult.closeResult;

    // only go to the editor if it was not cancelled
    if (!closeResult.wasCancelled) {
      this.router.navigate(editorRoute);
    }
  }

  async blueprint() {
    try {
      await this.item.blueprint();
      this.item.conf.title = this.i18n.tr("item.blueprintTitlePrefix");

      let tool = this.item.conf.tool.replace(new RegExp("-", "g"), "_");
      this.router.navigate(`/editor/${tool}/${this.item.conf._id}`);
    } catch (e) {
      this.notification.error("notification.failedToLoadItem");
    }
  }

  activateItem() {
    this.item.activate();
  }

  deactivateItem() {
    this.item.deactivate();
  }

  back() {
    this.router.navigateBack();
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
}
