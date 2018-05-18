import { inject } from "aurelia-framework";
import { I18N } from "aurelia-i18n";

@inject(I18N)
export class ValidationRules {
  constructor(i18n) {
    this.i18n = i18n;
  }

  checkForEmptyData(validationData) {
    let notification = {};
    if (
      validationData.length === 1 &&
      (JSON.stringify(validationData) === "[[[null]]]" ||
        validationData[0].length === 0)
    ) {
      notification = {
        priority: {
          name: "low",
          value: 0
        },
        message: {
          title: this.i18n.tr("notifications.table.emptyData.title"),
          body: this.i18n.tr("notifications.table.emptyData.body")
        }
      };
    }
    return notification;
  }

  checkForSources(validationData) {
    let notification = {};
    if (!validationData[0][0]) {
      notification = {
        priority: {
          name: "low",
          value: 0
        },
        message: {
          title: this.i18n.tr("notifications.sources.noSources.title"),
          body: this.i18n.tr("notifications.sources.noSources.body")
        }
      };
    }
    return notification;
  }
}
