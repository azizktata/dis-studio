/**
 * Render complete execution dossiers, page by page, for in-site browsing.
 *
 * Distinct from `render-pdf-pages.mjs`, which pulls a handful of curated
 * sheets out of AutoCAD drawings. These are multi-page SketchUp dossiers the
 * client wants readable end to end — the visitor pages through them in the
 * Lightbox rather than downloading a PDF.
 *
 *   node scripts/render-dossiers.mjs [--force] [--only <slug>]
 *
 * 151 pages at roughly 160KB each, so expect ~24MB — that is 165 PDF pages
 * less each dossier's cover and « MERCI POUR VOTRE ATTENTION » closing slide,
 * which the renderer skips. It reports the real total; if that grows well past
 * 24MB, lower MAX_W rather than shipping it quietly.
 *
 * Install once:  python -m pip install pypdfium2 pillow
 */

import { spawnSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

/**
 * Every page of each dossier, in order.
 *
 * `drawingsOnly` projects are kept out of the gallery grid (see
 * `galleryShots` in the sections) — 165 technical sheets would bury the
 * rendered interiors. They stay reachable through their project card.
 */
const MANIFEST = [
  {
    slug: "showroom-jeremy",
    pdf: "SKETCHUP/Bureautique/DOSSIER D_EXECUTION SHOWROOM JEREMY 11-10-22_250717_085532.pdf",
  },
  {
    slug: "mareli",
    pdf: "SKETCHUP/Habitation/DOSSIER DE CONSULTATION MARELI 09-12-2022.pdf",
  },
  {
    slug: "joana",
    pdf: "SKETCHUP/Bureautique/DOSSIER D_EXECUTION JOANA 02-01-2023_250717_085451.pdf",
  },
  {
    slug: "joanna-dayan",
    pdf: "SKETCHUP/Bureautique/DOSSIER DE CONSULTATION PROJET JOANNA DAYAN.pdf",
  },
  {
    slug: "pharmacie-juan",
    pdf: "SKETCHUP/Bureautique/DOSSIER D_EXECUTION  PHARMACIE JUAN_250717_085404.pdf",
  },
  {
    slug: "maurice-bares",
    pdf: "SKETCHUP/Habitation/DOSSIER D EXECUTION  MAURICE BARES_.pdf",
  },
  {
    slug: "eleonore",
    pdf: "SKETCHUP/Habitation/DOSSIER D_EXECUTION  PROJET ELEONORE_250717_085422.pdf",
  },
];

const args = [join(ROOT, "scripts", "render_dossiers.py"), JSON.stringify(MANIFEST)];
if (process.argv.includes("--force")) args.push("--force");
const onlyIdx = process.argv.indexOf("--only");
if (onlyIdx > -1 && process.argv[onlyIdx + 1]) {
  args.push("--only", process.argv[onlyIdx + 1]);
}

const res = spawnSync("python", args, { stdio: "inherit", cwd: ROOT });
if (res.status !== 0) {
  console.error("\nFailed. Ensure the deps are present:\n  python -m pip install pypdfium2 pillow");
  process.exit(res.status ?? 1);
}
