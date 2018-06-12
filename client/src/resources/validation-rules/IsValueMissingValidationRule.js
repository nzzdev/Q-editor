export default class IsValueMissingValidationRule {
  validate(element, validationConfig) {
    const validationResult = {
      showNotification: false,
      priority: validationConfig.priority
    };
    if (element && !element.validity.valid) {
      validationResult.showNotification = element.validity.valueMissing;
    }
    return validationResult;
  }
}
