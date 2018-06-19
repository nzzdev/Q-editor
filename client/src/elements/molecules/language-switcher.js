import { inject, observable } from "aurelia-framework";
import { I18N } from "aurelia-i18n";
import QConfig from "resources/QConfig.js";

@inject(QConfig, I18N)
export class LanguageSwitcher {
  @observable selectedLanguageKey;

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
    if (navigator.language) {
      defaultLanguage = navigator.language.split("-")[0];
    }
    this.selectedLanguageKey = defaultLanguage;
    this.languageOptions = this.availableLanguages.map(lang => {
      return {
        value: lang.key,
        label: lang.label
      };
    });
  }

  selectedLanguageKeyChanged() {
    this.i18n.setLocale(this.selectedLanguageKey);
  }
}
