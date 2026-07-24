import type { MonsterSpawn } from '../types/dsr'
import { stableHash } from './text'

export function createSpawnId(mapKey: string, spawn: MonsterSpawn, index: number): string {
  return `${mapKey}:${spawn.id}:${spawn.level}:${spawn.top}:${spawn.left}:${index}`
}

export function createUrlSafeSpawnId(spawnId: string): string {
  return stableHash(spawnId)
}
