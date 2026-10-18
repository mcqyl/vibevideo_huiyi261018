// props2.js: 后半段要用的道具与第二个角色（"她"）——一片海、云、玻璃罐、烟花、钟面、花。
// 全部是 t 的纯函数；每个元件单独 boilSeed。

// ---------- 她：粉色的 Clawd，头顶一朵花（母题） ----------
const HER = { col: '#EE9AAE', dk: '#C0637B', lt: '#FBD0DA' };
function her(x, y, u, o = {}) {
  clawd(x, y, u, { ...o, col: HER.col, dk: HER.dk, lt: HER.lt, tint: null, hat: o.hat === null ? null : (o.hat || 'flower') });
}

// ---------- 云 ----------
function cloudPts(cx, cy, rx, ry, seed, n = 30) {
  const p = [];
  for (let i = 0; i < n; i++) {
    const a = i / n * TAU, up = Math.sin(a) < 0;
    const bump = 1 + (up ? .40 : .07) * Math.abs(Math.sin(a * 3 + seed));
    p.push([cx + Math.cos(a) * rx * bump, cy + Math.sin(a) * ry * (up ? bump : 1)]);
  }
  return p;
}
// 一团压在天上的乌云，drip = 雨丝密度
function stormCloud(t, cx, cy, rx, ry, seed, drip = 1, a = 1) {
  if (a <= .03) return;
  boilSeed('cl' + seed);
  paint(cloudPts(cx, cy, rx, ry, seed), { wash: '#3B3A5A', washOp: 245 * a, fill: '#20203A', fillOp: 110 * a, bleed: .12, tex: .6, ink: PAL.ink, sw: 1.6 });
  paint(ellPts(cx - rx * .2, cy - ry * .34, rx * .52, ry * .34, 26, 4), { fill: '#5C5A80', fillOp: 90 * a, bleed: .2, tex: .5, ink: null });
  if (drip > .01) for (let i = 0; i < 16; i++) {
    boilSeed('dr' + i + seed);
    const px = cx - rx * .84 + i * rx * .105 + Math.sin(i * 2.1) * 12;
    const ph = frac(t * 1.5 + hash(i + seed) * 1.4);
    const y0 = cy + ry * .5 + ph * ry * 1.5;
    if (y0 > cy + ry * 2.2) continue;
    inkLine([[px, y0], [px - 4, y0 + 26 + 12 * hash(i)]], 1.6 * drip * a, '#9FB6D8', 'inkfine', 0);
  }
}

