import vuetify from 'vite-plugin-vuetify'
// https://nuxt.com/docs/api/configuration/nuxt-config
console.log(`APP_ENV=${process.env.APP_ENV}`) // eslint-disable-line no-console

const defineNuxtConfig = async () => {
  let envVars: Record<string, string> = {}
  if (process.env.APP_ENV) {
    envVars = await import(`./env/${process.env.APP_ENV}`)
  }
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
      logLevel: 'info',
      define: {
        __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: false,
        'process.env.DEBUG': false
      },
      vue: {
        script: {
          defineModel: true, // TODO: Vue v3.4.15にバージョンアップさせた際に追加。（将来的にいらなくなりそう）
          propsDestructure: true // TODO: Vue v3.4.15にバージョンアップさせた際に追加。（将来的にいらなくなりそう）
        }
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
          '@import "@/assets/styles/common/common.scss";' +
          '@import "vuetify/styles";'
          }
        }
      }

    }
  }
}
export default defineNuxtConfig
