import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  ExternalLink, 
  CheckCircle2, 
  Calendar, 
  User 
} from 'lucide-react';
import type { ProjectItem } from '../data/projects';
import { GithubIcon } from './SocialIcons';

interface ProjectModalProps {
  project: ProjectItem | null;
  onClose: () => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose }) => {
  if (!project) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-[#050510]/85 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto glass-panel rounded-3xl border border-white/15 shadow-2xl p-6 sm:p-8 z-10 space-y-6 text-left"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full bg-white/[0.06] hover:bg-white/[0.15] text-gray-300 hover:text-white transition-colors"
            aria-label="Đóng cửa sổ"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Project Preview Image */}
          <div className="w-full h-56 sm:h-72 rounded-2xl overflow-hidden bg-[#0a0a1a] border border-white/10 relative">
            <img
              src={project.image}
              alt={project.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-indigo-950/80 border border-indigo-500/40 text-xs font-mono text-cyan-300">
              {project.category.toUpperCase()}
            </div>
          </div>

          {/* Header Info */}
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-gray-400">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                {project.year}
              </span>
              {project.role && (
                <span className="flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-cyan-400" />
                  {project.role}
                </span>
              )}
            </div>
            
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
              {project.title}
            </h3>
            <p className="text-sm sm:text-base text-cyan-300 font-medium">
              {project.subtitle}
            </p>
          </div>

          {/* Detailed Description */}
          <div className="space-y-3 text-sm sm:text-base text-gray-300 leading-relaxed">
            <h4 className="text-xs uppercase font-mono font-bold text-gray-400 tracking-wider">
              Tổng quan dự án
            </h4>
            <p>{project.longDescription || project.description}</p>
          </div>

          {/* Key Features */}
          {project.features && project.features.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-xs uppercase font-mono font-bold text-gray-400 tracking-wider">
                Tính năng nổi bật
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {project.features.map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-gray-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Challenges & Solutions */}
          {project.challenges && (
            <div className="p-4 rounded-2xl bg-indigo-950/30 border border-indigo-500/20 text-xs sm:text-sm space-y-1">
              <div className="font-semibold text-indigo-300 font-mono">
                Thách thức kỹ thuật &amp; Giải pháp:
              </div>
              <p className="text-gray-300 leading-relaxed">
                {project.challenges}
              </p>
            </div>
          )}

          {/* Tech Tags */}
          <div className="space-y-2">
            <h4 className="text-xs uppercase font-mono font-bold text-gray-400 tracking-wider">
              Công nghệ ứng dụng
            </h4>
            <div className="flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 rounded-lg text-xs font-mono font-medium bg-white/[0.04] text-gray-300 border border-white/10"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Modal Actions */}
          <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-end gap-3">
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-gray-200 glass-button hover:text-white"
              >
                <GithubIcon className="w-4 h-4" />
                <span>Mã nguồn GitHub</span>
              </a>
            )}

            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-glow-sm hover:scale-[1.02] transition-transform"
              >
                <span>Xem Live Demo</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
