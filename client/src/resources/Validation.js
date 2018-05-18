import { inject } from "aurelia-framework";
import { I18N } from "aurelia-i18n";
import { HttpClient } from "aurelia-fetch-client";
import qEnv from "resources/qEnv.js";
import CurrentItemProvider from "resources/CurrentItemProvider.js";
import { ValidationRules } from "resources/ValidationRules.js";

@inject(HttpClient, CurrentItemProvider, I18N, ValidationRules)
export class Validation {
  constructor(httpClient, currentItemProvider, i18n, validationRules) {
    this.httpClient = httpClient;
    this.currentItemProvider = currentItemProvider;
    this.i18n = i18n;
    this.validationRules = validationRules;
  }

  async validate(validationRules, schema, data, element) {
    let notifications = [];
    if (element) {
      notifications = notifications.concat(
        this.getFormValidationNotifications(element, schema)
      );
    }

    if (validationRules) {
      notifications = await notifications.concat(
        await this.getRuleBasedNotifications(validationRules, schema, data)
      );
    }
    return this.getNotification(notifications);
  }

  validatePreview(error, errorMessage) {
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

  getFormValidationNotifications(element, schema) {
    const notifications = [];
    if (!element.validity.valid) {
      if (element.validity.valueMissing) {
        notifications.push({
          priority: {
            name: "high",
            value: 2
          },
          message: {
            title: this.i18n.tr("notifications.missingValue.title"),
            body: this.i18n.tr("notifications.missingValue.body")
          }
        });
      } else {
        notifications.push({
          priority: {
            name: "high",
            value: 2
          },
          message: {
            title: "Ein Fehler ist aufgetreten",
            body: element.validationMessage
          }
        });
      }
    }
    return notifications;
  }

  async getRuleBasedNotifications(validationRules, schema, data) {
    const results = await validationRules.map(async validationRule => {
      const currentItem = this.currentItemProvider.getCurrentItem().conf;
      const validationData = validationRule.data.map(
        dataEntry => currentItem[dataEntry]
      );
      if (validationRule.type === "ToolEndpoint") {
        return await this.getToolEndpointNotification(
          validationRule,
          validationData,
          schema,
          currentItem
        );
      } else if (validationRule.type === "Local") {
        if (validationRule.method === "checkForEmptyData") {
          return this.validationRules.checkForEmptyData(validationData);
        } else if (validationRule.method === "checkForSources") {
          return this.validationRules.checkForSources(validationData);
        }
      }
    });
    return await Promise.all(results).then(notifications => {
      return notifications.filter(notification => notification.message);
    });
  }

  async getToolEndpointNotification(
    validationRule,
    validationData,
    schema,
    currentItem
  ) {
    const QServerBaseUrl = await qEnv.QServerBaseUrl;
    const response = await this.httpClient.fetch(
      `${QServerBaseUrl}/validate/${currentItem.tool}`,
      {
        method: "POST",
        body: JSON.stringify({
          endpoint: validationRule.endpoint,
          data: validationData,
          schema: schema
        })
      }
    );

    if (!response.ok) {
      throw response;
    }
    return await response.json();
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
