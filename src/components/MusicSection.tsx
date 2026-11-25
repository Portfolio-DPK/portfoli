import React, { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ExternalLink, Pause, Play, SkipBack, SkipForward } from 'lucide-react';
import { cover, tracks, watchUrl } from '../data/music';
import { useMusic, useMusicTime } from '../lib/music';

gsap.registerPlugin(ScrollTrigger);

const fmt = (s: number) => {
  if (!isFinite(s) || s <= 0) return '00:00';
  const m = Math.floor(s / 60);
  return `${String(m).padStart(2, '0')}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
};

/** equaliser bars shown on the row that is currently playing */
const Bars: React.FC<{ on: boolean }> = ({ on }) => (
  <span className="flex h-4 items-end gap-[2px]" aria-hidden>
    {[0, 1, 2].map((i) => (
      <span key={i} className={`h-4 w-[3px] origin-bottom rounded-sm bg-[#60a5fa] ${on ? 'eq-bar' : ''}`} style={{ transform: on ? undefined : 'scaleY(.25)', animationDelay: `${i * 0.18}s` }} />
    ))}
  </span>
);

export const MusicSection: React.FC = () => {
  const root = useRef<HTMLElement>(null);
  const m = useMusic();
  const { time, duration } = useMusicTime();
  const t = tracks[m.index];

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '[data-music]',
        { opacity: 0, y: 70 },
        { opacity: 1, y: 0, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top 95%', end: 'top 55%', scrub: true } },
      );
    }, root);
    return () => ctx.revert();
  }, []);

  const frac = duration ? time / duration : 0;

  return (
    <section id="music" ref={root} className="relative z-10 px-[5%] lg:px-[10%] py-16 sm:py-24 text-white">
      <div
        data-music
        className="mx-auto grid max-w-6xl items-center gap-10 rounded-[28px] border border-white/10 bg-[#0a0f23] p-6 shadow-[0_30px_80px_rgba(0,0,0,.45)] sm:p-10 lg:grid-cols-[minmax(0,.8fr)_minmax(0,1.2fr)]"
      >
        {/* copy */}
        <div>
          <h2 className="text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl">
            A little music.
            <br />
            <span className="text-[#3b82f6]">A lot of ideas.</span>
          </h2>
          <p className="mt-5 max-w-sm text-[15px] leading-7 text-gray-400">
            Nhạc đồng hành cùng mình mỗi khi làm việc và suy nghĩ. Đây là những bài mình hay nghe nhất.
          </p>
          <a
            href={watchUrl(t.yt)}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.05] px-4 py-2.5 text-sm font-semibold text-gray-200 transition hover:border-[#3b82f6]/60 hover:text-white"
          >
            Mở trên YouTube <ExternalLink className="h-4 w-4" />
          </a>
        </div>

        {/* player */}
        <div className="overflow-hidden rounded-2xl bg-[#121212] shadow-[0_20px_50px_rgba(0,0,0,.5)]">
          <div className="flex items-center gap-5 p-5">
            <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-lg bg-black sm:h-32 sm:w-32">
              <img src={cover(t.yt)} alt="" className="h-full w-full object-cover" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xl font-bold sm:text-2xl">{t.title}</p>
              <p className="mt-0.5 truncate text-sm text-gray-400">{t.artist}</p>

              <div className="mt-4 flex items-center gap-3 text-[11px] text-gray-400">
                <span className="w-9 tabular-nums">{fmt(time)}</span>
                <input
                  type="range"
                  min={0}
                  max={1000}
                  value={Math.round(frac * 1000)}
                  onChange={(e) => m.seek(Number(e.target.value) / 1000)}
                  aria-label="Seek"
                  className="music-range h-1 flex-1 cursor-pointer"
                  style={{ ['--p' as string]: `${frac * 100}%` }}
                />
                <span className="w-9 text-right tabular-nums">{fmt(duration)}</span>
              </div>

              <div className="mt-3 flex items-center gap-4">
                <button onClick={m.prev} aria-label="Previous" className="text-gray-300 transition hover:text-white">
                  <SkipBack className="h-5 w-5" fill="currentColor" />
                </button>
                <button
                  onClick={m.toggle}
                  aria-label={m.playing ? 'Pause' : 'Play'}
                  className="grid h-11 w-11 place-items-center rounded-full bg-white text-black transition hover:scale-105 active:scale-95"
                >
                  {m.playing ? <Pause className="h-5 w-5" fill="currentColor" /> : <Play className="ml-0.5 h-5 w-5" fill="currentColor" />}
                </button>
                <button onClick={m.next} aria-label="Next" className="text-gray-300 transition hover:text-white">
                  <SkipForward className="h-5 w-5" fill="currentColor" />
                </button>
              </div>
            </div>
          </div>

          {/* playlist */}
          <ul className="max-h-[300px] overflow-y-auto border-t border-white/[0.06] py-2" data-lenis-prevent>
            {tracks.map((tr, i) => {
              const on = i === m.index;
              const bad = m.failed.has(tr.id);
              return (
                <li key={tr.id}>
                  <button
                    onClick={() => m.select(i)}
                    disabled={bad}
                    className={`flex w-full items-center gap-4 px-5 py-2.5 text-left transition ${on ? 'bg-white/[0.08]' : 'hover:bg-white/[0.05]'} ${bad ? 'opacity-40' : ''}`}
                  >
                    <span className="grid w-5 place-items-center text-sm text-gray-500">{on ? <Bars on={m.playing} /> : i + 1}</span>
                    <span className="min-w-0 flex-1">
                      <span className={`block truncate text-sm font-semibold ${on ? 'text-[#60a5fa]' : 'text-white'}`}>{tr.title}</span>
                      <span className="block truncate text-xs text-gray-500">{bad ? 'Không phát được (video không cho nhúng)' : tr.artist}</span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default MusicSection;

