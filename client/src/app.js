import { inject } from 'aurelia-framework';
import { Redirect, Router } from 'aurelia-router';
import User from 'resources/User.js';
import QConfig from 'resources/QConfig.js';
import qEnv from 'resources/qEnv.js';

@inject(User, Router)
export class App {

  routerMap;

  constructor(user, router) {
    this.user = user;
    this.router = router;
  }

  canActivate() {
    return this.user.loaded;
  }

  configureRouter(config, router) {
    this.router = router;
    config.title = 'NZZ Q';
    config.addPipelineStep('authorize', AuthorizeStep); // Add a route filter to the authorize extensibility point.

    let routerMap = [
      {
        route: ['login'],
        name: 'login',
        moduleId: 'pages/login',
        title: 'Login'
      },
      {
        route: ['', 'index'],
        name: 'index',
        moduleId: 'pages/index',
        title: 'Q',
        auth: true,
        desc: 'Übersicht',
        iconName: 'icon-logo'
      },
      {
        route: ['item/:id'],
        name: 'item',
        moduleId: 'pages/item-overview',
        auth: true,
      },
      {
        route: ['editor/:tool/:id?'],
        name: 'editor',
        moduleId: 'pages/editor',
        auth: true,
      }
    ];

    router.configure(config => {
      config.map(routerMap);
    })

    config.fallbackRoute('index');

    return qEnv.pushState
      .then(pushState => {
        if (!pushState) {
          return;
        }
        config.options.pushState = true;
        config.options.root = '/';
      })
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
    // The reason for using `nextInstructions` is because
    // this includes child routes.
    if (navigationInstruction.getAllInstructions().some(i => i.config.auth)) {
      return this.user.loaded
        .then(() => {
          if (!this.user.isLoggedIn) {
            return next.cancel(new Redirect('login'));
          } else {
            return next();
          }
        })
        .catch((e) => {
          return next.cancel(new Redirect('login'));
        })
    }

    return next();
  }
}
