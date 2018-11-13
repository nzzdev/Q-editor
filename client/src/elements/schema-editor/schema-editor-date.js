import { bindable } from "aurelia-framework";

export class SchemaEditorDate {
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
