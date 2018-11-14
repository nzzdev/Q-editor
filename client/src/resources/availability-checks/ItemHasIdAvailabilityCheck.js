import { inject } from "aurelia-framework";
import CurrentItemProvider from "resources/CurrentItemProvider.js";

@inject(CurrentItemProvider)
export default class ItemHasIdAvailabilityCheck {
  constructor(currentItemProvider) {
    this.currentItemProvider = currentItemProvider;
  }

  async isAvailable(config) {
    const item = this.currentItemProvider.getCurrentItem();
    return item && item.conf && item.conf._id;
  }
}
