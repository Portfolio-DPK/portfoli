import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { Heart, Star } from 'lucide-react';

type Mood = 'open' | 'happy' | 'wide' | 'star' | 'dizzy' | 'sleep';

/**
 * The hanging spider-hero: one flat illustration (/hero/spider-hang.webp — feet at the thread, hands gripping it)
 * brought to life with code:
 *   - his head is redrawn in vector (same flat style): the eye and web lines slide toward the mouse, continuously,
 *     and the eye changes shape with the mood (happy / wide / star / dizzy / closed)
 *   - he leans a little toward the mouse
 *   - click → a random happy pop (hearts / stars / sparkles) and a rubber-band bounce
 *   - 5 quick clicks → dizzy (shakes, spiral)
 *   - web being pulled → a startled "!"
 *   - 25 s without moving the mouse → dozes off (zzz, slow breathing); moving the mouse wakes him with a "!"
 * The pendulum swing itself (wind) is handled by <SpiderSwitch/>, which rotates this whole element.
 */
export interface SpiderHandle {
  /** play a reaction: 1 love · 2 sparkle · 3 surprised · 4 stars · 5 blush · 6 sleeping · 7 dizzy · 8 laughing */
  react: (cell: number, ms?: number) => void;
  /** a click: random happy reaction (or dizzy if spammed) */
  poke: () => void;
}

interface Props {
  grabbed?: boolean;
  src?: string;
  className?: string;
}

type Fx = 'heart' | 'sparkle' | 'bang' | 'zzz' | 'stars' | 'dizzy' | 'laugh' | null;
const HAPPY: Fx[] = ['heart', 'sparkle', 'stars', 'heart', 'laugh'];
const CELL_FX: Record<number, Fx> = { 0: 'sparkle', 1: 'heart', 2: 'sparkle', 3: 'bang', 4: 'stars', 5: 'heart', 6: 'zzz', 7: 'dizzy', 8: 'laugh' };
const SLEEP_AFTER_MS = 25_000;
/** width / height of the cut-out */
const ASPECT = 496 / 920;
/** where his head is, as a fraction of the image box */
const HEAD = { x: 0.66, y: 0.9 };

/* ---------- the vector head (drawn in the sprite's own 496 x 920 coordinate space) ---------- */
type P = [number, number];
/** outer edge of the head silhouette, traced from the illustration (it is upside-down: crown at the bottom) */
const HEAD_PTS: P[] = [[207, 790], [205, 812], [207, 836], [215, 860], [232, 878], [256, 890], [285, 892], [305, 880], [318, 860], [325, 832], [327, 800], [323, 770], [318, 755], [311, 744], [299, 737], [280, 733], [262, 737], [245, 748], [228, 765], [215, 780]];
const HEAD_C: P = [266, 813];
/** the neck: the point the head turns about (inside the top of the head, where it meets the torso) */
const NECK: P = [288, 752];
const RED = '#d0342d';
const INK = '#171a1c';
const WEB = '#2a0d0d';

const smooth = (pts: P[]) => {
  const n = pts.length;
  let d = `M${pts[0][0]} ${pts[0][1]}`;
  for (let i = 0; i < n; i++) {
    const p0 = pts[(i - 1 + n) % n], p1 = pts[i], p2 = pts[(i + 1) % n], p3 = pts[(i + 2) % n];
    d += ` C${(p1[0] + (p2[0] - p0[0]) / 6).toFixed(1)} ${(p1[1] + (p2[1] - p0[1]) / 6).toFixed(1)} ${(p2[0] - (p3[0] - p1[0]) / 6).toFixed(1)} ${(p2[1] - (p3[1] - p1[1]) / 6).toFixed(1)} ${p2[0]} ${p2[1]}`;
  }
  return d + 'Z';
};
const HEAD_PATH = smooth(HEAD_PTS);


const star5 = (R: number) => {
  let d = '';
  for (let i = 0; i < 10; i++) {
    const a = -Math.PI / 2 + (i * Math.PI) / 5, r = i % 2 ? R * 0.45 : R;
    d += `${i ? 'L' : 'M'}${(Math.cos(a) * r).toFixed(1)} ${(Math.sin(a) * r).toFixed(1)}`;
  }
  return d + 'Z';
};
const SPIRAL = (() => {
  let d = '';
  for (let t = 0; t <= 4.4 * Math.PI; t += 0.3) d += `${t ? 'L' : 'M'}${(Math.cos(t) * (1.5 + t * 1.5)).toFixed(1)} ${(Math.sin(t) * (1.5 + t * 1.5)).toFixed(1)}`;
  return d;
})();

