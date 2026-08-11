"""Cut the brand artwork into the pieces the site needs.

Driven by scripts/build-logo-assets.mjs. Requires: pillow, numpy.

The source is one square JPEG stacking three elements on an obsidian ground:

    the D-I-S roof mark
    the word STUDIO
    the line DESIGN INNOVATION SOLUTIONS

Boundaries are found by scanning for full-width horizontal gaps rather than
being hard-coded, so a re-export of the artwork at different proportions still
cuts correctly.
"""

import os
import sys

import numpy as np
from PIL import Image

SRC = os.path.join("public", "LOGO JPG.jpg")
OUT = os.path.join("public", "brand")

# Anything brighter than the obsidian ground counts as artwork.
INK_THRESHOLD = 60
PAD = 0.03  # breathing room, as a fraction of the cropped box


def content_bounds(grey, threshold=INK_THRESHOLD, min_px=2):
    mask = grey > threshold
    rows = np.where(mask.sum(axis=1) > min_px)[0]
    cols = np.where(mask.sum(axis=0) > min_px)[0]
    if not len(rows) or not len(cols):
        raise SystemExit("no artwork found — is the source the expected logo?")
    return rows[0], rows[-1], cols[0], cols[-1]


def horizontal_gaps(grey, top, bottom, threshold=INK_THRESHOLD, min_run=8):
    """Blank bands separating the stacked elements."""
    mask = grey > threshold
    rowsum = mask.sum(axis=1)
    gaps, run = [], 0
    for y in range(top, bottom + 1):
        if rowsum[y] < 2:
            run += 1
        else:
            if run > min_run:
                gaps.append((y - run, y))
            run = 0
    return gaps


def crop(img, box, pad_frac=PAD):
    left, top, right, bottom = box
    pad = int(min(right - left, bottom - top) * pad_frac)
    return img.crop(
        (
            max(0, left - pad),
            max(0, top - pad),
            min(img.width, right + pad),
            min(img.height, bottom + pad),
        )
    )


def save(img, name, width):
    os.makedirs(OUT, exist_ok=True)
    path = os.path.join(OUT, name)
    if img.width > width:
        img = img.resize((width, round(img.height * width / img.width)), Image.LANCZOS)
    img.save(path, quality=92, optimize=True, progressive=True)
    print(f"  {name:22s} {img.width}x{img.height}  {os.path.getsize(path) // 1024}KB")


def main():
    force = "--force" in sys.argv
    if not os.path.exists(SRC):
        raise SystemExit(f"missing {SRC}")
    if os.path.exists(os.path.join(OUT, "logo-mark.jpg")) and not force:
        print("  assets already built (use --force to rebuild)")
        return

    src = Image.open(SRC).convert("RGB")
    # Work from a downscale: 8333px is far beyond what any web size needs, and
    # the gap detection is more stable without JPEG noise at full resolution.
    work = src.copy()
    work.thumbnail((2400, 2400), Image.LANCZOS)
    grey = np.asarray(work.convert("L"))

    top, bottom, left, right = content_bounds(grey)
    gaps = horizontal_gaps(grey, top, bottom)

    if len(gaps) < 2:
        raise SystemExit(
            f"expected 2 gaps (mark | STUDIO | tagline), found {len(gaps)}"
        )

    mark_bottom = gaps[0][0]
    tagline_bottom = bottom

    # The roof mark alone — used small, in the nav.
    save(crop(work, (left, top, right, mark_bottom)), "logo-mark.jpg", 480)
    # Everything: mark, STUDIO, and the DESIGN INNOVATION SOLUTIONS line.
    save(crop(work, (left, top, right, tagline_bottom)), "logo-full.jpg", 720)

    print("\ndone")


if __name__ == "__main__":
    main()
