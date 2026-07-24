import { Search } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { searchDigimons } from '../../services/searchIndexer'
import type { Locale, NormalizedData } from '../../types/dsr'
import { buildMapUrl } from '../../services/urlState'

interface SearchBarProps {
  data: NormalizedData
  locale: Locale
}

export function SearchBar({ data, locale }: SearchBarProps) {
  const [query, setQuery] = useState('')
  const results = useMemo(() => searchDigimons(data, query, locale), [data, locale, query])

  return (
    <div className="search-box">
      <label className="search-box__input">
        <Search size={18} aria-hidden="true" />
        <input
          value={query}
          placeholder="Search Digimon, map, item, or ID..."
          onChange={(event) => setQuery(event.target.value)}
          aria-label="Global search"
        />
      </label>
      {query ? (
        <div className="search-results" role="listbox">
          {results.length ? (
            results.map(({ summary, firstSpawn }) => (
              <Link
                key={summary.slug}
                to={buildMapUrl(firstSpawn)}
                className="search-result"
                onClick={() => setQuery('')}
              >
                <img src={summary.image} alt="" loading="lazy" />
                <span>
                  <strong>{summary.name}</strong>
                  <small>
                    {summary.mapCount} maps, {summary.spawnCount} spawns, Lv. {summary.minLevel}-{summary.maxLevel}
                  </small>
                </span>
              </Link>
            ))
          ) : (
            <div className="search-result search-result--empty">No results found</div>
          )}
        </div>
      ) : null}
    </div>
  )
}
