import { bindable, computedFrom } from 'aurelia-framework';
import generateFromSchema from 'helpers/generateFromSchema.js';

export class SchemaEditorArray {

  @bindable schema;
  @bindable data;
  @bindable change;

  addElement(data, schema) {
    let entry = generateFromSchema(schema);
    data.push(entry);
    if (this.change) {
      this.change();
    }
  }

  moveElementUp(data, index) {
    data.splice(index - 1, 0, data.splice(index, 1)[0])
    if (this.change) {
      this.change();
    }
  }

  moveElementDown(data, index) {
    data.splice(index + 1, 0, data.splice(index, 1)[0])
    if (this.change) {
      this.change();
    }
  }

  deleteElement(data, index) {
    data.splice(index, 1);
    if (this.change) {
      this.change();
    }
  }

  @computedFrom('schema')
  get arrayEntryLabel() {
    if (this.schema && this.schema.items && this.schema.items.title) {
      return this.schema.items.title;
    } else if (this.schema && this.schema.title) {
      return this.schema.title
    }
  }
}
