import { bindable } from 'aurelia-framework';

export class SchemaEditorNumber {

  @bindable data
  @bindable schema
  @bindable change

  handleChange() {
    if (this.data === '') {
      this.data = undefined;
    }
    this.change();
  }

}
