"""Builds web-ready WebP assets from the supplied PNGs and the layered print PDF.

Usage (from the culture-code folder):  python scripts/build_assets.py
       python scripts/build_assets.py --new-only   (just the "new assets" folder)
Needs: pip install pymupdf pillow numpy scipy
Source files are read from the parent folder (the original hand-off folder).
"""
import io
from pathlib import Path

import numpy as np
import pymupdf
from PIL import Image, ImageDraw, ImageFont, ImageOps
from scipy import ndimage

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT.parent
ASSETS = SRC / "assets"
NEW_ASSETS = SRC / "new assets"
PDF = SRC / "Journey Further Culture Code 210x210 V1.pdf"
OUT = ROOT / "public" / "images"

# Supplied PNGs -> output name, max width
SUPPLIED = {
    "VIA-edit-LIM-WHITE.png": ("lettering/value-in-action-lime", 1200),
    "VIA-edit-sage-lime.png": ("lettering/value-in-action-sage", 1200),
    "megaphone-edit.png": ("illustrations/megaphone", 1200),
}

# The second round of art (the "new assets" folder), each cropped to its artwork.
NEW_SUPPLIED = {
    "culture-only.png": ("lettering/culture", 1200),
    "code-only.png": ("lettering/code", 1000),
    "Great-only.png": ("lettering/title/great", 900),
    "strategy-only.png": ("lettering/title/strategy", 1100),
    "high-only.png": ("lettering/hs-high", 500),
    "standards-only.png": ("lettering/hs-standards", 900),
    "care-only.png": ("lettering/hs-care", 600),
    "open-3-cutout.png": ("lettering/open", 1100),
    "proactive-MIH-2-edit.png": ("lettering/proactive", 1200),
    "challenge-edit-background.png": ("lettering/challenge-directly", 1300),
    "magnifying-glass-2.png": ("illustrations/magnifier-phone", 800),
    "together-6-pikachu-edit.png": ("illustrations/together-team", 1500),
    "boot-only.png": ("illustrations/boot", 800),
    "front-office.png": ("photos/front-office", 1100),
    "together-only.png": ("lettering/together-word", 1000),
    "who-we-are.png": ("photos/who-we-are", 1600),
    "shapecode.jpg": ("photos/shape-the-code", 1600),
    "youbelong.jpg": ("photos/belong-1", 1100),
    "youbelong2.jpg": ("photos/belong-2", 1100),
    "youbelong3.jpg": ("photos/belong-3", 1100),
    "IMG_0461.JPG": ("photos/throwback-leeds", 900),
    "open.jpg": ("photos/open-candid-table", 1400),
    "one-team-always-only.png": ("lettering/one-team-always", 1000),
    "Cartoon Paddleboard Race on a Green Lake.png": ("illustrations/together-paddleboard", 1000),
    "Modern Video Meeting in a Bright Office-edit.png": ("illustrations/together-video-call", 1000),
}

