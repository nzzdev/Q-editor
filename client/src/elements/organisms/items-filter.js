import { bindable } from "aurelia-framework";

export class ItemsFilter {
  @bindable filters;
  @bindable change;

  handleChange() {
    if (typeof this.change === "function") {
      this.change();
    }
  }
}
