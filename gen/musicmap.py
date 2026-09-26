import subprocess, numpy as np, sys
f = sys.argv[1]; end = float(sys.argv[2]) if len(sys.argv) > 2 else 1e9
sr = 22050
raw = subprocess.run(["ffmpeg","-loglevel","error","-i",f,"-f","s16le","-ac","1","-ar",str(sr),"-"],capture_output=True).stdout
a = np.frombuffer(raw, np.int16).astype(float)/32768
hop, win = 512, 2048
fr = np.array([np.abs(np.fft.rfft(a[i:i+win]*np.hanning(win))) for i in range(0, len(a)-win, hop)])
freqs = np.fft.rfftfreq(win, 1/sr); fps = sr/hop
low = fr[:, freqs < 150].sum(1); high = fr[:, freqs > 5000].sum(1); tot = fr.sum(1)+1e-9
flux = np.maximum(0, np.diff(np.log1p(fr), axis=0)).sum(1); flux = np.r_[0, flux]
hf = np.maximum(0, np.diff(np.log1p(fr[:, freqs > 3000]), axis=0)).sum(1); hf = np.r_[0, hf]
dur = min(len(a)/sr, end)
# tempo from flux autocorr (whole)
seg = flux - flux.mean(); ac = np.correlate(seg, seg, 'full')[len(seg)-1:]
lags = np.arange(len(ac))/fps; m = (lags > 60/170) & (lags < 60/70)
bpm = 60/lags[m][np.argmax(ac[m])]
print(f"dur {len(a)/sr:.1f}s  bpm~{bpm:.1f}")
print(" t   rms  lowdB hfFlux(drums)")
for t in np.arange(0, dur, 2):
    i0, i1 = int(t*fps), int((t+2)*fps)
    s = a[int(t*sr):int((t+2)*sr)]
    rms = 20*np.log10(np.sqrt(np.mean(s**2))+1e-9)
    print(f"{t:4.0f} {rms:5.0f} {20*np.log10(low[i0:i1].mean()+1e-9):6.0f} {hf[i0:i1].mean():6.1f} " + "#"*int(hf[i0:i1].mean()/4))
