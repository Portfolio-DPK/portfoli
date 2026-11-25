import React, { useCallback, useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

/**
 * Sprite-sheet mascot — same idea as the `page-mascot` package, written from scratch.
 *
 *   directions : a 3×3 sheet of head poses. Row-major: ↖ ↑ ↗ / ← • → / ↙ ↓ ↘.
 *                The pose that matches the direction of the mouse is shown, so the mascot "looks" at the cursor.
 *   reactions  : a 3×3 sheet of expressions, row-major:
 *                0 happy · 1 love · 2 sparkle / 3 surprised · 4 star-eyes · 5 blush / 6 sleeping · 7 dizzy · 8 laughing
 *
 * Behaviour
 *   - follows the cursor (dead-zone in the middle → looks straight ahead)
 *   - click  → plays a random happy reaction with a squash-and-bounce
 *   - spam-clicking (5× in 2.5 s) → dizzy
 *   - no mouse movement for 25 s → falls asleep (zzz); moving the mouse wakes it with a startled face
 */
interface Props {
  directions: string;
  reactions: string;
  /** CSS width of the mascot (it is square) */
  size?: string;
  className?: string;
}

/** screen angle sector (0 = →, 1 = ↘, 2 = ↓ … clockwise) → cell in the directions sheet */
const DIR_BY_SECTOR = [5, 8, 7, 6, 3, 0, 1, 2];
const CENTER = 4;
const HAPPY = [0, 1, 2, 4, 5, 8];
const SURPRISED = 3;
const SLEEP = 6;
const DIZZY = 7;
const SLEEP_AFTER_MS = 25_000;

const cell = (i: number) => ({ col: i % 3, row: Math.floor(i / 3) });
const sprite = (src: string, i: number): React.CSSProperties => {
  const { col, row } = cell(i);
  return { backgroundImage: `url(${src})`, backgroundSize: '300% 300%', backgroundPosition: `${col * 50}% ${row * 50}%` };
};

export const Mascot: React.FC<Props> = ({ directions, reactions, size = 'clamp(96px, 11vw, 150px)', className = '' }) => {
  const root = useRef<HTMLButtonElement>(null);
  const body = useRef<HTMLDivElement>(null);
  const [dir, setDir] = useState(CENTER);
  const [react, setReact] = useState<number | null>(null);
  const [ready, setReady] = useState(false);
  const [hint, setHint] = useState(true);
  const s = useRef({
    lastMove: Date.now(),
    clicks: [] as number[],
    last: -1,
    timer: 0 as number,
    sleeping: false,
    locked: false,
    mouse: { x: -1, y: -1 },
  });
  const reduce = useRef(false);

  // preload both sheets before showing anything, so there is never a blank frame
  useEffect(() => {
    reduce.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let alive = true;
    Promise.all(
      [directions, reactions].map(
        (src) =>
          new Promise<void>((res) => {
            const img = new Image();
            img.onload = () => res();
            img.onerror = () => res();
            img.src = src;
          }),
      ),
    ).then(() => alive && setReady(true));
    return () => {
      alive = false;
    };
  }, [directions, reactions]);

  // entrance: pops up from the bottom edge
  useEffect(() => {
    if (!ready) return;
    gsap.set(root.current, { yPercent: 115 });
    gsap.to(root.current, { yPercent: 0, duration: reduce.current ? 0.01 : 1.1, delay: 0.9, ease: 'back.out(1.5)' });
    const t = window.setTimeout(() => setHint(false), 9000);
    return () => window.clearTimeout(t);
  }, [ready]);

  const bounce = useCallback((kind: 'happy' | 'dizzy' | 'startle') => {
    if (reduce.current || !body.current) return;
    gsap.killTweensOf(body.current);
    gsap.set(body.current, { transformOrigin: '50% 100%' });
    if (kind === 'dizzy') {
      gsap.timeline()
        .to(body.current, { rotation: -8, duration: 0.14, repeat: 9, yoyo: true, ease: 'sine.inOut' })
        .to(body.current, { rotation: 0, duration: 0.2 });
    } else if (kind === 'startle') {
      gsap.timeline()
        .to(body.current, { y: -22, scaleY: 1.1, scaleX: 0.94, duration: 0.14, ease: 'power2.out' })
        .to(body.current, { y: 0, scaleY: 1, scaleX: 1, duration: 0.45, ease: 'bounce.out' });
    } else {
      gsap.timeline()
        .to(body.current, { scaleY: 0.84, scaleX: 1.1, duration: 0.1, ease: 'power2.in' })
        .to(body.current, { scaleY: 1.1, scaleX: 0.95, y: -20, duration: 0.18, ease: 'power2.out' })
        .to(body.current, { scaleY: 1, scaleX: 1, y: 0, duration: 0.55, ease: 'bounce.out' });
    }
  }, []);

  const play = useCallback(
    (c: number, ms: number, kind: 'happy' | 'dizzy' | 'startle' = 'happy') => {
      const st = s.current;
      window.clearTimeout(st.timer);
      st.locked = true;
      setReact(c);
      bounce(kind);
      st.timer = window.setTimeout(() => {
        st.locked = false;
        setReact(st.sleeping ? SLEEP : null);
      }, ms);
    },
    [bounce],
  );

  const sleepOn = () => {
    const st = s.current;
    if (st.sleeping) return;
    st.sleeping = true;
    window.clearTimeout(st.timer);
    st.locked = false;
    setReact(SLEEP);
    if (!reduce.current && body.current) {
      gsap.set(body.current, { transformOrigin: '50% 100%' });
      gsap.to(body.current, { scaleY: 1.035, duration: 1.7, ease: 'sine.inOut', yoyo: true, repeat: -1 });
    }
  };

  const wake = () => {
    const st = s.current;
    if (!st.sleeping) return;
    st.sleeping = false;
    if (body.current) {
      gsap.killTweensOf(body.current);
      gsap.set(body.current, { scaleY: 1 });
    }
    play(SURPRISED, 800, 'startle');
  };

  // follow the cursor + fall asleep when idle
  useEffect(() => {
    if (!ready) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const el = root.current;
      if (!el) return;
      const { x, y } = s.current.mouse;
      if (x < 0) return;
      const r = el.getBoundingClientRect();
      const dx = x - (r.left + r.width / 2);
      const dy = y - (r.top + r.height * 0.42);
      const dist = Math.hypot(dx, dy);
      if (dist < r.width * 0.55) {
        setDir(CENTER);
        return;
      }
      const deg = (Math.atan2(dy, dx) * 180) / Math.PI; // 0 = →, 90 = ↓
      const sector = ((Math.round(deg / 45) % 8) + 8) % 8;
      setDir(DIR_BY_SECTOR[sector]);
    };
    const onMove = (e: PointerEvent) => {
      s.current.mouse = { x: e.clientX, y: e.clientY };
      s.current.lastMove = Date.now();
      if (s.current.sleeping) wake();
      if (!raf) raf = requestAnimationFrame(update);
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('scroll', () => (s.current.lastMove = Date.now()), { passive: true });
    const idle = window.setInterval(() => {
      const st = s.current;
      if (!st.locked && !st.sleeping && Date.now() - st.lastMove > SLEEP_AFTER_MS) sleepOn();
    }, 1000);
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.clearInterval(idle);
      window.clearTimeout(s.current.timer);
      if (raf) cancelAnimationFrame(raf);
      if (body.current) gsap.killTweensOf(body.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready]);

  const onClick = () => {
    const st = s.current;
    const now = Date.now();
    st.lastMove = now;
    setHint(false);
    if (st.sleeping) {
      wake();
      return;
    }
    st.clicks = st.clicks.filter((t) => now - t < 2500).concat(now);
    if (st.clicks.length >= 5) {
      st.clicks = [];
      play(DIZZY, 2200, 'dizzy');
      return;
    }
    let pick = HAPPY[Math.floor(Math.random() * HAPPY.length)];
    if (pick === st.last) pick = HAPPY[(HAPPY.indexOf(pick) + 1) % HAPPY.length];
    st.last = pick;
    play(pick, 1700, 'happy');
  };

  return (
    <button
      ref={root}
      type="button"
      onClick={onClick}
      aria-label="Mascot — click for a reaction"
      className={`fixed bottom-0 right-2 sm:right-5 z-40 block cursor-pointer select-none outline-none focus-visible:drop-shadow-[0_0_8px_rgba(255,255,255,.9)] ${className}`}
      style={{ width: size, aspectRatio: '1 / 1', opacity: ready ? 1 : 0, touchAction: 'manipulation' }}
    >
      {/* little chip that invites the first click */}
      <span
        className={`pointer-events-none absolute right-[88%] top-[18%] hidden sm:block whitespace-nowrap rounded-full bg-white px-3 py-1.5 text-xs font-bold text-gray-800 shadow-lg transition-all duration-500 ${
          hint && ready ? 'translate-x-0 opacity-100' : 'translate-x-2 opacity-0'
        }`}
      >
        Click me!
        <span className="absolute -right-1 top-1/2 h-2.5 w-2.5 -translate-y-1/2 rotate-45 bg-white" />
      </span>
      <div ref={body} className="relative h-full w-full transition-transform duration-200 hover:-translate-y-1">
        {/* directions layer (hidden while a reaction plays) */}
        <div aria-hidden className="absolute inset-0" style={{ ...sprite(directions, dir), display: react === null ? 'block' : 'none' }} />
        {/* reaction layer */}
        <div aria-hidden className="absolute inset-0" style={{ ...(react === null ? {} : sprite(reactions, react)), display: react === null ? 'none' : 'block' }} />
      </div>
    </button>
  );
};

export default Mascot;

