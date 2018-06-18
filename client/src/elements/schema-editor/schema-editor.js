import { bindable } from "aurelia-framework";

export class SchemaEditor {
  @bindable schema;
  @bindable data;
  @bindable change;
  @bindable notifications;
  @bindable showNotifications;
}
