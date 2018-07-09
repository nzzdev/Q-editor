import { inject } from "aurelia-framework";
import { I18N } from "aurelia-i18n";
import CurrentItemProvider from "resources/CurrentItemProvider.js";

function decodeHtmlEntities(str) {
  return str.replace(/&#(\d+);/g, function(match, dec) {
    return String.fromCharCode(dec);
  });
}

@inject(I18N, CurrentItemProvider)
export class ToolTValueConverter {
  constructor(i18n, currentItemProvider) {
    this.service = i18n;
    this.currentItemProvider = currentItemProvider;
  }

  toView(value, options) {
    if (value !== undefined) {
      const item = this.currentItemProvider.getCurrentItem();
      return decodeHtmlEntities(
        this.service.tr(`${item.conf.tool}:${value}`, options)
      );
    }
  }
}
