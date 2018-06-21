import { bindable, inject } from "aurelia-framework";
import ToolsInfo from "resources/ToolsInfo";

@inject(ToolsInfo)
export class ItemListEntry {
  @bindable item;

  constructor(toolsInfo) {
    this.toolsInfo = toolsInfo;
  }

  itemChanged() {
    this.toolsInfo.getAvailableTools().then(tools => {
      let itemTool = tools.filter(tool => {
        return tool.name === this.item.getToolName();
      })[0];

      if (itemTool) {
        this.iconSvg = itemTool.icon;
      }
    });
  }
}
