import { bindable, inject } from "aurelia-framework";
import { BindingSignaler } from "aurelia-templating-resources";
import { Notification } from "aurelia-notification";
import { DialogService } from "aurelia-dialog";
import { ItemDialog } from "dialogs/item-dialog.js";
import QConfig from "resources/QConfig.js";

@inject(QConfig, Notification, DialogService, BindingSignaler)
export class ToolStatusBar {
  @bindable item;
  @bindable saveAction;
  @bindable activateAction;

  message;

  constructor(qConfig, notification, dialogService, signaler) {
    this.qConfig = qConfig;
    this.notification = notification;
    this.dialogService = dialogService;

    setInterval(() => signaler.signal("update-timeago"), 1000);
  }

  created() {
    return this.qConfig.get("uiBehavior").then(uiBehaviorConfig => {
      this.uiBehaviorConfig = uiBehaviorConfig;
    });
  }

  onActivateClick() {
    if (
      !this.item ||
      this.item.conf.title === undefined ||
      this.item.conf.title.length === 0
    ) {
      this.notification.warning("notifications.graphicNeedsATitle");
    } else {
      if (
        !!this.uiBehaviorConfig &&
        this.uiBehaviorConfig.hasOwnProperty("useItemDialogToActivate") &&
        this.uiBehaviorConfig.useItemDialogToActivate === false
      ) {
        this.item.activate();
      } else {
        this.openItemModal();
      }
    }
  }

  onDeactivateClick() {
    this.item.deactivate();
  }

  openItemModal() {
    this.dialogService.open({
      viewModel: ItemDialog,
      model: {
        allowActivate: true,
        showEmbedCode: true,
        showId: false,
        item: this.item
      }
    });
  }
}
