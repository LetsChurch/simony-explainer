"""Cut-paper art in the book's manuscript palette (gpt-image-2.5, transparent). usage: python3 gen/assets.py [names...]"""
import subprocess, os, sys, concurrent.futures as cf
S = ("Whimsical handmade paper cutout collage illustration: layered cut construction paper with visible fibrous torn and scissor-cut edges, "
     "subtle paper grain texture, a thin white paper border around the whole cutout like a sticker, hand-drawn dark ink linework and details, "
     "light pencil hatching for shading. Charming premium editorial collage style, like a handmade stop-motion film prop, with a gentle medieval illuminated-manuscript flavour. "
     "Palette: parchment cream (#EAE5D2), rubric red (#B9281D), gilt gold (#BB8C3F), slate lapis blue (#455A63), warm ink brown-black (#201D18), small touches of muted green. ")
O = "ONLY ONE OBJECT, nothing else in the image (no people, no characters, no flowers, no decorations): "
T = " Isolated single subject on a transparent background, no drop shadow, no text, no letters, no words, no numbers."
F = ("a friendly simple paper-doll style character with a round face, simple black dot eyes, rosy cheeks and a small kind smile, ")
R = "Using the reference image only for the character art style (same paper-doll proportions, face style, paper textures and white sticker border), draw "
A = [
 ("aquinas", S + F + "a medieval Dominican friar scholar: white habit with a black cloak and hood, tonsured hair, a small gold sun emblem on his chest, holding a large open book in one arm and a quill in the other hand, full body, standing, three-quarter view facing right." + T, [], "2:3"),
 ("churchgoers", S + R + F.replace("character", "characters") + "three modern churchgoers standing close together (a man in a sweater, a woman in a cardigan, a young man in a hoodie), each looking puzzled, one scratching his head, one shrugging, full bodies, facing forward." + T, ["gen/assets/aquinas.png"], "3:2"),
 ("father", S + R + F + "an early church father bishop from late antiquity: simple cream and red robes with a white pallium stole marked with small red crosses, a gold halo disc behind his head, holding a shepherd's crozier staff, full body, standing, three-quarter view facing right." + T, ["gen/assets/aquinas.png"], "2:3"),
 ("reformer", S + R + F + "a 16th-century Augustinian friar and professor in a plain black habit, short dark hair, holding up a folded letter sealed with a red wax seal, full body, standing, three-quarter view facing left." + T, ["gen/assets/aquinas.png"], "2:3"),
 ("minister", S + R + F + "a Reformed pastor in a black Geneva preaching gown with white preaching bands at the collar, holding an open Bible, full body, standing, three-quarter view facing left." + T, ["gen/assets/aquinas.png"], "2:3"),
 ("givers", S + R + F.replace("character", "characters") + "three friendly churchgoers (a man, a woman and a girl) in simple modern clothes, the man holding out a woven basket of bread and fruit as a warm gift, smiling, full bodies, three-quarter view facing right." + T, ["gen/assets/aquinas.png"], "3:2"),
 ("tomes", S + O.replace("ONLY ONE OBJECT", "ONLY ONE STACK") + "a tall stack of five medieval leather-bound books with brass corner fittings and clasps, red and slate blue covers, a rolled parchment scroll with a red ribbon lying on top." + T, [], "2:3"),
 ("dove", S + O + "a single white paper dove descending with wings raised, facing down-left, a thin gilt gold outline." + T, [], "1:1"),
 ("purse", S + O + "a single small medieval leather money pouch tied with a cord, a few gilt gold coins spilling out in front of it." + T, [], "1:1"),
 ("mitre", S + O + "a single bishop's mitre hat in rubric red with gilt gold trim and a small gold cross, two short ribbons hanging at the back." + T, [], "1:1"),
 ("chalice", S + O.replace("ONLY ONE OBJECT", "ONLY THESE TWO OBJECTS") + "a gilt gold communion chalice and a small round loaf of bread beside it on a tiny cream cloth." + T, [], "1:1"),
 ("praying", S + O + "a single pair of hands pressed together in prayer, simple cream sleeve cuffs at the wrists, a few small ink devotion lines above the fingertips." + T, [], "2:3"),
 ("pulpit", S + O + "a single medieval carved wooden pulpit with an open book resting on it and a rubric red cloth hanging over the front with a small gold cross." + T, [], "2:3"),
 ("codex", S + O + "a single open illuminated manuscript book with a large rubric red decorated initial capital on the left page and neat rows of ink scribble lines (illegible, not letters), gilt gold border." + T, [], "3:2"),
 ("hand-coins", S + O + "a single hand reaching in from the left side, palm up, offering three gilt gold coins, a slate blue sleeve cuff at the wrist, the wrist cut off at the left edge." + T, [], "3:2"),
 ("hand-dove", S + O + "a single hand reaching in from the right side, holding a small white paper dove in its open palm, a rubric red sleeve cuff at the wrist, the wrist cut off at the right edge." + T, [], "3:2"),
 ("heart", S + O + "a single rubric red paper heart with a gilt gold coin tucked into its centre, like a coin inside the heart." + T, [], "1:1"),
 ("indulgence", S + O + "a single medieval indulgence certificate: a parchment sheet covered in rows of illegible ink scribble lines (not letters), a large red initial squiggle at the top left, and a round red wax seal hanging from a cord at the bottom." + T, [], "3:4"),
 ("coffer", S + O + "a single wooden treasure coffer bound with dark iron straps, lid open, heaped with gilt gold coins." + T, [], "1:1"),
 ("ticket", S + O + "a single paper admission ticket in cream and rubric red with a perforated tear-off stub and small decorative star shapes, blank with no printing." + T, [], "16:9"),
 ("gradcap", S + O + "a single slate blue graduation mortarboard cap with a gilt gold tassel resting on a small stack of two books." + T, [], "1:1"),
 ("books", S + O.replace("ONLY ONE OBJECT", "ONLY ONE STACK") + "a small stack of three modern hardcover theology books with cloth spines in slate blue, rubric red and cream, blank spines with no lettering." + T, [], "1:1"),
]
only = set(sys.argv[1:])
def run(n, p, ref, ar):
    out = f"gen/assets/{n}.png"
    if os.path.exists(out) or (only and n not in only): return n + " skip"
    c = ["python3", "gen/img.py", out, p, "--aspect", ar, "--bg", "transparent"] + (["--ref", *ref] if ref else [])
    r = subprocess.run(c, capture_output=True, text=True); return n + " " + (r.stdout + r.stderr).strip()[-100:]
first = [a for a in A if a[0] == "aquinas"]
rest = [a for a in A if a[0] != "aquinas"]
for a in first: print(run(*a), flush=True)
with cf.ThreadPoolExecutor(4) as ex:
    for r in ex.map(lambda a: run(*a), rest): print(r, flush=True)
