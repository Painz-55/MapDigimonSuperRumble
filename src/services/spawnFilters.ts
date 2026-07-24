import type { MonsterFilters, NormalizedSpawn, VisibleLayers } from '../types/dsr'
import { defaultVisibleLayers } from '../types/dsr'
import { normalizeSearchText } from '../utils/text'

function parseOptionalNumber(value: string): number {
  return value.trim() ? Number(value) : Number.NaN
}

export function filterSpawns(
  spawns: NormalizedSpawn[],
  filters: MonsterFilters,
  layers: VisibleLayers = defaultVisibleLayers,
) {
  const name = normalizeSearchText(filters.name)
  const item = normalizeSearchText(filters.item)
  const type = normalizeSearchText(filters.type)
  const attribute = normalizeSearchText(filters.attribute)
  const minLevel = parseOptionalNumber(filters.minLevel)
  const maxLevel = parseOptionalNumber(filters.maxLevel)
  const minHp = parseOptionalNumber(filters.minHp)
  const maxHp = parseOptionalNumber(filters.maxHp)

  return spawns.filter((spawn) => {
    if (!layers.monsters) return false
    if (spawn.isAggressive && !layers.aggressive) return false
    if (spawn.evol && !layers.evolution) return false
    if (filters.aggressiveOnly && !spawn.isAggressive) return false
    if (filters.evolutionOnly && !spawn.evol) return false
    if (Number.isFinite(minLevel) && spawn.level < minLevel) return false
    if (Number.isFinite(maxLevel) && spawn.level > maxLevel) return false
    if (Number.isFinite(minHp) && spawn.hp < minHp) return false
    if (Number.isFinite(maxHp) && spawn.hp > maxHp) return false
    if (name && !normalizeSearchText(`${spawn.name} ${spawn.id} ${spawn.speciesKey}`).includes(name)) return false
    if (item && !normalizeSearchText(spawn.items.join(' ')).includes(item)) return false
    if (type && !normalizeSearchText(typeof spawn.details?.type === 'string' ? spawn.details.type : '').includes(type)) {
      return false
    }
    if (
      attribute &&
      !normalizeSearchText(typeof spawn.details?.attribute === 'string' ? spawn.details.attribute : '').includes(attribute)
    ) {
      return false
    }
    return true
  })
}
