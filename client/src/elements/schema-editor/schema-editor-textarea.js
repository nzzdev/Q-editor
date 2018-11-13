import { bindable } from "aurelia-framework";

export class SchemaEditorTextarea {
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

  options = {};

  schemaChanged() {
    this.applyOptions();
  }

  applyOptions() {
    if (this.schema.hasOwnProperty("Q:options")) {
      this.options = Object.assign(this.options, this.schema["Q:options"]);
    }
  }
}
