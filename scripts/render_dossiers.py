"""Rasterise complete dossiers, one JPEG per page.

Driven by scripts/render-dossiers.mjs, which passes the manifest as JSON.
Requires: python -m pip install pypdfium2 pillow

Writes public/projets/<slug>/p02.jpg … p{n-1}.jpg — the cover and the closing
slide are skipped, so numbering starts at 02 — and records finished slugs in a
ledger so a re-run skips them. The ledger matters: these scripts write in
place, and strip_title_blocks.py previously double-cropped its output when
re-run without one.
"""

import json
import os
import sys

import pypdfium2 as pdfium
from PIL import Image

SRC = os.path.join("public", "DIS STUDIO")
OUT = os.path.join("public", "projets")
STAMP = os.path.join(OUT, ".dossiers-rendered")

MAX_W = 1600
SCALE = 2.0
QUALITY = 82


def load_stamp():
    if not os.path.exists(STAMP):
        return set()
    with open(STAMP, encoding="utf-8") as fh:
        return {line.strip() for line in fh if line.strip()}


def save_stamp(done):
    with open(STAMP, "w", encoding="utf-8") as fh:
        fh.write("\n".join(sorted(done)) + "\n")


def render(entry):
    """Render one dossier. Returns (pages, bytes)."""
    src = os.path.join(SRC, entry["pdf"].replace("/", os.sep))
    if not os.path.exists(src):
        print(f"  MISSING  {entry['pdf']}")
        return 0, 0

    dest_dir = os.path.join(OUT, entry["slug"])
    os.makedirs(dest_dir, exist_ok=True)

    pdf = pdfium.PdfDocument(src)
    written = total = 0

    # Skip both wrappers: page 1 is a title-only cover, and the last page is a
    # « MERCI POUR VOTRE ATTENTION » slide. Neither is a drawing, and the cover
    # made a poor card thumbnail. Numbering still follows the PDF's own index,
    # so the files run p02 … p{n-1} and match `dossier()` in _lib/content.ts.
    for i in range(1, len(pdf) - 1):
        img = pdf[i].render(scale=SCALE).to_pil()

        # Flatten any alpha onto white so it does not turn black in JPEG.
        if img.mode in ("RGBA", "LA", "P"):
            img = img.convert("RGBA")
            flat = Image.new("RGB", img.size, (255, 255, 255))
            flat.paste(img, mask=img.split()[-1])
            img = flat
        else:
            img = img.convert("RGB")

        if img.width > MAX_W:
            img = img.resize(
                (MAX_W, round(img.height * MAX_W / img.width)), Image.LANCZOS
            )

        path = os.path.join(dest_dir, f"p{i + 1:02d}.jpg")
        img.save(path, quality=QUALITY, optimize=True, progressive=True)
        written += 1
        total += os.path.getsize(path)

    print(
        f"  {entry['slug']:18s} {written:3d} pages  {total / 1024 / 1024:5.1f}MB"
    )
    return written, total


def main():
    manifest = json.loads(sys.argv[1])
    force = "--force" in sys.argv
    only = None
    if "--only" in sys.argv:
        only = sys.argv[sys.argv.index("--only") + 1]

    done = set() if force else load_stamp()
    processed = set(done)
    pages = size = 0

    for entry in manifest:
        if only and entry["slug"] != only:
            continue
        if entry["slug"] in done and not force:
            print(f"  SKIP (already rendered)  {entry['slug']}")
            continue
        p, s = render(entry)
        if p:
            processed.add(entry["slug"])
            pages += p
            size += s

    save_stamp(processed)
    if pages:
        print(
            f"\nrendered {pages} pages, {size / 1024 / 1024:.1f}MB total"
            f"  (avg {size / pages / 1024:.0f}KB/page)"
        )
    print("re-run with --force to redo, or --only <slug> for one dossier")


if __name__ == "__main__":
    main()
