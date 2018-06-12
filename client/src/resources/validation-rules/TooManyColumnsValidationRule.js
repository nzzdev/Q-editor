export default class TooManyColumnsValidationRule {
  validate(data, validationConfig) {
    return {
      showNotification:
        data[0][0] && data[0][0].length > validationConfig.limit,
      priority: validationConfig.priority
    };
  }
}
