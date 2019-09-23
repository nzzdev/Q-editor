import { inject } from "aurelia-framework";
import { DialogController } from "aurelia-dialog";

@inject(DialogController)
export class SchemaEditorDialogImplementation {
  constructor(dialogController) {
    this.dialogController = dialogController;
  }

  activate(config) {
    this.config = config;
    // The openInDialog option needs to be deleted so the schema-editor renders the correct type. Otherwise it would just render the openInDialog button again.
    delete this.config.schema["Q:options"].openInDialog;
  }

  save() {
    if (this.form.checkValidity()) {
      this.dialogController.ok(this.config.data);
    }
  }
}
