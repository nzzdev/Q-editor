export default class IsValueMissingValidationRule {
  validate(element) {
    const validationResult = {
      showNotification: false,
      priority: "high"
    };
    if (element && !element.validity.valid) {
      validationResult.showNotification = element.validity.valueMissing;
    }
    return validationResult;
  }
}
