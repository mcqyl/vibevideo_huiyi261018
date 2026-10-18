// set.js: 《把回忆拼好给你》的世界 —— 记忆的虚空 + 一颗关着小世界的玻璃球。
// 母题：碎片。开场墨滴炸成碎片旋涡，碎片最后会重新拼合。
// 色弧：深夜靛紫 → 暮色玫瑰 → 一点金色。
//
// 光照原则：深底用 wash，光一律用 glow()（加色），绝不用浅色颜料叠在深色上——那会发灰发绿。
const NT = {
  base: '#141A34', deep: '#0F1428', mid: '#2A3468', far: '#2C3468',
  warm: '#FFD596', gold: '#E8AA38', goldLt: '#FFE3AE', cream: '#FFF3DA',
  rose: '#D9738C', teal: '#2F8D8A', violet: '#5B4A8C',
  rock: '#2F3352', rockDk: '#1B1F38', rockLt: '#4B5078', sap: '#4E7A66',
};

// ---------- 夜空：深底 + 加色星云（无硬边、无渐变带） ----------
// 冷暖分区：上方冷紫，地平线一团暖金——这是整个片子的光位，主角永远在暖光里。
function nightSky(t, o = {}) {
  const fx = o.fx ?? 960, fy = o.fy ?? 470, s = o.s ?? 1, k = o.k ?? 1;
  boilSeed('nsky');
  paint(rectPts(-900, -900, W + 1800, H + 1800), { wash: o.base || NT.base, ink: null });
  // 冷色天顶
  glow(fx - 60, fy - 620 * s, 1250 * s, '#212A5E', .95 * k);
  glow(fx + 120, fy - 420 * s, 780 * s, '#33407E', .70 * k);
  // 星云主轴：一条斜向的玫瑰色云带
  for (let i = 0; i < 5; i++) {
    const u = i / 4, nx = fx + lerp(-560, 520, u) * s, ny = fy + lerp(-330, 90, u) * s;
    glow(nx, ny, (300 - 70 * Math.abs(u - .5) * 2) * s, i % 2 ? '#7A4E86' : '#96557E', .40 * k);
  }
  // 地平线的暖光（主光位）
  glow(fx, fy + 210 * s, 760 * s, '#B4713F', .55 * k);
  glow(fx, fy + 230 * s, 380 * s, '#FFB877', .40 * k);
  // 底部压深的"地气"：用加色负向做不到，改用深色 wash 的软边
  paint(ellPts(fx, 1290, 1700, 420, 44, 14), { fill: '#0B0F1E', fillOp: 120, bleed: .38, tex: .4, ink: null });
  // 几笔极淡的云纹（颜料笔触，给天空织理）
  for (let i = 0; i < 4; i++) {
    boilSeed('ncl' + i);
    const cx0 = fx - 700 + i * 420 + Math.sin(t * .18 + i) * 40, cy0 = fy - 260 + i * 74;
    const pts = [];
    for (let j = 0; j <= 10; j++) {
      const xx = cx0 + j * 70 * s, yy = cy0 + Math.sin(j * .7 + i * 1.8 + t * .25) * 26 * s - j * 6 * s;
      pts.push([xx, yy]);
    }
    paint(ribbon(pts, 26 * s, 4 * s), { wash: '#6E5A9E', washOp: 40, ink: null });
  }
}

