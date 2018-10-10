import { inject } from "aurelia-framework";
import CurrentItemProvider from "resources/CurrentItemProvider.js";

@inject(CurrentItemProvider)
export default class IdGenerator {
  constructor(currentItemProvider) {
    this.currentItemProvider = currentItemProvider;
  }

  getId() {
    return Date.now() + "-" + (Math.random() * 10 ** 9).toFixed(0);
  }

  getIdWithCurrentItemId() {
    const item = this.currentItemProvider.getCurrentItem();
    return this.getIdWithItemId(item);
  }

  getIdWithItemId(item) {
    if (!item.id) {
      return null;
    }

    return this.getIdWithId(item.id);
  }

  getIdWithId(id) {
    return id + "-" + this.getId();
  }
}
