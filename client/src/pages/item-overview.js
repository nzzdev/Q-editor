import { inject } from "aurelia-framework";
import { RelativeTime } from "aurelia-i18n";
import { Notification } from "aurelia-notification";
import { HttpClient } from "aurelia-fetch-client";

import ItemStore from "resources/ItemStore.js";
import ToolsInfo from "resources/ToolsInfo.js";
import qEnv from "resources/qEnv.js";
import ItemActionController from "resources/ItemActionController";
import QConfig from "resources/QConfig.js";

@inject(
  RelativeTime,
  Notification,
  HttpClient,
  ItemStore,
  ToolsInfo,
  ItemActionController,
  QConfig
)
export class ItemOverview {
  currentTarget;

  constructor(
    relativeTime,
    notification,
    httpClient,
    itemStore,
    toolsInfo,
    itemActionController,
    qConfig
  ) {
    this.relativeTime = relativeTime;
    this.notification = notification;
    this.httpClient = httpClient;
    this.itemStore = itemStore;
    this.toolsInfo = toolsInfo;
    this.itemActionController = itemActionController;
    this.qConfig = qConfig;
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
