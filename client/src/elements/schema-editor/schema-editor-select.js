import { bindable } from "aurelia-framework";
import { resolveDynamicEnum } from "resources/schemaEditorDecorators.js";

@resolveDynamicEnum()
export class SchemaEditorSelect {
  @bindable
  schema;
  @bindable
  data;
  @bindable
  change;
  @bindable
  showNotifications;

  schemaChanged(schema) {
    if (schema["Q:options"] && schema["Q:options"].enum_titles) {
      this.optionLabels = schema["Q:options"].enum_titles;
    } else {
      this.optionLabels = schema.enum;
    }
    if (schema["Q:options"] && schema["Q:options"].selectType === "radio") {
      this.selectType = "radio";
    } else {
      this.selectType = "select";
    }
  }
}
