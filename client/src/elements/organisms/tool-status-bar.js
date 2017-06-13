import { bindable, inject } from 'aurelia-framework';
import { Notification } from 'aurelia-notification';
import { DialogService } from 'aurelia-dialog';
import { ItemDialog } from 'dialogs/item-dialog.js';

@inject(Notification, DialogService)
export class ToolStatusBar {

  @bindable item;
  @bindable saveAction;
  @bindable activateAction;

  message;

  constructor(notification, dialogService) {
    this.notification = notification;
    this.dialogService = dialogService;
  }

  onActivateClick() {
    if (!this.item || this.item.conf.title === undefined || this.item.conf.title.length === 0) {
      this.notification.warning('notifications.graphicNeedsATitle');
    } else {
      this.openItemModal();
    }
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
