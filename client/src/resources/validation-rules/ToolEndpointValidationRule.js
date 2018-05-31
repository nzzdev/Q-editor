import { inject } from "aurelia-framework";
import { HttpClient } from "aurelia-fetch-client";
import qEnv from "resources/qEnv.js";

@inject(HttpClient)
export default class ToolEndpointValidationRule {
  constructor(httpClient) {
    this.httpClient = httpClient;
  }

  async validate(validationRule, data, tool) {
    const QServerBaseUrl = await qEnv.QServerBaseUrl;
    const response = await this.httpClient.fetch(
      `${QServerBaseUrl}/tools/${tool}/${validationRule.endpoint}`,
      {
        method: "POST",
        body: JSON.stringify({
          data: data
        })
      }
    );
    return response.json();
  }
}
