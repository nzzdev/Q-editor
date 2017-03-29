export function getType(schema) {
  let type;

  if (schema && schema.hasOwnProperty('type')) {
    type = schema.type;
  }
  if (schema && schema.hasOwnProperty('Q:type')) {
    type = schema['Q:type'];
  }

  if (type === 'string' && schema.enum) {
    type = 'select';
  }

  if (type === 'number' && schema.enum) {
    type = 'select';
  }

  return type;
}
