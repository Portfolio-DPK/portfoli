import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import HangingSpider, { type SpiderHandle } from './HangingSpider';
import { startWind, wind } from '../lib/wind';

interface Props {
  on: boolean;
  onChange: (next: boolean) => void;
}

/** distance (px) the thread must be pulled before the switch flips on release */
const THRESHOLD = 84;
const MAX_PULL = 170;

/**
 * The pull-switch: a hero hanging upside-down from a web. Press, drag the web down past the threshold and let go —
 * the switch flips (city lights on/off). Also works from the keyboard (Enter / Space).
 */
export const SpiderSwitch: React.FC<Props> = ({ on, onChange }) => {
  const wrap = useRef<HTMLDivElement>(null);
  const fig = useRef<HTMLDivElement>(null);
  const hint = useRef<HTMLDivElement>(null);
  const spider = useRef<SpiderHandle>(null);
  const drag = useRef<{ y0: number; x0: number; active: boolean; pulled: number; moved: boolean }>({ y0: 0, x0: 0, active: false, pulled: 0, moved: false });
  /** pendulum state: angle (deg), angular velocity (deg/s) */
  const phys = useRef({ a: 0, w: 0, drag: false });
  const used = useRef(false);
  const [grabbed, setGrabbed] = useState(false);

  useEffect(() => {
    gsap.set(fig.current, { transformOrigin: '50% 0%' });
    gsap.fromTo(wrap.current, { y: -260 }, { y: 0, duration: 1.6, delay: 0.9, ease: 'elastic.out(1,0.45)' });

    // wind-driven pendulum: the web leans downwind and the hanging hero swings, overshoots and settles with every gust
    const stopWind = startWind();
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const step = () => {
      const p = phys.current;
      if (p.drag || !fig.current) return;
      const dt = Math.min(gsap.ticker.deltaRatio(60) / 60, 0.05);
      const target = reduce ? 0 : wind.v * 7.5;
      const acc = 13 * (target - p.a) - 0.85 * p.w;
      p.w += acc * dt;
      p.a += p.w * dt;
      gsap.set(fig.current, { rotation: p.a });
    };
    gsap.ticker.add(step);
    return () => {
      gsap.ticker.remove(step);
      stopWind();
      gsap.killTweensOf([wrap.current, fig.current]);
    };
  }, []);

  const hideHint = () => {
    if (used.current) return;
    used.current = true;
    gsap.to(hint.current, { opacity: 0, y: 6, duration: 0.4 });
  };

  const down = (e: React.PointerEvent) => {
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    drag.current = { y0: e.clientY, x0: e.clientX, active: true, pulled: 0, moved: false };
    setGrabbed(true);
    phys.current.drag = true;
    gsap.killTweensOf([wrap.current, fig.current]);
  };

  const move = (e: React.PointerEvent) => {
    const d = drag.current;
    if (!d.active) return;
    if (Math.abs(e.clientY - d.y0) > 6 || Math.abs(e.clientX - d.x0) > 6) d.moved = true;
    const dy = Math.max(0, e.clientY - d.y0);
    // rubber-band: the further you pull the more the thread resists
    const y = Math.min(MAX_PULL, dy < THRESHOLD ? dy : THRESHOLD + (dy - THRESHOLD) * 0.45);
    d.pulled = y;
    const swing = Math.max(-16, Math.min(16, (e.clientX - d.x0) * 0.12));
    gsap.set(wrap.current, { y });
    gsap.set(fig.current, { rotation: swing });
    phys.current.a = swing;
    phys.current.w = 0;
  };

  const up = () => {
    const d = drag.current;
    if (!d.active) return;
    d.active = false;
    setGrabbed(false);
    if (d.pulled >= THRESHOLD) {
      hideHint();
      onChange(!on);
      // lights on → star eyes; lights off → he dozes off
      spider.current?.react(!on ? 4 : 6, 1900);
    } else if (!d.moved) {
      // a plain click (no pull): he reacts
      hideHint();
      spider.current?.poke();
    }
    gsap.to(wrap.current, { y: 0, duration: 1.4, ease: 'elastic.out(1,0.38)' });
    // let go: the pendulum takes over from the pulled angle and swings back on its own
    phys.current.drag = false;
    if (!d.moved) phys.current.w += 26;
  };

  const key = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      hideHint();
      onChange(!on);
      spider.current?.react(!on ? 4 : 6, 1900);
      phys.current.w += 30;
      gsap.fromTo(wrap.current, { y: 90 }, { y: 0, duration: 1.3, ease: 'elastic.out(1,0.38)' });
    }
  };

  return (
    <div className="absolute top-0 right-[5%] sm:right-[7%] z-30 w-[clamp(150px,17vw,240px)] pointer-events-none" style={{ height: 0 }}>
      <div ref={wrap} className="absolute left-0 right-0 top-0">
        <div
          ref={fig}
          role="switch"
          aria-checked={on}
          aria-label="Pull the web down to switch the city lights"
          tabIndex={0}
          onPointerDown={down}
          onPointerMove={move}
          onPointerUp={up}
          onPointerCancel={up}
          onKeyDown={key}
          className="pointer-events-auto mx-auto flex w-full flex-col items-center cursor-grab active:cursor-grabbing touch-none select-none outline-none focus-visible:drop-shadow-[0_0_10px_rgba(255,255,255,.8)] drop-shadow-[0_10px_16px_rgba(0,0,0,.55)]"
        >
          {/* the web: it swings with the figure and reaches far above the screen, so pulling never shows its end */}
          <div className="relative h-[14vh] w-[1.6px] bg-white/80">
            <div className="absolute bottom-full left-0 h-[140vh] w-full bg-gradient-to-b from-white/10 to-white/80" />
          </div>
          <div className="relative h-[clamp(300px,47vh,460px)]">
            <HangingSpider ref={spider} grabbed={grabbed} />
          </div>
        </div>
        <div ref={hint} className="pointer-events-none absolute right-[78%] top-[calc(14vh+clamp(300px,47vh,460px)-70px)] whitespace-nowrap text-right text-[11px] sm:text-xs font-bold uppercase tracking-[.2em] text-white/85">
          <span className="block hint-bob">↓</span>
          Pull me
        </div>
      </div>
    </div>
  );
};






