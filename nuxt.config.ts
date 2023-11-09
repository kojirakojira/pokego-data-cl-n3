import vuetify from 'vite-plugin-vuetify'
// https://nuxt.com/docs/api/configuration/nuxt-config
console.log(`APP_ENV=${process.env.APP_ENV}`)

const defineNuxtConfig = async () => {
  const envVars: Record<string, string> = await import(`./env/${process.env.APP_ENV}`)
  return {
  // devtools: { enabled: true },
    runtimeConfig: envVars,
    modules: [
      '@nuxtjs/eslint-module',
      '@pinia/nuxt',
      '@pinia-plugin-persistedstate/nuxt'
    ],
    app: {
      head: {
        titleTemplate: '%s - ペリずかん',
        title: 'title',
        htmlAttrs: {
          lang: 'ja'
        },
        meta: [
          { charset: 'utf-8' },
          { name: 'viewport', content: 'width=device-width, initial-scale=1' },
          { hid: 'description', name: 'description', content: '' },
          { name: 'format-detection', content: 'telephone=no' },
          { name: 'google-site-verification', content: 'rwSZiGYezVoKWWBVOlGg5HLVZBZRba0JhnVRddn_q7k' }
        ],
        link: [
          { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
        ]
      }
    },
    css: [
      'vuetify/lib/styles/main.sass',
      '@mdi/font/css/materialdesignicons.css',
      '@/assets/styles/style.css',
      '@/assets/styles/common/mixin.scss'
    ],
    build: {
      transpile: ['vuetify']
    },
    hooks: {
      'vite:extendConfig': (config: any) => {
      config.plugins!.push(vuetify())
      }
    },
    vite: {
      define: {
        'process.env.DEBUG': false
      },
      ssr: {
        noExternal: ['vuetify']
      },
      // for HMR
      server: {
        watch: {
          usePolling: true
        }
      },
      css: {
        preprocessorOptions: {
          scss: {
            additionalData:
          '@import "@/assets/styles/variables.scss";' +
          '@import "@/assets/styles/common/common.scss";' +
          '@import "vuetify/styles";'
          }
        }
      }

    }
  }
}
export default defineNuxtConfig
