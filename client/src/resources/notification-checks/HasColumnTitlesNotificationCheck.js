import { inject } from "aurelia-framework";
import array2d from "array2d";
import CurrentItemProvider from "resources/CurrentItemProvider.js";

@inject(CurrentItemProvider)
export default class HasColumnTitlesNotificationCheck {
  constructor(currentItemProvider) {
    this.currentItemProvider = currentItemProvider;
  }

  getNotification(config) {
    let item;
    if (Array.isArray(config.fields) && config.fields.length > 0) {
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