/** the white lens in its black frame, in coordinates relative to its centre; mood changes the shape */
const Lens: React.FC<{ mood: Mood }> = ({ mood }) => {
  const frame = 'M-21 5 C-15 -8 5 -14 25 -7 C26 3 8 12 -15 22 C-24 18 -24 10 -21 5Z';
  const white = 'M-13 7 C-9 -2 5 -6 15 -3 C10 4 -2 7 -11 10 C-14 10 -14 8 -13 7Z';
  const sy = mood === 'happy' ? 0.5 : mood === 'sleep' ? 0.1 : mood === 'wide' ? 1.3 : 1;
  const sx = mood === 'wide' ? 1.22 : 1;
  return (
    <g transform={`scale(${sx} ${sy})`}>
      <path d={frame} fill={INK} stroke={INK} strokeWidth="2" strokeLinejoin="round" />
      {mood === 'star' ? (
        <path d={star5(15)} transform="translate(1 1)" fill="#fcd34d" stroke={INK} strokeWidth="1.5" strokeLinejoin="round" />
      ) : mood === 'dizzy' ? (
        <>
          <path d={white} fill="#fff" />
          <path d={SPIRAL} transform="translate(2 2) scale(.6)" fill="none" stroke={INK} strokeWidth="2.2" strokeLinecap="round" />
        </>
      ) : (
        mood !== 'sleep' && <path d={white} fill="#fff" />
      )}
    </g>
  );
};

interface HeadHandle {
  look: (yaw: number, pitch: number) => void;
}

/* ---- the head as a little 3D sphere (projected onto the head's ellipse) ----
 * lon/lat on a unit sphere; y points DOWN the screen (he hangs upside-down, so his crown is at the bottom).
 * The face turns about the vertical axis (yaw) and tilts about the screen x-axis (pitch). */
const RX = 58;
const RY = 76;
/** face direction when the mouse is far to his right/left is clamped to this many degrees */
const MAX_YAW = 62;
const MAX_TILT = 18;
/** eyes: half the angle between them, and their latitude (negative = toward his chin, i.e. up on screen) */
const EYE_SPREAD = 24;
const EYE_LAT = -20;
const D2R = Math.PI / 180;

type V3 = [number, number, number];
const sph = (lonDeg: number, latDeg: number): V3 => {
  const lo = lonDeg * D2R, la = latDeg * D2R;
  return [Math.sin(lo) * Math.cos(la), Math.sin(la), Math.cos(lo) * Math.cos(la)];
};
/** rotate a point by yaw (about y) then tilt (about x) */
const rot = ([x, y, z]: V3, yaw: number, tilt: number): V3 => {
  const a = yaw * D2R, b = tilt * D2R;
  const x1 = x * Math.cos(a) + z * Math.sin(a);
  const z1 = -x * Math.sin(a) + z * Math.cos(a);
  return [x1, y * Math.cos(b) - z1 * Math.sin(b), y * Math.sin(b) + z1 * Math.cos(b)];
};
const scr = ([x, y]: V3): P => [HEAD_C[0] + x * RX, HEAD_C[1] + y * RY];

/** polyline of the visible (front, z > 0) parts of a curve sampled on the sphere */
const visiblePath = (pts: V3[]) => {
  let d = '';
  let pen = false;
  for (const p of pts) {
    if (p[2] > -0.02) {
      const [X, Y] = scr(p);
      d += `${pen ? 'L' : 'M'}${X.toFixed(1)} ${Y.toFixed(1)}`;
      pen = true;
    } else pen = false;
  }
  return d;
};

const webPath = (yaw: number, tilt: number) => {
  let d = '';
  // meridians: all meet at the crown (lat 90, bottom of the screen)
  for (let lon = -180; lon < 180; lon += 30) {
    const pts: V3[] = [];
    for (let lat = -80; lat <= 90; lat += 5) pts.push(rot(sph(lon, lat), yaw, tilt));
    d += visiblePath(pts);
  }
  // parallels: rings around the crown
  for (const lat of [-40, -12, 18, 46, 70]) {
    const pts: V3[] = [];
    for (let lon = -180; lon <= 180; lon += 6) pts.push(rot(sph(lon, lat), yaw, tilt));
    d += visiblePath(pts);
  }
  return d;
};

