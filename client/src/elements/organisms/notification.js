import { bindable } from "aurelia-framework";

export class Notification {
  @bindable notification;

  constructor(notification) {
    this.notification = notification;
  }
}
