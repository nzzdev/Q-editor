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
import qEnv from 'resources/qEnv.js';
import { registerEastereggs } from 'eastereggs.js';

import Backend from 'i18next-xhr-backend';

export async function configure(aurelia) {
  aurelia.use.singleton(QConfig);

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

      // adapt options to your needs (see http://i18next.com/docs/options/)
      // make sure to return the promise of the setup method, in order to guarantee proper loading
      return instance.setup({
        backend: {
          loadPath: './locales/{{lng}}/{{ns}}.json'
        },
        attributes: ['t', 'i18n'],
        fallbackLng: 'de',
        lng: availableLanguages[0],
        whitelist: availableLanguages,
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

  aurelia.use.singleton(Auth);
  aurelia.use.singleton(EmbedCodeGenerator);
  aurelia.use.singleton(Statistics);
  aurelia.use.singleton(ToolsInfo);
  aurelia.use.singleton(ItemStore);
  aurelia.use.singleton(MessageService);
  aurelia.use.singleton(QTargets);

  aurelia.use.singleton(User);

  aurelia.start().then(a => a.setRoot());

  const eastereggConfig = await aurelia.container.get(QConfig).get('eastereggs');
  registerEastereggs(eastereggConfig);
}
