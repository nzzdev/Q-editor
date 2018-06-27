const notification = {
  message: {
    title: "notifications.emptyData.title",
    body: "notifications.emptyData.body"
  }
};

export default class EmptyDataNotificationCheck {
  getNotification(notificationCheck, data) {
    if (data.length === 1 && data[0].length === 0) {
      return notification;
    }

    // check all the cells, if any of them is not null, return no notification
    for (const row of data[0]) {
      for (const cell of row) {
        if (cell !== null) {
          return null;
        }
      }
    }

    return notification;
  }
}
