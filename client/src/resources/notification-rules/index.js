import { inject } from "aurelia-framework";
import { I18N } from "aurelia-i18n";
import qEnv from "resources/qEnv.js";
import EmptyDataNotificationRule from "./EmptyDataNotificationRule.js";
import EmptyFirstRowNotificationRule from "./EmptyFirstRowNotificationRule.js";
import TooManyColumnsNotificationRule from "./TooManyColumnsNotificationRule.js";
import ToolEndpointNotificationRule from "./ToolEndpointNotificationRule.js";
import IsValueMissingNotificationRule from "./IsValueMissingNotificationRule.js";

@inject(
  I18N,
  EmptyDataNotificationRule,
  EmptyFirstRowNotificationRule,
  TooManyColumnsNotificationRule,
  ToolEndpointNotificationRule,
  IsValueMissingNotificationRule
)
export default class NotificationRules {
  constructor(
    i18n,
    emptyDataNotificationRule,
    emptyFirstRowNotificationRule,
    tooManyColumnsNotificationRule,
    toolEndpointNotificationRule,
    isValueMissingNotificationRule
  ) {
    this.i18n = i18n;
    this.emptyDataNotificationRule = emptyDataNotificationRule;
    this.emptyFirstRowNotificationRule = emptyFirstRowNotificationRule;
    this.tooManyColumnsNotificationRule = tooManyColumnsNotificationRule;
    this.toolEndpointNotificationRule = toolEndpointNotificationRule;
    this.isValueMissingNotificationRule = isValueMissingNotificationRule;
  }

  async getNotification(notificationRule, data, tool, element) {
    const notificationConfig = await qEnv.notificationConfig;
    if (notificationRule.type === "IsValueMissing") {
      let notificationResult = this.isValueMissingNotificationRule.getNotificationResult(
        element,
        notificationConfig.isValueMissing
      );
      return this.getNotificationObject(
        notificationResult,
        "",
        notificationRule.type
      );
    } else if (notificationRule.type === "EmptyData") {
      let notificationResult = this.emptyDataNotificationRule.getNotificationResult(
        data,
        notificationConfig.emptyData
      );
      return this.getNotificationObject(
        notificationResult,
        "",
        notificationRule.type
      );
    } else if (notificationRule.type === "EmptyFirstRow") {
      let notificationResult = this.emptyFirstRowNotificationRule.getNotificationResult(
        data,
        notificationConfig.emptyFirstRow
      );
      return this.getNotificationObject(
        notificationResult,
        "",
        notificationRule.type
      );
    } else if (notificationRule.type === "TooManyColumns") {
      let notificationResult = this.tooManyColumnsNotificationRule.getNotificationResult(
        data,
        notificationConfig.tooManyColumns
      );
      return this.getNotificationObject(
        notificationResult,
        "",
        notificationRule.type
      );
    } else if (notificationRule.type === "ToolEndpoint") {
      let notificationResult = await this.toolEndpointNotificationRule.getNotificationResult(
        notificationRule,
        data,
        tool
      );
      const notificationType = notificationRule.endpoint.replace(
        "notification/",
        ""
      );
      return this.getNotificationObject(
        notificationResult,
        `${tool}:`,
        notificationType
      );
    }
  }

  getNotificationObject(
    notificationResult,
    translationNamespace,
    notificationType
  ) {
    if (notificationResult.showNotification) {
      const translationKey =
        notificationType.charAt(0).toLowerCase() + notificationType.slice(1);
      return {
        priority: notificationResult.priority,
        message: {
          title: `${translationNamespace}notifications.${translationKey}.title`,
          body: `${translationNamespace}notifications.${translationKey}.body`,
          parameters: notificationResult.messageParameters
        }
      };
    }
    return {};
  }
}
