# Digimon Super Rumble - Monster Map

A static, unofficial English-language tool for browsing Digimon Super Rumble maps, monsters, spawn points, portals,
warps, shops, dungeons, Overflow points, and Data Cubes.

## Screenshots

Run `npm run dev` and open the map to capture the current interface.

## Technology

- React, TypeScript, and Vite
- React Router with `HashRouter`, so GitHub Pages works without server rewrites
- `react-zoom-pan-pinch` for mouse wheel, pinch, zoom, and pan
- Zod for runtime data validation
- Vitest and Testing Library
- ESLint and Prettier

## Requirements

- Node.js 24 or newer
- npm

## Installation

```bash
npm install
```

## Data Sync

```bash
npm run sync-data
```

This downloads `map.json` and `digimon.json`, validates the JSON, and writes:

- `public/data/map.json`
- `public/data/digimon.json`
- `public/data/data-manifest.json`

If the remote sync fails, keep the latest valid local copy in `public/data`.

## Asset Sync

```bash
npm run sync-assets
```

This downloads map, Digimon, and marker images to `public/assets` and creates
`public/data/assets-manifest.json`. Remote URLs remain available as fallbacks.

## Local Development

```bash
npm run dev
```

## Tests And Validation

```bash
npm run validate-data
npm run test
npm run build
```

## GitHub Pages Deployment

Vite uses `VITE_BASE_PATH` or the repository name from `GITHUB_REPOSITORY` to set `base`.

The workflow in `.github/workflows/deploy.yml` installs dependencies, validates data, runs tests, builds the app, and
publishes `dist`.

## Project Structure

- `scripts/`: sync and validation scripts
- `public/data/`: real local data
- `public/assets/`: optional synchronized assets
- `src/components/`: reusable UI
- `src/pages/`: main routes
- `src/services/`: loading, validation, normalization, search, and URL state
- `src/i18n/`: locale helpers
- `tests/`: required baseline tests

## Data Source

Primary source: `dsr1111/dsr`.

Mirrors used by the sync script:

- `https://media.dsrwiki.com/data/csv/map.json`
- `https://media.dsrwiki.com/data/csv/digimon.json`

See `DATA_SOURCE.md` for real counts and normalization decisions.

## Disclaimer

This project is unofficial. Names, images, trademarks, and data belong to their respective rights holders.

## Adding Translations

Edit:

- `src/data/mapRegions.ts`
- `src/data/monsterTranslations.ts`
- `src/data/gameTextTranslations.ts`
- `src/i18n/en-US.ts`

When a source key has no translation, the original value is preserved internally and can still be searched.

## New Maps

New maps in the source JSON are imported automatically into "Other Maps". To organize and translate one, add it to
`src/data/mapRegions.ts`.

## Fixing A Marker

Fix the source data when possible. For a temporary local correction, edit `public/data/map.json` while preserving
`top`, `left`, `src`, `id`, `name`, `level`, `hp`, and `items`.

## Replacing Remote Images

Run `npm run sync-assets` and replace files in `public/assets`. The manifest maps each remote URL to its local path
while preserving the remote fallback.
