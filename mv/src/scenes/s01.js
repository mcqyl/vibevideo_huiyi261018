// s01.js: 第 1 章 · 虚空（0.00 – 8.20）
// A 0.00–4.84  一滴墨落下炸成记忆碎片；Clawd 站在浮岩上渺小得像一粒尘，镜头缓缓推近它。
// B 4.84–8.20  碎片的光聚成一颗玻璃球，里面关着一个小世界；它裂了。

(() => {
  const FLOOR = 800;            // 浮岩顶面（世界坐标）
  const CX = 960;

  // ---------- 碎片：一次爆炸，每片有固定的方向/速度/大小 ----------
  const SP = [];
  for (let i = 0; i < 36; i++) {
    SP.push({
      a: hash(i * 3.13) * TAU,
      sp: 260 + 1000 * hash(i * 5.77),
      r: 9 + 26 * hash(i * 7.31),
      rot: hash(i * 9.19) * TAU,
      spin: (hash(i * 11.4) - .5) * 3.2,
      seed: i + 1,
      out: .5 + .5 * hash(i * 13.7),
    });
  }
  // 碎片在 t 时刻的位置：先向外爆，再被"记忆"收进一个旋涡
  function shardPos(s, t, gather, cx, cy, orbitR) {
    const age = Math.max(0, t - .79), dir = s.seed % 2 ? 1 : -1;
    const burst = s.sp * age * Math.exp(-age * 1.05) * 1.45;
    const bx = cx + Math.cos(s.a + age * .5 * dir) * burst;
    const by = cy + Math.sin(s.a + age * .5 * dir) * burst * .74 + age * age * 30;
    const oa = s.a * 1.6 + t * .8 + s.seed * .27;
    const ox = cx + Math.cos(oa) * orbitR * (.60 + .58 * hash(s.seed * 2.3));
    const oy = cy - 190 + Math.sin(oa) * orbitR * .30 + Math.sin(t * .85 + s.seed) * 24;
    return [lerp(bx, ox, gather), lerp(by, oy, gather)];
  }

  // ---------- A ----------
  function shotA(t, lt, dur) {
    const gather = ease(seg(t, 1.28, 2.35));
    const push = ease(seg(t, 2.50, 4.45));
    const sh = shakeXY(t, .7 + 5.0 * (1 - seg(t, .79, 1.20)));
    camBegin(CX + 7 * Math.sin(lt * .45) + sh[0], lerp(520, 620, push) + sh[1], lerp(1.02, 1.56, push));

    nightSky(t, { base: '#141A34', fx: CX, fy: 430, s: 1 });
    stars(t, 96, 1, -200, 940);
    motes(t, 20, CX, 520, 900, 420, 2);

    // 中央核心：一个越跳越亮的点
    const core = .30 + .70 * seg(t, .30, .90);
    glow(CX, 452, 300, '#FFD596', .26 * core * (0.75 + .25 * pulse(t, 4)));

    // ---- 落下的墨滴 0.30 → 0.79（慢进快出）----
    if (t > .28 && t < .80) {
      const k = seg(t, .28, .79), y = lerp(-160, 452, easeIn(k) * .6 + k * .4), st = 1 + .4 * k;
      boilSeed('drop');
      inkLine([[CX, y - 150 * st], [CX - 6, y - 70 * st], [CX - 10, y - 22 * st]], 6 + 8 * k, '#FFE7BC', 'ink', .5);
      paint(ellPts(CX, y - 10 * st, 15 * st, 18 * st, 16), { wash: '#FFE7BC', ink: PAL.ink, sw: 1.2 });
      paint(ellPts(CX - 4, y - 15 * st, 5 * st, 7 * st, 10), { wash: '#FFF9EC', ink: null });
      glow(CX, y, 90, '#FFD596', .40 * k);
    }
    // 砸中的星芒
    if (t > .76 && t < 1.36) {
      const a = 1 - seg(t, .76, 1.36), r = lerp(50, 480, easeOut(seg(t, .76, 1.06)));
      boilSeed('burst');
      for (let i = 0; i < 9; i++) {
        const ang = i / 9 * TAU + .23;
        inkLine([[CX + Math.cos(ang) * r * .28, 452 + Math.sin(ang) * r * .28],
                 [CX + Math.cos(ang) * r, 452 + Math.sin(ang) * r]], 3.6 * a, '#FFE9C4', 'ink', .4);
      }
      inkLine(ellPts(CX, 452, r, r * .9, 40, 2), 2.8 * a, '#FFD08A', 'ink', .3);
    }

    // ---- 碎片 ----
    if (t > .79) for (const s of SP) {
      const [x, y] = shardPos(s, t, gather, CX, 452, 350);
      const near = clamp(1 - Math.abs(t - .79) * .55);
      shard(x, y, s.r * (1 + .05 * Math.sin(t * 2.6 + s.seed)), s.rot + t * s.spin, s.seed,
            { a: (.5 + .5 * s.out) * (1 - .25 * seg(t, 4.1, 4.8)), glow: .5 + 1.0 * near });
    }

    // 旋涡环流线（把"旋涡"讲清楚，也给画面动势）
    if (t > 1.35) for (let i = 0; i < 3; i++) {
      const rr = 250 + i * 78, a0 = t * .85 + i * 2.1, pts = [];
      for (let k = 0; k <= 26; k++) {
        const a = a0 + k / 26 * 1.55;
        pts.push([CX + Math.cos(a) * rr, 250 + Math.sin(a) * rr * .40]);
      }
      inkLine(pts, 1.5, '#FFDCA4', 'inkfine', .5);
    }

    // ---- 浮岩 + Clawd ----
    rockIsland(CX, FLOOR, 540, 112, 4);
    glow(CX, FLOOR - 26, 280, '#FFC98C', .30);

    const appear = seg(t, 1.02, 1.52);
    if (appear > .01) {
      const mood = emotions(t, [
        [1.08, 'neutral', { view: 'q', lookX: .1, lookY: -1 }],
        [2.02, 'hopeful', { lookY: -.95 }],
        [3.64, 'excited' ],
        [4.30, 'sad', { view: 'q', lookY: .35 }],
      ]);
      const up = jump(t, 2.02, 2.30, 2.2), up2 = jump(t, 3.64, 3.96, 2.8);
      const u = lerp(15, 25, push);
      clawd(CX, FLOOR + 6, u, {
        ...mood,
        dy: (mood.dy || 0) + up.dy + up2.dy,
        sq: (mood.sq || 0) + up.sq + up2.sq,
        boilKey: 'hero',
      });
      beatRing(t, 5, CX, FLOOR + 6, 40, 360 * (u / 25), '#FFD9A0', 2.2);
    }

    camEnd();
    if (lt < .44) iris(CX, 452, lerp(0, 1600, easeIn(lt / .44)), '#0A0D1C');
    if (t > .76 && t < .98) flash(.30 * pulse(t, 12), '#FFE9C4');
    if (lt > dur - .26) brushWipe((lt - (dur - .26)) / .52, ['#3A2A56', '#C08A4A']);
  }

  // ---------- B：玻璃球 ----------
  const GX = 1128, GY = 352, GR = 250;

  const CR1 = [[GX - 128, GY - 202], [GX - 92, GY - 142], [GX - 118, GY - 96], [GX - 64, GY - 52],
               [GX - 84, GY - 4], [GX - 32, GY + 38], [GX - 50, GY + 86]];
  const CR2 = [[GX - 92, GY - 142], [GX - 26, GY - 126], [GX + 22, GY - 86], [GX + 86, GY - 68], [GX + 132, GY - 28]];

  function shotB(t, lt, dur) {
    const push = ease(seg(t, 4.9, 6.7));
    const sh = ring(t, [7.32, 7.99], 5, 26);
    camBegin(lerp(960, 1006, push) + 4 * sh, lerp(560, 534, push) + 2 * sh, 1.04 + .08 * push);

    nightSky(t, { base: '#101530', fx: GX - 40, fy: GY + 190, s: .95 });
    stars(t, 66, .85, -180, 880);
    motes(t, 24, GX, GY + 120, 560, 380, 6);

    const lit = 1 - .40 * seg(t, 7.32, 8.14);
    glow(GX, GY, 580, '#FFCB8C', .30 * lit);
    glow(GX, GY, 230, '#FFF0D2', .22 * lit);

    globeInside(t, GX, GY, GR, 1 - .45 * seg(t, 7.32, 8.14));
    glow(GX + 82, GY - 92, 112 * (.85 + .15 * pulse(t, 4)), '#FFD08A', .50 * lit);

    const k1 = ease(seg(t, 7.32, 7.66)), k2 = ease(seg(t, 7.99, 8.2));
    boilSeed('crack');
    if (k1 > 0) crack(CR1, k1, 1 - seg(t, 7.95, 8.2) * .45, 2.8);
    if (k2 > 0) crack(CR2, k2, 1, 2.4);
    if (k1 > .2) glow(GX - 68, GY - 18, 160, '#FFD79A', .45 * k1 * lit);

    globeShell(t, GX, GY, GR, lit);
    rockIsland(660, 772, 470, 96, 9);

    // ---- Clawd：伸手碰玻璃 ----
    const reach = ease(seg(t, 5.02, 5.66));
    const recoil = ease(seg(t, 7.30, 7.62));
    const mood = emotions(t, [
      [4.90, 'hopeful', { view: 'q', lookX: .55, lookY: -.85 }],
      [6.10, 'love', { view: 'q', lookX: .45, lookY: -.6 }],
      [7.32, 'sad', { view: 'q', lookY: .2 }],
      [7.96, 'cry', { view: 'q' }],
    ]);
    const hop = jump(t, 6.18, 6.48, 1.5);
    clawd(660, 770, 20, {
      ...mood,
      dy: (mood.dy || 0) + hop.dy - .4 * recoil,
      sq: (mood.sq || 0) + hop.sq + .14 * recoil,
      dx: (mood.dx || 0) - .7 * recoil,
      aL: lerp(mood.aL ?? .2, 1.5, reach) - 1.25 * recoil,
      aR: lerp(mood.aR ?? .2, 1.15, reach * .8) - .95 * recoil,
      boilKey: 'hero',
    });

    // 指尖碰玻璃：一圈涟漪
    if (t > 5.66 && t < 6.5) {
      const k = seg(t, 5.66, 6.5), r = 40 + 190 * easeOut(k);
      inkLine(ellPts(lerp(760, GX - 70, .6), lerp(620, GY + 92, .35), r, r, 34, 2), 2.8 * (1 - k), '#FFE6B8', 'ink', .4);
    }
    beatRing(t, 6, GX, GY, 50, 660, '#FFD9A0', 2.4);

    camEnd();
    if (lt < .26) brushWipe(.5 + lt / .52, ['#3A2A56', '#C08A4A']);
    // 出镜：先用笔刷扫，再压一层"雾"盖满（brushWipe(.5) 本身留缝，靠这层保证无缝切）
    if (lt > dur - .34) brushWipe((lt - (dur - .34)) / .68, ['#3A2A56', '#C08A4A']);
    const coverA = ease(seg(lt, dur - .24, dur));
    if (coverA > .01) paint(rectPts(-60, -60, W + 120, H + 120), { wash: '#241A38', washOp: 255 * coverA, ink: null });
  }

  shots([[0, shotA], [4.84, shotB]]);
})();
