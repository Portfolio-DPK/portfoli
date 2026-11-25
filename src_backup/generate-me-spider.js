const sharp = require('sharp');
const fs = require('fs');
const DIR = process.argv[2];
const W = 1400, H = 1574, DX = 60;
const RED = [207, 49, 40], BLUE = [30, 66, 156];
const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const smooth = (a, b, x) => { const t = clamp((x - a) / (b - a)); return t * t * (3 - 2 * t); };

const gray = async (buf, sigma) => {
  let s = sharp(buf, { raw: { width: W, height: H, channels: 1 } });
  if (sigma) s = s.blur(sigma);
  return s.toColourspace('b-w').raw().toBuffer();
};
const svgPng = async (svg) => sharp(Buffer.from(svg)).resize(W, H).ensureAlpha().raw().toBuffer();

(async () => {
  const { data } = await sharp(DIR + '/cut.png').ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const N = W * H;
  const A = new Uint8Array(N), L8 = Buffer.alloc(N), SK = new Uint8Array(N);
  for (let i = 0; i < N; i++) {
    const r = data[i*4], g = data[i*4+1], b = data[i*4+2];
    A[i] = data[i*4+3];
    const l = 0.299 * r + 0.587 * g + 0.114 * b; L8[i] = l;
    const mx = Math.max(r, g, b), mn = Math.min(r, g, b);
    // skin: warm, reasonably saturated, not too dark
    SK[i] = (r > 90 && r > g && g > b * 0.85 && r - b > 22 && mx - mn > 28 && l > 70) ? 1 : 0;
  }
  const Lb1 = await gray(L8, 1.2), Lb4 = await gray(L8, 4), Lb9 = await gray(L8, 9);
  const HEAD_Y = 650;                       // everything above is head (hair, face, ears)
  const SKb = await gray(Buffer.from(SK.map((v) => v * 255)), 7);   // soft skin map to blend hair/skin shading
  const kind = new Uint8Array(N);           // 0 none, 1 head-skin, 2 head-hair, 3 shirt, 4 blazer
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const i = y * W + x; if (A[i] < 8) continue;
    const l = Lb1[i];
    if (y < HEAD_Y) kind[i] = SK[i] ? 1 : 2;
    else if (y < 735 && x > 505 + DX && x < 722 + DX && !(Lb4[i] > 165)) kind[i] = 1;   // neck column incl. the chin shadow
    else if (SK[i]) kind[i] = 1;                       // V of the chest skin
    else if (Lb4[i] > 150 && y > 640) kind[i] = 3;
    else kind[i] = 4;
  }
  // overlays (web lines, lenses, emblem) rendered once, blended per region below
  let webH = '';
for (let x = 80 + DX; x <= 1180 + DX; x += 92) webH += `M${628 + DX} -30 Q${(628 + DX + x) / 2} 300 ${x} 800 `;
for (const y of [150, 250, 350, 470, 570, 660]) webH += `M${100 + DX} ${y} Q${628 + DX} ${y + 130} ${1150 + DX} ${y} `;
  const webHead = await svgPng(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}"><path d="${webH}" stroke="#200608" stroke-width="2.6" fill="none" opacity=".62"/></svg>`);
  const webBody = await svgPng(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}"><defs><pattern id="p" width="38" height="38" patternUnits="userSpaceOnUse" patternTransform="rotate(16)"><path d="M0 19 H38 M19 0 V38" stroke="#0b0508" stroke-width="1.7" fill="none"/><path d="M0 0 L38 38 M38 0 L0 38" stroke="#0b0508" stroke-width="1" fill="none" opacity=".5"/></pattern></defs><rect width="100%" height="100%" fill="url(#p)" opacity=".5"/></svg>`);
  const LENS = 'M-100 -22 C-80 -46 -30 -22 -8 22 C-26 52 -72 54 -94 28 C-106 14 -106 -8 -100 -22 Z';
  const lens = (cx, cy, mirror) => `<g transform="translate(${cx} ${cy}) scale(${mirror ? -1.95 : 1.95} 1.3) translate(54 -8)"><path d="${LENS}" fill="url(#lg)" stroke="#0e0e12" stroke-width="5.2" stroke-linejoin="round"/></g>`;
  const top = await svgPng(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}"><defs><radialGradient id="lg" cx=".4" cy=".3" r=".9"><stop offset="0" stop-color="#fff"/><stop offset=".75" stop-color="#f1f1f5"/><stop offset="1" stop-color="#c8c8d2"/></radialGradient></defs>
    ${lens(548 + DX, 424, false)}${lens(738 + DX, 432, true)}
    <g transform="translate(${600 + DX} 958) scale(3.3)" fill="#0b0b0f" stroke="#0b0b0f" stroke-width="2.4" stroke-linecap="round"><ellipse cx="0" cy="2" rx="6.5" ry="9"/><circle cx="0" cy="-10" r="3.8"/><path d="M-6 -4 L-20 -14 M-7 1 L-23 1 M-6 6 L-20 17 M6 -4 L20 -14 M7 1 L23 1 M6 6 L20 17" fill="none"/></g></svg>`);

  const realOut = Buffer.alloc(N * 4), spOut = Buffer.alloc(N * 4);
  for (let y = 0; y < H; y++) {
    const fade = 1 - smooth(1500, 1572, y);          // the bust melts away toward the arms, like the reference
    for (let x = 0; x < W; x++) {
      const i = y * W + x, o = i * 4, a = A[i];
      realOut[o] = data[o]; realOut[o+1] = data[o+1]; realOut[o+2] = data[o+2]; realOut[o+3] = Math.round(a * fade);
      const k = kind[i], L = Lb1[i] / 255;
      const aa = k === 2 ? Math.round(smooth(70, 170, a) * 255) : a;
      if (a < 8) { spOut[o+3] = 0; continue; }
      let base, shade, webA = 0, webSrc = null;
      if (k === 1 || k === 2) {                      // the whole head is one smooth red hood
        const s = (Lb9[i] * 0.85 + Lb1[i] * 0.15) / 255, sk = SKb[i] / 255;
        const center = 0.14 + 0.5 * sk;
        shade = clamp(0.82 + 1.0 * (s - center), 0.4, 1.1); base = RED; webSrc = webHead;
      } else if (k === 3) {                           // white shirt → red chest
        shade = clamp(0.52 + 0.9 * (Lb4[i] / 255 - 0.8) + 0.5, 0.35, 1.05); base = RED; webSrc = webBody;
      } else {                                        // blazer → blue sides with the cloth texture kept
        shade = clamp(0.5 + 2.2 * L, 0.4, 1.1); base = BLUE; webSrc = webBody;
      }
      let r = base[0] * shade, g = base[1] * shade, b = base[2] * shade;
      // web lines: strong on the head, gentler on the body
      const wa = webSrc[o+3] / 255 * (webSrc === webHead ? 1 : 0.8);
      r *= 1 - wa * 0.85; g *= 1 - wa * 0.85; b *= 1 - wa * 0.85;
      // lenses + chest emblem on top
      const ta = top[o+3] / 255; r = r * (1 - ta) + top[o] * ta; g = g * (1 - ta) + top[o+1] * ta; b = b * (1 - ta) + top[o+2] * ta;
      spOut[o] = clamp(r, 0, 255); spOut[o+1] = clamp(g, 0, 255); spOut[o+2] = clamp(b, 0, 255);
      spOut[o+3] = Math.round(Math.max(aa * fade, ta * 255 * fade));
    }
  }
  fs.mkdirSync('d:/cv/public/about', { recursive: true });
  const save = (buf, name) => sharp(buf, { raw: { width: W, height: H, channels: 4 } }).resize({ width: 1000 }).webp({ quality: 90, alphaQuality: 95 }).toFile('d:/cv/public/about/' + name);
  await save(realOut, 'me-real.webp'); await save(spOut, 'me-spider.webp');
  await sharp('d:/cv/public/about/me-spider.webp').flatten({ background: '#0b1020' }).resize(760).jpeg().toFile(DIR + '/spider_check.jpg');
  await sharp('d:/cv/public/about/me-real.webp').flatten({ background: '#0b1020' }).resize(760).jpeg().toFile(DIR + '/real_check.jpg');
  console.log('ok');
})().catch(e => { console.error('ERR', e); process.exit(1); });
