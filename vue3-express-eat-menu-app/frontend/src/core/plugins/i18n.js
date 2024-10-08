import { createI18n } from "vue-i18n";
import localeJsonData from "../../locales/i18n-locales";

const messages = {
  en: localeJsonData.en,
  de: localeJsonData.de,
};

const i18n = createI18n({
  legacy: true,
  locale: "en",
  globalInjection: true,
  messages,
});

export default i18n;
