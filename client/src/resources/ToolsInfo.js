import { inject } from 'aurelia-framework';
import User from 'resources/User.js';
import qEnv from 'resources/qEnv.js';

@inject(User)
export default class ToolsInfo {

  constructor(user) {
    this.user = user;
    this.availableTools = this.loadAvailableTools();
  }

  async loadAvailableTools() {
    let availableTools = [];

    await this.user.loaded;
    const QServerBaseUrl = await qEnv.QServerBaseUrl;

    const response = await fetch(`${QServerBaseUrl}/editor/tools`);
    if (!response.ok) {
      throw response;
    }

    const tools = await response.json();
    for (let tool of tools) {
      let allowedToSeeTool = true;
      if (tool.onlyRoles) {
        allowedToSeeTool = false;
        if (this.user && this.user.roles) {
          for (let role of tool.onlyRoles) {
            if (this.user.roles.indexOf(role) >= 0) {
              allowedToSeeTool = true;
            }
          }
        }
      }

      if (allowedToSeeTool) {
        availableTools.push(tool);
      }
    }

    return availableTools;
  }

  getAvailableTools() {
    return this.availableTools;
  }

  async getAvailableToolsNames() {
    const tools = await this.getAvailableTools();
    return tools
      .map(tool => tool.name);
  }
}
