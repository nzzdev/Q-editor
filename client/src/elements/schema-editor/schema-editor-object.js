import { bindable } from 'aurelia-framework';
import { getType } from './helpers.js';
import { checkAvailability } from 'resources/schemaEditorDecorators.js';

@checkAvailability()
export class SchemaEditorObject {

  @bindable schema;
  @bindable data;
  @bindable change;

  constructor() {
    this.getType = getType;
  }

  isRequired(schema, propertyName) {
    return schema.hasOwnProperty('required') && schema.required.includes(propertyName);
  }

  isCompact(schema) {
    if (schema && schema['Q:options'] && schema['Q:options'].compact) {
      return true;
    }
    return false;
  }

}
