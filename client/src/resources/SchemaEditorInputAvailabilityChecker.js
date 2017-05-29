import { inject } from 'aurelia-framework';
import ToolEndpointChecker from 'resources/ToolEndpointChecker.js';

@inject(ToolEndpointChecker)
export default class SchemaEditorInputAvailabilityChecker {

  constructor(toolEndpointChecker) {
    this.toolEndpointChecker = toolEndpointChecker;
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
      let checkPromises = [];
      for (let availabilityCheck of schema['Q:options'].availabilityChecks) {
        if (availabilityCheck.type === 'toolEndpoint') {
          checkPromises.push(this.checkToolEndpoint(availabilityCheck));
        }
      }
      return await Promise.all(checkPromises);
    } catch (e) {
      return false;
    }
  }

  async checkToolEndpoint(availabilityCheck) {
    if (!availabilityCheck.withData) {
      const availability = await this.toolEndpointChecker.fetch(availabilityCheck.endpoint);
      if (availability.available === false) {
        return Promise.reject('not available: ' + JSON.stringify(availabilityCheck));
      }
    } else {
      const availability = await this.toolEndpointChecker.fetchWithItem(availabilityCheck.endpoint);
      if (availability.available === false) {
        return Promise.reject('not available: ' + JSON.stringify(availabilityCheck));
      }
    }
    return true;
  }
}
