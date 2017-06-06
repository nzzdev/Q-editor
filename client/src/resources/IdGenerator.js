export default class IdGenerator {

  setCurrentItem(item) {
    this.item = item;
  }

  getId() {
    return Date.now() + '-' + (Math.random() * (10 ** 9)).toFixed(0);
  }

  getIdWithCurrentItemId() {
    if (!this.item.id) {
      return null;
    }

    return this.item.id + '-' + this.getId();
  }
}