// ---------- 一片海：地平线 + 水面横笔触 + 星子倒影 ----------
// 分层：夜空 → 远云 → 海平线 → 远海（亮）→ 近海（暗）→ 碎光。近海用更亮的蓝，海才有厚度。
function seaScape(t, o = {}) {
  const hor = o.hor ?? 620, warm = o.warm ?? .55;
  boilSeed('sea');
  // 夜空
  paint(rectPts(-900, -900, W + 1800, hor + 900), { wash: '#2A3566', ink: null });
  glow(W * .60, hor - 30, 1250, '#3E4C88', .70);
  glow(W * .62, hor + 6, 780, '#C07A46', .60 * warm);
  glow(W * .62, hor, 420, '#FFC287', .55 * warm);
  // 天顶压暗
  paint([[-900, -900], [W + 900, -900], [W + 900, hor - 150], [W * .4, hor - 60], [-900, hor - 170]], { fill: '#151B3E', fillOp: 120, bleed: .34, tex: .4, ink: null });
  // 星
  for (let i = 0; i < 34; i++) {
    boilSeed('sst' + i);
    const x = hash(i + 3) * W, y = hash(i + 71) * (hor - 150) - 60;
    const tw = .45 + .55 * Math.sin(t * (1.2 + hash(i) * 2) + i);
    paint(starPts(x, y, (2.6 + 5.2 * hash(i + 5)) * (.5 + .5 * tw), .33, 4), { wash: PAL.cream, washOp: 100 + 140 * tw, ink: null });
    if (hash(i + 40) > .82) glow(x, y, 62 * tw, '#FFE3B8', .32 * tw);
  }
  // 远海 → 近海：三条色阶，越近越亮一点（水越浅越亮）
  paint(rectPts(-900, hor, W + 1800, 190), { wash: '#2E4470', ink: null });
  paint(rectPts(-900, hor + 150, W + 1800, 260), { wash: '#25395E', ink: null });
  paint(rectPts(-900, hor + 360, W + 1800, 900), { wash: '#1B2C4C', ink: null });
  // 地平线的亮线
  boilSeed('hzl');
  inkLine([[-300, hor + 2], [W * .45, hor - 2], [W + 300, hor + 3]], 2.4, '#FFDBAC', 'ink', .25);
  glow(W * .5, hor + 2, 1000, '#FFC287', .30 * warm);
  // 暖光在水上的倒影：一列竖向碎光，越近越宽
  for (let i = 0; i < 30; i++) {
    boilSeed('rf' + i);
    const yy = hor + 10 + i * i * .42 + i * 5;
    if (yy > 1120) break;
    const spread = 26 + i * 11;
    const w = Math.max(12, spread * (.45 + .55 * Math.abs(Math.sin(t * 1.5 + i * .8))));
    const x = W * .62 + Math.sin(t * .75 + i * .6) * (8 + i * 2);
    inkLine([[x - w, yy], [x, yy - 3], [x + w, yy]], clamp(4.4 - i * .07, 1.0, 4.4), '#FFCE97', 'dry', .35);
    if (i % 3 === 0) glow(x, yy, 46, '#FFC98C', .30 * warm);
  }
  // 水面的横向笔触（一层层推向岸边）：远细近粗
  for (let i = 0; i < 24; i++) {
    boilSeed('wv' + i);
    const yy = hor + 12 + i * i * .62 + i * 6;
    if (yy > 1130) break;
    const pts = [], n = 10;
    for (let k = 0; k <= n; k++) {
      const x = -140 + k / n * (W + 280);
      pts.push([x, yy + Math.sin(k * .75 + t * 1.3 + i * .55) * (2.5 + i * .55)]);
    }
    inkLine(pts, clamp(.9 + i * .11, 1, 3.4), mixCol('#5C82B4', '#C6DDEF', .20 + .30 * hash(i * 3.1)), 'ink', .6);
  }
  // 近岸的一层浅水（更亮，交代"站在水里"）
  boilSeed('shal');
  paint([[-900, 1000], [W * .3, 980], [W * .62, 1010], [W + 900, 986], [W + 900, 1400], [-900, 1400]],
        { wash: '#35557E', fill: '#8FB6C8', fillOp: 60, bleed: .3, tex: .5, ink: null });
}

// ---------- 玻璃罐：把光点收进来 ----------
function jar(t, x, y, s, fillK = 0, o = {}) {
  boilSeed('jar');
  const sw = clamp(s / 16, .5, 1.6);
  // 罐里的光
  if (fillK > .02) {
    const h = 120 * s / 16 * fillK;
    glow(x, y - h * .5, 130 * (s / 16) * (.5 + fillK), '#FFCE8A', .55 * fillK);
    paint(rrPts(x - 42 * s / 16, y - h, 84 * s / 16, h, 18 * s / 16, 2), { wash: '#FFD79A', washOp: 150 * fillK, fill: '#FFF0CE', fillOp: 90 * fillK, bleed: .2, ink: null });
    for (let i = 0; i < 12; i++) {
      boilSeed('jf' + i);
      const px = x - 34 * s / 16 + hash(i) * 68 * s / 16, py = y - h * (.15 + .8 * hash(i + 5));
      paint(starPts(px, py, 4 * s / 16 * (0.7 + .3 * Math.sin(t * 3 + i)), .35, 4), { wash: PAL.cream, ink: null });
    }
  }
  // 罐体
  paint(rrPts(x - 46 * s / 16, y - 128 * s / 16, 92 * s / 16, 128 * s / 16, 20 * s / 16, 1.5),
        { wash: '#9DB6CC', washOp: 60, fill: '#DDF0FF', fillOp: 60, bleed: .12, tex: .4, ink: PAL.ink, sw: sw * 1.1 });
  // 瓶颈与盖
  paint(rrPts(x - 26 * s / 16, y - 150 * s / 16, 52 * s / 16, 26 * s / 16, 6 * s / 16, 1), { wash: '#B9CEDF', washOp: 90, ink: PAL.ink, sw: sw });
  paint(rrPts(x - 32 * s / 16, y - 172 * s / 16, 64 * s / 16, 24 * s / 16, 8 * s / 16, 1), { wash: '#C08A4A', fill: '#E8AA38', fillOp: 90, ink: PAL.ink, sw: sw });
  // 高光
  inkLine([[x - 30 * s / 16, y - 108 * s / 16], [x - 34 * s / 16, y - 40 * s / 16]], 4 * s / 16, '#FFFFFF', 'ink', .4);
}

