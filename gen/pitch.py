"""Pitch contour of a word's voiced core (male voice): falling vs rising check.  usage: python3 gen/pitch.py l8:wages l9:wages ..."""
import json, subprocess, sys, numpy as np
WJ = json.load(open("gen/words.json"))
def track(path, a, b, sr=16000):
    raw = subprocess.run(["ffmpeg","-v","error","-ss",str(max(0,a)),"-t",str(b-a),"-i",path,"-f","f32le","-ac","1","-ar",str(sr),"-"],capture_output=True).stdout
    x = np.frombuffer(raw, np.float32); hop, win = 160, 800; out = []
    for i in range(0, len(x) - win, hop):
        s = x[i:i+win] - x[i:i+win].mean(); rms = np.sqrt((s**2).mean())
        zcr = np.mean(np.abs(np.diff(np.sign(s)))) / 2
        if rms < 0.015 or zcr > 0.12: out.append(np.nan); continue          # unvoiced / fricative
        d = np.array([np.mean((s[:-k] - s[k:])**2) for k in range(1, sr//60)])  # YIN difference
        cm = d * np.arange(1, len(d)+1) / np.maximum(np.cumsum(d), 1e-9)
        lo = sr//260; k = lo + np.argmin(cm[lo:]); out.append(sr/(k+1) if cm[k] < 0.35 else np.nan)
    f = np.array(out); v = f[~np.isnan(f)]
    if len(v): med = np.median(v); f = np.where(f > 1.6*med, f/2, f); f = np.where(f < med/1.6, f*2, f)
    return f
for arg in sys.argv[1:]:
    lid, w = arg.split(":")
    L = WJ["lines"][lid]; ws = [x for x in L["words"] if w in x["w"].lower()][-1]
    f = track(f"gen/vo-final/{lid}.wav", ws["s"] - L["s"], ws["e"] - L["s"] + 0.08)
    v = f[~np.isnan(f)]
    if len(v) < 5: print(arg, "too few voiced frames"); continue
    n = len(v); a, b = np.median(v[:max(2, n//3)]), np.median(v[-max(2, n//3):])
    print(f"{arg:14} voiced {n:3d}  first-third {a:6.1f} Hz  last-third {b:6.1f} Hz  change {b-a:+6.1f}  -> {'FALL' if b < a - 4 else ('RISE' if b > a + 6 else 'level')}")

def line_rel(lid, w):
    """final word's median pitch relative to its line's median (semitones); declarative ends sit at/below the line median"""
    L = WJ["lines"][lid]; ws = [x for x in L["words"] if w in x["w"].lower()][-1]
    full = track(f"gen/vo-final/{lid}.wav", 0, L["e"] - L["s"]); fv = full[~np.isnan(full)]
    f = track(f"gen/vo-final/{lid}.wav", ws["s"] - L["s"], ws["e"] - L["s"] + 0.08); v = f[~np.isnan(f)]
    if len(v) < 3: return None
    return 12 * np.log2(np.median(v) / np.median(fv)), len(v)
