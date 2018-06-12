export default class TooManyColumnsNotificationRule {
  getNotificationResult(data, notificationConfig) {
    return {
      showNotification:
        data[0][0] && data[0][0].length > notificationConfig.limit,
      priority: notificationConfig.priority
    };
  }
}
