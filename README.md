# The Doctrine of Simony — paper-collage explainer

A 110-second, 4K, hand-made paper-collage stop-motion explainer for *The Doctrine of Simony: A Theological Retrieval and Appraisal* by Conley Owens ([simony.info](https://simony.info)), built with [HyperFrames](https://hyperframes.heygen.com).

- **Alternate joke take (branch `alt/repent`):** `renders/simony-4k-repent.mp4` (118.0 s), with a "repent, sinners" scene before the end card — see BRIEF.md
- **Render:** `renders/simony-4k.mp4` (3840×2160 @ 30 fps, 109.6 s, audio -14.1 LUFS). No proxy copies, no portrait version yet.
- **YouTube thumbnail:** `renders/youtube-thumbnail-1280.jpg` (upload this one), `-1920.jpg`, `-4k.png`. Source: `thumbnail/index.html` (re-export with `cd thumbnail && npx hyperframes snapshot --at 0.5 --no-end`)
- **YouTube title & description:** `YOUTUBE.md`
- **Brief:** `BRIEF.md` · **Prompts to recreate it:** `PROMPTS.md`

## Cost
Total OpenRouter spend for this video: **$1.75** (logged per call in `gen/costs.tsv`; cap was $9).

| Item | Calls | Spend |
|---|---|---|
| Cut-paper images (gpt-image-2.5) | 22 | $1.08 |
| Narration (Gemini 3.8 Flash TTS "Sadaltager": 3 takes per line + line 1 retake) | 36 | $0.09 |
| Music (Lyria 3 Pro, two takes) | 2 | $0.16 |
| AI audio/video reviews (voice picks, music pick, draft review, spot checks) | 11 | $0.41 |

Rendering, mixing, forced alignment and sound effects (CC0, freesound.org) cost nothing.

Scripture quotations are from the BSB (Berean Standard Bible).

## Layout
- `src/index.src.html`, `src/film.js` — composition source (`src/film.js` is assembled from `gen/film-head.js` helpers + `gen/film-scenes.js` + `gen/film-tail.js`). `index.html` is built by `python3 gen/build.py`, which injects the aligned word times, scene cuts and cutout aspect ratios
- `assets/img/` — cut-paper art (WebP), the public-domain Peter and Simon Magus cutouts from the cover painting, parchment/vellum/lapis textures, the Decretum fragment, the cover; `assets/fonts/` — EB Garamond, Cormorant SC, Caveat, Inter, UnifrakturMaguntia
- `assets/audio/` — `vo.wav` (narration), `music.mp3` (Lyria take B), `mix.wav` (final mix)
- `gen/` — `assets.py` + `img.py` (art), `prep.py` (trim/WebP, sticker borders, tints, ratios), `tts_any.py` + `tts_batch.py` + `vo_build.py` (narration; takes in `vo/`, `vo2/`), `align.py` (local forced alignment → `words.json`), `timing.py` (scene cuts), `pitch.py` (declarative-intonation check), `lyria.py` (music), `mix.py` (mix), `listen.py` / `watch.py` (AI review), `costs_fill.py` (cost log), `lines.json` (script), `source/` (files captured from simony.info), `sfx/` (CC0 paper foley)

## Rebuild
```bash
python3 gen/prep.py
python3 gen/vo_build.py
python gen/align.py words        # needs torch + torchaudio (venv)
python3 gen/mix.py
python3 gen/build.py
npx hyperframes lint
npx hyperframes render --quality high --fps 30 --output renders/simony-4k.mp4
# the renderer lands ~1 dB under the mix, so put the -14 LUFS mix back on the master (video stream copied):
ffmpeg -i renders/simony-4k.mp4 -i assets/audio/mix.wav -map 0:v -map 1:a -c:v copy -c:a aac -b:a 320k -shortest -movflags +faststart out.mp4
```
The generation and review scripts read `OPENROUTER_API_KEY` from the environment. Keys are not stored here.
