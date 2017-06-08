export default class CurrentItemProvider {

  setCurrentItem(item) {
    this.item = item;
  }

  getCurrentItem(item) {
    return this.item;
  }
}