const VectorHead = forwardRef<HeadHandle, { mood: Mood }>(function VectorHead({ mood }, ref) {
  const turn = useRef<SVGGElement>(null);
  const web = useRef<SVGPathElement>(null);
  const eyeL = useRef<SVGGElement>(null);
  const eyeR = useRef<SVGGElement>(null);
  const view = useRef({ yaw: 28, tilt: 0 });

  /** recompute the web and the two eyes for the current view */
  const draw = useCallback(() => {
    const { yaw, tilt } = view.current;
    web.current?.setAttribute('d', webPath(yaw, tilt));
    ([[eyeL.current, -EYE_SPREAD, -1], [eyeR.current, EYE_SPREAD, 1]] as const).forEach(([g, lon, side]) => {
      if (!g) return;
      const p = rot(sph(lon, EYE_LAT), yaw, tilt);
      const [X, Y] = scr(p);
      // foreshortening: an eye turning toward the edge gets narrower, and disappears behind the head
      const depth = Math.max(0, p[2]);
      const sx = side * 1.05 * Math.max(0.12, depth);
      g.setAttribute('transform', `translate(${X.toFixed(1)} ${Y.toFixed(1)}) rotate(${(-tilt * 0.4 + p[0] * 10 * side).toFixed(1)}) scale(${sx.toFixed(3)} -1)`); // y flipped: he is upside-down
      g.style.opacity = depth < 0.12 ? '0' : String(Math.min(1, (depth - 0.12) / 0.18));
    });
  }, []);

  useEffect(() => draw(), [draw, mood]);

  useImperativeHandle(
    ref,
    () => ({
      look: (yaw, pitch) => {
        // the face turns toward the cursor (screen-right cursor -> face turns right), plus a slight lean about the neck
        gsap.to(view.current, { yaw: yaw * MAX_YAW, tilt: pitch * MAX_TILT, duration: 0.6, ease: 'power3.out', overwrite: 'auto', onUpdate: draw });
        gsap.to(turn.current, { rotation: -yaw * 7, svgOrigin: `${NECK[0]} ${NECK[1]}`, duration: 0.6, ease: 'power3.out', overwrite: 'auto' });
      },
    }),
    [draw],
  );

  return (
    <svg viewBox="0 0 496 920" className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden>
      <defs>
        <clipPath id="spiderHeadClip">
          <path d={HEAD_PATH} transform={`translate(${HEAD_C[0]} ${HEAD_C[1]}) scale(.93) translate(${-HEAD_C[0]} ${-HEAD_C[1]})`} />
        </clipPath>
        <radialGradient id="spiderHeadShade" cx="0.42" cy="0.4" r="0.75">
          <stop offset="0" stopColor="#fff" stopOpacity=".1" />
          <stop offset=".7" stopColor="#000" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity=".28" />
        </radialGradient>
      </defs>
      <g ref={turn}>
        <path d={HEAD_PATH} fill={INK} />
        <path d={HEAD_PATH} fill={RED} transform={`translate(${HEAD_C[0]} ${HEAD_C[1]}) scale(.93) translate(${-HEAD_C[0]} ${-HEAD_C[1]})`} />
        <g clipPath="url(#spiderHeadClip)">
          <path ref={web} fill="none" stroke={WEB} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          <g ref={eyeL}>
            <Lens mood={mood} />
          </g>
          <g ref={eyeR}>
            <Lens mood={mood} />
          </g>
          {/* soft roundness so it reads as a ball, not a flat disc */}
          <path d={HEAD_PATH} fill="url(#spiderHeadShade)" />
        </g>
      </g>
    </svg>
  );
});

const Spiral: React.FC = () => (
  <svg viewBox="0 0 40 40" className="h-9 w-9" fill="none" stroke="#fde68a" strokeWidth="3" strokeLinecap="round">
    <path d="M20 20 m0 -2 a2 2 0 1 1 -2 2 a5 5 0 1 1 5 5 a9 9 0 1 1 -9 -9 a13 13 0 1 1 13 13" />
  </svg>
);

