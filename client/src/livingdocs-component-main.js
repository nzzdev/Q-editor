import QConfig from "resources/QConfig.js";
import Backend from "i18next-fetch-backend";
import ToolsInfo from "resources/ToolsInfo.js";
import qEnv from "resources/qEnv.js";

import CurrentItemProvider from "resources/CurrentItemProvider.js";

export async function configure(aurelia) {
  aurelia.use.singleton(QConfig);
  aurelia.use.singleton(ToolsInfo);
  aurelia.use.singleton(CurrentItemProvider);
  aurelia.use
    .standardConfiguration()
    .feature("elements/atoms")
    .feature("resources/availability-checks")
    .feature("binding-behaviors")
    .feature("value-converters")
    .plugin("aurelia-i18n", async (instance) => {
      // register backend plugin
      instance.i18next.use(Backend);

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
      const QServerBaseUrl = await qEnv.QServerBaseUrl;
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
        ns: ["translation", "tools"].concat(toolNames),
        defaultNS: "editorConfig",
        fallbackNS: "translation",
        load: "languageOnly",
        debug: false,
      });
    });

  aurelia.start().then((a) => a.setRoot("livingdocs-component-app/app"));
}
