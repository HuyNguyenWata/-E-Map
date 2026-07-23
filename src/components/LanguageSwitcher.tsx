import { useTranslation } from "react-i18next";
import { getStoredLanguage, setStoredLanguage } from "../i18n";
import type { LanguageCode } from "../i18n";

function LanguageSwitcher() {
  const { t } = useTranslation();
  const current = getStoredLanguage();

  const handleChange = (lang: LanguageCode) => {
    if (lang !== current) setStoredLanguage(lang);
  };

  return (
    <div style={{ display: "flex", gap: 4 }}>
      <button
        type="button"
        className={"btn btn-sm" + (current === "vi" ? " btn-active" : "")}
        onClick={() => handleChange("vi")}
        title={t("language.vi")}
      >
        🇻🇳 VI
      </button>
      <button
        type="button"
        className={"btn btn-sm" + (current === "en" ? " btn-active" : "")}
        onClick={() => handleChange("en")}
        title={t("language.en")}
      >
        🇬🇧 EN
      </button>
    </div>
  );
}

export default LanguageSwitcher;
