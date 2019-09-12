import { inject } from "aurelia-framework";
import { DialogController } from "aurelia-dialog";

@inject(DialogController)
export class SchemaEditorDialogImplementation {
  constructor(dialogController) {
    this.dialogController = dialogController;
  }

  activate(config) {
    this.config = config;
    delete this.config.schema["Q:options"].openInDialog;
  }

  save() {
    if (this.form.checkValidity()) {
      this.dialogController.ok(this.config.data);
    }
  }
}
