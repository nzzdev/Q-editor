import { inject } from "aurelia-framework";
import { I18N } from "aurelia-i18n";
import EmptyDataNotificationCheck from "./EmptyDataNotificationCheck";
import EmptyFirstRowNotificationCheck from "./EmptyFirstRowNotificationCheck.js";
import TooManyColumnsNotificationCheck from "./TooManyColumnsNotificationCheck.js";
import ToolEndpointNotificationCheck from "./ToolEndpointNotificationCheck.js";
import IsValueMissingNotificationCheck from "./IsValueMissingNotificationCheck.js";

@inject(
  I18N,
  EmptyDataNotificationCheck,
  EmptyFirstRowNotificationCheck,
  TooManyColumnsNotificationCheck,
  ToolEndpointNotificationCheck,
  IsValueMissingNotificationCheck
)
export default class NotificationChecks {
  constructor(
    i18n,
    emptyDataNotificationCheck,
    emptyFirstRowNotificationCheck,
    tooManyColumnsNotificationCheck,
    toolEndpointNotificationCheck,
    isValueMissingNotificationCheck
  ) {
    this.i18n = i18n;
    this.emptyDataNotificationCheck = emptyDataNotificationCheck;
    this.emptyFirstRowNotificationCheck = emptyFirstRowNotificationCheck;
    this.tooManyColumnsNotificationCheck = tooManyColumnsNotificationCheck;
    this.toolEndpointNotificationCheck = toolEndpointNotificationCheck;
    this.isValueMissingNotificationCheck = isValueMissingNotificationCheck;
  }

  async getNotification(notificationCheck, data, tool, element) {
    if (notificationCheck.type === "IsValueMissing") {
      let notificationResult = this.isValueMissingNotificationCheck.getNotificationResult(
        element,
        notificationCheck
      );
      return this.getNotificationObject(
        notificationResult,
        "",
        notificationCheck.type
      );
    } else if (notificationCheck.type === "EmptyData") {
      let notificationResult = this.emptyDataNotificationCheck.getNotificationResult(
        data,
        notificationCheck
      );
      return this.getNotificationObject(
        notificationResult,
        "",
        notificationCheck.type
      );
    } else if (notificationCheck.type === "EmptyFirstRow") {
      let notificationResult = this.emptyFirstRowNotificationCheck.getNotificationResult(
        data,
        notificationCheck
      );
      return this.getNotificationObject(
        notificationResult,
        "",
        notificationCheck.type
      );
    } else if (notificationCheck.type === "TooManyColumns") {
      let notificationResult = this.tooManyColumnsNotificationCheck.getNotificationResult(
        data,
        notificationCheck
      );
      return this.getNotificationObject(
        notificationResult,
        "",
        notificationCheck.type
      );
    } else if (notificationCheck.type === "ToolEndpoint") {
      let notificationResult = await this.toolEndpointNotificationCheck.getNotificationResult(
        notificationCheck,
        data,
        tool
      );
      const notificationType = notificationCheck.endpoint.replace(
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
