# Data Source And Normalization

This project uses public data from `dsr1111/dsr`, mirrored at:

- `https://media.dsrwiki.com/data/csv/map.json`
- `https://media.dsrwiki.com/data/csv/digimon.json`

The published application reads local copies from `public/data/map.json` and `public/data/digimon.json`.

## Inspection On 2026-07-24

- Maps loaded: 27
- Spawn records in `mobs`: 254
- Unique Digimons found on maps: 110
- Entries in `digimon.json`: 357
- Lowest level found: 2
- Highest level found: 102
- Aggressive spawns: 17
- Evolution events: 6
- Maps without monsters: `???`, `테이머의 집`

## Observed Formats

Each map is indexed by its original Korean name and has `backgroundImage`. Optional arrays observed in the source are
`portals`, `warps`, `shops`, `overflows`, `dungeon`, `datacube`, and `mobs`.

Utility markers use `id`, `tooltip`, `top`, `left`, and `src`. Monster spawns use `id`, `name`, `top`, `left`, `src`,
`level`, `hp`, `items`, and optionally `isAggressive` and `evol`.

## Decisions

- Original Korean map keys are never modified.
- Region grouping uses the requested canonical list; new maps are automatically placed under "Other Maps".
- Every `mobs` entry becomes an independent spawn. Repeated entries represent distinct locations and are preserved.
- Stable spawn IDs include map, monster, level, coordinates, and original index.
- Coordinates use the fixed 700 x 700 source area, applying `top` and `left` without recalculation.
- `digimon.json` enriches spawns when the species name exists in the database.
- Digimon names, map labels, UI labels, types, and known item names are displayed in English.
- Local images downloaded by `sync-assets` are preferred when present, with remote URLs as fallback.
