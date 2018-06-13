import { bindable, inject } from "aurelia-framework";
import { getType } from "./helpers";
import { Notification } from "resources/Notification.js";

@inject(Notification)
export class SchemaEditorWrapper {
  @bindable schema;
  @bindable data;
  @bindable change;
  @bindable required;
  @bindable noObjectTitle;

  notificationObject = {};
  options = {};

  constructor(notification) {
    this.notification = notification;
    this.getType = getType;
  }

  async attached() {
    if (this.schema.hasOwnProperty("Q:options")) {
      this.options = Object.assign(this.options, this.schema["Q:options"]);
    }
    this.notificationObject = await this.notification.getNotification(
      this.options.notificationChecks
    );
  }

  async getNotification(event) {
    this.notificationObject = await this.notification.getNotification(
      this.options.notificationChecks,
      event.target
    );
  }
}
