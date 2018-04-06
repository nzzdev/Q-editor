import { inject, LogManager } from "aurelia-framework";
import User from "resources/User.js";

const log = LogManager.getLogger("Q");

@inject(User)
export default class UserHasRoleAvailabilityCheck {
  constructor(user) {
    this.user = user;
  }

  async isAvailable(availabilityCheck) {
    if (!availabilityCheck.role) {
      log.error(
        "no role defined for availabilityCheck userHasRole:",
        availabilityCheck
      );
      return false;
    }
    await this.user.loaded;
    return (
      Array.isArray(this.user.roles) &&
      this.user.roles.includes(availabilityCheck.role)
    );
  }
}
