import React, { useLayoutEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { BgLayer, MidLayer, NearLayer, FrontHazeLayer, RoofLayer, Web, Grade } from './HeroScene';
import { SpiderSwitch } from './SpiderSwitch';
import { WindFX } from './WindFX';
import { cinematicScrollTo } from '../lib/smooth';

gsap.registerPlugin(ScrollTrigger);

/**
 * Measured from the reference site: each layer translates by  -k · h · p^1.7  (p = scrollY / viewportHeight)
 * and grows slightly, so nearer layers rush past faster than far ones.
 */
const LAYERS = [
  { sel: '.hero-bg', k: 0.11, grow: 0 },
  { sel: '.hero-mid', k: 0.282, grow: 0.044 },
  { sel: '.hero-near', k: 0.42, grow: 0.04 },
  { sel: '.hero-fog2', k: 0.5, grow: 0.03 },
  { sel: '.hero-roof', k: 0.55, grow: 0.04 },
  { sel: '.hero-spider', k: 0.475, grow: 0 },
] as const;

const smooth = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

export const Hero: React.FC = () => {
  const root = useRef<HTMLElement>(null);
  const scene = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(false);
  // 0 = city dark, 1 = city lit — tweened when the switch flips, read by the scroll handler
  const lit = useRef({ v: 0 });
  const refresh = useRef<() => void>(() => {});
  const autoRoll = useRef(0);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.hero-scene', { scale: 1.08, duration: 2.4, ease: 'power3.out' });

      const setters = LAYERS.map((l) => ({
        ...l,
        y: gsap.quickSetter(l.sel, 'y', 'px'),
        s: gsap.quickSetter(l.sel, 'scale'),
      }));
      const shade = gsap.quickSetter('.hero-shade', 'opacity');
      const webO = gsap.quickSetter('.hero-web', 'opacity');
      const titleO = gsap.quickSetter('.hero-title', 'opacity');
      const titleY = gsap.quickSetter('.hero-title', 'y', 'px');
      const titleS = gsap.quickSetter('.hero-title', 'scale');
      let scroll = 0;
      let lastLit = '';

      const update = () => {
        const h = window.innerHeight;
        const p = Math.max(0, scroll) / h;
        const e = Math.pow(p, 1.7);
        for (const l of setters) {
          l.y(-l.k * h * e);
          l.s(1 + l.grow * e);
        }
        // the lights come on from the switch — or, if you just scroll, gradually as you move on
        const L = Math.max(lit.current.v, smooth(0.1, 0.4, p));
        // only touch the CSS variable when it really changed: every write re-styles the whole city
        const Ls = L.toFixed(3);
        if (Ls !== lastLit) {
          lastLit = Ls;
          scene.current?.style.setProperty('--lit', Ls);
        }
        webO(1 - smooth(0.05, 0.4, p));
        shade(smooth(0.5, 1.1, p));
        // the headline stays readable for most of the roll, then rises and fades as About arrives
        titleO(L * (1 - smooth(0.9, 1.2, p)));
        titleY(-h * 0.12 * smooth(0.85, 1.25, p) + (1 - L) * 36);
        titleS(1.16 - 0.16 * L);
      };
      refresh.current = update;

      ScrollTrigger.create({
        trigger: root.current,
        start: 'top top',
        end: 'bottom bottom',
        onUpdate: (self) => {
          scroll = self.scroll() - self.start;
          update();
        },
        onRefresh: (self) => {
          scroll = self.scroll() - self.start;
          update();
        },
      });
      update();
    }, root);
    const cancel = () => window.clearTimeout(autoRoll.current);
    window.addEventListener('wheel', cancel, { passive: true });
    window.addEventListener('touchstart', cancel, { passive: true });
    window.addEventListener('keydown', cancel);
    return () => {
      cancel();
      window.removeEventListener('wheel', cancel);
      window.removeEventListener('touchstart', cancel);
      window.removeEventListener('keydown', cancel);
      ctx.revert();
    };
  }, []);

  const flip = (next: boolean) => {
    setOn(next);
    gsap.to(lit.current, { v: next ? 1 : 0, duration: next ? 1.1 : 0.9, ease: next ? 'power2.out' : 'power2.inOut', onUpdate: () => refresh.current() });
    window.clearTimeout(autoRoll.current);
    if (next) {
      // a brief flash as the city switches on
      gsap.fromTo('.hero-flash', { opacity: 0.5 }, { opacity: 0, duration: 0.9, ease: 'power2.out' });
      // let the headline sink in, then roll the page down on its own (skipped if you already scrolled away)
      autoRoll.current = window.setTimeout(() => {
        if (window.scrollY < window.innerHeight * 0.4) cinematicScrollTo('about', 3.6, -110);
      }, 3400);
    }
  };

  return (
    <section id="home" ref={root} className="parallax relative w-full h-[180svh] md:h-[225vh] bg-[#030712]">
      <div className="parallax__visuals sticky top-0 h-[100svh] w-full overflow-clip select-none">
        <div ref={scene} className="hero-scene absolute inset-0 will-change-transform" style={{ ['--lit' as string]: 0 }}>
          <div className="hero-bg absolute inset-0 will-change-transform"><BgLayer /></div>
          <div className="hero-mid absolute inset-0 will-change-transform"><MidLayer /></div>
          <div className="hero-near absolute inset-0 will-change-transform"><NearLayer /></div>
          <div className="hero-fog2 absolute inset-0 will-change-transform"><FrontHazeLayer /></div>
          <div className="hero-roof absolute inset-0 will-change-transform"><RoofLayer /></div>
        </div>
        <div className="hero-web"><Web /></div>
        <WindFX />
        <Grade />
        <div className="hero-flash pointer-events-none absolute inset-0 bg-[#ffe3b8] opacity-0" />

        {/* soft fades into the About background (same idea as the reference's parallax__fade) */}
        <div className="hero-shade absolute inset-0 opacity-0 bg-gradient-to-b from-transparent via-[#030712]/55 to-[#030712]" />
        <div className="parallax__fade absolute inset-x-0 bottom-0 h-28 md:h-44 bg-gradient-to-t from-[#030712] via-[#030712]/80 to-transparent" />

        <h1 className="hero-title pointer-events-none absolute inset-x-0 top-[14%] px-6 text-center text-white font-extrabold uppercase leading-[1.1] tracking-wide text-[clamp(2.2rem,6vw,5.2rem)] drop-shadow-[0_6px_30px_rgba(0,0,0,.5)] opacity-0">
          Welcome to my
          <br />
          Portfolio
        </h1>

        {/* the pull-switch rides in its own layer so it scrolls away with the scene */}
        <div className="hero-spider absolute inset-0 pointer-events-none will-change-transform">
          <SpiderSwitch on={on} onChange={flip} />
        </div>
      </div>
    </section>
  );
};



