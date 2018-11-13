import { bindable } from "aurelia-framework";

export class SchemaEditorBase64image {
  @bindable
  schema;
  @bindable
  data;
  @bindable
  change;
  @bindable
  required;
  @bindable
  showNotifications;

  handleChange(event) {
    let reader = new FileReader();
    let file = event.target.files[0];
    reader.readAsDataURL(file);
    reader.onload = () => {
      this.data = reader.result;
      this.change();
    };
  }
}
