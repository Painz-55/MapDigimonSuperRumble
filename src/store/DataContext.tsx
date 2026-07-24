import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { Locale, NormalizedData } from '../types/dsr'
import { loadDsrData } from '../services/dataLoader'

interface DataContextValue {
  data: NormalizedData | null
  locale: Locale
  setLocale: (locale: Locale) => void
  loading: boolean
  error: string | null
}

const DataContext = createContext<DataContextValue | null>(null)
const dataCache = new Map<Locale, NormalizedData>()

export function DataProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>('pt-BR')
  const [data, setData] = useState<NormalizedData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)

    const cached = dataCache.get(locale)
    if (cached) {
      setData(cached)
      setLoading(false)
      return
    }

    loadDsrData(locale)
      .then((loaded) => {
        if (cancelled) return
        dataCache.set(locale, loaded)
        setData(loaded)
      })
      .catch((cause: Error) => {
        if (!cancelled) setError(cause.message)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [locale])

  const value = useMemo(
    () => ({ data, locale, setLocale, loading, error }),
    [data, error, loading, locale],
  )

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>
}

export function useDsrData(): DataContextValue {
  const value = useContext(DataContext)
  if (!value) throw new Error('useDsrData deve ser usado dentro de DataProvider.')
  return value
}
