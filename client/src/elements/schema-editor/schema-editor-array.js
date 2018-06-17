import { inject, bindable } from "aurelia-framework";
import AvailabilityChecker from "resources/checkers/AvailabilityChecker.js";
import Ajv from "ajv";
import ObjectFromSchemaGenerator from "resources/ObjectFromSchemaGenerator.js";

const ajv = new Ajv();

@inject(AvailabilityChecker, ObjectFromSchemaGenerator)
export class SchemaEditorArray {
  @bindable schema;
  @bindable data;
  @bindable change;
  @bindable notifications;
  @bindable showNotifications;

  arrayEntryOptions = [];

  options = {
    expandable: false
  };

  collapsedStates = {};

  constructor(availabilityChecker, objectFromSchemaGenerator) {
    this.availabilityChecker = availabilityChecker;
    this.objectFromSchemaGenerator = objectFromSchemaGenerator;
    this.handleChange = () => {
      this.calculateEntryLabels();
      if (this.change) {
        this.change();
      }
    };
  }

  dataChanged() {
    // create a new dataItemsSchema array
    // this array will hold the schema per data array item
    // and will mirror any changes to the array
    // this way, we do not need to calculate the schemas for the data
    // on all changes. For addElement we already know the schema beforehand e.g.
    if (Array.isArray(this.data)) {
      this.dataItemsSchemas = this.data.map(item => {
        return this.getSchemaForData(item);
      });
    }

    this.calculateEntryLabels();
  }

  expand(index) {
    this.collapsedStates[index] = "expanded";
  }

  collapse(index) {
    this.collapsedStates[index] = "collapsed";
  }

  schemaChanged() {
    this.applyOptions();
    this.calculateArrayEntryOptions();
    this.calculateEntryLabels();
  }

  applyOptions() {
    if (this.schema.hasOwnProperty("Q:options")) {
      this.options = Object.assign(this.options, this.schema["Q:options"]);
    }
  }

  addElement(schema) {
    if (this.data === undefined) {
      this.data = [];
    }
    const entry = this.objectFromSchemaGenerator.generateFromSchema(schema);

    this.dataItemsSchemas.push(schema);
    this.data.push(entry);

    this.expand(this.data.indexOf(entry));
    this.calculateEntryLabels();
    if (this.change) {
      this.change();
    }
  }

  moveElementUp(index) {
    this.dataItemsSchemas.splice(
      index - 1,
      0,
      this.dataItemsSchemas.splice(index, 1)[0]
    );
    this.data.splice(index - 1, 0, this.data.splice(index, 1)[0]);
    this.calculateEntryLabels();
    if (this.change) {
      this.change();
    }
  }

  moveElementDown(index) {
    this.dataItemsSchemas.splice(
      index + 1,
      0,
      this.dataItemsSchemas.splice(index, 1)[0]
    );
    this.data.splice(index + 1, 0, this.data.splice(index, 1)[0]);
    this.calculateEntryLabels();
    if (this.change) {
      this.change();
    }
  }

  deleteElement(index) {
    this.dataItemsSchemas.splice(index, 1);
    this.data.splice(index, 1);
    this.calculateEntryLabels();
    if (this.change) {
      this.change();
    }
  }

  getSchemaForArrayEntryIndex(index) {
    return this.dataItemsSchemas[index];
  }

  async isItemWithSchemaAvailable(schema) {
    if (
      !schema.hasOwnProperty("Q:options") ||
      !Array.isArray(schema["Q:options"].availabilityChecks)
    ) {
      return true;
    }
    const availabilityInfo = await this.availabilityChecker.getAvailabilityInfo(
      schema["Q:options"].availabilityChecks
    );
    return await availabilityInfo.isAvailable;
  }

  async isEntryAvailable(index) {
    const schema = this.getSchemaForArrayEntryIndex(index);
    return await this.isItemWithSchemaAvailable(schema);
  }

  async calculateArrayEntryOptions() {
    // reset options
    this.arrayEntryOptions = [];

    // if we have a type in the schema in items, we use this as a schema directly
    if (this.schema.items && this.schema.items.type) {
      let arrayEntryLabel = "";
      if (this.schema.items.title) {
        arrayEntryLabel = this.schema.items.title;
      } else if (this.schema.title) {
        arrayEntryLabel = this.schema.title;
      }
      this.arrayEntryOptions.push({
        schema: this.schema.items,
        arrayEntryLabel: arrayEntryLabel
      });
    } else if (
      this.schema.items &&
      Array.isArray(this.getPossibleItemSchemas())
    ) {
      for (let schema of this.getPossibleItemSchemas()) {
        if (await this.isItemWithSchemaAvailable(schema)) {
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
    this.entryLabels = this.data.map(entry => {
      // if options.expandable.itemLabelProperty is an Array we try to get the property in order of the array
      // and return with the first option that works.
      if (Array.isArray(this.options.expandable.itemLabelProperty)) {
        for (let itemLabelProperty of this.options.expandable
          .itemLabelProperty) {
          let label = this.getEntryLabel(entry, itemLabelProperty);
          if (label) {
            return label;
          }
        }
      } else if (
        typeof this.options.expandable.itemLabelProperty === "string"
      ) {
        return this.getEntryLabel(
          entry,
          this.options.expandable.itemLabelProperty
        );
      }
      return undefined;
    });
  }

  getEntryLabel(entry, itemLabelProperty) {
    try {
      return itemLabelProperty.split(".").reduce((o, i) => o[i], entry);
    } catch (e) {
      return undefined;
    }
  }

  getSchemaForData(data) {
    if (this.schema.items.type) {
      return this.schema.items;
    }
    const possibleSchemas = this.getPossibleItemSchemas();
    if (possibleSchemas) {
      for (const schema of possibleSchemas) {
        const validate = ajv.compile(schema);
        if (validate(data)) {
          return schema;
        }
      }
      return null;
    }
  }

  getPossibleItemSchemas() {
    let possibleSchemas;
    if (this.schema.items.oneOf) {
      possibleSchemas = this.schema.items.oneOf;
    } else if (this.schema.items.anyOf) {
      possibleSchemas = this.schema.items.anyOf;
    } else if (this.schema.items.allOf) {
      possibleSchemas = this.schema.items.allOf;
    }
    return possibleSchemas;
  }
}
