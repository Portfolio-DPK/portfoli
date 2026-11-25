const sharp = require('sharp');
const RED = '#cf3128', WEB_B = '#2a0a0c', LIMB = '#3d3d41', LIMB_L = '#5a5a60', INK = '#141416', OUT = 4.5;
const W = 460, H = 730;

const star = (cx, cy, R, fill) => { let d = ''; for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? R * 0.45 : R; d += (i ? 'L' : 'M') + (cx + Math.cos(a) * rr).toFixed(1) + ' ' + (cy + Math.sin(a) * rr).toFixed(1); } return `<path d="${d}Z" fill="${fill}" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/>`; };
const spiral = (cx, cy) => { let d = ''; for (let t = 0; t <= 4.6 * Math.PI; t += 0.25) { const rr = 2 + t * 1.7; d += (t ? 'L' : 'M') + (cx + Math.cos(t) * rr).toFixed(1) + ' ' + (cy + Math.sin(t) * rr).toFixed(1); } return `<path d="${d}" fill="none" stroke="${INK}" stroke-width="3.2" stroke-linecap="round"/>`; };

// head, drawn in chibi coordinates (centre 180,150). yaw/pitch are in the head's OWN frame.
function head({ yaw = 0, pitch = 0, eyes = 'open', deco }) {
  const fx = yaw * 34, fy = pitch * 30, far = Math.abs(yaw);
  const sxFar = 1 - 0.48 * far, sxNear = 1 + 0.12 * far;
  const sxL = yaw > 0 ? sxFar : sxNear, sxR = yaw > 0 ? sxNear : sxFar;
  const LENS = 'M-100 -22 C-80 -46 -30 -22 -8 22 C-26 52 -72 54 -94 28 C-106 14 -106 -8 -100 -22 Z';
  const HAPPY = 'M-100 18 Q-54 -54 -8 18 Q-54 -6 -100 18 Z';
  const SLEEP = 'M-98 -6 Q-54 40 -8 -6 Q-54 20 -98 -6 Z';
  const lens = (side) => {
    const sx = side < 0 ? sxL : sxR, cx = side * 55, cy = 8, scY = eyes === 'wide' ? 1.24 : 1;
    const shape = eyes === 'happy' ? HAPPY : eyes === 'sleep' ? SLEEP : LENS;
    const mirror = side > 0 ? 'scale(-1 1)' : '';
    let extra = '';
    if (eyes === 'star') extra = star(cx, cy, 23, '#fcd34d');
    if (eyes === 'dizzy') extra = spiral(cx, cy);
    return `<g transform="translate(${cx} ${cy}) scale(${sx} ${scY}) translate(${-cx} ${-cy})"><path d="${shape}" transform="${mirror}" fill="url(#lensG)" stroke="${INK}" stroke-width="7" stroke-linejoin="round"/>${extra}</g>`;
  };
  let web = '';
  for (const x of [-140, -92, -48, 0, 48, 92, 140]) web += `M0 -112 L${x} 120 `;
  for (const y of [-84, -48, -8, 34, 76]) web += `M-150 ${y} Q0 ${y + 34} 150 ${y} `;
  const blush = deco === 'blush' ? [-1, 1].map((s) => `<g stroke="#ff9db1" stroke-width="6" stroke-linecap="round">${[0, 16, 32].map((o) => `<path d="M${s * (34 + o)} 74 l${s * 9} -15"/>`).join('')}</g>`).join('') : '';
  const P = 'M180 56 C252 56 288 104 286 154 C284 210 242 244 180 244 C118 244 76 210 74 154 C72 104 108 56 180 56 Z';
  return `<path d="${P}" fill="${RED}"/><g clip-path="url(#hc)"><g transform="translate(${180 + fx} ${150 + fy})"><path d="${web}" stroke="${WEB_B}" stroke-width="2.8" fill="none" opacity=".9"/>${lens(-1)}${lens(1)}${blush}</g></g><path d="${P}" fill="url(#hshade)"/><path d="${P}" fill="none" stroke="${INK}" stroke-width="8" stroke-linejoin="round"/>`;
}

