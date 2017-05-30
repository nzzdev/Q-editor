import { bindable, inject } from 'aurelia-framework';
import { DialogService } from 'aurelia-dialog';

import { ItemDialog } from 'dialogs/item-dialog.js';

import MessageService from 'resources/MessageService.js';

@inject(MessageService, DialogService)
export class ToolStatusBar {

  @bindable item;
  @bindable saveAction;
  @bindable activateAction;

  message;

  constructor(messageService, dialogService) {
    this.messageService = messageService;
    this.dialogService = dialogService;
  }

  onActivateClick() {
    if (this.message) {
      this.messageService.removeMessage(this.message);
    }
    if (!this.item || this.item.conf.title === undefined || this.item.conf.title.length === 0) {
      this.message = this.messageService.pushMessage('error', 'Grafik braucht einen Titel');
    } else {
      if (!this.item.isSaved) {
        this.item.save()
          .then(() => {
            this.openItemModal();
          });
      } else {
        this.openItemModal();
      }
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
