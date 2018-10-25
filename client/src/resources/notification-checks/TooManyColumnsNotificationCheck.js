import CurrentItemProvider from "resources/CurrentItemProvider.js";
import { inject } from "aurelia-framework";

@inject(CurrentItemProvider)
export default class TooManyColumnsNotificationCheck {
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