// decorations sit BELOW the head (he hangs head-down), never rotated
const HX = 262, HY = 568;
const DECO = {
  heart: `<path d="M${HX} 676 C${HX - 44} 646 ${HX - 16} 618 ${HX} 640 C${HX + 16} 618 ${HX + 44} 646 ${HX} 676Z" fill="#ef4452" stroke="${INK}" stroke-width="4.5" stroke-linejoin="round"/>`,
  sparkle: star(HX - 66, 650, 15, '#facc15') + star(HX, 672, 22, '#facc15') + star(HX + 66, 648, 15, '#facc15'),
  bang: `<path d="M${HX + 92} 536 h18 l-4 34 h-10z" fill="#ef4452" stroke="${INK}" stroke-width="3.5" stroke-linejoin="round"/><circle cx="${HX + 101}" cy="584" r="8" fill="#ef4452" stroke="${INK}" stroke-width="3.5"/>`,
  zzz: [[HX + 78, 596, 1], [HX + 100, 574, 1.3], [HX + 126, 548, 1.65]].map(([x, y, k]) => `<path d="M${x} ${y} h${15 * k} l${-15 * k} ${17 * k} h${15 * k}" fill="none" stroke="#3b82f6" stroke-width="${5 * k}" stroke-linecap="round" stroke-linejoin="round"/>`).join(''),
  tears: [-1, 1].map((s) => `<path d="M${HX + s * 74} 586 q${s * 7} 14 ${s * 1} 26 q${-s * 12} -10 ${-s * 1} -26z" fill="#60a5fa" stroke="${INK}" stroke-width="2.8"/>`).join(''),
};

