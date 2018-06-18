import { inject, LogManager } from "aurelia-framework";
import ToolEndpointChecker from "resources/checkers/ToolEndpointChecker.js";

const log = LogManager.getLogger("Q");

@inject(ToolEndpointChecker)
export default class ToolEndpointNotificationCheck {
  constructor(toolEndpointChecker) {
    this.toolEndpointChecker = toolEndpointChecker;
  }

  async getNotification(notificationCheck, data) {
    if (!notificationCheck.endpoint) {
      log.error(
        "no endpoint defined for notificationCheck ToolEndpointNotificationCheck:",
        notificationCheck
      );
      return false;
    }
    const dataForEndpoint = {
      data: data
    };
    if (notificationCheck.hasOwnProperty("options")) {
      dataForEndpoint.options = notificationCheck.options;
    }
    try {
      const notification = await this.toolEndpointChecker.fetchWithData(
        notificationCheck.endpoint,
        dataForEndpoint
      );
      return notification;
    } catch (e) {
      log.error("failed to fetch with toolEndpointChecker", e);
    }
  }
}
