import { Crosshair, Link as LinkIcon, ShieldAlert, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import { buildMapUrl } from '../../services/urlState'
import type { DigimonSummary, MapViewerState, NormalizedSpawn } from '../../types/dsr'
import { ImageWithFallback } from '../MapMarker/ImageWithFallback'

interface MonsterDetailsProps {
  spawn: NormalizedSpawn | null
  summary?: DigimonSummary
  state: Partial<MapViewerState>
  onCenter: (spawn: NormalizedSpawn) => void
}

function valueList(values: string[] | undefined) {
  if (!values?.length) return 'Not listed'
  return values.join(', ')
}

export function MonsterDetails({ spawn, summary, state, onCenter }: MonsterDetailsProps) {
  if (!spawn) {
    return (
      <aside className="details-panel details-panel--empty">
        <h2>Select a marker</h2>
        <p>Click a Digimon on the map or use global search to open full details.</p>
      </aside>
    )
  }

  const detailUrl = `/digimons/${spawn.slug}`
  const shareUrl = buildMapUrl(spawn, state)
  const details = spawn.details
  const type = summary?.types[0] ?? (typeof details?.type === 'string' ? details.type : undefined)
  const attribute = typeof details?.attribute === 'string' ? details.attribute : undefined
  const strengths = Array.isArray(details?.strengths) ? details.strengths.filter((item): item is string => typeof item === 'string') : []
  const weaknesses = Array.isArray(details?.weaknesses) ? details.weaknesses.filter((item): item is string => typeof item === 'string') : []

  return (
    <aside className="details-panel">
      <div className="details-panel__hero">
        <ImageWithFallback src={spawn.src} alt={spawn.displayName} className="details-panel__image" />
        <div>
          <h2>{spawn.displayName}</h2>
          {spawn.displayName !== spawn.displayId ? <p>Species: {spawn.displayId}</p> : <p>Original ID: {spawn.id}</p>}
          <span className="pill">Lv. {spawn.level}</span>
          <span className="pill">HP {spawn.hp}</span>
        </div>
      </div>

      <div className="flag-row">
        {spawn.isAggressive ? (
          <span className="status status--danger">
            <ShieldAlert size={16} /> Aggressive
          </span>
        ) : (
          <span className="status">Not aggressive</span>
        )}
        {spawn.evol ? (
          <span className="status status--special">
            <Sparkles size={16} /> Evolution event for: {spawn.displayEvolutionName ?? spawn.evol}
          </span>
        ) : null}
      </div>

      <dl className="details-grid">
        <div>
          <dt>Map</dt>
          <dd>{spawn.localizedMapName}</dd>
        </div>
        <div>
          <dt>Region</dt>
          <dd>{spawn.localizedRegionName}</dd>
        </div>
        <div>
          <dt>Type</dt>
          <dd>{type || 'Not listed'}</dd>
        </div>
        <div>
          <dt>Attribute</dt>
          <dd>{attribute || 'Not listed'}</dd>
        </div>
        <div>
          <dt>Strengths</dt>
          <dd>{valueList(strengths)}</dd>
        </div>
        <div>
          <dt>Weaknesses</dt>
          <dd>{valueList(weaknesses)}</dd>
        </div>
      </dl>

      <section>
        <h3>Drops</h3>
        <div className="chip-list">
          {spawn.displayItems.length ? spawn.displayItems.map((item) => <span key={item}>{item}</span>) : <span>No drops listed</span>}
        </div>
      </section>

      {summary ? (
        <section>
          <h3>Other appearances</h3>
          <p>
            {summary.spawnCount} spawns across {summary.mapCount} maps. Known levels: {summary.levels.join(', ')}.
          </p>
          <div className="location-list">
            {summary.spawns.slice(0, 9).map((location) => (
              <Link key={location.spawnId} to={buildMapUrl(location)} className="location-card">
                {location.localizedMapName} - Lv. {location.level} - HP {location.hp}
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      <div className="details-actions">
        <button type="button" onClick={() => onCenter(spawn)}>
          <Crosshair size={16} /> Center
        </button>
        <button type="button" onClick={() => navigator.clipboard?.writeText(`${location.origin}${location.pathname}#${shareUrl}`)}>
          <LinkIcon size={16} /> Copy link
        </button>
        <Link to={detailUrl}>Digimon page</Link>
      </div>
    </aside>
  )
}
