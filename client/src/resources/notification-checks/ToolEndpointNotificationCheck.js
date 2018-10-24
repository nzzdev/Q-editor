import { inject, LogManager } from "aurelia-framework";
import ToolEndpointChecker from "resources/checkers/ToolEndpointChecker.js";

const log = LogManager.getLogger("Q");

@inject(ToolEndpointChecker)
export default class ToolEndpointNotificationCheck {
  constructor(toolEndpointChecker) {
    this.toolEndpointChecker = toolEndpointChecker;
  }

  async getNotification(notificationCheck) {
    if (!notificationCheck.endpoint) {
      log.error(
        "no endpoint defined for notificationCheck ToolEndpointNotificationCheck:",
        notificationCheck
      );
      return false;
    }
    return await this.toolEndpointChecker.check(notificationCheck);
  }
}
