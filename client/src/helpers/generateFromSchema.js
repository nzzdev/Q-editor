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
        array.push(generateFromSchema(schema.items));
      }
    }
    return array;
  } else if (schema.type === 'object') {
    let object = {};
    Object.keys(schema.properties).forEach(propertyName => {
      if (schema.properties[propertyName]['Q:deprecated']) {
        return;
      }
      object[propertyName] = generateFromSchema(schema.properties[propertyName]);
    });
    return object;
  }
  return undefined;
}
