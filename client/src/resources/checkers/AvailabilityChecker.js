import { inject } from "aurelia-framework";
import { Container } from "aurelia-dependency-injection";

// This function transforms the existing check config to the new format
// After all the tools adopted the new configuration format this is
// not needed anymore
function getConfig(availabilityCheck) {
  const check = JSON.parse(JSON.stringify(availabilityCheck));
  if (check.config) {
    return check.config;
  }
  delete check.type;
  if (check.data) {
    check.fields = check.data;
    delete check.data;
  }
  return check;
}

@inject(Container)
export default class AvailabilityChecker {
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

  async getAvailabilityInfo(availabilityChecks) {
    try {
      for (let availabilityCheck of availabilityChecks) {
        let checker = this.diContainer.get(
          availabilityCheck.type + "AvailabilityCheck"
        );

        const available = await checker.isAvailable(
          getConfig(availabilityCheck)
        );
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
