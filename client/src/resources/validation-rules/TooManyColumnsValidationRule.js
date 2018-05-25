import { inject } from "aurelia-framework";
import { I18N } from "aurelia-i18n";

@inject(I18N)
export default class TooManyColumnsValidationRule {
  constructor(i18n) {
    this.i18n = i18n;
  }

  validate(validationData) {
    let notification = {};
    if (validationData[0][0] && validationData[0][0].length > 8) {
      notification = {
        priority: {
          name: "low",
          value: 0
        },
        message: {
          title: this.i18n.tr("notifications.table.tooManyColumns.title"),
          body: this.i18n.tr("notifications.table.tooManyColumns.body")
        }
      };
    }
    return notification;
  }
}
