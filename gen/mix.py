"""Final audio mix: VO + ducked/EQ'd music + foley cues -> assets/audio/mix.wav (-14 LUFS, -1.5 dBTP)."""
import subprocess, json, numpy as np, os
EX = "gen/sfx/"
# name: (file, offset, length)
S = {
 "tick": ("tick-0", 0.0, 2.8), "pop": ("pop-0", 0.0, 0.25), "click": ("pop-2", 0.0, 0.08), "stamp": ("stamp-0", 1.03, 0.55),
 "swoosh": ("swoosh-0", 0.0, 0.5), "whistle": ("swoosh-2", 0.0, 0.8), "pluck": ("pluck-2", 0.0, 0.45), "tear": ("tear-0", 0.68, 0.85),
 "slap": ("slap-2", 1.49, 0.35), "flutter": ("flutter-0", 0.12, 0.8), "shake": ("flutter-2", 0.8, 1.4),
 "tape": ("tape-0", 0.33, 0.4), "tapeS": ("tape-2", 0.0, 0.2), "twinkle": ("twinkle-0", 0.0, 2.4), "chime": ("twinkle-2", 0.0, 1.5),
 "thud": ("thud-2", 2.12, 0.45), "scrape": ("chalk-1", 3.6, 0.35), "write": ("chalk-2", 0.0, 2.2), "crumple": ("crumple-0", 1.0, 1.0),
 "type": ("typewriter-1", 0.3, 1.8), "typeL": ("typewriter-1", 0.3, 0.65), "typeS": ("typewriter-1", 0.3, 0.42), "boing": ("boing-0", 0.0, 0.9), "snip": ("scissors-0", 0.0, 0.4),
}
C = []
TRIM = {"write": 0.63, "scrape": 0.63, "tape": 0.7, "tapeS": 0.75, "stamp": 0.75, "thud": 0.8}
def c(t, s, v): C.append((t, s, v * TRIM.get(s, 1.0)))
import sys; sys.path.insert(0, "gen")
from timing import W, LE, CUTS, TOTAL, WIPES
T = lambda i, w, n=0: W(i, w, n) - 0.06
B = [0] + CUTS + [TOTAL]
# S1 a forgotten sin
c(0.3, "swoosh", 0.25)
for w in ("never", "heard", "of"): c(T("l1", w), "write", 0.1)
c(T("l1", "simony") - 0.12, "tape", 0.5); c(T("l1", "simony"), "chime", 0.18); c(T("l1", "centuries") - 0.1, "pop", 0.4)
for w in ("few", "church", "widely"): c(T("l1", w) - 0.04, "slap", 0.35)
# S2 Acts 8
c(B[1], "slap", 0.3); c(B[1] + 0.15, "swoosh", 0.25); c(T("l2", "named") - 0.04, "slap", 0.4); c(T("l2", "simon") - 0.35, "swoosh", 0.3); c(T("l2", "simon"), "write", 0.12)
c(T("l2", "spirit") - 0.3, "flutter", 0.35); c(T("l2", "given"), "twinkle", 0.2); c(T("l2", "apostles'"), "write", 0.1); c(T("l2", "offered"), "chime", 0.14)
for i in range(3): c(W("l2", "money") - 0.1 + i * 0.07, "click", 0.3)
c(T("l3", "peter") - 0.04, "tapeS", 0.35); c(T("l3", "replied") - 0.1, "swoosh", 0.3); c(T("l3", "replied") + 0.15, "tapeS", 0.35)
c(W("l3", "perish"), "whistle", 0.14); c(W("l3", "perish") + 0.5, "thud", 0.2); c(W("l3", "god", end=True) - 0.05, "scrape", 0.22)
# wipes
for tc in WIPES: c(tc - 0.6, "tear", 0.3)
# S3 definition
c(T("l4", "thomas") - 0.3, "swoosh", 0.25); c(T("l4", "thomas") - 0.04, "slap", 0.4); c(T("l4", "classic"), "write", 0.12)
c(T("l4", "definition") - 0.05, "swoosh", 0.3); c(T("l4", "definition") + 0.2, "tapeS", 0.35)
for w, n in (("desire", 0), ("sell", 0), ("spiritual", 0), ("thing", 0)): c(W("l4", w, n, end=True) - 0.05, "scrape", 0.18)
# S4 something spiritual / annexed
c(B[3], "slap", 0.25); c(T("l5", "something") - 0.04, "slap", 0.4); c(T("l5", "not"), "write", 0.1)
for w in ("church", "sacraments", "prayer", "preaching", "teaching"): c(T("l5", w) - 0.04, "slap", 0.4); c(T("l5", w) + 0.02, "write", 0.08)
c(T("l5", "annexed") - 0.04, "slap", 0.4); c(T("l5", "joined"), "scrape", 0.2); c(T("l5", "joined") - 0.05, "pop", 0.35); c(W("l5", "joined") + 0.2, "tapeS", 0.35); c(T("l5", "office's"), "write", 0.12)
# S5 buy or sell / desire
c(B[4], "slap", 0.25); c(T("l6", "both") - 0.04, "slap", 0.4); c(T("l6", "buyer") - 0.3, "swoosh", 0.3); c(T("l6", "seller") - 0.3, "swoosh", 0.3)
c(T("l6", "guilty") - 0.02, "stamp", 0.5); c(T("l6", "guilty") + 0.12, "stamp", 0.45); c(T("l6", "and", 1), "swoosh", 0.22)
c(T("l6", "begins") - 0.04, "slap", 0.4); c(T("l6", "sin") - 0.05, "pop", 0.4); c(T("l6", "will"), "write", 0.12); c(T("l6", "whether"), "write", 0.12)
# S6 history
c(B[5] + 0.1, "write", 0.08)
for w in ("church", "medieval", "reformation"): c(T("l7", w) - 0.25, "swoosh", 0.22)
for w in ("fathers", "schoolmen", "reformation"): c(T("l7", w) + 0.02, "tapeS", 0.35)
c(T("l7", "condemned"), "write", 0.12); c(T("l7", "defined"), "write", 0.12); c(T("l7", "itself"), "write", 0.08)
c(T("l7", "dispute") - 0.04, "slap", 0.45); c(T("l7", "dispute"), "write", 0.12); c(T("l7", "sale") - 0.08, "pop", 0.35); c(T("l7", "sale") + 0.15, "chime", 0.12); c(T("l7", "spiritual") - 0.04, "slap", 0.4)
# S7 support, not a price
c(T("l8", "ministers") - 0.3, "swoosh", 0.25); c(T("l8", "supported"), "write", 0.12); c(T("l8", "yes") - 0.02, "stamp", 0.5)
c(W("l8", "yes", end=True) - 0.05, "swoosh", 0.3); c(W("l8", "yes", end=True) + 0.2, "tapeS", 0.35)
c(T("l8", "but"), "swoosh", 0.25); c(T("l8", "but") + 0.4, "tapeS", 0.3); c(T("l8", "not") - 0.03, "scrape", 0.3)
c(T("l9", "from") - 0.1, "swoosh", 0.22); c(T("l9", "people") - 0.35, "swoosh", 0.25); c(T("l9", "minister") - 0.05, "scrape", 0.2); c(T("l9", "honor"), "write", 0.12); c(T("l9", "not"), "write", 0.12)
c(T("l9", "god") - 0.04, "slap", 0.4); c(T("l9", "god") + 0.1, "twinkle", 0.2); c(T("l9", "employer"), "write", 0.12); c(T("l9", "receives", 1) - 0.05, "scrape", 0.2); c(T("l9", "wages"), "write", 0.12)
# S8 today
for w in ("selling", "theological", "instruction"): c(T("l10", w) - 0.04, "slap", 0.4); c(T("l10", w) + 0.25, "tapeS", 0.3)
c(T("l10", "multibillion"), "write", 0.14); c(T("l10", "what") - 0.35, "swoosh", 0.25); c(T("l10", "what") - 0.12, "tape", 0.4); c(W("l10", "reformation", end=True), "scrape", 0.2)
# S9 the book
c(B[8], "slap", 0.3); c(max(B[8] + 0.2, T("l11", "the") - 0.1), "pop", 0.35); c(T("l11", "the") + 0.1, "tape", 0.5); c(T("l11", "simony"), "write", 0.12); c(T("l11", "by"), "write", 0.1)
c(T("l11", "read") - 0.04, "slap", 0.4); c(T("l11", "free") - 0.04, "slap", 0.4); c(W("l11", "free", end=True) + 0.11, "slap", 0.35)
c(T("l11", "simony", 1) - 0.04, "slap", 0.5); c(T("l11", "simony", 1) + 0.06, "chime", 0.2); c(W("l11", "info", end=True) - 0.7, "flutter", 0.3); c(LE("l11") + 0.4, "twinkle", 0.18)

