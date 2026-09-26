# Prompts to recreate this video

These are the prompts that produced the *Doctrine of Simony* paper explainer. They were run in Claude Code with the HyperFrames
skills installed and an OpenRouter key in `.env` (`OPENROUTER_API_KEY`). OpenRouter spend was $1.75 (see `README.md`). It reused the
pipeline and lessons of the Dorean Principle explainer (`videos/dorean-principle`).

## 1. Consolidated prompt (recreates the film)

```text
Create a video using /hyperframes: a whimsical, hand-made paper-collage stop-motion explainer for Conley Owens's book
"The Doctrine of Simony: A Theological Retrieval and Appraisal" (https://simony.info — the whole book is online and public domain).
Read the book first and explain its case clearly and fairly; it's an explainer, not a story. Only claim what the book supports.
Plan and make the whole thing autonomously. Quality is paramount.

Format and style
- 4K (3840x2160), 30 fps, authored at 1920x1080 inside a CSS zoom-2 wrapper. One master MP4, no proxies, no portrait version.
- The same paper-collage look as the Dorean Principle explainer: stop-motion on twos, boiling ink lines, cutout jitter, grain,
  torn-paper wipes, handwriting that writes on (hidden until it starts).
- Use the book's own branding from simony.info: parchment #EAE5D2, rubric red #B9281D, gilt #BB8C3F, lapis #455A63, ink #201D18;
  Cormorant SC for the title (as on the cover), EB Garamond for quotes. No mascot.
- Cut Peter and Simon Magus out of the cover's public-domain painting and use them in the Acts 8 scene with a white sticker border;
  use a faint fragment of the cover's Decretum plate behind the history scene. All other art: new gpt-image cut-paper assets in the palette.
- Scripture cards and paper cards sized to their measured text with even padding; diagrams computed from measured boxes;
  the title lockup ("The Doctrine of" over SIMONY) built as one measured unit on a fitted torn strip.

Narration (male, Gemini TTS "Sadaltager" for consistency with the Dorean video; 3 takes per line, pick with an AI listener;
key answer lines must end with firm, falling intonation — verify with a pitch contour). Scripture is BSB, checked against biblehub:
 1. Most Christians have never heard of simony. Yet for centuries, few sins in the church were more widely discussed.
 2. It's named for Simon the sorcerer, who saw the Spirit given through the apostles' hands, and offered them money.
 3. Peter replied, "May your silver perish with you, because you thought you could buy the gift of God with money!"
 4. Thomas Aquinas gave the classic definition: simony is an earnest desire to buy or sell something spiritual, or something annexed to a spiritual thing.
 5. Something spiritual: not just church offices, but sacraments, prayer, preaching, and teaching. Annexed: things joined to them, like an office's income.
 6. Both buyer and seller are guilty. And the sin begins in the will, whether or not money changes hands.
 7. Church fathers condemned it. Medieval schoolmen defined it. And the Reformation itself began in a dispute over the sale of spiritual things.
 8. So may ministers be supported? Yes: the worker is worthy of his wages. But support is not a price.
 9. From the people, the minister receives honor, not a price for his labor. From God, his true employer, he receives his wages.
10. Today, selling theological instruction is a multibillion-dollar industry. What new reformation awaits a church that learns again to discern this sin?
11. The Doctrine of Simony, by Conley Owens. Read it free at simony dot info.

Timing and sound
- Force-align the known script to the final narration locally (torchaudio MMS_FA) and key every reveal to its word, landing just before it.
- Every animation finishes and holds at least 0.6 s before each torn-paper wipe.
- Lyria music bed (plucked, lightly medieval, ~92 BPM), leading silence trimmed, ducked under the voice; paper foley; -14 LUFS master.

Deliverables
- The 4K master, a paper-collage YouTube thumbnail (1280x720 JPG + 1920 + 4K PNG), a YouTube title/description with chapters from the
  real line timings (YOUTUBE.md), README with a Cost section, BRIEF.md and this PROMPTS.md.
- Own git repo, committed as "Ken Powers <ken@lets.church>" (author and committer), not pushed. Max OpenRouter spend: $9.
```

## 2. Original prompts (verbatim)

> When that is complete, have a new agent work on a Simony video, based on Conley Owen's new book: https://simony.info/
>
> You can plan and do the entire video autonomously and let me know when the first draft is ready. 4k, no proxies, no need for a portrait version yet (that will come later)

> You don't need to cap it at $3, cap it at $9
