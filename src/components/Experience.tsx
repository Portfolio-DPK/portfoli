import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  Briefcase, 
  GraduationCap, 
  Calendar, 
  MapPin, 
  CheckCircle2, 
  Layers 
} from 'lucide-react';
import { timelineData } from '../data/experience';

export const Experience: React.FC = () => {
  const [filterType, setFilterType] = useState<'all' | 'experience' | 'education'>('all');

  const filteredItems = filterType === 'all'
    ? timelineData
    : timelineData.filter((item) => item.type === filterType);

  return (
    <section id="experience" className="py-24 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center space-y-3 mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-950/40 border border-indigo-500/20 text-xs font-mono text-cyan-400">
            <Sparkles className="w-3.5 h-3.5" />
            <span>HÀNH TRÌNH PHÁT TRIỂN</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
            Kinh nghiệm &amp; Học vấn
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto text-sm sm:text-base">
            Quá trình tích lũy chuyên môn qua các vị trí công tác, hoạt động trợ giảng và chương trình cử nhân đại học.
          </p>
        </div>

        {/* Filter Switcher */}
        <div className="flex items-center justify-center gap-2 mb-16">
          <button
            onClick={() => setFilterType('all')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all ${
              filterType === 'all'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-glow-sm'
                : 'glass-button text-gray-400 hover:text-white'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Tất cả</span>
          </button>

          <button
            onClick={() => setFilterType('experience')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all ${
              filterType === 'experience'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-glow-sm'
                : 'glass-button text-gray-400 hover:text-white'
            }`}
          >
            <Briefcase className="w-4 h-4 text-indigo-400" />
            <span>Kinh nghiệm</span>
          </button>

          <button
            onClick={() => setFilterType('education')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all ${
              filterType === 'education'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-glow-sm'
                : 'glass-button text-gray-400 hover:text-white'
            }`}
          >
            <GraduationCap className="w-4 h-4 text-cyan-400" />
            <span>Học vấn</span>
          </button>
        </div>

        {/* Vertical Timeline */}
        <div className="relative max-w-4xl mx-auto">
          {/* Central Vertical Line */}
          <div className="absolute left-4 sm:left-1/2 top-4 bottom-4 -translate-x-1/2 w-[2px] bg-gradient-to-b from-indigo-500 via-purple-500 to-cyan-500 opacity-30" />

          <div className="space-y-12">
            <AnimatePresence>
              {filteredItems.map((item, index) => {
                const isEven = index % 2 === 0;
                return (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className={`relative flex flex-col sm:flex-row items-start ${
                      isEven ? 'sm:flex-row-reverse' : ''
                    } gap-8 group`}
                  >
                    {/* Glowing Timeline Node */}
                    <div className="absolute left-4 sm:left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-[#070718] border-2 border-indigo-500 flex items-center justify-center z-10 shadow-[0_0_12px_rgba(99,102,241,0.6)] group-hover:scale-110 transition-transform">
                      {item.type === 'experience' ? (
                        <Briefcase className="w-3.5 h-3.5 text-indigo-400" />
                      ) : (
                        <GraduationCap className="w-3.5 h-3.5 text-cyan-400" />
                      )}
                    </div>

                    {/* Timeline Content Card */}
                    <div className="w-full sm:w-[calc(50%-2.5rem)] pl-12 sm:pl-0">
                      <div className="glass-card p-6 sm:p-7 rounded-3xl space-y-4 hover:border-indigo-500/40">
                        {/* Top meta tags */}
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium bg-indigo-950/60 border border-indigo-500/30 text-indigo-300">
                            <Calendar className="w-3 h-3 text-indigo-400" />
                            {item.period}
                          </span>

                          <span className="flex items-center gap-1 text-[11px] font-mono text-gray-400">
                            <MapPin className="w-3 h-3 text-pink-400" />
                            {item.location}
                          </span>
                        </div>

                        {/* Title & Organization */}
                        <div>
                          <h3 className="text-lg font-bold text-white group-hover:text-gradient transition-colors">
                            {item.title}
                          </h3>
                          <div className="text-sm font-medium text-cyan-400 mt-0.5">
                            {item.organization}
                          </div>
                        </div>

                        {/* Description */}
                        <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                          {item.description}
                        </p>

                        {/* Responsibilities Bullets */}
                        {item.responsibilities && (
                          <div className="space-y-2 pt-1 border-t border-white/[0.06]">
                            {item.responsibilities.map((resp, rIdx) => (
                              <div key={rIdx} className="flex items-start gap-2 text-xs text-gray-300">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                                <span>{resp}</span>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Tech tags */}
                        <div className="flex flex-wrap gap-1.5 pt-2">
                          {item.skills.map((skill) => (
                            <span
                              key={skill}
                              className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-white/[0.04] text-gray-400 border border-white/5"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>

                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>

      </div>
    </section>
  );
};