# ---- music: smooth ducking envelope from known VO line windows ----
import wave
lines = json.load(open("gen/vo-lines.json"))["lines"]
sr = 48000
raw = subprocess.run(["ffmpeg","-loglevel","error","-i","assets/audio/music.mp3","-f","s16le","-ac","2","-ar",str(sr),"-"],capture_output=True).stdout
m = np.frombuffer(raw, np.int16).astype(np.float32).reshape(-1,2)/32768
n = int(TOTAL*sr); m = m[:n] if len(m) >= n else np.pad(m, ((0,n-len(m)),(0,0)))
wins = []
for L in lines:
    a, b = L["start"] - 0.18, L["end"] + 0.30
    if wins and a - wins[-1][1] < 0.7: wins[-1][1] = b
    else: wins.append([a, b])
t = np.arange(n)/sr
duck = np.zeros(n)
for a, b in wins:
    up = np.clip((t - a)/0.22, 0, 1); dn = np.clip((b - t)/0.45, 0, 1)
    duck = np.maximum(duck, np.minimum(up, dn))
duck = 0.5 - 0.5*np.cos(np.pi*duck)          # smoothstep
base_db, duck_db = -13.5, -8.5
g = 10**((base_db + duck_db*duck)/20)
out = (m * g[:,None])
w = wave.open("gen/music-ducked.wav","wb"); w.setnchannels(2); w.setsampwidth(2); w.setframerate(sr)
w.writeframes((np.clip(out,-1,1)*32767).astype(np.int16).tobytes()); w.close()
print("duck windows", [(round(a,2),round(b,2)) for a,b in wins])

