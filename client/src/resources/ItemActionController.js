import { inject, LogManager } from "aurelia-framework";
import { Router } from "aurelia-router";
import { Notification } from "aurelia-notification";
import { I18N } from "aurelia-i18n";
import { DialogService } from "aurelia-dialog";
import { ConfirmDialog } from "dialogs/confirm-dialog.js";
import QConfig from "resources/QConfig.js";
import ItemStore from "resources/ItemStore";

const log = LogManager.getLogger("Q");

@inject(Router, Notification, I18N, DialogService, QConfig, ItemStore)
export default class ItemActionController {
  constructor(router, notification, i18n, dialogService, qConfig, itemStore) {
    this.router = router;
    this.notification = notification;
    this.i18n = i18n;
    this.dialogService = dialogService;
    this.qConfig = qConfig;
    this.itemStore = itemStore;
  }

  activate(item) {
    return item.activate();
  }

  deactivate(item) {
    return item.deactivate();
  }

  async edit(item) {
    const editorRoute = `/editor/${item.conf.tool}/${item.conf._id}`;

    // if the item is already active and the last edited and uiBehaviour.askBeforeEditIfActive is true in config, we
    // ask the user if she really wants to edit this item

    // if the item is not active, go to the editor
    if (item.conf.active !== true) {
      this.router.navigate(editorRoute);
      return;
    }

    // otherwise we need to load the uiBehaviour Configuration
    const uiBehaviorConfig = await this.qConfig.get("uiBehavior");

    // if we do not have the config, go to the editor
    if (!uiBehaviorConfig || !uiBehaviorConfig.askBeforeEditIfActive) {
      this.router.navigate(editorRoute);
      return;
    }

    // otherwise compute the secondsSinceLastEdit
    const lastEditedDate = new Date(item.conf.updatedDate || Date.now());
    const now = new Date();
    const secondsSinceLastEdit =
      now.getTime() / 1000 - lastEditedDate.getTime() / 1000;

    // if the configured threshold is not reached, go to the editor
    if (
      !uiBehaviorConfig.askBeforeEditIfActive.lastEditSecondsThreshold ||
      secondsSinceLastEdit <
        uiBehaviorConfig.askBeforeEditIfActive.lastEditSecondsThreshold
    ) {
      this.router.navigate(editorRoute);
      return;
    }

    // open the dialog to ask the user if she wants to edit
    const openDialogResult = await this.dialogService.open({
      viewModel: ConfirmDialog,
      model: {
        confirmQuestion: this.i18n.tr("editor.questionReallyEditBecauseActive"),
        confirmQuestionSub: this.i18n.tr(
          "editor.questionReallyEditBecauseActiveSub"
        ),
        proceedText: this.i18n.tr("editor.confirmProceedToEditor"),
        cancelText: this.i18n.tr("editor.cancelProceedToEditor")
      }
    });
    const closeResult = await openDialogResult.closeResult;

    // only go to the editor if it was not cancelled
    if (!closeResult.wasCancelled) {
      this.router.navigate(editorRoute);
    }
  }

  async delete(item) {
    const openDialogResult = await this.dialogService.open({
      viewModel: ConfirmDialog,
      model: {
        confirmQuestion: this.i18n.tr("item.questionDeleteItem"),
        confirmQuestionSub: this.i18n.tr("item.questionDeleteItemSub", {
          graphicTitle: item.conf.title
        }),
        proceedText: this.i18n.tr("item.confirmDeleteItem"),
        cancelText: this.i18n.tr("item.cancelDeleteItem")
      }
    });
    const closeResult = await openDialogResult.closeResult;

    if (!closeResult.wasCancelled) {
      return item.delete();
    }
    return Promise.reject();
  }

  async blueprint(item) {
    try {
      const blueprintedItem = await this.itemStore.getBlueprintedItem(item.id);
      this.router.navigate(
        `/editor/${blueprintedItem.getToolName()}/${blueprintedItem.id}`
      );
    } catch (e) {
      log.error(e);
      this.notification.error("notification.failedToLoadItem");
    }
  }
}
