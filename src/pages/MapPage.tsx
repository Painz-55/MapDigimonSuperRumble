import { ChevronLeft, ChevronRight, Star } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { InteractiveGameMap } from '../components/InteractiveGameMap/InteractiveGameMap'
import { LayerControls } from '../components/LayerControls/LayerControls'
import { MonsterDetails } from '../components/MonsterDetails/MonsterDetails'
import { knownRegions, otherRegion } from '../data/mapRegions'
import { filterSpawns } from '../services/spawnFilters'
import { buildMapUrl, parseLayers } from '../services/urlState'
import { useDsrData } from '../store/DataContext'
import type { MapViewerState, MonsterFilters, NormalizedMap, NormalizedSpawn } from '../types/dsr'
import { defaultMonsterFilters, defaultVisibleLayers } from '../types/dsr'
import { createUrlSafeSpawnId } from '../utils/spawnIds'
import { stripHtml } from '../utils/text'

const FAVORITES_KEY = 'dsr-map-favorites'
const RECENTS_KEY = 'dsr-map-recents'

function readStorageList(key: string): string[] {
  try {
    return JSON.parse(localStorage.getItem(key) || '[]') as string[]
  } catch {
    return []
  }
}

function writeStorageList(key: string, values: string[]) {
  localStorage.setItem(key, JSON.stringify(values.slice(0, 12)))
}

function getPortalTargets(currentMap: NormalizedMap, maps: NormalizedMap[]) {
  return currentMap.markers
    .filter((marker) => marker.kind === 'portal' && marker.tooltip)
    .map((marker) => {
      const tooltip = stripHtml(marker.tooltip)
      const target = maps.find((map) => tooltip.includes(map.name) || tooltip.includes(map.localizedName))
      return { marker, target, tooltip }
    })
}

