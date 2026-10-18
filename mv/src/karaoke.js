// karaoke.js: 中文卡拉OK字幕（毛笔字体），叠加在 2D 合成层上，位于纸纹之上。
// LY = [[开始, 结束, "歌词", opts]]
//   opts.sing = 这一句唱完用多少秒（决定逐字填色速度）；opts.size 手动指定字号；opts.out 结束后停留秒数
// 时间轴来自 whisper-medium 逐字转写 + 100BPM 节拍网格校正（第一拍 0.19s）。
const LY = [
  [1.98, 4.80, '我们都是渺小真实存在', { sing: 2.42 }],
  [4.90, 7.94, '祈愿小世界里不只有挫败', { sing: 2.72 }],
  [8.60, 9.50, '直到遇见你', { sing: .90 }],
  [9.52, 11.56, '我以为就光明起来', { sing: 1.90 }],
  [11.96, 13.48, '眼睛里看到的都是', { sing: 1.40 }],
  [13.52, 15.60, '广袤无垠的大海', { sing: 1.95 }],
  [15.64, 18.60, '有你在的日子里不可能被取代', { sing: 2.85 }],
  [19.00, 22.02, '在最灰暗的日子里你陪着我发呆', { sing: 2.95 }],
  [22.32, 25.20, '你让我学会如何拨开阴霾', { sing: 2.80 }],
  [25.42, 28.86, '将快乐全都收集 将不开心全都淘汰', { sing: 3.35 }],
  [29.00, 31.40, '你对我说的情话', { sing: 2.30 }],
  [31.46, 34.76, '像转瞬即逝的烟花', { sing: 2.60 }],
  [34.82, 38.62, '只停在绽放一刹那', { sing: 2.70 }],
  [38.68, 41.54, '我却已无法自拔', { sing: 2.60 }],
  [41.62, 44.80, '我们的爱总有时差', { sing: 2.70 }],
  [44.92, 47.90, '也为你骗自己放下', { sing: 2.70 }],
  [48.00, 49.86, '爱炙热的你', { sing: 1.80 }],
  [49.94, 51.52, '却忘了爱自己', { sing: 1.52 }],
  [51.62, 55.16, '把回忆拼好给你', { sing: 2.90, out: .30 }],
];
const KFONT = '"BrushCN", "STXingkai", "华文行楷", "KaiTi", "STKaiti", serif';
const KALL = LY.map(l => l[2]).join('');
window.EXTRA_FONTS = [[`84px ${KFONT}`, KALL]];

window.overlayHook = (c, t) => {
  for (let i = 0; i < LY.length; i++) {
    const [a, b] = LY[i];
    // 下一句开始的时刻：上一句的淡出必须在此之前结束，否则两行会叠成重影
    const nx = i + 1 < LY.length ? LY[i + 1][0] : Infinity;
    const cut = Math.min(b + .46, nx - .02);
    if (t >= a - .02 && t < cut) kLine(c, LY[i], t, i, cut);
  }
};

