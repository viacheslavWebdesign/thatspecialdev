// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: false },
  modules: ["@nuxtjs/tailwindcss", "@tresjs/nuxt", "@nuxtjs/i18n"],
  compatibilityDate: "2024-11-01",
  components: {
    dirs: ["blocks", "components"],
  },
  app: {
    head: {
      link: [
        {
          rel: "stylesheet",
          href: "/fonts/NeueMachina/stylesheet.css",
        },
        {
          rel: "stylesheet",
          href: "/fonts/TTInterfaces/stylesheet.css",
        },
      ],
    },
  },
  i18n: {
    vueI18n: "./i18n.config.ts",
    locales: ["en", "ua", "ru"],
    lazy: false,
    strategy: "prefix_except_default",
    defaultLocale: "en",
    trailingSlash: true,
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: "i18n_redirected",
      alwaysRedirect: true,
      fallbackLocale: "en",
    },
  },
  runtimeConfig: {
    private: {
      wpKey: process.env.WP_API_KEY,
    },
  },
});
