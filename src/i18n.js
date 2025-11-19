import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import ruDocs from "./locales/ru/ru.json";
import enDocs from "./locales/en/en.json";

i18n
  .use(initReactI18next)
  .init({
    resources: {
      ru: { docs: ruDocs },
      en: { docs: enDocs }
    },
    lng: "ru", // язык по умолчанию
    fallbackLng: "en",
    interpolation: { escapeValue: false }
  });

export default i18n;
