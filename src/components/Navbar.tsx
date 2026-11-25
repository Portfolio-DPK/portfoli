import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { scrollToId } from '../lib/smooth';
import { Volume2, VolumeX } from 'lucide-react';
import { useMusic } from '../lib/music';

interface NavItem {
  label: string;
  /** element to scroll to when clicked */
  target: string;
  /** sections (in page order) that make this item active */
  sections: string[];
}

const navItems: NavItem[] = [
  { label: 'Home', target: 'home', sections: ['home'] },
  { label: 'About', target: 'about', sections: ['about'] },
  { label: 'Portfolio', target: 'portfolio-showcase', sections: ['portofolio', 'gallery'] },
  { label: 'Contact', target: 'contact', sections: ['contact'] },
];

const trackedSections = ['home', 'about', 'portofolio', 'gallery', 'contact'];

/**
 * Spider-Man mask as the nav pointer: red mask, black web lines, white lenses, and a chin point
 * that doubles as the arrow toward the active item. The lenses follow the mouse and narrow on every blink.
 */
const INK = '#14141a';
const RED = '#d0322a';
const Mascot: React.FC = () => {
  const eyes = useRef<SVGGElement>(null);
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let raf = 0;
    const move = (e: PointerEvent) => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const g = eyes.current;
        const svg = g?.ownerSVGElement;
        if (!g || !svg) return;
        const r = svg.getBoundingClientRect();
        const dx = Math.max(-1, Math.min(1, (e.clientX - (r.left + r.width / 2)) / (window.innerWidth * 0.35)));
        const dy = Math.max(-1, Math.min(1, (e.clientY - (r.top + r.height * 0.4)) / (window.innerHeight * 0.4)));
        g.style.transform = `translate(${(dx * 2.2).toFixed(2)}px, ${(dy * 1.4).toFixed(2)}px)`;
      });
    };
    window.addEventListener('pointermove', move, { passive: true });
    return () => {
      window.removeEventListener('pointermove', move);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  const lens = 'M-13 -4 C-9 -9 -1 -5 3 3 C0 9 -7 10 -11 5 C-14 2 -14 -2 -13 -4 Z';
  return (
    <svg width="42" height="54" viewBox="0 0 42 54" aria-hidden className="block drop-shadow-[0_2px_4px_rgba(0,0,0,.45)]">
      <defs>
        <clipPath id="navMaskClip">
          <ellipse cx="21" cy="21" rx="18" ry="19.5" />
        </clipPath>
        <linearGradient id="navMaskShade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity=".16" />
          <stop offset="1" stopColor="#000" stopOpacity=".25" />
        </linearGradient>
      </defs>
      {/* chin point / pointer */}
      <path d="M12 36 L21 51 L30 36 Z" fill={RED} stroke={INK} strokeWidth="2.2" strokeLinejoin="round" />
      {/* mask */}
      <ellipse cx="21" cy="21" rx="18" ry="19.5" fill={RED} stroke={INK} strokeWidth="2.4" />
      <g clipPath="url(#navMaskClip)">
        <g stroke="#1a0608" strokeWidth=".95" fill="none" opacity=".85">
          <path d="M21 0 V44 M21 1 L7 16 M21 1 L35 16 M21 1 L2 24 M21 1 L40 24 M21 1 L10 40 M21 1 L32 40" />
          <path d="M0 11 Q21 17 42 11 M0 22 Q21 30 42 22 M2 32 Q21 42 40 32" />
        </g>
        <ellipse cx="21" cy="21" rx="18" ry="19.5" fill="url(#navMaskShade)" />
        {/* lenses */}
        <g ref={eyes} style={{ transition: 'transform .12s ease-out' }}>
          <g transform="translate(13 22)" className="mascot-eye">
            <path d={lens} fill="#fff" stroke={INK} strokeWidth="1.8" strokeLinejoin="round" />
          </g>
          <g transform="translate(29 22) scale(-1 1)" className="mascot-eye">
            <path d={lens} fill="#fff" stroke={INK} strokeWidth="1.8" strokeLinejoin="round" />
          </g>
        </g>
      </g>
      <ellipse cx="21" cy="21" rx="18" ry="19.5" fill="none" stroke={INK} strokeWidth="2.4" />
    </svg>
  );
};

