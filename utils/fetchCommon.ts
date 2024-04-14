interface FetchResult {
  data: Record<string, any> | null,
  error?: Record<string, any> | null,
  pending?: Ref<boolean>,
  refresh?: Function,
  server: boolean
}

export default async (
  argEndpoint: string,
  argMethod: string,
  argOptions?: {[key: string]: any},
  transition?: boolean
): Promise<FetchResult> => {
  const method: string = argMethod || 'GET'
  const options: Record<string, string | boolean> = {
    method,
    server: false,
    ...argOptions
  }
  // url形式ならそのまま。なければAPIサーバへのアクセスとする。
  console.log(useRuntimeConfig())
  const url = argEndpoint.search(/:\/\//) > 0 ? argEndpoint : useRuntimeConfig().public.apiUrl + argEndpoint
  if (process.server) {
    // サーバ側で実行する場合
    const { data, error, pending, refresh } = await useAsyncData(
      argEndpoint,
      () => $fetch(url, options))

    if (transition && error.value) {
      // transitionがtrueの場合、エラー画面に遷移させる。
      const errVal: any = error.value
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
        const message = !err.statusCode && !err.data ? 'サーバとの通信に失敗しました。' : err.data
        throw createError({ statusCode: err.statusCode, message, fatal: true })
      }) as any
    return {
      data,
      server: false
    }
  }
}
