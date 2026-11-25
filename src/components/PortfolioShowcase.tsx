import React, { useLayoutEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Award, ChevronLeft, ChevronRight, Code2, Hourglass, Trophy } from 'lucide-react';
import { showcaseAwards, showcaseCertificates, showcaseProjects } from '../data/showcase';
import type { ProjectItem } from '../data/projects';
import type { CertificateItem } from '../data/certificates';
import { ProjectModal } from './ProjectModal';
import { CertificateModal } from './CertificateModal';

gsap.registerPlugin(ScrollTrigger);

type TabId = 'projects' | 'certificates' | 'awards';

const tabs: { id: TabId; label: string; icon: React.ReactNode; emptyTitle: string; empty: string }[] = [
  { id: 'projects', label: 'Projects', icon: <Code2 className="w-5 h-5" />, emptyTitle: 'Sắp cập nhật', empty: 'Các dự án sẽ được cập nhật sớm.' },
  { id: 'certificates', label: 'Certificates', icon: <Award className="w-5 h-5" />, emptyTitle: 'TOEIC', empty: 'To be continued...' },
  { id: 'awards', label: 'Awards', icon: <Trophy className="w-5 h-5" />, emptyTitle: 'Sắp cập nhật', empty: 'Giải thưởng sẽ được cập nhật sau.' },
];

interface Card {
  key: string;
  title: string;
  text: string;
  image: string;
  open: () => void;
}

export const PortfolioShowcase: React.FC = () => {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [tab, setTab] = useState<TabId>('projects');
  const [project, setProject] = useState<ProjectItem | null>(null);
  const [certificate, setCertificate] = useState<CertificateItem | null>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('[data-lift]').forEach((el, i) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 90 },
          {
            opacity: 1,
            y: 0,
            ease: 'none',
            scrollTrigger: { trigger: el, start: `top ${100 + i * 3}%`, end: 'top 62%', scrub: true },
          },
        );
      });
    }, root);
    return () => ctx.revert();
  }, []);

  const asCert = (c: CertificateItem): Card => ({
    key: c.id,
    title: c.title,
    text: `${c.issuer} · ${c.issueDate}`,
    image: c.image,
    open: () => setCertificate(c),
  });

  const cards: Card[] =
    tab === 'projects'
      ? showcaseProjects.map((p) => ({ key: p.id, title: p.title, text: p.description, image: p.image, open: () => setProject(p) }))
      : tab === 'certificates'
        ? showcaseCertificates.map(asCert)
        : showcaseAwards.map(asCert);

  const slide = (dir: 1 | -1) => {
    const el = track.current;
    if (!el) return;
    el.scrollBy({ left: dir * Math.min(el.clientWidth * 0.8, 520), behavior: 'smooth' });
  };

  // with only a couple of cards they sit centred and need no arrows
  const many = cards.length > 2;
  const emptyInfo = tabs.find((t) => t.id === tab)!;

  return (
    <section
      id="portfolio-showcase"
      ref={root}
      className="relative z-10 pt-40 pb-32 text-gray-800"
      style={{ fontFamily: 'Arial, sans-serif' }}
    >
      <h2 data-lift className="text-center text-4xl sm:text-5xl font-extrabold text-gray-800">
        Portfolio
      </h2>

      <div data-lift className="mx-auto mt-8 w-[min(768px,92vw)] rounded-2xl bg-white p-[10px] shadow-[0_16px_40px_rgba(15,23,42,.1)]">
        <div className="grid grid-cols-3 gap-1" role="tablist">
          {tabs.map((t) => {
            const on = t.id === tab;
            return (
              <button
                key={t.id}
                role="tab"
                aria-selected={on}
                onClick={() => {
                  setTab(t.id);
                  track.current?.scrollTo({ left: 0 });
                }}
                className={`relative flex flex-col items-center gap-1.5 rounded-xl py-3.5 text-[15px] font-bold transition-colors ${
                  on ? 'text-white' : 'text-gray-500 hover:text-blue-600'
                }`}
              >
                {on && (
                  <motion.span
                    layoutId="showcase-tab"
                    className="absolute inset-0 rounded-xl bg-[#2563eb] shadow-[0_10px_22px_rgba(37,99,235,.35)]"
                    transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                  />
                )}
                <span className="relative">{t.icon}</span>
                <span className="relative">{t.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div data-lift className="relative mt-14">
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 36 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            {cards.length === 0 ? (
              <div className="mx-auto flex w-[min(470px,86vw)] flex-col items-center gap-3 rounded-2xl border border-dashed border-gray-300 bg-white/70 px-8 py-14 text-center shadow-[0_10px_34px_rgba(15,23,42,.06)]">
                <span className="grid h-14 w-14 place-items-center rounded-2xl bg-[#2563eb]/10 text-[#2563eb]">
                  <Hourglass className="h-7 w-7" />
                </span>
                <p className="text-2xl font-extrabold tracking-wide text-gray-800">{emptyInfo.emptyTitle}</p>
                <p className="text-[15px] italic leading-6 text-gray-500">{emptyInfo.empty}</p>
              </div>
            ) : (
              <div
                ref={track}
                className={`carousel flex gap-8 overflow-x-auto snap-x snap-mandatory px-6 py-8 ${many ? 'px-[max(24px,calc(50%-235px))]' : 'justify-start md:justify-center'}`}
              >
                {cards.map((c) => (
                  <article
                    key={c.key}
                    className="snap-center shrink-0 w-[min(470px,82vw)] rounded-2xl bg-white p-5 shadow-[0_10px_34px_rgba(15,23,42,.1)] transition-transform duration-300 hover:-translate-y-2"
                  >
                    <div className="h-[215px] overflow-hidden rounded-xl bg-gray-100">
                      <img
                        src={c.image}
                        alt={c.title}
                        loading="lazy"
                        className="h-full w-full object-cover object-top transition-transform duration-500 hover:scale-105"
                      />
                    </div>
                    <h3 className="mt-5 text-[22px] font-bold text-gray-900 leading-tight">{c.title}</h3>
                    <p className="mt-3 text-[15px] leading-6 text-gray-500 line-clamp-3 min-h-[72px]">{c.text}</p>
                    <button
                      onClick={c.open}
                      className="group mt-5 inline-flex items-center gap-2 rounded-lg bg-[#2563eb] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#1d4ed8]"
                    >
                      Details <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </button>
                  </article>
                ))}
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {many &&
          (['left', 'right'] as const).map((side) => (
            <button
              key={side}
              onClick={() => slide(side === 'left' ? -1 : 1)}
              aria-label={side === 'left' ? 'Previous' : 'Next'}
              className={`absolute top-1/2 -translate-y-1/2 z-10 grid h-12 w-12 place-items-center rounded-full bg-[#2563eb] text-white shadow-[0_8px_24px_rgba(37,99,235,.45)] transition hover:scale-110 active:scale-95 ${
                side === 'left' ? 'left-3 sm:left-6' : 'right-3 sm:right-6'
              }`}
            >
              {side === 'left' ? <ChevronLeft className="w-6 h-6" /> : <ChevronRight className="w-6 h-6" />}
            </button>
          ))}
      </div>

      <ProjectModal project={project} onClose={() => setProject(null)} />
      <CertificateModal certificate={certificate} onClose={() => setCertificate(null)} />
    </section>
  );
};

