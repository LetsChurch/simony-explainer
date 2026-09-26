"""Scene cuts derived from the aligned narration (gen/words.json). Shared by build.py and mix.py."""
import json, re
WJ = json.load(open("gen/words.json"))
L = WJ["lines"]
def LE(i): return L[i]["e"]
def LS(i): return L[i]["s"]
def _k(w): return re.sub(r"[^a-z']", "", w.lower().replace("’", "'"))
def W(i, word, n=0, end=False):
    c = 0
    for x in L[i]["words"]:
        if _k(x["w"]) == word:
            if c == n: return x["e"] if end else x["s"]
            c += 1
    raise KeyError(f"{i} {word} {n}")
HARD, WIPE = 0.6, 1.25            # cut offsets after the last line of a scene
# scenes: S1 l1 | S2 l2-l3 | S3 l4 | S4 l5 | S5 l6 | S6 l7 | S7 l8-l9 | S8 l10 | S9 l11
CUTS = [round(v, 3) for v in (LE("l1") + HARD, LE("l3") + WIPE, LE("l4") + HARD, LE("l5") + HARD, LE("l6") + WIPE, LE("l7") + WIPE, LE("l9") + HARD, LE("l10") + WIPE)]
TOTAL = round(WJ["total"], 2)
WIPES = [CUTS[1], CUTS[4], CUTS[5], CUTS[7]]
