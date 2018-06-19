import { inject } from "aurelia-framework";
import ToolsInfo from "resources/ToolsInfo";

@inject(ToolsInfo)
export class ToolSelection {
  alwaysVisibleToolCount = 4;

  constructor(toolsInfo) {
    this.toolsInfo = toolsInfo;
  }

  async attached() {
    try {
      this.tools = await this.toolsInfo.getToolsOrderedForUser();
    } catch (e) {
      this.tools = await this.toolsInfo.getAvailableTools();
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
