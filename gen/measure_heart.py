# Heart outline for arrow targeting: polar radii (fractions of image width/height) from the image centre,
# 72 directions (5 deg steps, 0 = +x, clockwise in screen space), from the alpha mask of assets/img/heart.webp.
import numpy as np, json, sys
from PIL import Image
a = np.array(Image.open(sys.argv[1]).convert("RGBA"))[..., 3] > 128
H, W = a.shape; cx, cy = W / 2, H / 2
R = []
for k in range(72):
    t = np.radians(k * 5); r = 0.0
    for s in np.arange(0, max(W, H), 0.5):
        x, y = int(cx + s * np.cos(t)), int(cy + s * np.sin(t))
        if x < 0 or y < 0 or x >= W or y >= H: break
        if a[y, x]: r = s
    R.append(r)
# express as normalised offsets so non-uniform box scaling stays exact
pts = [[round(r * np.cos(np.radians(k * 5)) / W, 4), round(r * np.sin(np.radians(k * 5)) / H, 4)] for k, r in enumerate(R)]
print(json.dumps(pts, separators=(",", ":")))
