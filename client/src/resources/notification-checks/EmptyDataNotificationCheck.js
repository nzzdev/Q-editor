import CurrentItemProvider from "resources/CurrentItemProvider.js";
import { inject } from "aurelia-framework";

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

  getNotification(notificationCheck) {
    const item = this.currentItemProvider.getCurrentItemByFields(
      notificationCheck.fields
    );
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
