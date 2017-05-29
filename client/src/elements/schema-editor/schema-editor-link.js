import { bindable } from 'aurelia-framework';
import { checkAvailability } from 'resources/schemaEditorDecorators.js';

@checkAvailability()
export class SchemaEditorLink {

  @bindable data
  @bindable schema
  @bindable change
  @bindable required

  handleUrlChange() {
    if (this.urlInput.validity.valid) {
      // todo, use a cors proxy / Q Server to test if the link is really valid.
      this.data.isValid = true;
    }
    this.change();
  }


}
