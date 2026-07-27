import type { SearchPatternNames } from '~/app.config'

export default defineNuxtPlugin(() => {
  if (import.meta.dev) {
    // searchPatternNamesに定義されているルートが実際に存在するかをチェックする。
    const appConfig = useAppConfig()
    const searchPatternNames = appConfig.searchPatternNames as unknown as SearchPatternNames
    const router = useRouter()

    // アプリ起動後にルートがすべて解決されてから検査するために、isReady()を待つ
    router.isReady().then(() => {
      const availableRoutes = router.getRoutes()

      Object.entries(searchPatternNames).forEach(([, category]) => {
        Object.entries(category.patternNames).forEach(([key, pattern]) => {
          const expectedRouteName = `search-${pattern.isTool ? 'tool-' : ''}${key}`
          if (!availableRoutes.some(r => r.name === expectedRouteName)) {
            console.warn(`[Dev Warning] Route not found: '${expectedRouteName}' (defined in app.config.ts searchPatternNames.${key})`)
          }
        })
      })
    })
  }
})
