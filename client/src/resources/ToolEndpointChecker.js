import qEnv from 'resources/qEnv.js';

export default class ToolEndpointChecker {

  reevaluateCallbacks = [];

  setCurrentToolName(toolName) {
    this.toolName = toolName;
  }

  setCurrentItem(item) {
    this.item = item;
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

  async fetch(endpoint) {
    const QServerBaseUrl = await qEnv.QServerBaseUrl;
    const toolRequestBaseUrl = `${QServerBaseUrl}/tools/${this.toolName}`;
    const resp = await fetch(`${toolRequestBaseUrl}/${endpoint}`);
    if (resp.status !== 200) {
      throw new Error(resp.statusMessage);
    }
    return await resp.json();
  }

  async fetchWithItem(endpoint) {
    const QServerBaseUrl = await qEnv.QServerBaseUrl;
    const toolRequestBaseUrl = `${QServerBaseUrl}/tools/${this.toolName}`;
    const resp = await fetch(`${toolRequestBaseUrl}/${endpoint}`, {
      method: 'POST',
      body: JSON.stringify(this.item.conf)
    });
    if (resp.status !== 200) {
      throw new Error(resp.statusMessage);
    }
    return await resp.json();
  }
}
