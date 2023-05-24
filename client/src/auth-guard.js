export class AuthGuard {
  constructor(authService) {
    this.authService = authService;
  }

  async canActivate() {
    return this.authService.isAuthenticated();
  }
}
