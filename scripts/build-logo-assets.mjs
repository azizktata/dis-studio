/**
 * Derive web logo assets from the supplied brand artwork.
 *
 * `public/LOGO JPG.jpg` is an 8333px JPEG with the obsidian ground baked in.
 * That ground is part of the identity — the mark is gold and off-white, which
 * only reads against dark — so these assets keep it rather than attempting a
 * background knockout. Knocking out a JPEG at this size fringes badly around
 * the gold edges, and the result would fail on a greige surface anyway.
 *
 *   node scripts/build-logo-assets.mjs [--force]
 *
 * Delegates the pixel work to scripts/build_logo_assets.py (Pillow), the same
 * split used by the PDF pipeline.
 *
 * If the client supplies a vector (SVG/AI/EPS), prefer it: it would render
 * sharply at every size and allow a greige-ground variant.
 */

import { spawnSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

const args = [join(ROOT, "scripts", "build_logo_assets.py")];
if (process.argv.includes("--force")) args.push("--force");

const res = spawnSync("python", args, { stdio: "inherit", cwd: ROOT });
if (res.status !== 0) {
  console.error("\nFailed. Ensure Pillow is present:  python -m pip install pillow");
  process.exit(res.status ?? 1);
}
