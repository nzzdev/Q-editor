import { inject } from "aurelia-framework";
import { HttpClient } from "aurelia-fetch-client";
import qEnv from "resources/qEnv.js";

@inject(HttpClient)
export default class ToolEndpointNotificationCheck {
  constructor(httpClient) {
    this.httpClient = httpClient;
  }

  async getNotificationResult(notificationCheck, data, tool) {
    const QServerBaseUrl = await qEnv.QServerBaseUrl;
    const response = await this.httpClient.fetch(
      `${QServerBaseUrl}/tools/${tool}/${notificationCheck.endpoint}`,
      {
        method: "POST",
        body: JSON.stringify({
          data: data,
          notificationCheck: notificationCheck
        })
      }
    );
    return response.json();
  }
}
