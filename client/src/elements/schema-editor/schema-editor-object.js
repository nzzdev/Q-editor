import {bindable} from 'aurelia-framework';
import {getType} from './helpers.js';

export class SchemaEditorObject {

  @bindable schema;
  @bindable data;
  @bindable change;

  constructor() {
    this.getType = getType;
  }

  isRequired(schema, propertyName) {
    return schema.hasOwnProperty('required') && schema.required.includes(propertyName)
  }

  activate(model) {
    console.log(model)
    this.schema = model.schema;
    this.data = model.data;
    this.change = model.change;
  }

}
