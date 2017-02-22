import { inject } from 'aurelia-framework'
import User from 'resources/User.js'
import qEnv from 'resources/qEnv.js'

@inject(User)
export default class ToolsInfo {

  constructor(user) {
    this.user = user;

    this.availableTools = this.user.loaded
      .then(() => {
        return qEnv.QServerBaseUrl
      })
      .then(QServerBaseUrl => {
        return fetch(`${QServerBaseUrl}/editor/tools`)
      })
      .then(response => {
        return response.json()
      })
      .then(tools => {
        let availableTools = [];
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
      })
  }

  getAvailableTools() {
    return this.availableTools;
  }

  getAvailableToolsNames() {
    return this.getAvailableTools()
      .then(tools => {
        return tools
          .map(tool => {
            return tool.name;
          })
      })
  }
}
