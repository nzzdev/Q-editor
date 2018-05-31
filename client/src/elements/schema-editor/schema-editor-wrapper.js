import { bindable, inject } from "aurelia-framework";
import { getType } from "./helpers";
import { Validation } from "resources/Validation.js";

@inject(Validation)
export class SchemaEditorWrapper {
  @bindable schema;
  @bindable data;
  @bindable change;
  @bindable required;
  @bindable noObjectTitle;

  notification = {};
  options = {};

  constructor(validation) {
    this.validation = validation;
    this.getType = getType;
  }

  async attached() {
    if (this.schema.hasOwnProperty("Q:options")) {
      this.options = Object.assign(this.options, this.schema["Q:options"]);
    }
    this.notification = await this.validation.validate(
      this.options.validationRules
    );
  }

  async validate(event) {
    this.notification = await this.validation.validate(
      this.options.validationRules,
      event.target
    );
  }
}
