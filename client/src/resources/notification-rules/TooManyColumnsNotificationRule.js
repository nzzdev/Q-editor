export default class TooManyColumnsNotificationRule {
  getNotificationResult(data, notificationRule) {
    return {
      showNotification:
        data[0][0] && data[0][0].length > notificationRule.limit,
      priority: notificationRule.priority
    };
  }
}
