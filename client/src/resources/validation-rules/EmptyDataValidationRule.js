export default class EmptyDataValidationRule {
  validate(data) {
    return {
      showNotification: data.length === 1 && data[0].length === 0,
      priority: "medium"
    };
  }
}
