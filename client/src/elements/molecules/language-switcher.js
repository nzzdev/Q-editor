import { inject } from "aurelia-framework";
import { I18N } from "aurelia-i18n";
import QConfig from "resources/QConfig.js";

@inject(QConfig, I18N)
export class LanguageSwitcher {
  constructor(qConfig, i18n) {
    this.qConfig = qConfig;
    this.i18n = i18n;
    this.setup();
  }

  async setup() {
    this.availableLanguages = await this.qConfig.get("languages");
    let defaultLanguage = "en";
    if (this.availableLanguages && this.availableLanguages.length > 0) {
      defaultLanguage = this.availableLanguages[0].key;
    }
    this.switchLanguage(navigator.language || defaultLanguage);
  }

  switchLanguage(language) {
    this.i18n.setLocale(language);
  }
}
