import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import {
  ASSETS_MANIFEST_PATH,
  ROOT_DIR,
  getAllMapImages,
  getAllMarkerImages,
  getAllMonsterImages,
  readJson,
  safeAssetName,
  writeJson,
  MAP_PATH,
} from './data-utils.mjs';

async function download(url, publicPath) {
  const output = join(ROOT_DIR, 'public', publicPath.replace(/^\//, ''));
  const response = await fetch(url);
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  await mkdir(dirname(output), { recursive: true });
  await writeFile(output, Buffer.from(await response.arrayBuffer()));
}

async function syncGroup(urls, folder, manifest, errors) {
  for (const url of urls) {
    if (manifest[url]) continue;
    const localPath = safeAssetName(url, folder);
    try {
      await download(url, localPath);
      manifest[url] = { localPath, remoteUrl: url, ok: true };
      console.log(`Downloaded: ${localPath}`);
    } catch (error) {
      manifest[url] = { localPath, remoteUrl: url, ok: false, error: error.message };
      errors.push(`${url}: ${error.message}`);
      console.warn(`Failed to download ${url}: ${error.message}`);
    }
  }
}

async function main() {
  const maps = await readJson(MAP_PATH);
  const manifest = {};
  const errors = [];

  await syncGroup(getAllMapImages(maps), 'maps', manifest, errors);
  await syncGroup(getAllMonsterImages(maps), 'digimon', manifest, errors);
  await syncGroup(getAllMarkerImages(maps), 'markers', manifest, errors);

  await writeJson(ASSETS_MANIFEST_PATH, {
    syncedAt: new Date().toISOString(),
    totalAssets: Object.keys(manifest).length,
    failedAssets: errors.length,
    assets: manifest,
  });

  console.log(`Assets cataloged: ${Object.keys(manifest).length}`);
  console.log(`Failures using remote fallback: ${errors.length}`);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
