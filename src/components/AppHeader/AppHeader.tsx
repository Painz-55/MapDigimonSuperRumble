import { Link, NavLink } from 'react-router-dom'
import { Moon, Sun } from 'lucide-react'
import type { Locale, NormalizedData } from '../../types/dsr'
import { SearchBar } from '../SearchBar/SearchBar'

interface AppHeaderProps {
  data: NormalizedData | null
  locale: Locale
  theme: 'dark' | 'light'
  setTheme: (theme: 'dark' | 'light') => void
}

export function AppHeader({ data, locale, theme, setTheme }: AppHeaderProps) {
  return (
    <header className="app-header">
      <Link to="/" className="brand" aria-label="Open the default map">
        <span className="brand__mark">DSR</span>
        <span>
          <strong>Monster Map</strong>
          <small>Digimon Super Rumble</small>
        </span>
      </Link>
      {data ? <SearchBar data={data} locale={locale} /> : null}
      <nav className="app-nav" aria-label="Main navigation">
        <NavLink to="/map">Map</NavLink>
        <NavLink to="/digimons">Digimons</NavLink>
        <NavLink to="/about">About</NavLink>
      </nav>
      <button
        type="button"
        className="icon-button"
        aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      >
        {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
      </button>
    </header>
  )
}
