import { lazy, Suspense, useEffect, useState } from 'react'
import { HashRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AppHeader } from './components/AppHeader/AppHeader'
import { ErrorState, LoadingState } from './components/LoadingState/LoadingState'
import { DataProvider, useDsrData } from './store/DataContext'
import './styles/app.css'

const MapPage = lazy(() => import('./pages/MapPage').then((module) => ({ default: module.MapPage })))
const DigimonIndexPage = lazy(() =>
  import('./pages/DigimonIndexPage').then((module) => ({ default: module.DigimonIndexPage })),
)
const DigimonDetailsPage = lazy(() =>
  import('./pages/DigimonDetailsPage').then((module) => ({ default: module.DigimonDetailsPage })),
)
const AboutPage = lazy(() => import('./pages/AboutPage').then((module) => ({ default: module.AboutPage })))

function AppShell() {
  const { data, locale, setLocale, loading, error } = useDsrData()
  const [theme, setTheme] = useState<'dark' | 'light'>(() =>
    localStorage.getItem('dsr-theme') === 'light' ? 'light' : 'dark',
  )

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    localStorage.setItem('dsr-theme', theme)
  }, [theme])

  return (
    <HashRouter>
      <AppHeader data={data} locale={locale} setLocale={setLocale} theme={theme} setTheme={setTheme} />
      {loading ? <LoadingState /> : null}
      {error ? <ErrorState message={error} /> : null}
      {!loading && !error ? (
        <Suspense fallback={<LoadingState />}>
          <Routes>
            <Route path="/" element={<Navigate to="/mapa" replace />} />
            <Route path="/mapa" element={<MapPage />} />
            <Route path="/digimons" element={<DigimonIndexPage />} />
            <Route path="/digimons/:slug" element={<DigimonDetailsPage />} />
            <Route path="/sobre" element={<AboutPage />} />
            <Route path="*" element={<Navigate to="/mapa" replace />} />
          </Routes>
        </Suspense>
      ) : null}
      <footer className="app-footer">
        Ferramenta nao oficial. Nomes e imagens pertencem aos respectivos detentores de direitos.
      </footer>
    </HashRouter>
  )
}

export default function App() {
  return (
    <DataProvider>
      <AppShell />
    </DataProvider>
  )
}