const FxIcon: React.FC<{ kind: Exclude<Fx, null> }> = ({ kind }) => {
  const sp = 'absolute drop-shadow-[0_2px_4px_rgba(0,0,0,.5)]';
  if (kind === 'heart')
    return (
      <>
        <Heart className={`${sp} -left-4 top-0 h-7 w-7 fx-a`} fill="#ef4452" stroke="#7f1d1d" strokeWidth={1.5} />
        <Heart className={`${sp} left-4 -top-3 h-9 w-9 fx-b`} fill="#ff6b81" stroke="#7f1d1d" strokeWidth={1.5} />
        <Heart className={`${sp} left-11 top-1 h-6 w-6 fx-c`} fill="#ef4452" stroke="#7f1d1d" strokeWidth={1.5} />
      </>
    );
  if (kind === 'stars' || kind === 'sparkle')
    return (
      <>
        <Star className={`${sp} -left-5 top-0 h-6 w-6 fx-a`} fill="#facc15" stroke="#854d0e" strokeWidth={1.5} />
        <Star className={`${sp} left-3 -top-4 h-9 w-9 fx-b`} fill="#fde047" stroke="#854d0e" strokeWidth={1.5} />
        <Star className={`${sp} left-12 top-1 h-6 w-6 fx-c`} fill="#facc15" stroke="#854d0e" strokeWidth={1.5} />
      </>
    );
  if (kind === 'bang') return <span className={`${sp} left-4 -top-6 text-5xl font-black leading-none text-[#ef4452] fx-b`} style={{ WebkitTextStroke: '2px #fff' }}>!</span>;
  if (kind === 'zzz')
    return (
      <>
        <span className={`${sp} left-2 top-0 text-lg font-black text-sky-300 fx-z`}>z</span>
        <span className={`${sp} left-8 -top-5 text-2xl font-black text-sky-300 fx-z`} style={{ animationDelay: '.5s' }}>z</span>
        <span className={`${sp} left-14 -top-11 text-3xl font-black text-sky-300 fx-z`} style={{ animationDelay: '1s' }}>Z</span>
      </>
    );
  if (kind === 'dizzy') return <span className={`${sp} left-0 -top-3 fx-spin`}><Spiral /></span>;
  return <span className={`${sp} left-0 -top-6 whitespace-nowrap text-2xl font-black text-white fx-b`} style={{ WebkitTextStroke: '1px #1e3a8a' }}>ha ha!</span>;
};

