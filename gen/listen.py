#!/usr/bin/env python3
"""usage: listen.py "question" file1 [file2 ...] -- sends audio files to an audio-capable LLM"""
import base64, json, os, sys, urllib.request, subprocess
q = sys.argv[1]; files = sys.argv[2:]
model = os.environ.get("LISTEN_MODEL", "~google/gemini-pro-latest")
content = [{"type": "text", "text": q}]
for i, f in enumerate(files):
    mp3 = f if f.endswith(".mp3") else f + ".tmp.mp3"
    if mp3 != f: subprocess.run(["ffmpeg","-y","-loglevel","error","-i",f,"-b:a","128k",mp3], check=True)
    content.append({"type": "text", "text": f"Sample {i+1}: {os.path.basename(f)}"})
    content.append({"type": "input_audio", "input_audio": {"data": base64.b64encode(open(mp3,"rb").read()).decode(), "format": "mp3"}})
    if mp3 != f: os.remove(mp3)
body = {"model": model, "messages": [{"role": "user", "content": content}]}
req = urllib.request.Request("https://openrouter.ai/api/v1/chat/completions", data=json.dumps(body).encode(),
    headers={"Authorization": "Bearer " + os.environ["OPENROUTER_API_KEY"], "Content-Type": "application/json"})
try:
    r = json.load(urllib.request.urlopen(req, timeout=600))
except urllib.error.HTTPError as e:
    print("HTTP", e.code, e.read().decode()[:1500]); sys.exit(1)
print(r["choices"][0]["message"]["content"]); print("cost", r.get("usage",{}).get("cost")); open(os.path.join(os.path.dirname(os.path.abspath(__file__)), "costs.tsv"), "a").write(f"review\t{os.path.basename(sys.argv[-1])}\t{r.get('usage',{}).get('cost',0)}\n")