// 星与光尘：锁在小节上轻轻呼吸
function stars(t, n, k = 1, y0 = -120, y1 = 900) {
  for (let i = 0; i < n; i++) {
    boilSeed('st' + i);
    const x = hash(i) * (W + 400) - 200, y = y0 + hash(i + 91) * (y1 - y0);
    const tw = .45 + .55 * Math.sin(t * (1.1 + 2.2 * hash(i + 9)) + i * 2.1);
    const r = (2.4 + 5.2 * hash(i + 3)) * (.5 + .5 * tw) * k;
    paint(starPts(x, y, r, .32, 4), { wash: PAL.cream, washOp: 110 + 130 * tw, ink: null });
    if (hash(i + 55) > .86) glow(x, y, r * 7 * tw, '#FFE0B4', .30 * k * tw);
  }
}
// 漂浮的光尘（缓慢上升，循环）
function motes(t, n, cx, cy, rx, ry, seed = 0, col = '#FFE0B0') {
  for (let i = 0; i < n; i++) {
    const ph = frac(hash(i * 2.7 + seed) + t * (.03 + .04 * hash(i + seed)));
    const y = cy + ry - ph * 2 * ry;
    const x = cx + (hash(i * 3.1 + seed) * 2 - 1) * rx + Math.sin(t * .55 + i * 1.9) * 22;
    const a = Math.sin(ph * Math.PI) * (.14 + .20 * hash(i + 7));
    glow(x, y, 16 + 20 * hash(i + 2), col, a);
  }
}

// ---------- 记忆碎片 ----------
// 一块不规则的玻璃/照片碎片。seed 固定形状，绝不用 Math.random。
function shardPts(cx, cy, r, rot, seed) {
  const n = 5 + Math.floor(hash(seed * 3.7) * 3), p = [];
  for (let i = 0; i < n; i++) {
    const a = rot + i / n * TAU, rr = r * (.55 + .70 * hash(seed * 7.1 + i));
    p.push([cx + Math.cos(a) * rr, cy + Math.sin(a) * rr]);
  }
  return p;
}
const SHARD_C = ['#FFE7BE', '#F6E3C6', '#EFA9B9', '#A6DAD6', '#CFC7F2', '#FFD08A'];
function shard(cx, cy, r, rot, seed, o = {}) {
  const a = o.a ?? 1;
  if (a <= .03 || r < 1.5 || !isFinite(cx) || !isFinite(cy)) return;
  const col = o.col || SHARD_C[Math.floor(hash(seed * 11.3) * SHARD_C.length) % SHARD_C.length];
  boilSeed('sh' + seed);
  const g = o.glow ?? 0;
  if (g > .01) glow(cx, cy, r * 3.0, o.glowCol || '#FFDA9E', .40 * a * g);
  const P = shardPts(cx, cy, r, rot, seed);
  paint(P, { wash: col, washOp: 240 * a, fill: PAL.cream, fillOp: 40 * a, bleed: .05, tex: .5, border: .3,
             ink: a > .18 ? PAL.ink : null, sw: clamp(r / 52, .4, 1.5) });
  // 一道亮边：让碎片看起来是玻璃
  if (r > 9 && a > .3) {
    const p0 = P[0], p1 = P[1], p2 = P[2];
    inkLine([[p0[0], p0[1]], [p1[0], p1[1]], [p2[0], p2[1]]], clamp(r / 40, .5, 1.8), '#FFF8E8', 'inkfine', .4);
  }
}

// ---------- 悬浮岩台 ----------
function rockIsland(cx, cy, w, h, seed, o = {}) {
  boilSeed('rock' + seed);
  const p = [[cx - w * .50, cy - h * .04], [cx - w * .40, cy - h * .14], [cx - w * .14, cy - h * .07],
             [cx + w * .12, cy - h * .13], [cx + w * .40, cy - h * .06], [cx + w * .50, cy - h * .02],
             [cx + w * .36, cy + h * .74], [cx + w * .05, cy + h * 1.08], [cx - w * .22, cy + h * .84],
             [cx - w * .42, cy + h * .34]];
  paint(p, { wash: NT.rock, washOp: 255, fill: NT.rockDk, fillOp: 130, bleed: .05, tex: .55, ink: PAL.ink, sw: 1.6 });
  // 顶面受光
  paint([[cx - w * .46, cy - h * .06], [cx - w * .14, cy - h * .09], [cx + w * .12, cy - h * .15], [cx + w * .44, cy - h * .04],
         [cx + w * .30, cy + h * .02], [cx - w * .06, cy + h * .05], [cx - w * .38, cy + h * .01]],
        { fill: NT.rockLt, fillOp: 170, bleed: .12, tex: .7, border: .5, ink: null });
  for (let i = 0; i < 3; i++) {
    const x0 = cx - w * .18 + i * w * .20;
    inkLine([[x0, cy + h * .12], [x0 + w * .03, cy + h * .38], [x0 - w * .02, cy + h * .60]], .8,
            mixCol(NT.rockDk, PAL.ink, .4), 'inkfine', .3);
  }
  for (let i = 0; i < 8; i++) {
    boilSeed('tuft' + i + seed);
    const gx = cx - w * .40 + i * w * .11, gh = 14 + 16 * hash(i + seed);
    inkLine([[gx, cy - 3], [gx + 6 + 4 * hash(i), cy - gh]], 1.6, NT.sap, 'ink', .45);
    inkLine([[gx + 3, cy - 2], [gx + 16 + 4 * hash(i + 3), cy - gh * .75]], 1.2, mixCol(NT.sap, PAL.ink, .2), 'ink', .45);
  }
}

