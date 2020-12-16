import { bindable, inject } from "aurelia-framework";
import { LogManager } from "aurelia-framework";
import { getType } from "./helpers";
import mixinDeep from "mixin-deep";
import NotificationChecker from "resources/checkers/NotificationChecker.js";
import AvailabilityChecker from "resources/checkers/AvailabilityChecker.js";
import ToolEndpointChecker from "resources/checkers/ToolEndpointChecker.js";

const log = LogManager.getLogger("Q");

@inject(NotificationChecker, AvailabilityChecker, ToolEndpointChecker, Element)
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

  constructor(
    notificationChecker,
    availabilityChecker,
    toolEndpointChecker,
    element
  ) {
    this.notificationChecker = notificationChecker;
    this.availabilityChecker = availabilityChecker;
    this.toolEndpointChecker = toolEndpointChecker;
    this.element = element;
    this.getType = getType;
  }

  dataChanged() {
    // Clear visible notification if previous notification was of type Required
    if (
      this.visibleNotification &&
      this.visibleNotification.message.title === "notifications.required.title"
    ) {
      this.visibleNotification = "";
    }
  }

  async schemaChanged() {
    if (this.schema.hasOwnProperty("Q:options")) {
      this.options = Object.assign(this.options, this.schema["Q:options"]);
    }
    // handle dynamicSchema
    if (this.options.dynamicSchema && !this.reevaluateDynamicSchemaCallback) {
      if (this.options.dynamicSchema.type !== "ToolEndpoint") {
        throw new Error(
          `${this.options.dynamicSchema.type} is not implemented as dynamicSchema type`
        );
      }
      this.applyDynamicSchema();
      this.reevaluateDynamicSchemaCallback = this.applyDynamicSchema.bind(this);
      this.toolEndpointChecker.registerReevaluateCallback(
        this.reevaluateDynamicSchemaCallback
      );
    }

    // handle notificationChecks
    if (
      Array.isArray(this.options.notificationChecks) &&
      !this.reevaluateAvailabilityCallback
    ) {
      this.applyNotifications();
      this.reevaluateNotificationsCallback = this.applyNotifications.bind(this);
      this.notificationChecker.registerReevaluateCallback(
        this.reevaluateNotificationsCallback
      );
    }

    // handle availabilityChecks
    if (
      Array.isArray(this.options.availabilityChecks) &&
      !this.reevaluateAvailabilityCallback
    ) {
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
        body: "notifications.required.body",
      },
      priority: {
        type: "high",
        value: 1,
      },
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

  async getDynamicSchema(dynamicSchema) {
    try {
      return await this.toolEndpointChecker.check(dynamicSchema.config);
    } catch (e) {
      throw new Error(
        `failed to get dynamicSchema for ${JSON.stringify(dynamicSchema)} ${e}`
      );
    }
  }

  async applyDynamicSchema() {
    try {
      const dynamicSchema = await this.getDynamicSchema(
        this.options.dynamicSchema
      );
      // these properties are not allowed in dynamicSchema, they would lead to problems
      const forbiddenProperties = [
        "notificationChecks",
        "availabilityChecks",
        "dynamicSchema",
      ];
      for (const forbiddenProperty of forbiddenProperties) {
        if (
          dynamicSchema["Q:options"] &&
          dynamicSchema["Q:options"][forbiddenProperty]
        ) {
          log.error(
            `It's not possible to add ${forbiddenProperty} using dynamicSchema`,
            e
          );
          delete dynamicSchema["Q:options"][forbiddenProperty];
        }
      }
      // make a copy of the schema so the schemaChangedCallbacks get applied
      this.schema = Object.assign({}, mixinDeep(this.schema, dynamicSchema));

      // apply default values that are set using dynamicSchema
      if (
        this.schema.default &&
        this.data === undefined &&
        this.data !== this.schema.default
      ) {
        this.data = this.schema.default;
      }
    } catch (e) {
      log.error(
        `Failed to assign dynamicSchema to schema, you need to figure out why this happened as this case is not handled in a nice way and could feel pretty weird.`,
        e
      );
    }
  }
}
