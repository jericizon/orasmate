// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  app: {
    baseURL: '/orasmate/'
  },

  modules: [
    '@pinia/nuxt',
    '@nuxtjs/tailwindcss',
    '@nuxtjs/color-mode',
    '@vueuse/nuxt',
    'pinia-plugin-persistedstate/nuxt'
  ],

  colorMode: {
    classSuffix: '',
    preference: 'system'
  },

  ssr: false,

  nitro: {
    prerender: {
      routes: ['/']
    }
  }
})
