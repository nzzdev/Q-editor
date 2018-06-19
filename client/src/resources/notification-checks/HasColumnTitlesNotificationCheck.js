import array2d from "array2d";

export default class HasColumnTitlesNotificationCheck {
  getNotification(notificationCheck, data) {
    if (data[0].length > 1) {
      // only check if there are at least two rows (one header and one data row)
      const hasColumnTitleState = [];
      array2d.eachColumn(data[0], (column, index) => {
        hasColumnTitleState[index] = column.length > 1 && column[0] !== null;
      });
      const hasColumnTitles = hasColumnTitleState.reduce(
        (prev, curr) => prev && curr
      );
      if (!hasColumnTitles) {
        return {
          message: {
            title: "notifications.hasColumnTitles.title",
            body: "notifications.hasColumnTitles.body"
          }
        };
      }
    }
    return null;
  }
}
