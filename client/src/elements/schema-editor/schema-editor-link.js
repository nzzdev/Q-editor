import { bindable } from "aurelia-framework";
import { checkAvailability } from "resources/schemaEditorDecorators.js";

@checkAvailability()
export class SchemaEditorLink {
  @bindable data;
  @bindable schema;
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

  handleUrlChange() {
    if (this.urlInput.validity.valid) {
      // todo, use a cors proxy / Q Server to test if the link is really valid.
      this.data.isValid = true;
    }
    this.change();
  }
}
