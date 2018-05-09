import { inject } from "aurelia-framework";
import { HttpClient } from "aurelia-fetch-client";
import qEnv from "resources/qEnv.js";
import CurrentItemProvider from "resources/CurrentItemProvider.js";

@inject(HttpClient, CurrentItemProvider)
export class Validation {
  constructor(httpClient, currentItemProvider) {
    this.httpClient = httpClient;
    this.currentItemProvider = currentItemProvider;
  }

  async validate(element, validationRules, schema, data) {
    let notifications = [];
    notifications = notifications.concat(
      this.getFormValidationNotifications(element, schema)
    );

    if (validationRules) {
      notifications = await notifications.concat(
        await this.getRuleBasedNotifications(validationRules, schema, data)
      );
    }
    return this.getNotification(notifications);
  }

  getFormValidationNotifications(element, schema) {
    let notifications = [];
    if (!element.checkValidity()) {
      notifications.push({
        priority: {
          name: "high",
          value: 2
        },
        message: {
          title: "Whoops, kein " + schema.title,
          body: element.validationMessage
        }
      });
    }
    return notifications;
  }

  async getRuleBasedNotifications(validationRules, schema, data) {
    let notifications = [];
    const results = await validationRules.map(async validationRule => {
      if (validationRule.type === "ToolEndpoint") {
        return await this.getToolEndpointNotification(validationRule, schema);
      } else if (validationRule.type === "Schema") {
        return {};
      }
    });
    return await Promise.all(results).then(notifications => {
      return notifications.filter(notification => notification.message);
    });
  }

  async getToolEndpointNotification(validationRule, schema) {
    const QServerBaseUrl = await qEnv.QServerBaseUrl;
    const currentItem = this.currentItemProvider.getCurrentItem().conf;
    const validationData = validationRule.data.map(
      dataEntry => currentItem[dataEntry]
    );
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
    } else {
      return {};
    }
  }
}
