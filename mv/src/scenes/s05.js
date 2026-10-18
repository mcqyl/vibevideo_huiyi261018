// s05.js: 第 5 章 · 时差（41.6 – 56.2）
// J 41.62–47.9 "我们的爱总有时差 / 也为你骗自己放下"
//   两只钟挂在夜空里，指针朝相反方向走；他伸手想去对齐，指针却越差越多。她在一侧，笑着摇头。
// K 48.0–51.5  "爱炙热的你却忘了爱自己"
//   他把自己身上的光一点点捧出来给她；光离开他，他慢慢变得透明。
// L 51.6–56.2 "我们的爱总有时差"（收尾）
//   回到最初那片虚空：碎片重新浮起来，一片片拼成一颗玻璃球，球里是两个人。他松手，球升上去。
//   最后一个镜头：球在夜空里发亮，收成一粒星。水印 mcqyl。

(() => {
  // ---------- J：两只钟 ----------
  const CX1 = 640, CY1 = 430, R1 = 210;
  const CX2 = 1290, CY2 = 400, R2 = 172;

  function shotJ(t, lt, dur) {
    const pushK = ease(seg(t, 42.0, 45.6));
    camBegin(960 + 5 * Math.sin(lt * .4), lerp(540, 500, pushK), lerp(1.02, 1.10, pushK));

    boilSeed('jsky');
    paint(rectPts(-900, -900, W + 1800, H + 1800), { wash: '#1F1A40', ink: null });
    glow(960, 380, 1050, '#3E3468', .45);
    glow(700, 300, 720, '#7A4E6E', .30);
    glow(1300, 340, 720, '#4E4278', .34);
    stars(t, 70, .85, -160, 700);

    // 时针朝相反方向走：时差
    const a1 = t * .55 + .4, a2 = -t * .40 + 2.4;

    // 两只钟之间的"时差"连线：一条被拉长的虚线，中间打个结
    boilSeed('gap');
    const gapK = clamp(Math.abs(((a1 - a2) % TAU + TAU) % TAU) / TAU);
    for (let i = 0; i < 12; i++) {
      const u = i / 11, x = lerp(CX1 + R1, CX2 - R2, u), y = lerp(CY1, CY2, u) + Math.sin(u * Math.PI) * 40 * gapK;
      inkLine([[x - 10, y], [x + 10, y]], 2.2, '#9A8AB8', 'inkfine', 0);
    }
    inkLine([[CX1 + R1, CY1], [CX2 - R2, CY2]], 1.0, '#7A6A98', 'inkfine', .3);

    // 钟
    clockFace(CX1, CY1, R1, a1, 1, '#F4D9A8');
    clockFace(CX2, CY2, R2, a2, 1, '#D8C0E8');
    glow(CX1, CY1, R1 * 2.4, '#FFC98C', .26);
    glow(CX2, CY2, R2 * 2.4, '#C0A8E8', .22);
    // 钟点外的秒针光弧
    for (const [cx, cy, r, dir] of [[CX1, CY1, R1, 1], [CX2, CY2, R2, -1]]) {
      boilSeed('sec' + cx);
      const P = [];
      for (let i = 0; i <= 14; i++) {
        const a = -Math.PI / 2 + dir * (t * 1.4 + i * .035);
        P.push([cx + Math.cos(a) * r * 1.10, cy + Math.sin(a) * r * 1.10]);
      }
      inkLine(P, 3.0, '#FFE3B0', 'ink', .3);
    }

    // 他站在下面，伸手够两座钟
    const reach = ease(seg(t, 42.4, 43.4));
    const fail = ease(seg(t, 44.6, 45.8));
    const moodH = emotions(t, [
      [41.7, 'hopeful', { view: 'q', lookY: -1 }],
      [43.8, 'determined', { view: 'q', lookY: -1 }],
      [45.0, 'sad', { view: 'q', lookY: .3 }],
    ]);
    clawd(960, 880, 24, {
      ...moodH,
      aL: lerp(.3, 1.5, reach) * (1 - .7 * fail),
      aR: lerp(.3, 1.3, reach) * (1 - .7 * fail),
      dy: (moodH.dy || 0) - .3 * reach + .3 * fail,
      boilKey: 'hero',
    });

    // 她在一侧，摇头
    const moodHer = emotions(t, [
      [42.6, 'sad', { view: 'q', lookX: -.6, lookY: .2, rot: 0 }],
      [45.2, 'relieved', { view: 'q', lookX: -.7 }],
    ]);
    her(1560, 884, 23, {
      ...moodHer,
      rot: (moodHer.rot || 0) + .07 * Math.sin(t * 2.6) * seg(t, 43.6, 45.0),
      boilKey: 'her',
    });

    // 地面：一条暗淡的地平线
    paint([[-900, 890], [W * .4, 872], [W * .7, 892], [W + 900, 878], [W + 900, 1600], [-900, 1600]],
          { wash: '#2C2550', fill: '#191430', fillOp: 100, tex: .6, ink: PAL.ink, sw: 1.2 });

    camEnd();
    if (lt < .3) brushWipe(.5 + lt / .6, ['#2A2444', '#C08A4A']);
    if (lt > dur - .3) brushWipe((lt - (dur - .3)) / .6, ['#1E1A38', '#9A7A5A']);
  }

  // ---------- K：把光给她 ----------
  function shotK(t, lt, dur) {
    const pushK2 = ease(seg(t, 48.2, 51.2));
    camBegin(lerp(960, 950, pushK2), lerp(560, 590, pushK2), lerp(1.04, 1.22, pushK2));

    boilSeed('ksky');
    paint(rectPts(-900, -900, W + 1800, H + 1800), { wash: '#241B42', ink: null });
    glow(1000, 460, 950, '#5E4270', .45);
    glow(760, 560, 620, '#8A5A58', .22);
    stars(t, 60, .8, -160, 720);
    motes(t, 26, 960, 560, 620, 360, 11);

    // 地面
    paint([[-900, 830], [W * .35, 812], [W * .7, 834], [W + 900, 818], [W + 900, 1600], [-900, 1600]],
          { wash: '#332A52', fill: '#1C1734', fillOp: 100, tex: .6, ink: PAL.ink, sw: 1.2 });

    const give = ease(seg(t, 48.4, 50.2));         // 他把光捧出去
    const drain = ease(seg(t, 49.4, 51.4));        // 他自己变淡

    // 他：手上捧着一团光
    const moodH = emotions(t, [
      [48.0, 'love', { view: 'q', lookX: .3, lookY: -.3 }],
      [50.0, 'relieved', { view: 'q', lookX: .3 }],
      [51.0, 'hopeful', { view: 'q' }],
    ]);
    const pale = mixCol(PAL.clay, '#2A2444', .45 * drain);
    clawd(760, 826, 25, {
      ...moodH,
      col: pale, lt: mixCol('#F5B394', '#2A2444', .40 * drain), tint: null,
      aL: lerp(.3, 1.25, give), aR: lerp(.3, 1.25, give),
      boilKey: 'hero',
    });
    // 手里的光球
    if (give > .05) {
      const gx = 760, gy = 826 - 25 * (9.2 + .4 * give);
      const s = lerp(14, 54, easeOut(give));
      glow(gx, gy, s * 4.2, '#FFD79A', .60 * give);
      glow(gx, gy, s * 1.6, '#FFF3D2', .70 * give);
      boilSeed('orb');
      paint(ellPts(gx, gy, s, s, 22, 2), { wash: '#FFF0CE', washOp: 245 * give, fill: '#FFD08A', fillOp: 90, ink: PAL.ink, sw: 2.0 });
      if (give > .5) for (let i = 0; i < 8; i++) {
        boilSeed('os' + i);
        const a = t * 1.6 + i / 8 * TAU, rr = s * (1.7 + .2 * Math.sin(t * 3 + i));
        paint(starPts(gx + Math.cos(a) * rr, gy + Math.sin(a) * rr * .7, 7, .35, 4), { wash: PAL.cream, ink: null });
      }
    }

    // 她：双手接住
    const moodHer = emotions(t, [
      [48.0, 'hopeful', { view: 'q', lookX: -.5, lookY: -.2 }],
      [50.2, 'cry', { view: 'q', lookX: -.4 }],
      [51.2, 'love', { view: 'q', lookX: -.4 }],
    ]);
    her(1180, 826, 25, {
      ...moodHer,
      aL: lerp(.3, 1.35, give), aR: lerp(.3, 1.30, give),
      boilKey: 'her',
    });
    beatRing(t, 4, 960, 640, 60, 560, '#FFD9A0', 2.0);

    camEnd();
    if (lt < .3) brushWipe(.5 + lt / .6, ['#1E1A38', '#9A7A5A']);
    if (lt > dur - .34) brushWipe((lt - (dur - .34)) / .68, ['#1A1430', '#8A6A8E']);
  }

  // ---------- L：把回忆拼好给你 ----------
  // 碎片拼成球：每片从外面飞向球面上的固定位置
  const BGX = 960, BGY = 430, BGR = 240;
  const PIECES = [];
  for (let i = 0; i < 54; i++) {
    const a = hash(i * 3.1) * TAU, rr = BGR * (.25 + .80 * hash(i * 5.3));
    PIECES.push({
      tx: BGX + Math.cos(a) * rr, ty: BGY + Math.sin(a) * rr,
      a0: hash(i * 7.7) * TAU, r0: 620 + 700 * hash(i * 9.1),
      size: 12 + 20 * hash(i * 11.3), seed: i + 100,
      rot: hash(i * 13.9) * TAU, delay: hash(i * 17.3) * .9,
    });
  }

  function shotL(t, lt, dur) {
    const asm = ease(seg(t, 52.0, 54.35));     // 拼合进度
    const pullK = ease(seg(t, 52.4, 55.4));
    camBegin(960 + 4 * Math.sin(lt * .3), lerp(500, 470, pullK), lerp(1.08, .96, pullK));

    // 回到开场的那片虚空
    nightSky(t, { base: '#1B2140', fx: BGX, fy: BGY - 20, s: 1.0, k: 1.15 });
    stars(t, 92, 1, -200, 900);

    // 光点从四面飞来
    for (let i = 0; i < 30; i++) {
      boilSeed('lp' + i);
      const t0 = 51.8 + i * .06, k = clamp((t - t0) / 1.5);
      if (k <= 0 || k >= 1) continue;
      const a = hash(i * 2.9) * TAU, r0 = 560 + 420 * hash(i + 4);
      const sx = BGX + Math.cos(a) * r0, sy = BGY + Math.sin(a) * r0 * .7;
      const e = easeOut(k);
      const px = lerp(sx, BGX + (hash(i) - .5) * 120, e), py = lerp(sy, BGY + (hash(i + 7) - .5) * 120, e);
      const fade = 1 - k;
      glow(px, py, 26, '#FFD79A', .5 * fade);
      paint(starPts(px, py, 5 + 5 * hash(i), .33, 4), { wash: PAL.cream, washOp: 220 * fade, ink: null });
    }

    // 碎片落位、拼成球
    for (const p of PIECES) {
      const k = ease(clamp((t - 51.95 - p.delay) / 2.3));
      if (k <= 0) continue;
      const sx = BGX + Math.cos(p.a0) * p.r0, sy = BGY + Math.sin(p.a0) * p.r0 * .72;
      const e = easeOut(k);
      // 先螺旋靠近，再贴到球面
      const swirl = (1 - e) * 1.6;
      const x = lerp(sx, p.tx, e) + Math.sin(swirl + p.a0) * 90 * (1 - e);
      const y = lerp(sy, p.ty, e) + Math.cos(swirl + p.a0) * 70 * (1 - e);
      if (k < .995) {
        shard(x, y, Math.max(2, p.size * lerp(1.35, 1, e)), p.rot + swirl * 2, p.seed,
              { a: .35 + .65 * e, glow: .55 });
      }
    }

    // 球壳与球心的光（拼好后浮现）
    const done = ease(seg(t, 53.4, 54.5));
    if (done > .02) {
      glow(BGX, BGY, BGR * 2.6, '#FFCB8C', .34 * done);
      glow(BGX, BGY, BGR * 1.1, '#FFF0D2', .40 * done);
      // 半透明的球体
      if (done > .4) {
        boilSeed('bshell');
        paint(ellPts(BGX, BGY, BGR, BGR, 52, 1.2), { fill: '#FFE3B4', fillOp: 34 * done, bleed: .3, tex: .3, ink: null });
        inkLine(ellPts(BGX, BGY, BGR, BGR, 52, 1.0), 2.6 * done, mixCol(PAL.ink, '#FFE3B4', .25), 'ink', .25);
        inkLine([[BGX - BGR * .58, BGY - BGR * .50], [BGX - BGR * .34, BGY - BGR * .74], [BGX - BGR * .02, BGY - BGR * .86]],
                5 * done, '#FFF6E4', 'ink', .5);
      }
    }
    // 球里的两个人
    if (done > .35) {
      const pairA = seg(done, .35, 1);
      push(); const sc = lerp(.4, 1, easeOut(pairA)); translate(BGX, BGY + 40); scale(sc, sc);
      tinyPair(0, 0, 92, t);
      pop();
    }

    // 他：把球托上去，松手
    const lift = ease(seg(t, 53.6, 54.8));
    const letGo = ease(seg(t, 54.7, 55.4));
    const moodH = emotions(t, [
      [51.7, 'hopeful', { view: 'q', lookY: -1 }],
      [54.3, 'relieved', { view: 'q', lookY: -1 }],
      [55.1, 'love', { view: 'q', lookY: -.4 }],
    ]);
    clawd(960, 900, 23, {
      ...moodH,
      dy: (moodH.dy || 0) - .35 * lift + .1 * letGo,
      aL: lerp(.3, 1.62, lift) * (1 - .45 * letGo),
      aR: lerp(.3, 1.62, lift) * (1 - .45 * letGo),
      boilKey: 'hero',
    });
    // 岩台
    rockIsland(960, 902, 460, 96, 21);

    // 结尾：球升起来，收成一粒星
    const rise2 = ease(seg(t, 54.9, 56.2));
    if (rise2 > .01) {
      glow(BGX, lerp(BGY, -260, rise2), lerp(BGR * 2.6, 90, rise2), '#FFE3B4', .5 * rise2);
      // 一粒越来越亮的星
      const s = lerp(16, 30, easeOut(rise2));
      boilSeed('endstar');
      paint(starPts(BGX, lerp(BGY, -260, rise2), s * (1 + .10 * Math.sin(t * 6)), .30, 5), { wash: PAL.cream, washOp: 250, ink: null });
    }

    camEnd();
    if (lt < .34) brushWipe(.5 + lt / .68, ['#1A1430', '#8A6A8E']);
    // 收尾：从纸色里淡出
    if (t > 55.62) {
      const k = ease(seg(t, 55.62, 56.2));
      paint(rectPts(-60, -60, W + 120, H + 120), { wash: '#0E1226', washOp: 190 * k, ink: null });
    }
  }

  shots([[41.6, shotJ], [48.0, shotK], [51.6, shotL]]);
})();
