import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ExternalLink, Eye } from 'lucide-react';
import { certificatesData } from '../data/certificates';
import type { CertificateItem } from '../data/certificates';
import { CertificateModal } from './CertificateModal';

export const Certificates: React.FC = () => {
  const [selectedCert, setSelectedCert] = useState<CertificateItem | null>(null);

  return (
    <section id="certificates" className="py-24 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center space-y-3 mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-950/40 border border-indigo-500/20 text-xs font-mono text-cyan-400">
            <Sparkles className="w-3.5 h-3.5" />
            <span>NĂNG LỰC ĐƯỢC CÔNG NHẬN</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
            Chứng chỉ &amp; Thành tựu
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto text-sm sm:text-base">
            Các chứng nhận chuyên môn từ Google Cloud, Dicoding Indonesia, Coursera và freeCodeCamp.
          </p>
        </div>

        {/* Certificates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certificatesData.map((cert) => (
            <motion.div
              key={cert.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="glass-card rounded-3xl overflow-hidden flex flex-col justify-between group hover:border-indigo-500/50"
            >
              {/* Preview Thumbnail */}
              <div 
                onClick={() => setSelectedCert(cert)}
                className="relative w-full h-48 bg-[#0a0c16] cursor-pointer overflow-hidden p-3"
              >
                <div className="w-full h-full rounded-2xl overflow-hidden border border-white/5 bg-[#0e1220]">
                  <img
                    src={cert.image}
                    alt={cert.title}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>

                {/* Hover overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-indigo-950/50 backdrop-blur-[2px]">
                  <div className="px-4 py-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-white flex items-center gap-1.5 shadow-lg">
                    <Eye className="w-4 h-4 text-cyan-300" />
                    <span>Xem phóng to</span>
                  </div>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono text-cyan-400">
                    <span>{cert.issuer}</span>
                    <span className="text-gray-400">{cert.issueDate}</span>
                  </div>

                  <h3 
                    onClick={() => setSelectedCert(cert)}
                    className="text-base font-bold text-white group-hover:text-gradient transition-colors cursor-pointer"
                  >
                    {cert.title}
                  </h3>

                  <p className="text-[11px] font-mono text-gray-400">
                    ID: {cert.credentialId}
                  </p>
                </div>

                {/* Skills tags */}
                <div className="flex flex-wrap gap-1 pt-1">
                  {cert.skills.slice(0, 3).map((skill) => (
                    <span
                      key={skill}
                      className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-white/[0.04] text-gray-300 border border-white/5"
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                {/* Actions */}
                <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between">
                  <button
                    onClick={() => setSelectedCert(cert)}
                    className="text-xs font-medium text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Phóng to</span>
                  </button>

                  <a
                    href={cert.credentialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-gray-400 hover:text-white transition-colors"
                  >
                    <span>Kiểm tra</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Certificate Lightbox Modal */}
        <CertificateModal
          certificate={selectedCert}
          onClose={() => setSelectedCert(null)}
        />

      </div>
    </section>
  );
};
