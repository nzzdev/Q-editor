export default class EmptyFirstRowNotificationCheck {
  getNotification(notificationCheck, data) {
    if (data[0][0]) {
      const totalValues = data[0][0].length;
      const nullValues = data[0][0].filter(entry => entry === null).length;
      if (nullValues === totalValues) {
        return {
          message: {
            title: "notifications.emptyFirstRow.title",
            body: "notifications.emptyFirstRow.body"
          }
        };
      }
    }
    return null;
  }
}
