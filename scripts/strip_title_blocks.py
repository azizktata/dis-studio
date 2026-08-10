"""Remove the title block from the delivered drawing sheets.

Those cartouches carry real personal data — a designer's gmail and mobile, a
third-party firm's phone/fax and street address, and private client names. None
of it belongs on a public marketing site.

Cropping beats blurring here: blurred text can sometimes be recovered, and a
blur visibly advertises that something was hidden. Cropping also lets the
drawing be trimmed much tighter afterwards, which is why the order matters:

    1. crop the title-block band off the bottom
    2. drop the sheet's outer border frame
    3. trim to the actual linework

Run against the derived files only. Originals under public/DIS STUDIO/ are
never touched, so any wrong value here is a re-run, not a loss:

    python scripts/strip_title_blocks.py [--dry-run]

Requires: python -m pip install pillow numpy
"""

import os
import sys

import numpy as np
from PIL import Image

OUT = os.path.join("public", "projets")
MAX_W = 1920

# Measured per image, not auto-detected: a detector missed plans-habitation/02
# entirely and misread maison-de-culture/02 at 23% by locking onto a façade
# line. `band` is the fraction of height to remove from the bottom.
SHEETS = [
    # AutoCAD sheets — thin cartouche strip along the foot.
    ("plans-habitation/01.jpg", 0.052),
    ("plans-habitation/02.jpg", 0.060),
    ("plans-habitation/03.jpg", 0.050),
    ("maison-de-culture/01.jpg", 0.050),
    ("maison-de-culture/02.jpg", 0.062),
    ("maison-de-culture/03.jpg", 0.096),
    # SketchUp dossier sheets — taller block with the firm's contact details.
    ("dossier-chambre/01.jpg", 0.120),
    ("dossier-cuisine/01.jpg", 0.140),
    ("dossier-dressing/01.jpg", 0.150),
    ("dossier-sdb/01.jpg", 0.142),
]

# Fraction inset to clear the printed border before trimming to ink.
FRAME_INSET = 0.045


def trim_to_ink(img, pad=24, threshold=170, min_frac=0.006):
    """Crop to rows/columns that actually carry linework."""
    grey = np.asarray(img.convert("L"))
    h, w = grey.shape
    dark = grey < threshold
    rows = np.where(dark.sum(axis=1) / w > min_frac)[0]
    cols = np.where(dark.sum(axis=0) / h > min_frac)[0]
    if not len(rows) or not len(cols):
        return img
    top, bottom = rows[0], rows[-1]
    left, right = cols[0], cols[-1]
    return img.crop(
        (
            max(0, left - pad),
            max(0, top - pad),
            min(w, right + pad),
            min(h, bottom + pad),
        )
    )


def main():
    dry = "--dry-run" in sys.argv
    for rel, band in SHEETS:
        path = os.path.join(OUT, rel.replace("/", os.sep))
        if not os.path.exists(path):
            print(f"  MISSING  {rel}")
            continue

        img = Image.open(path).convert("RGB")
        before = img.size

        # 1. drop the title block
        img = img.crop((0, 0, img.width, int(img.height * (1 - band))))
        # 2. drop the border frame
        inset = int(min(img.size) * FRAME_INSET)
        img = img.crop((inset, inset, img.width - inset, img.height - inset))
        # 3. trim to linework
        img = trim_to_ink(img)

        if img.width > MAX_W:
            ratio = MAX_W / img.width
            img = img.resize((MAX_W, int(img.height * ratio)), Image.LANCZOS)

        reclaimed = 100 * (1 - (img.height / before[1]))
        print(
            f"  {rel:28s} {before[0]}x{before[1]} -> {img.width}x{img.height}"
            f"  (-{reclaimed:.0f}% height)"
        )
        if not dry:
            img.save(path, quality=86, optimize=True, progressive=True)

    print("\ndry run, nothing written" if dry else "\ndone")


if __name__ == "__main__":
    main()
