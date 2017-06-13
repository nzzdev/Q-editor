import { bindable } from 'aurelia-framework';
import { checkAvailability } from 'resources/schemaEditorDecorators.js';

@checkAvailability()
export class SchemaEditorString {

  @bindable schema;
  @bindable data;
  @bindable change;
  @bindable required;

}
