import { inject } from 'aurelia-framework';
import { Router } from 'aurelia-router';
import { RelativeTime } from 'aurelia-i18n';
import { I18N } from 'aurelia-i18n';
import { Notification } from 'aurelia-notification';
import { HttpClient } from 'aurelia-fetch-client';

import ItemStore from 'resources/ItemStore.js';
import ToolsInfo from 'resources/ToolsInfo.js';
import QConfig from 'resources/QConfig.js';
import qEnv from 'resources/qEnv.js';

@inject(Router, RelativeTime, I18N, Notification, HttpClient, ItemStore, ToolsInfo, QConfig)
export class ItemOverview {

  currentTarget;

  constructor(router, relativeTime, i18n, notification, httpClient, itemStore, toolsInfo, qConfig) {
    this.router = router;
    this.relativeTime = relativeTime;
    this.i18n = i18n;
    this.notification = notification;
    this.httpClient = httpClient;
    this.itemStore = itemStore;
    this.toolsInfo = toolsInfo;
    this.qConfig = qConfig;
  }

  async activate(routeParams) {
    try {
      this.itemId = routeParams.id;
      this.item = await this.itemStore.getItem(routeParams.id);
    } catch (e) {
      this.notification.error('notification.failedToLoadItem');
    }
  }

  async attached() {
    this.isToolAvailable = await this.toolsInfo.isToolWithNameAvailable(this.item.conf.tool);
    if (await this.qConfig.get('metaInformation')) {
      this.loadMetaInformation();
    }
  }

  edit() {
    let tool = this.item.conf.tool.replace(new RegExp('-', 'g'), '_');
    this.router.navigate(`/editor/${tool}/${this.item.conf._id}`);
  }

  async blueprint() {
    try {
      await this.item.blueprint();
      this.item.conf.title = this.i18n.tr('item.blueprintTitlePrefix');

      let tool = this.item.conf.tool.replace(new RegExp('-', 'g'), '_');
      this.router.navigate(`/editor/${tool}/${this.item.conf._id}`);
    } catch (e) {
      this.notification.error('notification.failedToLoadItem');
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
    const metaInformationConfig = await this.qConfig.get('metaInformation');
    let requestUrl;
    if (metaInformationConfig.hasOwnProperty('articlesWithItem') && metaInformationConfig.articlesWithItem.hasOwnProperty('endpoint')) {
      const endpoint = metaInformationConfig.articlesWithItem.endpoint;
      if (endpoint.hasOwnProperty('path')) {
        requestUrl = `${QServerBaseUrl}/${endpoint.path}`.replace('{id}', this.item.id);
      }
      const response = await this.httpClient.fetch(requestUrl);
      if (!response.ok || response.status >= 400) {
        return;
      }
      this.articlesWithItem = await response.json();
    }
  }

}
