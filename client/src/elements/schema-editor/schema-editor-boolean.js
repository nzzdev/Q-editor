import { bindable } from 'aurelia-framework';
import { checkAvailability } from 'resources/schemaEditorDecorators.js';

@checkAvailability()
export class SchemaEditorBoolean {

  @bindable schema;
  @bindable data;
  @bindable change;

}
