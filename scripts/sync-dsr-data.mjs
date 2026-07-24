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
    throw new Error('map.json deve ser um objeto indexado por nome de mapa.');
  }
  if (!digimons || typeof digimons !== 'object' || Array.isArray(digimons)) {
    throw new Error('digimon.json deve ser um objeto indexado por nome de Digimon.');
  }

  const manifest = buildDataManifest(maps, digimons);
  await writeJson(MAP_PATH, maps);
  await writeJson(DIGIMON_PATH, digimons);
  await writeJson(DATA_MANIFEST_PATH, manifest);

  console.log(`Mapas sincronizados: ${manifest.mapCount}`);
  console.log(`Spawns sincronizados: ${manifest.totalSpawnCount}`);
  console.log(`Digimons unicos nos mapas: ${manifest.uniqueDigimonCount}`);
  console.log(`Nivel: ${manifest.minLevel} a ${manifest.maxLevel}`);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
