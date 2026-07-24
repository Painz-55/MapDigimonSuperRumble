import type { MonsterFilters, VisibleLayers } from '../../types/dsr'

interface LayerControlsProps {
  layers: VisibleLayers
  filters: MonsterFilters
  visibleCount: number
  totalCount: number
  onLayersChange: (layers: VisibleLayers) => void
  onFiltersChange: (filters: MonsterFilters) => void
}

const layerLabels: Array<[keyof VisibleLayers, string]> = [
  ['monsters', 'Monstros'],
  ['aggressive', 'Agressivos'],
  ['evolution', 'Evolucao'],
  ['portals', 'Portais'],
  ['warps', 'Warps'],
  ['shops', 'Lojas'],
  ['overflows', 'Overflow'],
  ['dungeons', 'Dungeons'],
  ['datacubes', 'Data Cubes'],
]

export function LayerControls({
  layers,
  filters,
  visibleCount,
  totalCount,
  onLayersChange,
  onFiltersChange,
}: LayerControlsProps) {
  const setLayer = (key: keyof VisibleLayers, value: boolean) => onLayersChange({ ...layers, [key]: value })
  const setFilter = (key: keyof MonsterFilters, value: string | boolean) => onFiltersChange({ ...filters, [key]: value })

  return (
    <section className="panel layer-panel" aria-label="Camadas e filtros">
      <div className="panel__header">
        <h2>Camadas</h2>
        <span>{`${visibleCount} de ${totalCount} monstros visiveis`}</span>
      </div>

      <div className="layer-grid">
        {layerLabels.map(([key, label]) => (
          <label key={key} className="check-row">
            <input type="checkbox" checked={layers[key]} onChange={(event) => setLayer(key, event.target.checked)} />
            <span>{label}</span>
          </label>
        ))}
      </div>

      <div className="quick-actions" aria-label="Acoes rapidas de filtros">
        <button type="button" onClick={() => onLayersChange(Object.fromEntries(layerLabels.map(([key]) => [key, true])) as unknown as VisibleLayers)}>
          Marcar todos
        </button>
        <button type="button" onClick={() => onLayersChange(Object.fromEntries(layerLabels.map(([key]) => [key, false])) as unknown as VisibleLayers)}>
          Desmarcar todos
        </button>
        <button type="button" onClick={() => onLayersChange({ ...layers, monsters: true, portals: false, warps: false, shops: false, overflows: false, dungeons: false, datacubes: false })}>
          Somente monstros
        </button>
        <button type="button" onClick={() => onFiltersChange({ ...filters, aggressiveOnly: true, evolutionOnly: false })}>
          Somente agressivos
        </button>
        <button type="button" onClick={() => onFiltersChange({ ...filters, aggressiveOnly: false, evolutionOnly: true })}>
          Somente evolucao
        </button>
      </div>

      <div className="filter-grid">
        <label>
          Nome
          <input value={filters.name} onChange={(event) => setFilter('name', event.target.value)} />
        </label>
        <label>
          Nivel min.
          <input type="number" value={filters.minLevel} onChange={(event) => setFilter('minLevel', event.target.value)} />
        </label>
        <label>
          Nivel max.
          <input type="number" value={filters.maxLevel} onChange={(event) => setFilter('maxLevel', event.target.value)} />
        </label>
        <label>
          HP min.
          <input type="number" value={filters.minHp} onChange={(event) => setFilter('minHp', event.target.value)} />
        </label>
        <label>
          HP max.
          <input type="number" value={filters.maxHp} onChange={(event) => setFilter('maxHp', event.target.value)} />
        </label>
        <label>
          Item
          <input value={filters.item} onChange={(event) => setFilter('item', event.target.value)} />
        </label>
        <label>
          Tipo
          <input value={filters.type} onChange={(event) => setFilter('type', event.target.value)} />
        </label>
        <label>
          Atributo
          <input value={filters.attribute} onChange={(event) => setFilter('attribute', event.target.value)} />
        </label>
      </div>

      <button className="button button--wide" type="button" onClick={() => onFiltersChange({ name: '', minLevel: '', maxLevel: '', minHp: '', maxHp: '', item: '', type: '', attribute: '', aggressiveOnly: false, evolutionOnly: false })}>
        Limpar filtros
      </button>
    </section>
  )
}
