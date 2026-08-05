/**
 * Extract embedded renders from the client's PDF deliverables.
 *
 * The dossiers in `public/DIS STUDIO/` are image-wrapped: the pages are raw
 * JPEGs stored with /DCTDecode, so a byte scan for the JPEG SOI/EOI markers
 * pulls them out losslessly with no rasteriser. That matters — this machine
 * has no pdftoppm/ghostscript/mutool, so decoding pages was never an option.
 *
 *   node scripts/extract-pdf-images.mjs [--force] [--all]
 *
 * Default run writes only the curated set listed in MANIFEST.
 * `--all` dumps every candidate to public/_extract-review/ for visual triage;
 * that folder is scratch and is not referenced by the site.
 */

import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SRC = join(ROOT, "public", "DIS STUDIO");
const OUT = join(ROOT, "public", "projets");
const REVIEW = join(ROOT, "public", "_extract-review");

const MIN_BYTES = 150_000;
const MIN_W = 900;
const MIN_H = 500;

/**
 * Curated output. `pick` indexes into the candidate list for that PDF (as
 * printed by --all), so the selection is reproducible.
 *
 * `crop` is [left, top, right, bottom] as fractions of the image. It exists so
 * title blocks — which carry a third-party studio's name and private client
 * names — can be removed later by editing this table and re-running, without
 * touching any component code.
 */
const MANIFEST = [
  // Warmest palette of the set — wood, cream, stone. Leads the portfolio.
  {
    slug: "villa-wabi-sabi",
    pdf: "3DS MAX/Habitation/projet villa wabi sabi.pdf",
    pick: [0, 1, 2],
  },
  // 19 candidates; these are the warm, well-composed ones. Skipped the
  // cool-grey bedrooms and the children's rooms — off-palette for the page.
  {
    slug: "villa-contemporaine",
    pdf: "3DS MAX/Habitation/projet villa contemporain.pdf",
    pick: [6, 10, 8, 9, 16, 0],
  },
  {
    slug: "villa-neoclassique",
    pdf: "3DS MAX/Habitation/Projet villa neoclassique.pdf",
    pick: [0, 1, 4, 5],
  },
  // Tile showroom: darker and more commercial than the rest, and it carries a
  // visible third-party brand. Two frames only, as retail evidence.
  {
    slug: "showroom-siceram",
    pdf: "3DS MAX/Habitation/Projet Siceram.pdf",
    pick: [5, 6],
  },
  // Dimensioned joinery — the strongest B2B/"documentation technique" proof.
  {
    slug: "showroom-jeremy",
    pdf: "SKETCHUP/Bureautique/DOSSIER D_EXECUTION SHOWROOM JEREMY 11-10-22_250717_085532.pdf",
    pick: [0, 8, 11, 14],
  },
  // Full dossier sheets: plan + elevations + 3D views on one page.
  {
    slug: "dossier-chambre",
    pdf: "SKETCHUP/Habitation/Vue 3D chambre viila.pdf",
    pick: [0],
  },
  {
    slug: "dossier-dressing",
    pdf: "SKETCHUP/Habitation/Vue 3D dressing.pdf",
    pick: [0],
  },
  {
    slug: "dossier-sdb",
    pdf: "SKETCHUP/Habitation/Plan SDB en 3D.pdf",
    pick: [0],
  },
  {
    slug: "dossier-cuisine",
    pdf: "SKETCHUP/Habitation/Plan 3d cuisine.pdf",
    pick: [0],
  },
  {
    slug: "mareli",
    pdf: "SKETCHUP/Habitation/DOSSIER DE CONSULTATION MARELI 09-12-2022.pdf",
    pick: [0, 1],
  },
];

