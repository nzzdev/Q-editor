import { inject, LogManager } from "aurelia-framework";
import ToolEndpointChecker from "resources/checkers/ToolEndpointChecker.js";

const log = LogManager.getLogger("Q");
@inject(ToolEndpointChecker)
export default class ToolEndpointAvailabilityCheck {
  constructor(toolEndpointChecker) {
    this.toolEndpointChecker = toolEndpointChecker;
  }

  async isAvailable(config) {
    if (!config.endpoint) {
      log.error(
        "no endpoint defined for availabilityCheck checkToolEndpoint:",
        config
      );
      return false;
    }
    const result = await this.toolEndpointChecker.check(config);
    return result.available;
  }
}
