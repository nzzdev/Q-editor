import { bindable } from "aurelia-framework";

export class RadioButtonGroup {
  @bindable options;
  @bindable value;
  @bindable change;

  constructor() {
    this.name = `radio-button-group-${Math.floor(Math.random() * 10000)}`;
  }

  valueMatcher(a, b) {
    // disable the linter as we do not want strict type checking here because number/string
    /* eslint-disable */
    return a == b;
    /* eslint-enable */
  }
}