# Layers extracted from the PDF (xref -> output name, max width, keep soft mask?)
PDF_LAYERS = {
    # Page 2 kinetic title pieces
    53: ("lettering/title/this-matters", 900, True),
    57: ("lettering/title/than-your", 700, True),
    49: ("lettering/title/job-description", 1400, True),
    33: ("lettering/title/fails", 700, True),
    37: ("lettering/title/without", 700, True),
    41: ("lettering/title/great-culture", 1400, True),
    45: ("lettering/title/this-is-ours", 900, True),
    # Opener lettering, taken from the PDF so it lines up with the photo layers
    108: ("lettering/who-we-are", 1000, True),
    149: ("lettering/you-belong-here", 1000, True),
    183: ("lettering/how-we-succeed", 1300, True),
    392: ("lettering/the-promise", 1400, True),
    436: ("lettering/shape-the-code", 1400, True),  # its photo comes from shapecode.jpg now
    # Opener photographs and their cut-out foreground layers
    179: ("photos/how-we-succeed", 1600, False),
    217: ("photos/together", 1600, False),
    229: ("cutouts/together", 1500, True),
    275: ("lettering/value-in-action-purple", 1200, True),
    290: ("photos/open", 1600, False),
    298: ("cutouts/open", 1600, True),
    345: ("photos/proactive", 1600, False),
    353: ("cutouts/proactive", 1000, True),
    388: ("photos/promise", 1600, False),
    398: ("cutouts/promise", 800, True),
    417: ("lettering/our-promise-to-you", 900, True),
    421: ("lettering/your-promise-to-us", 900, True),
    # Supporting photography
    125: ("photos/today-all-hands", 1100, False),
    162: ("photos/high-care", 1000, False),
    261: ("photos/under-pressure", 1400, False),
    292: ("photos/open-candid", 1400, False),
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
    "VIA-edit-LIM-WHITE.png": "auto",
    "VIA-edit-sage-lime.png": "auto",
}

# Inner corners of the gold frame's opening (TL, TR, BR, BL) in gold-frame-founders.png. The frame
# hangs slightly askew, so the new painting is warped to fit. FOUNDERS_CROP trims the painting's
# cream margin so it fills the opening's wider shape.
FRAME_OPENING = [(258, 426), (1009, 452), (992, 997), (242, 975)]
FOUNDERS_CROP = (0, 95, 1120, 925)


def opaque_box(im: Image.Image) -> tuple[int, int, int, int]:
    return im.getchannel("A").point(lambda v: 255 if v > 20 else 0).getbbox()


def trim(im: Image.Image, pad: int = 4) -> Image.Image:
    """Crops to the artwork, keeping a few pixels of room for soft shadows."""
    return union_trim([im], pad)[0]


def union_trim(images: list[Image.Image], pad: int = 4) -> list[Image.Image]:
    """Crops same-size images to one shared box, so they stay aligned when stacked."""
    boxes = [opaque_box(im) for im in images]
    w, h = images[0].size
    box = (
        max(0, min(b[0] for b in boxes) - pad),
        max(0, min(b[1] for b in boxes) - pad),
        min(w, max(b[2] for b in boxes) + pad),
        min(h, max(b[3] for b in boxes) + pad),
    )
    return [im.crop(box) for im in images]


def perspective_coeffs(quad, size) -> list[float]:
    """PIL perspective coefficients mapping output pixels inside `quad` back to a source of `size`."""
    w, h = size
    src = [(0, 0), (w, 0), (w, h), (0, h)]
    rows, rhs = [], []
    for (x, y), (u, v) in zip(quad, src):
        rows += [[x, y, 1, 0, 0, 0, -u * x, -u * y], [0, 0, 0, x, y, 1, -v * x, -v * y]]
        rhs += [u, v]
    return np.linalg.solve(np.array(rows, float), np.array(rhs, float)).tolist()


# Photos cropped to the square opener stage (left, top, right, bottom in source pixels).
NEW_CROP = {
    "shapecode.jpg": (800, 0, 5472, 4672),
    "youbelong.jpg": (200, 0, 3633, 2575),
    "youbelong2.jpg": (900, 300, 6100, 4200),
    "youbelong3.jpg": (0, 0, 5764, 4323),
}

# Lettering whose outline has pale, grainy flecks round the outside, which look like a white halo over
# photos. Their outer edge is softened and the flecks toned down to the outline colour.
FEATHER = {"open-3-cutout.png", "proactive-MIH-2-edit.png"}


