import { Link, useParams } from 'react-router-dom'
import { ImageWithFallback } from '../components/MapMarker/ImageWithFallback'
import { buildMapUrl } from '../services/urlState'
import { useDsrData } from '../store/DataContext'

export function DigimonDetailsPage() {
  const { slug = '' } = useParams()
  const { data } = useDsrData()
  const summary = data?.digimonBySlug.get(slug)

  if (!data || !summary) {
    return (
      <main className="page-shell">
        <div className="state">
          <strong>Digimon not found.</strong>
          <Link to="/digimons">Back to index</Link>
        </div>
      </main>
    )
  }

  const detailEntries = Object.entries(summary.details ?? {}).filter(([, value]) => typeof value !== 'object')

  return (
    <main className="page-shell detail-page">
      <header className="digimon-detail-hero">
        <ImageWithFallback src={summary.image} alt={summary.name} className="digimon-detail-hero__image" manifest={data.assetsManifest} />
        <div>
          <h1>{summary.name}</h1>
          <p>
            {summary.spawnCount} spawns across {summary.mapCount} maps. Levels {summary.levels.join(', ')}.
          </p>
          <div className="chip-list">
            {summary.types.map((type) => <span key={type}>{type}</span>)}
            {summary.attributes.map((attribute) => <span key={attribute}>{attribute}</span>)}
            {summary.hasAggressive ? <span>Aggressive</span> : null}
            {summary.hasEvolution ? <span>Evolution event</span> : null}
          </div>
        </div>
      </header>

      <section className="panel">
        <h2>digimon.json information</h2>
        <dl className="details-grid">
          {detailEntries.length ? (
            detailEntries.map(([key, value]) => (
              <div key={key}>
                <dt>{key}</dt>
                <dd>{String(value)}</dd>
              </div>
            ))
          ) : (
            <div>
              <dt>Source</dt>
              <dd>No additional scalar information found.</dd>
            </div>
          )}
        </dl>
      </section>

      <section className="panel">
        <h2>Related items</h2>
        <div className="chip-list">{summary.items.map((item) => <span key={item}>{item}</span>)}</div>
      </section>

      <section className="spawn-table panel">
        <h2>All appearances</h2>
        <div className="responsive-table">
          <table>
            <thead>
              <tr>
                <th>Map</th>
                <th>Region</th>
                <th>Level</th>
                <th>HP</th>
                <th>Tipo</th>
                <th>Coordenadas</th>
                <th>Open</th>
              </tr>
            </thead>
            <tbody>
              {summary.spawns.map((spawn) => (
                <tr key={spawn.spawnId}>
                  <td>{spawn.localizedMapName}</td>
                  <td>{spawn.localizedRegionName}</td>
                  <td>{spawn.level}</td>
                  <td>{spawn.hp}</td>
                  <td>{spawn.isAggressive ? 'Aggressive' : spawn.evol ? 'Evolution' : 'Common'}</td>
                  <td>{Math.round(spawn.left)}, {Math.round(spawn.top)}</td>
                  <td>
                    <Link to={buildMapUrl(spawn)}>View on map</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  )
}
