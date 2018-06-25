import { inject } from "aurelia-framework";
import { Container } from "aurelia-dependency-injection";
import { HttpClient } from "aurelia-fetch-client";
import User from "resources/User.js";
import qEnv from "resources/qEnv.js";

@inject(User, Container, HttpClient)
export default class ToolsInfo {
  constructor(user, diContainer, httpClient) {
    this.user = user;
    this.diContainer = diContainer;
    this.httpClient = httpClient;
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
      if (await this.isToolAvailable(tool)) {
        availableTools.push(tool);
      }
    }

    return availableTools;
  }

  async isToolAvailable(tool) {
    let isAvailable = true;
    if (Array.isArray(tool.availabilityChecks)) {
      for (let availabilityCheck of tool.availabilityChecks) {
        let checker = this.diContainer.get(
          availabilityCheck.type + "AvailabilityCheck"
        );
        const available = await checker.isAvailable(availabilityCheck);
        if (!available) {
          return false;
        }
      }
    }
    return isAvailable;
  }

  getAvailableTools() {
    return this.availableTools;
  }

  async isToolWithNameAvailable(toolName) {
    const availableToolsNames = await this.getAvailableToolsNames();
    return availableToolsNames.includes(toolName);
  }

  async getAvailableToolsNames() {
    const tools = await this.getAvailableTools();
    return tools.map(tool => tool.name);
  }

  async getToolsOrderedForUser() {
    const availableTools = await this.getAvailableTools();

    await this.user.loaded;
    const QServerBaseUrl = await qEnv.QServerBaseUrl;

    const response = await this.httpClient.fetch(
      `${QServerBaseUrl}/editor/tools-ordered-by-user-usage`,
      {
        credentials: "include",
        method: "GET"
      }
    );

    if (!response.ok) {
      throw response;
    }

    const toolsOrderedByUserUsage = await response.json();

    return availableTools.slice(0).sort((a, b) => {
      // if the user has never used a tool, put it to the end
      // put a first to be consistent
      if (
        !toolsOrderedByUserUsage.includes(a.name) &&
        !toolsOrderedByUserUsage.includes(b.name)
      ) {
        return -1;
      }
      // if a is never used, put it last
      if (!toolsOrderedByUserUsage.includes(a.name)) {
        return 1;
      }
      // if b is never used, put it last
      if (!toolsOrderedByUserUsage.includes(b.name)) {
        return -1;
      }
      return (
        toolsOrderedByUserUsage.indexOf(a.name) -
        toolsOrderedByUserUsage.indexOf(b.name)
      );
    });
  }
}
