import type { MapViewerState, NormalizedSpawn, VisibleLayers } from '../types/dsr'
import { createUrlSafeSpawnId } from '../utils/spawnIds'

export function buildMapUrl(spawn: NormalizedSpawn, state?: Partial<MapViewerState>): string {
  const params = new URLSearchParams()
  params.set('map', spawn.mapKey)
  params.set('monster', spawn.speciesKey)
  params.set('level', String(spawn.level))
  params.set('spawn', createUrlSafeSpawnId(spawn.spawnId))
  if (state?.zoom) params.set('zoom', state.zoom.toFixed(2))
  if (typeof state?.positionX === 'number') params.set('x', Math.round(state.positionX).toString())
  if (typeof state?.positionY === 'number') params.set('y', Math.round(state.positionY).toString())
  if (state?.visibleLayers) params.set('layers', serializeLayers(state.visibleLayers))
  return `/mapa?${params.toString()}`
}

export function serializeLayers(layers: VisibleLayers): string {
  return Object.entries(layers)
    .filter(([, enabled]) => enabled)
    .map(([key]) => key)
    .join(',')
}

export function parseLayers(value: string | null, fallback: VisibleLayers): VisibleLayers {
  if (!value) return fallback
  const enabled = new Set(value.split(','))
  return Object.fromEntries(Object.keys(fallback).map((key) => [key, enabled.has(key)])) as unknown as VisibleLayers
}
