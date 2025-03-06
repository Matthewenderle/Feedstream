// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  colorMode: {
    classSuffix: '',
  },
  css: ['~/assets/css/main.scss'],
  compatibilityDate: '2024-11-01',
  srcDir: 'app/',
  devtools: { enabled: true },
  future: {
    compatibilityVersion: 4,
  },
  modules: [
    '@nuxt/eslint',
    '@nuxtjs/tailwindcss',
    '@nuxtjs/color-mode',
    '@nuxt/icon',
    [
      '@pinia/nuxt',
      {
        autoImports: ['defineStore', 'acceptHMRUpdate'],
      },
    ],
    'pinia-plugin-persistedstate/nuxt',
    [
      '@nuxtjs/supabase',
      {
        url: process.env.ENV === 'development' ? process.env.SUPABASE_URL_DEV : process.env.SUPABASE_URL,
        key: process.env.ENV === 'development' ? process.env.SUPABASE_KEY_DEV : process.env.SUPABASE_KEY,
        redirect: false,
        redirectOptions: {
          login: '/auth/login',
          callback: '/auth/confirm',
          exclude: ['/', '/auth/**', '/privacy-policy', '/terms-of-service'],
        },
      },
    ],
  ],
  runtimeConfig: {
    public: {
      environment: process.env.ENV || 'development',
      googleAnalyticsId: process.env.ENV === 'development' ? undefined : process.env.GOOGLE_ANALYTICS_ID,
      siteURL: process.env.SITE_URL,
      emailSMTPAdmin: process.env.EMAIL_ADMIN,
    },
    private: {
      supabaseProjectId: process.env.SUPABASE_PROJECT_ID,
      supabaseRegion: process.env.SUPABASE_REGION,
      supabasePass: process.env.SUPABASE_DB_PASSWORD,
      emailSMTPUser: process.env.EMAIL_USER,
      emailSMTPPassword: process.env.EMAIL_PASS,
      emailSMTPHost: process.env.EMAIL_HOST,
      emailSMTPPort: process.env.EMAIL_PORT || '587',
    },
  },
  supabase: {
    url: process.env.ENV === 'development' ? process.env.SUPABASE_URL_DEV : process.env.SUPABASE_URL,
    key: process.env.ENV === 'development' ? process.env.SUPABASE_KEY_DEV : process.env.SUPABASE_KEY,
    redirect: false,
    redirectOptions: {
      login: '/',
      callback: '/checkLogin',
      exclude: [
        '/',
        '/register',
        '/privacy-policy',
        '/checkLogin',
        '/changelog',
        '/terms-of-service',
        '/forgot-password',
        '/reset-password**',
        '/contact',
        '/maintenance-mode',
        '/feature**',
        '/roadmap**',
        '/changelog**',
      ],
    },
  },
});
