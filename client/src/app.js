import { inject } from "aurelia-framework";
import { Redirect, Router } from "aurelia-router";
import { AureliaCookie } from "aurelia-cookie";
import User from "resources/User.js";
import QConfig from "resources/QConfig.js";
import qEnv from "resources/qEnv.js";
import { SessionStorage } from "./session-storage";
import { LegacyDialog } from "dialogs/legacy-dialog";
import Cookie from "resources/Cookie";
import { DialogService } from "aurelia-dialog";

@inject(QConfig, User, Router, DialogService, Cookie)
export class App {
  routerMap;

  constructor(qConfig, user, router, dialogService, cookie) {
    this.qConfig = qConfig;
    this.user = user;
    this.router = router;
    this.dialogService = dialogService;
    this.cookie = cookie;
  }

  canActivate() {
    return this.user.loaded;
  }

  async activate() {
    this.isPlayground = await qEnv.playground;
    await this.openLegacyDialog();
  }

  configureRouter(config, router) {
    this.router = router;
    config.title = "NZZ Q";
    config.addPreActivateStep(ConfigAvailableCheckStep);
    config.addAuthorizeStep(AuthorizeStep); // Add a route filter to the authorize extensibility point.
    config.addPipelineStep("postcomplete", ScrollToTopStep);

    let routerMap = [
      {
        route: ["login"],
        name: "login",
        moduleId: "pages/login",
        title: "Login",
      },
      {
        route: ["", "index"],
        name: "index",
        moduleId: "pages/index",
        title: "Q",
        auth: true,
        desc: "Übersicht",
        iconName: "icon-logo",
      },
      {
        route: ["item/:id"],
        name: "item",
        moduleId: "pages/item-overview",
        auth: true,
      },
      {
        route: ["editor/:tool/:id?"],
        name: "editor",
        moduleId: "pages/editor",
        auth: true,
      },
      {
        route: ["feed"],
        name: "feed",
        moduleId: "pages/feed",
        auth: true,
      },
      {
        route: ["tasks/:id?"],
        name: "tasks",
        moduleId: "pages/tasks",
        auth: true,
      },
      {
        route: ["q-item-picker"],
        name: "q-item-picker",
        moduleId: "pages/q-item-picker",
        auth: true,
      },
      {
        route: ["server-unavailable"],
        name: "server-unavailable",
        moduleId: "pages/server-unavailable",
        title: "Error",
      },
    ];

    config.map(routerMap);

    config.fallbackRoute("index");

    return qEnv.pushState.then((pushState) => {
      if (!pushState) {
        return;
      }
      config.options.pushState = true;
      config.options.root = "/";
    });
  }

  async attached() {
    // Wait for the app to be fully attached to the DOM
    await this.openLegacyDialog();
  }

  async openLegacyDialog() {
    try {
      const legacyCookie = await this.cookie.getCookie();
      if (legacyCookie !== "shown") {
        // Small delay to ensure app is fully loaded
        await new Promise((resolve) => setTimeout(resolve, 500));
        await this.dialogService.open({
          viewModel: LegacyDialog,
          model: {},
        });
      }
    } catch (error) {
      console.error("Failed to check legacy dialog cookie:", error);
    }
  }
}

@inject(User, QConfig, SessionStorage)
class AuthorizeStep {
  constructor(user, qConfig, sessionStorage) {
    this.user = user;
    this.qConfig = qConfig;
    this.sessionStorage = sessionStorage;
  }

  run(navigationInstruction, next) {
    // Check if the route has an "auth" key
    if (navigationInstruction.getAllInstructions().some((i) => i.config.auth)) {
      const azureSession = AureliaCookie.get("azureSession");
      const headers = {
        Authorization: `Bearer ${azureSession}`,
      };

      return this.user
        .loaded(headers)
        .then((resp) => {
          if (!this.user.isLoggedIn) {
            // Store the current route to redirect after login (for azure login)
            if (window.location.pathname !== "/") {
              this.sessionStorage.setItem(
                "redirectPathAfterLogin",
                window.location.href
              );
            }

            this.redirectBackAfterLoginRoute = navigationInstruction.fragment;
            return next.cancel(new Redirect("login"));
          }
          if (this.redirectBackAfterLoginRoute) {
            let route = this.redirectBackAfterLoginRoute;
            delete this.redirectBackAfterLoginRoute;
            return next.cancel(new Redirect(route));
          }
          return next();
        })
        .catch((e) => {
          this.redirectBackAfterLoginRoute = navigationInstruction.fragment;
          return next.cancel(new Redirect("login"));
        });
    }

    return next();
  }
}

@inject(QConfig)
class ConfigAvailableCheckStep {
  constructor(qConfig) {
    this.qConfig = qConfig;
  }

  async run(navigationInstruction, next) {
    if (
      navigationInstruction
        .getAllInstructions()
        .some((i) => i.config.name === "server-unavailable")
    ) {
      try {
        await this.qConfig.configLoaded;
        if (!this.qConfig.config) {
          return next();
        }
        return next.cancel(new Redirect("index"));
      } catch (e) {
        return next();
      }
    }
    try {
      await this.qConfig.configLoaded;
      if (!this.qConfig.config) {
        return next.cancel(new Redirect("server-unavailable"));
      }
      return next();
    } catch (e) {
      return next.cancel(new Redirect("server-unavailable"));
    }
  }
}

class ScrollToTopStep {
  run(instruction, next) {
    if (!instruction.config.settings.noScrollToTop) {
      window.scrollTo(0, 0);
    }

    return next();
  }
}
