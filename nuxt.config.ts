// https://nuxt.com/docs/api/configuration/nuxt-config
console.log(`APP_ENV=${process.env.APP_ENV}`) // eslint-disable-line no-console

const defineNuxtConfig = async () => {
  let envVars: Record<string, string> = {}
  if (process.env.APP_ENV) {
    envVars = await import(`./env/${process.env.APP_ENV}`)
  }
  console.log(`envVars=${JSON.stringify(envVars)}`) // eslint-disable-line no-console
  return {
    // devtools: { enabled: true },
    runtimeConfig: envVars,
    server: {
      port: process.env.PORT || 3000
    },
    modules: [
      '@nuxtjs/eslint-module',
      '@pinia/nuxt',
      'pinia-plugin-persistedstate/nuxt',
      'vuetify-nuxt-module',
      '@nuxtjs/robots'
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
      '@mdi/font/css/materialdesignicons.css',
      '@/assets/styles/style.css',
      '@/assets/styles/common/mixin.scss'
    ],
    vite: {
      logLevel: 'warn',
      define: {
        __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: false,
        'process.env.DEBUG': false
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
            api: 'modern-compiler',
            additionalData:
              '@use "@/assets/styles/common/common.scss" as *;'
          }
        }
      }
    },
    robots: {
      groups: [
        {
          userAgent: ['*'],
          disallow: ['/manage', '/search/tool/']
        }
      ]
    }
  }
}
export default defineNuxtConfig