def feather(im: Image.Image, band: float = 15) -> Image.Image:
    """Softens the outermost `band` pixels of the artwork and darkens light specks within them."""
    px = np.array(im).astype(float)
    inside = px[..., 3] > 128
    depth = ndimage.distance_transform_edt(inside)
    edge = np.clip(depth / band, 0, 1)
    luma = px[..., :3] @ [0.299, 0.587, 0.114]
    tone = np.where((luma > 110) & (edge < 1), 1 - edge, 0)[..., None]
    px[..., :3] = px[..., :3] * (1 - tone) + np.array([38, 38, 40]) * tone
    soft = ndimage.gaussian_filter(np.where(inside, 1.0, 0.0), 1.6)
    px[..., 3] = np.minimum(px[..., 3], 255 * np.clip((soft - 0.15) / 0.7, 0, 1))
    return Image.fromarray(px.round().astype(np.uint8), "RGBA")


BALLOON = NEW_ASSETS / "balloon"
STANDARDS_CARE = NEW_ASSETS / "standards care"
FONT = ROOT / "src" / "fonts" / "SohneBreit-Fett.otf"

# The seven High Standards. High Care. photos, in collage order.
STANDARDS_CARE_PHOTOS = [
    "20241128_CT40403.MP4.03_35_24_08.Still001-2.jpg",
    "DSC04681.jpg",
    "IMG_1323.jpg",
    "IMG_4021.jpg",
    "IMG_5168.jpg",
    "LaRedoute-Sep-OOH-JF-2.jpg",
    "London-Nov-3.jpg",
]


def build_standards_care_photos() -> None:
    for i, file in enumerate(STANDARDS_CARE_PHOTOS, start=1):
        im = ImageOps.exif_transpose(Image.open(STANDARDS_CARE / file)).convert("RGB")
        save(im, f"photos/hs-{i}", 800 if im.width >= im.height else 600)


def cylinder(im: Image.Image, radius: float) -> Image.Image:
    """Wraps flat lettering round a balloon: squeezes it towards the edges as if painted on a sphere."""
    w, h = im.size
    src = np.array(im)
    out = np.zeros_like(src)
    half = w / 2
    for x in range(w):
        d = x - half
        u = np.clip(d / radius, -0.999, 0.999)
        sx = int(round(half + radius * np.arcsin(u) * (half / (radius * np.arcsin(min(0.999, half / radius))))))
        out[:, x] = src[:, min(w - 1, max(0, sx))]
    return Image.fromarray(out)


def whiten(im: Image.Image) -> Image.Image:
    """Turns the lime lettering white (keeping its print texture and dark outline) for the lime balloon."""
    px = np.array(im).astype(float)
    r, g, b = px[..., 0], px[..., 1], px[..., 2]
    lime = (g > b + 35) & (g > 90)
    light = np.clip((r + g + b) / 3 / 200, 0, 1) ** 0.6 * 255
    for c in range(3):
        px[..., c] = np.where(lime, np.maximum(light, 215), px[..., c])
    return Image.fromarray(px.astype(np.uint8))


def build_together_stack() -> None:
    """TOGETHER with ONE TEAM, ALWAYS overlapping its bottom edge and in front, as laid out in the Together opener."""
    word = trim(Image.open(NEW_ASSETS / "together-only.png").convert("RGBA"))
    line = trim(Image.open(NEW_ASSETS / "one-team-always-only.png").convert("RGBA"))
    # Opener rects in PDF points: TOGETHER [160, 40, 470, 261], ONE TEAM, ALWAYS [172, 238, 458, 280].
    scale = 1000 / 310
    word = word.resize((1000, round(221 * scale)), Image.LANCZOS)
    line = line.resize((round(286 * scale), round(42 * scale)), Image.LANCZOS)
    canvas = Image.new("RGBA", (1000, round(240 * scale)), (0, 0, 0, 0))
    canvas.alpha_composite(word, (0, 0))
    canvas.alpha_composite(line, (round(12 * scale), round(198 * scale)))
    save(trim(canvas), "lettering/value-together", 900)


