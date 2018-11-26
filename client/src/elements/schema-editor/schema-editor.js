import { bindable, bindingMode } from "aurelia-framework";

export class SchemaEditor {
  @bindable schema;
  @bindable({ defaultBindingMode: bindingMode.twoWay }) data;
  @bindable change;
  @bindable notifications;
  @bindable showNotifications;
}
