import { inject } from "aurelia-framework";
import { I18N } from "aurelia-i18n";
import CurrentItemProvider from "resources/CurrentItemProvider.js";
import ValidationRules from "resources/validation-rules/index.js";

const getDescendantProperty = (obj, path) =>
  path.split(".").reduce((acc, part) => acc && acc[part], obj);

@inject(CurrentItemProvider, I18N, ValidationRules)
export class Validation {
  constructor(currentItemProvider, i18n, validationRules) {
    this.currentItemProvider = currentItemProvider;
    this.i18n = i18n;
    this.validationRules = validationRules;
  }

  async validate(validationRules, element) {
    let notifications = [];
    if (validationRules) {
      const results = await validationRules.map(async validationRule => {
        const item = this.currentItemProvider.getCurrentItem().conf;
        const data = validationRule.data.map(property =>
          getDescendantProperty(item, property)
        );
        return await this.validationRules.validate(
          validationRule,
          data,
          item.tool,
          element
        );
      });
      notifications = await Promise.all(results);
    }
    return this.getNotification(notifications);
  }

  async validatePreview(error, errorMessage) {
    let notification = {
      priority: "high",
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
      notification.priority = "low";
      notification.message.title = this.i18n.tr("preview.hint.title");
      notification.message.body = this.i18n.tr("preview.hint.body");
    }
    return notification;
  }

  getPriorityValue(priority) {
    if (priority === "high") {
      return 2;
    } else if (priority === "medium") {
      return 1;
    }
    return 0;
  }

  getNotification(notifications) {
    const notification = notifications
      .filter(entry => entry.message)
      .sort((a, b) => {
        const priorityValueA = this.getPriorityValue(a.priority);
        const priorityValueB = this.getPriorityValue(b.priority);
        if (priorityValueA > priorityValueB) {
          return 1;
        }
        if (priorityValueA < priorityValueB) {
          return -1;
        }
        return 0;
      })
      .pop();
    if (notification) {
      return notification;
    }
    return {};
  }
}
