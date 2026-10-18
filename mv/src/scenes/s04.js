// s04.js: 第 4 章 · 情话与烟花（25.4 – 41.6）
// G 25.42–28.9  "将快乐全都收集 将不开心全都淘汰"
//   她把光点一颗颗收进玻璃罐，罐子越装越亮；灰暗的碎片被她拨到罐外，碎成光尘
// H 29.0–34.8   "你对我说的情话 / 像转瞬即逝的烟花"
//   罐子举起来，光点飞上天，炸成一朵烟花；第二朵、第三朵跟着开
// I 34.8–41.6   "只停在绽放一刹那 / 我却已无法自拔"
//   烟花散尽成火星雨，落在两人身上；一颗心从他胸口浮起来，越飘越大

(() => {
  const GND = 846;

  // 灰暗的地面（比第 3 章亮一点，好承接）
  function duskField(t, k) {
    boilSeed('df');
    paint(rectPts(-900, -900, W + 1800, H + 1800), { wash: mixCol('#2E2C46', '#232044', k), ink: null });
    glow(960, 420, 1000, '#3A3054', .34);
    glow(1180, 360, 620, '#8A5E42', .16 + .12 * k);
    for (let i = 0; i < 2; i++) {
      boilSeed('dh' + i);
      paint(ellPts(i ? 1480 : 400, 800, 900, 170, 34, 5), { wash: mixCol('#332F52', '#26233E', k), fill: '#1B1930', fillOp: 90, tex: .5, ink: PAL.ink, sw: .9 });
    }
    boilSeed('dg');
    paint([[-900, GND - 24], [W * .35, GND - 34], [W * .7, GND - 22], [W + 900, GND - 30], [W + 900, 1400], [-900, 1400]],
          { wash: mixCol('#3A3352', '#2A2742', k), fill: '#191728', fillOp: 100, tex: .6, ink: PAL.ink, sw: 1.3 });
    for (let i = 0; i < 22; i++) {
      boilSeed('dg' + i);
      const x = hash(i + 12) * W, h = 24 + 30 * hash(i + 3), sway = Math.sin(t * 1.1 + i) * 3;
      inkLine([[x, GND + 30], [x + sway * .5, GND + 30 - h * .6], [x + sway, GND + 30 - h]], 1.4, '#5E5A48', 'ink', .45);
    }
  }

  // ---------- G：收光点进罐 ----------
  const JX = 1230, JY = GND - 6;
  function shotG(t, lt, dur) {
    const push = ease(seg(t, 25.5, 28.6));
    camBegin(lerp(980, 1040, push), lerp(600, 560, push), lerp(1.04, 1.14, push));
    duskField(t, .8);

    // 空中漂浮的光点：被她一颗颗"招"进罐里
    const fill = ease(seg(t, 25.6, 28.9));
    for (let i = 0; i < 24; i++) {
      boilSeed('gp' + i);
      const t0 = 25.7 + i * .11, k = ease(clamp((t - t0) / .95));
      const a0 = hash(i * 3.3) * TAU, r0 = 260 + 340 * hash(i + 4);
      const sx = 620 + Math.cos(a0) * r0, sy = 400 + Math.sin(a0) * r0 * .6;
      const tx = JX + (hash(i + 9) - .5) * 60, ty = JY - 30 - hash(i + 2) * 100 * Math.max(.2, fill);
      const px = lerp(sx, tx, k) + Math.sin(k * Math.PI) * 40 * (hash(i) - .5);
      const py = lerp(sy, ty, k) - Math.sin(k * Math.PI) * 60;
      if (k >= .995) continue;
      const a = (1 - k * .2) * (.7 + .3 * Math.sin(t * 4 + i));
      glow(px, py, 30 + 18 * hash(i), '#FFD79A', .55 * a);
      paint(starPts(px, py, 6 + 7 * hash(i + 6), .33, 4), { wash: PAL.cream, washOp: 245 * a, ink: null });
    }
    jar(t, JX, JY, 30, fill, {});

    // 灰暗碎片：被"淘汰"，从罐口弹开、化成光尘
    for (let i = 0; i < 12; i++) {
      boilSeed('gx' + i);
      const t0 = 26.2 + i * .2, k = clamp((t - t0) / 1.1);
      if (k <= 0 || k >= 1) continue;
      const a0 = -1.9 + hash(i) * 1.6, sp = 180 + 260 * hash(i + 3);
      const x = JX + Math.cos(a0) * sp * k * 1.8, y = JY - 120 + Math.sin(a0) * sp * k - 120 * k * k;
      const fade = 1 - k;
      if (fade < .05) continue;
      shard(x, y, 14 + 10 * hash(i + 5), k * 6, i + 60, { a: fade * .9, col: '#3A3750', glow: .2 });
    }

    // 她：招手，一下一下，锁在拍子上
    const beck = Math.sin(bpOf(t) * Math.PI * 2) * .35;
    const moodHer = emotions(t, [
      [25.5, 'happy', { view: 'q', lookX: -.4, lookY: -.5 }],
      [27.6, 'proud', { view: 'q', lookX: -.6 }],
    ]);
    her(980, GND + 4, 24, { ...moodHer, aR: 1.15 + beck, aL: .35 - beck * .5, boilKey: 'her' });

    // 他：仰头看光点
    const moodH = emotions(t, [
      [25.5, 'hopeful', { view: 'q', lookY: -1 }],
      [27.4, 'excited', { view: 'q', lookY: -.9 }],
    ]);
    clawd(720, GND, 24, { ...moodH, boilKey: 'hero' });
    beatRing(t, 6, JX, JY - 60, 40, 380, '#FFD9A0', 2.0);

    camEnd();
    if (lt < .3) brushWipe(.5 + lt / .6, ['#2A3A66', '#7FA6C8']);
    if (lt > dur - .28) brushWipe((lt - (dur - .28)) / .56, ['#2A2444', '#8A5A78']);
  }

  // ---------- H：烟花 ----------
  // 每朵烟花的绽放时刻：卡在拍子上（100BPM → 每拍 .6s）
  const FW = [
    { t: 30.80, x: 1240, y: 250, seed: 3, col: '#FFD08A', col2: '#FF9FB4', n: 26 },
    { t: 32.00, x: 640, y: 210, seed: 9, col: '#A8E0FF', col2: '#C9B6FF', n: 22 },
    { t: 33.20, x: 1500, y: 180, seed: 15, col: '#FFC8E0', col2: '#FFE9A8', n: 24 },
    { t: 34.40, x: 940, y: 200, seed: 21, col: '#FFE3A8', col2: '#9FE8D0', n: 28 },
    { t: 35.60, x: 400, y: 280, seed: 27, col: '#FFD08A', col2: '#FF9FB4', n: 20 },
    { t: 36.80, x: 1620, y: 290, seed: 33, col: '#C9B6FF', col2: '#FFD9C0', n: 22 },
    { t: 38.00, x: 1180, y: 200, seed: 39, col: '#FFE3A8', col2: '#FF9FB4', n: 26 },
    { t: 39.40, x: 720, y: 250, seed: 45, col: '#A8E0FF', col2: '#FFF0C8', n: 24 },
  ];

  function shotH(t, lt, dur) {
    const tilt = ease(seg(t, 29.0, 30.4));          // 镜头上摇
    const pull = ease(seg(t, 30.4, 33.0));
    const bounce = .35 * Math.sin(bpOf(t) * Math.PI);
    camBegin(lerp(1000, 960, pull), lerp(600, 470, tilt) - 20 * pull + bounce * 4, lerp(1.10, .98, pull));

    // 更深的夜空（该放烟花了）
    boilSeed('fsky');
    paint(rectPts(-900, -900, W + 1800, H + 1800), { wash: '#151230', ink: null });
    glow(1300, 420, 900, '#332A54', .30);
    glow(700, 360, 700, '#453252', .16);
    stars(t, 80, 1, -160, 700);

    // 烟花（按各自时间绽开）
    for (const f of FW) firework(f.x, f.y, t - f.t, f.seed, { n: f.n, col: f.col, col2: f.col2, life: 2.3 });

    // 地面上被烟花照亮的两人 + 举起的罐子
    boilSeed('fgr');
    paint(rectPts(-900, GND + 40, W + 1800, 800), { wash: '#141026', ink: null });

    // 罐子：空了，被他举在手上；烟花的火都在天上
    const lid = ease(seg(t, 29.2, 29.9));
    const moodH = emotions(t, [
      [29.0, 'excited', { view: 'q', lookY: -1 }],
      [32.9, 'laugh', { view: 'q', lookY: -1 }],
      [36.6, 'love', { view: 'q', lookY: -.4 }],
    ]);
    const hop = jump(t, 30.78, 31.06, 2.0), hop2 = jump(t, 33.18, 33.46, 1.8), hop3 = jump(t, 35.58, 35.86, 1.7);
    clawd(880, 862, 25, {
      ...moodH,
      dy: (moodH.dy || 0) + hop.dy + hop2.dy + hop3.dy,
      sq: (moodH.sq || 0) + hop.sq + hop2.sq + hop3.sq,
      aR: lerp(.3, 1.55, lid),
      boilKey: 'hero',
    });
    // 他手里的罐子（跟着手的位置）
    if (lid > .02) {
      const hx = 880 + 25 * 5.0, hy = 862 - 25 * (8.6 + 2.0 * lid) + (hop.dy + hop2.dy + hop3.dy) * 25 + (moodH.dy || 0) * 25;
      jar(t, hx, hy + 26, 22, .10, {});
    }

    const moodHer = emotions(t, [
      [29.0, 'starstruck', { view: 'q', lookX: -.4, lookY: -1 }],
      [33.4, 'laugh', { view: 'q', lookY: -1 }],
      [37.0, 'love', { view: 'q', lookX: -.5 }],
    ]);
    const hopH = jump(t, 30.78, 31.06, 1.8), hopH2 = jump(t, 33.18, 33.46, 1.6);
    her(1140, 862, 25, { ...moodHer, dy: (moodHer.dy || 0) + hopH.dy + hopH2.dy, sq: (moodHer.sq || 0) + hopH.sq + hopH2.sq, aL: 1.35 + .3 * bounce, boilKey: 'her' });

    camEnd();
    if (lt < .28) brushWipe(.5 + lt / .56, ['#2A2444', '#8A5A78']);
    if (lt > dur - .28) brushWipe((lt - (dur - .28)) / .56, ['#2A2444', '#8A5A78']);
    if (t > FW[0].t - .05 && t < FW[0].t + .3) flash(.22 * (1 - seg(t, FW[0].t, FW[0].t + .3)), '#FFF0CE');
  }

  // ---------- I：火星雨 / 心 ----------
  function shotI(t, lt, dur) {
    const push = ease(seg(t, 38.7, 41.4));
    camBegin(lerp(960, 940, push), lerp(520, 600, push), lerp(.98, 1.24, push));

    boilSeed('isky');
    paint(rectPts(-900, -900, W + 1800, H + 1800), { wash: '#141130', ink: null });
    glow(960, 380, 950, '#332A56', .26);
    glow(1000, 300, 560, '#6A4058', .16);
    stars(t, 70, .9, -160, 700);

    // 散尽的火星：从上往下缓慢飘落
    for (let i = 0; i < 60; i++) {
      boilSeed('em' + i);
      const ph = frac(hash(i * 2.1) + t * (.045 + .05 * hash(i + 3)));
      const x = hash(i * 3.7) * (W + 200) - 100 + Math.sin(t * .9 + i) * 26;
      const y = 900 - ph * 1100;
      const a = Math.sin(ph * Math.PI) * (.30 + .45 * hash(i + 5));
      const col = ['#FFD9A0', '#FFB0B8', '#A8E0FF', '#FFE9C0'][i % 4];
      glow(x, y, 20 + 18 * hash(i), col, a * .75);
      if (hash(i + 11) > .5) paint(starPts(x, y, 4 + 4 * hash(i + 2), .35, 4), { wash: PAL.cream, washOp: 220 * a * 2, ink: null });
    }

    // 地面
    paint(rectPts(-900, GND + 46, W + 1800, 800), { wash: '#120F22', ink: null });
    paint([[-900, GND + 50], [W * .3, GND + 36], [W * .68, GND + 54], [W + 900, GND + 42], [W + 900, 1400], [-900, 1400]],
          { wash: '#1C1734', fill: '#0E0B1C', fillOp: 110, tex: .6, ink: PAL.ink, sw: 1.3 });

    // 他：站起来，抬手接火星
    const moodH = emotions(t, [
      [38.7, 'love', { view: 'q', lookY: -.7 }],
      [40.6, 'cry', { view: 'q', lookY: -.2 }],
    ]);
    const rise = ease(seg(t, 38.9, 39.5));
    clawd(940, GND + 6, 26, {
      ...moodH,
      dy: (moodH.dy || 0) - .4 * rise,
      aR: lerp(.3, 1.75, rise) + .08 * Math.sin(bpOf(t) * Math.PI),
      aL: .45,
      boilKey: 'hero',
    });
    // 胸口浮起的一颗心：越飘越大
    const hk = seg(t, 39.3, 41.4);
    if (hk > .02) {
      const hx = 940 + Math.sin(t * 1.4) * 26, hy = lerp(GND - 150, GND - 420, easeOut(hk));
      const s = lerp(18, 78, easeOut(hk));
      glow(hx, hy, s * 3.4, '#FF9FB4', .45 * hk);
      boilSeed('heart');
      paint(heartPts(hx, hy, s * (1 + .06 * pulse(t, 4))), { wash: '#E2476E', washOp: 240, fill: '#FFB0B8', fillOp: 90, ink: PAL.ink, sw: 2.0 });
      if (hk > .5) for (let i = 0; i < 3; i++) {
        boilSeed('hs' + i);
        const a = t * 2 + i * 2.1, d = s * 1.8;
        paint(starPts(hx + Math.cos(a) * d, hy + Math.sin(a) * d * .5, 10, .35, 4), { wash: PAL.cream, ink: null });
      }
    }
    beatRing(t, 3, 940, GND + 6, 60, 520, '#FFD0C0', 2.2);

    camEnd();
    if (lt < .28) brushWipe(.5 + lt / .56, ['#2A2444', '#8A5A78']);
    if (lt < .3) flash(.16 * (1 - seg(lt, 0, .3)), '#FFE9C4');
    if (lt > dur - .3) brushWipe((lt - (dur - .3)) / .6, ['#2A2444', '#C08A4A']);
  }

  shots([[25.4, shotG], [29.0, shotH], [38.6, shotI]]);
})();
