import { inject } from "aurelia-framework";
import { HttpClient } from "aurelia-fetch-client";
import qEnv from "resources/qEnv.js";

@inject(HttpClient)
export default class ToolEndpointNotificationRule {
  constructor(httpClient) {
    this.httpClient = httpClient;
  }

  async getNotificationResult(notificationRule, data, tool) {
    const QServerBaseUrl = await qEnv.QServerBaseUrl;
    const response = await this.httpClient.fetch(
      `${QServerBaseUrl}/tools/${tool}/${notificationRule.endpoint}`,
      {
        method: "POST",
        body: JSON.stringify({
          data: data,
          notificationRule: notificationRule
        })
      }
    );
    return response.json();
  }
}
