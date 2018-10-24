import qEnv from "resources/qEnv.js";
import get from "get-value";
import set from "set-value";

export default class ToolEndpointChecker {
  reevaluateCallbacks = [];

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

  setCurrentToolName(toolName) {
    this.toolName = toolName;
  }

  setCurrentItem(item) {
    this.item = item;
  }

  async check(checkConfig) {
    const QServerBaseUrl = await qEnv.QServerBaseUrl;
    const toolRequestBaseUrl = `${QServerBaseUrl}/tools/${this.toolName}`;
    const options = {
      method: "GET"
    };

    if (checkConfig.withData) {
      options.method = "POST";
      options.body = JSON.stringify(this.item.conf);
    } else if (
      Array.isArray(checkConfig.fields) &&
      checkConfig.fields.length > 0
    ) {
      const item = {};
      for (let property of checkConfig.fields) {
        set(item, property, get(this.item.conf, property));
      }
      const dataForEndpoint = {
        item: item
      };
      options.method = "POST";
      if (checkConfig.hasOwnProperty("options")) {
        dataForEndpoint.options = checkConfig.options;
      }
      options.body = JSON.stringify(dataForEndpoint);
    }
    const response = await fetch(`${toolRequestBaseUrl}/${endpoint}`, options);
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
