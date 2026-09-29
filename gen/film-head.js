/* The Doctrine of Simony — paper-collage explainer. One paused timeline, fully seek-safe.
   (stop-motion helpers carried over from the earlier paper films)
   Motion language: stop-motion "on twos" (12fps holds) for props & characters,
   8fps boil on ink lines + cutout jitter, smooth only for the slow camera drift. */
(function () {
  const TOTAL = /*TOTAL*/0;
  const tl = gsap.timeline({ paused: true });
  const $ = (s) => document.querySelector(s);
  const $$ = (s) => Array.from(document.querySelectorAll(s));

  // ---------- deterministic helpers ----------
  function rng(seed) {
    let s = seed >>> 0;
    return function () {
      s = (s + 0x6d2b79f5) >>> 0;
      let t = s;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  const E = (n) => gsap.parseEase(n);
  const lerp = (a, b, p) => a + (b - a) * p;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

  // step-sampled animation: one tl.set per frame (true stop-motion holds)
  function anim(el, t0, dur, fn, fps) {
    fps = fps || 12;
    const n = Math.max(1, Math.round(dur * fps));
    for (let i = 0; i <= n; i++) tl.set(el, fn(i / n), t0 + (i * dur) / n);
  }
  function hide(el, t) { tl.set(el, { opacity: 0 }, t || 0); }

  // pop in from nothing with overshoot (origin set by CSS)
  function pop(el, t, o) {
    o = o || {};
    const d = o.d || 0.42, r = o.r || 0, from = o.from == null ? 0 : o.from;
    const ez = E(o.ease || "back.out(2.4)");
    hide(el);
    anim(el, t, d, (p) => ({ opacity: p > 0 ? 1 : 0, scale: lerp(from, 1, ez(p)), rotation: lerp(r - 10, r, ez(p)) }), o.fps || 12);
  }
  // drop from above & squash on landing (origin bottom)
  function drop(el, t, o) {
    o = o || {};
    const h = o.h || 900;
    hide(el);
    tl.set(el, { opacity: 1, y: -h }, t);
    anim(el, t, 0.26, (p) => ({ y: -h * (1 - E("power2.in")(p)) }), 24);
    anim(el, t + 0.27, 0.34, (p) => {
      const s = Math.sin(Math.PI * clamp(p * 1.6, 0, 1)) * (1 - p);
      return { scaleY: 1 - 0.16 * s, scaleX: 1 + 0.12 * s, y: -26 * Math.sin(Math.PI * clamp((p - 0.45) / 0.55, 0, 1)) };
    }, 12);
  }
  // rise from below (origin bottom)
  function rise(el, t, o) {
    o = o || {};
    const h = o.h || 500, d = o.d || 0.5;
    hide(el);
    anim(el, t, d, (p) => ({ opacity: p > 0 ? 1 : 0, y: h * (1 - E("back.out(1.7)")(p)) }), 12);
  }
  function hop(el, t, h, d) {
    d = d || 0.4;
    anim(el, t, d, (p) => ({ y: -(h || 40) * Math.sin(Math.PI * p) }), 12);
  }
  // inner jitter: the ".j" wrapper of a cutout boils like hand-placed paper
  function jitter(el, t0, t1, amp, seed, fps) {
    const r = rng(seed || 1);
    fps = fps || 8;
    amp = amp == null ? 1 : amp;
    const n = Math.floor((t1 - t0) * fps);
    for (let i = 0; i <= n; i++) tl.set(el, { x: (r() - 0.5) * 3 * amp, y: (r() - 0.5) * 3 * amp, rotation: (r() - 0.5) * 1.1 * amp }, t0 + i / fps);
  }
  function jit(sel, t0, t1, amp, seed) { $$(sel + " > .j").forEach((j, k) => jitter(j, t0, t1, amp, (seed || 1) * 31 + k)); }

  function draw(sel, t, dur, fps) {
    (typeof sel === "string" ? $$(sel) : [sel]).forEach((p) => {
      const L = Math.ceil(p.getTotalLength ? p.getTotalLength() : 1000) + 2;
      const dashed = p.style.strokeDasharray;
      if (dashed) {
        // dashed path: reveal by growing a mask-like dashoffset trick is messy — fade-step instead
        hide(p);
        anim(p, t, dur, (q) => ({ opacity: q > 0 ? 1 : 0, attr: { "stroke-dashoffset": 0 } }), fps || 12);
        return;
      }
      p.setAttribute("stroke-dasharray", L + " " + L);
      tl.set(p, { attr: { "stroke-dashoffset": L } }, 0);
      anim(p, t, dur, (q) => ({ attr: { "stroke-dashoffset": L * (1 - E("power1.inOut")(q)) } }), fps || 12);
    });
  }
  // left-to-right write-on for handwriting blocks
  function writeOn(el, t, dur) {
    tl.set(el, { clipPath: "inset(-30% 100% -30% -5%)", opacity: 0 }, 0);
    tl.set(el, { opacity: 1 }, t + 0.01);
    anim(el, t, dur, (p) => ({ clipPath: `inset(-30% ${(100 - 105 * p).toFixed(1)}% -30% -5%)` }), 12);
  }
  function words(sel, times, o) {
    o = o || {};
    $$(sel).forEach((w, i) => {
      if (times[i] == null) return;
      hide(w);
      anim(w, times[i], 0.25, (p) => ({ opacity: p > 0 ? 1 : 0, y: (o.dy || 34) * (1 - E("back.out(2)")(p)), rotation: (o.rot || 4) * (1 - p) }), 12);
    });
  }
  function typeify(root) {
    const spans = [];
    (function walk(node) {
      Array.from(node.childNodes).forEach((c) => {
        if (c.nodeType === 3) {
          const frag = document.createDocumentFragment();
          for (const ch of c.textContent) {
            const s = document.createElement("span");
            s.textContent = ch;
            frag.appendChild(s);
            spans.push(s);
          }
          node.replaceChild(frag, c);
        } else if (c.nodeType === 1) walk(c);
      });
    })(root);
    return spans;
  }
  function typeOut(root, t0, cps) {
    const spans = typeify(root);
    spans.forEach((s, i) => tl.set(s, { opacity: 1 }, t0 + i / cps));
    return t0 + spans.length / cps;
  }
  function mk(parent, cls, css, html) {
    const d = document.createElement("div");
    d.className = cls;
    Object.assign(d.style, css || {});
    if (html != null) d.innerHTML = html;
    parent.appendChild(d);
    return d;
  }
  const CHECK = (c, s) => `<svg viewBox="0 0 24 24" width="${s}" height="${s}" style="display:block"><path d="M4 13 L9.5 18.5 L20 6" fill="none" stroke="${c}" stroke-width="3.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  const BANG = (c, s) => `<svg viewBox="0 0 24 24" width="${s}" height="${s}" style="display:block"><path d="M12 4 L12 14" fill="none" stroke="${c}" stroke-width="3.8" stroke-linecap="round"/><circle cx="12" cy="19.5" r="2.2" fill="${c}"/></svg>`;

  // sticky notes
  const NOTE_COLORS = ["#f7d774", "#f4a9a0", "#f6c28b", "#bfd9ea", "#d5cbef", "#cfe3c4", "#f7d774"];
  const NOTE_TEXT = ["ALERT!", "review?", "flag #4821", "!!", "urgent", "check ID", "velocity?", "mismatch", "new device", "charge-back", "KYC?", "sanctions hit?", "$$$ ??", "odd login", "PEP?", "dispute", "SAR due", "false alarm?", "help!", "2FA fail", "geo jump", "limit ↑", "again??", "hmm…", "ALERT!", "who's this?", "review!", "flag", "urgent!!", "sus"];
  function note(parent, n) {
    const el = mk(parent, "note", { left: n.x - n.w / 2 + "px", top: n.y - n.w / 2 + "px", width: n.w + "px", height: n.w + "px" });
    const f = mk(el, "face", { backgroundColor: n.color, fontSize: Math.round(n.w * (n.fs || 0.19)) + "px" });
    f.innerHTML = `<span style="display:block;transform:rotate(${n.trot || -3}deg)">${n.text}</span>`;
    tl.set(el, { rotation: n.rot }, 0);
    return el;
  }
  function slap(el, t, rot) {
    hide(el);
    anim(el, t, 0.12, (p) => ({ opacity: p > 0 ? 1 : 0, scale: lerp(1.45, 1, p), rotation: rot + 14 * (1 - p) }), 24);
    anim(el, t + 0.13, 0.12, (p) => ({ scale: 1 + 0.035 * Math.sin(Math.PI * p) }), 24);
  }
  function coverLayout() {
    const r = rng(4821);
    const out = [];
    let k = 0;
    for (let row = 0; row < 4; row++)
      for (let c = 0; c < 7; c++) {
        out.push({
          x: c * 300 + 60 + (r() - 0.5) * 30, y: row * 300 + 90 + (r() - 0.5) * 30, w: 404, rot: (r() - 0.5) * 22,
          color: NOTE_COLORS[Math.floor(r() * 6)], text: NOTE_TEXT[k++ % NOTE_TEXT.length], trot: (r() - 0.5) * 10, fs: 0.2, ord: r(),
        });
      }
    return out.sort((a, b) => a.ord - b.ord);
  }

  // ransom chips
  function chip(parent, c) {
    const el = mk(parent, "chip", { left: c.x + "px", top: c.y + "px", width: c.w + "px", height: c.h + "px" });
    const f = mk(el, "face", { backgroundColor: c.bg, color: c.fg, fontFamily: c.font, fontSize: c.size + "px", paddingTop: (c.pt || 0) + "px" }, c.ch);
    if (c.tape) { const tp = document.createElement("img"); tp.src = "assets/img/tape.webp"; Object.assign(tp.style, { position: "absolute", width: Math.round(c.w * 0.62) + "px", left: Math.round(c.w * 0.19) + "px", top: "-18px", transform: `rotate(${c.tape}deg)`, opacity: "0.9" }); el.appendChild(tp); }
    tl.set(el, { rotation: c.rot || 0 }, 0);
    return el;
  }
  function chipIn(el, t, rot) {
    hide(el);
    anim(el, t, 0.16, (p) => ({ opacity: p > 0 ? 1 : 0, scale: lerp(2.1, 1, E("power2.in")(p)), rotation: rot - 22 * (1 - p) }), 24);
    anim(el, t + 0.17, 0.16, (p) => ({ scale: 1 - 0.06 * Math.sin(Math.PI * p) }), 24);
  }

  // torn-paper wipe passing through the frame; cover window centred on tCut
  function wipe(el, halfW, tCut, dir, dur) {
    dur = dur || 1.2;
    const total = halfW * 2;
    el.style.width = total + "px";
    Array.from(el.querySelectorAll("img")).forEach((i) => (i.style.width = halfW + "px"));
    tl.set(el, { x: -6000 }, 0);
    const wr = rng(Math.round(tCut * 100));
    anim(el, tCut - dur / 2, dur, (p) => {
      const x = -total - 40 + p * (total + 2000);
      return { x: dir > 0 ? x : 1920 - total - x, rotation: dir * 1.4 + (wr() - 0.5) * 1.6, y: (wr() - 0.5) * 14 };
    }, 12);
    tl.set(el, { x: -6000 }, tCut + dur / 2 + 0.05);
  }

  function drift(stage, t0, dur, amt) { tl.fromTo(stage, { scale: 1 }, { scale: 1 + (amt || 0.03), duration: dur, ease: "none" }, t0); }

  function build() {
  // =====================================================================
  // The Doctrine of Simony — whimsical paper explainer. Every beat is keyed to a force-aligned spoken word
  // (gen/words.json, injected by gen/build.py); scene cuts come from gen/timing.py.
  // =====================================================================
  const WJ = /*WORDS*/null, CUT = /*CUTS*/null;
  const LEAD = 0.06;                                   // reveals land just before their word
  const key = (w) => w.toLowerCase().replace(/’/g, "'").replace(/[^a-z']/g, "");
  function W(id, word, n, end) {
    let c = 0;
    for (const x of WJ.lines[id].words) if (key(x.w) === word) { if (c === (n || 0)) return end ? x.e : x.s; c++; }
    throw new Error("missing word " + id + " " + word + " " + (n || 0));
  }
  const T = (id, word, n) => W(id, word, n) - LEAD;     // cue time for a word
  const WE = (id, word, n) => W(id, word, n, true);
  const LE = (id) => WJ.lines[id].e;
  const RATIO = /*RATIO*/null;
  const IMG = "assets/img/";
  const RED = "#b9281d", INK = "#201d18", GILT = "#bb8c3f", LAPIS = "#455a63", PARCH = "#eae5d2", GREEN = "#5d6b3a", PURPLE = RED, GOLD = GILT;
  function scene(id, bg) {
    const S = $("#" + id);
    S.innerHTML = `<div class="stage" id="${id}-stage"><div class="bg" style="background-image:url(${IMG}${bg}.webp)"></div><svg class="doodle" id="${id}-dd" viewBox="0 0 1920 1080"></svg></div>`;
    return { S, st: $("#" + id + "-stage"), dd: $("#" + id + "-dd") };
  }
  function cut(parent, id, name, cx, bottom, w, extra) {
    const h = w * (RATIO[name] || 1);
    const el = mk(parent, "pp", { left: cx - w / 2 + "px", top: bottom - h + "px", width: w + "px" });
    el.id = id; el.innerHTML = `<div class="j"><img src="${IMG}${name}.webp" />${extra || ""}</div>`;
    return "#" + id;
  }
  // Price-tag writing: the tag body's writable rectangle (past the eyelet, inside the paper border), measured once from
  // the alpha mask of assets/img/price-tag.webp by gen/measure_tag.py — centre (fractions of the image), long-axis angle
  // (deg), and the rectangle's length/width (fractions of image width). The text's real glyph ink box is centred on it.
  const TAG_BODY = { cx: 0.6329, cy: 0.6238, ang: 43.12, len: 0.555, wid: 0.3609 };
  const TAG_FILL = 0.62;                                  // ink height as a share of the body width (even margin across)
  function tagText(w, txt, color) {
    const h = w * RATIO["price-tag"], L = TAG_BODY.len * w, D = TAG_BODY.wid * w;
    const g = (tagText.c || (tagText.c = document.createElement("canvas").getContext("2d")));
    g.font = "700 100px Caveat";
    const m = g.measureText(txt);
    const iw = m.actualBoundingBoxLeft + m.actualBoundingBoxRight, ih = m.actualBoundingBoxAscent + m.actualBoundingBoxDescent;
    let k = (D * TAG_FILL) / ih;
    const mg = (D - ih * k) / 2;
    if (iw * k > L - 2 * mg) k = (L - 2 * mg) / iw;         // never tighter along the axis than across it
    const fs = 100 * k, fa = m.fontBoundingBoxAscent * k, fd = m.fontBoundingBoxDescent * k;
    const base = (fs - (fa + fd)) / 2 + fa;                 // baseline inside a line-height:1 box
    const x = -(m.actualBoundingBoxRight - m.actualBoundingBoxLeft) * k / 2;
    const y = -base - (m.actualBoundingBoxDescent - m.actualBoundingBoxAscent) * k / 2;
    return `<div class="tagtxt" style="position:absolute;left:${(TAG_BODY.cx * w).toFixed(2)}px;top:${(TAG_BODY.cy * h).toFixed(2)}px;width:0;height:0;transform:rotate(${TAG_BODY.ang}deg)">` +
      `<div class="hand" style="left:${x.toFixed(2)}px;top:${y.toFixed(2)}px;font-size:${fs.toFixed(2)}px;color:${color}">${txt}</div></div>`;
  }
  function path(dd, d, style) { const p = document.createElementNS("http://www.w3.org/2000/svg", "path"); p.setAttribute("d", d); if (style) p.setAttribute("style", style); dd.appendChild(p); return p; }
  function slap(el, t, rot) {
    hide(el);
    anim(el, t, 0.14, (p) => ({ opacity: p > 0 ? 1 : 0, scale: lerp(1.5, 1, E("power2.in")(p)), rotation: (rot || 0) + 14 * (1 - p) }), 24);
    anim(el, t + 0.15, 0.14, (p) => ({ scale: 1 - 0.04 * Math.sin(Math.PI * p) }), 24);
  }
  function tagEl(parent, x, y, html, css) {
    const el = mk(parent, "tag", { left: x + "px", top: y + "px" });
    mk(el, "face", Object.assign({ fontSize: "30px", color: INK }, css || {}), html);
    return el;
  }
  function hopLoop(sel, t0, t1, h, every) { for (let t = t0; t < t1 - 0.3; t += every) hop(sel, t, h, 0.32); }
  function hand(parent, x, y, size, txt, css) { return mk(parent, "hand", Object.assign({ left: x + "px", top: y + "px", fontSize: size + "px" }, css || {}), txt); }
  function stampMark(parent, x, y, txt, color, size, rot) {
    const m = mk(parent, "mark", { left: x + "px", top: y + "px", color }); m.innerHTML = `<div class="face" style="font-size:${size}px;transform:rotate(${rot}deg);background:rgba(250,246,234,.55)">${txt}</div>`;
    return m;
  }
  function stampIn(m, t) { hide(m); anim(m, t, 0.08, (p) => ({ opacity: 1, scale: lerp(1.4, 1, p) }), 24); }
  // scripture card (BSB): italic quote whose words appear exactly as they are spoken.
  // The card is fitted to its laid-out text (balanced lines, even padding) and centred in its slot (x..x+w).
  function verse(parent, x, y, w, quote, ref, fs, upright) {
    const PAD = 40;
    const c = mk(parent, "paper", { left: x + "px", top: y + "px", width: w + "px", padding: `30px ${PAD}px 26px`, borderRadius: "6px", transformOrigin: "50% 50%" });
    c.innerHTML = `<div class="q" style="font-family:'EB Garamond';font-style:${upright ? 'normal' : 'italic'};font-size:${fs || 46}px;line-height:1.25;color:${INK};text-wrap:balance">${quote.split(" ").map((w) => `<span class="w">${w}</span>`).join(" ")}</div>
      <div class="ref" style="margin-top:14px;font-family:'Cormorant SC';font-weight:700;font-size:26px;letter-spacing:.1em;color:${RED};white-space:nowrap;display:inline-block">${ref}</div>
      <img class="tp" src="${IMG}tape.webp" style="position:absolute;top:-18px;width:160px;filter:none;opacity:.9;transform:rotate(-3deg)" />`;
    const q = c.querySelector(".q"), r = c.querySelector(".ref");
    const lines = () => Array.from(q.querySelectorAll(".w")).reduce((m, sp) => Math.max(m, sp.offsetLeft + sp.offsetWidth), 0) - q.offsetLeft;
    let inner = Math.max(lines(), r.offsetWidth);
    for (let k = 0; k < 3; k++) { c.style.width = Math.ceil(inner) + 2 + 2 * PAD + "px"; const n = Math.max(lines(), r.offsetWidth); if (Math.abs(n - inner) < 1) break; inner = n; }
    const cw = c.offsetWidth;
    c.style.left = x + (w - cw) / 2 + "px";
    c.querySelector(".tp").style.left = cw / 2 - 80 + "px";
    return c;
  }
  const spans = (card) => Array.from(card.querySelectorAll(".w"));
  function revealAt(card, times, from) { spans(card).slice(from || 0).forEach((s, i) => { if (times[i] != null) tl.set(s, { opacity: 1 }, times[i]); }); }
  function refAt(card, t) { const r = card.querySelector(".ref"); tl.set(r, { opacity: 0 }, 0); tl.set(r, { opacity: 1 }, t); }
  // underline a run of card words, measured from the laid-out spans
  function underline(dd, card, _x0, _y0, i0, i1, color, t) {
    const x0 = card.offsetLeft, y0 = card.offsetTop;
    const s = spans(card), a = s[i0]; let b = s[i0];
    for (let k = i0; k <= i1; k++) if (s[k].offsetTop === a.offsetTop) b = s[k];
    const xa = x0 + a.offsetLeft + 40 - 40, xb = x0 + b.offsetLeft + b.offsetWidth, y = y0 + a.offsetTop + a.offsetHeight + 2;
    const p = path(dd, `M${xa} ${y} C ${xa + (xb - xa) * 0.33} ${y - 5} ${xa + (xb - xa) * 0.66} ${y - 4} ${xb} ${y + 2}`, `stroke:${color};stroke-width:9`);
    draw(p, t, 0.25); return p;
  }
  function slideIn(el, t, dx, rot) { hide(el); anim(el, t, 0.35, (p) => ({ opacity: 1, x: dx * (1 - E("power3.out")(p)), rotation: lerp((rot || 0) + 4, rot || 0, p) }), 12); }
  function fadeOut(el, t, d) { anim(el, t, d || 0.25, (p) => ({ opacity: 1 - p, y: 30 * p }), 12); }
  function arrowHead(dd, x, y, ang, style, s) { s = s || 22; const a1 = ang + 2.6, a2 = ang - 2.6; return path(dd, `M${x + s * Math.cos(a1)} ${y + s * Math.sin(a1)} L${x} ${y} L${x + s * Math.cos(a2)} ${y + s * Math.sin(a2)}`, style); }
  function popScene(st, t0, t1) { tl.set(st, { scale: 1.06 }, t0); anim(st, t0, 0.2, (p) => ({ scale: lerp(1.06, 1, p) }), 24); drift(st, t0 + 0.21, t1 - t0 - 0.21, 0.025); }
  const B = [0].concat(CUT, [TOTAL]);                  // scene bounds

