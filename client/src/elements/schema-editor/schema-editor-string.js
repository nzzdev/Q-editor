import { bindable } from "aurelia-framework";
import { checkAvailability } from "resources/schemaEditorDecorators.js";

@checkAvailability()
export class SchemaEditorString {
  @bindable schema;
  @bindable data;
  @bindable change;
  @bindable required;

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
