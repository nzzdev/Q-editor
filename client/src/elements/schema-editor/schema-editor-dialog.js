import { bindable, inject } from "aurelia-framework";
import { DialogService } from "aurelia-dialog";
import { I18N } from "aurelia-i18n";
import { SchemaEditorDialogImplementation } from "../../dialogs/schema-editor-dialog.js";
import ObjectFromSchemaGenerator from "resources/ObjectFromSchemaGenerator.js";

@inject(DialogService, I18N, ObjectFromSchemaGenerator)
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

  constructor(dialogService, i18n, objectFromSchemaGenerator) {
    this.dialogService = dialogService;
    this.i18n = i18n;
    this.objectFromSchemaGenerator = objectFromSchemaGenerator;
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
    let data = this.data;
    if (!data) {
      data = this.objectFromSchemaGenerator.generateFromSchema(this.schema);
    }
    const dialog = await this.dialogService.open({
      viewModel: SchemaEditorDialogImplementation,
      model: {
        schema: this.schema,
        data: JSON.parse(JSON.stringify(data)),
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
