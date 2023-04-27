import { inject, Loader } from "aurelia-framework";
import { Container } from "aurelia-dependency-injection";
import qEnv from "resources/qEnv.js";
import QConfig from "resources/QConfig.js";
import User from "resources/User.js";

@inject(User, QConfig, Loader, Container)
export default class Auth {
  loginError = null;

  loginCallbacks = [];

  constructor(user, qConfig, loader, diContainer, authService) {
    this.user = user;
    this.qConfig = qConfig;
    this.loader = loader;
    this.diContainer = diContainer;
    this.authService = authService;
  }

  async getAuthService() {
    const AureliaAuthentication = await this.loader.loadModule(
      "aurelia-authentication"
    );
    const AuthService = AureliaAuthentication.AuthService;
    return this.diContainer.get(AuthService);
  }

  async login(username, password) {
    const authConfig = await this.qConfig.get("auth");

    if (authConfig && authConfig.type === "token") {
      const authService = await this.getAuthService();
      authService.config.client.defaults.credentials = "include";
      await authService.login({
        username: username,
        password: password,
      });
    } else {
      const QServerBaseUrl = await qEnv.QServerBaseUrl;
      const response = await fetch(`${QServerBaseUrl}/authenticate`, {
        credentials: "include",
        method: "POST",
        body: JSON.stringify({
          username: username,
          password: password,
        }),
      });

      if (!response.ok) {
        throw response;
      }
    }

    return this.user.load();
  }

  async logout() {
    const authConfig = await this.qConfig.get("auth");

    if (authConfig && authConfig.type === "token") {
      // const authService = await this.getAuthService();
      // authService.logout();
      console.log("test more");
      const QServerBaseUrl = await qEnv.QServerBaseUrl;
      await fetch(`${QServerBaseUrl}/logout`, {
        credentials: "include",
        method: "POST",
      });
    } else {
      // cookie logout
      const QServerBaseUrl = await qEnv.QServerBaseUrl;
      await fetch(`${QServerBaseUrl}/logout`, {
        credentials: "include",
        method: "POST",
      });
    }

    return this.user.load();
  }
}
