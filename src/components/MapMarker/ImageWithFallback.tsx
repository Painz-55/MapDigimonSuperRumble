import { useState } from 'react'
import { markAssetFailed, resolveAssetUrl } from '../../services/assetResolver'
import type { AssetsManifest } from '../../types/dsr'

const fallbackImage =
  'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96"%3E%3Crect width="96" height="96" rx="16" fill="%2311233b"/%3E%3Cpath fill="%234fd1ff" d="M24 28h48v8H24zm0 16h32v8H24zm0 16h48v8H24z"/%3E%3C/svg%3E'

interface ImageWithFallbackProps {
  src: string
  alt: string
  className?: string
  manifest?: AssetsManifest
}

export function ImageWithFallback({ src, alt, className, manifest }: ImageWithFallbackProps) {
  const [useRemote, setUseRemote] = useState(false)
  const [useFallback, setUseFallback] = useState(false)
  const localCandidate = resolveAssetUrl(src, manifest)
  const hasLocalCandidate = localCandidate !== src
  const resolved = useFallback ? fallbackImage : useRemote ? src : localCandidate

  return (
    <img
      className={className}
      src={resolved}
      alt={alt}
      loading="lazy"
      decoding="async"
      onError={() => {
        markAssetFailed(resolved)
        if (hasLocalCandidate && !useRemote) {
          setUseRemote(true)
          return
        }
        setUseFallback(true)
      }}
    />
  )
}
