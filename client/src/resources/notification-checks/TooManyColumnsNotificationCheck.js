import CurrentItemProvider from "resources/CurrentItemProvider.js";
import { inject } from "aurelia-framework";

@inject(CurrentItemProvider)
export default class TooManyColumnsNotificationCheck {
  constructor(currentItemProvider) {
    this.currentItemProvider = currentItemProvider;
  }

  getNotification(notificationCheck) {
    const item = this.currentItemProvider.getCurrentItemByFields(
      notificationCheck.fields
    );
    if (item.data[0] && item.data[0].length > notificationCheck.options.limit) {
      return {
        message: {
          title: "notifications.tooManyColumns.title",
          body: "notifications.tooManyColumns.body"
        }
      };
    }
    return null;
  }
}
