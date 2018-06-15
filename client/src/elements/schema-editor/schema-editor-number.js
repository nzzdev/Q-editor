import { bindable } from "aurelia-framework";

export class SchemaEditorNumber {
  @bindable data;
  @bindable schema;
  @bindable change;
  @bindable required;

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
