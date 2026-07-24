export function normalizeSearchText(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase()
    .trim()
}

export function stableHash(value: string): string {
  let hash = 5381
  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 33) ^ value.charCodeAt(index)
  }
  return (hash >>> 0).toString(36)
}

export function slugifyName(value: string): string {
  const latin = normalizeSearchText(value)
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
  return latin || `d-${stableHash(value)}`
}

export function stripHtml(value = ''): string {
  return value.replace(/<br\s*\/?>/gi, ' / ').replace(/<[^>]+>/g, '')
}
