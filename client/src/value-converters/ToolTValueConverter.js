import { inject } from "aurelia-framework";
import { I18N } from "aurelia-i18n";
import CurrentItemProvider from "resources/CurrentItemProvider.js";

@inject(I18N, CurrentItemProvider)
export class ToolTValueConverter {
  constructor(i18n, currentItemProvider) {
    this.service = i18n;
    this.currentItemProvider = currentItemProvider;
  }

  toView(value, options) {
    const item = this.currentItemProvider.getCurrentItem();
    return this.service.tr(`${item.conf.tool}:${value}`, options);
  }
}
