import { AlertTriangle, Sparkles } from 'lucide-react'
import { ImageWithFallback } from './ImageWithFallback'
import type { AssetsManifest, NormalizedMarker, NormalizedSpawn } from '../../types/dsr'

interface MonsterMarkerProps {
  spawn: NormalizedSpawn
  selected: boolean
  highlighted: boolean
  keepReadable: boolean
  manifest?: AssetsManifest
  onSelect: (spawn: NormalizedSpawn) => void
}

export function MonsterMarker({
  spawn,
  selected,
  highlighted,
  keepReadable,
  manifest,
  onSelect,
}: MonsterMarkerProps) {
  const classes = [
    'map-marker',
    'map-marker--monster',
    spawn.isAggressive ? 'map-marker--aggressive' : '',
    spawn.evol ? 'map-marker--evolution' : '',
    selected ? 'is-selected' : '',
    highlighted ? 'is-highlighted' : '',
    keepReadable ? 'map-marker--readable' : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <button
      type="button"
      className={classes}
      style={{ top: spawn.top, left: spawn.left }}
      aria-label={`${spawn.displayName}, nivel ${spawn.level}, ${spawn.localizedMapName}`}
      title={`${spawn.displayName} Lv. ${spawn.level}`}
      onClick={(event) => {
        event.stopPropagation()
        onSelect(spawn)
      }}
    >
      <ImageWithFallback src={spawn.src} alt="" className="map-marker__image" manifest={manifest} />
      {spawn.isAggressive ? <AlertTriangle className="map-marker__badge" aria-hidden="true" /> : null}
      {spawn.evol ? <Sparkles className="map-marker__badge map-marker__badge--evolution" aria-hidden="true" /> : null}
    </button>
  )
}

interface UtilityMarkerProps {
  marker: NormalizedMarker
  manifest?: AssetsManifest
  visible: boolean
}

export function UtilityMarker({ marker, manifest, visible }: UtilityMarkerProps) {
  if (!visible) return null
  return (
    <button
      type="button"
      className={`map-marker map-marker--utility map-marker--${marker.kind}`}
      style={{ top: marker.top, left: marker.left }}
      aria-label={marker.tooltip || marker.kind}
      title={marker.tooltip || marker.kind}
    >
      <ImageWithFallback src={marker.src} alt="" className="map-marker__image" manifest={manifest} />
    </button>
  )
}
