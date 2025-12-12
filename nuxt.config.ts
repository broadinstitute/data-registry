// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,

  devtools: {
      enabled: true,

      timeline: {
          enabled: true,
      },
  },
  build: {
    sourcemap: true,  // Ensure this is enabled
  },

  app: {
      head: {
          title: "KPN Data Registry",
      },
      buildAssetsDir: `/_nuxt/${Date.now()}/`
  },

  css: [
      //"bootstrap/dist/css/bootstrap.css",
      "bootstrap-icons/font/bootstrap-icons.css",
      //"assets/css/styles.css",
      "primeicons/primeicons.css",
      "primeflex/primeflex.scss",
      "primevue/resources/primevue.min.css",
      "@/assets/styles.scss",
      // "assets/css/base.css",
      "primevue/resources/themes/aura-light-indigo/theme.css", // Default theme for hermes/datasets
  ],

  runtimeConfig: {
      public: {
          skipAuth: false,
          apiBaseUrl: "",
          phenotypesUrl: "",
          googleAuthClientId: "",
          googleAuthRedirectUri: "",
          // User service configuration for SGC
          userServiceUrl: "https://users.kpndataregistry.org",
          sgcUserGroup: "sgc"
      },
  },

  modules: [
      "@pinia/nuxt",
      "@nuxt/devtools", // "@nuxtjs/tailwindcss",
      "nuxt-primevue",
      "nuxt-shiki",
  ],

  primevue: {
      options: { unstyled: false, ripple: true },
      //importPT: {
      //    from: "/presets/lara/",
      //}, //import and apply preset
      components: {
          // prefix: "Prime",
      },
  },

  shiki: {
      bundledLangs: [
          "javascript",
          "typescript",
          "json",
          "html",
          "css",
          "scss",
          "yaml",
          "markdown",
          "r",
      ],
  },


  telemetry: false,

  hooks: {
      'pages:extend'(pages) {
          // add a route
          pages.push({
              path: '/',
              redirect: '/datasets'
          });
      }
  },
    vite: {
        server: {
            allowedHosts: ['local.kpndataregistry.org']
        }
    },

  compatibilityDate: "2024-07-15"
});
