// s03.js: 第 3 章 · 有你在，最灰暗的日子（19.0 – 25.4）
// E 19.0–22.3  "在最灰暗的日子里 你陪着我发呆"
//   海退成一片灰色的荒地，乌云压下来开始下雨；她撑着伞出现，在他身边坐下；他抬头看她。
// F 22.3–25.4  "你让我学会如何拨开阴霾"
//   她抬手一挥，一只手把乌云像幕布一样撕开一道口子，光落下来。

(() => {
  const GND = 846;   // 地面线

  // ---------- 灰暗的荒地 ----------
  function greyField(t, dark) {
    boilSeed('gf');
    // 天：一层压着一层的铅灰，越往下越暗
    paint(rectPts(-900, -900, W + 1800, H + 1800), { wash: mixCol('#4A4A62', '#2A2A3E', dark), ink: null });
    paint([[-900, -900], [W + 900, -900], [W + 900, 520], [W * .35, 600], [-900, 500]], { fill: '#2E2E44', fillOp: 150, bleed: .34, tex: .5, ink: null });
    glow(960, 620, 900, '#5A5470', .40);
    // 远山：两笔几乎融进雾里的轮廓
    for (let i = 0; i < 2; i++) {
      boilSeed('gh' + i);
      const yy = 660 + i * 60;
      paint(ellPts(i ? 1500 : 380, yy + 80, 900, 160 - i * 30, 34, 5),
            { wash: mixCol('#3E3E56', '#2C2C40', dark), fill: '#20202F', fillOp: 90, tex: .5, ink: PAL.ink, sw: .8 });
    }
    // 地面：一条横带，几笔碎石
    boilSeed('gnd');
    paint([[-900, GND - 18], [W * .3, GND - 30], [W * .66, GND - 16], [W + 900, GND - 26],
           [W + 900, 1400], [-900, 1400]], { wash: mixCol('#3A3A50', '#26263A', dark), fill: '#1A1A28', fillOp: 100, tex: .6, ink: PAL.ink, sw: 1.4 });
    for (let i = 0; i < 26; i++) {
      boilSeed('rk' + i);
      const x = hash(i) * W, y = GND + 20 + hash(i + 5) * 180, r = 5 + 12 * hash(i + 9);
      paint(ellPts(x, y, r * 1.6, r, 10, 1.2), { wash: mixCol('#4A4A62', '#2E2E44', dark), ink: PAL.ink, sw: .6 });
    }
    // 几根枯草
    for (let i = 0; i < 20; i++) {
      boilSeed('dw' + i);
      const x = hash(i + 30) * W, h = 26 + 34 * hash(i + 3);
      const sway = Math.sin(t * 1.2 + i) * 4;
      inkLine([[x, GND + 26], [x + sway * .5, GND + 26 - h * .6], [x + sway, GND + 26 - h]], 1.5,
              mixCol('#6A6450', '#3A3A2E', .3), 'ink', .45);
    }
  }

  // ---------- 伞 ----------
  function umbrella(x, y, s, tilt, a = 1, col = '#C0637B') {
    if (a <= .02) return;
    boilSeed('umb');
    push(); translate(x, y); rotate(tilt);
    const r = 84 * s / 20, h = 40 * s / 20;
    // 伞面：三段弧拼起来
    const pts = [];
    for (let i = 0; i <= 12; i++) { const u = i / 12; pts.push([-r + 2 * r * u, -h * Math.sin(u * Math.PI) * .55 - h * .30]); }
    for (let i = 12; i >= 0; i--) { const u = i / 12; pts.push([-r + 2 * r * u, -h * Math.sin(u * Math.PI) * -.10 + h * .10]); }
    paint(pts, { wash: col, washOp: 250 * a, fill: '#E8A838', fillOp: 40 * a, bleed: .1, tex: .5, ink: PAL.ink, sw: 1.8 });
    // 伞骨
    for (let i = 0; i < 3; i++) {
      const u = .2 + i * .3;
      inkLine([[-r + 2 * r * u, -h * Math.sin(u * Math.PI) * .55 - h * .30], [-r + 2 * r * u, h * .10]], 1.1, mixCol(col, PAL.ink, .45), 'inkfine', .3);
    }
    // 伞柄
    inkLine([[0, -h * .28], [0, h * 1.5], [10 * s / 20, h * 1.72]], 3.2 * s / 20, '#6A4A38', 'ink', .3);
    pop();
  }

  // ---------- 全屏雨幕 ----------
  // 斜雨横扫整个画面（这是"雨"最有效的画法：全屏动态，比零星雨点显眼得多）。
  // 每拍一波：一波雨线在拍点被"推"下来，然后淡出，画面因此有节拍感。
  function rainCurtain(t, dens = 1, a = 1, slant = .30) {
    if (a <= .02) return;
    const bp = bpOf(t), bi = Math.floor(bp), bf = bp - bi;
    const wave = Math.exp(-bf * 2.4);                     // 拍点最强
    const n = Math.round(78 * dens);
    for (let i = 0; i < n; i++) {
      boilSeed('rain' + i);
      const seed = hash(i * 3.31), sp = .55 + .85 * hash(i + 7);
      const drift = frac(seed + t * sp * 1.9 + bf * .10);
      const x = hash(i * 5.7) * (W + 520) - 260 + drift * 120 + t * 46 * slant;
      const y0 = -120 + drift * (H + 320);
      const len = 60 + 90 * hash(i + 3);
      const aa = a * (.10 + .34 * hash(i + 11)) * (.55 + .75 * wave);
      // 一道斜雨：主笔 + 一道更细的伴笔（拖尾）
      inkLine([[x, y0], [x + len * slant, y0 + len]], 3.4, '#E4EFFA', 'ink', 0);
      inkLine([[x - 9 * slant, y0 - len * .5], [x - 9 * slant + len * slant * .5, y0 - len * .5 + len * .5]],
              1.8, '#FFFFFF', 'inkfine', 0);
    }
    // 雨的整体氛围：一层冷色薄雾（压低对比，让雨"在空气里"）
    paint(rectPts(-60, -60, W + 120, H + 120), { wash: '#8AA4C4', washOp: 22 * a * (.6 + .5 * wave), ink: null });
    // 落地溅起的整排水花（贴着地面，最容易被看见）
    for (let i = 0; i < 14; i++) {
      boilSeed('gr' + i);
      const gx = hash(i * 4.7) * (W + 200) - 100 + Math.sin(t * .7 + i) * 10;
      const ph = frac(hash(i + 9) + t * 1.7);
      const gy = GND + 26 + hash(i) * 120;
      const rr = 8 + 16 * ph;
      if (ph < .45) inkLine(ellPts(gx, gy, rr, rr * .28, 10, 1), 1.8, '#DCEBF8', 'inkfine', .5);
    }
  }

  // 水花：一圈飞溅的小珠（踩水、伞上落水都用）
  function splash(cx, cy, k, n = 12, col = '#D8E8F8', spread = 1) {
    if (k <= .01 || k >= 1) return;
    for (let i = 0; i < n; i++) {
      boilSeed('spl' + i + Math.round(cx));
      const a = -Math.PI * (.15 + .70 * (i / Math.max(1, n - 1)));
      const sp = (90 + 140 * hash(i + 4)) * spread;
      const p = arcPt([cx, cy], [cx + Math.cos(a) * sp, cy + Math.sin(a) * sp * .6], 120 * spread, k);
      const r = (5 + 7 * hash(i + 2)) * (1 - k * .55);
      if (r < .8) continue;
      paint(ellPts(p[0], p[1], r, r * 1.15, 8), { wash: col, washOp: 235 * (1 - k * .5), ink: null });
    }
  }

  // ---------- E ----------
  function shotE(t, lt, dur) {
    const dark = ease(seg(t, 19.0, 20.2));
    const camK = ease(seg(t, 19.2, 22.2));
    camBegin(lerp(900, 930, camK) + 5 * Math.sin(lt * .4), lerp(600, 560, camK), lerp(1.05, 1.16, camK));

    greyField(t, dark);
    stars(t, 0, 0);

    // 乌云压顶 + 雨
    stormCloud(t, 940, 190, 620, 180, 5, dark, .3 + .7 * dark);
    stormCloud(t, 1760, 120, 380, 130, 11, dark * .8, .25 + .6 * dark);
    // 闪电（每 4 拍来一次，很短）
    const fl = Math.max(0, pulse(t, 14) - .55) / .45;
    if (fl > .02 && beatN(t) % 8 === 5) {
      boilSeed('lit');
      const bx = 1600 + 60 * hash(beatN(t));
      const P = [[bx, 210], [bx - 30, 330], [bx + 12, 350], [bx - 34, 470], [bx + 6, 486], [bx - 26, 600]];
      inkLine(P, 3.4, '#DCE4FF', 'ink', .1);
      glow(bx - 10, 380, 520, '#C8D4FF', .55 * fl);
    }
    if (fl > .02) flash(.10 * fl, '#DCE4FF');

    // 全屏雨幕（19.2 起越下越大；这是这段最主要的动态）
    rainCurtain(t, .95, ease(seg(t, 19.05, 20.4)), .32);

    // ---- 两人 ----
    // 他：坐着发呆（squash 压扁，表现"缩着"）
    const moodH = emotions(t, [
      [19.05, 'bored', { view: 'q', lookY: .4, lookX: -.2 }],
      [21.30, 'hopeful', { view: 'q', lookY: -.1 }],
    ]);
    const flinch = take(t, 20.06, .55);       // 一滴雨砸到头上，缩一下
    const pullK = ease(seg(t, 20.94, 21.62)); // 被她拉起来
    clawd(700, GND, 23, {
      ...moodH,
      // 站起来的三个变化：squash 收回去（从缩着到挺直）、整体上提、手臂上扬
      sq: (moodH.sq || 0) + .10 * (1 - pullK) + flinch.sq * (1 - pullK),
      dy: (moodH.dy || 0) - .2 * (1 - pullK) + flinch.dy * (1 - pullK) - 1.1 * pullK,
      aL: lerp(moodH.aL ?? .2, 1.35, pullK),
      boilKey: 'hero',
    });
    // 那滴雨的溅开
    splash(700, GND - 23 * 8.4, seg(t, 20.06, 20.5), 8, '#DCE8F6', .55);

    // 她：从右边走进来，收伞，坐下
    const walk = stroll(t, 19.42, 20.78, 1760, 900, 23);
    const sit = ease(seg(t, 20.78, 21.26));
    // 走进来的每一步：踩水花 + 落拍的小跳（原来她只是平移，画面几乎不动）
    const stepT = 19.42 + Math.round((t - 19.42) / .30) * .30;
    const inWalk = t > 19.42 && t < 20.78;
    if (inWalk) splash(walk.x - 20, GND + 8, clamp((t - stepT) / .38), 9, '#C6DCF0', .85);
    const moodHer = emotions(t, [
      [19.6, 'happy', { view: 'q', lookX: -.6 }],
      [21.40, 'shy', { view: 'q', lookX: -.7 }],
      [23.60, 'determined', { view: 'q', lookX: -.4 }],
    ]);
    her(walk.x, GND + 4, 23, {
      ...moodHer,
      dy: (moodHer.dy || 0) + .08 * sit + (walk.dy || 0) * 1.6,
      sq: (moodHer.sq || 0) + .12 * sit,
      walk: walk.walk, view: walk.view, flip: false,
      boilKey: 'her',
    });
    // 伞：跟着她走，坐下后收到身侧
    const ux = lerp(walk.x + 40, 950, sit), uy = GND - 80 - 10 * sit;
    const swing = (inWalk ? .16 * Math.sin(bpOf(t) * Math.PI) : 0) + .03 * Math.sin(t * .8);
    const shut = seg(t, 21.5, 22.35);      // 收伞（有个明显的"抖一下"）
    umbrella(ux, uy, 23, lerp(-.13, .22, sit) + swing + .10 * Math.sin(shut * Math.PI),
             1 - .70 * shut, '#C0637B');
    // 收伞时甩出来的一圈水
    splash(ux, uy + 30, seg(t, 21.55, 22.05), 14, '#DCF0FF', 1.5);

    // 雨点打在伞上溅开的小白点
    if (dark > .5) for (let i = 0; i < 10; i++) {
      boilSeed('sp' + i);
      const ph = frac(t * 1.7 + i * .37);
      const px = ux - 70 + i * 16 + Math.sin(i * 2) * 6, py = uy - 40 + ph * 8;
      if (Math.abs(px - ux) < 80) inkLine([[px - 6, py], [px, py - 7], [px + 6, py]], 1.2, '#D8E4F4', 'inkfine', 0);
    }

    // —— 20.9 起：她伸手，把坐着的他拉起来（这一段最需要的"事件"） ——
    const pull = pullK;
    if (pull > .01) {
      // 她的手臂伸向他
      her(walk.x, GND + 4, 23, {
        ...moodHer,
        dy: (moodHer.dy || 0) + .08 * sit + (walk.dy || 0) * 1.6,
        sq: (moodHer.sq || 0) + .12 * sit,
        walk: walk.walk, view: walk.view, flip: false,
        aL: lerp(.35, 1.42, pull),
        boilKey: 'her',
      });
      // 他被拉起来的位移（从坐姿"缩着"到站直）
      // 已经在下面 clawd 里用 pull 处理
      // 手臂相接处的一点光（接触确认）
      const hx2 = lerp(700, 790, pull), hy2 = lerp(GND - 90, GND - 150, pull);
      glow(hx2, hy2, 90 * pull, '#FFE0AE', .5 * pull);
      if (pull > .5) {
        const k = seg(t, 21.5, 22.2);
        if (k < 1) inkLine(ellPts(760, GND - 60, 50 + 220 * easeOut(k), 20 + 70 * easeOut(k), 28, 2),
                           2.6 * (1 - k), '#FFE9C0', 'ink', .4);
      }
    }

    camEnd();
    if (lt < .3) brushWipe(.5 + lt / .6, ['#243F5E', '#C7B48A']);
    if (lt > dur - .28) brushWipe((lt - (dur - .28)) / .56, ['#3B3B52', '#8E8CA0']);
  }

  // ---------- F：撕开乌云 ----------
  const TEAR = [[1090, 300], [1040, 380], [1074, 430], [1010, 520], [1052, 566], [980, 660], [1010, 760]];

  function shotF(t, lt, dur) {
    const k = ease(seg(t, 22.55, 23.60));
    const sh = ring(t, [22.52], 5, 24);
    camBegin(940 + 4 * sh, lerp(556, 520, k), 1.08 + .10 * k);

    greyField(t, 1 - .85 * k);

    // 乌云被撕开：两团向左右退，中间留出一道光
    const open = ease(seg(t, 22.55, 23.8));
    stormCloud(t, lerp(940, 380, open), lerp(180, 150, open), 620, 180, 5, (1 - open) * .8, 1 - .5 * open);
    stormCloud(t, lerp(1760, 2300, open), lerp(120, 90, open), 380, 130, 11, (1 - open) * .6, 1 - .5 * open);
    if (open > .4) stormCloud(t, lerp(2100, 2500, open), -20, 420, 150, 17, 0, open * .8);

    // 撕口：一道锯齿状的光缝，边缘是金色的毛边
    if (k > .01) {
      boilSeed('tear');
      const n = Math.max(2, Math.ceil(TEAR.length * k));
      const P = TEAR.slice(0, n);
      glow(P[P.length - 1][0], P[P.length - 1][1], 300, '#FFE0A8', .70 * k);
      inkLine(P, 10, '#FFE9C0', 'ink', .2);
      inkLine(P, 3.4, '#FFF8E8', 'ink', .2);
      // 缝里涌出的光
      const bx = 1040 + 24 * Math.sin(t * .9), bw = lerp(30, 210, k);
      paint([[bx - bw * .22, 250], [bx + bw * .22, 250], [bx + bw * .95, 1000], [bx - bw * .95, 1000]],
            { wash: '#FFF0CE', washOp: 70 * k, fill: '#FFD79A', fillOp: 55 * k, bleed: .3, tex: .3, ink: null });
      glow(bx, 620, 420 * k, '#FFD08A', .55 * k);
      // 光的碎片/尘埃从缝里飘落
      for (let i = 0; i < 18; i++) {
        boilSeed('fd' + i);
        const ph = frac(t * .35 + hash(i) * 1.2);
        const px = bx + (hash(i + 4) - .5) * 340 * k + Math.sin(t * 1.1 + i) * 18;
        const py = 300 + ph * 620;
        glow(px, py, 16 + 14 * hash(i), '#FFE3B4', (.16 + .22 * hash(i + 2)) * k * (1 - ph));
      }
    }

    // 她挥手的余势 + 他抬头看
    const moodHer = emotions(t, [
      [22.30, 'determined', { view: 'q', lookX: .5, lookY: -.6 }],
      [23.60, 'hopeful', { view: 'q', lookX: .2, lookY: -.5 }],
    ]);
    const swipe = seg(t, 22.38, 22.90);
    her(900, GND + 4, 23, {
      ...moodHer, sq: (moodHer.sq || 0) + .12,
      aR: lerp(-.6, 2.1, easeOut(swipe)) - .5 * ease(seg(t, 22.9, 23.4)),
      aL: .3,
      boilKey: 'her',
    });
    umbrella(950, GND - 80, 23, .18, .45 - .45 * seg(t, 22.4, 23.2), '#C0637B');

    const moodH = emotions(t, [
      [22.30, 'bored', { view: 'q', lookY: .3 }],
      [22.80, 'surprised', { view: 'q', lookY: -1 }],
      [23.70, 'hopeful', { view: 'q', lookY: -1 }],
    ]);
    clawd(700, GND, 23, { ...moodH, sq: (moodH.sq || 0) + .1 * (1 - seg(t, 22.8, 23.4)), boilKey: 'hero' });
    beatRing(t, 6, 1040, 620, 50, 620, '#FFD9A0', 2.2);

    camEnd();
    if (lt < .28) brushWipe(.5 + lt / .56, ['#3B3B52', '#8E8CA0']);
    if (lt > dur - .30) brushWipe((lt - (dur - .30)) / .60, ['#2A3A66', '#7FA6C8']);
  }

  shots([[19.0, shotE], [22.3, shotF]]);
})();
