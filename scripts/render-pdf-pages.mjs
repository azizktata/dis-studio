/**
 * Render vector PDF pages (AutoCAD / Revit drawings) to JPEG.
 *
 * The AutoCAD deliverables carry no embedded images — they are pure vector, so
 * `extract-pdf-images.mjs` finds nothing in them. These need real rasterising.
 *
 * Rasterising is done by `scripts/render_pdf_pages.py` (pypdfium2 + Pillow);
 * this file is the manifest and the runner, so both extraction paths are
 * driven the same way.
 *
 *   node scripts/render-pdf-pages.mjs [--force]
 *
 * Install once:  python -m pip install pypdfium2 pillow
 */

import { spawnSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

/**
 * `trim` removes the blank paper around the drawing — these sheets place a
 * small plan on a large page, so an untrimmed render is mostly white.
 */
const MANIFEST = [
  {
    slug: "plans-habitation",
    out: "01.jpg",
    pdf: "AutoCAD/Habitation/Plan D_aménagement villa.pdf",
    page: 0,
    trim: true,
  },
  {
    slug: "plans-habitation",
    out: "02.jpg",
    pdf: "AutoCAD/Habitation/Plan D_aménagement.pdf",
    page: 0,
    trim: true,
  },
  {
    slug: "plans-habitation",
    out: "03.jpg",
    pdf: "AutoCAD/Habitation/Facade (2).pdf",
    page: 0,
    trim: true,
  },
  {
    slug: "maison-de-culture",
    out: "01.jpg",
    pdf: "AutoCAD/Maison de culture/plan d_aménagement.pdf",
    page: 0,
    trim: true,
  },
  {
    slug: "maison-de-culture",
    out: "02.jpg",
    pdf: "AutoCAD/Maison de culture/Facade principale.pdf",
    page: 0,
    trim: true,
  },
  {
    slug: "maison-de-culture",
    out: "03.jpg",
    pdf: "AutoCAD/Maison de culture/COUPE AA.pdf",
    page: 0,
    trim: true,
  },
];

const args = [
  join(ROOT, "scripts", "render_pdf_pages.py"),
  JSON.stringify(MANIFEST),
];
if (process.argv.includes("--force")) args.push("--force");

const res = spawnSync("python", args, { stdio: "inherit", cwd: ROOT });
if (res.status !== 0) {
  console.error(
    "\nRendering failed. Ensure the Python deps are present:\n" +
      "  python -m pip install pypdfium2 pillow",
  );
  process.exit(res.status ?? 1);
}
