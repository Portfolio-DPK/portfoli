import React, { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface Shot {
  src: string;
  left: number; // % of viewport width
  top: number; // % of viewport height (resting position)
  w: number; // px
  rot: number;
  speed: number; // parallax multiplier
}

const shots: Shot[] = [
  { src: '/uploads/cert-5-favposter.jpg', left: 3, top: 26, w: 330, rot: -11, speed: 1.0 },
  { src: '/uploads/cert-6-bronze.jpg', left: 31, top: 8, w: 230, rot: 7, speed: 1.55 },
  { src: '/uploads/cert-7-finalis.jpg', left: 71, top: 10, w: 270, rot: 4, speed: 1.2 },
  { src: '/uploads/cert-16-prestasi.jpeg', left: 35, top: 50, w: 240, rot: -5, speed: 0.85 },
  { src: '/uploads/cert-8-rauiux.jpg', left: 62, top: 40, w: 200, rot: 9, speed: 1.65 },
  { src: '/uploads/proj-hology.jpg', left: 56, top: 60, w: 330, rot: -8, speed: 1.1 },
  { src: '/uploads/proj-risetin.png', left: 12, top: 68, w: 230, rot: 5, speed: 1.4 },
];

export const Gallery: React.FC = () => {
  const root = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('.shot').forEach((el) => {
        const s = Number(el.dataset.speed);
        gsap.fromTo(
          el,
          { y: () => window.innerHeight * 0.95 * s },
          {
            y: () => -window.innerHeight * 0.95 * s,
            ease: 'none',
            scrollTrigger: {
              trigger: root.current,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 0.7,
              invalidateOnRefresh: true,
            },
          },
        );
        // fade in early, hold, fade out late
        gsap
          .timeline({ scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: true } })
          .fromTo(el, { opacity: 0 }, { opacity: 1, duration: 0.15, ease: 'none' })
          .to(el, { opacity: 1, duration: 0.7 })
          .to(el, { opacity: 0, duration: 0.15, ease: 'none' });
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section id="gallery" ref={root} className="relative z-10 h-[230vh] select-none">
      <div className="sticky top-0 h-screen overflow-hidden">
        {shots.map((s) => (
          <img
            key={s.src}
            src={s.src}
            alt=""
            loading="lazy"
            draggable={false}
            data-speed={s.speed}
            className="shot absolute rounded-2xl object-cover shadow-[0_20px_50px_rgba(15,23,42,.22)] will-change-transform"
            style={{
              left: `${s.left}%`,
              top: `${s.top}%`,
              width: s.w,
              aspectRatio: '3 / 4',
              rotate: `${s.rot}deg`,
              opacity: 0,
            }}
          />
        ))}
      </div>
    </section>
  );
};