// ---------- 玻璃球 ----------
const clipC = (pts, cx, cy, R) => pts.map(([x, y]) => {
  const dx = x - cx, dy = y - cy, d = Math.hypot(dx, dy);
  return d > R ? [cx + dx / d * R, cy + dy / d * R] : [x, y];
});

// 球内的小世界：暮色天空 + 两层山 + 一条河。所有点被夹进球体，世界会顺着玻璃弯起来。
function globeInside(t, cx, cy, R, mood = 1) {
  boilSeed('gin');
  paint(ellPts(cx, cy, R * .998, R * .998, 48, 1.4), { wash: '#39406F', ink: null });
  glow(cx + R * .30, cy - R * .34, R * 1.05, '#FFC08A', .55 * mood);
  glow(cx, cy + R * .30, R * .95, '#8A5A78', .35 * mood);
  glow(cx - R * .30, cy - R * .10, R * .55, '#5B62A8', .30 * mood);
  // 球内星
  for (let i = 0; i < 26; i++) {
    const a = hash(i) * TAU, rr = R * (.12 + .82 * hash(i + 4));
    const x = cx + Math.cos(a) * rr, y = cy + Math.sin(a) * rr * .84 - R * .10;
    if (Math.hypot(x - cx, y - cy) > R * .93) continue;
    boilSeed('gst' + i);
    const tw = .4 + .6 * Math.sin(t * (1.2 + hash(i) * 2.2) + i);
    paint(starPts(x, y, 2.6 + 3.6 * hash(i + 2) * (.5 + .5 * tw), .34, 4), { wash: PAL.cream, washOp: 90 + 140 * tw, ink: null });
  }
  // 远山
  boilSeed('gh1');
  paint(clipC(ellPts(cx - R * .30, cy + R * .34, R * .72, R * .36, 32, 4), cx, cy, R * .99),
        { wash: '#3D4370', fill: '#7A6698', fillOp: 70, tex: .5, ink: PAL.ink, sw: 1 });
  boilSeed('gh2');
  paint(clipC(ellPts(cx + R * .42, cy + R * .40, R * .76, R * .32, 32, 4), cx, cy, R * .99),
        { wash: '#363C68', fill: '#6A5A8E', fillOp: 70, tex: .5, ink: PAL.ink, sw: 1 });
  // 河：一亮带，顺着球的弧
  boilSeed('griv');
  paint(clipC([[cx - R * .30, cy + R * .30], [cx - R * .08, cy + R * .46], [cx + R * .22, cy + R * .62],
               [cx + R * .40, cy + R * .78], [cx + R * .58, cy + R * .90], [cx + R * .30, cy + R * .95],
               [cx + R * .06, cy + R * .74], [cx - R * .24, cy + R * .52]], cx, cy, R * .985),
        { wash: '#8FB6C8', washOp: 210, fill: '#FFE6BC', fillOp: 80, tex: .4, ink: PAL.ink, sw: .9 });
  // 近景地面
  boilSeed('gg');
  paint(clipC([[cx - R, cy + R * .50], [cx - R * .5, cy + R * .44], [cx, cy + R * .50], [cx + R * .5, cy + R * .42], [cx + R, cy + R * .50],
               [cx + R, cy + R * 1.1], [cx - R, cy + R * 1.1]], cx, cy, R * .99),
        { wash: '#26403F', fill: '#16282C', fillOp: 140, tex: .6, ink: PAL.ink, sw: 1.2 });
  // 岸边的小草与一棵树
  for (let i = 0; i < 12; i++) {
    boilSeed('gtuft' + i);
    const a = i / 12 * Math.PI - Math.PI * .95;
    const gx = cx + Math.cos(a) * R * .78, gy = cy + R * .44 + Math.sin(a) * R * .10;
    const gh = 10 + 16 * hash(i + 7);
    inkLine([[gx, gy], [gx + 3, gy - gh], [gx + 8, gy - gh * .5]], 1.4, '#5C8A72', 'ink', .45);
  }
  boilSeed('gtrunk');
  const tx = cx - R * .46, ty = cy + R * .44;
  inkLine([[tx, ty], [tx - 2, ty - 34], [tx + 2, ty - 52]], 3.2, '#2A3730', 'ink', .4);
  paint(ellPts(tx + 2, ty - 64, 30, 26, 18, 4), { wash: '#3E6A5C', fill: '#5C8A72', fillOp: 90, tex: .6, ink: PAL.ink, sw: 1 });
}

