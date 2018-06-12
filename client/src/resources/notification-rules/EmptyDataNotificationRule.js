export default class EmptyDataNotificationRule {
  getNotificationResult(data, notificationConfig) {
    return {
      showNotification: data.length === 1 && data[0].length === 0,
      priority: notificationConfig.priority
    };
  }
}
