"""Rasterise vector PDF pages for the portfolio.

Driven by scripts/render-pdf-pages.mjs, which passes the manifest as JSON.
Requires: python -m pip install pypdfium2 pillow
"""

import json
import os
import sys

import pypdfium2 as pdfium
from PIL import Image, ImageChops, ImageOps

SRC = os.path.join("public", "DIS STUDIO")
OUT = os.path.join("public", "projets")
MAX_W = 1920


def trim_whitespace(img, pad=28):
    """Crop the blank paper around a drawing.

    These sheets sit a small plan on a large page, so an untrimmed render is
    mostly white. Compare against the corner pixel rather than pure white —
    scans and exports are rarely exactly #FFFFFF.
    """
    rgb = img.convert("RGB")
    bg = Image.new("RGB", rgb.size, rgb.getpixel((0, 0)))
    diff = ImageChops.difference(rgb, bg)
    # Amplify so faint linework still registers against the background.
    bbox = ImageChops.add(diff, diff, 2.0, -24).getbbox()
    if not bbox:
        return img
    left, top, right, bottom = bbox
    left = max(0, left - pad)
    top = max(0, top - pad)
    right = min(img.width, right + pad)
    bottom = min(img.height, bottom + pad)
    if right - left < 80 or bottom - top < 80:
        return img
    return img.crop((left, top, right, bottom))


def main():
    manifest = json.loads(sys.argv[1])
    force = "--force" in sys.argv

    written = skipped = 0
    for item in manifest:
        src = os.path.join(SRC, item["pdf"])
        if not os.path.exists(src):
            print(f"  MISSING  {item['pdf']}")
            continue

        dest_dir = os.path.join(OUT, item["slug"])
        os.makedirs(dest_dir, exist_ok=True)
        dest = os.path.join(dest_dir, item["out"])
        if os.path.exists(dest) and not force:
            skipped += 1
            continue

        pdf = pdfium.PdfDocument(src)
        page = pdf[item.get("page", 0)]
        img = page.render(scale=2.2).to_pil()

        if item.get("trim", True):
            img = trim_whitespace(img)

        # Flatten onto white so any alpha does not turn black in the JPEG.
        if img.mode in ("RGBA", "LA", "P"):
            img = img.convert("RGBA")
            flat = Image.new("RGB", img.size, (255, 255, 255))
            flat.paste(img, mask=img.split()[-1])
            img = flat
        else:
            img = img.convert("RGB")

        if img.width > MAX_W:
            img = ImageOps.contain(img, (MAX_W, 10_000), Image.LANCZOS)

        img.save(dest, quality=84, optimize=True, progressive=True)
        written += 1
        print(
            f"  {item['slug']}/{item['out']}  {img.width}x{img.height}  "
            f"{os.path.getsize(dest) // 1024}KB"
        )

    print(f"\nrendered {written}, skipped {skipped} (use --force to overwrite)")


if __name__ == "__main__":
    main()
