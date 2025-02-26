export default class Cookie {
  cName = 'legacyDialog';
  async setCookie(cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + exdays * 60 * 60 * 1000);
    let expires = 'expires=' + d.toUTCString();
    document.cookie = this.cName + '=' + cvalue + ';' + expires + ';path=/';
  }

  async getCookie() {
    let name = this.cName + '=';
    let ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return '';
  }

  async deleteCookie() {
    document.cookie =
      this.cName + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  }
}