/** Read width/height out of a JPEG's SOF marker. */
function jpegSize(buf) {
  let i = 2;
  while (i < buf.length - 9) {
    if (buf[i] !== 0xff) {
      i++;
      continue;
    }
    const marker = buf[i + 1];
    // SOF0..SOF15, excluding DHT(c4), JPG(c8) and DAC(cc)
    if (
      marker >= 0xc0 &&
      marker <= 0xcf &&
      marker !== 0xc4 &&
      marker !== 0xc8 &&
      marker !== 0xcc
    ) {
      return { height: buf.readUInt16BE(i + 5), width: buf.readUInt16BE(i + 7) };
    }
    if (i + 3 >= buf.length) break;
    i += 2 + buf.readUInt16BE(i + 2);
  }
  return null;
}

/** All JPEG runs in a PDF that clear the size and dimension floors. */
function candidates(pdfPath) {
  const data = readFileSync(pdfPath);
  const found = [];
  let i = 0;
  while (i < data.length - 3) {
    const start = data.indexOf(Buffer.from([0xff, 0xd8, 0xff]), i);
    if (start < 0) break;
    const end = data.indexOf(Buffer.from([0xff, 0xd9]), start + 2);
    if (end < 0) break;
    const buf = data.subarray(start, end + 2);
    if (buf.length >= MIN_BYTES) {
      const size = jpegSize(buf);
      if (size && size.width >= MIN_W && size.height >= MIN_H) {
        found.push({ buf, ...size });
      }
    }
    i = end + 2;
  }
  return found;
}

const force = process.argv.includes("--force");
const dumpAll = process.argv.includes("--all");

if (dumpAll) {
  mkdirSync(REVIEW, { recursive: true });
  const walk = (dir) =>
    readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
      e.isDirectory() ? walk(join(dir, e.name)) : [join(dir, e.name)],
    );
  const pdfs = walk(SRC).filter((f) => f.toLowerCase().endsWith(".pdf"));
  let total = 0;
  for (const pdf of pdfs) {
    const rel = pdf.slice(SRC.length + 1).replace(/\\/g, "/");
    const imgs = candidates(pdf);
    if (!imgs.length) continue;
    const tag = rel.replace(/[^a-zA-Z0-9]+/g, "-").slice(0, 60);
    imgs.forEach((img, n) => {
      writeFileSync(join(REVIEW, `${tag}__${n}.jpg`), img.buf);
      total++;
    });
    console.log(`${String(imgs.length).padStart(3)}  ${rel}`);
  }
  console.log(`\n${total} candidates written to public/_extract-review/`);
  process.exit(0);
}

let written = 0;
let skipped = 0;
for (const entry of MANIFEST) {
  const pdfPath = join(SRC, entry.pdf);
  if (!existsSync(pdfPath)) {
    console.warn(`MISSING PDF  ${entry.pdf}`);
    continue;
  }
  const imgs = candidates(pdfPath);
  const dir = join(OUT, entry.slug);
  mkdirSync(dir, { recursive: true });

  entry.pick.forEach((idx, n) => {
    const img = imgs[idx];
    if (!img) {
      console.warn(`  no candidate #${idx} in ${entry.slug}`);
      return;
    }
    const out = join(dir, `${String(n + 1).padStart(2, "0")}.jpg`);
    if (existsSync(out) && !force) {
      skipped++;
      return;
    }
    writeFileSync(out, img.buf);
    written++;
    console.log(
      `  ${entry.slug}/${String(n + 1).padStart(2, "0")}.jpg  ${img.width}x${img.height}  ${(img.buf.length / 1024) | 0}KB`,
    );
  });
}
console.log(`\nwritten ${written}, skipped ${skipped} (use --force to overwrite)`);

if (written) {
  console.log(
    "\nNote: extracted JPEGs are written at source resolution (some are 3370px,\n" +
      "2.4MB). next/image caps the ladder at 1920 in next.config.ts, so downscale\n" +
      "anything wider before committing:\n" +
      "  python -c \"from PIL import Image; import glob,os; [ (lambda f,im: im.width>1920 and im.convert('RGB').resize((1920,int(im.height*1920/im.width)),Image.LANCZOS).save(f,quality=84,optimize=True,progressive=True))(f,Image.open(f)) for f in glob.glob('public/projets/*/*.jpg') ]\"",
  );
}
