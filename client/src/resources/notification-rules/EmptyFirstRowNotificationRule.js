export default class EmptyFirstRowNotificationRule {
  getNotificationResult(data, notificationRule) {
    const notificationResult = {
      showNotification: false,
      priority: notificationRule.priority
    };
    if (data[0][0]) {
      const totalValues = data[0][0].length;
      const nullValues = data[0][0].filter(entry => entry === null).length;
      notificationResult.showNotification = nullValues === totalValues;
    }
    return notificationResult;
  }
}
