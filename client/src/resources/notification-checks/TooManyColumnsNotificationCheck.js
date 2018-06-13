export default class TooManyColumnsNotificationCheck {
  getNotificationResult(data, notificationCheck) {
    return {
      showNotification:
        data[0][0] && data[0][0].length > notificationCheck.limit,
      priority: notificationCheck.priority
    };
  }
}
