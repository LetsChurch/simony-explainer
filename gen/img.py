#!/usr/bin/env python3
"""Generate one image via OpenRouter Image API. usage: img.py out.png "prompt" [--model m] [--aspect 1:1] [--bg transparent|opaque] [--quality high] [--ref path ...]"""
import argparse, base64, json, os, sys, urllib.request, time
p = argparse.ArgumentParser()
p.add_argument("out"); p.add_argument("prompt")
p.add_argument("--model", default="openai/gpt-image-2.5-flare")
p.add_argument("--aspect", default="1:1")
p.add_argument("--bg", default="transparent")
p.add_argument("--quality", default="high")
p.add_argument("--ref", nargs="*", default=[])
p.add_argument("--res", default=None)
a = p.parse_args()
key = os.environ["OPENROUTER_API_KEY"]
body = {"model": a.model, "prompt": a.prompt, "aspect_ratio": a.aspect, "n": 1}
if a.model.startswith("openai/"):
    body["quality"] = a.quality
    if a.bg: body["background"] = a.bg
    body["output_format"] = "png"
if a.res: body["resolution"] = a.res
if a.ref:
    refs = []
    for r in a.ref:
        b = base64.b64encode(open(r, "rb").read()).decode()
        refs.append({"type": "image_url", "image_url": {"url": "data:image/png;base64," + b}})
    body["input_references"] = refs
req = urllib.request.Request("https://openrouter.ai/api/v1/images", data=json.dumps(body).encode(),
    headers={"Authorization": "Bearer " + key, "Content-Type": "application/json"})
t = time.time()
try:
    resp = json.load(urllib.request.urlopen(req, timeout=600))
except urllib.error.HTTPError as e:
    print("HTTP", e.code, e.read().decode()[:2000]); sys.exit(1)
imgs = resp.get("data") or []
if not imgs:
    print(json.dumps(resp)[:2000]); sys.exit(1)
open(a.out, "wb").write(base64.b64decode(imgs[0]["b64_json"]))
u = resp.get("usage", {})
open(os.path.join(os.path.dirname(__file__), "costs.tsv"), "a").write(f"img\t{a.out}\t{u.get('cost', 0)}\n")
print(f"ok {a.out} {time.time()-t:.0f}s cost={u.get('cost')}")
