import { inject } from 'aurelia-framework';
import { Container } from 'aurelia-dependency-injection';
import ToolEndpointChecker from 'resources/ToolEndpointChecker.js';

@inject(ToolEndpointChecker, Container)
export default class SchemaEditorInputAvailabilityChecker {

  reevaluateCallbacks = [];

  constructor(toolEndpointChecker, diContainer) {
    this.toolEndpointChecker = toolEndpointChecker;
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
    if (!schema.hasOwnProperty('Q:options')) {
      return false;
    }
    if (!schema['Q:options']) {
      return false;
    }
    if (!Array.isArray(schema['Q:options'].availabilityChecks)) {
      return false;
    }
    if (schema['Q:options'].availabilityChecks.length < 1) {
      return false;
    }
    return true;
  }

  async isAvailable(schema) {
    try {
      if (!this.hasAvailabilityCheck(schema)) {
        return true;
      }
      for (let availabilityCheck of schema['Q:options'].availabilityChecks) {
        let checker = this.diContainer.get(availabilityCheck.type + 'AvailabilityCheck');
        const available = await checker.isAvailable(availabilityCheck);
        if (!available) {
          return false;
        }
      }
    } catch (e) {
      // if some check went wrong, we go with unavailable
      return false;
    }

    // if no check failed here, it is available
    return true;
  }
}
