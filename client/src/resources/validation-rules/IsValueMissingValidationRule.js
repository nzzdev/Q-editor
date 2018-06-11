export default class IsValueMissingValidationRule {
  validate(element) {
    const validationResult = {
      showNotification: false,
      priority: {
        type: "high",
        value: 10
      }
    };
    if (element && !element.validity.valid) {
      validationResult.showNotification = element.validity.valueMissing;
    }
    return validationResult;
  }
}
