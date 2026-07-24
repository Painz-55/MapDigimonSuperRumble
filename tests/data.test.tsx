import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { MonsterMarker } from '../src/components/MapMarker/MapMarker'
import { getLocalizedMapName } from '../src/i18n'
import { normalizeData, validateSourceData } from '../src/services/dataNormalizer'
import { searchDigimons } from '../src/services/searchIndexer'
import { filterSpawns } from '../src/services/spawnFilters'
import { buildMapUrl, parseLayers } from '../src/services/urlState'
import type { DigimonDatabase, GameMapDatabase, NormalizedData } from '../src/types/dsr'
import { defaultVisibleLayers } from '../src/types/dsr'
import { createSpawnId } from '../src/utils/spawnIds'
import { normalizeSearchText } from '../src/utils/text'

function readJson<T>(path: string): T {
  return JSON.parse(readFileSync(join(process.cwd(), path), 'utf8')) as T
}

const rawMaps = readJson<GameMapDatabase>('public/data/map.json')
const rawDigimons = readJson<DigimonDatabase>('public/data/digimon.json')
const validated = validateSourceData(rawMaps, rawDigimons)
const data: NormalizedData = normalizeData(validated.maps, validated.digimons, 'pt-BR')

describe('DSR data normalization', () => {
  it('reads the complete map database', () => {
    expect(Object.keys(rawMaps)).toHaveLength(27)
    expect(data.maps).toHaveLength(27)
  })

  it('preserves every source mobs entry during normalization', () => {
    const totalSourceMobEntries = Object.values(rawMaps).reduce((count, map) => count + (map.mobs?.length ?? 0), 0)
    expect(data.spawns).toHaveLength(totalSourceMobEntries)
    expect(data.spawns).toHaveLength(254)
  })

  it('creates stable spawn ids that do not rely only on monster names', () => {
    const mapKey = '시작의 마을'
    const spawn = rawMaps[mapKey].mobs?.[0]
    expect(spawn).toBeDefined()
    expect(createSpawnId(mapKey, spawn!, 0)).toContain(`${mapKey}:${spawn!.id}:${spawn!.level}`)
    expect(createSpawnId(mapKey, spawn!, 0)).not.toBe(createSpawnId(mapKey, spawn!, 1))
  })

  it('groups spawns by Digimon without merging locations', () => {
    const chuumon = data.digimons.find((summary) => summary.name === 'Chuumon')
    expect(chuumon?.spawnCount).toBeGreaterThan(1)
    expect(chuumon?.levels.length).toBeGreaterThan(1)
  })

  it('groups spawns by map', () => {
    const startVillage = data.mapByKey.get('시작의 마을')
    expect(startVillage?.spawns.length).toBe(rawMaps['시작의 마을'].mobs?.length)
  })
})

describe('filters and search', () => {
  const map = data.maps.find((item) => item.spawns.length > 3)!

  it('filters by level range', () => {
    const filtered = filterSpawns(map.spawns, { name: '', minLevel: '20', maxLevel: '20', minHp: '', maxHp: '', item: '', type: '', attribute: '', aggressiveOnly: false, evolutionOnly: false })
    expect(filtered.every((spawn) => spawn.level === 20)).toBe(true)
  })

  it('filters by aggressive flag', () => {
    const filtered = filterSpawns(data.spawns, { name: '', minLevel: '', maxLevel: '', minHp: '', maxHp: '', item: '', type: '', attribute: '', aggressiveOnly: true, evolutionOnly: false })
    expect(filtered.length).toBe(17)
    expect(filtered.every((spawn) => spawn.isAggressive)).toBe(true)
  })

  it('search ignores case and accents', () => {
    expect(normalizeSearchText('Estacao de Metro')).toBe(normalizeSearchText('estação DE metrô'))
  })

  it('searches by original monster name', () => {
    const result = searchDigimons(data, '츄몬', 'pt-BR')
    expect(result[0]?.summary.name).toBe('Chuumon')
  })

  it('displays Digimon names in English', () => {
    expect(data.spawns.find((spawn) => spawn.name === '츄몬')?.displayName).toBe('Chuumon')
    expect(data.digimons.every((summary) => !/[가-힣]/.test(summary.name))).toBe(true)
  })
})

describe('routing and rendering helpers', () => {
  it('builds shareable URLs and restores layer state', () => {
    const spawn = data.spawns[0]
    const url = buildMapUrl(spawn, { zoom: 1.5, positionX: 10, positionY: -20, visibleLayers: defaultVisibleLayers })
    expect(url).toContain('/mapa?')
    expect(url).toContain('spawn=')
    expect(parseLayers('monsters,portals', defaultVisibleLayers).warps).toBe(false)
  })

  it('translates maps with fallback', () => {
    expect(getLocalizedMapName('시작의 마을', 'pt-BR')).toBe('Vila Inicial')
    expect(getLocalizedMapName('mapa inexistente', 'pt-BR')).toBe('mapa inexistente')
  })

  it('renders marker positions using top and left exactly', () => {
    const spawn = data.spawns[0]
    render(
      <MonsterMarker
        spawn={spawn}
        selected={false}
        highlighted={false}
        keepReadable={false}
        onSelect={() => undefined}
      />,
    )
    const marker = screen.getByRole('button', { name: new RegExp(spawn.displayName) })
    expect(marker).toHaveStyle({ top: `${spawn.top}px`, left: `${spawn.left}px` })
  })
})
