  // ---------------------------------------------------------------- measured title lockup: "The Doctrine of" over SIMONY (+ optional subtitle)
  // Ink boxes from canvas metrics; every line is centred on the widest line; equal gaps between ink boxes.
  function lockup(parent, left, top, S, color, sub, subColor) {
    const cx = document.createElement("canvas").getContext("2d");
    const ink = (txt, font) => { cx.font = font; const m = cx.measureText(txt); return { w: m.actualBoundingBoxLeft + m.actualBoundingBoxRight, l: m.actualBoundingBoxLeft, a: m.actualBoundingBoxAscent, d: m.actualBoundingBoxDescent }; };
    const rows = [["The Doctrine of", `400 ${Math.round(S * 0.3)}px 'EB Garamond'`, color], ["SIMONY", `700 ${S}px 'Cormorant SC'`, color]];
    if (sub) rows.push(["A Theological Retrieval and Appraisal", `italic 400 ${Math.round(S * 0.19)}px 'EB Garamond'`, subColor || color]);
    const R = rows.map(([t, f, c]) => ({ t, f, c, m: ink(t, f) }));
    const Wd = Math.max(...R.map((r) => r.m.w)), G = S * 0.13;
    let y = 0; R.forEach((r) => { r.top = y; y += r.m.a + r.m.d + G; });
    const H = y - G;
    const box = mk(parent, "", { position: "absolute", left: left + "px", top: top + "px", width: Wd + "px", height: H + "px" });
    const lines = R.map((r) => {
      const h = r.m.a + r.m.d + 2;
      const d = mk(box, "", { position: "absolute", left: "0px", top: r.top + "px", width: Wd + 4 + "px", height: h + "px" });
      d.innerHTML = `<svg width="${Wd + 4}" height="${h}" style="display:block;overflow:visible"><text x="${(Wd - r.m.w) / 2 + r.m.l}" y="${r.m.a}" fill="${r.c}" style="font:${r.f}">${r.t}</text></svg>`;
      return d;
    });
    return { box, lines, W: Wd, H };
  }
  // torn cream strip sized to a lockup with even padding (tear-cream's torn edges take ~10% of its height top and bottom)
  function stripFor(parent, cxp, topp, S) {
    const strip = mk(parent, "pp noshadow", { left: "0px", top: "0px", transformOrigin: "50% 50%" });
    strip.innerHTML = `<div class="j"></div>`;
    const sj = strip.querySelector(".j");
    const LK = lockup(sj, 0, 0, S, INK);
    const P = LK.H * 0.3, EDGE = 0.1;
    const SW = LK.W + 2 * P * 1.5, SH = (LK.H + 2 * P) / (1 - 2 * EDGE);
    Object.assign(strip.style, { left: cxp - SW / 2 + "px", top: topp + "px", width: SW + "px", height: SH + "px" });
    const bg = document.createElement("img"); bg.src = IMG + "tear-cream.webp";
    Object.assign(bg.style, { position: "absolute", left: "0px", top: "0px", width: SW + "px", height: SH + "px", filter: "drop-shadow(0 7px 7px rgba(45,35,20,.22))" });
    sj.insertBefore(bg, sj.firstChild);
    Object.assign(LK.box.style, { left: (SW - LK.W) / 2 + "px", top: (SH - LK.H) / 2 + "px" });
    sj.insertAdjacentHTML("beforeend", `<img src="${IMG}tape.webp" style="position:absolute;left:-44px;top:-10px;width:170px;transform:rotate(-26deg);filter:none;opacity:.92" />
      <img src="${IMG}tape.webp" style="position:absolute;left:${SW - 126}px;top:${SH - 58}px;width:170px;transform:rotate(-24deg);filter:none;opacity:.92" />`);
    return { strip, LK, SW, SH };
  }
  // underline a run of card words across however many lines it wraps onto (measured from the laid-out spans)
  function underlineRun(dd, card, i0, i1, color, t) {
    const s = spans(card), x0 = card.offsetLeft, y0 = card.offsetTop, groups = [];
    for (let k = i0; k <= i1; k++) { const sp = s[k], g = groups[groups.length - 1]; if (g && g.top === sp.offsetTop) g.b = sp; else groups.push({ top: sp.offsetTop, a: sp, b: sp }); }
    groups.forEach((g, j) => {
      const xa = x0 + g.a.offsetLeft, xb = x0 + g.b.offsetLeft + g.b.offsetWidth, y = y0 + g.a.offsetTop + g.a.offsetHeight - 2;
      draw(path(dd, `M${xa} ${y} C ${xa + (xb - xa) * 0.33} ${y - 5} ${xa + (xb - xa) * 0.66} ${y - 3} ${xb} ${y + 2}`, `stroke:${color};stroke-width:8`), t + j * 0.16, 0.2);
    });
  }
  const sc = (txt, size, ls) => `<span style="font-family:'Cormorant SC';font-weight:700;letter-spacing:${ls == null ? 0.06 : ls}em;font-size:${size}px">${txt}</span>`;
  // coloured clause chip for the definition's four parts
  function chipEl(parent, x, y, txt, bg, fg) { return tagEl(parent, x, y, sc(txt, 44), { padding: "8px 26px", backgroundColor: bg, color: fg || PARCH }); }
  // lay chips out in one centred row; returns their x positions
  function rowX(widths, gap, cx) { const tot = widths.reduce((a, b) => a + b, 0) + gap * (widths.length - 1); let x = cx - tot / 2; return widths.map((w) => { const r = x; x += w + gap; return r; }); }
  function dim(el, t, to) { anim(el, t, 0.25, (p) => ({ opacity: 1 - (1 - (to == null ? 0.3 : to)) * p }), 12); }
  function coin(parent, x, y, s) { return mk(parent, "", { position: "absolute", left: x + "px", top: y + "px", width: s + "px", height: s + "px", borderRadius: "50%", background: `radial-gradient(circle at 35% 35%, #e7c46e, ${GILT} 60%, #8a6526)`, border: "3px solid #7a5a22", boxSizing: "border-box", boxShadow: "0 3px 4px rgba(45,35,20,.3)" }); }
  const lab = (parent, cx, y, w, txt, size, css) => hand(parent, cx - w / 2, y, size || 46, txt, Object.assign({ width: w + "px", textAlign: "center" }, css || {}));

  // in-order word times for a word-by-word card: each card word is matched to ITS occurrence in the line (walking forward
  // from the previous match), then forced monotonic so no word can appear before the one it follows
  function seq(id, list) {
    const ws = WJ.lines[id].words; let k = 0, prev = -1e9;
    return list.map((w) => {
      let j = k; while (j < ws.length && key(ws[j].w) !== w) j++;
      if (j >= ws.length) throw new Error("seq: missing " + id + " " + w);
      k = j + 1; const t = Math.max(ws[j].s - LEAD, prev); prev = t; return t;
    });
  }
  // a correctly formed hand-inked question mark: one hook stroke + a dot, drawn on the boiling doodle layer
  function qmark(dd, x, y, h, rot, t) {
    const s = h / 100, R = (px, py) => { const a = rot * Math.PI / 180, dx = px * s, dy = py * s; return `${(x + dx * Math.cos(a) - dy * Math.sin(a)).toFixed(1)} ${(y + dx * Math.sin(a) + dy * Math.cos(a)).toFixed(1)}`; };
    const hook = path(dd, `M${R(-24, 18)} C ${R(-26, -8)} ${R(26, -12)} ${R(26, 16)} C ${R(26, 36)} ${R(2, 40)} ${R(1, 62)}`, `stroke:${RED};stroke-width:10`);
    const dot = path(dd, `M${R(1, 86)} L ${R(1.5, 87)}`, `stroke:${RED};stroke-width:13`);
    draw(hook, t, 0.22); hide(dot); tl.set(dot, { opacity: 1 }, t + 0.24);
  }

  // ---------------------------------------------------------------- S1 a forgotten sin
  (function () {
    const { S, st, dd } = scene("s1", "parch-bg");
    const t1 = B[1];
    drift(st, 0, t1, 0.03);
    draw(path(dd, "M40 935 C 420 925 760 943 1060 931 S 1600 939 1880 929"), 0.05, 0.6);
    const cg = cut(st, "s1-cg", "churchgoers", 470, 935, 470);
    rise(cg, 0.3, { h: 500, d: 0.45 }); jit(cg, 0.8, t1, 0.8, 11);
    const cgE = $(cg), cgTop = cgE.offsetTop;
    [["never", 300, -95, -8], ["heard", 470, -120, 6], ["of", 640, -95, 10]].forEach(([w, x, dy, r], i) => {
      qmark(dd, x, cgTop + dy + 20, 78, r, T("l1", w));
    });
    const { strip, LK } = stripFor(st, 1330, 70, 150);
    const tS = T("l1", "simony") - 0.1;
    hide(strip);
    anim(strip, tS, 0.14, (p) => ({ opacity: 1, scale: lerp(1.3, 1, p), rotation: lerp(6, -1.5, p) }), 24);
    anim(strip, tS + 0.15, 0.12, (p) => ({ scale: 1 - 0.03 * Math.sin(Math.PI * p), rotation: -1.5 }), 24);
    tl.set(LK.lines[0], { opacity: 0 }, 0); tl.set(LK.lines[0], { opacity: 1 }, tS + 0.12);
    writeOn(LK.lines[1], T("l1", "simony"), 0.35);
    const tm = cut(st, "s1-tomes", "tomes", 1450, 935, 240);
    pop(tm, T("l1", "centuries") - 0.1, { d: 0.45 }); jit(tm, W("l1", "centuries") + 0.4, t1, 0.6, 12);
    [["canon law", 1010, 600, -4, "few"], ["the schoolmen", 1590, 650, 4, "church"], ["Reformation confessions", 840, 790, 3, "widely"]].forEach(([txt, x, y, r, w]) => {
      const g = tagEl(st, x, y, sc(txt, 34), { padding: "8px 20px" }); tl.set(g, { rotation: r }, 0); slap(g, T("l1", w) - 0.04, r);
    });
    draw(path(dd, "M905 110 L905 72 M886 91 L924 91 M1760 330 L1782 298 M1790 348 L1826 340", `stroke:${RED};stroke-width:6`), T("l1", "simony") + 0.45, 0.25);
  })();

  // ---------------------------------------------------------------- S2 Acts 8: Simon the sorcerer (BSB)
  (function () {
    const { S, st, dd } = scene("s2", "vellum-bg");
    const t0 = B[1], t1 = B[2];
    popScene(st, t0, t1);
    const pe = cut(st, "s2-peter", "peter", 330, 1010, 300);
    rise(pe, t0 + 0.15, { h: 600, d: 0.45 }); jit(pe, t0 + 0.7, t1, 0.6, 21);
    const si = cut(st, "s2-simon", "simon", 770, 1010, 470);
    const tSim = T("l2", "simon");
    hide(si); anim(si, tSim - 0.35, 0.4, (p) => ({ opacity: 1, x: 700 * (1 - E("power3.out")(p)) }), 12); jit(si, tSim + 0.1, t1, 0.6, 22);
    const siE = $(si), bagX = siE.offsetLeft + 0.06 * siE.offsetWidth, bagY = siE.offsetTop + 0.31 * siE.offsetWidth * RATIO.simon;
    const ac = tagEl(st, 640, 70, sc("Acts 8", 44, 0.14), { padding: "8px 26px", color: PARCH, backgroundColor: RED }); tl.set(ac, { rotation: -3 }, 0); slap(ac, T("l2", "named") - 0.04, -3);
    const sn = hand(st, 600, 300, 64, "Simon the sorcerer", { color: INK, transform: "rotate(-4deg)" }); writeOn(sn, T("l2", "simon"), 0.5);
    // the Spirit given through the apostles' hands
    const dv = cut(st, "s2-dove", "dove", 0, 0, 130); const tSp = T("l2", "spirit") - 0.3;   // anchored at (0,0): x/y place its bottom-centre
    tl.set(dv, { x: 250, y: -100, opacity: 0 }, 0); tl.set(dv, { opacity: 1 }, tSp);
    anim(dv, tSp, 0.6, (p) => { const q = E("power2.out")(p); return { x: lerp(250, 285, q), y: lerp(-100, 250, q), rotation: 6 * Math.sin(p * 9) }; }, 12);
    jit(dv, tSp + 0.65, t1, 0.8, 23);
    const R = []; for (let i = 0; i < 9; i++) { const a = Math.PI * (-0.08 + 1.16 * i / 8); R.push(`M${285 + 118 * Math.cos(a)} ${150 + 105 * Math.sin(a)} L${285 + 168 * Math.cos(a)} ${150 + 150 * Math.sin(a)}`); }
    draw(path(dd, R.join(" "), `stroke:${GILT};stroke-width:6`), T("l2", "given"), 0.3);
    const ah = hand(st, 60, 330, 48, "the apostles' hands", { color: LAPIS, transform: "rotate(-3deg)" }); writeOn(ah, T("l2", "apostles'"), 0.4);
    // …and offered them money
    const tM = T("l2", "offered");
    const sp = path(dd, `M${bagX - 60} ${bagY - 40} L${bagX - 90} ${bagY - 70} M${bagX - 70} ${bagY + 10} L${bagX - 110} ${bagY + 12} M${bagX - 50} ${bagY + 60} L${bagX - 80} ${bagY + 90}`, `stroke:${GILT};stroke-width:6`); draw(sp, tM, 0.2);
    const coins = [[-70, 70, 44], [-20, 95, 38], [-110, 110, 40]].map(([dx, dy, s], i) => { const c = coin(st, bagX + dx, bagY + dy, s); pop(c, W("l2", "money") - 0.1 + i * 0.07, { d: 0.25 }); return c; });
    // Peter's rebuke, Acts 8:20
    const pt = tagEl(st, 150, 300, sc("Peter", 40, 0.1), { padding: "6px 22px" }); tl.set(pt, { rotation: 3 }, 0); slap(pt, T("l3", "peter") - 0.04, 3);
    fadeOut(ah, T("l3", "peter") - 0.2, 0.2);
    const CX = 1010, CY = 190;
    const C = verse(st, CX, CY, 860, "“May your silver perish with you, because you thought you could buy the gift of God with money!”", "Acts 8:20", 52);
    slideIn(C, T("l3", "replied") - 0.1, 500, 1.2);
    revealAt(C, seq("l3", ["may", "your", "silver", "perish", "with", "you", "because", "you", "thought", "you", "could", "buy", "the", "gift", "of", "god", "with", "money"]));
    refAt(C, WE("l3", "money"));
    underlineRun(dd, C, 11, 15, RED, WE("l3", "god") - 0.05);
    const tP = W("l3", "perish");
    coins.forEach((c, i) => anim(c, tP + i * 0.06, 0.55, (p) => ({ y: 520 * E("power2.in")(p), rotation: (i - 1) * 140 * p }), 12));
    anim(si, tP, 0.3, (p) => ({ x: 26 * Math.sin(Math.PI * Math.min(1, p * 1.2)) }), 12);
  })();

  // ---------------------------------------------------------------- S3 the classic definition (Aquinas)
  const DEF = "Simony is an earnest desire to buy or sell something spiritual or something annexed to a spiritual thing.";
  (function () {
    const { S, st, dd } = scene("s3", "parch-bg");
    const t0 = B[2], t1 = B[3];
    drift(st, t0, t1 - t0, 0.02);
    const aq = cut(st, "s3-aq", "aquinas", 300, 1010, 290);
    rise(aq, Math.min(t0 + 0.2, T("l4", "thomas") - 0.3), { h: 600, d: 0.45 }); jit(aq, t0 + 0.8, t1, 0.8, 31);
    const nm = tagEl(st, 120, 380, sc("Thomas Aquinas", 40, 0.06), { padding: "8px 24px", color: PARCH, backgroundColor: INK }); tl.set(nm, { rotation: -3 }, 0); slap(nm, T("l4", "thomas") - 0.04, -3);
    const cd = hand(st, 690, 215, 60, "the classic definition", { color: RED, transform: "rotate(-2deg)" }); writeOn(cd, T("l4", "classic"), 0.5);
    const CX = 600, CY = 330;
    const C = verse(st, CX, CY, 1260, DEF, "Thomas Aquinas, Summa Theologiae II‑II, q. 100, a. 1", 66);
    slideIn(C, T("l4", "definition") - 0.05, 500, -0.8);
    const K = [["simony", 0], ["is", 0], ["an", 0], ["earnest", 0], ["desire", 0], ["to", 0], ["buy", 0], ["or", 0], ["sell", 0], ["something", 0], ["spiritual", 0], ["or", 1], ["something", 1], ["annexed", 0], ["to", 1], ["a", 0], ["spiritual", 1], ["thing", 0]];
    revealAt(C, seq("l4", K.map(([w]) => w)));
    refAt(C, W("l4", "thing"));
    underlineRun(dd, C, 2, 4, RED, WE("l4", "desire") - 0.05);
    underlineRun(dd, C, 5, 8, GILT, WE("l4", "sell") - 0.05);
    underlineRun(dd, C, 9, 10, LAPIS, WE("l4", "spiritual") - 0.05);
    underlineRun(dd, C, 12, 17, GREEN, W("l4", "thing") - 0.05);
  })();

  // ---------------------------------------------------------------- S4 something spiritual / something annexed
  (function () {
    const { S, st, dd } = scene("s4", "parch-bg");
    const t0 = B[3], t1 = B[4];
    popScene(st, t0, t1);
    const c1 = chipEl(st, 0, 80, "something spiritual", LAPIS), c2 = chipEl(st, 0, 80, "something annexed", GREEN);
    const [x1, x2] = rowX([c1.offsetWidth, c2.offsetWidth], 40, 960);
    c1.style.left = x1 + "px"; c2.style.left = x2 + "px";
    tl.set(c1, { rotation: -2 }, 0); slap(c1, T("l5", "something") - 0.04, -2);
    tl.set(c2, { rotation: 2 }, 0); slap(c2, T("l5", "annexed") - 0.04, 2);
    const ITEMS = [["mitre", 250, 190, "church offices", "church"], ["chalice", 610, 210, "sacraments", "sacraments"], ["praying", 965, 160, "prayer", "prayer"], ["pulpit", 1320, 175, "preaching", "preaching"], ["codex", 1680, 320, "teaching", "teaching"]];
    const els = ITEMS.map(([n, cx, w, label, word], i) => {
      const t = T("l5", word);
      const el = cut(st, "s4-" + n, n, cx, 680, w); tl.set(el, { transformOrigin: "50% 50%" }, 0); slap($(el), t - 0.04, [-4, 3, -2, 3, -3][i]); jit(el, t + 0.3, t1, 0.6, 41 + i);
      const lb = lab(st, cx, 700, 340, label, 48); writeOn(lb, t + 0.02, 0.35);
      return [$(el), lb];
    });
    const nj = hand(st, 70, 230, 54, "not just…", { color: RED, transform: "rotate(-5deg)" }); writeOn(nj, T("l5", "not"), 0.3);
    // annexed: the income joined to an office
    const tA = T("l5", "annexed");
    els.slice(1).forEach(([el, lb]) => { dim(el, tA, 0.28); dim(lb, tA, 0.28); });
    dim(nj, tA, 0);
    const pu = cut(st, "s4-purse", "purse", 560, 1020, 180);
    pop(pu, T("l5", "joined") - 0.05, { d: 0.35 }); jit(pu, W("l5", "joined") + 0.3, t1, 0.6, 47);
    const ch = path(dd, "M270 760 C 300 840 380 900 470 925", `stroke:${INK};stroke-width:6;stroke-dasharray:14 12`); draw(ch, T("l5", "joined"), 0.3);
    const tp = document.createElement("img"); tp.src = IMG + "tape.webp"; Object.assign(tp.style, { position: "absolute", left: "435px", top: "885px", width: "120px", transform: "rotate(28deg)", opacity: "0" }); st.appendChild(tp);
    tl.set(tp, { opacity: 0.92 }, W("l5", "joined") + 0.2);
    const oi = hand(st, 720, 910, 58, "an office's income", { color: GREEN, transform: "rotate(-3deg)" }); writeOn(oi, T("l5", "office's"), 0.45);
  })();

  // ---------------------------------------------------------------- S5 to buy or sell · an earnest desire
  (function () {
    const { S, st, dd } = scene("s5", "vellum-bg");
    const t0 = B[4], t1 = B[5];
    popScene(st, t0, t1);
    const c1 = chipEl(st, 0, 80, "to buy or sell", GILT, INK), c2 = chipEl(st, 0, 80, "an earnest desire", RED);
    const [x1, x2] = rowX([c1.offsetWidth, c2.offsetWidth], 40, 960);
    c1.style.left = x1 + "px"; c2.style.left = x2 + "px";
    tl.set(c1, { rotation: -2 }, 0); slap(c1, T("l6", "both") - 0.04, -2);
    tl.set(c2, { rotation: 2 }, 0); slap(c2, T("l6", "begins") - 0.04, 2);
    const hc = cut(st, "s5-hc", "hand-coins", 440, 600, 560); const hd = cut(st, "s5-hd", "hand-dove", 1480, 610, 560);
    slideIn($(hc), T("l6", "buyer") - 0.3, -700, 0); slideIn($(hd), T("l6", "seller") - 0.3, 700, 0);
    jit(hc, W("l6", "buyer") + 0.2, t1, 0.6, 51); jit(hd, W("l6", "seller") + 0.2, t1, 0.6, 52);
    const lb1 = lab(st, 440, 630, 400, "buyer", 64, { color: INK }); writeOn(lb1, T("l6", "buyer"), 0.3);
    const lb2 = lab(st, 1480, 640, 400, "seller", 64, { color: INK }); writeOn(lb2, T("l6", "seller"), 0.3);
    const tG = T("l6", "guilty");
    const m1 = stampMark(st, 290, 330, "GUILTY", RED, 62, -9); stampIn(m1, tG - 0.02);
    const m2 = stampMark(st, 1330, 320, "GUILTY", RED, 62, 7); stampIn(m2, tG + 0.12);
    const tAnd = T("l6", "and", 1);
    [$(hc), $(hd), lb1, lb2, m1, m2].forEach((el) => fadeOut(el, tAnd, 0.25));
    const ht = cut(st, "s5-heart", "heart", 960, 700, 340); pop(ht, T("l6", "sin") - 0.05, { d: 0.4 }); jit(ht, W("l6", "sin") + 0.4, t1, 0.8, 53);
    const iw = hand(st, 1160, 450, 64, "in the will", { color: RED, transform: "rotate(-4deg)" }); writeOn(iw, T("l6", "will"), 0.35);
    // arrow from under the label into the heart: the tip sits just outside the heart's measured outline
    // (HEART_OUTLINE: polar outline from the alpha mask of heart.webp, gen/measure_heart.py), entering along the outward normal
    {
      const HEART_OUTLINE = [[0.4297,0.0],[0.4074,0.0345],[0.3841,0.0656],[0.3614,0.0937],[0.3366,0.1186],[0.3139,0.1417],[0.2953,0.165],[0.275,0.1864],[0.2549,0.207],[0.2361,0.2286],[0.215,0.248],[0.1949,0.2695],[0.1738,0.2913],[0.1531,0.3178],[0.1298,0.3451],[0.1042,0.3763],[0.0758,0.4163],[0.0423,0.4679],[0.0,0.496],[-0.0395,0.4365],[-0.0714,0.3921],[-0.0991,0.3581],[-0.1233,0.3279],[-0.1459,0.3028],[-0.1678,0.2814],[-0.1888,0.261],[-0.2082,0.2402],[-0.2278,0.2205],[-0.2477,0.2011],[-0.2668,0.1808],[-0.2882,0.161],[-0.308,0.139],[-0.3304,0.1164],[-0.3534,0.0917],[-0.3789,0.0647],[-0.4027,0.0341],[-0.4255,0.0],[-0.4498,-0.0381],[-0.468,-0.0799],[-0.483,-0.1253],[-0.4932,-0.1737],[-0.4965,-0.2241],[-0.4914,-0.2746],[-0.4793,-0.3249],[-0.4564,-0.3707],[-0.4275,-0.4138],[-0.3886,-0.4483],[-0.3441,-0.4757],[-0.292,-0.4895],[-0.2403,-0.4988],[-0.1854,-0.493],[-0.1308,-0.4725],[-0.0802,-0.44],[-0.0365,-0.4035],[-0.0,-0.365],[0.0341,-0.3773],[0.0763,-0.4186],[0.1257,-0.4542],[0.1811,-0.4817],[0.2375,-0.4931],[0.2926,-0.4905],[0.3427,-0.4738],[0.3898,-0.4496],[0.4275,-0.4138],[0.4564,-0.3707],[0.4783,-0.3242],[0.4929,-0.2755],[0.4976,-0.2246],[0.4959,-0.1747],[0.4852,-0.1259],[0.4715,-0.0805],[0.4522,-0.0383]];
      const hE = $(ht), hw = hE.offsetWidth, hh = hw * RATIO.heart, hx = hE.offsetLeft, hy = hE.offsetTop, hcx = hx + hw / 2, hcy = hy + hh / 2;
      const sx = iw.offsetLeft + 18, sy = iw.offsetTop + iw.offsetHeight + 10;          // under the start of "in the will"
      const qx = sx - 60, qy = sy + 70;                                                  // aim down-left, toward the heart's flank
      let best = null;
      HEART_OUTLINE.forEach(([u, v]) => { const px = hcx + u * hw, py = hcy + v * hh, d = Math.hypot(px - qx, py - qy); if (!best || d < best.d) best = { px, py, d }; });
      const nl = Math.hypot(best.px - hcx, best.py - hcy), nx = (best.px - hcx) / nl, ny = (best.py - hcy) / nl;
      const tx = best.px + nx * 12, ty = best.py + ny * 12;                              // tip just outside the outline
      const c2x = tx + nx * 55, c2y = ty + ny * 55, c1x = sx - 4, c1y = sy + 40;
      draw(path(dd, `M${sx} ${sy} C ${c1x} ${c1y} ${c2x} ${c2y} ${tx} ${ty}`, `stroke:${RED};stroke-width:6`), W("l6", "will", 0, true), 0.2);
      draw(arrowHead(dd, tx, ty, Math.atan2(ty - c2y, tx - c2x), `stroke:${RED};stroke-width:6`), W("l6", "will", 0, true) + 0.2, 0.08);
    }
    const wh = lab(st, 960, 760, 1300, "whether or not money changes hands", 66, { color: INK }); writeOn(wh, T("l6", "whether"), 1.0);
  })();

  // ---------------------------------------------------------------- S6 fathers, schoolmen, Reformation
  (function () {
    const { S, st, dd } = scene("s6", "parch-bg");
    const t0 = B[5], t1 = B[6];
    drift(st, t0, t1 - t0, 0.02);
    const dec = mk(st, "", { position: "absolute", left: "0px", top: "-40px", width: "1920px", height: "1043px", backgroundImage: `url(${IMG}decretum.jpg)`, backgroundSize: "cover", opacity: "0.2", mixBlendMode: "multiply", WebkitMaskImage: "radial-gradient(ellipse 60% 55% at 50% 42%, #000 35%, transparent 100%)", maskImage: "radial-gradient(ellipse 60% 55% at 50% 42%, #000 35%, transparent 100%)" });
    draw(path(dd, "M40 902 C 420 894 760 910 1060 900 S 1600 906 1880 898", `stroke:${INK};stroke-width:5;stroke-dasharray:18 16`), t0 + 0.1, 0.5);
    const F = [["father", 300, 210, "the fathers", "church", "fathers", "condemned it", "condemned", 190, 350],
               ["aquinas", 760, 240, "the schoolmen", "medieval", "schoolmen", "defined it", "defined", 650, 380],
               ["reformer", 1210, 210, "the Reformation", "reformation", "reformation", null, null, 0, 0]];
    F.forEach(([n, cx, w, label, wr, wl, note, wn, nx, ny], i) => {
      const el = cut(st, "s6-" + n, n, cx, 900, w); rise(el, T("l7", wr) - 0.25, { h: 600, d: 0.4 }); jit(el, W("l7", wr) + 0.3, t1, 0.8, 61 + i);
      const tg = tagEl(st, 0, 918, sc(label, 36), { padding: "6px 20px" }); tg.style.left = cx - tg.offsetWidth / 2 + "px";
      tl.set(tg, { rotation: [-2, 2, -1][i] }, 0); slap(tg, T("l7", wl) + 0.02, [-2, 2, -1][i]);
      if (note) { const h = hand(st, nx, ny, 60, note, { color: RED, transform: "rotate(-4deg)" }); writeOn(h, T("l7", wn), 0.4); }
    });
    const yr = hand(st, 1060, 360, 52, "1517", { color: LAPIS, transform: "rotate(-6deg)" }); writeOn(yr, T("l7", "itself"), 0.3);
    const ind = cut(st, "s6-ind", "indulgence", 1540, 880, 200); tl.set(ind, { transformOrigin: "50% 50%" }, 0); slap($(ind), T("l7", "dispute") - 0.04, 5); jit(ind, W("l7", "dispute") + 0.3, t1, 0.6, 64);
    const cf = cut(st, "s6-coffer", "coffer", 1770, 900, 200); pop(cf, T("l7", "sale") - 0.08, { d: 0.35 }); jit(cf, W("l7", "sale") + 0.3, t1, 0.6, 65);
    const it = tagEl(st, 0, 918, sc("indulgences", 36), { padding: "6px 20px", color: PARCH, backgroundColor: RED }); it.style.left = 1650 - it.offsetWidth / 2 + "px";
    tl.set(it, { rotation: 2 }, 0); slap(it, T("l7", "spiritual") - 0.04, 2);
    const d1 = hand(st, 1290, 230, 58, "a dispute over the sale", { color: INK, transform: "rotate(-3deg)" }); writeOn(d1, T("l7", "dispute"), 0.55);
    const d2 = hand(st, 1350, 300, 58, "of spiritual things", { color: INK, transform: "rotate(-3deg)" }); writeOn(d2, T("l7", "of"), 0.45);
  })();

  // ---------------------------------------------------------------- S7 support, not a price (BSB Luke 10:7)
  (function () {
    const { S, st, dd } = scene("s7", "parch-bg");
    const t0 = B[6], t1 = B[7];
    popScene(st, t0, t1);
    const mn = cut(st, "s7-min", "minister", 1420, 1010, 225); rise(mn, T("l8", "ministers") - 0.3, { h: 600, d: 0.45 }); jit(mn, W("l8", "ministers") + 0.2, t1, 0.8, 71);
    const su = hand(st, 1560, 470, 64, "supported?", { color: INK, transform: "rotate(-4deg)" }); writeOn(su, T("l8", "supported"), 0.4);
    const ys = stampMark(st, 1590, 560, "YES", LAPIS, 70, -7); stampIn(ys, T("l8", "yes") - 0.02);
    const CX = 90, CY = 120;
    const C = verse(st, CX, CY, 900, "“…the worker is worthy of his wages.”", "Luke 10:7", 58);
    slideIn(C, W("l8", "yes", 0, true) - 0.05, -500, -1);
    revealAt(C, seq("l8", ["the", "worker", "is", "worthy", "of", "his", "wages"]));
    refAt(C, WE("l8", "wages"));
    // …but support is not a price
    const pt = cut(st, "s7-tag", "price-tag", 0, 0, 150, tagText(150, "$", INK));
    tl.set(pt, { x: 1080 + 75, y: 560 + 145, transformOrigin: "22% 12%" }, 0);
    const tB = T("l8", "but");
    hide(pt); anim(pt, tB, 0.4, (p) => ({ opacity: 1, y: 560 + 145 - 500 * (1 - E("back.out(1.4)")(p)) }), 12);
    anim(pt, tB + 0.4, 1.6, (p) => ({ rotation: 9 * Math.sin(p * Math.PI * 3) * (1 - p) }), 12);
    const X = path(dd, "M1085 570 L1235 720 M1235 570 L1085 720", `stroke:${RED};stroke-width:13`); draw(X, T("l8", "not") - 0.03, 0.2);
    // honor from the people, wages from God
    const tF = T("l9", "from");
    [su, ys].forEach((el) => fadeOut(el, tF - 0.1, 0.25));
    anim(pt, tF - 0.1, 0.3, (p) => ({ opacity: 1 - p })); anim(X, tF - 0.1, 0.3, (p) => ({ opacity: 1 - p }), 12);
    const gv = cut(st, "s7-givers", "givers", 380, 1010, 370); rise(gv, T("l9", "people") - 0.35, { h: 600, d: 0.45 }); jit(gv, W("l9", "people") + 0.2, t1, 0.8, 72);
    const mE = $(mn), gE = $(gv);
    const ax0 = gE.offsetLeft + gE.offsetWidth + 20, ax1 = mE.offsetLeft - 20, ay = 760;
    draw(path(dd, `M${ax0} ${ay} C ${ax0 + 180} ${ay - 70} ${ax1 - 180} ${ay - 70} ${ax1} ${ay}`, `stroke:${GILT};stroke-width:8`), T("l9", "minister") - 0.05, 0.4);
    draw(arrowHead(dd, ax1, ay, Math.atan2(40, 90), `stroke:${GILT};stroke-width:8`), W("l9", "minister") + 0.3, 0.1);
    const ho = mk(st, "", { position: "absolute", left: (ax0 + ax1) / 2 - 150 + "px", width: "300px", textAlign: "center", top: ay - 150 + "px", fontFamily: "'EB Garamond'", fontStyle: "italic", fontSize: "62px", color: "#8a6526" }, "honor"); writeOn(ho, T("l9", "honor"), 0.35);
    const np = mk(st, "", { position: "absolute", left: (ax0 + ax1) / 2 - 250 + "px", width: "500px", textAlign: "center", top: ay + 20 + "px", fontFamily: "Caveat", fontWeight: "700", fontSize: "54px", color: RED }, "not a price for his labor"); writeOn(np, T("l9", "not"), 0.55);
    // GOD above the minister, rays and arrow from the measured card
    const god = tagEl(st, 0, 130, sc("GOD", 64, 0.16), { padding: "12px 38px" });
    const gw = god.offsetWidth, gh = god.offsetHeight, gcx = mE.offsetLeft + mE.offsetWidth / 2;
    god.style.left = gcx - gw / 2 + "px";
    const gy = 130 + gh / 2, tGod = T("l9", "god");
    slap(god, tGod - 0.04, 0);
    const rx0 = gw / 2 + 24, ry0 = gh / 2 + 20, rx1 = rx0 + 44, ry1 = ry0 + 30, Rr = [];
    for (let i = 0; i < 12; i++) { const a = Math.PI * 2 * i / 12 - Math.PI / 2; if (Math.abs(Math.cos(a)) > 0.97) continue; Rr.push(`M${gcx + rx0 * Math.cos(a)} ${gy + ry0 * Math.sin(a)} L${gcx + rx1 * Math.cos(a)} ${gy + ry1 * Math.sin(a)}`); }
    draw(path(dd, Rr.join(" "), `stroke:${GILT};stroke-width:6`), tGod + 0.1, 0.3);
    const vy0 = 130 + gh + ry1 - ry0 + 22, vy1 = mE.offsetTop - 16;
    draw(path(dd, `M${gcx} ${vy0} C ${gcx + 14} ${vy0 + (vy1 - vy0) * 0.4} ${gcx - 10} ${vy0 + (vy1 - vy0) * 0.7} ${gcx} ${vy1}`, `stroke:${LAPIS};stroke-width:8`), T("l9", "receives", 1) - 0.05, 0.35);
    draw(arrowHead(dd, gcx, vy1, Math.PI / 2, `stroke:${LAPIS};stroke-width:8`), W("l9", "receives", 1) + 0.25, 0.1);
    const wg = mk(st, "", { position: "absolute", left: gcx + 30 + "px", top: (vy0 + vy1) / 2 - 36 + "px", fontFamily: "'EB Garamond'", fontStyle: "italic", fontSize: "62px", color: LAPIS }, "wages"); writeOn(wg, T("l9", "wages"), 0.35);
    const te = hand(st, gcx - 430, 300, 54, "his true employer", { color: INK, transform: "rotate(-3deg)" }); writeOn(te, T("l9", "employer"), 0.45);
  })();

  // ---------------------------------------------------------------- S8 today · what new reformation?
  (function () {
    const { S, st, dd } = scene("s8", "parch-bg");
    const t0 = B[7], t1 = B[8];
    drift(st, t0, t1 - t0, 0.02);
    const hd = lab(st, 960, 120, 1600, "a multibillion-dollar industry", 92, { color: RED, transform: "rotate(-2deg)" }); writeOn(hd, T("l10", "multibillion"), 0.8);
    const IT = [["books", 440, 300, "Christian books", "selling"], ["ticket", 960, 400, "conferences", "theological"], ["gradcap", 1480, 290, "seminaries", "instruction"]];
    const els = [];
    IT.forEach(([n, cx, w, label, word], i) => {
      const t = T("l10", word), bot = 720;
      const el = cut(st, "s8-" + n, n, cx, bot, w); tl.set(el, { transformOrigin: "50% 50%" }, 0); slap($(el), t - 0.04, [-3, 2, 3][i]); jit(el, t + 0.3, t1, 0.6, 81 + i);
      const lb = lab(st, cx, bot + 16, 420, label, 56); writeOn(lb, t + 0.05, 0.4);
      const h = w * RATIO[n];
      const tg = cut(st, "s8-tag" + i, "price-tag", 0, 0, 110, tagText(110, "$", INK));
      tl.set(tg, { x: cx + w / 2 - 70 + 55, y: bot - h + 20 + 107, transformOrigin: "22% 12%" }, 0);
      hide(tg); anim(tg, t + 0.25, 0.3, (p) => ({ opacity: 1, rotation: 30 * (1 - E("back.out(2)")(p)) }), 12);
      els.push($(el), lb, $(tg));
    });
    // the book's question
    const tW = T("l10", "what");
    els.forEach((el) => fadeOut(el, tW - 0.35, 0.28));
    const Q = "What new reformation awaits a church that learns again to discern this sin?";
    const C = verse(st, 210, 390, 1500, Q, "The Doctrine of Simony", 78, true);
    slideIn(C, tW - 0.12, 0, 0);
    revealAt(C, seq("l10", ["what", "new", "reformation", "awaits", "a", "church", "that", "learns", "again", "to", "discern", "this", "sin"]));
    refAt(C, WE("l10", "sin") - 0.1);
    underlineRun(dd, C, 1, 2, RED, W("l10", "reformation", 0, true));
  })();

  // ---------------------------------------------------------------- S9 the book
  (function () {
    const { S, st, dd } = scene("s9", "lapis-bg");
    const t0 = B[8], t1 = B[9];
    popScene(st, t0, t1);
    const cv = mk(st, "pp", { left: "250px", top: "120px", width: "440px", transformOrigin: "50% 50%" });
    cv.innerHTML = `<div class="j"><div style="padding:10px;background:#f6f2e6;box-shadow:0 14px 20px rgba(10,15,20,.45)"><img src="${IMG}cover.jpg" style="width:420px;display:block;filter:none" /></div>
      <img src="${IMG}tape.webp" style="position:absolute;left:140px;top:-20px;width:170px;filter:none;opacity:.92;transform:rotate(4deg)" /></div>`;
    const tT = T("l11", "the");
    tl.set(cv, { rotation: -3 }, 0); pop(cv, Math.max(t0 + 0.2, tT - 0.1), { d: 0.45, r: -3 }); jitter(cv.querySelector(".j"), tT + 0.5, t1, 0.5, 91);
    const EX = 820;
    const EK = lockup(st, EX, 150, 150, PARCH, true, "#d8dfe2");
    tl.set(EK.lines[0], { opacity: 0 }, 0); tl.set(EK.lines[0], { opacity: 1 }, tT);
    writeOn(EK.lines[1], T("l11", "simony"), 0.35);
    writeOn(EK.lines[2], WE("l11", "simony"), 0.5);
    const ey = 150 + EK.H;
    const by = mk(st, "", { position: "absolute", left: EX + "px", width: EK.W + "px", textAlign: "center", top: ey + 28 + "px", fontFamily: "'EB Garamond'", fontStyle: "italic", fontSize: "50px", color: PARCH }, "by Conley Owens"); writeOn(by, T("l11", "by"), 0.45);
    const CH = [["Read it", T("l11", "read")], ["Free", T("l11", "free")], ["Public domain", W("l11", "free", 0, true) + 0.15]];
    const chips = CH.map(([t]) => tagEl(st, 0, ey + 130, t, { fontSize: "38px", fontWeight: "700", padding: "10px 26px" }));
    const xs = rowX(chips.map((c) => c.offsetWidth), 26, EX + EK.W / 2);
    chips.forEach((c, i) => { c.style.left = xs[i] + "px"; tl.set(c, { rotation: [-3, 2, -2][i] }, 0); slap(c, CH[i][1] - 0.04, [-3, 2, -2][i]); });
    const url = tagEl(st, 0, ey + 250, `simony.info`, { fontSize: "60px", fontWeight: "750", padding: "16px 38px", backgroundColor: PARCH, color: INK });
    url.style.left = EX + EK.W / 2 - url.offsetWidth / 2 + "px";
    tl.set(url, { rotation: 2 }, 0); slap(url, T("l11", "simony", 1) - 0.04, 2);
    const dv = cut(st, "s9-dove", "dove", 0, 0, 150); const tD = WE("l11", "info") - 0.7;
    tl.set(dv, { x: 2000, y: 200, opacity: 0 }, 0); tl.set(dv, { opacity: 1 }, tD);
    anim(dv, tD, 2.4, (p) => { const q = E("power2.out")(p); return { x: lerp(1950, 1700, q), y: lerp(200, 330, q) - 30 * Math.sin(Math.PI * p * 2), rotation: -6 * Math.sin(p * 12) }; }, 12);
    const vv = mk(st, "", { position: "absolute", left: "0", width: "1920px", textAlign: "center", top: "925px", fontFamily: "'EB Garamond'", fontStyle: "italic", fontSize: "44px", color: PARCH },
      `“Freely you have received; freely give.” <span style="font-style:normal;font-family:'Cormorant SC';font-weight:700;font-size:30px;letter-spacing:.1em;opacity:.85">&nbsp; Matthew 10:8</span>`);
    hide(vv); anim(vv, LE("l11") + 0.4, 0.8, (p) => ({ opacity: p }), 12);
  })();