function kLine(c, L, t, idx, cut) {
  const [a, b, txt, opt = {}] = L;
  const N = [...txt].length;
  // 字数多就自动缩小，保证一行放得下
  let size = opt.size || Math.min(84, Math.floor(1560 / Math.max(1, N)));
  size = Math.max(50, size);
  const y = 946;
  const inK = easeOut(clamp((t - a) / .24));
  // 若有下一句压过来，就把淡出窗口提前到 cut 之前结束
  const outStart = Math.min(b + (opt.out ?? .05), (cut ?? Infinity) - .26);
  const outK = 1 - ease(clamp((t - outStart) / .26));
  const alpha = inK * outK;
  if (alpha <= .012) return;

  c.save();
  c.font = `${size}px ${KFONT}`;
  c.textAlign = 'left';
  c.textBaseline = 'middle';
  const total = c.measureText(txt).width;
  const x0 = 960 - total / 2;
  const grow = .94 + .06 * inK;

  // ---- 墨色底板：边缘起伏，两端像毛笔拖出的飞白 ----
  const bw = (total + 150) * grow, bh = (size * 1.62) * grow, by = y - bh / 2;
  const bx = 960 - bw / 2;
  const r = n => (hash(idx * 31 + n + BOILN) * 8.5 - 4.25);
  c.globalAlpha = .80 * alpha;
  c.fillStyle = '#241A2E';
  c.beginPath();
  c.moveTo(bx - 30 + r(1), y - bh * .34);
  c.quadraticCurveTo(bx + bw * .12, by - 8 + r(2), bx + bw * .5, by + r(3));
  c.quadraticCurveTo(bx + bw * .88, by - 6 + r(4), bx + bw + 26 + r(5), y - bh * .30);
  c.lineTo(bx + bw + 8 + r(6), y + bh * .31);
  c.quadraticCurveTo(bx + bw * .86, y + bh * .5 + r(7), bx + bw * .5, y + bh * .49 + r(8));
  c.quadraticCurveTo(bx + bw * .14, y + bh * .5 + r(9), bx - 26 + r(10), y + bh * .33);
  c.closePath(); c.fill();

  c.globalAlpha = .45 * alpha;
  c.strokeStyle = '#D8A64E'; c.lineWidth = 2.2; c.stroke();
  c.globalAlpha = alpha;

  // ---- 文字：奶油白底字 + 逐字填金 ----
  c.lineJoin = 'round';
  c.lineWidth = size * .13;
  c.strokeStyle = '#150F1E';
  c.strokeText(txt, x0, y + 2);
  c.fillStyle = '#FFF4DE';
  c.fillText(txt, x0, y);

  const sing = opt.sing ?? (b - a) * .88;
  const head = clamp((t - a) / sing) * N;
  c.save();
  c.shadowColor = 'rgba(255,190,110,.70)';
  c.shadowBlur = 20;
  c.fillStyle = '#F8C465';
  for (let i = 0; i < N; i++) {
    const fx = c.measureText(txt.slice(0, i)).width;
    const fw = c.measureText(txt[i]).width;
    const f = clamp(head - i);
    if (f <= 0) continue;
    const near = Math.exp(-Math.abs(head - i - f) * 5);
    const pop = 1 + .10 * near;
    c.save();
    c.beginPath();
    c.rect(x0 + fx - 4, y - size, (fw + 8) * f, size * 2);
    c.clip();
    c.translate(x0 + fx + fw / 2, y);
    c.scale(pop, pop);
    c.translate(-(x0 + fx + fw / 2), -y);
    c.fillText(txt[i], x0 + fx, y + 2);
    c.restore();
  }
  c.restore();

  // ---- 唱针：当前字下方一点微光 ----
  if (head > .05 && head < N - .02) {
    const ci = Math.min(N - 1, Math.floor(head));
    const fx = c.measureText(txt.slice(0, ci)).width + c.measureText(txt[ci]).width * .5;
    const k = Math.sin(clamp(head % 1) * Math.PI);
    c.globalAlpha = .55 * alpha * (0.35 + .65 * k);
    c.fillStyle = '#FFD79A';
    c.beginPath(); c.arc(x0 + fx, y + size * .62, 5 + 4 * k, 0, Math.PI * 2); c.fill();
  }
  c.restore();
}

// ---------- 水印 mcqyl：全程右下角，毛笔字 + 一枚小印 ----------
window.overlayHookBase = window.overlayHook;
window.overlayHook = (c, t) => {
  window.overlayHookBase(c, t);
  watermark(c, t);
};
function watermark(c, t) {
  const a = clamp((t - .6) / 1.2) * (1 - clamp((t - 55.5) / .7)) * .52;
  if (a <= .01) return;
  c.save();
  c.globalAlpha = a;
  c.textAlign = 'left';
  c.textBaseline = 'middle';
  c.font = `34px ${KFONT}`;
  c.lineJoin = 'round';
  // 墨影 + 奶油字，暗底亮底都读得出来
  c.lineWidth = 5;
  c.strokeStyle = 'rgba(12,8,20,.55)';
  c.strokeText('mcqyl', 1768, 1014);
  c.fillStyle = '#FFEFD6';
  c.fillText('mcqyl', 1768, 1014);
  // 一枚小朱印
  c.globalAlpha = a * .85;
  c.fillStyle = '#C0392B';
  c.beginPath(); c.roundRect ? c.roundRect(1862, 998, 34, 34, 5) : c.rect(1862, 998, 34, 34); c.fill();
  c.globalAlpha = a;
  c.fillStyle = '#FFEFD6';
  c.font = `19px ${KFONT}`;
  c.textAlign = 'center';
  c.fillText('忆', 1879, 1016);
  c.restore();
}
