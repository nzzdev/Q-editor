import { bindable } from "aurelia-framework";

export class RadioButtonGroup {
  @bindable options;
  @bindable value;

  valueMatcher(a, b) {
    // disable the linter as we do not want strict type checking here because number/string
    /* eslint-disable */
    return a == b;
    /* eslint-enable */
  }
}