export function MapPage() {
  const { data } = useDsrData()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const firstMap = data?.maps[0]
  const [selectedMapKey, setSelectedMapKey] = useState(searchParams.get('map') || firstMap?.key || '')
  const [selectedSpawnId, setSelectedSpawnId] = useState<string | null>(null)
  const [highlightedSpawnId, setHighlightedSpawnId] = useState<string | null>(null)
  const [visibleLayers, setVisibleLayers] = useState(parseLayers(searchParams.get('layers'), defaultVisibleLayers))
  const [filters, setFilters] = useState<MonsterFilters>(defaultMonsterFilters)
  const [keepMarkersReadable, setKeepMarkersReadable] = useState(false)
  const [dragEnabled, setDragEnabled] = useState(true)
  const [transformState, setTransformState] = useState({ zoom: 1, positionX: 0, positionY: 0 })
  const [favorites, setFavorites] = useState<string[]>(() => readStorageList(FAVORITES_KEY))
  const [recents, setRecents] = useState<string[]>(() => readStorageList(RECENTS_KEY))

  useEffect(() => {
    if (!data || selectedMapKey) return
    setSelectedMapKey(data.maps[0]?.key ?? '')
  }, [data, selectedMapKey])

  useEffect(() => {
    if (!data || !selectedMapKey) return
    const monster = searchParams.get('monster')
    const level = Number(searchParams.get('level'))
    const spawnHash = searchParams.get('spawn')
    const map = data.mapByKey.get(selectedMapKey)
    const selected =
      map?.spawns.find((spawn) => (spawnHash ? createUrlSafeSpawnId(spawn.spawnId) === spawnHash : false)) ??
      map?.spawns.find((spawn) => {
        const levelMatches = Number.isFinite(level) ? spawn.level === level : true
        return (
          levelMatches &&
          (spawn.displayName === monster ||
            spawn.displayId === monster ||
            spawn.speciesKey === monster ||
            spawn.name === monster ||
            spawn.id === monster)
        )
      })
    setSelectedSpawnId(selected?.spawnId ?? null)
    setHighlightedSpawnId(selected?.spawnId ?? null)
  }, [data, searchParams, selectedMapKey])

  useEffect(() => {
    if (!selectedMapKey) return
    setRecents((previous) => {
      const next = [selectedMapKey, ...previous.filter((key) => key !== selectedMapKey)]
      writeStorageList(RECENTS_KEY, next)
      return next
    })
  }, [selectedMapKey])

  const currentMap = data?.mapByKey.get(selectedMapKey) ?? firstMap
  const currentIndex = data?.maps.findIndex((map) => map.key === currentMap?.key) ?? -1
  const filteredSpawns = useMemo(
    () => filterSpawns(currentMap?.spawns ?? [], filters, visibleLayers),
    [currentMap?.spawns, filters, visibleLayers],
  )
  const selectedSpawn = useMemo(
    () => data?.spawns.find((spawn) => spawn.spawnId === selectedSpawnId) ?? null,
    [data?.spawns, selectedSpawnId],
  )
  const selectedSummary = selectedSpawn ? data?.digimonBySlug.get(selectedSpawn.slug) : undefined
  const portalTargets = useMemo(
    () => (currentMap && data ? getPortalTargets(currentMap, data.maps) : []),
    [currentMap, data],
  )

  if (!data || !currentMap) return null

  const groupedMaps = [
    ...knownRegions.map((region) => ({
      key: region.key,
      label: data.maps.find((map) => map.regionKey === region.key)?.localizedRegionName ?? region.pt,
      maps: data.maps.filter((map) => map.regionKey === region.key),
    })),
    {
      key: otherRegion.key,
      label: otherRegion.pt,
      maps: data.maps.filter((map) => map.regionKey === otherRegion.key),
    },
  ].filter((group) => group.maps.length)

  const selectMap = (mapKey: string) => {
    setSelectedMapKey(mapKey)
    setSelectedSpawnId(null)
    setHighlightedSpawnId(null)
    setSearchParams({ map: mapKey })
  }

  const selectSpawn = (spawn: NormalizedSpawn) => {
    setSelectedSpawnId(spawn.spawnId)
    setHighlightedSpawnId(spawn.spawnId)
    navigate(buildMapUrl(spawn, { visibleLayers, ...transformState }))
  }

  const favoriteCurrentMap = () => {
    const next = favorites.includes(currentMap.key)
      ? favorites.filter((key) => key !== currentMap.key)
      : [currentMap.key, ...favorites]
    setFavorites(next)
    writeStorageList(FAVORITES_KEY, next)
  }

  const viewerState: Partial<MapViewerState> = {
    selectedMap: currentMap.key,
    selectedSpawnId,
    visibleLayers,
    filters,
    ...transformState,
  }

  return (
    <main className="map-layout">
      <aside className="sidebar">
        <section className="panel">
          <div className="panel__header">
            <h1>Mapas</h1>
            <button className="icon-button" type="button" aria-label="Favoritar mapa" onClick={favoriteCurrentMap}>
              <Star size={18} fill={favorites.includes(currentMap.key) ? 'currentColor' : 'none'} />
            </button>
          </div>
          <div className="select-grid">
            <label>
              Regiao
              <select
                value={currentMap.regionKey}
                onChange={(event) => {
                  const first = data.maps.find((map) => map.regionKey === event.target.value)
                  if (first) selectMap(first.key)
                }}
              >
                {groupedMaps.map((group) => (
                  <option key={group.key} value={group.key}>
                    {group.label}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Mapa
              <select value={currentMap.key} onChange={(event) => selectMap(event.target.value)}>
                {groupedMaps.map((group) => (
                  <optgroup key={group.key} label={group.label}>
                    {group.maps.map((map) => (
                      <option key={map.key} value={map.key}>
                        {map.localizedName}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </label>
          </div>
          <div className="map-nav-buttons">
            <button type="button" disabled={currentIndex <= 0} onClick={() => selectMap(data.maps[currentIndex - 1].key)}>
              <ChevronLeft size={16} /> Anterior
            </button>
            <button
              type="button"
              disabled={currentIndex >= data.maps.length - 1}
              onClick={() => selectMap(data.maps[currentIndex + 1].key)}
            >
              Proximo <ChevronRight size={16} />
            </button>
          </div>
          <label className="check-row">
            <input type="checkbox" checked={keepMarkersReadable} onChange={(event) => setKeepMarkersReadable(event.target.checked)} />
            <span>Manter marcadores legiveis</span>
          </label>
          <label className="check-row">
            <input type="checkbox" checked={dragEnabled} onChange={(event) => setDragEnabled(event.target.checked)} />
            <span>Arrastar mapa</span>
          </label>
        </section>

        <LayerControls
          layers={visibleLayers}
          filters={filters}
          visibleCount={filteredSpawns.length}
          totalCount={currentMap.spawns.length}
          onLayersChange={setVisibleLayers}
          onFiltersChange={setFilters}
        />

        <section className="panel compact-list">
          <h2>Conectados por portal</h2>
          {portalTargets.length ? (
            portalTargets.map(({ marker, target, tooltip }) => (
              <button key={marker.markerId} type="button" disabled={!target} onClick={() => target && selectMap(target.key)}>
                {target?.localizedName ?? tooltip}
              </button>
            ))
          ) : (
            <p>Nenhum destino identificado nos tooltips.</p>
          )}
          <h2>Favoritos</h2>
          {favorites.map((key) => (
            <button key={key} type="button" onClick={() => selectMap(key)}>
              {data.mapByKey.get(key)?.localizedName ?? key}
            </button>
          ))}
          <h2>Recentes</h2>
          {recents.map((key) => (
            <button key={key} type="button" onClick={() => selectMap(key)}>
              {data.mapByKey.get(key)?.localizedName ?? key}
            </button>
          ))}
        </section>
      </aside>

      <InteractiveGameMap
        map={currentMap}
        spawns={filteredSpawns}
        selectedSpawnId={selectedSpawnId}
        highlightedSpawnId={highlightedSpawnId}
        visibleLayers={visibleLayers}
        keepMarkersReadable={keepMarkersReadable}
        dragEnabled={dragEnabled}
        manifest={data.assetsManifest}
        onSelectSpawn={selectSpawn}
        onTransformChange={(zoom, positionX, positionY) => setTransformState({ zoom, positionX, positionY })}
      />

      <MonsterDetails
        spawn={selectedSpawn}
        summary={selectedSummary}
        state={viewerState}
        onCenter={(spawn) => setHighlightedSpawnId(spawn.spawnId)}
      />
    </main>
  )
}
