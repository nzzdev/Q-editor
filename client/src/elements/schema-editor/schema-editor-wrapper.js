import { bindable } from "aurelia-framework";
import { getType } from "./helpers";

export class SchemaEditorWrapper {
  @bindable schema;
  @bindable data;
  @bindable change;
  @bindable required;
  @bindable noObjectTitle;

  constructor() {
    this.getType = getType;
  }
}
