import { bindable } from "aurelia-framework";

export class SchemaEditorColor {
  @bindable
  schema;
  @bindable
  data;
  @bindable
  change;
  @bindable
  required;
  @bindable
  showNotifications;
}
