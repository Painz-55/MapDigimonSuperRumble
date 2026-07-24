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
  const { data, locale, loading, error } = useDsrData()
  const [theme, setTheme] = useState<'dark' | 'light'>(() =>
    localStorage.getItem('dsr-theme') === 'light' ? 'light' : 'dark',
  )

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    localStorage.setItem('dsr-theme', theme)
  }, [theme])

  return (
    <HashRouter>
      <AppHeader data={data} locale={locale} theme={theme} setTheme={setTheme} />
      {loading ? <LoadingState /> : null}
      {error ? <ErrorState message={error} /> : null}
      {!loading && !error ? (
        <Suspense fallback={<LoadingState />}>
          <Routes>
            <Route path="/" element={<Navigate to="/map" replace />} />
            <Route path="/map" element={<MapPage />} />
            <Route path="/mapa" element={<Navigate to="/map" replace />} />
            <Route path="/digimons" element={<DigimonIndexPage />} />
            <Route path="/digimons/:slug" element={<DigimonDetailsPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/sobre" element={<Navigate to="/about" replace />} />
            <Route path="*" element={<Navigate to="/map" replace />} />
          </Routes>
        </Suspense>
      ) : null}
      <footer className="app-footer">
        Unofficial tool. Names and images belong to their respective rights holders.
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
