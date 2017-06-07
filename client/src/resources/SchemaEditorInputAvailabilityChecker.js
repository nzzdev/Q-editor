import { inject } from 'aurelia-framework';
import { Container } from 'aurelia-dependency-injection';
import ToolEndpointChecker from 'resources/ToolEndpointChecker.js';

@inject(ToolEndpointChecker, Container)
export default class SchemaEditorInputAvailabilityChecker {

  constructor(toolEndpointChecker, diContainer) {
    this.toolEndpointChecker = toolEndpointChecker;
    this.diContainer = diContainer;
  }

  registerReevaluateCallback(cb) {
    return this.toolEndpointChecker.registerReevaluateCallback(cb);
  }

  unregisterReevaluateCallback(id) {
    return this.toolEndpointChecker.unregisterReevaluateCallback(id);
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
