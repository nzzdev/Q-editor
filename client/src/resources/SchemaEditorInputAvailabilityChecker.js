import { inject } from "aurelia-framework";
import { Container } from "aurelia-dependency-injection";

@inject(Container)
export default class SchemaEditorInputAvailabilityChecker {
  reevaluateCallbacks = [];

  constructor(diContainer) {
    this.diContainer = diContainer;
  }

  triggerReevaluation() {
    for (let cb of this.reevaluateCallbacks) {
      cb();
    }
  }

  registerReevaluateCallback(cb) {
    this.reevaluateCallbacks.push(cb);
    return cb;
  }

  unregisterReevaluateCallback(id) {
    const index = this.reevaluateCallbacks.indexOf(id);
    if (index > -1) {
      this.reevaluateCallbacks.splice(index, 1);
    }
  }

  hasAvailabilityCheck(schema) {
    if (!schema.hasOwnProperty("Q:options")) {
      return false;
    }
    if (!schema["Q:options"]) {
      return false;
    }
    if (!Array.isArray(schema["Q:options"].availabilityChecks)) {
      return false;
    }
    if (schema["Q:options"].availabilityChecks.length < 1) {
      return false;
    }
    return true;
  }

  async getAvailabilityInfo(schema) {
    try {
      if (!this.hasAvailabilityCheck(schema)) {
        return {
          isAvailable: true
        };
      }
      for (let availabilityCheck of schema["Q:options"].availabilityChecks) {
        let checker = this.diContainer.get(
          availabilityCheck.type + "AvailabilityCheck"
        );
        const available = await checker.isAvailable(availabilityCheck);
        if (!available) {
          const availabilityInfo = {
            isAvailable: false
          };
          if (availabilityCheck.hasOwnProperty("unavailableMessage")) {
            availabilityInfo.unavailableMessage =
              availabilityCheck.unavailableMessage;
          }
          return availabilityInfo;
        }
      }
    } catch (e) {
      // if some check went wrong, we go with unavailable
      return {
        isAvailable: false
      };
    }

    // if no check failed here, it is available
    return {
      isAvailable: true
    };
  }
}
