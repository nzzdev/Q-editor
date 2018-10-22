import { inject, LogManager } from "aurelia-framework";
import ToolEndpointChecker from "resources/checkers/ToolEndpointChecker.js";
import CurrentItemProvider from "resources/CurrentItemProvider.js";

const log = LogManager.getLogger("Q");

function getDescendantProperty(obj, path) {
  return path.split(".").reduce((acc, part) => acc && acc[part], obj);
}
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
      const data = availabilityCheck.data.map(property =>
        getDescendantProperty(item, property)
      );
      const availability = await this.toolEndpointChecker.fetchWithData(
        availabilityCheck.endpoint,
        data
      );
      return availability.available;
    }
    const availability = await this.toolEndpointChecker.fetch(
      availabilityCheck.endpoint
    );
    return availability.available;
  }
}
