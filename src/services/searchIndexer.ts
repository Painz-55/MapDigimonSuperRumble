import { getLocalizedMapName } from '../i18n'
import type { DigimonSummary, Locale, NormalizedData, NormalizedSpawn } from '../types/dsr'
import { normalizeSearchText } from '../utils/text'

export interface SearchResult {
  summary: DigimonSummary
  firstSpawn: NormalizedSpawn
  score: number
}

export function buildSearchHaystack(summary: DigimonSummary, locale: Locale): string {
  const fields = [
    summary.name,
    summary.originalName,
    summary.speciesKey,
    ...summary.spawns.map((spawn) => `${spawn.name} ${spawn.id} ${spawn.displayName} ${spawn.displayId}`),
    ...summary.maps,
    ...summary.maps.map((map) => getLocalizedMapName(map, locale)),
    ...summary.items,
    ...summary.originalItems,
    ...summary.types,
    ...summary.attributes,
  ]
  return normalizeSearchText(fields.join(' '))
}

export function searchDigimons(data: NormalizedData, query: string, locale: Locale, limit = 12): SearchResult[] {
  const normalizedQuery = normalizeSearchText(query)
  if (!normalizedQuery) return []

  return data.digimons
    .map((summary) => {
      const haystack = buildSearchHaystack(summary, locale)
      if (!haystack.includes(normalizedQuery)) return null
      const exact = normalizeSearchText(summary.name) === normalizedQuery
      return { summary, firstSpawn: summary.spawns[0], score: exact ? 2 : 1 }
    })
    .filter((item): item is SearchResult => item !== null)
    .sort((a, b) => b.score - a.score || a.summary.name.localeCompare(b.summary.name))
    .slice(0, limit)
}
