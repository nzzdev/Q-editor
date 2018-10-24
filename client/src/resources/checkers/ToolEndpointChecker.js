import { inject } from "aurelia-framework";
import qEnv from "resources/qEnv.js";
import CurrentItemProvider from "resources/CurrentItemProvider.js";

@inject(CurrentItemProvider)
export default class ToolEndpointChecker {
  reevaluateCallbacks = [];

  constructor(currentItemProvider) {
    this.currentItemProvider = currentItemProvider;
  }

  triggerReevaluation() {
    for (let cb of this.reevaluateCallbacks) {
      cb();
    }
  }

  registerReevaluateCallback(cb) {
    this.reevaluateCallbacks.push(cb);
    return cb;
  }

  unregisterReevaluateCallback(id) {
    const index = this.reevaluateCallbacks.indexOf(id);
    if (index > -1) {
      this.reevaluateCallbacks.splice(index, 1);
    }
  }

  async check(checkConfig) {
    const QServerBaseUrl = await qEnv.QServerBaseUrl;
    const item = this.currentItemProvider.getCurrentItem().conf;
    const toolRequestBaseUrl = `${QServerBaseUrl}/tools/${item.tool}`;
    const options = {
      method: "GET"
    };
    if (checkConfig.withData) {
      options.method = "POST";
      options.body = JSON.stringify(item);
    } else if (
      Array.isArray(checkConfig.fields) &&
      checkConfig.fields.length > 0
    ) {
      const dataForEndpoint = {
        item: this.currentItemProvider.getCurrentItemByFields(
          checkConfig.fields
        )
      };
      options.method = "POST";
      if (checkConfig.hasOwnProperty("options")) {
        dataForEndpoint.options = checkConfig.options;
      }
      options.body = JSON.stringify(dataForEndpoint);
    }
    const response = await fetch(
      `${toolRequestBaseUrl}/${checkConfig.endpoint}`,
      options
    );

    if (response.status !== 200) {
      throw new Error(response.statusMessage);
    }
    try {
      return await response.json();
    } catch (e) {
      return null;
    }
  }
}
