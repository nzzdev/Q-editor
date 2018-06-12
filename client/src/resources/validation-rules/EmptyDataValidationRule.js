export default class EmptyDataValidationRule {
  validate(data, validationConfig) {
    return {
      showNotification: data.length === 1 && data[0].length === 0,
      priority: validationConfig.priority
    };
  }
}
