import type { AssetsManifest } from '../types/dsr'

const failedImages = new Set<string>()

export function resolveAssetUrl(url: string, manifest?: AssetsManifest): string {
  const local = manifest?.assets[url]
  if (local?.ok && !failedImages.has(local.localPath)) return local.localPath
  return url
}

export function markAssetFailed(url: string): void {
  failedImages.add(url)
}
