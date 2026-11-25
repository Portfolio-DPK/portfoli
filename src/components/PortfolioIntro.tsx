import React, { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { setTheme } from '../lib/theme';

gsap.registerPlugin(ScrollTrigger);

const WORD = 'PORTOFOLIO';
/** index of the letter whose stem we zoom into ("T") — a solid stroke so the screen floods white */
const ZOOM_LETTER = 3;

export const PortfolioIntro: React.FC = () => {
  const root = useRef<HTMLDivElement>(null);
  const word = useRef<HTMLHeadingElement>(null);
  const letters = useRef<(HTMLSpanElement | null)[]>([]);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const el = word.current!;

      // transform-origin = middle of the T stem, measured in the word's own box
      const setOrigin = () => {
        const t = letters.current[ZOOM_LETTER];
        if (!t) return;
        const w = el.getBoundingClientRect();
        const l = t.getBoundingClientRect();
        const ox = l.left - w.left + l.width / 2;
        const oy = l.top - w.top + l.height * 0.72;
        gsap.set(el, { transformOrigin: `${ox}px ${oy}px` });
      };
      setOrigin();

      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: root.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.8,
          invalidateOnRefresh: true,
          onRefresh: setOrigin,
          onUpdate: (self) => setTheme(self.progress >= 0.93 ? 'light' : 'dark'),
        },
      });
      tl.to({}, { duration: 0.1 }) // hold: the full word is readable first
        .to(el, { scale: 34, rotation: -6, duration: 0.75, ease: 'power3.in' }, 0.1)
        .to('.intro-flood', { opacity: 1, duration: 0.12 }, 0.8)
        .to({}, { duration: 0.08 }, 0.92);
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={root} id="portofolio" className="relative z-10 h-[300vh]">
      <div className="sticky top-0 h-screen overflow-hidden grid place-items-center">
        <h2
          ref={word}
          className="select-none font-black text-[#fafafa] leading-none tracking-tight whitespace-nowrap text-[min(14.2vw,230px)] will-change-transform"
          style={{ fontFamily: '"Arial Black", Arial, Helvetica, sans-serif' }}
          aria-label="Portofolio"
        >
          {WORD.split('').map((c, i) => (
            <span
              key={i}
              aria-hidden
              ref={(n) => {
                letters.current[i] = n;
              }}
              className="inline-block"
            >
              {c}
            </span>
          ))}
        </h2>
        <div className="intro-flood absolute inset-0 bg-[#fafafa] opacity-0 pointer-events-none" />
      </div>
    </div>
  );
};
