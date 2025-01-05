import en from "@/public/locales/en.json";
import ua from "@/public/locales/ua.json";
import ru from "@/public/locales/ru.json";

export default defineI18nConfig(() => ({
  legacy: false,
  locale: "en",
  fallbackLocale: "en",
  globalInjection: true,
  escapeParameterHtml: true,
  warnHtmlMessage: false,
  messages: {
    en,
    ua,
    ru,
  },
}));
