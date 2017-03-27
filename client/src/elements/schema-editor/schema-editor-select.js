import { bindable } from 'aurelia-framework';

export class SchemaEditorSelect {

  @bindable schema;
  @bindable data;
  @bindable change;
  @bindable options;

  schemaChanged(schema) {
    if (schema['Q:options'] && schema['Q:options'].enum_titles) {
      this.optionLabels = schema['Q:options'].enum_titles;
    } else {
      this.optionLabels = schema.enum;
    }
  }

}
