export default async (pid: string): Promise<Record<string, string>> => {
  const defaultImagePath = '/pokego/peripper-eyes.png'
  // OGP情報の取得
  const res: Record<string, any> = await fetchCommon('/api/ogpPokemon', 'GET', { query: { id: pid } })
  if (!res.data.image) {
    res.data.image = defaultImagePath
  }

  return {
    ogpName: res.data.name,
    ogpImage: useRuntimeConfig().public.staticUrl + res.data.image
  }
}
