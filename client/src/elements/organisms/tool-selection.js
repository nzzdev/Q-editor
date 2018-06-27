import { inject } from "aurelia-framework";
import ToolsInfo from "resources/ToolsInfo";
import User from "resources/User.js";

function isInInitialToolSelection(userToolSelectionConfig, toolName) {
  return (
    userToolSelectionConfig.tools[toolName] &&
    userToolSelectionConfig.tools[toolName].inInitialToolSelection === true
  );
}

@inject(ToolsInfo, User)
export class ToolSelection {
  constructor(toolsInfo, user) {
    this.toolsInfo = toolsInfo;
    this.user = user;
  }

  async attached() {
    this.userChangedCallback = this.update.bind(this);
    this.user.registerChangeCallback(this.userChangedCallback);
    await this.init();
  }

  async detached() {
    this.user.unregisterChangeCallback(this.userChangedCallback);
  }

  async init() {
    this.alwaysVisibleToolCount = 4;
    this.update();
  }

  async update() {
    await this.user.loaded;
    const userToolSelectionConfig = this.user.getUserConfig("toolSelection");
    if (
      userToolSelectionConfig &&
      userToolSelectionConfig.type === "byConfig"
    ) {
      this.tools = await this.toolsInfo.getAvailableTools();
      // set the alwaysVisibleToolCount to the number of tools the user has checked as
      // visible initially
      this.alwaysVisibleToolCount = Object.keys(userToolSelectionConfig.tools)
        .map(toolName => {
          return isInInitialToolSelection(userToolSelectionConfig, toolName);
        })
        .reduce((amountVisibleTools, isToolVisible) => {
          if (isToolVisible) {
            return amountVisibleTools + 1;
          }
          return amountVisibleTools;
        }, 0);

      // sort the tools by their config value for inInitialToolSelection;
      this.visibleTools = this.tools.slice(0).sort((a, b) => {
        if (
          isInInitialToolSelection(userToolSelectionConfig, a.name) &&
          !isInInitialToolSelection(userToolSelectionConfig, b.name)
        ) {
          return -1; // take a before if it is selected but b not
        }
        if (
          isInInitialToolSelection(userToolSelectionConfig, b.name) &&
          !isInInitialToolSelection(userToolSelectionConfig, a.name)
        ) {
          return 1; // take b before if it is selected but a not
        }
        // otherwise keep the configured order
        const configIndexA = this.tools.findIndex(tool => {
          return tool.name === a.name;
        });
        const configIndexB = this.tools.findIndex(tool => {
          return tool.name === b.name;
        });
        return configIndexA - configIndexB;
      });
    } else {
      // if the user wants the tools to see by her usage, we try to load it that way and fall back
      // to the configured order in case this fails
      try {
        this.visibleTools = await this.toolsInfo.getToolsOrderedForUser();
      } catch (e) {
        this.visibleTools = await this.toolsInfo.getAvailableTools();
      }
    }
  }

  toggleShowAll() {
    if (this.showAllTools === true) {
      this.showAllTools = false;
    } else {
      this.showAllTools = true;
    }
  }
}
