import sys, glob, os
from PIL import Image, ImageDraw
files = sorted(sys.argv[2:]); out = sys.argv[1]
cell = 360; cols = 6; rows = (len(files)+cols-1)//cols
sheet = Image.new("RGB", (cols*cell, rows*(cell+24)), (70,110,170))
d = ImageDraw.Draw(sheet)
for i,f in enumerate(files):
    im = Image.open(f).convert("RGBA"); im.thumbnail((cell-10, cell-10))
    x = (i%cols)*cell; y = (i//cols)*(cell+24)
    # checker-ish bg: mid blue so white borders show
    sheet.paste(im, (x+5+(cell-10-im.width)//2, y+5+(cell-10-im.height)//2), im)
    d.text((x+6, y+cell+4), os.path.basename(f), fill=(255,255,255))
sheet.save(out, quality=85)
