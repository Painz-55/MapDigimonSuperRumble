import { knownRegions, mapToRegion, otherRegion } from '../data/mapRegions'
import { getLocalizedMapName, getLocalizedMonsterName, getLocalizedRegionName } from '../i18n'
import type {
  AssetsManifest,
  DataManifest,
  DigimonDatabase,
  DigimonSummary,
  GameMapDatabase,
  Locale,
  MarkerKind,
  NormalizedData,
  NormalizedMap,
  NormalizedMarker,
  NormalizedSpawn,
} from '../types/dsr'
import { createSpawnId } from '../utils/spawnIds'
import { slugifyName, stripHtml } from '../utils/text'
import { digimonDatabaseSchema, gameMapDatabaseSchema } from './schemas'

const markerKeyToKind = {
  portals: 'portal',
  warps: 'warp',
  shops: 'shop',
  overflows: 'overflow',
  dungeon: 'dungeon',
  datacube: 'datacube',
} satisfies Record<string, MarkerKind>

export function validateSourceData(maps: unknown, digimons: unknown): {
  maps: GameMapDatabase
  digimons: DigimonDatabase
} {
  return {
    maps: gameMapDatabaseSchema.parse(maps),
    digimons: digimonDatabaseSchema.parse(digimons) as DigimonDatabase,
  }
}

function orderedMapKeys(maps: GameMapDatabase): string[] {
  const knownKeys = knownRegions.flatMap((region) => region.maps.map((map) => map.key))
  const knownInSource = knownKeys.filter((key) => maps[key])
  const unknown = Object.keys(maps).filter((key) => !knownKeys.includes(key)).sort((a, b) => a.localeCompare(b))
  return [...knownInSource, ...unknown]
}

function getRegionForMap(mapKey: string) {
  const known = mapToRegion.get(mapKey)
  if (known) return { regionKey: known.region.key, order: known.order }
  return { regionKey: otherRegion.key, order: Number.MAX_SAFE_INTEGER }
}

function getDigimonAttribute(details?: Record<string, unknown>): string | undefined {
  const direct = details?.attribute
  if (typeof direct === 'string') return direct
  const stats = details?.stats
  if (stats && typeof stats === 'object' && !Array.isArray(stats)) {
    const attribute = (stats as Record<string, unknown>).attribute
    if (typeof attribute === 'string') return attribute
  }
  return undefined
}

export function normalizeData(
  sourceMaps: GameMapDatabase,
  sourceDigimons: DigimonDatabase,
  locale: Locale,
  manifest?: DataManifest,
  assetsManifest?: AssetsManifest,
): NormalizedData {
  const spawns: NormalizedSpawn[] = []
  const maps: NormalizedMap[] = orderedMapKeys(sourceMaps).map((mapKey) => {
    const source = sourceMaps[mapKey]
    const regionInfo = getRegionForMap(mapKey)
    const localizedMapName = getLocalizedMapName(mapKey, locale)
    const localizedRegionName = getLocalizedRegionName(regionInfo.regionKey, locale)

    const mapSpawns = (source.mobs ?? []).map((spawn, index) => {
      const speciesKey = spawn.name || spawn.id
      const displayName = getLocalizedMonsterName(speciesKey)
      const details = sourceDigimons[speciesKey] ?? sourceDigimons[spawn.id]
      const normalized: NormalizedSpawn = {
        ...spawn,
        spawnId: createSpawnId(mapKey, spawn, index),
        displayName,
        displayId: getLocalizedMonsterName(spawn.id),
        displayEvolutionName: spawn.evol ? getLocalizedMonsterName(spawn.evol) : undefined,
        mapKey,
        mapName: mapKey,
        regionKey: regionInfo.regionKey,
        regionName: regionInfo.regionKey,
        localizedMapName,
        localizedRegionName,
        speciesKey,
        slug: slugifyName(displayName),
        details,
      }
      spawns.push(normalized)
      return normalized
    })

    const markers: NormalizedMarker[] = Object.entries(markerKeyToKind).flatMap(([collectionKey, kind]) =>
      (source[collectionKey as keyof typeof source] as { id: string; top: number; left: number; src: string; tooltip?: string }[] | undefined ?? []).map(
        (marker, index) => ({
          ...marker,
          markerId: `${mapKey}:${kind}:${marker.id}:${marker.top}:${marker.left}:${index}`,
          mapKey,
          kind,
          tooltip: stripHtml(marker.tooltip),
        }),
      ),
    )

    return {
      key: mapKey,
      name: mapKey,
      localizedName: localizedMapName,
      regionKey: regionInfo.regionKey,
      regionName: regionInfo.regionKey,
      localizedRegionName,
      backgroundImage: source.backgroundImage,
      spawns: mapSpawns,
      markers,
    }
  })

  const summaries = buildDigimonSummaries(spawns, sourceDigimons)
  return {
    sourceMaps,
    sourceDigimons,
    maps,
    mapByKey: new Map(maps.map((map) => [map.key, map])),
    spawns,
    digimons: summaries,
    digimonBySlug: new Map(summaries.map((summary) => [summary.slug, summary])),
    manifest,
    assetsManifest,
  }
}

export function buildDigimonSummaries(
  spawns: NormalizedSpawn[],
  sourceDigimons: DigimonDatabase,
): DigimonSummary[] {
  const grouped = new Map<string, NormalizedSpawn[]>()
  for (const spawn of spawns) {
    const list = grouped.get(spawn.speciesKey) ?? []
    list.push(spawn)
    grouped.set(spawn.speciesKey, list)
  }

  return [...grouped.entries()]
    .map(([speciesKey, entries]) => {
      const levels = [...new Set(entries.map((spawn) => spawn.level))].sort((a, b) => a - b)
      const hps = entries.map((spawn) => spawn.hp)
      const details = entries.find((spawn) => spawn.details)?.details ?? sourceDigimons[speciesKey]
      const type = typeof details?.type === 'string' ? details.type : undefined
      const attribute = getDigimonAttribute(details)
      return {
        speciesKey,
        slug: slugifyName(getLocalizedMonsterName(speciesKey)),
        name: getLocalizedMonsterName(speciesKey),
        originalName: speciesKey,
        image: entries[0]?.src ?? '',
        maps: [...new Set(entries.map((spawn) => spawn.mapKey))],
        mapCount: new Set(entries.map((spawn) => spawn.mapKey)).size,
        spawnCount: entries.length,
        minLevel: Math.min(...levels),
        maxLevel: Math.max(...levels),
        minHp: Math.min(...hps),
        maxHp: Math.max(...hps),
        levels,
        hasAggressive: entries.some((spawn) => spawn.isAggressive),
        hasEvolution: entries.some((spawn) => Boolean(spawn.evol)),
        types: type ? [type] : [],
        attributes: attribute ? [attribute] : [],
        items: [...new Set(entries.flatMap((spawn) => spawn.items))].sort((a, b) => a.localeCompare(b)),
        spawns: entries,
        details,
      }
    })
    .sort((a, b) => a.name.localeCompare(b.name))
}
