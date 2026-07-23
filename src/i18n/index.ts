import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import vi from "./locales/vi";
import en from "./locales/en";

const STORAGE_KEY = "vms_language";

export type LanguageCode = "vi" | "en";

export function getStoredLanguage(): LanguageCode {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored === "en" ? "en" : "vi";
}

export function setStoredLanguage(lang: LanguageCode) {
  localStorage.setItem(STORAGE_KEY, lang);
  i18n.changeLanguage(lang);
}

i18n.use(initReactI18next).init({
  resources: {
    vi: { translation: vi },
    en: { translation: en },
  },
  lng: getStoredLanguage(),
  fallbackLng: "vi",
  interpolation: { escapeValue: false },
});

export default i18n;
