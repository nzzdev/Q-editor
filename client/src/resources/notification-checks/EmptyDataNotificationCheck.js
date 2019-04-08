import { inject } from "aurelia-framework";
import CurrentItemProvider from "resources/CurrentItemProvider.js";

const notification = {
  message: {
    title: "notifications.emptyData.title",
    body: "notifications.emptyData.body"
  }
};

@inject(CurrentItemProvider)
export default class EmptyDataNotificationCheck {
  constructor(currentItemProvider) {
    this.currentItemProvider = currentItemProvider;
  }

  getNotification(config) {
    let item;
    if (Array.isArray(config.fields) && config.fields.length > 0) {
      item = this.currentItemProvider.getCurrentItemByFields(config.fields);
    }
    if (item.data.length === 0) {
      return notification;
    }

    // check all the cells, if any of them is not null, return no notification
    for (const row of item.data) {
      for (const cell of row) {
        if (cell !== null) {
          return null;
        }
      }
    }

    return notification;
  }
}
