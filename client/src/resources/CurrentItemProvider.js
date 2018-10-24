import get from "get-value";
import set from "set-value";

export default class CurrentItemProvider {
  setCurrentItem(item) {
    this.item = item;
  }

  getCurrentItem() {
    return this.item;
  }

  getCurrentItemByFields(fields) {
    const item = {};
    for (let field of fields) {
      set(item, field, get(this.item.conf, field));
    }
    return item;
  }
}
