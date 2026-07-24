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
      errors.push(`${mapKey}: backgroundImage ausente ou invalido.`);
    }
    urls.set(map.backgroundImage, (urls.get(map.backgroundImage) || 0) + 1);

    const mobs = Array.isArray(map.mobs) ? map.mobs : [];
    if (!mobs.length) noMobs.push(mapKey);

    mobs.forEach((mob, index) => {
      spawns += 1;
      const prefix = `${mapKey}.mobs[${index}]`;
      uniqueDigimons.add(mob.name || mob.id);
      if (!validateCoordinate(mob.top) || !validateCoordinate(mob.left)) {
        errors.push(`${prefix}: coordenadas invalidas.`);
      }
      if (!mob.src || !isUrl(mob.src)) errors.push(`${prefix}: src ausente ou invalido.`);
      if (!Number.isFinite(mob.level)) errors.push(`${prefix}: level invalido.`);
      if (!Number.isFinite(mob.hp)) errors.push(`${prefix}: hp invalido.`);
      if (!Array.isArray(mob.items)) errors.push(`${prefix}: items deve ser lista.`);
      if (mob.isAggressive === true) aggressive += 1;
      if (typeof mob.evol === 'string' && mob.evol.trim()) evolutions += 1;
      urls.set(mob.src, (urls.get(mob.src) || 0) + 1);
    });

    for (const key of MARKER_KEYS) {
      const markers = Array.isArray(map[key]) ? map[key] : [];
      markers.forEach((marker, index) => {
        const prefix = `${mapKey}.${key}[${index}]`;
        if (!validateCoordinate(marker.top) || !validateCoordinate(marker.left)) {
          errors.push(`${prefix}: coordenadas invalidas.`);
        }
        if (!marker.src || !isUrl(marker.src)) errors.push(`${prefix}: src ausente ou invalido.`);
        urls.set(marker.src, (urls.get(marker.src) || 0) + 1);
      });
    }
  }

  if (Object.keys(maps).length < EXPECTED_MAPS) {
    errors.push(`Quantidade de mapas menor que o esperado: ${Object.keys(maps).length}/${EXPECTED_MAPS}.`);
  }
  if (!Object.keys(digimons).length) errors.push('digimon.json esta vazio.');

  const duplicatedUrls = [...urls.values()].filter((count) => count > 1).length;
  if (duplicatedUrls) warnings.push(`URLs duplicadas encontradas: ${duplicatedUrls}.`);

  console.log(`Mapas carregados: ${Object.keys(maps).length}`);
  console.log(`Spawns carregados: ${spawns}`);
  console.log(`Digimons unicos: ${uniqueDigimons.size}`);
  console.log(`Mapas sem monstros: ${noMobs.length}${noMobs.length ? ` (${noMobs.join(', ')})` : ''}`);
  console.log(`Spawns agressivos: ${aggressive}`);
  console.log(`Eventos de evolucao: ${evolutions}`);
  console.log(`Erros criticos: ${errors.length}`);
  console.log(`Avisos: ${warnings.length}`);

  for (const warning of warnings) console.warn(`Aviso: ${warning}`);
  for (const error of errors) console.error(`Erro: ${error}`);

  if (errors.length) process.exit(1);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
