export default class IsValueMissingNotificationRule {
  getNotificationResult(element, notificationRule) {
    const notificationResult = {
      showNotification: false,
      priority: notificationRule.priority
    };
    if (element && !element.validity.valid) {
      notificationResult.showNotification = element.validity.valueMissing;
    }
    return notificationResult;
  }
}
