import { inject } from "aurelia-framework";
import { I18N } from "aurelia-i18n";
import CurrentItemProvider from "resources/CurrentItemProvider.js";
import ValidationRules from "resources/validation-rules/index.js";

@inject(CurrentItemProvider, I18N, ValidationRules)
export class Validation {
  constructor(currentItemProvider, i18n, validationRules) {
    this.currentItemProvider = currentItemProvider;
    this.i18n = i18n;
    this.validationRules = validationRules;
  }

  async validate(validationRules, schema, element) {
    let notifications = [];
    if (element) {
      if (validationRules) {
        validationRules.push({
          type: "Form"
        });
      } else {
        validationRules = [
          {
            type: "Form"
          }
        ];
      }
    }
    if (validationRules) {
      const results = await validationRules.map(async validationRule => {
        const currentItem = this.currentItemProvider.getCurrentItem().conf;
        let validationData = [];
        if (validationRule.data) {
          validationData = validationRule.data.map(
            dataEntry => currentItem[dataEntry]
          );
        }
        return await this.validationRules.validate(
          validationRule,
          validationData,
          schema,
          currentItem,
          element
        );
      });
      notifications = await Promise.all(results).then(notifications => {
        return notifications.filter(notification => notification.message);
      });
    }
    return this.getNotification(notifications);
  }

  async validatePreview(error, errorMessage) {
    let notification = {
      priority: {
        name: "high",
        value: 2
      },
      message: {
        title: "",
        body: ""
      }
    };
    if (error && errorMessage !== "") {
      notification.message.title = this.i18n.tr("preview.technicalError.title");
      notification.message.body =
        this.i18n.tr("preview.technicalError.body") + `(${errorMessage})`;
    } else if (error) {
      notification = {};
    } else {
      notification.priority.name = "low";
      notification.priority.value = 0;
      notification.message.title = this.i18n.tr("preview.hint.title");
      notification.message.body = this.i18n.tr("preview.hint.body");
    }
    return notification;
  }

  getNotification(notifications) {
    notifications.sort((a, b) => {
      if (a.priority.value > b.priority.value) {
        return 1;
      }
      if (a.priority.value < b.priority.value) {
        return -1;
      }
      return 0;
    });
    if (notifications.length > 0) {
      return notifications.pop();
    }
    return {};
  }
}
