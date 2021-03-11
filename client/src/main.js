// clear the load error timeout
window.clearTimeout(window.QLoadErrorTimeout);

import { LogManager, Loader } from "aurelia-framework";
import { ConsoleAppender } from "aurelia-logging-console";

import { Backend } from "aurelia-i18n";

import QConfig from "resources/QConfig.js";
import QTargets from "resources/QTargets.js";
import Auth from "resources/Auth.js";
import User from "resources/User.js";
import EmbedCodeGenerator from "resources/EmbedCodeGenerator.js";
import ItemStore from "resources/ItemStore.js";
import Statistics from "resources/Statistics.js";
import ToolsInfo from "resources/ToolsInfo.js";
import AvailabilityChecker from "resources/checkers/AvailabilityChecker.js";
import NotificationChecker from "resources/checkers/NotificationChecker.js";
import ToolEndpointChecker from "resources/checkers/ToolEndpointChecker.js";
import ItemActionController from "resources/ItemActionController.js";
import IdGenerator from "resources/IdGenerator.js";
import CurrentItemProvider from "resources/CurrentItemProvider.js";
import ObjectFromSchemaGenerator from "resources/ObjectFromSchemaGenerator.js";
import qEnv from "resources/qEnv.js";
import { registerEastereggs } from "eastereggs.js";

export async function configure(aurelia) {
  aurelia.use.singleton(QConfig);
  aurelia.use.singleton(Auth);
  aurelia.use.singleton(EmbedCodeGenerator);
  aurelia.use.singleton(Statistics);
  aurelia.use.singleton(ItemStore);
  aurelia.use.singleton(QTargets);
  aurelia.use.singleton(ToolsInfo);
  aurelia.use.singleton(AvailabilityChecker);
  aurelia.use.singleton(NotificationChecker);
  aurelia.use.singleton(ToolEndpointChecker);
  aurelia.use.singleton(IdGenerator);
  aurelia.use.singleton(CurrentItemProvider);
  aurelia.use.singleton(ObjectFromSchemaGenerator);
  aurelia.use.singleton(User);
  aurelia.use.singleton(ItemActionController);

  const QServerBaseUrl = await qEnv.QServerBaseUrl;

  aurelia.use
    .standardConfiguration()
    .feature("elements/atoms")
    .feature("elements/molecules")
    .feature("elements/organisms")
    .feature("icons")
    .feature("resources/availability-checks")
    .feature("resources/notification-checks")
    .feature("binding-behaviors")
    .feature("value-converters")
    .plugin("aurelia-dialog", (config) => {
      config.useDefaults();
      config.settings.lock = false;
      config.settings.centerHorizontalOnly = true;
      config.settings.overlayDismiss = true;
    })
    .plugin("aurelia-i18n", async (instance) => {
      // register backend plugin
      instance.i18next.use(Backend.with(aurelia.loader));

      let availableLanguages = ["de", "en"];
      try {
        let configuredLanguages = await aurelia.container
          .get(QConfig)
          .get("languages");
        if (configuredLanguages && configuredLanguages.length > 0) {
          availableLanguages = configuredLanguages.map((lang) => lang.key);
        }
      } catch (e) {
        // do not care and use the default availableLanguages
      }

      // we need these for the calculation of the path to the locales files
      const configuredTools = await aurelia.container
        .get(ToolsInfo)
        .getAvailableTools();
      const toolNames = configuredTools.map((tool) => tool.name);

      // adapt options to your needs (see http://i18next.com/docs/options/)
      // make sure to return the promise of the setup method, in order to guarantee proper loading
      return instance.setup({
        backend: {
          loadPath: (lngs, namespaces) => {
            const namespace = namespaces[0];
            if (namespace === "editorConfig") {
              return `${QServerBaseUrl}/editor/locales/{{lng}}/translation.json`;
            }
            if (namespace === "tools") {
              return `${QServerBaseUrl}/editor/tools/locales/{{lng}}/translation.json`;
            }
            if (toolNames.indexOf(namespace) >= 0) {
              return `${QServerBaseUrl}/tools/${namespace}/locales/{{lng}}/translation.json`;
            }
            return "/locales/{{lng}}/{{ns}}.json";
          },
          init: {
            mode: "cors",
            credentials: "same-origin",
            cache: "default",
          },
        },
        attributes: ["t", "i18n"],
        fallbackLng: "de",
        lng: availableLanguages[0],
        whitelist: availableLanguages,
        ns: ["translation", "tools", "editorConfig"].concat(toolNames),
        defaultNS: "editorConfig",
        fallbackNS: "translation",
        load: "languageOnly",
        debug: false,
      });
    })
    .plugin("aurelia-notification", (config) => {
      config.configure({
        translate: true, // 'true' needs aurelia-i18n to be configured
        notifications: {
          info: {
            addnCls: "humane-info",
            clickToClose: true,
          },
          success: {
            addnCls: "humane-success",
            clickToClose: true,
          },
          warning: {
            addnCls: "humane-warning",
            clickToClose: true,
          },
          error: {
            addnCls: "humane-error",
            timeout: 0,
            clickToClose: true,
          },
        },
        defaults: {
          timeout: 3000,
          addnCls: "q-text",
        },
      });
    });

  // if we have token based auth configured, load and configure aurelia-authentication plugin
  const qConfig = aurelia.container.get(QConfig);
  const authConfig = await qConfig.get("auth");
  if (authConfig && authConfig.type === "token") {
    // configure the aurelia-fetch-client interceptor to add the auth token to every request
    const loader = aurelia.container.get(Loader);
    const AureliaAuthentication = await loader.loadModule(
      "aurelia-authentication"
    );
    const FetchConfig = AureliaAuthentication.FetchConfig;
    const fetchConfig = aurelia.container.get(FetchConfig);
    fetchConfig.configure();

    aurelia.use.plugin("aurelia-authentication", (baseConfig) => {
      baseConfig.configure({
        baseUrl: QServerBaseUrl,
        loginUrl: "/authenticate",
        loginRedirect: false,
        logoutRedirect: false,
      });
    });
  }

  const devLogging = await qEnv.devLogging;
  let logLevel = LogManager.logLevel.info;
  if (devLogging) {
    aurelia.use.plugin("aurelia-testing");
    logLevel = LogManager.logLevel.debug;
  }

  LogManager.addAppender(new ConsoleAppender());
  LogManager.setLevel(logLevel);

  aurelia.start().then((a) => a.setRoot());

  const eastereggConfig = await aurelia.container
    .get(QConfig)
    .get("eastereggs");
  registerEastereggs(eastereggConfig);
}