// ---------- 烟花 ----------
// age = 自绽放起的时间。seed 固定每颗粒子的方向。
function firework(cx, cy, age, seed, o = {}) {
  if (age < 0) return;
  const N = o.n || 26, life = o.life || 1.9;
  if (age > life) return;
  const k = age / life;
  const col = o.col || '#FFD08A', col2 = o.col2 || '#FFB0B8';
  // 爆点的闪光
  const fl = Math.exp(-age * 9);
  if (fl > .02) {
    glow(cx, cy, 260 * (1 + fl), '#FFF3D2', .85 * fl);
    paint(starPts(cx, cy, 60 * (1 + fl * 1.6), .3, 5), { wash: PAL.cream, washOp: 240 * fl, ink: null });
  }
  // 放射光条
  for (let i = 0; i < N; i++) {
    boilSeed('fw' + seed + '_' + i);
    const a = hash(i * 3.7 + seed) * TAU + seed * .7;
    const sp = 260 + 300 * hash(i * 5.1 + seed);
    const r = sp * easeOut(clamp(age / .55)) * (1 + .06 * Math.sin(age * 18 + i));
    const fall = 60 * age * age;
    const x = cx + Math.cos(a) * r, y = cy + Math.sin(a) * r + fall;
    if (r < 3) continue;
    const fade = 1 - ease(clamp((k - .45) / .55));
    if (fade <= .02) continue;
    // 拖尾
    const tx = cx + Math.cos(a) * r * .72, ty = cy + Math.sin(a) * r * .72 + fall * .72;
    inkLine([[tx, ty], [x, y]], clamp(4.2 * (1 - k) + .6, .5, 4), mixCol(col, col2, hash(i)), 'ink', .2);
    // 头部亮点
    paint(starPts(x, y, (4 + 5 * hash(i + 3)) * fade, .34, 4), { wash: PAL.cream, washOp: 240 * fade, ink: null });
    if (i % 7 === 0) glow(x, y, 70 * fade, col, .5 * fade);
  }
  // 上升的光点（发射轨迹）
  if (o.trail) {
    const tp = [];
    for (let j = 0; j <= 8; j++) tp.push([cx + Math.sin(j) * 4, lerp(o.fromY ?? 900, cy, j / 8)]);
    inkLine(tp, 2, col, 'inkfine', .4);
  }
}

// 上升中的一颗"炮仗"（绽开前的光点，从左下飞到绽放点）
function risingSpark(t, t0, t1, x0, y0, x1, y1, col = '#FFE0AE') {
  if (t < t0 || t > t1) return false;
  const k = seg(t, t0, t1), p = arcPt([x0, y0], [x1, y1], 60, k);
  boilSeed('rise');
  glow(p[0], p[1], 74, col, .6);
  paint(starPts(p[0], p[1], 8, .35, 4), { wash: PAL.cream, ink: null });
  const tx = arcPt([x0, y0], [x1, y1], 60, Math.max(0, k - .12));
  inkLine([[tx[0], tx[1]], [p[0], p[1]]], 2.4, col, 'ink', .3);
  return true;
}

