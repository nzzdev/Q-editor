import { inject } from 'aurelia-framework';
import { Router } from 'aurelia-router';
import { RelativeTime } from 'aurelia-i18n';
import { I18N } from 'aurelia-i18n';
import { Notification } from 'aurelia-notification';

import ItemStore from 'resources/ItemStore.js';

@inject(Router, RelativeTime, I18N, ItemStore, Notification)
export class ItemOverview {

  currentTarget;

  constructor(router, relativeTime, i18n, itemStore, notification) {
    this.router = router;
    this.relativeTime = relativeTime;
    this.i18n = i18n;
    this.itemStore = itemStore;
    this.notification = notification;
  }

  async activate(routeParams) {
    try {
      this.itemId = routeParams.id;
      this.item = await this.itemStore.getItem(routeParams.id);
    } catch (e) {
      this.notification.error('notification.failedToLoadItem');
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

}
