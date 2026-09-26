import base64, json, os, sys, urllib.request
out, prompt = sys.argv[1], sys.argv[2]
model = sys.argv[3] if len(sys.argv) > 3 else "google/lyria-3-pro-preview"
body = {"model": model, "messages": [{"role": "user", "content": prompt}], "modalities": ["text", "audio"], "audio": {"format": "wav"}, "stream": True}
req = urllib.request.Request("https://openrouter.ai/api/v1/chat/completions", data=json.dumps(body).encode(),
    headers={"Authorization": "Bearer " + os.environ["OPENROUTER_API_KEY"], "Content-Type": "application/json"})
chunks, text, usage, fmt = [], [], None, None
try: r = urllib.request.urlopen(req, timeout=900)
except urllib.error.HTTPError as e: print("HTTP", e.code, e.read().decode()[:1500]); sys.exit(1)
for line in r:
    line = line.decode().strip()
    if not line.startswith("data:"): continue
    d = line[5:].strip()
    if d == "[DONE]": break
    try: j = json.loads(d)
    except Exception: continue
    if j.get("usage"): usage = j["usage"]
    for c in j.get("choices", []):
        delta = c.get("delta", {})
        a = delta.get("audio")
        if a:
            if a.get("data"): chunks.append(a["data"])
            if a.get("transcript"): text.append(a["transcript"])
            if a.get("format"): fmt = a["format"]
        if delta.get("content"): text.append(delta["content"])
raw = base64.b64decode("".join(chunks)) if chunks else b""
open(out, "wb").write(raw)
open(os.path.join(os.path.dirname(__file__), "costs.tsv"), "a").write(f"lyria\t{out}\t{(usage or {}).get('cost', 0)}\n")
print("bytes", len(raw), "fmt", fmt, "head", raw[:4], "usage", usage)
print("text:", "".join(text)[:800])