// ---------- 钟面（时差） ----------
function clockFace(cx, cy, r, handA, a = 1, col = '#E8DCC8') {
  boilSeed('clk' + Math.round(cx));
  paint(ellPts(cx, cy, r, r, 44, 1.5), { wash: '#2A2A4A', washOp: 235 * a, fill: '#3B3A60', fillOp: 100 * a, tex: .5, ink: PAL.ink, sw: 2.4 });
  inkLine(ellPts(cx, cy, r * .93, r * .93, 44, 1.5), 1.4, '#7A6E9A', 'inkfine', .3);
  for (let i = 0; i < 12; i++) {
    const an = i / 12 * TAU - Math.PI / 2;
    const r0 = r * .80, r1 = r * (i % 3 === 0 ? .66 : .74);
    inkLine([[cx + Math.cos(an) * r0, cy + Math.sin(an) * r0], [cx + Math.cos(an) * r1, cy + Math.sin(an) * r1]],
      i % 3 === 0 ? 4 : 2, '#B7A8C8', 'ink', 0);
  }
  // 时针
  const hx = cx + Math.cos(handA - Math.PI / 2) * r * .48, hy = cy + Math.sin(handA - Math.PI / 2) * r * .48;
  inkLine([[cx, cy], [hx, hy]], 7, col, 'ink', .35);
  paint(ellPts(cx, cy, r * .06, r * .06, 12), { wash: col, ink: PAL.ink, sw: 1.2 });
}

// ---------- 一朵花（她头顶的母题放大版） ----------
function flower(cx, cy, r, rot = 0, a = 1, col = '#FBD0DA') {
  if (a <= .02) return;
  boilSeed('fl' + Math.round(cx));
  for (let i = 0; i < 5; i++) {
    const p = rot + i / 5 * TAU;
    paint(ellPts(cx + Math.cos(p) * r * .62, cy + Math.sin(p) * r * .62, r * .48, r * .40, 14, 1),
          { wash: col, washOp: 250 * a, fill: '#FFFFFF', fillOp: 40 * a, ink: PAL.ink, sw: clamp(r / 22, .5, 1.4) });
  }
  paint(ellPts(cx, cy, r * .34, r * .34, 14, 1), { wash: '#F2C53D', ink: PAL.ink, sw: clamp(r / 26, .4, 1.1) });
}

// ---------- 一个发光的小人剪影（球里/远处的两人） ----------
function tinyPair(cx, cy, s, t) {
  boilSeed('tp');
  const bob = Math.sin(t * 1.6) * s * .03;
  paint(ellPts(cx - s * .34, cy, s * .30, s * .46, 16, 1), { wash: PAL.clay, ink: PAL.ink, sw: .9 });
  paint(ellPts(cx + s * .34, cy, s * .30, s * .46, 16, 1), { wash: '#EE9AAE', ink: PAL.ink, sw: .9 });
  paint(ellPts(cx - s * .34, cy - s * .40, s * .10, s * .12, 10), { wash: PAL.ink, ink: null });
  paint(ellPts(cx + s * .34, cy - s * .40 + bob, s * .10, s * .12, 10), { wash: PAL.ink, ink: null });
  flower(cx + s * .34, cy - s * .60 + bob, s * .16, t * .3);
  glow(cx, cy, s * 1.5, '#FFD79A', .4);
}

// ---------- 远处被照亮的云（不挡字幕，只在天上） ----------
function cloudBack(t, cx, cy, rx, ry, seed, a = 1) {
  if (a <= .03) return;
  boilSeed('cb' + seed);
  const drift = Math.sin(t * .18 + seed) * 16;
  paint(cloudPts(cx + drift, cy, rx, ry, seed), { wash: '#4A4470', washOp: 220 * a, fill: '#B98A92', fillOp: 80 * a, bleed: .24, tex: .5, ink: null });
  paint(cloudPts(cx + drift - rx * .1, cy - ry * .28, rx * .74, ry * .58, seed + 3), { wash: '#7A6A9C', washOp: 150 * a, ink: null });
  glow(cx + drift + rx * .3, cy - ry * .1, rx * .7, '#FFC08A', .22 * a);
}
