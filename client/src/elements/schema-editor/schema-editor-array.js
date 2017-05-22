import { bindable, computedFrom, LogManager } from 'aurelia-framework';
import { checkAvailability } from 'resources/schemaEditorDecorators.js';
import Ajv from 'ajv';
import generateFromSchema from 'helpers/generateFromSchema.js';

const log = LogManager.getLogger('Q');
const ajv = new Ajv();

@checkAvailability()
export class SchemaEditorArray {

  @bindable schema;
  @bindable data;
  @bindable change;

  options = {
    expandable: false
  }

  collapsedStates = {};

  constructor() {
    this.handleChange = () => {
      this.calculateEntryLabels();
      if (this.change) {
        this.change();
      }
    };
  }

  dataChanged() {
    this.calculateEntryLabels();
  }

  expand(index) {
    this.collapsedStates[index] = 'expanded';
  }

  collapse(index) {
    this.collapsedStates[index] = 'collapsed';
  }

  schemaChanged() {
    this.applyOptions();
    this.calculateEntryLabels();
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
    this.calculateEntryLabels();
    if (this.change) {
      this.change();
    }
  }

  moveElementUp(data, index) {
    data.splice(index - 1, 0, data.splice(index, 1)[0]);
    this.calculateEntryLabels();
    if (this.change) {
      this.change();
    }
  }

  moveElementDown(data, index) {
    data.splice(index + 1, 0, data.splice(index, 1)[0]);
    this.calculateEntryLabels();
    if (this.change) {
      this.change();
    }
  }

  deleteElement(data, index) {
    data.splice(index, 1);
    this.calculateEntryLabels();
    if (this.change) {
      this.change();
    }
  }

  getSchemaForArrayEntry(data) {
    if (this.schema.items.type) {
      return this.schema.items;
    }
    if (this.schema.items.oneOf) {
      for (const schema of this.schema.items.oneOf) {
        const validate = ajv.compile(schema);
        if (validate(data)) {
          return schema;
        }
        log.info('schema-editor-array: no schema match for data');
        log.info('schema-editor-array data:', JSON.stringify(data));
        log.info('schema-editor-array schema:', JSON.stringify(schema));
      }
      return null;
    }
  }

  calculateEntryLabels() {
    if (!this.data || !this.options) {
      return;
    }
    this.entryLabels = this.data
      .map(entry => {
        try {
          if (this.options.expandable.itemLabelProperty) {
            return this.options.expandable.itemLabelProperty.split('.').reduce((o, i) => o[i], entry);
          }
        } catch (e) {
          return undefined;
        }
      });
  }

  @computedFrom('schema')
  get arrayEntryOptions() {
    let arrayEntryOptions = [];

    // if we have a type in the schema in items, we use this as a schema directly
    if (this.schema.items && this.schema.items.type) {
      let arrayEntryLabel = '';
      if (this.schema.items.title) {
        arrayEntryLabel = this.schema.items.title;
      } else if (this.schema.title) {
        arrayEntryLabel = this.schema.title;
      }
      arrayEntryOptions.push({
        schema: this.schema.items,
        arrayEntryLabel: arrayEntryLabel
      });
    } else if (this.schema.items && this.schema.items.oneOf) {
      for (let schema of this.schema.items.oneOf) {
        arrayEntryOptions.push({
          schema: schema,
          arrayEntryLabel: schema.title
        });
      }
    }
    return arrayEntryOptions;
  }

}
