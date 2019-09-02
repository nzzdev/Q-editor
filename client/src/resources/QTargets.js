import { inject } from "aurelia-framework";
import { Notification } from "aurelia-notification";
import qEnv from "resources/qEnv.js";

@inject(Notification)
export default class QTargets {
  data = {};

  constructor(notification) {
    this.notification = notification;
    this.loaded = qEnv.QServerBaseUrl.then(QServerBaseUrl => {
      return fetch(`${QServerBaseUrl}/editor/targets`);
    })
      .then(response => {
        if (response.ok && response.status >= 200 && response.status < 400) {
          return response.json();
        }
        throw new Error(response.statusText);
      })
      .then(targets => {
        this.data.availableTargets = targets;
      })
      .catch(err => {
        this.notification.error("failedLoadingEditorConfig");
      });
  }

  get(key) {
    return this.loaded.then(() => {
      return this.data[key];
    });
  }

  getUserExportable({ tool }) {
    return this.loaded.then(() => {
      return this.data.availableTargets.filter(target => {
        let isExportable =
          target.userExportable !== false &&
          target.userExportable !== undefined;
        if (
          isExportable === true &&
          tool !== undefined &&
          Array.isArray(target.userExportable.onlyTools)
        ) {
          isExportable = target.userExportable.onlyTools.includes(tool);
        }
        return isExportable;
      });
    });
  }
}
