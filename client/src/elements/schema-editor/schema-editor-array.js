import { bindable, computedFrom } from 'aurelia-framework';
import generateFromSchema from 'helpers/generateFromSchema.js';

export class SchemaEditorArray {

  @bindable schema;
  @bindable data;
  @bindable change;

  options = {
    expandable: false
  }

  collapsedStates = {};  

  expand(index) {
    this.collapsedStates[index] = 'expanded';
  }

  collapse(index) {
    this.collapsedStates[index] = 'collapsed';
  }

  schemaChanged() {
    this.applyOptions();
  }

  applyOptions() {
    if (this.schema.hasOwnProperty('Q:options')) {
      this.options = Object.assign(this.options, this.schema['Q:options']);
    }
  }

  addElement(data, schema) {
    let entry = generateFromSchema(schema);
    data.push(entry);
    this.expand(data.indexOf(entry));
    
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
  get labels() {
    let arrayEntryLabel = '';
    if (this.schema && this.schema.items && this.schema.items.title) {
      arrayEntryLabel = this.schema.items.title;
    } else if (this.schema && this.schema.title) {
      arrayEntryLabel = this.schema.title
    }
    let labels = {
      arrayEntryLabel: arrayEntryLabel
    }
    return labels;
  }

}
