import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, Check, Calendar, User, Lightbulb, ArrowUpRight } from 'lucide-react';
import type { ProjectItem } from '../data/projects';
import { GithubIcon } from './SocialIcons';
import { setPageScrollLocked } from '../lib/smooth';

interface ProjectModalProps {
  project: ProjectItem | null;
  onClose: () => void;
}

/**
 * Project detail card — styled like the Portfolio section it opens from:
 * white card on a dark scrim, blue accent, large radius, Arial, and the project's own website
 * shown inside a little browser frame (it is the main proof of the work, so it gets the most room).
 */
export const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose }) => {
  const open = !!project;
  const closeRef = useRef(onClose);
  closeRef.current = onClose;
  // while the card is open the page behind must not scroll; Esc closes it
  useEffect(() => {
    if (!open) return;
    setPageScrollLocked(true);
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && closeRef.current();
    window.addEventListener('keydown', esc);
    return () => {
      setPageScrollLocked(false);
      window.removeEventListener('keydown', esc);
    };
  }, [open]);

  if (!project) return null;
  const host = project.liveUrl ? project.liveUrl.replace(/^https?:\/\//, '').replace(/\/$/, '') : 'preview';

  return createPortal(
    <AnimatePresence>
      <div
        data-lenis-prevent
        className="fixed inset-0 z-[70] flex items-center justify-center p-3 sm:p-6 overscroll-contain"
        style={{ fontFamily: 'Arial, sans-serif' }}
        role="dialog"
        aria-modal="true"
        aria-label={project.title}
      >
        {/* scrim */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-[#050510]/75 backdrop-blur-sm"
        />

        {/* card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 28 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.97, y: 16 }}
          transition={{ type: 'spring', damping: 26, stiffness: 300 }}
          className="relative z-10 flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-[28px] bg-white text-left text-gray-800 shadow-[0_30px_80px_rgba(2,6,23,.5)]"
        >
          <button
            onClick={onClose}
            className="absolute right-4 top-4 z-20 grid h-10 w-10 place-items-center rounded-full bg-white/90 text-gray-700 shadow-md backdrop-blur transition hover:scale-105 hover:bg-white hover:text-[#2563eb]"
            aria-label="Đóng cửa sổ"
          >
            <X className="h-5 w-5" />
          </button>

          {/* scrollable body */}
          <div data-lenis-prevent className="overflow-y-auto overscroll-contain">
            {/* website preview in a browser frame */}
            <div className="bg-gradient-to-b from-[#eef2ff] to-white px-5 pb-0 pt-14 sm:px-8 sm:pt-8">
              <div className="mx-auto max-w-3xl overflow-hidden rounded-t-2xl border border-gray-200 border-b-0 bg-white shadow-[0_18px_50px_rgba(15,23,42,.18)]">
                <div className="flex items-center gap-2 border-b border-gray-200 bg-gray-50 px-4 py-2.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
                  <span className="ml-3 flex-1 truncate rounded-md bg-white px-3 py-1 text-[11px] text-gray-500 border border-gray-200">{host}</span>
                </div>
                {project.liveUrl ? (
                  <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="group relative block aspect-[16/9] overflow-hidden bg-gray-100">
                    <img src={project.image} alt={`Giao diện ${project.title}`} className="h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-[1.03]" />
                    <span className="absolute inset-0 grid place-items-center bg-[#0b1020]/0 transition-colors duration-300 group-hover:bg-[#0b1020]/45">
                      <span className="inline-flex translate-y-2 items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-bold text-[#2563eb] opacity-0 shadow-lg transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                        Mở trang web <ArrowUpRight className="h-4 w-4" />
                      </span>
                    </span>
                  </a>
                ) : (
                  <img src={project.image} alt={`Giao diện ${project.title}`} className="aspect-[16/9] w-full object-cover object-top" />
                )}
              </div>
            </div>

            <div className="space-y-8 px-5 pb-8 pt-7 sm:px-9">
              {/* header */}
              <header className="space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[#2563eb]/10 px-3 py-1 text-xs font-bold text-[#2563eb]">
                    <Calendar className="h-3.5 w-3.5" />
                    {project.year}
                  </span>
                  {project.role && (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1 text-xs font-bold text-gray-600">
                      <User className="h-3.5 w-3.5" />
                      {project.role}
                    </span>
                  )}
                </div>
                <h3 style={{ fontFamily: "Arial, Helvetica, sans-serif" }} className="text-[26px] font-extrabold leading-tight text-gray-900 sm:text-[32px]">{project.title}</h3>
                <p className="text-base font-semibold text-[#2563eb]">{project.subtitle}</p>
              </header>

              {/* overview */}
              <section className="space-y-2.5">
                <h4 className="text-[11px] font-bold uppercase tracking-[.16em] text-gray-400">Tổng quan</h4>
                <p className="text-[15px] leading-7 text-gray-600">{project.longDescription || project.description}</p>
              </section>

              {/* highlights */}
              {project.features.length > 0 && (
                <section className="space-y-3">
                  <h4 className="text-[11px] font-bold uppercase tracking-[.16em] text-gray-400">Điểm nổi bật</h4>
                  <ul className="grid gap-3 sm:grid-cols-2">
                    {project.features.map((f, i) => (
                      <li key={i} className="flex items-start gap-3 rounded-2xl border border-gray-100 bg-gray-50/70 p-3.5 text-[13.5px] leading-6 text-gray-700">
                        <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[#2563eb] text-white">
                          <Check className="h-3 w-3" strokeWidth={3} />
                        </span>
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {/* problem & how it was handled */}
              {project.challenges && (
                <section className="flex gap-4 rounded-2xl border border-[#2563eb]/15 bg-[#2563eb]/[.05] p-5">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#2563eb] text-white">
                    <Lightbulb className="h-5 w-5" />
                  </span>
                  <div className="space-y-1">
                    <h4 style={{ fontFamily: "Arial, Helvetica, sans-serif" }} className="text-sm font-extrabold text-gray-900">Thách thức &amp; cách giải quyết</h4>
                    <p className="text-[14px] leading-6 text-gray-600">{project.challenges}</p>
                  </div>
                </section>
              )}

              {/* skills shown */}
              {project.tags.length > 0 && (
                <section className="space-y-2.5">
                  <h4 className="text-[11px] font-bold uppercase tracking-[.16em] text-gray-400">Kỹ năng thể hiện</h4>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span key={tag} className="rounded-full border border-gray-200 bg-white px-3.5 py-1.5 text-xs font-bold text-gray-600">
                        {tag}
                      </span>
                    ))}
                  </div>
                </section>
              )}
            </div>
          </div>

          {/* sticky actions */}
          {(project.liveUrl || project.githubUrl) && (
            <div className="flex flex-wrap items-center justify-end gap-3 border-t border-gray-100 bg-white px-5 py-4 sm:px-9">
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-bold text-gray-700 transition hover:-translate-y-0.5 hover:border-gray-300 hover:shadow-md"
                >
                  <GithubIcon className="h-4 w-4" />
                  Mã nguồn GitHub
                </a>
              )}
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl bg-[#2563eb] px-6 py-3 text-sm font-bold text-white shadow-[0_10px_24px_rgba(37,99,235,.35)] transition hover:-translate-y-0.5 hover:bg-[#1d4ed8]"
                >
                  Xem trang web
                  <ExternalLink className="h-4 w-4" />
                </a>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>,
    document.body,
  );
};


