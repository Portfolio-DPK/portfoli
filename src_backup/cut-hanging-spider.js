const sharp = require('sharp');
const CX = 1000, HALF = 310, TOP = 640, BOT = 1790, FEET_Y = 885; // crop box in original pixels
(async () => {
  const W = HALF * 2, H = BOT - TOP;
  const { data } = await sharp(process.argv[2]).extract({ left: CX - HALF, top: TOP, width: W, height: H }).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const N = W * H, mx = new Uint8Array(N);
  for (let i = 0; i < N; i++) mx[i] = Math.max(data[i*3], data[i*3+1], data[i*3+2]);
  // label near-black components; a component is "background" if it touches the border or is big (the void between the legs)
  const comp = new Int32Array(N).fill(-1), isBg = new Uint8Array(N); let id = 0;
  for (let s = 0; s < N; s++) {
    if (comp[s] >= 0 || mx[s] > 8) continue;
    const stack = [s], cells = []; let border = false; comp[s] = id;
    while (stack.length) { const p = stack.pop(); cells.push(p); const x = p % W, y = (p / W) | 0; if (x === 0 || y === 0 || x === W - 1 || y === H - 1) border = true;
      for (const q of [p - 1, p + 1, p - W, p + W]) { if (q < 0 || q >= N) continue; if ((q === p - 1 && x === 0) || (q === p + 1 && x === W - 1)) continue; if (comp[q] < 0 && mx[q] <= 8) { comp[q] = id; stack.push(q); } } }
    if (border || cells.length > 700) for (const c of cells) isBg[c] = 1;
    id++;
  }
  // distance-to-background (cheap: 3 px) so only fringe pixels get a soft alpha
  const near = new Uint8Array(N);
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { const p = y * W + x; if (isBg[p]) continue; let n = 0;
    for (let dy = -2; dy <= 2 && !n; dy++) for (let dx = -2; dx <= 2; dx++) { const xx = x + dx, yy = y + dy; if (xx < 0 || yy < 0 || xx >= W || yy >= H) continue; if (isBg[yy * W + xx]) { n = 1; break; } } near[p] = n; }
  const out = Buffer.alloc(N * 4); const feetRow = FEET_Y - TOP;
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { const p = y * W + x, o = p * 4; let a;
    if (y < feetRow) { // frayed thread above the feet: bright thin lines on black -> alpha from brightness
      a = Math.min(1, mx[p] / 170); out[o] = 236; out[o+1] = 238; out[o+2] = 248; out[o+3] = Math.round(a * 255); continue; }
    if (isBg[p]) a = 0; else if (near[p]) a = Math.min(1, mx[p] / 26); else a = 1;
    out[o] = data[p*3]; out[o+1] = data[p*3+1]; out[o+2] = data[p*3+2]; out[o+3] = Math.round(a * 255); }
  const scale = 0.8; const ow = Math.round(W * scale), oh = Math.round(H * scale);
  await sharp(out, { raw: { width: W, height: H, channels: 4 } }).resize(ow, oh, { kernel: 'lanczos3' }).webp({ quality: 92, alphaQuality: 100 }).toFile('d:/cv/public/hero/spider-hang.webp');
  await sharp('d:/cv/public/hero/spider-hang.webp').flatten({ background: '#241a4a' }).jpeg({ quality: 90 }).toFile(process.argv[3] + '/spider_hang_check.jpg');
  console.log('ok', ow, oh, 'aspect', (ow / oh).toFixed(3), 'thread at x =', ow / 2);
})();

