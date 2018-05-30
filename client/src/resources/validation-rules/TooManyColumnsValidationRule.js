export default class TooManyColumnsValidationRule {
  validate(data) {
    return {
      showNotification: data[0][0] && data[0][0].length > 5,
      priority: "medium"
    };
  }
}
