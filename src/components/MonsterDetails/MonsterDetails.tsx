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
  if (!values?.length) return 'Nao informado'
  return values.join(', ')
}

export function MonsterDetails({ spawn, summary, state, onCenter }: MonsterDetailsProps) {
  if (!spawn) {
    return (
      <aside className="details-panel details-panel--empty">
        <h2>Selecione um marcador</h2>
        <p>Clique em um Digimon no mapa ou use a busca global para abrir detalhes completos.</p>
      </aside>
    )
  }

  const detailUrl = `/digimons/${spawn.slug}`
  const shareUrl = buildMapUrl(spawn, state)
  const details = spawn.details
  const type = typeof details?.type === 'string' ? details.type : undefined
  const attribute = typeof details?.attribute === 'string' ? details.attribute : undefined
  const strengths = Array.isArray(details?.strengths) ? details.strengths.filter((item): item is string => typeof item === 'string') : []
  const weaknesses = Array.isArray(details?.weaknesses) ? details.weaknesses.filter((item): item is string => typeof item === 'string') : []

  return (
    <aside className="details-panel">
      <div className="details-panel__hero">
        <ImageWithFallback src={spawn.src} alt={spawn.name} className="details-panel__image" />
        <div>
          <h2>{spawn.name}</h2>
          {spawn.name !== spawn.id ? <p>Especie: {spawn.id}</p> : <p>ID original: {spawn.id}</p>}
          <span className="pill">Lv. {spawn.level}</span>
          <span className="pill">HP {spawn.hp}</span>
        </div>
      </div>

      <div className="flag-row">
        {spawn.isAggressive ? (
          <span className="status status--danger">
            <ShieldAlert size={16} /> Agressivo
          </span>
        ) : (
          <span className="status">Nao agressivo</span>
        )}
        {spawn.evol ? (
          <span className="status status--special">
            <Sparkles size={16} /> Relacionado a evolucao de: {spawn.evol}
          </span>
        ) : null}
      </div>

      <dl className="details-grid">
        <div>
          <dt>Mapa</dt>
          <dd>{spawn.localizedMapName}</dd>
        </div>
        <div>
          <dt>Regiao</dt>
          <dd>{spawn.localizedRegionName}</dd>
        </div>
        <div>
          <dt>Tipo</dt>
          <dd>{type || 'Nao informado'}</dd>
        </div>
        <div>
          <dt>Atributo</dt>
          <dd>{attribute || 'Nao informado'}</dd>
        </div>
        <div>
          <dt>Forcas</dt>
          <dd>{valueList(strengths)}</dd>
        </div>
        <div>
          <dt>Fraquezas</dt>
          <dd>{valueList(weaknesses)}</dd>
        </div>
      </dl>

      <section>
        <h3>Itens derrubados</h3>
        <div className="chip-list">
          {spawn.items.length ? spawn.items.map((item) => <span key={item}>{item}</span>) : <span>Nenhum item listado</span>}
        </div>
      </section>

      {summary ? (
        <section>
          <h3>Outras aparicoes</h3>
          <p>
            {summary.spawnCount} spawns em {summary.mapCount} mapas. Niveis encontrados: {summary.levels.join(', ')}.
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
          <Crosshair size={16} /> Centralizar
        </button>
        <button type="button" onClick={() => navigator.clipboard?.writeText(`${location.origin}${location.pathname}#${shareUrl}`)}>
          <LinkIcon size={16} /> Copiar link
        </button>
        <Link to={detailUrl}>Pagina do Digimon</Link>
      </div>
    </aside>
  )
}
