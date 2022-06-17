import { bindable } from "aurelia-framework";

export class SchemaEditorTime {
  @bindable
  data;
  @bindable
  schema;
  @bindable
  change;
  @bindable
  required;
  @bindable
  showNotifications;

  options = {
    step: "any"
  };

  schemaChanged() {
    this.applyOptions();
  }

  applyOptions() {
    if (!this.schema) {
      return;
    }
    if (this.schema.hasOwnProperty("Q:options")) {
      this.options = Object.assign(this.options, this.schema["Q:options"]);
    }
  }
}
