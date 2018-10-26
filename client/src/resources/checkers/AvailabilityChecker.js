import { inject, LogManager } from "aurelia-framework";
import { Container } from "aurelia-dependency-injection";

const log = LogManager.getLogger("Q");

// This function transforms the existing check config to the new format
// After all the tools adopted the new configuration format this is
// not needed anymore
function getConfig(availabilityCheck) {
  const check = JSON.parse(JSON.stringify(availabilityCheck));
  if (check.config) {
    return check.config;
  }
  delete check.type;
  log.info(
    "DEPRECATION NOTICE: In Q editor 4.0 you will have to configure the availabilityCheck with a config property. See https://github.com/nzzdev/Q-editor/blob/master/README.md for details"
  );
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
