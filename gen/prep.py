"""Cut-paper PNGs -> trimmed WebP (+ white sticker border on the painted cutouts); tinted parchment textures, wipe sheets, cover + manuscript fragment."""
import glob, os, json
import numpy as np
from PIL import Image, ImageFilter
O = "assets/img/"
RATIO = {}
def sticker(im, px):
    """paste a white paper border (dilated alpha) under a painted cutout, like the generated art has"""
    a = im.split()[3].point(lambda v: 255 if v > 40 else 0)
    big = Image.new("L", (im.width + 4 * px, im.height + 4 * px), 0); big.paste(a, (2 * px, 2 * px))
    d = big.filter(ImageFilter.MaxFilter(2 * px + 1)).filter(ImageFilter.GaussianBlur(1.2)).point(lambda v: 255 if v > 110 else 0)
    base = Image.new("RGBA", big.size, (250, 247, 238, 0)); base.putalpha(d)
    base.paste(im, (2 * px, 2 * px), im)
    return base
for f in sorted(glob.glob("gen/assets/*.png")):
    n = os.path.basename(f)[:-4]
    im = Image.open(f).convert("RGBA")
    if n.endswith("-raw"):
        n = n[:-4]; im = sticker(im, 9)
    a = np.array(im)[:, :, 3]; a[a < 12] = 0
    im = im.crop(Image.fromarray(a).getbbox())
    m = 1100
    if max(im.size) > m: im.thumbnail((m, m), Image.LANCZOS)
    im.save(O + n + ".webp", quality=90, method=6); RATIO[n] = round(im.height / im.width, 3)
for n in ("price-tag", "tape", "tear-cream"):
    im = Image.open(O + n + ".webp"); RATIO[n] = round(im.height / im.width, 3)
json.dump(RATIO, open("gen/ratio.json", "w"), indent=0)
print(RATIO)
def tint(src, dst, rgb):
    im = Image.open(src).convert("RGBA"); arr = np.array(im).astype(np.float32)
    lum = (0.299 * arr[..., 0] + 0.587 * arr[..., 1] + 0.114 * arr[..., 2]) / 255.0
    lum = lum / max(np.percentile(lum[arr[..., 3] > 0], 60), 1e-3)
    out = np.clip(np.array(rgb, np.float32)[None, None, :] * lum[..., None], 0, 255)
    Image.fromarray(np.dstack([out, arr[..., 3:4]]).astype(np.uint8), "RGBA").save(dst, quality=90, method=6)
tint(O + "paper-bg.webp", O + "parch-bg.webp", (234, 229, 210))       # the site's parchment #eae5d2
tint(O + "paper-bg.webp", O + "vellum-bg.webp", (222, 211, 178))      # a warmer, older page
tint(O + "paper-bg.webp", O + "lapis-bg.webp", (62, 82, 91))          # slate lapis #455a63, darkened
tint(O + "paper-bg.webp", O + "rubric-bg.webp", (150, 36, 28))        # rubric red for the end card accents
tint(O + "sheet-cream.webp", O + "sheet-parch.webp", (234, 229, 210))
tint(O + "sheet-cream.webp", O + "sheet-red.webp", (185, 40, 29))
tint(O + "sheet-cream.webp", O + "sheet-lapis.webp", (69, 90, 99))
cv = Image.open("gen/source/cover.webp").convert("RGB"); cv.save(O + "cover.jpg", quality=92)
# the cover's background plate is Gratian's Decretum (Walters Ms. W.133, public domain): keep a fragment with the Causa 1 initial
pl = Image.open("gen/source/cover-plate.webp").convert("RGB"); pl.crop((0, 0, 1400, 760)).save(O + "decretum.jpg", quality=90)
print("ok")
