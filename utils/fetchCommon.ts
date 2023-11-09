export default async (
  argEndpoint: string,
  argMethod: string,
  argOptions?: {[key: string]: any},
  transition: boolean = false
) => {
  const method: string = argMethod || 'GET'
  const options: Record<string, string | boolean> = {
    method,
    server: false,
    ...argOptions
  }
  const { data, error, pending, refresh } = await useAsyncData(
    argEndpoint,
    () => $fetch(useRuntimeConfig().public.apiUrl + argEndpoint, options))

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
