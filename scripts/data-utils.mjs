import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, extname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import crypto from 'node:crypto';

export const ROOT_DIR = join(dirname(fileURLToPath(import.meta.url)), '..');
export const MAP_URL = 'https://media.dsrwiki.com/data/csv/map.json';
export const DIGIMON_URL = 'https://media.dsrwiki.com/data/csv/digimon.json';
export const MAP_PATH = join(ROOT_DIR, 'public', 'data', 'map.json');
export const DIGIMON_PATH = join(ROOT_DIR, 'public', 'data', 'digimon.json');
export const DATA_MANIFEST_PATH = join(ROOT_DIR, 'public', 'data', 'data-manifest.json');
export const ASSETS_MANIFEST_PATH = join(ROOT_DIR, 'public', 'data', 'assets-manifest.json');

export async function ensureDir(path) {
  await mkdir(path, { recursive: true });
}

export async function readJson(path) {
  return JSON.parse(await readFile(path, 'utf8'));
}

export async function writeJson(path, value) {
  await ensureDir(dirname(path));
  await writeFile(path, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
}

export async function fetchJson(url) {
  const response = await fetch(url, { headers: { accept: 'application/json' } });
  if (!response.ok) {
    throw new Error(`Falha ao baixar ${url}: HTTP ${response.status}`);
  }
  return response.json();
}

export function unique(values) {
  return [...new Set(values.filter(Boolean))];
}

export function getMarkerCollections(map) {
  return ['portals', 'warps', 'shops', 'overflows', 'dungeon', 'datacube']
    .flatMap((key) => (Array.isArray(map[key]) ? map[key] : []));
}

export function getAllMapImages(maps) {
  return unique(Object.values(maps).map((map) => map.backgroundImage));
}

export function getAllMarkerImages(maps) {
  return unique(Object.values(maps).flatMap((map) => getMarkerCollections(map).map((marker) => marker.src)));
}

export function getAllMonsterImages(maps) {
  return unique(Object.values(maps).flatMap((map) => (Array.isArray(map.mobs) ? map.mobs : []).map((mob) => mob.src)));
}

export function buildDataManifest(maps, digimons) {
  const allMobs = Object.values(maps).flatMap((map) => (Array.isArray(map.mobs) ? map.mobs : []));
  const levels = allMobs.map((mob) => Number(mob.level)).filter(Number.isFinite);
  const uniqueDigimons = new Set(allMobs.map((mob) => mob.name || mob.id).filter(Boolean));

  return {
    syncedAt: new Date().toISOString(),
    mapCount: Object.keys(maps).length,
    totalSpawnCount: allMobs.length,
    uniqueDigimonCount: uniqueDigimons.size,
    sourceDigimonCount: Object.keys(digimons).length,
    minLevel: levels.length ? Math.min(...levels) : null,
    maxLevel: levels.length ? Math.max(...levels) : null,
    aggressiveCount: allMobs.filter((mob) => mob.isAggressive === true).length,
    evolutionEventCount: allMobs.filter((mob) => typeof mob.evol === 'string' && mob.evol.trim()).length,
    mapImages: getAllMapImages(maps),
    monsterImages: getAllMonsterImages(maps),
    markerImages: getAllMarkerImages(maps),
  };
}

export function safeAssetName(url, folder) {
  const parsed = new URL(url);
  const sourceExt = extname(decodeURIComponent(parsed.pathname)).split('?')[0] || '.webp';
  const hash = crypto.createHash('sha1').update(url).digest('hex').slice(0, 14);
  const basename = decodeURIComponent(parsed.pathname)
    .split('/')
    .filter(Boolean)
    .pop()
    ?.replace(sourceExt, '')
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\p{Letter}\p{Number}]+/gu, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 60) || 'asset';
  return `/assets/${folder}/${basename}-${hash}${sourceExt}`;
}
