import { z } from 'zod'

const markerSchema = z.object({
  id: z.string(),
  tooltip: z.string().optional(),
  top: z.number(),
  left: z.number(),
  src: z.string().url(),
})

const monsterSpawnSchema = z.object({
  id: z.string(),
  name: z.string(),
  top: z.number(),
  left: z.number(),
  src: z.string().url(),
  level: z.number(),
  hp: z.number(),
  items: z.array(z.string()),
  isAggressive: z.boolean().optional(),
  evol: z.string().optional(),
})

export const gameMapSchema = z.object({
  backgroundImage: z.string().url(),
  portals: z.array(markerSchema).optional(),
  warps: z.array(markerSchema).optional(),
  shops: z.array(markerSchema).optional(),
  overflows: z.array(markerSchema).optional(),
  dungeon: z.array(markerSchema).optional(),
  datacube: z.array(markerSchema).optional(),
  mobs: z.array(monsterSpawnSchema).optional(),
})

export const gameMapDatabaseSchema = z.record(z.string(), gameMapSchema)
export const digimonDatabaseSchema = z.record(z.string(), z.record(z.string(), z.unknown()))
