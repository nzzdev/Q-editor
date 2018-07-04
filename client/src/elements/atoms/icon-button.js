import { bindable } from "aurelia-framework";

export class IconButton {
  @bindable click;
  @bindable icon;
  @bindable code;
  @bindable size;
  @bindable iconSize;
  @bindable tabindex;
  @bindable disabled;
  @bindable type = "button";
}
