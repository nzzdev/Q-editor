import { inject, LogManager } from "aurelia-framework";
import CurrentItemProvider from "resources/CurrentItemProvider.js";

const log = LogManager.getLogger("Q");

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
    if (config.data) {
      item = this.currentItemProvider.getCurrentItemByFields(config.data);
      log.info(
        "DEPRECATION NOTICE: In Q editor 4.0 you will have to rename data to fields. See https://github.com/nzzdev/Q-editor/blob/master/README.md for details"
      );
    } else {
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
