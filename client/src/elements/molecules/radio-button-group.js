import { bindable } from 'aurelia-framework';

export class RadioButtonGroup {

  @bindable options
  @bindable value

  valueMatcher(a, b) {
    return a == b;
  }
}
