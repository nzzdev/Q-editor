import { bindable, inject } from "aurelia-framework";
import { DialogService } from "aurelia-dialog";
import { I18N } from "aurelia-i18n";
import { getType, isRequired } from "./helpers.js";
import { SchemaEditorDialogImplementation } from "../../dialogs/schema-editor-dialog.js";

@inject(DialogService, I18N)
export class SchemaEditorDialog {
  @bindable
  schema;
  @bindable
  data;
  @bindable
  change;
  @bindable
  notifications;
  @bindable
  showNotifications;

  constructor(dialogService, i18n) {
    this.dialogService = dialogService;
    this.i18n = i18n;
  }

  options = {};

  schemaChanged() {
    this.applyOptions();
  }

  applyOptions() {
    if (this.schema.hasOwnProperty("Q:options")) {
      this.options = Object.assign(this.options, this.schema["Q:options"]);
    }
  }

  async open() {
    const dialog = await this.dialogService.open({
      viewModel: SchemaEditorDialogImplementation,
      model: {
        schema: this.schema,
        data: JSON.parse(JSON.stringify(this.data)),
        notifications: this.notifications,
        showNotifications: this.showNotifications
      }
    });

    const dialogResult = await dialog.closeResult;
    if (!dialogResult.wasCancelled) {
      this.data = dialogResult.output;
      if (this.change) {
        this.change();
      }
    }
  }
}
