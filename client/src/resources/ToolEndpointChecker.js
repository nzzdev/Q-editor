import qEnv from 'resources/qEnv.js';

export default class ToolEndpointChecker {

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
