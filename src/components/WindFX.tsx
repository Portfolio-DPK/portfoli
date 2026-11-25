import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { startWind, wind } from '../lib/wind';

/**
 * Wind over the rooftop: thin streaks that stretch and speed up in gusts, dust that drifts with the breeze,
 * and a few leaves / scraps of paper tumbling across. Everything reads the shared `wind.v`, the same value that
 * swings the hanging Spider-Man, so a gust visibly pushes him.
 *
 * Performance: one small canvas, solid-colour strokes only (no per-frame gradients), and the whole loop is
 * suspended while the hero is off-screen. Skipped completely when the user prefers reduced motion.
 */
interface Streak {
  x: number;
  y: number;
  z: number; // depth 0.3–1: nearer = faster, longer, brighter
  ph: number;
  amp: number;
}
interface Bit {
  x: number;
  y: number;
  z: number;
  r: number;
  vr: number;
  ph: number;
  kind: 0 | 1; // 0 leaf, 1 paper
  col: string;
}

const rnd = (a: number, b: number) => a + Math.random() * (b - a);

export const WindFX: React.FC = () => {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const cv = ref.current!;
    const ctx = cv.getContext('2d')!;
    const stopWind = startWind();
    let W = 0;
    let H = 0;
    const fit = () => {
      const dpr = 1; // streaks are soft anyway: no need to pay for retina
      W = cv.clientWidth;
      H = cv.clientHeight;
      cv.width = Math.round(W * dpr);
      cv.height = Math.round(H * dpr);
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(cv);

    const streaks: Streak[] = Array.from({ length: 38 }, () => ({
      x: rnd(0, 1),
      y: Math.pow(Math.random(), 0.8) * 0.82,
      z: rnd(0.3, 1),
      ph: rnd(0, 6.28),
      amp: rnd(2, 9),
    }));
    const dust: Streak[] = Array.from({ length: 24 }, () => ({ x: rnd(0, 1), y: rnd(0.05, 0.9), z: rnd(0.3, 1), ph: rnd(0, 6.28), amp: rnd(6, 22) }));
    const bits: Bit[] = Array.from({ length: 6 }, (_, i) => ({
      x: rnd(0, 1),
      y: rnd(0.35, 0.85),
      z: rnd(0.5, 1),
      r: rnd(0, 6.28),
      vr: rnd(2, 6) * (i % 2 ? 1 : -1),
      ph: rnd(0, 6.28),
      kind: (i % 3 === 0 ? 1 : 0) as 0 | 1,
      col: i % 3 === 0 ? '#c9c2e6' : ['#3a2c4f', '#4b2f3f', '#2c3b4f'][i % 3],
    }));

    let t = 0;
    let frame = 0;
    const draw = () => {
      // ~30 fps is plenty for wind; skip every other tick and fold the time into dt
      if (++frame % 2) return;
      const dt = Math.min((gsap.ticker.deltaRatio(60) * 2) / 60, 0.08);
      t += dt;
      const w = Math.max(wind.v, 0.05);
      ctx.clearRect(0, 0, W, H);
      ctx.lineCap = 'round';

      // --- streaks: long thin lines stretched by the wind speed (solid colour + alpha, no gradients)
      ctx.strokeStyle = '#dee2ff';
      for (const s of streaks) {
        s.x += (((160 + 520 * w) * s.z) * dt) / W;
        if (s.x > 1.25) {
          s.x = -0.25;
          s.y = Math.pow(Math.random(), 0.8) * 0.82;
        }
        const x = s.x * W;
        const y = s.y * H + Math.sin(t * 1.3 + s.ph) * s.amp * w;
        const len = (40 + 210 * w) * s.z;
        ctx.globalAlpha = Math.min(0.07 + 0.15 * w, 0.24) * s.z;
        ctx.lineWidth = 0.7 + 1.1 * s.z;
        ctx.beginPath();
        ctx.moveTo(x - len, y + Math.sin(t * 2 + s.ph) * 1.5);
        ctx.quadraticCurveTo(x - len * 0.45, y - 3 * w * s.z, x, y);
        ctx.stroke();
      }

      // --- dust motes drifting and wobbling
      ctx.fillStyle = '#ebe4ff';
      for (const d of dust) {
        d.x += (((50 + 260 * w) * d.z) * dt) / W;
        if (d.x > 1.05) {
          d.x = -0.05;
          d.y = rnd(0.05, 0.9);
        }
        ctx.globalAlpha = (0.16 + 0.22 * w) * d.z;
        ctx.beginPath();
        ctx.arc(d.x * W, d.y * H + Math.sin(t * 1.1 + d.ph) * d.amp, 0.8 + 1.1 * d.z, 0, 6.28);
        ctx.fill();
      }

      // --- leaves and scraps of paper tumbling in the gusts
      for (const b of bits) {
        b.x += (((90 + 520 * w) * b.z) * dt) / W;
        b.r += b.vr * (0.5 + w) * dt;
        if (b.x > 1.1) {
          b.x = -0.1;
          b.y = rnd(0.35, 0.85);
        }
        const y = b.y * H + Math.sin(t * 1.9 + b.ph) * 26 * w + Math.sin(t * 0.7 + b.ph) * 12;
        const sz = (5 + 5 * b.z) * (b.kind ? 1.1 : 1);
        ctx.save();
        ctx.translate(b.x * W, y);
        ctx.rotate(b.r);
        ctx.scale(1, 0.45 + 0.55 * Math.abs(Math.sin(t * 2.2 + b.ph)));
        ctx.globalAlpha = 0.55 * b.z + 0.2;
        ctx.fillStyle = b.col;
        ctx.beginPath();
        if (b.kind) ctx.rect(-sz * 0.6, -sz * 0.8, sz * 1.2, sz * 1.6);
        else ctx.ellipse(0, 0, sz, sz * 0.5, 0, 0, 6.28);
        ctx.fill();
        ctx.restore();
      }
      ctx.globalAlpha = 1;
    };

    // only run while the hero is actually on screen
    let running = false;
    const run = (on: boolean) => {
      if (on === running) return;
      running = on;
      if (on) gsap.ticker.add(draw);
      else {
        gsap.ticker.remove(draw);
        ctx.clearRect(0, 0, W, H);
      }
    };
    const io = new IntersectionObserver(([e]) => run(e.isIntersecting), { threshold: 0 });
    io.observe(cv);

    return () => {
      run(false);
      io.disconnect();
      stopWind();
      ro.disconnect();
    };
  }, []);

  return <canvas ref={ref} aria-hidden className="pointer-events-none absolute inset-0 h-full w-full" />;
};

export default WindFX;
