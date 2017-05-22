// clear the load error timeout
window.clearTimeout(window.QLoadErrorTimeout);

import { LogManager } from 'aurelia-framework';
import { ConsoleAppender } from 'aurelia-logging-console';

import QConfig from 'resources/QConfig.js';
import QTargets from 'resources/QTargets.js';
import Auth from 'resources/Auth.js';
import User from 'resources/User.js';
import MessageService from 'resources/MessageService.js';
import EmbedCodeGenerator from 'resources/EmbedCodeGenerator.js';
import ItemStore from 'resources/ItemStore.js';
import Statistics from 'resources/Statistics.js';
import ToolsInfo from 'resources/ToolsInfo.js';
import SchemaEditorInputAvailabilityChecker from 'resources/SchemaEditorInputAvailabilityChecker.js';
import ToolEndpointChecker from 'resources/ToolEndpointChecker.js';
import qEnv from 'resources/qEnv.js';
import { registerEastereggs } from 'eastereggs.js';

import Backend from 'i18next-fetch-backend';

export async function configure(aurelia) {
  aurelia.use.singleton(QConfig);
  aurelia.use.singleton(Auth);
  aurelia.use.singleton(EmbedCodeGenerator);
  aurelia.use.singleton(Statistics);
  aurelia.use.singleton(ItemStore);
  aurelia.use.singleton(MessageService);
  aurelia.use.singleton(QTargets);
  aurelia.use.singleton(ToolsInfo);
  aurelia.use.singleton(ToolEndpointChecker);
  aurelia.use.singleton(SchemaEditorInputAvailabilityChecker);
  aurelia.use.singleton(User);

  aurelia.use
    .standardConfiguration()
    .feature('elements/atoms')
    .feature('elements/molecules')
    .feature('elements/organisms')
    .feature('icons')
    .feature('binding-behaviors')
    .feature('value-converters')
    .plugin('aurelia-dialog')
    .plugin('aurelia-i18n', async (instance) => {
      // register backend plugin
      instance.i18next.use(Backend);

      let availableLanguages = ['de', 'en'];
      try {
        let configuredLanguages = await aurelia.container.get(QConfig).get('languages');
        if (configuredLanguages && configuredLanguages.length > 0) {
          availableLanguages = configuredLanguages.map(lang => lang.key);
        }
      } catch (e) {
        // do not care and use the default availableLanguages
      }

      // we need these for the calculation of the path to the locales files
      const QServerBaseUrl = await qEnv.QServerBaseUrl;
      const configuredTools = await aurelia.container.get(ToolsInfo).getAvailableTools();
      const toolNames = configuredTools.map(tool => tool.name);

      // adapt options to your needs (see http://i18next.com/docs/options/)
      // make sure to return the promise of the setup method, in order to guarantee proper loading
      return instance.setup({
        backend: {
          loadPath: (lngs, namespaces) => {
            const namespace = namespaces[0];
            if (namespace === 'tools') {
              return `${QServerBaseUrl}/editor/locales/{{lng}}/translation.json`;
            }
            if (toolNames.indexOf(namespace) >= 0) {
              return `${QServerBaseUrl}/tools/${namespace}/locales/{{lng}}/translation.json`;
            }
            return '/locales/{{lng}}/{{ns}}.json';
          },
          init: {
            mode: 'cors',
            credentials: 'same-origin',
            cache: 'default'
          }
        },
        attributes: ['t', 'i18n'],
        fallbackLng: 'de',
        lng: availableLanguages[0],
        whitelist: availableLanguages,
        ns: ['translation', 'tools'].concat(toolNames),
        defaultNS: 'translation',
        load: 'languageOnly',
        debug: false
      });
    })
  ;

  const devLogging = await qEnv.devLogging;
  let logLevel = LogManager.logLevel.info;
  if (devLogging) {
    aurelia.use
      .plugin('aurelia-testing');
    logLevel = LogManager.logLevel.debug;
  }

  LogManager.addAppender(new ConsoleAppender());
  LogManager.setLevel(logLevel);

  aurelia.start().then(a => a.setRoot());

  const eastereggConfig = await aurelia.container.get(QConfig).get('eastereggs');
  registerEastereggs(eastereggConfig);
}
