"""Builds web-ready WebP assets from the supplied PNGs and the layered print PDF.

Usage (from the culture-code folder):  python scripts/build_assets.py
Needs: pip install pymupdf pillow
Source files are read from the parent folder (the original hand-off folder).
"""
import io
from pathlib import Path

import numpy as np
import pymupdf
from PIL import Image
from scipy import ndimage

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT.parent
ASSETS = SRC / "assets"
PDF = SRC / "Journey Further Culture Code 210x210 V1.pdf"
OUT = ROOT / "public" / "images"

# Supplied PNGs -> output name, max width
SUPPLIED = {
    "cover-type-edited.png": ("lettering/culture-code", 1100),
    "cover-image-2-edit.png": ("illustrations/cover-group", 1000),
    "VIA-edit-LIM-WHITE.png": ("lettering/value-in-action-lime", 1200),
    "together-subheader-edit.png": ("lettering/value-together", 900),
    "open-2-edit.png": ("lettering/value-open", 900),
    "proactive-MIH-edit.png": ("lettering/value-proactive", 1000),
    "VIA-edit-sage-lime.png": ("lettering/value-in-action-sage", 1200),
    "challenge-edit.png": ("lettering/challenge-directly", 1400),
    "under-pressure.png": ("lettering/under-pressure", 1100),
    "gold-frame-founders.png": ("illustrations/gold-frame-founders", 1100),
    "megaphone-edit.png": ("illustrations/megaphone", 1200),
    "lightswitch-edit.png": ("illustrations/light-switch", 1100),
    "truth-2-edit.png": ("illustrations/magnifier-phone", 900),
    "together-bg-6-alt.png": ("illustrations/together-people", 1600),
    "together-via-2.png": ("illustrations/together-desk", 900),
}

# Layers extracted from the PDF (xref -> output name, max width, keep soft mask?)
PDF_LAYERS = {
    # Page 2 kinetic title pieces
    53: ("lettering/title/this-matters", 900, True),
    57: ("lettering/title/than-your", 700, True),
    49: ("lettering/title/job-description", 1400, True),
    25: ("lettering/title/great", 800, True),
    29: ("lettering/title/strategy", 800, True),
    33: ("lettering/title/fails", 700, True),
    37: ("lettering/title/without", 700, True),
    41: ("lettering/title/great-culture", 1400, True),
    45: ("lettering/title/this-is-ours", 900, True),
    # Cover pieces (assembled on load)
    558: ("lettering/cover-culture", 1200, True),
    562: ("lettering/cover-code", 1000, True),
    566: ("illustrations/cover-people", 1300, True),
    # Opener lettering, taken from the PDF so it lines up with the photo layers
    108: ("lettering/who-we-are", 1000, True),
    149: ("lettering/you-belong-here", 1000, True),
    183: ("lettering/how-we-succeed", 1300, True),
    227: ("lettering/one-team-always", 1000, True),
    296: ("lettering/open", 1000, True),
    351: ("lettering/proactive", 1200, True),
    392: ("lettering/the-promise", 1400, True),
    436: ("lettering/shape-the-code", 1400, True),
    # Small header logo halves
    456: ("brand/logo-culture", 330, True),
    459: ("brand/logo-code", 290, True),
    # Opener photographs and their cut-out foreground layers
    98: ("photos/who-we-are", 1600, False),
    140: ("photos/you-belong-here", 1600, False),
    151: ("cutouts/you-belong-here", 1600, True),
    158: ("photos/high-standards", 1600, False),
    168: ("cutouts/high-standards", 1600, True),
    166: ("lettering/high", 1000, True),
    179: ("photos/how-we-succeed", 1600, False),
    217: ("photos/together", 1600, False),
    229: ("cutouts/together", 1500, True),
    223: ("lettering/together-word", 1000, True),
    275: ("lettering/value-in-action-purple", 1200, True),
    290: ("photos/open", 1600, False),
    298: ("cutouts/open", 1600, True),
    345: ("photos/proactive", 1600, False),
    353: ("cutouts/proactive", 1000, True),
    388: ("photos/promise", 1600, False),
    398: ("cutouts/promise", 800, True),
    432: ("photos/shape-the-code", 1600, False),
    438: ("cutouts/shape-the-code", 1600, True),
    417: ("lettering/our-promise-to-you", 900, True),
    421: ("lettering/your-promise-to-us", 900, True),
    425: ("illustrations/handshake", 1000, True),
    # Supporting photography
    123: ("photos/evolution-building", 1100, False),
    125: ("photos/today-all-hands", 1100, False),
    162: ("photos/high-care", 1000, False),
    261: ("photos/under-pressure", 1400, False),
    292: ("photos/open-candid", 1400, False),
    322: ("photos/open-laughing", 1400, False),
    347: ("photos/active-contribution", 1000, False),
    364: ("photos/proactive-desk", 1000, False),
    370: ("photos/via-proactive-clients", 1000, False),
    372: ("photos/via-proactive-people", 1000, False),
}


