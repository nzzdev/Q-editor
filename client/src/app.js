import { inject } from "aurelia-framework";
import { Redirect, Router } from "aurelia-router";
import User from "resources/User.js";
import QConfig from "resources/QConfig.js";
import qEnv from "resources/qEnv.js";

@inject(QConfig, User, Router)
export class App {
  routerMap;

  constructor(qConfig, user, router) {
    this.qConfig = qConfig;
    this.user = user;
    this.router = router;
  }

  canActivate() {
    return this.user.loaded;
  }

  async activate() {
    this.isPlayground = await qEnv.playground;
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
        title: "Login"
      },
      {
        route: ["", "index"],
        name: "index",
        moduleId: "pages/index",
        title: "Q",
        auth: true,
        desc: "Übersicht",
        iconName: "icon-logo"
      },
      {
        route: ["item/:id"],
        name: "item",
        moduleId: "pages/item-overview",
        auth: true
      },
      {
        route: ["editor/:tool/:id?"],
        name: "editor",
        moduleId: "pages/editor",
        auth: true
      },
      {
        route: ["feed"],
        name: "feed",
        moduleId: "pages/feed",
        auth: true
      },
      {
        route: ["tasks"],
        name: "tasks",
        moduleId: "pages/tasks",
        auth: true
      },
      {
        route: ["server-unavailable"],
        name: "server-unavailable",
        moduleId: "pages/server-unavailable",
        title: "Error"
      }
    ];

    config.map(routerMap);

    config.fallbackRoute("index");

    return qEnv.pushState.then(pushState => {
      if (!pushState) {
        return;
      }
      config.options.pushState = true;
      config.options.root = "/";
    });
  }

  async attached() {
    // load any additional stylesheets defined for themeing or font-face loading as @font-face doesn't work within ShadowRoot (used for the preview)
    try {
      const stylesheets = await this.qConfig.get("stylesheets");
      if (stylesheets && stylesheets.length) {
        stylesheets
          .map(stylesheet => {
            if (!stylesheet.url && stylesheet.path) {
              stylesheet.url = `${QServerBaseUrl}${stylesheet.path}`;
            }
            return stylesheet;
          })
          .map(stylesheet => {
            if (stylesheet.url) {
              let link = document.createElement("link");
              link.type = "text/css";
              link.rel = "stylesheet";
              link.href = stylesheet.url;
              document.head.appendChild(link);
            } else if (stylesheet.content) {
              let style = document.createElement("style");
              style.type = "text/css";
              style.appendChild(document.createTextNode(stylesheet.content));
              document.head.appendChild(style);
            }
          });
      }
    } catch (e) {
      // nevermind
    }
  }
}

@inject(User, QConfig)
class AuthorizeStep {
  constructor(user, qConfig) {
    this.user = user;
    this.qConfig = qConfig;
  }

  run(navigationInstruction, next) {
    // Check if the route has an "auth" key
    if (navigationInstruction.getAllInstructions().some(i => i.config.auth)) {
      return this.user.loaded
        .then(() => {
          if (!this.user.isLoggedIn) {
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
        .catch(e => {
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
        .some(i => i.config.name === "server-unavailable")
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
