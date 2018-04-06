import { bindable, inject } from "aurelia-framework";
import { EventAggregator } from "aurelia-event-aggregator";
import { I18N } from "aurelia-i18n";

@inject(I18N, EventAggregator)
export class ItemsFilter {
  @bindable filters;
  @bindable change;

  constructor(i18n, eventAggregator) {
    this.i18n = i18n;
    eventAggregator.subscribe("i18n:locale:changed", () => {
      this.translateFilters();
    });
  }

  handleChange() {
    if (typeof this.change === "function") {
      this.change();
    }
  }

  filtersChanged() {
    this.translateFilters();
  }

  translateFilters() {
    if (!Array.isArray(this.filters)) {
      return;
    }
    for (let filter of this.filters) {
      filter.options.forEach(option => {
        if (option.hasOwnProperty("label_i18n_key")) {
          return (option.visibleLabel = this.i18n.tr(option.label_i18n_key));
        }
        if (option.hasOwnProperty("label") && option.label !== undefined) {
          if (filter.name === "tool") {
            return (option.visibleLabel = `${this.i18n.tr("general.only")} ${
              option.label
            }`);
          }
          return (option.visibleLabel = option.label);
        }
        if (option.hasOwnProperty("name") && option.name !== undefined) {
          if (filter.name === "tool") {
            return (option.visibleLabel = `${this.i18n.tr(
              "general.only"
            )} ${this.i18n.tr("tools:" + option.name)}`);
          }
          return (option.visibleLabel = option.name);
        }
      });
    }
  }
}
