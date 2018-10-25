import array2d from "array2d";
import CurrentItemProvider from "resources/CurrentItemProvider.js";
import { inject } from "aurelia-framework";

@inject(CurrentItemProvider)
export default class HasColumnTitlesNotificationCheck {
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
    if (item.data.length > 1) {
      // only check if there are at least two rows (one header and one data row)
      const hasColumnTitleState = [];
      array2d.eachColumn(item.data, (column, index) => {
        hasColumnTitleState[index] = column.length > 1 && column[0] !== null;
      });
      const hasColumnTitles = hasColumnTitleState.reduce(
        (prev, curr) => prev && curr
      );
      if (!hasColumnTitles) {
        return {
          message: {
            title: "notifications.hasColumnTitles.title",
            body: "notifications.hasColumnTitles.body"
          }
        };
      }
    }
    return null;
  }
}
