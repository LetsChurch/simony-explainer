"""Resolve TTS generation ids in gen/costs.tsv to their dollar cost (OpenRouter /generation), then print totals by kind."""
import json, os, urllib.request, collections, time
rows = [l.rstrip("\n").split("\t") for l in open("gen/costs.tsv") if l.strip()]
out = []
for r in rows:
    k, name, v = (r + ["", ""])[:3]
    if v.startswith("gen-"):
        cost = None
        for _ in range(3):
            try:
                req = urllib.request.Request("https://openrouter.ai/api/v1/generation?id=" + v, headers={"Authorization": "Bearer " + os.environ["OPENROUTER_API_KEY"]})
                d = json.load(urllib.request.urlopen(req, timeout=60))["data"]; cost = d.get("total_cost") or d.get("usage") or 0; break
            except Exception as e: time.sleep(2)
        v = str(cost if cost is not None else v)
    out.append((k, name, v))
open("gen/costs.tsv", "w").write("".join(f"{a}\t{b}\t{c}\n" for a, b, c in out))
tot = collections.defaultdict(float); cnt = collections.Counter()
for k, _, v in out:
    try: tot[k] += float(v); cnt[k] += 1
    except ValueError: pass
for k in tot: print(f"{k}\t{cnt[k]}\t${tot[k]:.3f}")
print(f"TOTAL\t${sum(tot.values()):.3f}")
