"""Forced alignment of known script text to audio (torchaudio MMS_FA, CTC).
Needs torch + torchaudio (run in a venv).  usage:
  python gen/align.py words            -> aligns gen/vo-final/<id>.wav to gen/lines.json, writes gen/words.json (absolute times via gen/vo-lines.json)
  python gen/align.py take file.mp3 "text"  -> prints word times for one clip"""
import json, re, subprocess, sys
import numpy as np, torch, torchaudio
B = torchaudio.pipelines.MMS_FA
MODEL = B.get_model(); DICT = B.get_dict(); SR = B.sample_rate
def load(path):
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", path, "-f", "f32le", "-ac", "1", "-ar", str(SR), "-"], capture_output=True, check=True).stdout
    return torch.from_numpy(np.frombuffer(raw, np.float32).copy())[None]
def words_of(text):
    out = []
    for raw in text.replace("-", " ").replace("—", " ").split():
        norm = "".join(ch for ch in raw.lower().replace("’", "'") if ch in DICT and ch != "-")
        if norm: out.append((raw, norm))
    return out
def align(path, text):
    wav = load(path); ws = words_of(text)
    with torch.inference_mode():
        em, _ = MODEL(wav)
    tokens = [DICT[c] for _, n in ws for c in n]
    ali, scores = torchaudio.functional.forced_align(em, torch.tensor([tokens], dtype=torch.int32), blank=0)
    spans = torchaudio.functional.merge_tokens(ali[0], scores[0].exp())
    ratio = wav.shape[1] / em.shape[1] / SR
    out, k = [], 0
    for raw, n in ws:
        sp = spans[k:k + len(n)]; k += len(n)
        out.append({"w": raw, "s": round(sp[0].start * ratio, 3), "e": round(sp[-1].end * ratio, 3)})
    return out
if __name__ == "__main__":
    if sys.argv[1] == "take":
        for x in align(sys.argv[2], sys.argv[3]): print(x)
    else:
        lines = {l["id"]: l["text"] for l in json.load(open("gen/lines.json"))}
        lay = json.load(open("gen/vo-lines.json"))
        res = {}
        for L in lay["lines"]:
            ws = align(f"gen/vo-final/{L['id']}.wav", lines[L["id"]])
            res[L["id"]] = {"s": L["start"], "e": L["end"], "words": [{"w": x["w"], "s": round(L["start"] + x["s"], 3), "e": round(L["start"] + x["e"], 3)} for x in ws]}
        json.dump({"total": lay["total"], "lines": res}, open("gen/words.json", "w"), indent=1, ensure_ascii=False)
        for k, v in res.items(): print(k, " ".join(f"{x['w']}@{x['s']:.2f}" for x in v["words"]))
