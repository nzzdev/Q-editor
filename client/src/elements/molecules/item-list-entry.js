import { bindable, inject } from "aurelia-framework";
import { Router } from "aurelia-router";
import { Notification } from "aurelia-notification";
import { I18N } from "aurelia-i18n";
import User from "resources/User";
import ToolsInfo from "resources/ToolsInfo";

@inject(Element, ToolsInfo, User, Router, Notification, I18N)
export class ItemListEntry {
  @bindable item;

  constructor(element, toolsInfo, user, router, notification, i18n) {
    this.element = element;
    this.toolsInfo = toolsInfo;
    this.user = user;
    this.router = router;
    this.notification = notification;
    this.i18n = i18n;
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

  toggleOptionDropdown() {
    this.optionsDropdown.classList.toggle(
      "item-list-entry__options-dropdown--show"
    );
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

  async blueprint() {
    try {
      await this.item.blueprint();
      this.item.conf.title = this.i18n.tr("item.blueprintTitlePrefix");
      let tool = this.item.conf.tool.replace(new RegExp("-", "g"), "_");
      this.router.navigate(`/editor/${tool}/${this.item.conf._id}`);
    } catch (e) {
      this.notification.error("notification.failedToLoadItem");
    }
  }
}
