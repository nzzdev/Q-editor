export default class IsValueMissingNotificationCheck {
  getNotification(config) {
    return null;
    // todo: refactor to use required attribute
    // or remove alltogether and push a notification if the value is required
    // const notificationResult = {
    //   showNotification: true,
    //   priority: config.priority
    // };
    // return notificationResult;

    // if (element && !element.validity.valid) {
    //   notificationResult.showNotification = element.validity.valueMissing;
    // }
    // return notificationResult;
  }
}
