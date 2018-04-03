import { bindable } from "aurelia-framework";

export class IconButton {
  @bindable icon;
  @bindable code;
  @bindable size;
  @bindable iconSize;
  @bindable tabindex;
  @bindable type = "button";
}
