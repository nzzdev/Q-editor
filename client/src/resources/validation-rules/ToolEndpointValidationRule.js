import { inject } from "aurelia-framework";
import { I18N } from "aurelia-i18n";
import { HttpClient } from "aurelia-fetch-client";
import qEnv from "resources/qEnv.js";

@inject(I18N, HttpClient)
export default class ToolEndpointValidationRule {
  constructor(i18n, httpClient) {
    this.i18n = i18n;
    this.httpClient = httpClient;
  }

  async validate(validationRule, validationData, schema, currentItem) {
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
}
