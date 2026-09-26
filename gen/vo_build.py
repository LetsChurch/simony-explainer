"""Trim the chosen takes, lay them out with gaps -> assets/audio/vo.wav + gen/vo-lines.json"""
import json, subprocess
PICK = {"l1": "vo2/l1b", "l2": "vo/l2c", "l3": "vo/l3b", "l4": "vo/l4b", "l5": "vo/l5b", "l6": "vo/l6b", "l7": "vo/l7b", "l8": "vo/l8b", "l9": "vo/l9b", "l10": "vo/l10cb", "l11": "vo/l11c"}
# l10 = take c's first sentence (full "instruction") + take b's question, spliced in the pause (gen/vo/l10cb.mp3)
# hard cuts need ~0.9 s, torn-paper wipes ~1.6 s so every animation holds >= 0.6 s before the sheet covers it
GAP_AFTER = {"l1": 0.9, "l2": 0.45, "l3": 1.6, "l4": 0.9, "l5": 0.9, "l6": 1.6, "l7": 1.6, "l8": 0.55, "l9": 0.9, "l10": 1.6}
START, TAIL = 0.7, 3.2
lines = json.load(open("gen/lines.json"))
t, out, parts = START, [], []
for l in lines:
    src = f"gen/{PICK[l['id']]}.mp3"; dst = f"gen/vo-final/{l['id']}.wav"
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", src, "-af",
        "silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.05,areverse,silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.08,areverse",
        "-ar", "48000", "-ac", "1", dst], check=True)
    d = float(subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", dst]))
    out.append({"id": l["id"], "start": round(t, 3), "end": round(t + d, 3)}); parts.append((dst, t))
    t += d + GAP_AFTER.get(l["id"], 0)
total = round(t + TAIL, 2)
inputs = sum([["-i", p] for p, _ in parts], [])
fc = "".join(f"[{i}]adelay={int(s * 1000)}|{int(s * 1000)}[d{i}];" for i, (_, s) in enumerate(parts))
fc += "".join(f"[d{i}]" for i in range(len(parts))) + f"amix=inputs={len(parts)}:normalize=0,apad,atrim=0:{total}[o]"
subprocess.run(["ffmpeg", "-v", "error", "-y", *inputs, "-filter_complex", fc, "-map", "[o]", "-ar", "48000", "assets/audio/vo.wav"], check=True)
json.dump({"total": total, "lines": out}, open("gen/vo-lines.json", "w"), indent=1)
print("total", total); [print(o) for o in out]
