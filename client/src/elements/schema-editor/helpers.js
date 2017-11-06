function hasEnum(schema) {
  if (schema.hasOwnProperty('enum')) {
    return true;
  }
  if (schema['Q:options'] && schema['Q:options'].hasOwnProperty('dynamicEnum')) {
    return true;
  }
  return false;
}

function hasType(schema, type) {
  if (schema.hasOwnProperty('anyOf')) {
    for (let anyOfSchema of schema.anyOf) {
      if (anyOfSchema.type === type) {
        return true;
      }
    }
  }
  if (schema.hasOwnProperty('oneOf')) {
    for (let oneOfSchema of schema.oneOf) {
      if (oneOfSchema.type === type) {
        return true;
      }
    }
  }
  return false;
}

export function getType(schema) {
  let type;

  if (schema && schema.hasOwnProperty('type')) {
    type = schema.type;
  }
  if (schema && schema.hasOwnProperty('Q:type')) {
    type = schema['Q:type'];
  }

  if ((type === 'string' || hasType(schema, 'string')) && hasEnum(schema)) {
    type = 'select';
  }

  if ((type === 'number' || hasType(schema, 'number')) && hasEnum(schema)) {
    type = 'select';
  }

  return type;
}

export function isRequired(schema, propertyName) {
  return schema.hasOwnProperty('required') && schema.required.includes(propertyName);
}
