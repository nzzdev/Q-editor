import { inject, LogManager } from "aurelia-framework";
import User from "resources/User.js";

const log = LogManager.getLogger("Q");

@inject(User)
export default class UserHasRoleAvailabilityCheck {
  constructor(user) {
    this.user = user;
  }

  async isAvailable(config) {
    if (!config.role) {
      log.error("no role defined for availabilityCheck userHasRole:", config);
      return false;
    }
    await this.user.loaded;
    return (
      Array.isArray(this.user.roles) && this.user.roles.includes(config.role)
    );
  }
}
