import { bindable, inject } from "aurelia-framework";
import { getType } from "./helpers";
import NotificationChecker from "resources/checkers/NotificationChecker.js";
import AvailabilityChecker from "resources/checkers/AvailabilityChecker.js";

@inject(NotificationChecker, AvailabilityChecker, Element)
export class SchemaEditorWrapper {
  @bindable
  schema;
  @bindable
  data;
  @bindable
  change;
  @bindable
  required;
  @bindable
  notifications;
  @bindable
  showNotifications;
  @bindable
  noObjectTitle;

  options = {};

  constructor(notificationChecker, availabilityChecker, element) {
    this.notificationChecker = notificationChecker;
    this.availabilityChecker = availabilityChecker;
    this.element = element;
    this.getType = getType;
  }

  dataChanged() {
    // Clear visible notification if previous notification was of type Required
    if (
      this.visibleNotification &&
      this.visibleNotification.message.title ===
      "notifications.required.title"
    ) {
      this.visibleNotification = "";
    }
  }

  async schemaChanged() {
    if (this.schema.hasOwnProperty("Q:options")) {
      this.options = Object.assign(this.options, this.schema["Q:options"]);
    }

    // if this has notificationChecks
    if (Array.isArray(this.options.notificationChecks)) {
      this.applyNotifications();
      this.reevaluateNotificationsCallback = this.applyNotifications.bind(this);
      this.notificationChecker.registerReevaluateCallback(
        this.reevaluateNotificationsCallback
      );
    }

    // if this has availabilityChecks
    if (Array.isArray(this.options.availabilityChecks)) {
      this.applyAvailability();
      this.reevaluateAvailabilityCallback = this.applyAvailability.bind(this);
      this.availabilityChecker.registerReevaluateCallback(
        this.reevaluateAvailabilityCallback
      );
    }
  }

  detached() {
    this.notificationChecker.unregisterReevaluateCallback(
      this.reevaluateNotificationsCallback
    );
    this.availabilityChecker.unregisterReevaluateCallback(
      this.reevaluateAvailabilityCallback
    );
  }

  async applyNotifications() {
    const newNotifications = await this.notificationChecker.getNotifications(
      this.options.notificationChecks
    );
    // the visibleNotification is shown directly if showNotifications is true
    this.visibleNotification = newNotifications[0];
    // the notifications array is passed down the schema-editor childs to hold all notifications
    // in the object tree
    this.notifications.push(newNotifications[0]);
  }

  showRequiredNotification() {
    this.visibleNotification = {
      message: {
        title: "notifications.required.title",
        body: "notifications.required.body"
      },
      priority: {
        type: "high",
        value: 1
      }
    };
  }

  async applyAvailability() {
    if (!this.unavailableMessageElement) {
      this.unavailableMessageElement = this.element.ownerDocument.createElement(
        "div"
      );
      this.unavailableMessageElement.classList.add("q-text");
    }
    const availability = await this.availabilityChecker.getAvailabilityInfo(
      this.options.availabilityChecks
    );
    if (availability.isAvailable) {
      this.element.style.display = "flex";
      if (
        this.unavailableMessageElement.parentNode === this.element.parentNode
      ) {
        this.element.parentNode.removeChild(this.unavailableMessageElement);
      }
    } else {
      this.element.style.display = "none";

      if (availability.unavailableMessage) {
        this.unavailableMessageElement.innerHTML =
          availability.unavailableMessage;
        this.element.parentNode.insertBefore(
          this.unavailableMessageElement,
          this.element
        );
      }
    }
  }
}
