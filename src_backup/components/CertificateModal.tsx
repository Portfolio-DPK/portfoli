import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, Award, Calendar } from 'lucide-react';
import type { CertificateItem } from '../data/certificates';

interface CertificateModalProps {
  certificate: CertificateItem | null;
  onClose: () => void;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({ certificate, onClose }) => {
  if (!certificate) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-[#050510]/85 backdrop-blur-md"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto glass-panel rounded-3xl border border-white/15 shadow-2xl p-6 sm:p-8 z-10 space-y-6 text-left"
        >
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full bg-white/[0.06] hover:bg-white/[0.15] text-gray-300 hover:text-white transition-colors"
            aria-label="Đóng cửa sổ"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Large Certificate Preview */}
          <div className="w-full h-64 sm:h-80 rounded-2xl overflow-hidden bg-[#0a0a1a] border border-white/10 shadow-lg">
            <img
              src={certificate.image}
              alt={certificate.title}
              className="w-full h-full object-contain"
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
              <Award className="w-4 h-4" />
              <span>{certificate.issuer}</span>
              <span className="text-gray-500">•</span>
              <span className="text-gray-400 flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {certificate.issueDate}
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-bold text-white">
              {certificate.title}
            </h3>

            <div className="text-xs font-mono text-gray-400 bg-white/[0.03] p-3 rounded-xl border border-white/5">
              Mã xác thực (Credential ID): <span className="text-indigo-300 font-semibold">{certificate.credentialId}</span>
            </div>
          </div>

          {/* Skills Covered */}
          <div className="space-y-2">
            <h4 className="text-xs uppercase font-mono font-bold text-gray-400 tracking-wider">
              Kỹ năng &amp; Năng lực được chứng nhận
            </h4>
            <div className="flex flex-wrap gap-2">
              {certificate.skills.map((skill) => (
                <span
                  key={skill}
                  className="px-3 py-1 rounded-lg text-xs font-mono bg-white/[0.04] text-gray-300 border border-white/10"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3">
            <a
              href={certificate.credentialUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-glow-sm"
            >
              <span>Xác thực chứng chỉ</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
