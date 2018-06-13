export default class EmptyDataNotificationCheck {
  getNotificationResult(data, notificationCheck) {
    return {
      showNotification: data.length === 1 && data[0].length === 0,
      priority: notificationCheck.priority
    };
  }
}
