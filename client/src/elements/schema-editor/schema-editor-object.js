import { bindable } from "aurelia-framework";
import { getType, isRequired } from "./helpers.js";

export class SchemaEditorObject {
  @bindable schema;
  @bindable data;
  @bindable change;
  @bindable noObjectTitle;
  @bindable notifications;
  @bindable showNotifications;

  constructor() {
    this.getType = getType;
    this.isRequired = isRequired;
  }

  // this makes it possible to add new objects to the schema without running a migration
  // existing items are not updated with new defaults from the schema, thus not setting this to an empty object
  // results in errors when the schema-editor tries to access a property on undefined
  // maybe this would be better solved by updating existing items with the current schema defaults
  dataChanged() {
    if (this.data === undefined) {
      this.data = {};
    }
  }

  isCompact(schema) {
    if (schema && schema["Q:options"] && schema["Q:options"].compact) {
      return true;
    }
    return false;
  }
}
