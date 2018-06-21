import { bindable, inject } from "aurelia-framework";
import { Router } from "aurelia-router";
import { Notification } from "aurelia-notification";
import { I18N } from "aurelia-i18n";
import { DialogService } from "aurelia-dialog";
import { ConfirmDialog } from "dialogs/confirm-dialog.js";
import User from "resources/User";
import ToolsInfo from "resources/ToolsInfo";

@inject(Element, ToolsInfo, User, Router, Notification, I18N, DialogService)
export class ItemListEntry {
  @bindable item;

  constructor(
    element,
    toolsInfo,
    user,
    router,
    notification,
    i18n,
    dialogService
  ) {
    this.element = element;
    this.toolsInfo = toolsInfo;
    this.user = user;
    this.router = router;
    this.notification = notification;
    this.i18n = i18n;
    this.dialogService = dialogService;
  }

  attached() {
    document.addEventListener("click", this.handleBodyClick, { capture: true });
  }

  detached() {
    document.removeEventListener("click", this.handleBodyClick, {
      capture: true
    });
  }

  handleBodyClick(event) {
    if (!event.target.matches("item-list-entry__options-dropdown-button")) {
      const dropdownMenus = Array.prototype.slice.call(
        document.querySelectorAll(".item-list-entry__options-dropdown-content")
      );
      dropdownMenus.map(dropdownMenu => {
        if (
          dropdownMenu.classList.contains(
            "item-list-entry__options-dropdown--show"
          )
        ) {
          dropdownMenu.classList.remove(
            "item-list-entry__options-dropdown--show"
          );
        }
      });
    }
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

  async deleteItem() {
    const openDialogResult = await this.dialogService.open({
      viewModel: ConfirmDialog,
      model: {
        confirmQuestion: this.i18n.tr("item.questionDeleteItem"),
        proceedText: this.i18n.tr("item.confirmDeleteItem"),
        cancelText: this.i18n.tr("item.cancelDeleteItem")
      }
    });
    const closeResult = await openDialogResult.closeResult;

    if (!closeResult.wasCancelled) {
      this.item.delete().then(() => {
        this.element.addEventListener("transitionend", () => {
          this.element.parentNode.removeChild(this.element);
        });
        this.element.style.transform = "scale(0)";
      });
    }
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
