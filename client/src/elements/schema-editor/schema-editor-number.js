import { bindable } from "aurelia-framework";

export class SchemaEditorNumber {
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

  onWheel(event) {
    console.log("wheel!")
    if (event && event.target === document.activeElement) {
      // Bluring the input field prevents changing the value while using the mouse wheel
      console.log("focus!")
      event.target.blur();
    }
    return true;
  }
}
