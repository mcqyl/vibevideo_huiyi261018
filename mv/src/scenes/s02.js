// s02.js: 第 2 章 · 遇见你，就光明起来（8.2 – 19.0）
// C 8.20–11.9  "直到遇见你 我以为就光明起来"
//   球碎成光点 → 光点聚成一朵云 → 云裂开，一束金光打在 Clawd 身上 → 他抬头，世界第一次亮了
// D 11.9–19.0 "眼睛里看到的都是广袤无垠的大海"
//   镜头拉开，脚下不是岩台而是一片夜海；太阳从海面升起；Clawd 站在浅水里，光铺满整个画面

(() => {

  // ---------- C：光从云缝里下来 ----------
  function shotC(t, lt, dur) {
    const push = ease(seg(t, 8.3, 11.6));
    camBegin(960 + 6 * Math.sin(lt * .5), lerp(560, 520, push), 1.06 + .18 * push);

    nightSky(t, { base: '#0E1330', fx: 960, fy: 640, s: 1.05, k: .8 });
    stars(t, 60, .7, -160, 800);

    // 上一镜头炸开的球：向外散开、渐渐变成光点
    const scat = easeOut(seg(t, 8.2, 9.6));
    for (let i = 0; i < 46; i++) {
      boilSeed('sc' + i);
      const a = hash(i * 2.7) * TAU, d0 = 60 + 220 * hash(i + 3);
      const d = lerp(d0, d0 * (1 + 2.2 * scat), 1) * (1 - .35 * seg(t, 9.4, 10.6));
      const x = 1090 + Math.cos(a) * d * 1.4, y = 400 + Math.sin(a) * d * .9 - 90 * seg(t, 9.6, 11.4);
      const tw = .5 + .5 * Math.sin(t * 4 + i);
      glow(x, y, 26 + 20 * tw, '#FFD9A0', .45 * (1 - .5 * seg(t, 11.0, 11.9)) * tw);
      paint(starPts(x, y, 5 + 6 * hash(i + 7) * tw, .33, 4), { wash: PAL.cream, washOp: 230, ink: null });
    }

    // 云：两团从中间向两侧分开
    const open = ease(seg(t, 9.9, 11.5));
    stormCloud(t, lerp(960, 340, open), lerp(500, 420, open), 560, 230, 3, .5 * (1 - open), 1 - .45 * open);
    stormCloud(t, lerp(960, 1600, open), lerp(470, 380, open), 580, 210, 8, .4 * (1 - open), 1 - .45 * open);

    // 云缝里的光柱（越开越粗）
    const beam = ease(seg(t, 10.0, 11.6));
    if (beam > .02) {
      const bw = lerp(40, 300, beam), bx = 960;
      boilSeed('beam');
      glow(bx, 640, 380 * beam, '#FFE2B4', .55 * beam);
      paint([[bx - bw * .34, 250], [bx + bw * .34, 250], [bx + bw * 1.25, 1000], [bx - bw * 1.25, 1000]],
            { wash: '#FFE9C0', washOp: 55 * beam, fill: '#FFD9A0', fillOp: 40 * beam, bleed: .3, tex: .3, ink: null });
      for (let i = 0; i < 5; i++) {
        const ox = bx - bw * .7 + i * bw * .35;
        inkLine([[ox, 260], [ox + (i - 2) * 26, 1010]], 1.6, '#FFF3D8', 'inkfine', .1);
      }
    }

    // 岩台与 Clawd：他从低头到抬头
    rockIsland(960, 900, 520, 108, 12);
    glow(960, 880, 330, '#FFD08A', .30 + .25 * beam);

    const mood = emotions(t, [
      [8.30, 'sad', { view: 'q', lookY: .5 }],
      [10.30, 'surprised', { view: 'q', lookY: -1 }],
      [11.10, 'hopeful', { view: 'q', lookY: -1 }],
      [11.70, 'happy' ],
    ]);
    const up = jump(t, 11.14, 11.44, 2.0);
    clawd(960, 898, 21, {
      ...mood,
      dy: (mood.dy || 0) + up.dy,
      sq: (mood.sq || 0) + up.sq,
      boilKey: 'hero',
    });

    camEnd();
    // 接上一镜头盖满的笔刷，继续扫开（否则会变成硬切）
    if (lt < .26) brushWipe(.5 + lt / .52, ['#3A2A56', '#C08A4A']);
    if (lt < .30) flash(.14 * (1 - seg(lt, 0, .30)), '#FFE9C4');
    // 接上一镜头的"雾"，最后擦掉（必须画在 flash 之后，否则切点会露白）
    const uncoverA = 1 - ease(seg(lt, 0, .26));
    if (uncoverA > .01) paint(rectPts(-60, -60, W + 120, H + 120), { wash: '#241A38', washOp: 255 * uncoverA, ink: null });
    if (lt > dur - .3) brushWipe((lt - (dur - .3)) / .6, ['#2A3A66', '#7FA6C8']);
  }

  // ---------- D：夜海 ----------
  const SEA = 470;
  function shotD(t, lt, dur) {
    const rise = ease(seg(t, 12.2, 15.4));          // 太阳升起
    const pull = ease(seg(t, 12.0, 17.6));          // 镜头后拉，露出整片海
    camBegin(960 + 8 * Math.sin(lt * .35), lerp(600, 540, pull), lerp(1.06, .96, pull));

    seaScape(t, { hor: SEA, warm: .45 + .55 * rise });

    // 太阳：从海面升起来
    const sunY = lerp(SEA + 40, SEA - 196, rise), sunX = 1200;
    const sunR = 74;
    glow(sunX, sunY, 500, '#FFB877', .55 + .25 * rise);
    glow(sunX, sunY, 200, '#FFE6BC', .60 + .20 * rise);
    boilSeed('sun');
    paint(ellPts(sunX, sunY, sunR, sunR * (1 - .30 * (1 - rise)), 30, 1.4),
          { wash: '#FFD79A', fill: '#FFF0CE', fillOp: 130, bleed: .18, tex: .4, ink: PAL.ink, sw: 2.0 });
    // 太阳在水面的倒影
    if (rise > .05) for (let i = 0; i < 12; i++) {
      boilSeed('sr' + i);
      const yy = SEA + 14 + i * i * .8 + i * 7;
      if (yy > 1000) break;
      const w = 24 + i * 13;
      const x = sunX + Math.sin(t * 1.2 + i * .7) * (6 + i * 2);
      const a = (.55 - i * .03) * rise;
      inkLine([[x - w, yy], [x, yy - 3], [x + w, yy]], clamp(4.6 - i * .22, .8, 4.6), '#FFD9A8', 'dry', .35);
      glow(x, yy, 50, '#FFC98C', a * .35);
    }

    // 远处被照亮的云
    cloudBack(t, 300, 250, 300, 62, 21, .55);
    cloudBack(t, 1660, 180, 260, 54, 33, .70);
    cloudBack(t, 1150, 110, 200, 42, 47, .40);

    // 浅水与倒影
    boilSeed('wet');
    paint(ellPts(620, 822, 430, 78, 34, 4), { wash: '#4A6E96', washOp: 170, fill: '#8FB6C8', fillOp: 70, tex: .5, ink: null });

    const mood = emotions(t, [
      [11.95, 'starstruck', { view: 'q', lookX: .55, lookY: -.9 }],
      [15.10, 'happy', { view: 'q', lookX: .3, lookY: -.2 }],
      [17.40, 'love', { view: 'q', lookX: .2 }],
    ]);
    const hop = jump(t, 13.30, 13.62, 1.8), hop2 = jump(t, 15.20, 15.50, 1.6);
    clawd(620, 820, 24, {
      ...mood,
      dy: (mood.dy || 0) + hop.dy + hop2.dy,
      sq: (mood.sq || 0) + hop.sq + hop2.sq,
      boilKey: 'hero',
    });
    // 水里的倒影：压扁、变暗、上下颠倒
    boilSeed('refl');
    push(); translate(620, 838); scale(1, -.40);
    clawd(0, 0, 24, { ...mood, col: mixCol(PAL.clay, '#2A4470', .42), dk: mixCol(PAL.clayDk, '#2A4470', .42),
      lt: mixCol('#F5B394', '#2A4470', .40), tint: null, noShadow: true, boilKey: 'refl' });
    pop();
    for (let i = 0; i < 6; i++) {
      boilSeed('wr' + i);
      const yy = 842 + i * 11;
      inkLine([[470 + i * 12, yy], [620, yy - 3], [770 - i * 14, yy]], 2.2, '#B9D2E8', 'inkfine', .5);
    }
    beatRing(t, 7, 620, 820, 60, 460, '#FFD9A0', 2.0);

    camEnd();
    if (lt < .30) brushWipe(.5 + lt / .6, ['#2A3A66', '#7FA6C8']);
    if (lt > dur - .3) brushWipe((lt - (dur - .3)) / .6, ['#243F5E', '#C7B48A']);
  }

  // ---------- E：她来了（15.6 新切一镜，原来这一整句没有任何画面事件） ----------
  // 她从海面那侧的晨光里走过来，手里拎着装满光点的玻璃罐；他回头，跳下浅水迎上去。
  const CE = 620;   // 地平线：比 shotD 略低一点（镜头更近、更贴海面）
  const EG = 872;   // 地面线（水面）
  function shotE(t, lt, dur) {
    const walk = stroll(t, 15.66, 16.90, 1620, 1130, 24);
    const nearK = ease(seg(t, 15.7, 18.4));
    camBegin(lerp(960, 990, nearK) + 5 * Math.sin(lt * .5), lerp(575, 545, nearK), lerp(1.04, 1.14, nearK));

    seaScape(t, { hor: CE, warm: 1.05 });
    // 晨光更浓：一层暖雾压在海上
    boilSeed('warmhaze');
    glow(1300, CE + 10, 700, '#FFC98C', .40);
    glow(1300, CE + 6, 340, '#FFE6C0', .32);

    // 太阳（比 shotD 更近更大，压在右上，给"她从光里走出来"一个光源）
    glow(1420, CE - 150, 460, '#FFB877', .58);
    glow(1420, CE - 150, 180, '#FFF0CE', .50);
    boilSeed('sunE');
    paint(ellPts(1420, CE - 150, 82, 82, 30, 1.4), { wash: '#FFD79A', fill: '#FFF0CE', fillOp: 140, ink: PAL.ink, sw: 2.0 });

    // 远处被照亮的云
    cloudBack(t, 340, CE - 250, 300, 60, 61, .55);
    cloudBack(t, 1560, CE - 300, 260, 52, 67, .65);

    // 浅水带（他脚下、她走过的路）
    boilSeed('wetE');
    paint(ellPts(960, EG + 10, 940, 84, 40, 4), { wash: '#5C82A8', washOp: 150, fill: '#A8C6D8', fillOp: 60, tex: .5, ink: null });

    // —— 她：从右侧走来，罐头在手上 ——
    const moodHer = emotions(t, [
      [15.68, 'happy', { view: 'q', lookX: -.6, lookY: .1 }],
      [17.10, 'shy', { view: 'q', lookX: -.7 }],
      [18.20, 'love', { view: 'q', lookX: -.7 }],
    ]);
    her(walk.x, EG, 24, {
      ...moodHer, walk: walk.walk, view: walk.view, flip: true,
      aL: .55 + .10 * Math.sin(bpOf(t) * Math.PI),
      boilKey: 'her',
    });
    // 她手上的罐子（跟着走）
    jar(t, walk.x - 46, EG - 24 * 4.6, 20, .7, {});
    // 罐子上的一圈暖光，像拎着一盏灯
    glow(walk.x - 46, EG - 24 * 5.2, 120, '#FFCE8A', .40);

    // —— 他：先回头，再跳下浅水往前迎 ——
    const lookBack = turn(t, 16.10, 16.44, .25, 0);
    const hop = jump(t, 16.86, 17.18, 2.2);
    const moodH = emotions(t, [
      [15.66, 'happy', { view: 'q', lookX: .4, lookY: -.1 }],
      [16.10, 'surprised', { view: 'q', lookX: .9, lookY: 0 }],
      [16.50, 'excited', { view: 'q', lookX: .9 }],
      [17.30, 'laugh', { view: 'q', lookX: .8 }],
    ]);
    const hx = lerp(620, 760, ease(seg(t, 16.9, 17.8)));
    clawd(hx, EG + 2, 24, {
      ...moodH, ...lookBack,
      dy: (moodH.dy || 0) + hop.dy,
      sq: (moodH.sq || 0) + hop.sq,
      aR: lerp(moodH.aR ?? .4, 1.5, ease(seg(t, 17.0, 17.4))),
      boilKey: 'hero',
    });
    // 踩水的倒影
    boilSeed('reflE');
    push(); translate(hx, EG + 16); scale(1, -.34);
    clawd(0, 0, 24, { ...moodH, col: mixCol(PAL.clay, '#2A4470', .45), dk: mixCol(PAL.clayDk, '#2A4470', .45),
      lt: mixCol('#F5B394', '#2A4470', .42), tint: null, noShadow: true, boilKey: 'reflE' });
    pop();
    // 踩起来的涟漪（落在拍上）
    for (let i = 0; i < 3; i++) {
      const t0 = 16.9 + i * .62, k = seg(t, t0, t0 + .8);
      if (k <= 0 || k >= 1) continue;
      inkLine(ellPts(hx, EG + 14, 60 + 240 * easeOut(k), 12 + 48 * easeOut(k), 30, 2), 2.4 * (1 - k), '#DCF0FF', 'ink', .4);
    }
    beatRing(t, 6, walk.x, EG - 10, 40, 320, '#FFD9A0', 1.8);

    // —— 17.4 之后补一个事件：她把罐子递过去，罐里飞出光点绕两人一圈 ——
    const hand = ease(seg(t, 17.42, 18.02));
    if (hand > .01) {
      // 罐子从她手里移到两人中间
      const jx = lerp(walk.x - 46, 1030, hand), jy = EG - 24 * 4.6 - 60 * Math.sin(hand * Math.PI);
      // 罐里飘出的光点：绕两人做一圈，落在拍上
      for (let i = 0; i < 14; i++) {
        boilSeed('orbit' + i);
        const t0 = 17.5 + i * .07, k = clamp((t - t0) / 1.1);
        if (k <= 0 || k >= 1) continue;
        const ang = hash(i * 3.3) * TAU + t * 1.1;
        const rr = 150 + 190 * hash(i + 5);
        const cx0 = lerp(760, 900, .5), cy0 = EG - 120;
        const px = cx0 + Math.cos(ang) * rr * k, py = cy0 + Math.sin(ang) * rr * .42 * k;
        glow(px, py, 26, '#FFD79A', .55 * (1 - k * .4));
        paint(starPts(px, py, 5 + 5 * hash(i + 2), .33, 4), { wash: PAL.cream, washOp: 240 * (1 - k * .3), ink: null });
      }
      // 递出去的那一下：一圈光从罐口扩散
      const k2 = seg(t, 17.95, 18.6);
      if (k2 > 0 && k2 < 1) {
        inkLine(ellPts(1030, EG - 150, 40 + 260 * easeOut(k2), 30 + 110 * easeOut(k2), 32, 2),
                2.6 * (1 - k2), '#FFE9C0', 'ink', .4);
        glow(1030, EG - 150, 200 * (1 - k2 * .5), '#FFD08A', .45 * (1 - k2));
      }
    }

    camEnd();
    // 入镜：接 shotD 的笔刷（同色同速）
    if (lt < .30) brushWipe(.5 + lt / .6, ['#243F5E', '#C7B48A']);
    if (lt > dur - .30) brushWipe((lt - (dur - .30)) / .60, ['#243F5E', '#C7B48A']);
  }

  shots([[8.2, shotC], [11.9, shotD], [15.6, shotE]]);
})();
