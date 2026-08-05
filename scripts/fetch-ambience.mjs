/**
 * Download the Unsplash ambience photography into `public/ambiance/`.
 *
 * Hotlinking Unsplash makes every hero and section image depend on a live
 * third-party fetch at request time. When that fetch is slow the Next image
 * optimiser gives up (HTTP 500 after ~10s) and the section renders blank —
 * which is exactly what happened during review. Serving the files locally
 * removes the dependency and the failure mode.
 *
 *   node scripts/fetch-ambience.mjs [--force]
 *
 * The credit line in the footer still applies: these remain Unsplash images.
 */

import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, "public", "ambiance");

/** Keys match the `ambience` map in app/_lib/content.ts. */
const PHOTOS = {
  heroSalon: "photo-1600210492486-724fe5c67fb0",
  sejourBois: "photo-1618221195710-dd6b41faaea6",
  salonEditorial: "photo-1616486338812-3dadae4b4ace",
  archiVerriere: "photo-1604014237800-1c9102c219da",
  salonBois: "photo-1600607687939-ce8a6c25118c",
  linTerracotta: "photo-1616627561950-9f746e330187",
  chambreChaude: "photo-1616486029423-aaa4789e8c9a",
  salonPoutres: "photo-1600210491892-03d54c0aaf87",
  atelierDessin: "photo-1454165804606-c3d57bc86b40",
};

const WIDTH = 2000;
const force = process.argv.includes("--force");

mkdirSync(OUT, { recursive: true });

let written = 0;
let skipped = 0;

for (const [key, id] of Object.entries(PHOTOS)) {
  const dest = join(OUT, `${key}.jpg`);
  if (existsSync(dest) && !force) {
    skipped++;
    continue;
  }
  const url = `https://images.unsplash.com/${id}?w=${WIDTH}&q=80&auto=format&fit=crop`;
  const res = await fetch(url);
  if (!res.ok) {
    console.error(`  FAILED ${key}: HTTP ${res.status}`);
    continue;
  }
  const buf = Buffer.from(await res.arrayBuffer());
  writeFileSync(dest, buf);
  written++;
  console.log(`  ambiance/${key}.jpg  ${(buf.length / 1024) | 0}KB`);
}

console.log(`\nwritten ${written}, skipped ${skipped} (use --force to refresh)`);
