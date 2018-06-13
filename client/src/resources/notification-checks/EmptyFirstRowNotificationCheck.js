export default class EmptyFirstRowNotificationCheck {
  getNotificationResult(data, notificationCheck) {
    const notificationResult = {
      showNotification: false,
      priority: notificationCheck.priority
    };
    if (data[0][0]) {
      const totalValues = data[0][0].length;
      const nullValues = data[0][0].filter(entry => entry === null).length;
      notificationResult.showNotification = nullValues === totalValues;
    }
    return notificationResult;
  }
}
