import type { AssetsManifest, DataManifest, DigimonDatabase, GameMapDatabase, Locale, NormalizedData } from '../types/dsr'
import { normalizeData, validateSourceData } from './dataNormalizer'

async function loadOptionalJson<T>(path: string): Promise<T | undefined> {
  try {
    const response = await fetch(`${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`)
    if (!response.ok) return undefined
    return (await response.json()) as T
  } catch {
    return undefined
  }
}

export async function loadDsrData(locale: Locale): Promise<NormalizedData> {
  const [rawMaps, rawDigimons, manifest, assetsManifest] = await Promise.all([
    fetch(`${import.meta.env.BASE_URL}data/map.json`).then((response) => {
      if (!response.ok) throw new Error('Could not load public/data/map.json.')
      return response.json() as Promise<GameMapDatabase>
    }),
    fetch(`${import.meta.env.BASE_URL}data/digimon.json`).then((response) => {
      if (!response.ok) throw new Error('Could not load public/data/digimon.json.')
      return response.json() as Promise<DigimonDatabase>
    }),
    loadOptionalJson<DataManifest>('/data/data-manifest.json'),
    loadOptionalJson<AssetsManifest>('/data/assets-manifest.json'),
  ])

  const validated = validateSourceData(rawMaps, rawDigimons)
  return normalizeData(validated.maps, validated.digimons, locale, manifest, assetsManifest)
}
