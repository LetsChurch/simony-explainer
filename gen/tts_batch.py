"""Generate missing narration takes (3 per line) with Sadaltager; retries on rate limits."""
import json, subprocess, time, os, sys
BASE = "warm, friendly, upbeat, confident narrator with a smile; clear and natural, like a charming hand-made animated explainer; unhurried but lively"
SPECIAL = {
 "l3": "warm narrator quoting the apostle Peter's stern rebuke with gravity and conviction; the quote is firm and indignant, not shouted; clear and natural",
 "l6": "warm, confident narrator stating firm facts; declarative, falling intonation on each sentence; clear and natural",
 "l8": "warm, confident narrator; asks the question lightly, then answers 'Yes' firmly and plainly; every statement ends with a firm, falling, declarative intonation",
 "l9": "warm, confident narrator stating settled truths; firm, declarative, falling intonation at the end of each sentence; unhurried",
 "l10": "warm, thoughtful narrator; first sentence a plain, sobering statement; the closing question is sincere and hopeful",
}
outdir = sys.argv[1] if len(sys.argv) > 1 else "gen/vo"
takes = sys.argv[2] if len(sys.argv) > 2 else "abc"
only = set(sys.argv[3].split(",")) if len(sys.argv) > 3 else None
texts = {l["id"]: l["text"] for l in json.load(open("gen/lines.json"))}
if os.path.exists(outdir + "/texts.json"): texts.update(json.load(open(outdir + "/texts.json")))
styles = dict(SPECIAL)
if os.path.exists(outdir + "/styles.json"): styles.update(json.load(open(outdir + "/styles.json")))
for i, t in texts.items():
    if only and i not in only: continue
    st = styles.get(i, BASE)
    opt = json.dumps({"google-ai-studio": {"speech_metadata": {"style": st}}, "google-vertex": {"speech_metadata": {"style": st}}})
    for k in takes:
        out = f"{outdir}/{i}{k}.mp3"
        if os.path.exists(out): continue
        for attempt in range(8):
            r = subprocess.run(["python3", "gen/tts_any.py", out, "google/gemini-3.8-flash-tts", "Sadaltager", t, opt], capture_output=True, text=True)
            if os.path.exists(out): print(out, "ok", flush=True); break
            print(out, "retry", (r.stdout + r.stderr)[-80:].strip(), flush=True); time.sleep(20)
        time.sleep(3.2)
