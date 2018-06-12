export default class EmptyDataNotificationRule {
  getNotificationResult(data, notificationRule) {
    return {
      showNotification: data.length === 1 && data[0].length === 0,
      priority: notificationRule.priority
    };
  }
}
