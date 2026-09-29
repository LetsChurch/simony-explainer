# Measure the price tag's writable body (past the eyelet, inside the paper border) from its alpha mask.
# Usage: python3 gen/measure_tag.py assets/img/price-tag.webp proof.png  -> JSON used as TAG_BODY in the film JS.
import numpy as np, json, sys
from PIL import Image
from scipy import ndimage as nd
im = np.array(Image.open(sys.argv[1]).convert("RGBA")).astype(float)
H, W = im.shape[:2]
a = im[..., 3] > 128
# remove the string loop: morphological opening with a disc wider than the rope
r = 45
yy, xx = np.mgrid[-r:r+1, -r:r+1]; disc = xx**2 + yy**2 <= r*r
body = nd.binary_opening(a, structure=disc)
lab, n = nd.label(body); sizes = nd.sum(body, lab, range(1, n+1)); body = lab == (np.argmax(sizes) + 1)
# fill the eyelet hole so PCA sees the solid body
solid = nd.binary_fill_holes(body)
ys, xs = np.nonzero(solid); pts = np.stack([xs, ys], 1).astype(float)
c = pts.mean(0); cov = np.cov((pts - c).T); ev, evec = np.linalg.eigh(cov); u = evec[:, 1]  # long axis
if u[0] < 0: u = -u  # point down-right (away from eyelet end at top-left)
v = np.array([-u[1], u[0]])
s = (pts - c) @ u; t = (pts - c) @ v
# eyelet hole: holes = solid & ~alpha
hole = solid & ~a; hy, hx = np.nonzero(hole)
hs = ((np.stack([hx, hy], 1) - c) @ u)
eyelet_far = hs.max()
# measure the eyelet ring (darker washer) roughly: add its radius margin
# width profile along axis
bins = np.arange(np.floor(s.min()), np.ceil(s.max()) + 1, 4)
prof = []
for b0 in bins:
    m = (s >= b0) & (s < b0 + 4)
    if m.sum(): prof.append((b0, t[m].min(), t[m].max()))
prof = np.array(prof)
fullw = np.median(prof[:, 2] - prof[:, 1])
# rectangular part: where width >= 97% of full width, and past eyelet washer
rect = prof[(prof[:, 2] - prof[:, 1] >= 0.97 * fullw)]
s0 = max(rect[:, 0].min(), eyelet_far + 0.06 * fullw); s1 = rect[:, 0].max() + 4
sel = prof[(prof[:, 0] >= s0) & (prof[:, 0] <= s1)]
t0 = sel[:, 1].max(); t1 = sel[:, 2].min()  # inscribed across
# inset the white sticker border + ink line (~4% of width)
border = 0.05 * fullw
s0b, s1b, t0b, t1b = s0 + border*0, s1 - border, t0 + border, t1 - border
cs, ct = (s0b + s1b) / 2, (t0b + t1b) / 2
C = c + cs * u + ct * v
ang = np.degrees(np.arctan2(u[1], u[0]))
out = dict(w=W, h=H, cx=C[0] / W, cy=C[1] / H, angle=ang, len=(s1b - s0b) / W, wid=(t1b - t0b) / W,
           centroid=[c[0] / W, c[1] / H], eyelet_far=float(eyelet_far))
print(json.dumps(out))
# proof
from PIL import ImageDraw
pr = Image.open(sys.argv[1]).convert("RGBA"); bg = Image.new("RGBA", pr.size, (0, 150, 0, 255)); bg.alpha_composite(pr)
d = ImageDraw.Draw(bg)
corn = [c + s_ * u + t_ * v for s_, t_ in [(s0b, t0b), (s1b, t0b), (s1b, t1b), (s0b, t1b)]]
d.polygon([tuple(p) for p in corn], outline=(255, 0, 0, 255), width=4)
d.ellipse([C[0]-8, C[1]-8, C[0]+8, C[1]+8], fill=(255, 0, 0, 255))
bg.convert("RGB").save(sys.argv[2])
