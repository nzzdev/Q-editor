import { inject, LogManager } from "aurelia-framework";
import ToolEndpointChecker from "resources/checkers/ToolEndpointChecker.js";
import CurrentItemProvider from "resources/CurrentItemProvider.js";
import get from "get-value";
import set from "set-value";

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

    if (availabilityCheck.withData) {
      const availability = await this.toolEndpointChecker.fetchWithItem(
        availabilityCheck.endpoint
      );
      return availability.available;
    }
    if (
      Array.isArray(availabilityCheck.data) &&
      availabilityCheck.data.length > 0
    ) {
      const item = this.currentItemProvider.getCurrentItem().conf;
      const dataForEndpoint = {};
      for (let property of availabilityCheck.data) {
        set(dataForEndpoint, property, get(item, property));
      }

      const availability = await this.toolEndpointChecker.fetchWithData(
        availabilityCheck.endpoint,
        dataForEndpoint
      );
      return availability.available;
    }
    const availability = await this.toolEndpointChecker.fetch(
      availabilityCheck.endpoint
    );
    return availability.available;
  }
}
