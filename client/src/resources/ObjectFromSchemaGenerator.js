import { inject, LogManager } from "aurelia-framework";
const log = LogManager.getLogger("Q");
import IdGenerator from "./IdGenerator.js";
import Ajv from "ajv";
const ajv = new Ajv();

@inject(IdGenerator)
export default class ObjectFromSchemaGenerator {
  constructor(idGenerator) {
    this.idGenerator = idGenerator;
  }

  getDefaultOrNull(schema) {
    if (schema.hasOwnProperty("default")) {
      if (typeof schema.default === "object") {
        return JSON.parse(JSON.stringify(schema.default));
      }
      return schema.default;
    }
    if (schema.hasOwnProperty("Q:default")) {
      if (schema["Q:default"] === "generatedId") {
        const id = this.idGenerator.getIdWithCurrentItemId();
        if (id === undefined || id === null) {
          throw new Error(
            "failed to generate id with item id as item has no id yet"
          );
        }
        return id;
      }
    }
    return null;
  }

  generateFromSchema(schema) {
    if (schema.type === "array") {
      let array = [];
      if (schema.minItems !== undefined) {
        for (let i = 0; i < schema.minItems; i++) {
          let value = this.generateFromSchema(schema.items);
          if (value) {
            array.push(value);
          }
        }
      }
      const defaultValue = this.getDefaultOrNull(schema);
      if (defaultValue !== null) {
        array = defaultValue;
      }
      return array;
    } else if (schema.type === "object") {
      const defaultValue = this.getDefaultOrNull(schema);
      if (defaultValue !== null) {
        return defaultValue;
      }
      if (!schema.hasOwnProperty("properties")) {
        return undefined;
      }
      const object = {};
      Object.keys(schema.properties).forEach(propertyName => {
        if (schema.properties[propertyName]["Q:deprecated"]) {
          return;
        }
        let value = this.generateFromSchema(schema.properties[propertyName]);
        if (value !== undefined) {
          object[propertyName] = value;
        }
      });
      return object;
    }

    // if this is not an array or object, we just get the default if any
    const defaultValue = this.getDefaultOrNull(schema);
    if (defaultValue !== null) {
      return defaultValue;
    }
    return undefined;
  }

  generateFromItemAndSchema(itemPart, schema, idForIdGenerator) {
    // clone to not overwrite original
    try {
      itemPart = JSON.parse(JSON.stringify(itemPart));
    } catch (e) {
      if (itemPart === undefined) {
        return undefined;
      }
      log.error(e);
      return undefined;
    }

    // if the current itemPart is an object, we remove the properties that are not defined in the schema
    // this is especially to get rid of any metaproperties that will be added outside of the scope of this function.
    if (schema.type === "object") {
      Object.keys(itemPart).forEach(propertyName => {
        // if we do not have properties on an object, this is a special schema-editor.
        // so we need to handle them
        if (!schema.hasOwnProperty("properties")) {
          if (schema.hasOwnProperty["Q:type"]) {
            // there are certain special types that are allowed to have no additional properties defined in the schema.
            // if it is one of these, we return here to keep the data in the copied item
            if (["files", "json"].includes(schema["Q:type"])) {
              return;
            }
          }
        }
        // if the schema has no properties or doesn't include a property we delete it from the data
        if (
          !schema.hasOwnProperty("properties") ||
          !schema.properties.hasOwnProperty(propertyName)
        ) {
          delete itemPart[propertyName];
          return;
        }
      });
    }

    if (schema.type === "array") {
      // add new elements to the array if we do not meet minItems
      const newArrayItems = [];
      if (schema.minItems !== undefined) {
        if (itemPart.length < schema.minItems) {
          const numberOfArrayItemsToAdd = schema.minItems - itemPart.length;
          for (let i = 0; i < numberOfArrayItemsToAdd; i++) {
            const defaultValue = this.getDefaultOrNull(schema);
            if (defaultValue !== null) {
              newArrayItems.push(defaultValue);
            }
          }
        }
      }
      // loop over all existing array items to handle them and concat with any new ones generated above
      return itemPart
        .map(arrayItem => {
          const arrayItemSchema = this.getArrayItemSchemaForData(
            arrayItem,
            schema
          );
          const value = this.generateFromItemAndSchema(
            arrayItem,
            arrayItemSchema,
            idForIdGenerator
          );
          return value;
        })
        .concat(newArrayItems);
    } else if (schema.type === "object") {
      if (!schema.hasOwnProperty("properties")) {
        return undefined;
      }
      Object.keys(schema.properties).forEach(propertyName => {
        let value = this.generateFromItemAndSchema(
          itemPart[propertyName],
          schema.properties[propertyName],
          idForIdGenerator
        );
        if (value !== undefined) {
          itemPart[propertyName] = value;
        }
      });
      return itemPart;
    }
    // if this itemPart is a generatedId, we regenerate the id
    if (schema.hasOwnProperty("Q:default")) {
      if (schema["Q:default"] === "generatedId") {
        const id = this.idGenerator.getIdWithId(idForIdGenerator);
        if (id === undefined || id === null) {
          throw new Error(
            "failed to generate id with item id as item has no id yet"
          );
        }
        return id;
      }
    }
    // in all other cases, we return the existing value
    return itemPart;
  }

  getArrayItemSchemaForData(data, schema) {
    if (schema.items.type) {
      return schema.items;
    }
    const possibleSchemas = this.getPossibleItemSchemas(schema);
    if (possibleSchemas) {
      for (const possibleSchema of possibleSchemas) {
        const validate = ajv.compile(possibleSchema);
        if (validate(data)) {
          return possibleSchema;
        }
      }
      return null;
    }
  }

  getPossibleItemSchemas(schema) {
    let possibleSchemas;
    if (schema.items.oneOf) {
      possibleSchemas = schema.items.oneOf;
    } else if (schema.items.anyOf) {
      possibleSchemas = schema.items.anyOf;
    } else if (schema.items.allOf) {
      possibleSchemas = schema.items.allOf;
    }
    return possibleSchemas;
  }
}
