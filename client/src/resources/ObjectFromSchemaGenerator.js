import { inject } from "aurelia-framework";
import IdGenerator from "./IdGenerator.js";

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
            array.push();
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
}
