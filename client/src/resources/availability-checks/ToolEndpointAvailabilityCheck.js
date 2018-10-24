import { inject, LogManager } from "aurelia-framework";
import ToolEndpointChecker from "resources/checkers/ToolEndpointChecker.js";

const log = LogManager.getLogger("Q");
@inject(ToolEndpointChecker)
export default class ToolEndpointAvailabilityCheck {
  constructor(toolEndpointChecker) {
    this.toolEndpointChecker = toolEndpointChecker;
  }

  async isAvailable(availabilityCheck) {
    if (!availabilityCheck.endpoint) {
      log.error(
        "no endpoint defined for availabilityCheck checkToolEndpoint:",
        availabilityCheck
      );
      return false;
    }
    const result = await this.toolEndpointChecker.check(availabilityCheck);
    return result.available;
  }
}
