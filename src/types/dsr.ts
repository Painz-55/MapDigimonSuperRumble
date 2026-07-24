export type Locale = 'pt-BR' | 'ko-KR' | 'en-US'

export interface MapPosition {
  top: number
  left: number
}

export interface BaseMapMarker extends MapPosition {
  id: string
  src: string
  tooltip?: string
}

export interface MonsterSpawn extends MapPosition {
  id: string
  name: string
  src: string
  level: number
  hp: number
  items: string[]
  isAggressive?: boolean
  evol?: string
}

export interface GameMap {
  backgroundImage: string
  portals?: BaseMapMarker[]
  warps?: BaseMapMarker[]
  shops?: BaseMapMarker[]
  overflows?: BaseMapMarker[]
  dungeon?: BaseMapMarker[]
  datacube?: BaseMapMarker[]
  mobs?: MonsterSpawn[]
}

export type GameMapDatabase = Record<string, GameMap>

export interface DigimonDetails {
  evolution_stage?: string
  type?: string
  attribute?: string
  stats?: Record<string, number | string>
  strengths?: string[]
  weaknesses?: string[]
  fields?: string[]
  skills?: unknown[]
  [key: string]: unknown
}

export type DigimonDatabase = Record<string, DigimonDetails>

export interface DataManifest {
  syncedAt: string
  mapCount: number
  totalSpawnCount: number
  uniqueDigimonCount: number
  sourceDigimonCount: number
  minLevel: number | null
  maxLevel: number | null
  aggressiveCount: number
  evolutionEventCount: number
  mapImages: string[]
  monsterImages: string[]
  markerImages: string[]
}

export interface AssetsManifestEntry {
  localPath: string
  remoteUrl: string
  ok: boolean
  error?: string
}

export interface AssetsManifest {
  syncedAt: string
  totalAssets: number
  failedAssets: number
  assets: Record<string, AssetsManifestEntry>
}

export interface NormalizedMarker extends BaseMapMarker {
  markerId: string
  mapKey: string
  kind: MarkerKind
}

export type MarkerKind =
  | 'monster'
  | 'portal'
  | 'warp'
  | 'shop'
  | 'overflow'
  | 'dungeon'
  | 'datacube'

export interface NormalizedSpawn extends MonsterSpawn {
  spawnId: string
  displayName: string
  displayId: string
  displayEvolutionName?: string
  mapKey: string
  mapName: string
  regionKey: string
  regionName: string
  localizedMapName: string
  localizedRegionName: string
  speciesKey: string
  slug: string
  details?: DigimonDetails
}

export interface NormalizedMap {
  key: string
  name: string
  localizedName: string
  regionKey: string
  regionName: string
  localizedRegionName: string
  backgroundImage: string
  spawns: NormalizedSpawn[]
  markers: NormalizedMarker[]
}

export interface DigimonSummary {
  speciesKey: string
  slug: string
  name: string
  originalName: string
  image: string
  maps: string[]
  mapCount: number
  spawnCount: number
  minLevel: number
  maxLevel: number
  minHp: number
  maxHp: number
  levels: number[]
  hasAggressive: boolean
  hasEvolution: boolean
  types: string[]
  attributes: string[]
  items: string[]
  spawns: NormalizedSpawn[]
  details?: DigimonDetails
}

export interface NormalizedData {
  sourceMaps: GameMapDatabase
  sourceDigimons: DigimonDatabase
  maps: NormalizedMap[]
  mapByKey: Map<string, NormalizedMap>
  spawns: NormalizedSpawn[]
  digimons: DigimonSummary[]
  digimonBySlug: Map<string, DigimonSummary>
  manifest?: DataManifest
  assetsManifest?: AssetsManifest
}

export interface VisibleLayers {
  monsters: boolean
  aggressive: boolean
  evolution: boolean
  portals: boolean
  warps: boolean
  shops: boolean
  overflows: boolean
  dungeons: boolean
  datacubes: boolean
}

export interface MonsterFilters {
  name: string
  minLevel: string
  maxLevel: string
  minHp: string
  maxHp: string
  item: string
  type: string
  attribute: string
  aggressiveOnly: boolean
  evolutionOnly: boolean
}

export interface MapViewerState {
  selectedRegion: string
  selectedMap: string
  selectedSpawnId: string | null
  zoom: number
  positionX: number
  positionY: number
  visibleLayers: VisibleLayers
  filters: MonsterFilters
}

export const defaultVisibleLayers: VisibleLayers = {
  monsters: true,
  aggressive: true,
  evolution: true,
  portals: true,
  warps: true,
  shops: true,
  overflows: true,
  dungeons: true,
  datacubes: true,
}

export const defaultMonsterFilters: MonsterFilters = {
  name: '',
  minLevel: '',
  maxLevel: '',
  minHp: '',
  maxHp: '',
  item: '',
  type: '',
  attribute: '',
  aggressiveOnly: false,
  evolutionOnly: false,
}
