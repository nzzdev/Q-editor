import { inject, LogManager } from "aurelia-framework";
import { I18N } from "aurelia-i18n";
import { Container } from "aurelia-dependency-injection";

import CurrentItemProvider from "resources/CurrentItemProvider.js";

const log = LogManager.getLogger("Q");

function getDescendantProperty(obj, path) {
  return path.split(".").reduce((acc, part) => acc && acc[part], obj);
}

function getNotificationTypeValue(type) {
  if (type === "high") {
    return 2;
  } else if (type === "medium") {
    return 1;
  }
  return 0;
}

function sortNotificationsByPriority(a, b) {
  // sorts notification by type ("low", "medium", "high") and inside the type group based on priority value
  const notificationTypeValueA = getNotificationTypeValue(a.priority.type);
  const notificationTypeValueB = getNotificationTypeValue(b.priority.type);
  return (
    notificationTypeValueA - notificationTypeValueB ||
    a.priority.value - b.priority.value
  );
}

@inject(CurrentItemProvider, I18N, Container)
export default class NotificationChecker {
  reevaluateCallbacks = [];

  constructor(currentItemProvider, i18n, diContainer) {
    this.currentItemProvider = currentItemProvider;
    this.i18n = i18n;
    this.diContainer = diContainer;
  }

  triggerReevaluation() {
    for (let cb of this.reevaluateCallbacks) {
      cb();
    }
  }

  registerReevaluateCallback(cb) {
    this.reevaluateCallbacks.push(cb);
    return cb;
  }

  unregisterReevaluateCallback(id) {
    const index = this.reevaluateCallbacks.indexOf(id);
    if (index > -1) {
      this.reevaluateCallbacks.splice(index, 1);
    }
  }

  async getNotifications(notificationChecks) {
    const notificationPromises = notificationChecks.map(
      async notificationCheck => {
        try {
          const checker = this.diContainer.get(
            notificationCheck.type + "NotificationCheck"
          );
          const item = this.currentItemProvider.getCurrentItem().conf;

          // if the data property is given and defines some data to send to the checker
          // we gather an array containing only the properties needed by the checker
          let data;
          if (
            Array.isArray(notificationCheck.data) &&
            notificationCheck.data.length > 0
          ) {
            data = notificationCheck.data.map(property =>
              getDescendantProperty(item, property)
            );
          }

          // get the notification from the checker or null
          const notification = await checker.getNotification(
            notificationCheck,
            data
          );

          // a notification needs to have at least a message object
          if (!notification || typeof notification.message !== "object") {
            return null;
          }

          // add the priority from the check config if not overwritten by check
          if (!notification.hasOwnProperty("priority")) {
            notification.priority = notificationCheck.priority;
          }

          // add tool namespace to the message if this was ToolEndpoint check
          if (notificationCheck.type === "ToolEndpoint") {
            notification.message.title = `${item.tool}:${
              notification.message.title
            }`;
            notification.message.body = `${item.tool}:${
              notification.message.body
            }`;
          }
          return notification;
        } catch (error) {
          log.error("notificationCheck failed", error);
        }
      }
    );
    const notificationsPerCheck = await Promise.all(notificationPromises);
    return notificationsPerCheck
      .filter(notification => notification && typeof notification === "object")
      .reduce((allNotifications, singleCheckNotifications) => {
        return allNotifications.concat(singleCheckNotifications);
      }, []) // flat
      .sort(sortNotificationsByPriority);
  }

  async getPreviewNotification(error, errorMessage, notificationChecks) {
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
    } else if (notificationChecks) {
      notification = await this.getNotification(notificationChecks);
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
}
