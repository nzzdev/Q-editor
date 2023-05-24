export class AuthService {
  constructor(user) {
    this.user = user;
  }

  async isAuthenticated() {
    await this.user.loaded;

    return this.user.isLoggedIn;
    /* if (!this.user.isLoggedIn) {
      this.router.navigateToRoute("login");
    } else {
      return true;
    } */
  }
}