const HangingSpider = forwardRef<SpiderHandle, Props>(function HangingSpider({ grabbed = false, src = '/hero/spider-hang-nohead.webp', className = '' }, ref) {
  const box = useRef<HTMLDivElement>(null);
  const body = useRef<HTMLDivElement>(null);
  const head = useRef<HeadHandle>(null);
  const [fx, setFx] = useState<{ kind: Fx; id: number }>({ kind: null, id: 0 });
  const reduce = useRef(false);
  const s = useRef({ lastMove: Date.now(), clicks: [] as number[], last: -1, timer: 0, sleeping: false, locked: false });

  useEffect(() => {
    reduce.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  /** rubber-band stretch from the point where the web is tied (the top of the figure) */
  const kick = useCallback((kind: 'happy' | 'dizzy' | 'startle') => {
    const el = box.current;
    if (!el || reduce.current) return;
    gsap.killTweensOf(el);
    gsap.set(el, { transformOrigin: '50% 0%' });
    if (kind === 'dizzy') {
      gsap.timeline().to(el, { x: 7, rotation: 5, duration: 0.12, repeat: 11, yoyo: true, ease: 'sine.inOut' }).to(el, { x: 0, rotation: 0, duration: 0.25 });
    } else if (kind === 'startle') {
      gsap.timeline().to(el, { scaleY: 1.1, scaleX: 0.95, duration: 0.12, ease: 'power2.out' }).to(el, { scaleY: 1, scaleX: 1, duration: 0.8, ease: 'elastic.out(1,0.35)' });
    } else {
      gsap.timeline().to(el, { scaleY: 0.92, scaleX: 1.05, duration: 0.1, ease: 'power2.in' }).to(el, { scaleY: 1, scaleX: 1, duration: 0.95, ease: 'elastic.out(1,0.3)' });
    }
  }, []);

  const show = useCallback((kind: Fx, ms: number, k: 'happy' | 'dizzy' | 'startle') => {
    const st = s.current;
    window.clearTimeout(st.timer);
    st.locked = true;
    setFx((f) => ({ kind, id: f.id + 1 }));
    kick(k);
    st.timer = window.setTimeout(() => {
      st.locked = false;
      setFx((f) => ({ kind: st.sleeping ? 'zzz' : null, id: f.id + 1 }));
    }, ms);
  }, [kick]);

  const wake = useCallback(() => {
    const st = s.current;
    if (!st.sleeping) return;
    st.sleeping = false;
    if (body.current) gsap.killTweensOf(body.current);
    show('bang', 900, 'startle');
  }, [show]);

  const poke = useCallback(() => {
    const st = s.current;
    const now = Date.now();
    st.lastMove = now;
    if (st.sleeping) return wake();
    st.clicks = st.clicks.filter((t) => now - t < 2500).concat(now);
    if (st.clicks.length >= 5) {
      st.clicks = [];
      return show('dizzy', 2400, 'dizzy');
    }
    let i = Math.floor(Math.random() * HAPPY.length);
    if (i === st.last) i = (i + 1) % HAPPY.length;
    st.last = i;
    show(HAPPY[i], 1800, 'happy');
  }, [show, wake]);

  useImperativeHandle(ref, () => ({ react: (c, ms = 1800) => show(CELL_FX[c] ?? 'sparkle', ms, 'happy'), poke }), [show, poke]);

  // lean toward the mouse, doze off when nobody moves, breathe
  useEffect(() => {
    const el = body.current;
    let raf = 0;
    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    const apply = () => {
      raf = 0;
      const b = box.current?.getBoundingClientRect();
      if (!b || !el || reduce.current) return;
      const dx = Math.max(-1, Math.min(1, (mx - (b.left + b.width / 2)) / (window.innerWidth * 0.45)));
      gsap.to(el, { rotation: dx * 2.5, duration: 0.7, ease: 'power3.out', overwrite: 'auto', transformOrigin: '50% 0%' });
      // eyes + web slide toward the cursor, measured from where his head is on screen
      const hx = b.left + b.width * 0.62, hy = b.top + b.height * 0.87;
      head.current?.look(Math.max(-1, Math.min(1, (mx - hx) / (window.innerWidth * 0.3))), Math.max(-1, Math.min(1, (my - hy) / (window.innerHeight * 0.4))));
    };
    const onMove = (e: PointerEvent) => {
      mx = e.clientX;
      my = e.clientY;
      s.current.lastMove = Date.now();
      if (s.current.sleeping) wake();
      if (!raf) raf = requestAnimationFrame(apply);
    };
    const onScroll = () => (s.current.lastMove = Date.now());
    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });
    const idle = window.setInterval(() => {
      const st = s.current;
      if (st.locked || st.sleeping || Date.now() - st.lastMove < SLEEP_AFTER_MS) return;
      st.sleeping = true;
      setFx((f) => ({ kind: 'zzz', id: f.id + 1 }));
    }, 1000);
    const breathe = !reduce.current && el ? gsap.to(el, { scaleY: 1.012, transformOrigin: '50% 0%', duration: 2.6, ease: 'sine.inOut', yoyo: true, repeat: -1 }) : null;
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('scroll', onScroll);
      window.clearInterval(idle);
      window.clearTimeout(s.current.timer);
      if (raf) cancelAnimationFrame(raf);
      breathe?.kill();
    };
  }, [wake]);

  // being pulled → startled
  const shown: Fx = grabbed ? 'bang' : fx.kind;
  const mood: Mood = ({ heart: 'happy', sparkle: 'happy', laugh: 'happy', stars: 'star', bang: 'wide', zzz: 'sleep', dizzy: 'dizzy' } as Record<string, Mood>)[shown ?? ''] ?? 'open';

  return (
    <div ref={box} className={`relative h-full ${className}`} style={{ aspectRatio: ASPECT }}>
      {/* body + head share one wrapper so they lean and breathe together */}
      <div ref={body} className="absolute inset-0">
        <img src={src} alt="Spider-Man hanging upside-down from a web" draggable={false} className="absolute inset-0 h-full w-full select-none object-contain object-top" />
        <VectorHead ref={head} mood={mood} />
      </div>
      {shown && (
        <div key={`${shown}-${fx.id}`} className="pointer-events-none absolute z-10" style={{ left: `${HEAD.x * 100}%`, top: `${HEAD.y * 100}%` }}>
          <FxIcon kind={shown} />
        </div>
      )}
    </div>
  );
});

export default HangingSpider;





