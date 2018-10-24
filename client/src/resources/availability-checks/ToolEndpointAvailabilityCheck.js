import { inject, LogManager } from "aurelia-framework";
import ToolEndpointChecker from "resources/checkers/ToolEndpointChecker.js";
import CurrentItemProvider from "resources/CurrentItemProvider.js";

const log = LogManager.getLogger("Q");
@inject(ToolEndpointChecker, CurrentItemProvider)
export default class ToolEndpointAvailabilityCheck {
  constructor(toolEndpointChecker, currentItemProvider) {
    this.toolEndpointChecker = toolEndpointChecker;
    this.currentItemProvider = currentItemProvider;
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
