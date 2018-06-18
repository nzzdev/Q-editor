export default class EmptyDataNotificationCheck {
  getNotification(notificationCheck, data) {
    if (data.length === 1 && data[0].length === 0) {
      return {
        message: {
          title: "notifications.emptyData.title",
          body: "notifications.emptyData.body"
        }
      };
    }
    return null;
  }
}
