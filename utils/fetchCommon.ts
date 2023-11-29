export default async (
  argEndpoint: string,
  argMethod: string,
  argOptions?: {[key: string]: any},
  transition?: boolean
) => {
  const method: string = argMethod || 'GET'
  const options: Record<string, string | boolean> = {
    method,
    server: false,
    ...argOptions
  }
  // url形式ならそのまま。なければAPIサーバへのアクセスとする。
  const url = argEndpoint.search(/:\/\//) > 0 ? argEndpoint : useRuntimeConfig().public.apiUrl + argEndpoint
  const { data, error, pending, refresh } = await useAsyncData(
    argEndpoint,
    () => $fetch(url, options))

  if (transition && error.value) {
    // transitionがtrueの場合、エラー画面に遷移させる。
    const errVal: any = error.value
    throw createError({ statusCode: errVal.statusCode, message: errVal.data, fatal: true })
  }

  return {
    data: data.value ? { ...data.value } : null,
    error: error.value ? { ...error.value } : null,
    pending,
    refresh
  }
}
