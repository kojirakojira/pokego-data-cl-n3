interface FetchResult<T = any, E = any> {
  data: T | null,
  error?: E | null,
  pending?: Ref<boolean>,
  refresh?: () => Promise<void> | void,
  server: boolean
}

export default async <T = any>(
  argEndpoint: string,
  argMethod: string,
  argOptions?: Record<string, any>,
  transition?: boolean
): Promise<FetchResult<T>> => {
  const method: string = argMethod || 'GET'
  const options: Record<string, any> = {
    method,
    server: false,
    ...argOptions
  }
  // url形式ならそのまま。なければAPIサーバへのアクセスとする。
  const url = argEndpoint.search(/:\/\//) > 0 ? argEndpoint : useRuntimeConfig().public.apiUrl + argEndpoint
  if (import.meta.server) {
    // サーバ側で実行する場合
    const { data, error, pending, refresh } = await useAsyncData(
      argEndpoint,
      () => $fetch(url, options))

    if (error.value?.statusCode === 422) {
      // 422は入力チェックエラー。正常系として処理する。（エラー情報はそのまま返却する。）
      data.value = (error.value as { data?: T }).data || null
    } else if (transition && error.value) {
      // transitionがtrueの場合、エラー画面に遷移させる。
      const errVal = error.value as { statusCode?: number; data?: string }
      const message = !errVal.statusCode && !errVal.data ? 'サーバとの通信に失敗しました。' : errVal.data
      throw createError({ statusCode: errVal.statusCode, message, fatal: true })
    }

    return {
      data: data.value ? { ...data.value } : null,
      error: error.value ? { ...error.value } : null,
      pending,
      refresh,
      server: true
    }
  } else {
    // クライアントで実行する場合
    const data = await $fetch(url, options)
      .catch((err) => {
        if (err.statusCode === 422) {
          // 入力チェックエラーは無視
          return err.data
        } else {
          const message = !err.statusCode && !err.data ? 'サーバとの通信に失敗しました。' : err.data
          throw createError({ statusCode: err.statusCode, message, fatal: true })
        }
      }) as T
    return {
      data,
      server: false
    }
  }
}