def peak(f, off, ln):
    raw = subprocess.run(["ffmpeg","-loglevel","error","-ss",str(off),"-t",str(ln),"-i",EX+f+".mp3","-f","s16le","-ac","1","-ar","44100","-"],capture_output=True).stdout
    a = np.frombuffer(raw, np.int16).astype(float)/32768
    return max(np.abs(a).max(), 1e-4)
gain = {k: 0.5 / peak(*v) for k, v in S.items()}   # normalize every cue to -6 dBFS peak
inputs = ["-i", "assets/audio/vo.wav", "-i", "gen/music-ducked.wav"]
for k, (f, off, ln) in S.items():
    inputs += ["-i", EX + f + ".mp3"]
keys = list(S.keys())
fl = []
fl.append(f"[1]atrim=0:{TOTAL},asetpts=PTS-STARTPTS,equalizer=f=3000:width_type=o:width=1.6:g=-4.5,equalizer=f=250:width_type=o:width=1:g=-1.5,afade=t=in:st=0:d=0.05,aformat=channel_layouts=stereo[duck]")
fl.append("[0]highpass=f=80,equalizer=f=250:width_type=q:width=1.0:g=-1,highshelf=f=8000:g=1.5,acompressor=threshold=0.1:ratio=2.5:attack=8:release=120:makeup=1.3,aformat=channel_layouts=stereo[vo]")
# group cue occurrences per sound via asplit
from collections import defaultdict
occ = defaultdict(list)
for t, s, v in C: occ[s].append((t, v))
labels = []
for k, lst in occ.items():
    idx = keys.index(k) + 2
    f, off, ln = S[k]
    fl.append(f"[{idx}]atrim={off}:{off+ln},asetpts=PTS-STARTPTS,afade=t=out:st={max(0,ln-0.08):.3f}:d=0.08,aformat=channel_layouts=stereo,asplit={len(lst)}" + "".join(f"[{k}{j}]" for j in range(len(lst))))
    for j, (t, v) in enumerate(lst):
        ms = int(round(t * 1000))
        fl.append(f"[{k}{j}]volume={gain[k]*v:.4f},adelay={ms}|{ms}[{k}d{j}]")
        labels.append(f"[{k}d{j}]")
fl.append("".join(labels) + f"amix=inputs={len(labels)}:normalize=0,highpass=f=120,lowpass=f=10000,aecho=0.9:0.5:18|31:0.14|0.09,alimiter=limit=0.38:attack=2:release=60:level=disabled,volume=0.88[sfx]")
fl.append(f"[vo][duck][sfx]amix=inputs=3:normalize=0,apad=whole_dur={TOTAL},atrim=0:{TOTAL},afade=t=out:st={TOTAL-1.2}:d=1.2:curve=qsin[pre]")
open("gen/mix_filter.txt", "w").write(";\n".join(fl))
subprocess.run(["ffmpeg","-y","-loglevel","error",*inputs,"-filter_complex_script","gen/mix_filter.txt","-map","[pre]","-ar","48000","-c:a","pcm_s24le","gen/premix.wav"],check=True)
# two-pass loudnorm
r = subprocess.run(["ffmpeg","-i","gen/premix.wav","-af","loudnorm=I=-14:TP=-1.5:LRA=11:print_format=json","-f","null","-"],capture_output=True,text=True).stderr
j = json.loads(r[r.rindex("{"):r.rindex("}")+1])
af = f"loudnorm=I=-14:TP=-1.5:LRA=11:measured_I={j['input_i']}:measured_TP={j['input_tp']}:measured_LRA={j['input_lra']}:measured_thresh={j['input_thresh']}:offset={j['target_offset']}:linear=true"
subprocess.run(["ffmpeg","-y","-loglevel","error","-i","gen/premix.wav","-af",af,"-ar","48000","-c:a","pcm_s16le","assets/audio/mix.wav"],check=True)
print("cues", len(C), "premix I", j["input_i"])
