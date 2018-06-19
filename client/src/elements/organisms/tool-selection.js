import { inject } from "aurelia-framework";
import ToolsInfo from "resources/ToolsInfo";
import User from "resources/User.js";

@inject(ToolsInfo, User)
export class ToolSelection {
  constructor(toolsInfo, user) {
    this.toolsInfo = toolsInfo;
    this.user = user;
  }

  async attached() {
    this.userChangedCallback = this.init.bind(this);
    this.user.registerChangeCallback(this.userChangedCallback);
    await this.init();
  }

  async detached() {
    this.user.unregisterChangeCallback(this.userChangedCallback);
  }

  async init() {
    this.alwaysVisibleToolCount = 4;
    try {
      this.tools = await this.toolsInfo.getToolsOrderedForUser();
    } catch (e) {
      this.tools = await this.toolsInfo.getAvailableTools();
    }

    await this.user.loaded;
    const userToolSelectionConfig = this.user.getUserConfig("toolSelection");
    if (
      userToolSelectionConfig &&
      userToolSelectionConfig.type === "byConfig"
    ) {
      // set the alwaysVisibleToolCount to the number of tools the user has checked as
      // visible initially
      this.alwaysVisibleToolCount = Object.keys(userToolSelectionConfig.tools)
        .map(toolName => {
          return (
            userToolSelectionConfig.tools[toolName] &&
            userToolSelectionConfig.tools[toolName].inInitialToolSelection ===
              true
          );
        })
        .reduce((amountVisibleTools, isToolVisible) => {
          if (isToolVisible) {
            return amountVisibleTools + 1;
          }
          return amountVisibleTools;
        }, 0);

      // sort the tools by their config value for inInitialToolSelection;
      //
      this.tools = this.tools.sort((a, b) => {
        if (
          userToolSelectionConfig.tools[a.name] &&
          userToolSelectionConfig.tools[a.name].inInitialToolSelection ===
            true &&
          userToolSelectionConfig.tools[b.name] &&
          userToolSelectionConfig.tools[b.name].inInitialToolSelection === true
        ) {
          return 0; // keep order if both are selected
        }
        if (
          userToolSelectionConfig.tools[a.name] &&
          userToolSelectionConfig.tools[a.name].inInitialToolSelection === true
        ) {
          return -1; // take a before if it is selected
        }
        if (
          userToolSelectionConfig.tools[b.name] &&
          userToolSelectionConfig.tools[b.name].inInitialToolSelection === true
        ) {
          return 1; // take b before if it is selected
        }
        return 0; // keep order if none is selected
      });
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
