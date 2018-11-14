import { inject, LogManager } from "aurelia-framework";
import ToolEndpointChecker from "resources/checkers/ToolEndpointChecker.js";

const log = LogManager.getLogger("Q");

@inject(ToolEndpointChecker)
export default class ToolEndpointNotificationCheck {
  constructor(toolEndpointChecker) {
    this.toolEndpointChecker = toolEndpointChecker;
  }

  async getNotification(config) {
    if (!config.endpoint) {
      log.error(
        "no endpoint defined for notificationCheck ToolEndpointNotificationCheck:",
        config
      );
      return false;
    }
    return await this.toolEndpointChecker.check(config);
  }
}
