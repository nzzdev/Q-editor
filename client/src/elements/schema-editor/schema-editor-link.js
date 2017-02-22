import { bindable } from 'aurelia-framework';

export class SchemaEditorLink {

  @bindable data
  @bindable schema
  @bindable change

  handleUrlChange() {
    if (this.urlInput.validity.valid) {
      // todo, use a cors proxy / Q Server to test if the link is really valid.
      this.data.isValid = true;
    }
    this.change();
  }


}
