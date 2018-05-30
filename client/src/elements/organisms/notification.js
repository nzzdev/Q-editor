import { bindable } from "aurelia-framework";

export class Notification {
  @bindable notification;

  hasIcon = false;
  iconName = "";

  constructor(notification) {
    this.notification = notification;
  }

  notificationChanged() {
    this.hasIcon = ["medium", "high"].includes(this.notification.priority);
    this.iconName = `notification-${this.notification.priority}`;
  }
}
