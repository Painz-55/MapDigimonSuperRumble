import { DIGIMON_PATH, MAP_PATH, readJson } from './data-utils.mjs';

const EXPECTED_MAPS = 27;
const MARKER_KEYS = ['portals', 'warps', 'shops', 'overflows', 'dungeon', 'datacube'];

function isUrl(value) {
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
}

function validateCoordinate(value) {
  return Number.isFinite(value) && value >= -80 && value <= 780;
}

async function main() {
  const maps = await readJson(MAP_PATH);
  const digimons = await readJson(DIGIMON_PATH);
  const warnings = [];
  const errors = [];
  const urls = new Map();
  let spawns = 0;
  let aggressive = 0;
  let evolutions = 0;
  const noMobs = [];
  const uniqueDigimons = new Set();

  for (const [mapKey, map] of Object.entries(maps)) {
    if (!map.backgroundImage || !isUrl(map.backgroundImage)) {
      errors.push(`${mapKey}: backgroundImage is missing or invalid.`);
    }
    urls.set(map.backgroundImage, (urls.get(map.backgroundImage) || 0) + 1);

    const mobs = Array.isArray(map.mobs) ? map.mobs : [];
    if (!mobs.length) noMobs.push(mapKey);

    mobs.forEach((mob, index) => {
      spawns += 1;
      const prefix = `${mapKey}.mobs[${index}]`;
      uniqueDigimons.add(mob.name || mob.id);
      if (!validateCoordinate(mob.top) || !validateCoordinate(mob.left)) {
        errors.push(`${prefix}: invalid coordinates.`);
      }
      if (!mob.src || !isUrl(mob.src)) errors.push(`${prefix}: src is missing or invalid.`);
      if (!Number.isFinite(mob.level)) errors.push(`${prefix}: invalid level.`);
      if (!Number.isFinite(mob.hp)) errors.push(`${prefix}: invalid hp.`);
      if (!Array.isArray(mob.items)) errors.push(`${prefix}: items must be an array.`);
      if (mob.isAggressive === true) aggressive += 1;
      if (typeof mob.evol === 'string' && mob.evol.trim()) evolutions += 1;
      urls.set(mob.src, (urls.get(mob.src) || 0) + 1);
    });

    for (const key of MARKER_KEYS) {
      const markers = Array.isArray(map[key]) ? map[key] : [];
      markers.forEach((marker, index) => {
        const prefix = `${mapKey}.${key}[${index}]`;
        if (!validateCoordinate(marker.top) || !validateCoordinate(marker.left)) {
          errors.push(`${prefix}: invalid coordinates.`);
        }
        if (!marker.src || !isUrl(marker.src)) errors.push(`${prefix}: src is missing or invalid.`);
        urls.set(marker.src, (urls.get(marker.src) || 0) + 1);
      });
    }
  }

  if (Object.keys(maps).length < EXPECTED_MAPS) {
    errors.push(`Map count is lower than expected: ${Object.keys(maps).length}/${EXPECTED_MAPS}.`);
  }
  if (!Object.keys(digimons).length) errors.push('digimon.json is empty.');

  const duplicatedUrls = [...urls.values()].filter((count) => count > 1).length;
  if (duplicatedUrls) warnings.push(`Duplicated URLs found: ${duplicatedUrls}.`);

  console.log(`Maps loaded: ${Object.keys(maps).length}`);
  console.log(`Spawns loaded: ${spawns}`);
  console.log(`Unique Digimons: ${uniqueDigimons.size}`);
  console.log(`Maps without monsters: ${noMobs.length}${noMobs.length ? ` (${noMobs.join(', ')})` : ''}`);
  console.log(`Aggressive spawns: ${aggressive}`);
  console.log(`Evolution events: ${evolutions}`);
  console.log(`Critical errors: ${errors.length}`);
  console.log(`Warnings: ${warnings.length}`);

  for (const warning of warnings) console.warn(`Warning: ${warning}`);
  for (const error of errors) console.error(`Error: ${error}`);

  if (errors.length) process.exit(1);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
