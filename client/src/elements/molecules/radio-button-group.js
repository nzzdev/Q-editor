import { bindable } from "aurelia-framework";

export class RadioButtonGroup {
  @bindable options;
  @bindable value;
  @bindable change;

  constructor() {
    this.name = `radio-button-group-${Math.floor(Math.random() * 10000)}`;
  }
}
