import { bindable } from 'aurelia-framework';

export class IconButton {

  @bindable icon
  @bindable code
  @bindable size

  created(owningView, myView) {
    this.view = myView;
  }

  attached() {
    if (this.view.slots['__au-default-slot-key__'].children.length > 0) {
      this.hasText = true;
    }
  }
}
