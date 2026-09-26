  $$(".stage").forEach((st) => { const dd = st.querySelector("svg.doodle"); if (dd) st.appendChild(dd); });
  // ---------------------------------------------------------------- transitions & texture (torn-paper wipes centred on the cuts)
  wipe($("#w1"), 1451 * 1260 / 1080, B[2], 1, 1.2);
  wipe($("#w2"), 1451 * 1260 / 1080, B[5], -1, 1.2);
  wipe($("#w3"), 1451 * 1260 / 1080, B[6], 1, 1.2);
  wipe($("#w4"), 1415 * 1260 / 1080, B[8], -1, 1.2);
  const br = rng(2024);
  for (let i = 0, t = 0; t < TOTAL; i++, t = i / 8) tl.set("#boilT", { attr: { seed: 1 + Math.floor(br() * 9) } }, t);
  const gr = rng(99);
  for (let i = 0, t = 0; t < TOTAL; i++, t = i / 12) {
    tl.set("#grain", { backgroundPosition: `${Math.floor(gr() * 512)}px ${Math.floor(gr() * 512)}px` }, t);
    tl.set("#flicker", { opacity: gr() * 0.05 }, t);
  }
  window.__timelines["main"] = tl;
  }
  const F = document.fonts; (F ? Promise.all([F.load("400 20px Inter"), F.load("700 20px Inter"), F.load("700 40px Caveat"), F.load("700 40px 'Cormorant SC'"), F.load("600 40px 'Cormorant SC'"), F.load("400 40px 'EB Garamond'"), F.load("italic 400 40px 'EB Garamond'")]).then(() => F.ready) : Promise.resolve()).then(build, build);
})();
