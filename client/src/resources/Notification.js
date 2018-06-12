import { inject } from "aurelia-framework";
import { I18N } from "aurelia-i18n";
import CurrentItemProvider from "resources/CurrentItemProvider.js";
import NotificationRules from "resources/notification-rules/index.js";

const getDescendantProperty = (obj, path) =>
  path.split(".").reduce((acc, part) => acc && acc[part], obj);

@inject(CurrentItemProvider, I18N, NotificationRules)
export class Notification {
  constructor(currentItemProvider, i18n, notificationRules) {
    this.currentItemProvider = currentItemProvider;
    this.i18n = i18n;
    this.notificationRules = notificationRules;
  }

  async getNotification(notificationRules, element) {
    let notifications = [];
    if (notificationRules) {
      const results = await notificationRules.map(notificationRule => {
        const item = this.currentItemProvider.getCurrentItem().conf;
        const data = notificationRule.data.map(property =>
          getDescendantProperty(item, property)
        );
        return this.notificationRules.getNotification(
          notificationRule,
          data,
          item.tool,
          element
        );
      });
      notifications = await Promise.all(results);
    }
    return this.getMostImportantNotification(notifications);
  }

  async getPreviewNotification(error, errorMessage, notificationRules) {
    let notification = {
      message: {
        title: "",
        body: ""
      },
      priority: {
        type: "high",
        value: 10
      }
    };
    if (error && errorMessage !== "") {
      notification.message.title = "preview.technicalError.title";
      notification.message.body = "preview.technicalError.body";
      notification.message.parameters = {
        errorMessage: errorMessage
      };
    } else if (error) {
      notification = {};
    } else if (notificationRules) {
      notification = await this.getNotification(notificationRules);
    } else {
      notification.priority = {
        type: "low",
        value: 10
      };
      notification.message.title = "preview.hint.title";
      notification.message.body = "preview.hint.body";
    }
    return notification;
  }

  getNotificationTypeValue(priority) {
    if (priority === "high") {
      return 2;
    } else if (priority === "medium") {
      return 1;
    }
    return 0;
  }

  getMostImportantNotification(notifications) {
    const notification = notifications
      .filter(entry => entry.message)
      .sort((a, b) => {
        // sorts notification by type ("low", "medium", "high") and inside the type group based on priority value
        const notificationTypeValueA = this.getNotificationTypeValue(
          a.priority.type
        );
        const notificationTypeValueB = this.getNotificationTypeValue(
          b.priority.type
        );
        return (
          notificationTypeValueA - notificationTypeValueB ||
          a.priority.value - b.priority.value
        );
      })
      .pop();
    if (notification) {
      return notification;
    }
    return {};
  }
}
