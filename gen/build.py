import os
# render size from the build: HF_SIZE=720p|1080p|4k (default 4k) sets root data-width/height and the #z zoom
_Z = {"720p": 2 / 3, "1080p": 1, "4k": 2}[os.environ.get("HF_SIZE", "4k")]
def sized(html, w, h):
    return html.replace(f'data-width="{w * 2}" data-height="{h * 2}"', f'data-width="{round(w * _Z)}" data-height="{round(h * _Z)}"').replace("zoom: 2;", f"zoom: {_Z:.6g};")
import json, sys
sys.path.insert(0, "gen")
from timing import CUTS, TOTAL, WJ
RATIO = json.load(open("gen/ratio.json"))
s = open("src/index.src.html").read()
js = open("src/film.js").read()
js = js.replace("/*WORDS*/null", json.dumps(WJ, ensure_ascii=False)).replace("/*CUTS*/null", json.dumps(CUTS)).replace("/*TOTAL*/0", str(TOTAL)).replace("/*RATIO*/null", json.dumps(RATIO))
b = [0] + CUTS + [TOTAL]
secs = "".join(f'        <section id="s{i+1}" class="clip scene" data-start="{b[i]}" data-duration="{round(b[i+1]-b[i], 3)}" data-track-index="1"></section>\n' for i in range(len(b) - 1))
s = s.replace("<!--SECTIONS-->\n", secs).replace("{TOTAL}", str(TOTAL))
s = s.replace('<script src="assets/film.js"></script>', "<script>\n" + js + "\n</script>")
open("index.html", "w").write(sized(s, 1920, 1080))
print("built", len(s), "cuts", CUTS, "total", TOTAL)
