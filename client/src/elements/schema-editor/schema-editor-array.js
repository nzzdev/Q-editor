import { inject, bindable } from 'aurelia-framework';
import { checkAvailability } from 'resources/schemaEditorDecorators.js';
import SchemaEditorInputAvailabilityChecker from 'resources/SchemaEditorInputAvailabilityChecker.js';
import Ajv from 'ajv';
import ObjectFromSchemaGenerator from 'resources/ObjectFromSchemaGenerator.js';

const ajv = new Ajv();

@checkAvailability()
@inject(SchemaEditorInputAvailabilityChecker, ObjectFromSchemaGenerator)
export class SchemaEditorArray {

  @bindable schema;
  @bindable data;
  @bindable change;

  arrayEntryOptions = [];

  options = {
    expandable: false
  }

  collapsedStates = {};

  constructor(schemaEditorInputAvailabilityChecker, objectFromSchemaGenerator) {
    this.schemaEditorInputAvailabilityChecker = schemaEditorInputAvailabilityChecker;
    this.objectFromSchemaGenerator = objectFromSchemaGenerator;
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
    this.calculateArrayEntryOptions();
    this.calculateEntryLabels();
  }

  applyOptions() {
    if (this.schema.hasOwnProperty('Q:options')) {
      this.options = Object.assign(this.options, this.schema['Q:options']);
    }
  }

  addElement(data, schema) {
    let entry = this.objectFromSchemaGenerator.generateFromSchema(schema);
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

  getSchemaForArrayEntry(entry) {
    if (this.schema.items.type) {
      return this.schema.items;
    }
    if (this.schema.items.oneOf) {
      for (const schema of this.schema.items.oneOf) {
        // ignore any required properties here to allow for required properties without default value
        // clone the schema first to not mess with original
        const validateSchema = JSON.parse(JSON.stringify(schema));
        delete validateSchema.required;
        const validate = ajv.compile(validateSchema);
        if (validate(entry)) {
          // return the original schema with required in case of a match
          return schema;
        }
      }
      return null;
    }
  }

  async isEntryAvailable(entry) {
    const schema = this.getSchemaForArrayEntry(entry);
    const availabilityInfo = await this.schemaEditorInputAvailabilityChecker.getAvailabilityInfo(schema);
    return await availabilityInfo.isAvailable;
  }

  async calculateArrayEntryOptions() {
    // reset options
    this.arrayEntryOptions = [];

    // if we have a type in the schema in items, we use this as a schema directly
    if (this.schema.items && this.schema.items.type) {
      let arrayEntryLabel = '';
      if (this.schema.items.title) {
        arrayEntryLabel = this.schema.items.title;
      } else if (this.schema.title) {
        arrayEntryLabel = this.schema.title;
      }
      this.arrayEntryOptions.push({
        schema: this.schema.items,
        arrayEntryLabel: arrayEntryLabel
      });
    } else if (this.schema.items && this.schema.items.oneOf) {
      for (let schema of this.schema.items.oneOf) {
        const availabilityInfo = await this.schemaEditorInputAvailabilityChecker.getAvailabilityInfo(schema);
        if (availabilityInfo.isAvailable) {
          this.arrayEntryOptions.push({
            schema: schema,
            arrayEntryLabel: schema.title
          });
        }
      }
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
            return this.options.expandable.itemLabelProperty
              .split('.')
              .reduce((o, i) => o[i], entry);
          }
        } catch (e) {
          return undefined;
        }
      });
  }
}
