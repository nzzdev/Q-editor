import ToolEndpointAvailabilityCheck from './ToolEndpointAvailabilityCheck.js';
import UserHasRoleAvailabilityCheck from './UserHasRoleAvailabilityCheck.js';
import ItemHasIdAvailabilityCheck from './ItemHasIdAvailabilityCheck.js';

export function configure(frameworkConfiguration) {
  frameworkConfiguration.singleton('ToolEndpointAvailabilityCheck', ToolEndpointAvailabilityCheck);
  frameworkConfiguration.singleton('UserHasRoleAvailabilityCheck', UserHasRoleAvailabilityCheck);
  frameworkConfiguration.singleton('ItemHasIdAvailabilityCheck', ItemHasIdAvailabilityCheck);
}
