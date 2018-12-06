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
      // if the schema-editor is used in different contexts than the item editor
      // we do not have an item defined, thus no tool. in these cases we do not namespace the translations
      // this is used for the new /tasks page at the time of writing
      if (item) {
        return decodeHtmlEntities(
          this.service.tr(`${item.conf.tool}:${value}`, options)
        );
      }
      return decodeHtmlEntities(this.service.tr(`${value}`, options));
    }
  }
}
