import {
  DATA_MANIFEST_PATH,
  DIGIMON_PATH,
  DIGIMON_URL,
  MAP_PATH,
  MAP_URL,
  buildDataManifest,
  fetchJson,
  writeJson,
} from './data-utils.mjs';

async function main() {
  const [maps, digimons] = await Promise.all([fetchJson(MAP_URL), fetchJson(DIGIMON_URL)]);

  if (!maps || typeof maps !== 'object' || Array.isArray(maps)) {
    throw new Error('map.json must be an object indexed by map name.');
  }
  if (!digimons || typeof digimons !== 'object' || Array.isArray(digimons)) {
    throw new Error('digimon.json must be an object indexed by Digimon name.');
  }

  const manifest = buildDataManifest(maps, digimons);
  await writeJson(MAP_PATH, maps);
  await writeJson(DIGIMON_PATH, digimons);
  await writeJson(DATA_MANIFEST_PATH, manifest);

  console.log(`Maps synchronized: ${manifest.mapCount}`);
  console.log(`Spawns synchronized: ${manifest.totalSpawnCount}`);
  console.log(`Unique Digimons on maps: ${manifest.uniqueDigimonCount}`);
  console.log(`Level range: ${manifest.minLevel} to ${manifest.maxLevel}`);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
