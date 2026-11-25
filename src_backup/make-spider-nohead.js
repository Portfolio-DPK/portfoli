const sharp = require('sharp');
const PTS = [[207, 790], [205, 812], [207, 836], [215, 860], [232, 878], [256, 890], [285, 892], [305, 880], [318, 860], [325, 832], [327, 800], [323, 770], [318, 755], [311, 744], [299, 737], [280, 733], [262, 737], [245, 748], [228, 765], [215, 780]];
const C = [266, 813], GROW = 1.07, FILL_Y = 774;
const poly = PTS.map(([x, y]) => [C[0] + (x - C[0]) * GROW, C[1] + (y - C[1]) * GROW]);
const inside = (x, y) => { let c = false; for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) { const [xi, yi] = poly[i], [xj, yj] = poly[j]; if ((yi > y) !== (yj > y) && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) c = !c; } return c; };
(async () => {
  const src = 'd:/cv/public/hero/spider-hang.webp';
  const { data, info } = await sharp(src).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const W = info.width, H = info.height; let removed = 0, filled = 0;
  for (let y = 700; y < H; y++) for (let x = 180; x < 360; x++) {
    if (!inside(x + 0.5, y + 0.5)) continue; const o = (y * W + x) * 4;
    const ell = ((x - 272) / 80) ** 2 + ((y - 752) / 44) ** 2 <= 1;
    if (ell && y < FILL_Y + 22) { data[o] = 208; data[o+1] = 52; data[o+2] = 45; data[o+3] = 255; filled++; } // keep the torso continuous under the neck
    else { data[o+3] = 0; removed++; }
  }
  console.log('removed', removed, 'filled', filled);
  await sharp(data, { raw: { width: W, height: H, channels: 4 } }).webp({ quality: 92, alphaQuality: 100 }).toFile('d:/cv/public/hero/spider-hang-nohead.webp');
  await sharp('d:/cv/public/hero/spider-hang-nohead.webp').extract({ left: 150, top: 650, width: 250, height: 270 }).resize(750, 810, { kernel: 'nearest' }).flatten({ background: '#2a2060' }).jpeg({ quality: 88 }).toFile(process.argv[2] + '/nohead_check.jpg');
})();


