export default function generateFromSchema(schema) {
  if (schema.type === 'string' || schema.type === 'boolean') {
    if (schema.hasOwnProperty('default')) {
      return schema.default;
    }
    return undefined;
  } else if (schema.type === 'array') {
    let array = [];
    if (schema.minItems !== undefined) {
      for (let i = 0; i < schema.minItems; i++) {
        let value = generateFromSchema(schema.items);
        if (value) {
          array.push();
        }
      }
    }
    return array;
  } else if (schema.type === 'object') {
    let object = {};
    if (schema.hasOwnProperty('default')) {
      return schema.default;
    }
    if (!schema.hasOwnProperty('properties')) {
      return undefined;
    }
    Object.keys(schema.properties).forEach(propertyName => {
      if (schema.properties[propertyName]['Q:deprecated']) {
        return;
      }
      let value = generateFromSchema(schema.properties[propertyName]);
      if (value !== undefined) {
        object[propertyName] = value;
      }
    });
    return object;
  }
  return undefined;
}
