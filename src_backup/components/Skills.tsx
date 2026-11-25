import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  Code2, 
  Server, 
  Palette, 
  Cpu, 
  Layers, 
  Flame
} from 'lucide-react';
import { skillsData, skillCategories, marqueeTechnologies } from '../data/skills';
import type { SkillCategory } from '../data/skills';

export const Skills: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<SkillCategory['id']>('all');

  const filteredSkills = activeCategory === 'all'
    ? skillsData
    : skillsData.filter((skill) => skill.category === activeCategory);

  const getCategoryIcon = (id: string) => {
    switch (id) {
      case 'frontend':
        return <Code2 className="w-4 h-4 text-cyan-400" />;
      case 'backend':
        return <Server className="w-4 h-4 text-emerald-400" />;
      case 'tools':
        return <Palette className="w-4 h-4 text-purple-400" />;
      case 'ai_other':
        return <Cpu className="w-4 h-4 text-pink-400" />;
      default:
        return <Layers className="w-4 h-4 text-indigo-400" />;
    }
  };

  return (
    <section id="skills" className="py-24 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center space-y-3 mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-950/40 border border-indigo-500/20 text-xs font-mono text-cyan-400">
            <Sparkles className="w-3.5 h-3.5" />
            <span>KỸ NĂNG &amp; CÔNG NGHỆ</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
            Tech Stack &amp; Năng lực
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto text-sm sm:text-base">
            Các công cụ, ngôn ngữ và nền tảng tôi sử dụng hàng ngày để hiện thực hóa các ý tưởng sản phẩm số.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-12">
          {skillCategories.map((category) => {
            const isActive = activeCategory === category.id;
            return (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all duration-300 ${
                  isActive
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-glow-sm scale-[1.02]'
                    : 'glass-button text-gray-300 hover:text-white'
                }`}
              >
                {getCategoryIcon(category.id)}
                <span>{category.name}</span>
              </button>
            );
          })}
        </div>

        {/* Skills Grid */}
        <motion.div 
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          <AnimatePresence>
            {filteredSkills.map((skill) => (
              <motion.div
                key={skill.name}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="glass-card p-5 rounded-2xl flex flex-col justify-between group hover:border-indigo-500/40"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-10 h-10 rounded-xl flex items-center justify-center bg-white/[0.04] border border-white/[0.08] transition-transform duration-300 group-hover:scale-110"
                      style={{ color: skill.color }}
                    >
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-base group-hover:text-gradient transition-colors">
                        {skill.name}
                      </h4>
                      <span className="text-[11px] text-gray-400 font-mono">
                        {skill.category.toUpperCase()}
                      </span>
                    </div>
                  </div>

                  <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-white/[0.04] text-indigo-300 border border-white/5 font-mono">
                    {skill.level}
                  </span>
                </div>

                {/* Progress bar */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs text-gray-400 font-mono">
                    <span>Độ thành thục</span>
                    <span className="text-gray-300 font-semibold">{skill.percentage}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-white/[0.05] overflow-hidden p-[1px]">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${skill.percentage}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, ease: 'easeOut' }}
                      className="h-full rounded-full"
                      style={{
                        background: `linear-gradient(90deg, #6366F1, ${skill.color})`
                      }}
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Marquee Ticker */}
        <div className="mt-16 pt-8 border-t border-white/[0.06] overflow-hidden">
          <div className="flex items-center gap-2 mb-4 justify-center text-xs font-mono text-gray-400 uppercase tracking-widest">
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            <span>Hệ sinh thái công nghệ thường trực</span>
          </div>

          <div className="relative w-full flex overflow-x-hidden mask-fade">
            <div className="py-2 animate-marquee whitespace-nowrap flex gap-4">
              {marqueeTechnologies.concat(marqueeTechnologies).map((tech, idx) => (
                <div
                  key={idx}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.02] border border-white/[0.07] text-gray-300 text-xs sm:text-sm font-mono font-medium hover:border-indigo-500/40 hover:text-white transition-colors"
                >
                  <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                  <span>{tech}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
