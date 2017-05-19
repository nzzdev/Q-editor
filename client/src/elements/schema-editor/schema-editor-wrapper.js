import { bindable } from 'aurelia-framework';
import { getType } from './helpers';

export class SchemaEditorWrapper {

  @bindable schema;
  @bindable data;
  @bindable change;
  @bindable required;

  constructor() {
    this.getType = getType;
  }

}
