import { inject } from "aurelia-framework";
import { I18N } from "aurelia-i18n";

@inject(I18N)
export default class FormValidationRule {
  constructor(i18n) {
    this.i18n = i18n;
  }

  validate(element) {
    let notification = {};
    if (!element.validity.valid) {
      if (element.validity.valueMissing) {
        notification = {
          priority: {
            name: "high",
            value: 2
          },
          message: {
            title: this.i18n.tr("notifications.missingValue.title"),
            body: this.i18n.tr("notifications.missingValue.body")
          }
        };
      } else {
        notification = {
          priority: {
            name: "high",
            value: 2
          },
          message: {
            title: "Ein Fehler ist aufgetreten",
            body: element.validationMessage
          }
        };
      }
    }
    return notification;
  }
}
