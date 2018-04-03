import { bindable } from "aurelia-framework";
import { checkAvailability } from "resources/schemaEditorDecorators.js";
import Ajv from "ajv";

const ajv = new Ajv();

@checkAvailability()
export class SchemaEditorJson {
  @bindable schema;
  @bindable data;
  @bindable change;

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