// 玻璃外壳：厚边 + 两道高光 + 底部暖反光
function globeShell(t, cx, cy, R, glowK = 0) {
  boilSeed('gshell');
  if (glowK > 0) glow(cx, cy, R * 1.30, '#FFCE8A', .26 * glowK);
  inkLine(ellPts(cx, cy, R, R, 56, .7), 3.4, PAL.ink, 'ink', .25);
  inkLine(ellPts(cx, cy, R * 1.014, R * 1.014, 56, .7), 1.1, mixCol(NT.gold, PAL.ink, .40), 'inkfine', .25);
  inkLine([[cx - R * .60, cy - R * .48], [cx - R * .38, cy - R * .73], [cx - R * .06, cy - R * .87]], 5.5, '#FFF6E4', 'ink', .5);
  inkLine([[cx - R * .72, cy - R * .14], [cx - R * .64, cy - R * .33]], 2.6, '#FFF6E4', 'ink', .5);
  inkLine([[cx + R * .46, cy + R * .64], [cx + R * .64, cy + R * .40]], 2.0, mixCol(NT.gold, '#FFF3DA', .5), 'inkfine', .5);
  paint(ellPts(cx, cy + R * .60, R * .58, R * .26, 26, 4), { fill: NT.gold, fillOp: 80, bleed: .3, tex: .4, ink: null });
}

// 一道裂缝：k = 蔓延进度，lit = 被点亮的程度
function crack(pts, k, lit, sw = 2.2) {
  if (k <= .01) return;
  const n = Math.max(2, Math.ceil(pts.length * clamp(k)));
  const P = pts.slice(0, n);
  const last = P[P.length - 1], prev = P[P.length - 2] || last, f = frac(k * pts.length);
  P[P.length - 1] = [lerp(prev[0], last[0], f), lerp(prev[1], last[1], f)];
  if (lit > .02) { inkLine(P, sw * 2.2, '#FFC46E', 'ink', .35); glow(P[P.length - 1][0], P[P.length - 1][1], 110, '#FFC97A', .55 * lit); }
  inkLine(P, sw, lit > .35 ? '#FFF1CE' : PAL.ink, 'inkfine', .35);
}

// 一拍一道的金色光环（从中心荡开、淡出）
function beatRing(t, k, cx, cy, r0, r1, col = '#FFD08A', sw = 2.6) {
  const p = pulse(t, k);
  if (p < .07) return;
  const r = lerp(r0, r1, 1 - p);
  inkLine(ellPts(cx, cy, r, r * .94, 44, 1.2), sw * p, col, 'ink', .3);
}
