import { bindable, inject } from "aurelia-framework";
import ToolsInfo from "resources/ToolsInfo";
import User from "resources/User";
import ItemActionController from "resources/ItemActionController";
@inject(ToolsInfo, Element, User, ItemActionController)
export class ItemListEntry {
  @bindable item;

  constructor(toolsInfo, element, user, itemActionController) {
    this.toolsInfo = toolsInfo;
    this.element = element;
    this.user = user;
    this.itemActionController = itemActionController;
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
    this.itemActionController.delete(this.item).then(() => {
      this.element.addEventListener("transitionend", () => {
        this.element.parentNode.removeChild(this.element);
      });
      this.element.style.transform = "scale(0)";
    });
  }
}
