import { bindable } from "aurelia-framework";

export class Notification {
  @bindable notification;

  hasIcon = false;
  iconName = "";

  notificationChanged() {
    if (this.notification.priority) {
      this.hasIcon = ["medium", "high"].includes(
        this.notification.priority.type
      );
      this.iconName = `notification-${this.notification.priority.type}`;
    }
  }
}
