import { bindable, inject } from "aurelia-framework";
import { Router } from "aurelia-router";
import User from "resources/User";
import ToolsInfo from "resources/ToolsInfo";

@inject(Element, ToolsInfo, User, Router)
export class ItemListEntry {
  @bindable item;

  constructor(element, toolsInfo, user, router) {
    this.element = element;
    this.toolsInfo = toolsInfo;
    this.user = user;
    this.router = router;
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

  deleteItem() {
    this.item.delete().then(() => {
      this.element.addEventListener("transitionend", () => {
        this.element.parentNode.removeChild(this.element);
      });
      this.element.style.transform = "scale(0)";
    });
  }
}
