import React, { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Code2, FileText } from 'lucide-react';
import { profileData } from '../data/profile';
import { timelineData } from '../data/experience';
import { scrollToId } from '../lib/smooth';
import { ScratchPortrait } from './ScratchPortrait';

gsap.registerPlugin(ScrollTrigger);

const Timeline: React.FC<{ title: string; type: 'education' | 'experience' }> = ({ title, type }) => {
  const items = timelineData.filter((t) => t.type === type);
  if (items.length === 0) return null;
  return (
    <div data-reveal>
      <h3 className="text-xl font-bold text-white mb-8">{title}</h3>
      <ol className="relative space-y-8">
        <span className="absolute left-5 top-5 bottom-5 w-px bg-white/20" aria-hidden />
        {items.map((it, i) => (
          <li key={it.id} className="relative pl-16">
            <span className="absolute left-0 top-0 w-10 h-10 rounded-full bg-white text-gray-900 grid place-items-center text-sm font-bold shadow-[0_0_18px_rgba(255,255,255,.25)]">
              {i + 1}
            </span>
            <div className="flex items-start justify-between gap-3">
              <p className="text-white/90 font-semibold text-[15px]">{it.organization}</p>
              <span className="shrink-0 rounded-full border border-white/15 bg-white/[0.06] px-3 py-1 text-[11px] text-gray-300">
                {it.period}
              </span>
            </div>
            <p className="mt-2 font-bold text-white text-[17px] leading-snug">{it.title}</p>
            <p className="mt-2 text-sm text-gray-400 leading-relaxed">{it.description}</p>
          </li>
        ))}
      </ol>
    </div>
  );
};

export const About: React.FC = () => {
  const root = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // every block fades/slides in while it crosses the lower part of the viewport
      gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 70 },
          {
            opacity: 1,
            y: 0,
            ease: 'none',
            scrollTrigger: { trigger: el, start: 'top 98%', end: 'top 62%', scrub: true },
          },
        );
      });
      gsap.fromTo(
        '.about-photo',
        { yPercent: 8, scale: 0.94 },
        { yPercent: -4, scale: 1.02, ease: 'none', scrollTrigger: { trigger: '.about-photo', start: 'top bottom', end: 'bottom top', scrub: true } },
      );
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="about"
      ref={root}
      className="relative z-10 text-white px-[5%] lg:px-[10%] pt-16 sm:pt-20 lg:pt-16 pb-16 lg:pb-[10%]"
    >
      <h2 data-reveal className="text-center text-4xl sm:text-5xl font-extrabold mb-20 sm:mb-28">
        About Me
      </h2>

      <div className="grid lg:grid-cols-3 items-center gap-10 lg:gap-6">
        <div data-reveal className="order-2 lg:order-1 text-center lg:text-left">
          <h3 className="font-extrabold leading-[1.08] text-[clamp(2.6rem,5.2vw,4.2rem)]">
            <span className="text-[#2563eb]">Hi, I&apos;m</span>
            <br />
            {profileData.name}
          </h3>
          <a
            href={profileData.cvUrl}
            className="mt-8 inline-flex items-center gap-2 rounded-lg bg-[#2563eb] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#1d4ed8] hover:-translate-y-0.5 active:translate-y-0"
          >
            <FileText className="w-4 h-4" /> View CV
          </a>
        </div>

        <div className="order-1 lg:order-2 flex justify-center">
          {/* wider than its column on desktop, like the reference: the bust overlaps the text columns' edges */}
          <div className="about-photo w-[min(300px,78vw)] sm:w-[380px] lg:w-[470px] lg:-mx-12 relative z-0">
            <ScratchPortrait alt={profileData.name} />
          </div>
        </div>

        <div data-reveal className="order-3 text-center lg:text-left">
          <p className="text-[15px] leading-7 text-gray-200">{profileData.about.paragraphs[0]}</p>
          <button
            onClick={() => scrollToId('portfolio-showcase')}
            className="mt-8 inline-flex items-center gap-2 rounded-lg bg-[#2563eb] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#1d4ed8] hover:-translate-y-0.5 active:translate-y-0"
          >
            <Code2 className="w-4 h-4" /> View Projects
          </button>
        </div>
      </div>

      <div className={`mt-24 sm:mt-32 grid gap-14 md:gap-20 ${timelineData.some((t) => t.type === 'experience') ? 'md:grid-cols-2' : 'max-w-2xl mx-auto'}`}>
        <Timeline title="Education" type="education" />
        <Timeline title="Experience" type="experience" />
      </div>
    </section>
  );
};




