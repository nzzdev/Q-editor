import { inject } from "aurelia-framework";
import CurrentItemProvider from "resources/CurrentItemProvider.js";

@inject(CurrentItemProvider)
export default class TooManyColumnsNotificationCheck {
  constructor(currentItemProvider) {
    this.currentItemProvider = currentItemProvider;
  }

  getNotification(config) {
    let item;
    if (Array.isArray(config.fields) && config.fields.length > 0) {
      item = this.currentItemProvider.getCurrentItemByFields(config.fields);
    }
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
