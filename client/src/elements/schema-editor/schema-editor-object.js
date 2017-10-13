import { bindable } from 'aurelia-framework';
import { getType, isRequired } from './helpers.js';
import { checkAvailability } from 'resources/schemaEditorDecorators.js';

@checkAvailability()
export class SchemaEditorObject {

  @bindable schema;
  @bindable data;
  @bindable change;
  @bindable noObjectTitle;

  constructor() {
    this.getType = getType;
    this.isRequired = isRequired;
  }

  isCompact(schema) {
    if (schema && schema['Q:options'] && schema['Q:options'].compact) {
      return true;
    }
    return false;
  }

}