export const Navbar: React.FC = () => {
  const music = useMusic();
  const [active, setActive] = useState(0);
  const [light, setLight] = useState(false);
  const [mascot, setMascot] = useState({ x: 0, ready: false });
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const wrapRef = useRef<HTMLDivElement>(null);
  const lock = useRef<number | null>(null);

  // follow data-theme (flipped by the Portfolio intro transition)
  useEffect(() => {
    const read = () => setLight(document.documentElement.dataset.theme === 'light');
    read();
    const mo = new MutationObserver(read);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => mo.disconnect();
  }, []);

  // scroll spy — an item becomes active once its section crosses 38% of the viewport
  useEffect(() => {
    let raf = 0;
    const tick = () => {
      raf = 0;
      if (lock.current !== null) return;
      const line = window.innerHeight * 0.38;
      let current = 'home';
      for (const id of trackedSections) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= line) current = id;
      }
      const idx = navItems.findIndex((n) => n.sections.includes(current));
      setActive((p) => (p !== idx && idx >= 0 ? idx : p));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };
    tick();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  // keep the mascot centred over the active item
  useLayoutEffect(() => {
    const place = () => {
      const el = itemRefs.current[active];
      const wrap = wrapRef.current;
      if (!el || !wrap) return;
      const a = el.getBoundingClientRect();
      const b = wrap.getBoundingClientRect();
      setMascot({ x: a.left - b.left + a.width / 2 - 20, ready: true });
    };
    place();
    window.addEventListener('resize', place);
    return () => window.removeEventListener('resize', place);
  }, [active]);

  const go = (i: number) => {
    setActive(i);
    // pause the scroll spy while the programmatic scroll runs
    if (lock.current) window.clearTimeout(lock.current);
    lock.current = window.setTimeout(() => (lock.current = null), 1900);
    scrollToId(navItems[i].target);
  };

  return (
    <header className="fixed top-3 sm:top-[42px] inset-x-0 z-50 flex justify-center pointer-events-none">
      <motion.div
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.9, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
        ref={wrapRef}
        className="relative pt-[2px] pointer-events-auto"
      >
        {/* mascot + diamond pointer */}
        <motion.div
          className="absolute -top-[40px] left-0 pointer-events-none z-10"
          initial={false}
          animate={{ x: mascot.x, opacity: mascot.ready ? 1 : 0 }}
          transition={{ type: 'spring', stiffness: 220, damping: 22, mass: 0.8 }}
        >
          <Mascot />
        </motion.div>

        <nav
          className={`relative flex items-center gap-0.5 sm:gap-1 rounded-full px-[10px] py-[8px] backdrop-blur-md transition-all duration-300 ${
            light
              ? 'bg-white shadow-[0_12px_32px_rgba(15,23,42,.12)]'
              : 'bg-white/[0.07] border border-white/10 shadow-[0_8px_30px_rgba(0,0,0,.25)]'
          }`}
        >
          {navItems.map((item, i) => {
            const isActive = i === active;
            return (
              <button
                key={item.label}
                ref={(el) => {
                  itemRefs.current[i] = el;
                }}
                onClick={() => go(i)}
                className={`relative rounded-full px-3 sm:px-6 h-10 text-[12px] sm:text-[14px] font-bold transition-colors duration-300 ${
                  isActive ? 'text-white' : light ? 'text-gray-800 hover:text-blue-600' : 'text-white hover:text-blue-300'
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 rounded-full bg-[#2563eb] shadow-[0_0_22px_rgba(37,99,235,.55)]"
                    transition={{ type: 'spring', stiffness: 320, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{item.label}</span>
              </button>
            );
          })}
          {/* sound toggle: starts / pauses the playlist */}
          <span className={`mx-1 hidden h-5 w-px sm:block ${light ? 'bg-gray-300' : 'bg-white/20'}`} aria-hidden />
          <button
            onClick={music.toggle}
            aria-label={music.playing ? 'Pause music' : 'Play music'}
            title={music.playing ? 'Pause music' : 'Play music'}
            className={`relative grid h-9 w-9 shrink-0 place-items-center rounded-full transition-colors ${
              music.playing ? 'text-[#2563eb]' : light ? 'text-gray-500 hover:text-blue-600' : 'text-white/80 hover:text-blue-300'
            }`}
          >
            {music.playing ? <Volume2 className="h-[18px] w-[18px]" /> : <VolumeX className="h-[18px] w-[18px]" />}
            {music.playing && <span className="absolute inset-0 animate-ping rounded-full bg-[#2563eb]/20" aria-hidden />}
          </button>
        </nav>
      </motion.div>
    </header>
  );
};

