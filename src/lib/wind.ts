import { gsap } from 'gsap';

/**
 * A tiny shared wind model. `wind.v` is a smooth, always-changing strength (mostly a steady breeze pushing
 * to the right, with a gust every few seconds). Anything can read it every frame; the first consumer starts the
 * simulation and the last one stops it.
 */
export const wind = { v: 0.3, gust: 0 };

let users = 0;
let t = 0;
let nextGust = 2.2;

const tick = () => {
  const dt = Math.min(gsap.ticker.deltaRatio(60) / 60, 0.05);
  t += dt;
  nextGust -= dt;
  if (nextGust <= 0) {
    wind.gust = 0.7 + Math.random() * 0.9;
    nextGust = 3.5 + Math.random() * 5;
  }
  wind.gust *= Math.pow(0.34, dt);
  wind.v = 0.3 + 0.18 * Math.sin(t * 0.23) + 0.1 * Math.sin(t * 0.91 + 1.3) + wind.gust * (0.86 + 0.14 * Math.sin(t * 7.3));
};

export const startWind = () => {
  if (users++ === 0) gsap.ticker.add(tick);
  return () => {
    if (--users === 0) gsap.ticker.remove(tick);
  };
};
