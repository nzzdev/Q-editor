import { bindable } from 'aurelia-framework';
import { checkAvailability } from 'resources/schemaEditorDecorators.js';

@checkAvailability()
export class SchemaEditorDate {

  @bindable schema;
  @bindable data;
  @bindable change;
  @bindable required;

}
