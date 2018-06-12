export default class IsValueMissingNotificationRule {
  getNotificationResult(element, notificationConfig) {
    const notificationResult = {
      showNotification: false,
      priority: notificationConfig.priority
    };
    if (element && !element.validity.valid) {
      notificationResult.showNotification = element.validity.valueMissing;
    }
    return notificationResult;
  }
}
