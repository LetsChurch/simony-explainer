---
workflow: general-video
flow: automation
storyboard: no
message: "Simony, the buying or selling of spiritual things, is a forgotten sin. The Doctrine of Simony retrieves its classic definition and asks what it means today: ministry should be supported, not sold."
destination: website
aspect: 3840x2160
language: en
length: 109.6s
narration: yes (male)
---

## Intent
A whimsical, hand-made paper-collage stop-motion explainer for *The Doctrine of Simony: A Theological Retrieval and Appraisal*
by Conley Owens, in the same art direction as the Dorean Principle explainer, recoloured to the book's manuscript palette.
It explains the book's case clearly and fairly. It's an explainer, not a story. No mascot.

## Sources
- https://simony.info/ (the full book online: blurb, introduction, definition chapters 3–6, ministerial maintenance chapters 7–9, Part VI analysis, conclusion)
- Scripture is quoted from the BSB (Berean Standard Bible), checked against biblehub.com's BSB text: Acts 8:20, Luke 10:7, Matthew 10:8.
- The classic definition is Thomas Aquinas's (Summa Theologiae II‑II, q. 100, a. 1), as the book gives it.

## Beats (one scene per narration beat; every reveal keyed to a force-aligned word)
1. A forgotten sin: puzzled modern churchgoers, the title lockup on a fitted torn strip, a stack of old books with canon law / the schoolmen / Reformation confessions tags.
2. Acts 8: the cover painting's Peter and Simon Magus (public domain) as cutouts; the Spirit descends as a dove; Simon offers money; Peter's rebuke (Acts 8:20) revealed word by word; the coins fall on "perish".
3. The classic definition: Thomas Aquinas and the definition card, its four clauses underlined in four colours.
4. Something spiritual (church offices, sacraments, prayer, preaching, teaching) and something annexed (an office's income, taped to the mitre).
5. To buy or sell (buyer and seller both stamped GUILTY) and an earnest desire (the sin begins in the will).
6. The fathers condemned it, the schoolmen defined it, and the Reformation began over the sale of spiritual things (indulgences, 1517), over a faint fragment of Gratian's Decretum.
7. Support, not a price: Luke 10:7; honor from the people, wages from God, his true employer (diagram computed from the measured cutouts and GOD card).
8. Today: Christian books, conferences, seminaries — a multibillion-dollar industry; the book's question, "What new reformation awaits a church that learns again to discern this sin?"
9. End card: the cover, the lockup with its subtitle, by Conley Owens, Read it / Free / Public domain, simony.info, Matthew 10:8.

## Production
- Voice: Gemini 3.8 Flash TTS "Sadaltager" (same as the Dorean Principle video), 3 takes per line, picked with the AI listener; line 1 rephrased so "discussed" isn't swallowed; line 10 spliced from two takes (take c's first sentence, take b's question) because take b clipped "instruction". Declarative answer lines checked with a pitch contour (they end 3–10 semitones below the line median).
- Timing: local forced alignment (torchaudio MMS_FA) of the known script against the final narration; reveals land ~60 ms before their words; wipes sit 1.25 s after a scene's last line, so animations hold before the sheet covers them.
- Music: Lyria 3 Pro take B (pizzicato, lute, soft reeds, ~92 BPM), ducked under the voice.
- Art: gpt-image-2.5 transparent cut-paper assets in the site's palette (parchment #EAE5D2, rubric red #B9281D, gilt #BB8C3F, lapis #455A63, ink #201D18); Peter and Simon Magus cut from the cover's public-domain painting (Liberale da Verona, attrib., ca. 1470–75, Fitzwilliam Museum) with a white sticker border; the Decretum fragment from the cover plate (Walters Ms. W.133, public domain). Paper textures, tape and tears reused from the Dorean repo.
- Type: Cormorant SC (title, as on the cover), EB Garamond (quotes, the site's text face), Caveat (handwriting), Inter.
- Rendered at 3840x2160, 30 fps, authored at 1920x1080 with CSS zoom 2; the -14 LUFS mix is remuxed onto the master.

## Notes
- The book is dedicated to the public domain (CC0); its cover combines two public-domain artworks.
- "A multibillion-dollar industry" is the book's own phrase for theological education (Christian books and seminaries), Chapter 14.
