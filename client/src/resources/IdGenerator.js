import { inject } from "aurelia-framework";
import CurrentItemProvider from "resources/CurrentItemProvider.js";

@inject(CurrentItemProvider)
export default class IdGenerator {
  constructor(currentItemProvider) {
    this.currentItemProvider = currentItemProvider;
  }

  getId() {
    return (
      s4() +
      s4() +
      "-" +
      s4() +
      "-" +
      s4() +
      "-" +
      s4() +
      "-" +
      s4() +
      s4() +
      s4()
    );
  }

  getIdWithCurrentItemId() {
    const item = this.currentItemProvider.getCurrentItem();
    if (!item.id) {
      return null;
    }

    return item.id + "-" + this.getId();
  }
}

function s4() {
  return Math.floor((1 + Math.random()) * 0x10000)
    .toString(16)
    .substring(1);
}
