import ToolEndpointAvailabilityCheck from './ToolEndpointAvailabilityCheck.js';
import UserHasRoleAvailabilityCheck from './UserHasRoleAvailabilityCheck.js';

export function configure(frameworkConfiguration) {
  frameworkConfiguration.singleton('ToolEndpointAvailabilityCheck', ToolEndpointAvailabilityCheck);
  frameworkConfiguration.singleton('UserHasRoleAvailabilityCheck', UserHasRoleAvailabilityCheck);
}
