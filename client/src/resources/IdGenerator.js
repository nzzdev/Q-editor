import { inject } from 'aurelia-framework';
import CurrentItemProvider from 'resources/CurrentItemProvider.js';

@inject(CurrentItemProvider)
export default class IdGenerator {

  constructor(currentItemProvider) {
    this.currentItemProvider = currentItemProvider;
  }

  getId() {
    return Date.now() + '-' + (Math.random() * (10 ** 9)).toFixed(0);
  }

  getIdWithCurrentItemId() {
    const item = this.currentItemProvider.getCurrentItem();
    if (!item.id) {
      return null;
    }

    return item.id + '-' + this.getId();
  }
}
