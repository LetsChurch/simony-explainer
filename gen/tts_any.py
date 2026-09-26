"""usage: tts_any.py out.mp3 model voice "text" [json provider options]"""
import json, os, sys, urllib.request, subprocess
out, model, voice, text = sys.argv[1:5]
body = {"model": model, "input": text, "voice": voice, "response_format": "mp3"}
if len(sys.argv) > 5: body["provider"] = {"options": json.loads(sys.argv[5])}
if model.startswith("google/"): body["response_format"] = "pcm"
req = urllib.request.Request("https://openrouter.ai/api/v1/audio/speech", data=json.dumps(body).encode(),
    headers={"Authorization": "Bearer " + os.environ["OPENROUTER_API_KEY"], "Content-Type": "application/json"})
try: r = urllib.request.urlopen(req, timeout=300)
except urllib.error.HTTPError as e: print(out, "ERR", e.code, e.read().decode()[:300]); sys.exit(1)
d = r.read()
open(os.path.join(os.path.dirname(os.path.abspath(__file__)), "costs.tsv"), "a").write(f"tts\t{out}\t{r.headers.get('x-generation-id') or r.headers.get('X-Generation-Id') or ''}\n")
if body["response_format"] == "pcm":
    open(out + ".pcm", "wb").write(d)
    subprocess.run(["ffmpeg","-y","-loglevel","error","-f","s16le","-ar","24000","-ac","1","-i",out+".pcm","-b:a","160k",out],check=True); os.remove(out+".pcm")
else: open(out, "wb").write(d)
print(out, "ok", len(d))
