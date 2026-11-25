const sharp = require('sharp');
const D = process.argv[2];
const SC = 1.75, OX = 120, OY = -70, W = 1400, H = 1574;
// silhouette traced on the 675x1200 source
const poly = [[190,100],[168,160],[170,260],[200,350],[236,425],[236,462],[150,488],[70,520],[20,580],[0,640],[0,1200],[675,1200],[675,600],[640,545],[560,515],[445,472],[428,420],[440,330],[446,205],[428,112],[396,68],[340,46],[280,48],[225,70]];
const pts = poly.map(p => p.join(',')).join(' ');
(async () => {
  const mask = await sharp(Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="675" height="1200"><rect width="675" height="1200" fill="#000"/><polygon points="${pts}" fill="#fff"/></svg>`)).blur(2.2).greyscale().raw().toBuffer();
  const { data } = await sharp(D + '/src.png').removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const rgba = Buffer.alloc(675 * 1200 * 4);
  for (let i = 0; i < 675 * 1200; i++) { rgba[i*4] = data[i*3]; rgba[i*4+1] = data[i*3+1]; rgba[i*4+2] = data[i*3+2]; rgba[i*4+3] = mask[i]; }
  const sw = Math.round(675 * SC), sh = Math.round(1200 * SC);
  const big = await sharp(rgba, { raw: { width: 675, height: 1200, channels: 4 } }).resize(sw, sh, { kernel: 'lanczos3' }).extract({ left: 0, top: -OY, width: sw, height: H }).png().toBuffer();
  const canvas = await sharp({ create: { width: W, height: H, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } }).composite([{ input: big, left: OX, top: 0 }]).raw().toBuffer();
  // fade the cut-off arm edges and the bottom so nothing ends in a hard line
  const smooth = (a, b, x) => { const t = Math.max(0, Math.min(1, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
  for (let y = 0; y < H; y++) { const fy = 1 - smooth(1470, 1572, y); for (let x = 0; x < W; x++) { const fx = smooth(OX, OX + 190, x) * (1 - smooth(OX + sw - 190, OX + sw, x)); const o = (y * W + x) * 4 + 3; canvas[o] = Math.round(canvas[o] * fx * fy); } }
  await sharp(canvas, { raw: { width: W, height: H, channels: 4 } }).resize({ width: 1000 }).webp({ quality: 92, alphaQuality: 95 }).toFile('d:/cv/public/about/me-spider.webp');
  await sharp('d:/cv/public/about/me-spider.webp').flatten({ background: '#0b1020' }).resize(700).jpeg().toFile(D + '/spider_check.jpg');
  // overlay check against the real photo silhouette
  await sharp('d:/cv/public/about/me-real.webp').flatten({ background: '#0b1020' }).composite([{ input: await sharp('d:/cv/public/about/me-spider.webp').resize({ width: 1000 }).ensureAlpha().png().toBuffer(), blend: 'over' }]).resize(700).jpeg().toFile(D + '/overlay_check.jpg');
  console.log('ok');
})();
