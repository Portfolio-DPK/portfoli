import React, { useMemo } from 'react';

/**
 * Hero scene, 100% drawn in code (no photos): a night metropolis seen from a rooftop.
 * Back → front, each layer is a separate full-viewport element so it can be parallaxed (see Hero.tsx):
 *
 *   hero-bg    sky, stars, moon, clouds, far skyline        (slowest)
 *   hero-mid   mid skyline with towers + drifting haze      (medium)
 *   hero-near  dark near rooftops                           (fast)
 *   hero-roof  parapet, antenna, water tower, vents         (fastest)
 *
 * Every window belongs to one of two sets. "Always-on" windows are lit in the dark state; "switch" windows
 * fade in with the CSS variable --lit (0 → 1), which the Spider-Man pull-switch animates.
 */

const mulberry = (seed: number) => () => {
  seed |= 0;
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

const W = 1440;
const H = 900;
const svgProps = {
  viewBox: `0 0 ${W} ${H}`,
  preserveAspectRatio: 'xMidYMid slice' as const,
  className: 'absolute inset-0 h-full w-full',
};

interface Building {
  x: number;
  w: number;
  top: number;
  tier?: { dx: number; w: number; h: number };
  ant?: number;
}

const makeSkyline = (seed: number, base: number, hMin: number, hMax: number, wMin: number, wMax: number, tall: number): Building[] => {
  const r = mulberry(seed);
  const out: Building[] = [];
  let x = -50;
  while (x < W + 50) {
    const w = wMin + r() * (wMax - wMin);
    const isTall = r() < tall;
    const h = hMin + Math.pow(r(), isTall ? 0.55 : 1.9) * (hMax - hMin);
    out.push({
      x,
      w,
      top: base - h,
      tier: r() < 0.42 ? { dx: w * 0.18, w: w * 0.64, h: 10 + r() * 30 } : undefined,
      ant: isTall && r() < 0.65 ? 22 + r() * 46 : 0,
    });
    x += w * (r() < 0.3 ? 0.72 : 1) + (r() < 0.2 ? 5 + r() * 14 : 0);
  }
  return out;
};

interface Skyline {
  body: string;
  rim: string;
  always: string;
  warm: string;
  cool: string;
  beacons: { x: number; y: number }[];
}

const buildSkyline = (bs: Building[], seed: number, cell: { w: number; h: number; gx: number; gy: number }, density: number, floor: number): Skyline => {
  const r = mulberry(seed + 99);
  let body = '';
  let rim = '';
  let always = '';
  let warm = '';
  let cool = '';
  const beacons: { x: number; y: number }[] = [];
  const rect = (x: number, y: number, w: number, h: number) => `M${x.toFixed(1)} ${y.toFixed(1)}h${w.toFixed(1)}v${h.toFixed(1)}h${(-w).toFixed(1)}z`;
  for (const b of bs) {
    body += rect(b.x, b.top, b.w, H - b.top);
    rim += rect(b.x, b.top, b.w, 1.6);
    if (b.tier) {
      body += rect(b.x + b.tier.dx, b.top - b.tier.h, b.tier.w, b.tier.h + 2);
      rim += rect(b.x + b.tier.dx, b.top - b.tier.h, b.tier.w, 1.6);
    }
    if (b.ant) {
      body += rect(b.x + b.w / 2 - 0.9, b.top - (b.tier?.h ?? 0) - b.ant, 1.8, b.ant + 2);
      beacons.push({ x: b.x + b.w / 2, y: b.top - (b.tier?.h ?? 0) - b.ant });
    }
    const cols = Math.max(1, Math.floor((b.w - 8) / (cell.w + cell.gx)));
    const offX = (b.w - cols * (cell.w + cell.gx) + cell.gx) / 2;
    for (let cy = b.top + 9; cy < floor; cy += cell.h + cell.gy) {
      for (let c = 0; c < cols; c++) {
        if (r() > density) continue;
        const wx = b.x + offX + c * (cell.w + cell.gx);
        const d = rect(wx, cy, cell.w, cell.h);
        const roll = r();
        if (roll < 0.11) always += d;
        else if (roll < 0.8) warm += d;
        else cool += d;
      }
    }
  }
  return { body, rim, always, warm, cool, beacons };
};

const LIT = 'calc(.06 + .94 * var(--lit, 0))';

const SkylineSvg: React.FC<{
  sky: Skyline;
  fill: string;
  rimColor: string;
  glow?: boolean;
  haze?: { top: number; color: string };
}> = ({ sky, fill, rimColor, glow, haze }) => (
  <svg {...svgProps}>
    <defs>
      <linearGradient id={`hz-${fill.slice(1)}`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor={haze?.color ?? '#000'} stopOpacity="0" />
        <stop offset="1" stopColor={haze?.color ?? '#000'} stopOpacity=".55" />
      </linearGradient>
    </defs>
    <path d={sky.body} fill={fill} />
    {haze && <rect x="0" y={haze.top} width={W} height={H - haze.top} fill={`url(#hz-${fill.slice(1)})`} />}
    <path d={sky.rim} fill={rimColor} style={{ opacity: 'calc(.25 + .6 * var(--lit, 0))' }} />
    <path d={sky.always} fill="#ffd28a" opacity=".85" />
    {/* soft window glow: a fat translucent stroke instead of a blur filter (blur on a full-screen path is very costly) */}
    {glow && <path d={sky.warm} fill="#ff9e4a" stroke="#ff9e4a" strokeWidth="3.2" strokeLinejoin="round" style={{ opacity: `calc(.2 * var(--lit, 0))` }} />}
    <path d={sky.warm} fill="#ffcf7a" style={{ opacity: LIT }} />
    <path d={sky.cool} fill="#a8cbff" style={{ opacity: LIT }} />
    {sky.beacons.map((b, i) => (
      <circle key={i} cx={b.x} cy={b.y} r="2.2" fill="#ff3b4d" className="beacon" style={{ animationDelay: `${(i % 5) * 0.6}s` }} />
    ))}
  </svg>
);

export const BgLayer: React.FC = () => {
  const stars = useMemo(() => {
    const r = mulberry(11);
    return Array.from({ length: 170 }, () => ({ x: r() * W, y: Math.pow(r(), 1.5) * 470, s: 0.4 + r() * 1.2, o: 0.25 + r() * 0.7, d: r() * 4 }));
  }, []);
  const clouds = useMemo(() => {
    const r = mulberry(3);
    return Array.from({ length: 8 }, () => ({ x: r() * W, y: 190 + r() * 260, rx: 160 + r() * 280, ry: 12 + r() * 24, o: 0.1 + r() * 0.16 }));
  }, []);
  const far = useMemo(() => buildSkyline(makeSkyline(21, 640, 70, 250, 22, 56, 0.1), 21, { w: 2.2, h: 3.2, gx: 3.2, gy: 4 }, 0.5, 720), []);
  return (
    <div className="absolute inset-x-0 top-0 h-[122%]">
      <svg {...svgProps}>
        <defs>
          <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#05040f" />
            <stop offset=".32" stopColor="#120c30" />
            <stop offset=".55" stopColor="#2a1650" />
            <stop offset=".72" stopColor="#5b2a68" />
            <stop offset=".86" stopColor="#a04468" />
            <stop offset="1" stopColor="#e07a58" />
          </linearGradient>
          <radialGradient id="moonGlow">
            <stop offset="0" stopColor="#fff3dc" stopOpacity=".9" />
            <stop offset=".12" stopColor="#ffe9c9" stopOpacity=".55" />
            <stop offset=".4" stopColor="#c9b6ff" stopOpacity=".16" />
            <stop offset="1" stopColor="#c9b6ff" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="cloud">
            <stop offset="0" stopColor="#b9a4e6" stopOpacity="1" />
            <stop offset="1" stopColor="#b9a4e6" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="horizon" cx=".5" cy="1" r=".8">
            <stop offset="0" stopColor="#ff9a5a" stopOpacity=".55" />
            <stop offset="1" stopColor="#ff9a5a" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width={W} height={H} fill="url(#sky)" />
        {stars.map((s, i) => (
          <circle key={i} cx={s.x} cy={s.y} r={s.s} fill="#fff" opacity={s.o} className={i % 4 === 0 ? 'twinkle' : undefined} style={{ animationDelay: `${s.d}s` }} />
        ))}
        {clouds.map((c, i) => (
          <ellipse key={i} cx={c.x} cy={c.y} rx={c.rx} ry={c.ry} fill="url(#cloud)" opacity={c.o} />
        ))}
        <circle cx="1010" cy="395" r="230" fill="url(#moonGlow)" />
        <circle cx="1010" cy="395" r="34" fill="#fff6e6" />
        <circle cx="999" cy="387" r="6" fill="#e8dcc8" opacity=".55" />
        <circle cx="1021" cy="406" r="4.5" fill="#e8dcc8" opacity=".5" />
        <circle cx="1006" cy="411" r="3" fill="#e8dcc8" opacity=".4" />
        {/* city glow on the horizon, stronger when the lights are on */}
        <rect x="0" y="380" width={W} height="400" fill="url(#horizon)" style={{ opacity: 'calc(.3 + .7 * var(--lit, 0))' }} />
      </svg>
      <SkylineSvg sky={far} fill="#2a1c4d" rimColor="#a58cff" haze={{ top: 440, color: '#c0607a' }} />
    </div>
  );
};

/** soft haze: overlapping ellipses drifting sideways forever */
export const Haze: React.FC<{ top: number; height: number; opacity: number; speed?: number; reverse?: boolean; rgb?: string }> = ({
  top,
  height,
  opacity,
  speed = 70,
  reverse,
  rgb = '170,110,190',
}) => (
  <div className="absolute inset-x-0 pointer-events-none overflow-hidden" style={{ top: `${top}%`, height: `${height}%`, opacity }}>
    <div
      className="fog-drift absolute inset-y-0 -left-[25%] w-[150%]"
      style={{
        animationDuration: `${speed}s`,
        animationDirection: reverse ? 'reverse' : 'normal',
        background: [
          `radial-gradient(ellipse 22% 55% at 12% 55%, rgba(${rgb},.5), transparent 70%)`,
          `radial-gradient(ellipse 28% 60% at 34% 45%, rgba(${rgb},.4), transparent 70%)`,
          `radial-gradient(ellipse 20% 50% at 55% 60%, rgba(${rgb},.45), transparent 70%)`,
          `radial-gradient(ellipse 30% 62% at 78% 48%, rgba(${rgb},.4), transparent 70%)`,
          `radial-gradient(ellipse 18% 48% at 94% 58%, rgba(${rgb},.4), transparent 70%)`,
        ].join(','),
      }}
    />
  </div>
);

export const MidLayer: React.FC = () => {
  const mid = useMemo(() => buildSkyline(makeSkyline(47, 745, 120, 400, 46, 108, 0.2), 47, { w: 4.5, h: 6.5, gx: 5, gy: 6.5 }, 0.46, 860), []);
  return (
    <div className="absolute inset-x-0 top-0 h-[150%]">
      <SkylineSvg sky={mid} fill="#130c2c" rimColor="#b29bff" glow haze={{ top: 560, color: '#8a4a8a' }} />
      <Haze top={50} height={15} opacity={0.45} speed={90} />
    </div>
  );
};

export const NearLayer: React.FC = () => {
  const near = useMemo(() => buildSkyline(makeSkyline(71, 840, 60, 190, 70, 150, 0.05), 71, { w: 6, h: 8, gx: 8, gy: 11 }, 0.3, 900), []);
  return (
    <div className="absolute inset-x-0 top-0 h-[170%]">
      <SkylineSvg sky={near} fill="#0a0620" rimColor="#c4acff" />
    </div>
  );
};

export const FrontHazeLayer: React.FC = () => (
  <div className="absolute inset-0 pointer-events-none">
    <Haze top={68} height={18} opacity={0.32} speed={55} reverse rgb="140,100,180" />
  </div>
);

/** rooftop parapet drawn as vectors, with the extension underneath so scrolling never exposes a gap */
export const RoofLayer: React.FC = () => (
  <div className="absolute inset-0">
    <svg {...svgProps} preserveAspectRatio="xMidYMax slice">
      <defs>
        <linearGradient id="roofBody" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1d1520" />
          <stop offset="1" stopColor="#0d0910" />
        </linearGradient>
        <linearGradient id="cap" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#4a4258" />
          <stop offset="1" stopColor="#262031" />
        </linearGradient>
        <pattern id="brick" width="64" height="26" patternUnits="userSpaceOnUse">
          <rect width="64" height="26" fill="#1a1219" />
          <rect x="1" y="1" width="30" height="11" fill="#27191d" />
          <rect x="33" y="1" width="30" height="11" fill="#2d1c20" />
          <rect x="-15" y="14" width="30" height="11" fill="#2a1b20" />
          <rect x="17" y="14" width="30" height="11" fill="#231619" />
          <rect x="49" y="14" width="30" height="11" fill="#2b1c20" />
        </pattern>
      </defs>
      {/* silhouettes standing on the roof */}
      <g fill="#07050d">
        {/* TV antenna, left */}
        <rect x="150" y="610" width="3" height="170" />
        <path d="M110 640 L196 628 M118 654 L190 640 M124 668 L184 652 M132 682 L176 664 M104 628 L202 616" stroke="#07050d" strokeWidth="2.4" />
        <rect x="104" y="614" width="3" height="30" />
        {/* vent pipe */}
        <path d="M60 780 V700 Q60 678 84 678 H100 V700 H84 Q80 700 80 706 V780 Z" />
        {/* water tower, right */}
        <path d="M1208 600 L1212 596 H1312 L1316 600 V690 H1208 Z" />
        <path d="M1202 600 L1262 566 L1322 600 Z" />
        <path d="M1216 690 L1204 780 H1214 L1228 690 Z M1296 690 L1308 780 H1318 L1304 690 Z M1228 700 L1306 770 M1300 700 L1222 770" stroke="#07050d" strokeWidth="5" fill="none" />
        {/* AC unit + small mast */}
        <rect x="940" y="728" width="96" height="52" rx="3" />
        <rect x="1380" y="640" width="3" height="140" />
        <circle cx="1381.5" cy="640" r="3" fill="#ff3b4d" className="beacon" />
      </g>
      {/* rim light on the silhouettes (moon side) */}
      <g stroke="#a58cff" strokeOpacity=".45" strokeWidth="1.4" fill="none">
        <path d="M1202 600 L1262 566 L1322 600" />
        <path d="M1208 600 V690" />
        <path d="M940 728 H1036" />
      </g>
      {/* parapet */}
      <rect x="0" y="780" width={W} height="130" fill="url(#roofBody)" />
      <rect x="0" y="796" width={W} height="130" fill="url(#brick)" opacity=".75" />
      <rect x="0" y="766" width={W} height="30" fill="url(#cap)" />
      <rect x="0" y="766" width={W} height="2.2" fill="#b29bff" opacity=".55" />
      <rect x="0" y="796" width={W} height="3" fill="#000" opacity=".5" />
      <path d="M0 770 H220 M300 770 H620 M720 770 H1100 M1180 770 H1440" stroke="#000" strokeOpacity=".35" strokeWidth="1.5" />
      <g stroke="#0b070e" strokeWidth="2" opacity=".6">
        <path d="M220 766 V796 M620 766 V796 M1100 766 V796" />
      </g>
    </svg>
    <div className="absolute inset-x-0 bottom-0 h-[12%] bg-gradient-to-b from-transparent to-[#0d0910]" />
    <div className="absolute inset-x-0 top-full h-screen bg-gradient-to-b from-[#0d0910] to-[#07050b]" />
  </div>
);

/** thin spider-web in the top-left corner — a quiet nod to the theme */
export const Web: React.FC = () => (
  <svg viewBox="0 0 300 300" className="absolute left-0 top-0 h-[34vh] w-[34vh] pointer-events-none" fill="none" stroke="#e9e4ff" strokeOpacity=".25" strokeWidth="1">
    {[0, 15, 32, 50, 70, 90].map((a) => (
      <line key={a} x1="0" y1="0" x2={300 * Math.cos((a * Math.PI) / 180)} y2={300 * Math.sin((a * Math.PI) / 180)} />
    ))}
    {[50, 95, 145, 200, 260].map((r, i) => (
      <path
        key={r}
        d={[0, 15, 32, 50, 70, 90]
          .map((a, j) => {
            const x = r * Math.cos((a * Math.PI) / 180);
            const y = r * Math.sin((a * Math.PI) / 180);
            return j === 0 ? `M${x.toFixed(0)} ${y.toFixed(0)}` : `Q${(x + (i % 2 ? 4 : 8)).toFixed(0)} ${(y + 8).toFixed(0)} ${x.toFixed(0)} ${y.toFixed(0)}`;
          })
          .join('')}
      />
    ))}
  </svg>
);

/** film grain + vignette + a faint violet tint over every layer so everything reads as one frame */
export const Grade: React.FC = () => (
  <>
    <div
      className="absolute inset-0 opacity-[.06] pointer-events-none"
      style={{
        backgroundImage:
          "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 .5  0 0 0 0 .5  0 0 0 0 .5  0 0 0 1.4 -.2'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
      }}
    />
    <div className="absolute inset-0 pointer-events-none [background:radial-gradient(ellipse_at_50%_45%,transparent_55%,rgba(4,2,12,.55)_100%)]" />
    <div className="absolute inset-0 pointer-events-none bg-[#5a3a9a]/[.035]" />
  </>
);




