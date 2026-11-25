const sharp = require('sharp');
const fs = require('fs');
const RED = '#d0322a', INK = '#16161a', WEB = '#2b0b0d', GREY = '#43434a', GREY_L = '#62626a';

// ---------- one cell (360 × 360) ----------
function cell({ yaw = 0, pitch = 0, eyes = 'open', deco = '', roll = 0, lensScale = 1 }) {
  const hx = yaw * 12, hy = pitch * 16, r = yaw * 5 + roll;
  const fx = yaw * 34, fy = pitch * 30;
  const far = Math.abs(yaw), sxFar = 1 - 0.48 * far, sxNear = 1 + 0.12 * far;
  // screen-left lens is "far" when looking right (yaw > 0)
  const sxL = yaw > 0 ? sxFar : sxNear, sxR = yaw > 0 ? sxNear : sxFar;
  const LENS = 'M-100 -22 C-80 -46 -30 -22 -8 22 C-26 52 -72 54 -94 28 C-106 14 -106 -8 -100 -22 Z';
  const HAPPY = 'M-100 18 Q-54 -54 -8 18 Q-54 -6 -100 18 Z';
  const SLEEP = 'M-98 -6 Q-54 40 -8 -6 Q-54 20 -98 -6 Z';
  const star = (cx, cy, R, fill) => { let d = ''; for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? R * 0.45 : R; d += (i ? 'L' : 'M') + (cx + Math.cos(a) * rr).toFixed(1) + ' ' + (cy + Math.sin(a) * rr).toFixed(1); } return `<path d="${d}Z" fill="${fill}" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/>`; };
  const spiral = (cx, cy) => { let d = ''; for (let t = 0; t <= 4.6 * Math.PI; t += 0.25) { const rr = 2 + t * 1.7; d += (t ? 'L' : 'M') + (cx + Math.cos(t) * rr).toFixed(1) + ' ' + (cy + Math.sin(t) * rr).toFixed(1); } return `<path d="${d}" fill="none" stroke="${INK}" stroke-width="3.2" stroke-linecap="round"/>`; };
  const lensShape = (side) => { // side: -1 left, +1 right ; face coords, centre ≈ (∓55, 8)
    const sx = side < 0 ? sxL : sxR, cx = side * 55, cy = 8;
    const mirror = side > 0 ? 'scale(-1 1)' : '';
    let shape, extra = '';
    if (eyes === 'happy') shape = HAPPY;
    else if (eyes === 'sleep') shape = SLEEP;
    else shape = LENS;
    const sc = lensScale, scY = eyes === 'wide' ? 1.24 : lensScale;
    let inner = '';
    if (eyes === 'star') inner = star(side * -(-55) * -1 + 0, 0, 0, 'none');
    const lens = `<path d="${shape}" transform="${mirror}" fill="url(#lensG)" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>`;
    if (eyes === 'star') extra = star(cx, cy, 23, '#fcd34d');
    if (eyes === 'dizzy') extra = spiral(cx, cy);
    return `<g transform="translate(${cx} ${cy}) scale(${sx * sc} ${scY}) translate(${-cx} ${-cy})">${lens}${extra}</g>`;
  };
  // web lines wrapping the mask like a sphere
  let web = '';
  for (const x of [-140, -92, -48, 0, 48, 92, 140]) web += `M0 -112 L${x} 120 `;
  for (const y of [-84, -48, -8, 34, 76]) web += `M-150 ${y} Q0 ${y + 34} 150 ${y} `;
  const blush = eyes === 'happy' && deco === 'blush'
    ? [-1, 1].map((s) => `<g stroke="#ff9db1" stroke-width="5.5" stroke-linecap="round">${[0, 16, 32].map((o) => `<path d="M${s * (34 + o)} 74 l${s * 9} -15"/>`).join('')}</g>`).join('')
    : '';
  const tears = deco === 'tears' ? [-1, 1].map((s) => `<path transform="translate(180 150)" d="M${s * 104} 40 q${s * 8} 14 ${s * 2} 26 q${-s * 12} -10 ${-s * 2} -26z" fill="#60a5fa" stroke="${INK}" stroke-width="2.6"/>`).join('') : '';

  const decoSvg = {
    heart: `<path d="M180 50 C140 22 166 -4 180 18 C194 -4 220 22 180 50Z" fill="#ef4452" stroke="${INK}" stroke-width="4" stroke-linejoin="round" transform="translate(0 4)"/>`,
    sparkle: star(126, 40, 13, '#facc15') + star(182, 22, 20, '#facc15') + star(240, 42, 13, '#facc15'),
    bang: `<path d="M170 8 H190 L186 40 H174 Z" fill="#ef4452" stroke="${INK}" stroke-width="3.5" stroke-linejoin="round"/><circle cx="180" cy="54" r="7.5" fill="#ef4452" stroke="${INK}" stroke-width="3.5"/>`,
    zzz: [[236, 44, 1], [262, 24, 1.3], [292, 2, 1.65]].map(([x, y, k]) => `<path d="M${x} ${y} h${16 * k} l${-16 * k} ${18 * k} h${16 * k}" fill="none" stroke="#3b82f6" stroke-width="${5 * k}" stroke-linecap="round" stroke-linejoin="round"/>`).join(''),
  }[deco] || '';

  const emblem = `<g fill="${INK}" stroke="${INK}" stroke-width="2.4" stroke-linecap="round"><ellipse cx="180" cy="300" rx="6.5" ry="9"/><circle cx="180" cy="288" r="3.8"/><path d="M174 296 L160 286 M173 301 L157 301 M174 306 L160 317 M186 296 L200 286 M187 301 L203 301 M186 306 L200 317" fill="none"/></g>`;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="360" height="360" viewBox="0 0 360 360">
  <defs>
    <linearGradient id="fade" gradientUnits="userSpaceOnUse" x1="0" y1="296" x2="0" y2="354"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="#000"/></linearGradient>
    <mask id="m"><rect width="360" height="360" fill="url(#fade)"/></mask>
    <radialGradient id="lensG" cx=".4" cy=".3" r=".9"><stop offset="0" stop-color="#fff"/><stop offset=".75" stop-color="#f3f3f6"/><stop offset="1" stop-color="#cfcfd8"/></radialGradient>
    <linearGradient id="shade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".12"/><stop offset="1" stop-color="#000" stop-opacity=".28"/></linearGradient>
    <clipPath id="hc"><path d="M180 56 C252 56 288 104 286 154 C284 210 242 244 180 244 C118 244 76 210 74 154 C72 104 108 56 180 56 Z"/></clipPath>
    <clipPath id="tc"><path d="M70 360 C72 292 100 252 150 240 L210 240 C260 252 288 292 290 360 Z"/></clipPath>
  </defs>
  <g mask="url(#m)">
    <g transform="translate(${yaw * 6} 0)">
      <path d="M70 360 C72 292 100 252 150 240 L210 240 C260 252 288 292 290 360 Z" fill="${RED}" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>
      <g clip-path="url(#tc)"><path d="M180 244 L146 360 M180 244 L180 360 M180 244 L214 360 M118 268 Q180 296 242 268 M100 304 Q180 332 260 304" stroke="${WEB}" stroke-width="2.2" fill="none" opacity=".85"/></g>
      <path d="M70 360 C72 300 86 268 112 250 L136 244 C116 276 108 312 110 360 Z" fill="${GREY}" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>
      <path d="M290 360 C288 300 274 268 248 250 L224 244 C244 276 252 312 250 360 Z" fill="${GREY}" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>
      <path d="M84 330 L102 262 M276 330 L258 262" stroke="${GREY_L}" stroke-width="9" stroke-linecap="round"/>
      ${emblem}
    </g>
    <g transform="translate(${hx} ${hy}) rotate(${r} 180 240)">
      <path d="M180 56 C252 56 288 104 286 154 C284 210 242 244 180 244 C118 244 76 210 74 154 C72 104 108 56 180 56 Z" fill="${RED}"/>
      <g clip-path="url(#hc)">
        <g transform="translate(${180 + fx} ${150 + fy})">
          <path d="${web}" stroke="${WEB}" stroke-width="2.4" fill="none" opacity=".9"/>
          ${lensShape(-1)}${lensShape(1)}${blush}
        </g>
      </g>
      <path d="M180 56 C252 56 288 104 286 154 C284 210 242 244 180 244 C118 244 76 210 74 154 C72 104 108 56 180 56 Z" fill="url(#shade)"/>
      <path d="M180 56 C252 56 288 104 286 154 C284 210 242 244 180 244 C118 244 76 210 74 154 C72 104 108 56 180 56 Z" fill="none" stroke="${INK}" stroke-width="6.5" stroke-linejoin="round"/>
      ${tears}
    </g>
    ${decoSvg}
  </g></svg>`;
}

const DIRS = []; for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) DIRS.push({ yaw: c - 1, pitch: r - 1 });
const REACT = [
  { eyes: 'happy' },                                  // 0 happy
  { eyes: 'happy', deco: 'heart' },                   // 1 love
  { eyes: 'happy', deco: 'sparkle' },                 // 2 sparkle
  { eyes: 'wide', deco: 'bang' },                     // 3 surprised
  { eyes: 'star' },                                   // 4 star eyes
  { eyes: 'happy', deco: 'blush' },                   // 5 blush
  { eyes: 'sleep', deco: 'zzz', roll: -3 },           // 6 sleeping
  { eyes: 'dizzy', roll: 4 },                         // 7 dizzy
  { eyes: 'happy', deco: 'tears', roll: -4 },         // 8 laughing
];

(async () => {
  const CELL = 480;
  for (const [name, list] of [['spider-directions', DIRS], ['spider-reactions', REACT]]) {
    const tiles = [];
    for (let i = 0; i < 9; i++) {
      const png = await sharp(Buffer.from(cell(list[i])), { density: 96 * CELL / 360 }).resize(CELL, CELL).png().toBuffer();
      tiles.push({ input: png, left: (i % 3) * CELL, top: Math.floor(i / 3) * CELL });
    }
    await sharp({ create: { width: CELL * 3, height: CELL * 3, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } }).composite(tiles).webp({ quality: 92, alphaQuality: 100 }).toFile('d:/cv/public/mascot/' + name + '.webp');
    await sharp('d:/cv/public/mascot/' + name + '.webp').flatten({ background: '#1d2a44' }).resize(900).jpeg().toFile(process.argv[2] + '/' + name + '_preview.jpg');
  }
  console.log('ok');
})();

