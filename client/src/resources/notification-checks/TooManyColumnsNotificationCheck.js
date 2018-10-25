import CurrentItemProvider from "resources/CurrentItemProvider.js";
import { inject } from "aurelia-framework";

@inject(CurrentItemProvider)
export default class TooManyColumnsNotificationCheck {
  constructor(currentItemProvider) {
    this.currentItemProvider = currentItemProvider;
  }

  getNotification(config) {
    const item = this.currentItemProvider.getCurrentItemByFields(config.fields);
    if (item.data[0] && item.data[0].length > config.options.limit) {
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
