import qEnv from "resources/qEnv.js";

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

  async fetch(endpoint) {
    const QServerBaseUrl = await qEnv.QServerBaseUrl;
    const toolRequestBaseUrl = `${QServerBaseUrl}/tools/${this.toolName}`;
    const resp = await fetch(`${toolRequestBaseUrl}/${endpoint}`);
    if (resp.status !== 200) {
      throw new Error(resp.statusMessage);
    }
    try {
      return await resp.json();
    } catch (e) {
      return null;
    }
  }

  async fetchWithData(endpoint, data) {
    const QServerBaseUrl = await qEnv.QServerBaseUrl;
    const toolRequestBaseUrl = `${QServerBaseUrl}/tools/${this.toolName}`;
    const resp = await fetch(`${toolRequestBaseUrl}/${endpoint}`, {
      method: "POST",
      body: JSON.stringify(data)
    });
    if (resp.status !== 200) {
      throw new Error(resp.statusMessage);
    }
    try {
      return await resp.json();
    } catch (e) {
      return null;
    }
  }

  async fetchWithItem(endpoint) {
    const QServerBaseUrl = await qEnv.QServerBaseUrl;
    const toolRequestBaseUrl = `${QServerBaseUrl}/tools/${this.toolName}`;
    const resp = await fetch(`${toolRequestBaseUrl}/${endpoint}`, {
      method: "POST",
      body: JSON.stringify(this.item.conf)
    });
    if (resp.status !== 200) {
      throw new Error(resp.statusMessage);
    }
    try {
      return await resp.json();
    } catch (e) {
      return null;
    }
  }
}