function body() {
  const thick = (d, w, c, extra = '') => `<path d="${d}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" ${extra}/>`;
  // a limb = ink outline + colour + (web texture) + cylinder shading (shadow low-left, rim light up-right), all inset so nothing spills past the outline
  const limb = (d, w, c, tex) =>
    thick(d, w + OUT * 2, INK) + thick(d, w, c) + (tex ? thick(d, w, 'url(#webTex)') : '') +
    `<g transform="translate(${(-w * 0.2).toFixed(1)} ${(w * 0.06).toFixed(1)})">${thick(d, w * 0.4, '#000', 'stroke-opacity=".26"')}</g>` +
    `<g transform="translate(${(w * 0.22).toFixed(1)} ${(-w * 0.05).toFixed(1)})">${thick(d, w * 0.16, '#fff', 'stroke-opacity=".2"')}</g>`;
  const T = 'M158 352 C196 330 280 330 316 356 C330 410 322 470 290 506 C262 528 214 528 186 506 C152 470 146 410 158 352 Z';

  // a fist wrapped around the vertical thread: fingers curl across it, thumb lies on top
  const fist = (cx, cy, rot) => `
  <g transform="translate(${cx} ${cy}) rotate(${rot}) scale(1.22)">
    <rect x="-21" y="-16" width="42" height="32" rx="14" fill="${RED}" stroke="${INK}" stroke-width="${OUT}"/>
    <rect x="-21" y="-16" width="42" height="32" rx="14" fill="url(#webTex)" opacity=".85"/>
    <rect x="-21" y="-16" width="42" height="32" rx="14" fill="url(#spShadeV)"/>
    <path d="M-17 -5 H17 M-17 5.5 H17" stroke="${INK}" stroke-width="2.6" stroke-linecap="round"/>
    <path d="M-12 -13 Q0 -19 12 -13" stroke="#fff" stroke-opacity=".3" stroke-width="3" fill="none" stroke-linecap="round"/>
    <ellipse cx="-10" cy="-15" rx="9" ry="6" fill="${RED}" stroke="${INK}" stroke-width="3.4"/>
    <ellipse cx="-10" cy="-15" rx="9" ry="6" fill="url(#webTex)" opacity=".8"/>
  </g>`;

  const thread = `<g stroke-linecap="round" fill="none">
    <path d="M231.6 -4 V206" stroke="#7d84a3" stroke-width="2" opacity=".55"/>
    <path d="M230 -4 V206" stroke="#f1f2f8" stroke-width="2.6"/>
    <path d="M226.5 8 Q222 22 225 44 M233.5 6 Q239 24 235 46" stroke="#e9e9ee" stroke-width="1.1" opacity=".7"/>
  </g>`;
  // thread wrapped around both ankles
  const wraps = `<g fill="none" stroke-linecap="round">
    <path d="M198 66 Q230 78 262 66" stroke="#7d84a3" stroke-width="5.5" opacity=".5"/><path d="M198 76 Q230 88 262 76" stroke="#7d84a3" stroke-width="5.5" opacity=".5"/>
    <path d="M198 66 Q230 78 262 66" stroke="#f1f2f8" stroke-width="3"/><path d="M198 76 Q230 88 262 76" stroke="#f1f2f8" stroke-width="3"/><path d="M200 86 Q230 98 260 86" stroke="#f1f2f8" stroke-width="3"/>
    <path d="M214 62 L224 92 M246 62 L236 92" stroke="#f1f2f8" stroke-width="1.6" opacity=".8"/>
  </g>`;
  const foot = (d) => `<path d="${d}" fill="${RED}" stroke="${INK}" stroke-width="${OUT}" stroke-linejoin="round"/><path d="${d}" fill="url(#webTex)"/><path d="${d}" fill="url(#spShadeV)"/>`;

  return `
  ${thread}
  ${limb('M82 238 C64 292 98 352 152 364', 50, LIMB)}${limb('M378 238 C396 292 362 352 308 364', 50, LIMB)}
  ${limb('M212 48 L90 230', 54, RED, 1)}${limb('M248 48 L370 230', 54, RED, 1)}
  <path d="M52 214 L108 192 L124 228 L72 256 Z" fill="${LIMB_L}" stroke="${INK}" stroke-width="${OUT}" stroke-linejoin="round"/>
  <path d="M408 214 L352 192 L336 228 L388 256 Z" fill="${LIMB_L}" stroke="${INK}" stroke-width="${OUT}" stroke-linejoin="round"/>
  <path d="M62 218 L104 202 M404 218 L356 202" stroke="#fff" stroke-opacity=".22" stroke-width="3" stroke-linecap="round"/>
  ${foot('M200 22 Q216 4 228 24 L232 96 L196 100 Z')}${foot('M232 24 Q244 4 260 22 L264 100 L228 96 Z')}
  <path d="M198 97 H232 M228 97 H262" stroke="${LIMB_L}" stroke-width="9" stroke-linecap="round" stroke-opacity=".9"/>
  ${wraps}
  <path d="${T}" fill="${RED}" stroke="${INK}" stroke-width="${OUT}" stroke-linejoin="round"/><path d="${T}" fill="url(#webTex)"/><path d="${T}" fill="url(#spShadeV)"/>
  <path d="M170 392 Q196 372 232 376 M300 392 Q276 372 242 376 M184 470 Q238 494 292 470" stroke="#000" stroke-opacity=".18" stroke-width="3" fill="none" stroke-linecap="round"/>
  <path d="M312 364 C326 410 320 466 292 502" stroke="#fff" stroke-opacity=".22" stroke-width="4" fill="none" stroke-linecap="round"/>
  <g fill="${INK}" stroke="${INK}" stroke-width="2" stroke-linecap="round"><ellipse cx="238" cy="440" rx="6" ry="8"/><circle cx="238" cy="451" r="3.6"/><path d="M232 436 L220 428 M232 441 L218 441 M232 446 L220 455 M244 436 L256 428 M244 441 L258 441 M244 446 L256 455" fill="none"/></g>
  ${limb('M224 202 L188 292 L176 364', 36, LIMB)}${limb('M236 176 L284 296 L304 366', 36, LIMB)}
  ${thick('M190 304 L180 352 M282 304 L298 354', 14, LIMB_L)}${thick('M203 244 L220 250 M262 244 L276 258', 9, RED)}
  <path d="M230 206 q-8 12 3 26 q6 8 -2 16" stroke="#f1f2f8" stroke-width="2.4" fill="none" stroke-linecap="round"/>
  ${fist(238, 174, 4)}${fist(224, 203, -5)}`;
}

