import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ImageWithFallback } from '../components/MapMarker/ImageWithFallback'
import { useDsrData } from '../store/DataContext'
import { normalizeSearchText } from '../utils/text'

type SortKey = 'name' | 'minLevel' | 'maxLevel' | 'mapCount' | 'spawnCount' | 'hp' | 'aggressive'

export function DigimonIndexPage() {
  const { data } = useDsrData()
  const [name, setName] = useState('')
  const [region, setRegion] = useState('')
  const [mapKey, setMapKey] = useState('')
  const [aggressive, setAggressive] = useState(false)
  const [evolution, setEvolution] = useState(false)
  const [item, setItem] = useState('')
  const [sort, setSort] = useState<SortKey>('name')

  const results = useMemo(() => {
    if (!data) return []
    const normalizedName = normalizeSearchText(name)
    const normalizedItem = normalizeSearchText(item)
    return data.digimons
      .filter((summary) => {
        if (normalizedName && !normalizeSearchText(summary.name).includes(normalizedName)) return false
        if (region && !summary.spawns.some((spawn) => spawn.regionKey === region)) return false
        if (mapKey && !summary.spawns.some((spawn) => spawn.mapKey === mapKey)) return false
        if (aggressive && !summary.hasAggressive) return false
        if (evolution && !summary.hasEvolution) return false
        if (normalizedItem && !normalizeSearchText(summary.items.join(' ')).includes(normalizedItem)) return false
        return true
      })
      .sort((a, b) => {
        if (sort === 'minLevel') return a.minLevel - b.minLevel
        if (sort === 'maxLevel') return b.maxLevel - a.maxLevel
        if (sort === 'mapCount') return b.mapCount - a.mapCount
        if (sort === 'spawnCount') return b.spawnCount - a.spawnCount
        if (sort === 'hp') return b.maxHp - a.maxHp
        if (sort === 'aggressive') return Number(b.hasAggressive) - Number(a.hasAggressive)
        return a.name.localeCompare(b.name)
      })
  }, [aggressive, data, evolution, item, mapKey, name, region, sort])

  if (!data) return null

  const regions = [...new Map(data.maps.map((map) => [map.regionKey, map.localizedRegionName])).entries()]

  return (
    <main className="page-shell">
      <header className="page-title">
        <h1>Indice completo de Digimons</h1>
        <p>{data.digimons.length} Digimons unicos encontrados em {data.spawns.length} spawns preservados.</p>
      </header>
      <section className="panel index-filters">
        <input placeholder="Nome" value={name} onChange={(event) => setName(event.target.value)} />
        <input placeholder="Item especifico" value={item} onChange={(event) => setItem(event.target.value)} />
        <select value={region} onChange={(event) => setRegion(event.target.value)}>
          <option value="">Todas as regioes</option>
          {regions.map(([key, label]) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
        </select>
        <select value={mapKey} onChange={(event) => setMapKey(event.target.value)}>
          <option value="">Todos os mapas</option>
          {data.maps.map((map) => (
            <option key={map.key} value={map.key}>
              {map.localizedName}
            </option>
          ))}
        </select>
        <select value={sort} onChange={(event) => setSort(event.target.value as SortKey)}>
          <option value="name">Nome</option>
          <option value="minLevel">Menor nivel</option>
          <option value="maxLevel">Maior nivel</option>
          <option value="mapCount">Quantidade de mapas</option>
          <option value="spawnCount">Quantidade de spawns</option>
          <option value="hp">HP</option>
          <option value="aggressive">Agressivos primeiro</option>
        </select>
        <label className="check-row">
          <input type="checkbox" checked={aggressive} onChange={(event) => setAggressive(event.target.checked)} />
          Agressivos
        </label>
        <label className="check-row">
          <input type="checkbox" checked={evolution} onChange={(event) => setEvolution(event.target.checked)} />
          Evolucao
        </label>
      </section>
      <section className="digimon-grid">
        {results.map((summary) => (
          <Link key={summary.slug} to={`/digimons/${summary.slug}`} className="digimon-card">
            <ImageWithFallback src={summary.image} alt={summary.name} className="digimon-card__image" manifest={data.assetsManifest} />
            <h2>{summary.name}</h2>
            <p>Lv. {summary.minLevel}-{summary.maxLevel} · HP {summary.minHp}-{summary.maxHp}</p>
            <p>{summary.mapCount} mapas · {summary.spawnCount} spawns</p>
            <div className="chip-list">
              {summary.hasAggressive ? <span>Agressivo</span> : null}
              {summary.hasEvolution ? <span>Evolucao</span> : null}
              {summary.levels.length > 1 ? <span>Multiplos niveis</span> : null}
            </div>
          </Link>
        ))}
      </section>
    </main>
  )
}