# Two title layers rely on PDF clipping paths: each holds both lines of
# "This matters more / than your". Drop the line the clip would hide, by
# removing letter shapes that start above/below a cut-off (fraction of height).
DROP_LINE = {
    53: ("below", 0.42),  # keep "This matters more"
    57: ("above", 0.08),  # keep "than your"
}


def drop_line(im: Image.Image, where: str, cutoff: float) -> Image.Image:
    alpha = np.array(im.getchannel("A"))
    letters = ndimage.binary_dilation(alpha > 30, iterations=6)
    labels, count = ndimage.label(letters)
    limit = cutoff * alpha.shape[0]
    for index, box in enumerate(ndimage.find_objects(labels), start=1):
        top = box[0].start
        if (where == "below" and top > limit) or (where == "above" and top < limit):
            alpha[labels == index] = 0
    im.putalpha(Image.fromarray(alpha))
    return im


# Supplied files with lots of empty canvas, cropped to the artwork
# (left, top, right, bottom as fractions of the image).
CROP = {
    "truth-2-edit.png": (0.42, 0.11, 0.94, 0.93),
    "VIA-edit-LIM-WHITE.png": "auto",
    "VIA-edit-sage-lime.png": "auto",
    "together-subheader-edit.png": "auto",
    "open-2-edit.png": "auto",
    "proactive-MIH-edit.png": "auto",
}


def save(im: Image.Image, name: str, max_w: int) -> None:
    if im.width > max_w:
        im = im.resize((max_w, round(im.height * max_w / im.width)), Image.LANCZOS)
    path = OUT / f"{name}.webp"
    path.parent.mkdir(parents=True, exist_ok=True)
    im.save(path, "WEBP", quality=82, method=6)
    print(f"{path.relative_to(ROOT)}  {im.size}")


def main() -> None:
    for file, (name, max_w) in SUPPLIED.items():
        im = Image.open(ASSETS / file)
        im = im.convert("RGBA") if im.mode in ("RGBA", "LA", "P") else im.convert("RGB")
        if CROP.get(file) == "auto":
            im = im.crop(im.getchannel("A").point(lambda v: 255 if v > 20 else 0).getbbox())
        elif file in CROP:
            l, t, r, b = CROP[file]
            im = im.crop((round(l * im.width), round(t * im.height), round(r * im.width), round(b * im.height)))
        save(im, name, max_w)

    doc = pymupdf.open(PDF)
    smasks = {img[0]: img[1] for page in doc for img in page.get_images(full=True)}
    for xref, (name, max_w, keep_mask) in PDF_LAYERS.items():
        im = Image.open(io.BytesIO(doc.extract_image(xref)["image"])).convert("RGB")
        smask = smasks.get(xref)
        if keep_mask and smask:
            mask = Image.open(io.BytesIO(doc.extract_image(smask)["image"])).convert("L")
            im = im.convert("RGBA")
            im.putalpha(mask.resize(im.size))
        if xref in DROP_LINE:
            im = drop_line(im, *DROP_LINE[xref])
        save(im, name, max_w)


def write_manifest() -> None:
    """Writes src/content/media.ts so components get intrinsic sizes for next/image."""
    lines = [
        "// Generated by scripts/build_assets.py. Do not edit by hand.",
        "export type MediaAsset = { src: string; width: number; height: number };",
        "",
        "export const media = {",
    ]
    for path in sorted(OUT.rglob("*.webp")):
        rel = path.relative_to(OUT).with_suffix("").as_posix()
        w, h = Image.open(path).size
        lines.append(f'  "{rel}": {{ src: "/images/{rel}.webp", width: {w}, height: {h} }},')
    lines += ["} as const satisfies Record<string, MediaAsset>;", "", "export type MediaKey = keyof typeof media;", ""]
    (ROOT / "src" / "content" / "media.ts").write_text("\n".join(lines), encoding="utf-8")


if __name__ == "__main__":
    import sys

    if "--only" in sys.argv:
        only = {int(x) for x in sys.argv[sys.argv.index("--only") + 1].split(",")}
        PDF_LAYERS = {k: v for k, v in PDF_LAYERS.items() if k in only}
        SUPPLIED = {k: v for k, v in SUPPLIED.items() if k in sys.argv}
        main()
    elif "--manifest-only" not in sys.argv:
        main()
    write_manifest()