function cell({ yaw = 0, pitch = 0, eyes = 'open', deco: d, roll = 0 }) {
  // he hangs head-down, so the face is drawn upright then flipped 180°: his own frame = screen frame negated
  const headSvg = head({ yaw: -yaw, pitch: -pitch, eyes, deco: d });
  const wrap = { heart: 'translate(0 22)', sparkle: 'translate(0 22)', bang: 'translate(26 6)', zzz: 'translate(34 14)', tears: 'translate(262 600) scale(1.3 1) translate(-262 -600)' }[d];
  const D = d && DECO[d] ? `<g transform="${wrap}">${DECO[d]}</g>` : '';
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <pattern id="webTex" width="19" height="19" patternUnits="userSpaceOnUse" patternTransform="rotate(18)"><path d="M0 9.5 H19 M9.5 0 V19" stroke="${WEB_B}" stroke-width="1.25" fill="none" opacity=".85"/><path d="M0 0 L19 19 M19 0 L0 19" stroke="${WEB_B}" stroke-width=".8" fill="none" opacity=".55"/></pattern>
    <linearGradient id="spShadeV" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".1"/><stop offset="1" stop-color="#000" stop-opacity=".3"/></linearGradient>
    <linearGradient id="hshade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".12"/><stop offset="1" stop-color="#000" stop-opacity=".28"/></linearGradient>
    <radialGradient id="lensG" cx=".4" cy=".3" r=".9"><stop offset="0" stop-color="#fff"/><stop offset=".75" stop-color="#f3f3f6"/><stop offset="1" stop-color="#cfcfd8"/></radialGradient>
    <clipPath id="hc"><path d="M180 56 C252 56 288 104 286 154 C284 210 242 244 180 244 C118 244 76 210 74 154 C72 104 108 56 180 56 Z"/></clipPath>
  </defs>
  ${body()}
  <g transform="translate(${HX} ${HY}) rotate(${180 + 14 + roll - yaw * 6}) scale(0.8) translate(-180 -150)">${headSvg}</g>
  ${D}
</svg>`;
}
const DIRS = []; for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) DIRS.push({ yaw: c - 1, pitch: r - 1 });
const REACT = [
  { eyes: 'happy' }, { eyes: 'happy', deco: 'heart' }, { eyes: 'happy', deco: 'sparkle' },
  { eyes: 'wide', deco: 'bang' }, { eyes: 'star' }, { eyes: 'happy', deco: 'blush' },
  { eyes: 'sleep', deco: 'zzz', roll: -3 }, { eyes: 'dizzy', roll: 4 }, { eyes: 'happy', deco: 'tears', roll: -4 },
];
module.exports = { cell, DIRS, REACT, W, H };

if (require.main === module) (async () => {
  const S = 0.9, cw = Math.round(W * S), ch = Math.round(H * S);
  for (const [name, list] of [['hang-directions', DIRS], ['hang-reactions', REACT]]) {
    const tiles = [];
    for (let i = 0; i < 9; i++) {
      const png = await sharp(Buffer.from(cell(list[i])), { density: 96 * S }).resize(cw, ch).png().toBuffer();
      tiles.push({ input: png, left: (i % 3) * cw, top: Math.floor(i / 3) * ch });
    }
    await sharp({ create: { width: cw * 3, height: ch * 3, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } }).composite(tiles).webp({ quality: 92, alphaQuality: 100 }).toFile('d:/cv/public/hero/' + name + '.webp');
    await sharp('d:/cv/public/hero/' + name + '.webp').flatten({ background: '#1d2a44' }).resize(1000).jpeg().toFile(process.argv[2] + '/' + name + '_preview.jpg');
  }
  console.log('ok', cw, ch);
})();
