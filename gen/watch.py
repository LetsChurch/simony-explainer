import base64, json, os, sys, urllib.request
q, f = sys.argv[1], sys.argv[2]
model = os.environ.get("WATCH_MODEL", "~google/gemini-pro-latest")
b = base64.b64encode(open(f, "rb").read()).decode()
body = {"model": model, "messages": [{"role": "user", "content": [{"type": "text", "text": q}, {"type": "video_url", "video_url": {"url": "data:video/mp4;base64," + b}}]}]}
req = urllib.request.Request("https://openrouter.ai/api/v1/chat/completions", data=json.dumps(body).encode(),
    headers={"Authorization": "Bearer " + os.environ["OPENROUTER_API_KEY"], "Content-Type": "application/json"})
try: r = json.load(urllib.request.urlopen(req, timeout=900))
except urllib.error.HTTPError as e: print("HTTP", e.code, e.read().decode()[:1500]); sys.exit(1)
print(r["choices"][0]["message"]["content"]); print("cost", r.get("usage", {}).get("cost")); open(os.path.join(os.path.dirname(os.path.abspath(__file__)), "costs.tsv"), "a").write(f"review\t{os.path.basename(sys.argv[-1])}\t{r.get('usage',{}).get('cost',0)}\n")
