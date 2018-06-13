export default class IsValueMissingNotificationCheck {
  getNotificationResult(element, notificationCheck) {
    const notificationResult = {
      showNotification: false,
      priority: notificationCheck.priority
    };
    if (element && !element.validity.valid) {
      notificationResult.showNotification = element.validity.valueMissing;
    }
    return notificationResult;
  }
}
