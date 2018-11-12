import { bindable } from "aurelia-framework";
import Ajv from "ajv";

const ajv = new Ajv();

export class SchemaEditorJson {
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

  constructor() {
    this.handleChange = () => {
      this.validate();
      if (this.change) {
        this.change();
      }
    };
  }

  schemaChanged() {
    if (this.schema) {
      this.ajvValidate = ajv.compile(this.schema);
      this.applyOptions();
    }
  }

  applyOptions() {
    if (this.schema.hasOwnProperty("Q:options")) {
      this.options = Object.assign(this.options, this.schema["Q:options"]);
    }
  }

  validate() {
    if (this.ajvValidate(this.data)) {
      this.inputElement.setCustomValidity("");
    } else {
      let errorMessages = this.ajvValidate.errors.map(error => error.message);
      this.inputElement.setCustomValidity(`${errorMessages.join("<br>")}`);
    }
  }
}
