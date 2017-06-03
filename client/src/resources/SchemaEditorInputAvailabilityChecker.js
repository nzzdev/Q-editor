import { inject, LogManager } from 'aurelia-framework';
import ToolEndpointChecker from 'resources/ToolEndpointChecker.js';
import User from 'resources/User.js';

const log = LogManager.getLogger('Q');

@inject(ToolEndpointChecker, User)
export default class SchemaEditorInputAvailabilityChecker {

  constructor(toolEndpointChecker, user) {
    this.toolEndpointChecker = toolEndpointChecker;
    this.user = user;
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
        let available;
        if (availabilityCheck.type === 'toolEndpoint') {
          available = await this.checkToolEndpoint(availabilityCheck);
        }
        if (availabilityCheck.type === 'userHasRole') {
          available = await this.checkUserHasRole(availabilityCheck);
        }
        // return immediately if check failed
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

  async checkToolEndpoint(availabilityCheck) {
    if (!availabilityCheck.endpoint) {
      log.error('no endpoint defined for availabilityCheck checkToolEndpoint:', availabilityCheck);
      return false;
    }
    if (!availabilityCheck.withData) {
      const availability = await this.toolEndpointChecker.fetch(availabilityCheck.endpoint);
      return availability.available;
    }
    const availability = await this.toolEndpointChecker.fetchWithItem(availabilityCheck.endpoint);
    return availability.available;
  }

  async checkUserHasRole(availabilityCheck) {
    if (!availabilityCheck.role) {
      log.error('no role defined for availabilityCheck userHasRole:', availabilityCheck);
      return false;
    }
    return this.user.roles.includes(availabilityCheck.role);
  }
}
