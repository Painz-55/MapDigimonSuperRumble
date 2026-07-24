import { Link, NavLink } from 'react-router-dom'
import { Moon, Sun } from 'lucide-react'
import type { Locale, NormalizedData } from '../../types/dsr'
import { SearchBar } from '../SearchBar/SearchBar'

interface AppHeaderProps {
  data: NormalizedData | null
  locale: Locale
  setLocale: (locale: Locale) => void
  theme: 'dark' | 'light'
  setTheme: (theme: 'dark' | 'light') => void
}

export function AppHeader({ data, locale, setLocale, theme, setTheme }: AppHeaderProps) {
  return (
    <header className="app-header">
      <Link to="/" className="brand" aria-label="Abrir mapa inicial">
        <span className="brand__mark">DSR</span>
        <span>
          <strong>Mapa de Monstros</strong>
          <small>Digimon Super Rumble</small>
        </span>
      </Link>
      {data ? <SearchBar data={data} locale={locale} /> : null}
      <nav className="app-nav" aria-label="Navegacao principal">
        <NavLink to="/mapa">Mapa</NavLink>
        <NavLink to="/digimons">Digimons</NavLink>
        <NavLink to="/sobre">Sobre</NavLink>
      </nav>
      <select value={locale} onChange={(event) => setLocale(event.target.value as Locale)} aria-label="Idioma">
        <option value="pt-BR">PT</option>
        <option value="ko-KR">KO</option>
        <option value="en-US">EN</option>
      </select>
      <button
        type="button"
        className="icon-button"
        aria-label={theme === 'dark' ? 'Ativar tema claro' : 'Ativar tema escuro'}
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      >
        {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
      </button>
    </header>
  )
}
