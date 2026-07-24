import { knownRegions, mapToRegion, otherRegion } from '../data/mapRegions'
import { getEnglishMonsterName } from '../data/monsterTranslations'
import type { Locale } from '../types/dsr'
import { enUS } from './en-US'
import { koKR } from './ko-KR'
import { ptBR } from './pt-BR'

export const dictionaries = {
  'pt-BR': ptBR,
  'ko-KR': koKR,
  'en-US': enUS,
} satisfies Record<Locale, typeof ptBR>

export function getLocalizedRegionName(regionKey: string, locale: Locale): string {
  const region = knownRegions.find((item) => item.key === regionKey)
  const target = region ?? (regionKey === otherRegion.key ? otherRegion : undefined)
  if (!target) return regionKey
  if (locale === 'ko-KR') return target.ko
  if (locale === 'en-US') return target.en
  return target.pt
}

export function getLocalizedMapName(originalMapName: string, locale: Locale): string {
  const known = mapToRegion.get(originalMapName)?.map
  if (!known) return originalMapName
  if (locale === 'ko-KR') return originalMapName
  if (locale === 'en-US') return known.en
  return known.pt
}

export function getLocalizedMonsterName(originalMonsterName: string): string {
  return getEnglishMonsterName(originalMonsterName)
}
