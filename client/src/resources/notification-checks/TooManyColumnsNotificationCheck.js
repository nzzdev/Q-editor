export default class TooManyColumnsNotificationCheck {
  getNotification(notificationCheck, data) {
    if (data[0][0] && data[0][0].length > notificationCheck.options.limit) {
      return {
        message: {
          title: "notifications.tooManyColumns.title",
          body: "notifications.tooManyColumns.body"
        }
      };
    }
    return null;
  }
}
