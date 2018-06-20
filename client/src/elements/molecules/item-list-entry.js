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

  activateItem() {
    this.item.activate();
  }

  deactivateItem() {
    this.item.deactivate();
  }

  deleteItem() {
    this.item.delete().then(() => {
      this.element.parentNode.removeChild(this.element);
    });
  }

  toggleOptionDropdown() {
    this.optionsDropdown.classList.toggle(
      "item-list-entry__options-dropdown--show"
    );
  }
}
