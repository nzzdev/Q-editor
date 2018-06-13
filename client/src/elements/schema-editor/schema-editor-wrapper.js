import { bindable, inject } from "aurelia-framework";
import { getType } from "./helpers";
import NotificationChecker from "resources/NotificationChecker.js";

@inject(NotificationChecker)
export class SchemaEditorWrapper {
  @bindable schema;
  @bindable data;
  @bindable change;
  @bindable required;
  @bindable noObjectTitle;

  notificationObject = {};
  options = {};

  constructor(notificationChecker) {
    this.notificationChecker = notificationChecker;
    this.getType = getType;
  }

  async attached() {
    if (this.schema.hasOwnProperty("Q:options")) {
      this.options = Object.assign(this.options, this.schema["Q:options"]);
    }

    // if this has notifications
    if (Array.isArray(this.options.notificationChecks)) {
      this.applyNotifications();
      this.reevaluateCallback = this.applyNotifications.bind(this);
      this.notificationChecker.registerReevaluateCallback(
        this.reevaluateCallback
      );
    }
  }

  detached() {
    this.notificationChecker.unregisterReevaluateCallback(
      this.reevaluateCallback
    );
  }

  async applyNotifications() {
    const newNotifications = await this.notificationChecker.getNotifications(
      this.options.notificationChecks
    );
    this.notifications = newNotifications;
  }
}
