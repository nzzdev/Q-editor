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
      let checkPromises = [];
      for (let availabilityCheck of schema['Q:options'].availabilityChecks) {
        if (availabilityCheck.type === 'toolEndpoint') {
          checkPromises.push(this.checkToolEndpoint(availabilityCheck));
        }
        if (availabilityCheck.type === 'userHasRole') {
          checkPromises.push(this.checkUserHasRole(availabilityCheck));
        }
      }
      return await Promise.all(checkPromises);
    } catch (e) {
      return false;
    }
  }

  async checkToolEndpoint(availabilityCheck) {
    if (!availabilityCheck.endpoint) {
      log.error('no endpoint defined for availabilityCheck checkToolEndpoint:', availabilityCheck);
      return false;
    }
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

  async checkUserHasRole(availabilityCheck) {
    if (!availabilityCheck.role) {
      log.error('no role defined for availabilityCheck userHasRole:', availabilityCheck);
      return false;
    }
    return this.user.roles.includes(availabilityCheck.role);
  }
}
