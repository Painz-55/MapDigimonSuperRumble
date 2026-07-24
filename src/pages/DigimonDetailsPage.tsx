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
          <strong>Digimon nao encontrado.</strong>
          <Link to="/digimons">Voltar ao indice</Link>
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
            {summary.spawnCount} spawns em {summary.mapCount} mapas. Niveis {summary.levels.join(', ')}.
          </p>
          <div className="chip-list">
            {summary.types.map((type) => <span key={type}>{type}</span>)}
            {summary.attributes.map((attribute) => <span key={attribute}>{attribute}</span>)}
            {summary.hasAggressive ? <span>Agressivo</span> : null}
            {summary.hasEvolution ? <span>Evento de evolucao</span> : null}
          </div>
        </div>
      </header>

      <section className="panel">
        <h2>Informacoes do digimon.json</h2>
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
              <dt>Fonte</dt>
              <dd>Nenhuma informacao escalar adicional encontrada.</dd>
            </div>
          )}
        </dl>
      </section>

      <section className="panel">
        <h2>Itens relacionados</h2>
        <div className="chip-list">{summary.items.map((item) => <span key={item}>{item}</span>)}</div>
      </section>

      <section className="spawn-table panel">
        <h2>Todas as aparicoes</h2>
        <div className="responsive-table">
          <table>
            <thead>
              <tr>
                <th>Mapa</th>
                <th>Regiao</th>
                <th>Nivel</th>
                <th>HP</th>
                <th>Tipo</th>
                <th>Coordenadas</th>
                <th>Abrir</th>
              </tr>
            </thead>
            <tbody>
              {summary.spawns.map((spawn) => (
                <tr key={spawn.spawnId}>
                  <td>{spawn.localizedMapName}</td>
                  <td>{spawn.localizedRegionName}</td>
                  <td>{spawn.level}</td>
                  <td>{spawn.hp}</td>
                  <td>{spawn.isAggressive ? 'Agressivo' : spawn.evol ? 'Evolucao' : 'Comum'}</td>
                  <td>{Math.round(spawn.left)}, {Math.round(spawn.top)}</td>
                  <td>
                    <Link to={buildMapUrl(spawn)}>Ver no mapa</Link>
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