def build_balloon() -> None:
    """The balloon rig as stacked layers on one shared canvas, with the values painted on and the logo on the basket."""
    names = {
        "Left balloon no fire.png": "balloon-left",
        "right balloon no fire.png": "balloon-right",
        "fire-left.png": "balloon-fire-left",
        "fire-right.png": "balloon-fire-right",
        "wicker-basket.png": "balloon-basket",
    }
    layers = {key: Image.open(BALLOON / file).convert("RGBA") for file, key in names.items()}

    # fire-left carries a few stray pixels from the right burner: keep only its left half.
    left_fire = np.array(layers["balloon-fire-left"])
    left_fire[:, 421:, 3] = 0
    layers["balloon-fire-left"] = Image.fromarray(left_fire)

    # STANDARDS and CARE (the headline above carries HIGH), wrapped round each envelope.
    # Centres, widths and heights measured from the art; the envelopes are widest at y≈300.
    for key, word_file, cx, cy, width, white in (
        ("balloon-left", "standards-only.png", 221, 300, 340, False),
        ("balloon-right", "care-only.png", 630, 300, 270, True),
    ):
        art = trim(Image.open(NEW_ASSETS / word_file).convert("RGBA"))
        art = art.resize((width, round(art.height * width / art.width)), Image.LANCZOS)
        if white:
            art = whiten(art)
        art = cylinder(art, 230)
        layers[key].alpha_composite(art, (cx - art.width // 2, cy - art.height // 2))

    # A charcoal plaque with the Journey Further wordmark, hung on the front of the basket.
    basket = layers["balloon-basket"]
    draw = ImageDraw.Draw(basket)
    box = (226, 1030, 630, 1104)
    draw.rounded_rectangle(box, radius=14, fill=(54, 52, 54, 255), outline=(243, 236, 221, 255), width=4)
    font = ImageFont.truetype(str(FONT), 28)
    text = "JOURNEY FURTHER"
    l, t, r, b = draw.textbbox((0, 0), text, font=font)
    draw.text(((box[0] + box[2] - (r - l)) / 2 - l, (box[1] + box[3] - (b - t)) / 2 - t), text, font=font, fill=(255, 255, 255, 255))

    keys = list(layers)
    for key, im in zip(keys, union_trim([layers[k] for k in keys], pad=6)):
        save(im, f"illustrations/{key}", 843)


def build_new_art() -> None:
    """Art from the "new assets" folder, including the pieces that need splitting or pairing."""
    for file, (name, max_w) in NEW_SUPPLIED.items():
        im = Image.open(NEW_ASSETS / file)
        if name.startswith("photos/"):
            im = ImageOps.exif_transpose(im).convert("RGB")
            if file in NEW_CROP:
                im = im.crop(NEW_CROP[file])
        else:
            im = trim(im.convert("RGBA")) if im.mode in ("RGBA", "LA", "P") else im.convert("RGB")
        if file in FEATHER:
            im = feather(im)
        save(im, name, max_w)

    # Light switch off and on: one shared crop so they swap in place.
    off, on = union_trim([Image.open(NEW_ASSETS / f).convert("RGBA") for f in ("light-off-edit.png", "light-on-edit.png")])
    save(off, "illustrations/light-off", 900)
    save(on, "illustrations/light-on", 900)

    # "Under Pressure", whole and cracked. The cracked file is the same artwork on a smaller canvas.
    whole = Image.open(NEW_ASSETS / "under-presh-only.png").convert("RGBA")
    cracked = Image.open(NEW_ASSETS / "boots-&-crakcs-edit.png").convert("RGBA").resize(whole.size, Image.LANCZOS)
    whole, cracked = union_trim([whole, cracked])
    save(whole, "lettering/under-pressure", 1000)
    save(cracked, "lettering/under-pressure-cracked", 1000)

    # "We come together", lifted from the original pull graphic without the boot.
    px = np.array(Image.open(ASSETS / "under-pressure.png").convert("RGBA").crop((150, 40, 760, 520)))
    r, g, b = (px[..., i].astype(int) for i in range(3))
    px[..., 3][(b > r + 25) & (b > g + 15)] = 0
    solid = px[..., 3] > 20
    labels, count = ndimage.label(ndimage.binary_dilation(solid, iterations=3))
    sizes = ndimage.sum(solid, labels, range(1, count + 1))
    keep = np.isin(labels, [i + 1 for i, size in enumerate(sizes) if size > 0.2 * sizes.max()])
    # Keep the letters' own drop shadow, but not the boot's shadow that fell across it.
    near_letters = ndimage.binary_dilation(px[..., 3] > 200, iterations=12)
    px[..., 3][~keep | ~near_letters] = 0
    save(trim(Image.fromarray(px)), "lettering/we-come-together", 700)

    # The handshake pair, split at the gap between the two people, each on the shared canvas.
    pair = trim(Image.open(NEW_ASSETS / "handshake-3-edit.png").convert("RGBA"))
    empty = np.where((np.array(pair.getchannel("A")) > 20).sum(axis=0) == 0)[0]
    gap = int(empty[np.abs(empty - pair.width // 2).argmin()])
    for side in ("left", "right"):
        person = np.array(pair)
        if side == "left":
            person[:, gap:, 3] = 0
        else:
            person[:, :gap, 3] = 0
        save(Image.fromarray(person), f"illustrations/handshake-{side}", 900)
    print(f"handshake gap at {gap / pair.width:.4f} of the width")

    build_together_stack()
    build_balloon()
    build_standards_care_photos()

    # The founders' new painting, warped into the gold frame's opening.
    frame = Image.open(ASSETS / "gold-frame-founders.png").convert("RGBA")
    painting = Image.open(NEW_ASSETS / "Matt,Robin,Chris 5.png").convert("RGBA").crop(FOUNDERS_CROP)
    warped = painting.transform(frame.size, Image.PERSPECTIVE, perspective_coeffs(FRAME_OPENING, painting.size), Image.BICUBIC)
    # Drawn at 4x and scaled down, so the painting's edge is antialiased against the frame.
    mask = Image.new("L", (frame.width * 4, frame.height * 4), 0)
    ImageDraw.Draw(mask).polygon([(x * 4, y * 4) for x, y in FRAME_OPENING], fill=255)
    mask = mask.resize(frame.size, Image.LANCZOS)
    frame.paste(warped, (0, 0), mask)
    save(frame, "illustrations/gold-frame-founders", 1100)


# The Promise lettering sits on dark cards, where its pale face and pale lime/mint 3D shadow blur
# together. The shadow is deepened (same hue, darker) and a thin dark outline added, so the
# letters read; nothing is redrawn.
DEEPEN = {417: (70, 120, 20), 421: (24, 110, 92)}


def deepen(im: Image.Image, target: tuple[int, int, int]) -> Image.Image:
    px = np.array(im.convert("RGBA")).astype(float)
    hi = px[..., :3].max(axis=2)
    lo = px[..., :3].min(axis=2)
    shadow = (hi - lo) / np.maximum(hi, 1) > 0.28  # the coloured extrusion, not the pale face
    for c in range(3):
        px[..., c] = np.where(shadow, target[c] * (0.55 + 0.6 * hi / 255), px[..., c])
    solid = px[..., 3] > 40
    ring = ndimage.binary_dilation(solid, iterations=5) & ~solid
    out = np.zeros_like(px)
    out[ring] = (28, 27, 30, 255)
    base = Image.fromarray(out.astype(np.uint8))
    base.alpha_composite(Image.fromarray(np.clip(px, 0, 255).astype(np.uint8)))
    return base


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
        if xref in DEEPEN:
            im = deepen(im, DEEPEN[xref])
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
    elif "--new-only" in sys.argv:
        build_new_art()
    elif "--manifest-only" not in sys.argv:
        build_new_art()
        main()
    write_manifest()
