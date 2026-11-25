import React, { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { 
  Download, 
  MapPin, 
  GraduationCap, 
  CheckCircle2, 
  Sparkles,
  Award,
  Layers,
  HeartHandshake
} from 'lucide-react';
import { profileData } from '../data/profile';

// Animated CountUp Component
const CountUp: React.FC<{ target: number; suffix?: string }> = ({ target, suffix = '' }) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  useEffect(() => {
    if (!isInView) return;

    let start = 0;
    const duration = 1800; // ms
    const increment = target / (duration / 25);

    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 25);

    return () => clearInterval(timer);
  }, [isInView, target]);

  return (
    <span ref={ref} className="font-extrabold text-3xl sm:text-4xl text-gradient">
      {count}{suffix}
    </span>
  );
};

export const About: React.FC = () => {
  const getStatIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Layers className="w-5 h-5 text-indigo-400" />;
      case 1:
        return <GraduationCap className="w-5 h-5 text-cyan-400" />;
      case 2:
        return <Award className="w-5 h-5 text-purple-400" />;
      default:
        return <HeartHandshake className="w-5 h-5 text-pink-400" />;
    }
  };

  return (
    <section id="about" className="py-24 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center space-y-3 mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-950/40 border border-indigo-500/20 text-xs font-mono text-cyan-400">
            <Sparkles className="w-3.5 h-3.5" />
            <span>KHÁM PHÁ VỀ TÔI</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
            Giới thiệu &amp; Nền tảng
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto text-sm sm:text-base">
            Tìm hiểu thêm về hành trình học tập, phong cách thiết kế và sứ mệnh xây dựng công nghệ của tôi.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left Column: Personal Highlight Card */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-5"
          >
            <div className="glass-card p-6 sm:p-8 rounded-3xl relative overflow-hidden group">
              {/* Subtle card glow */}
              <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/10 rounded-full filter blur-3xl pointer-events-none group-hover:bg-indigo-500/20 transition-all" />

              {/* Photo & Identity */}
              <div className="flex flex-col items-center text-center space-y-4 pb-6 border-b border-white/[0.08]">
                <div className="w-32 h-32 rounded-2xl p-1 bg-gradient-to-br from-indigo-500 via-purple-500 to-cyan-400 shadow-glow-sm">
                  <div className="w-full h-full rounded-[14px] overflow-hidden bg-[#0c0d1e]">
                    <img
                      src={profileData.avatar}
                      alt={profileData.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-white">{profileData.name}</h3>
                  <p className="text-sm text-cyan-400 font-mono mt-0.5">Sinh viên Giáo dục CNTT</p>
                  <p className="text-xs text-gray-400">Universitas Brawijaya (UB)</p>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-gray-300 font-mono bg-white/[0.04] px-3 py-1.5 rounded-full border border-white/5">
                  <MapPin className="w-3.5 h-3.5 text-pink-400" />
                  <span>{profileData.contactInfo.location}</span>
                </div>
              </div>

              {/* Quick Key Highlights */}
              <div className="py-6 space-y-3">
                <div className="text-xs font-semibold uppercase tracking-wider text-gray-400 font-mono">
                  Lĩnh vực trọng tâm
                </div>
                <div className="space-y-2.5">
                  {profileData.about.highlights.map((highlight, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-gray-300">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{highlight}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Download CV CTA */}
              <div className="pt-2">
                <a
                  href={profileData.cvUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold text-white bg-white/[0.06] hover:bg-gradient-to-r hover:from-indigo-600 hover:to-purple-600 border border-white/10 hover:border-transparent transition-all duration-300 shadow-sm hover:shadow-glow-sm"
                >
                  <Download className="w-4 h-4 text-cyan-300" />
                  <span>Tải hồ sơ năng lực (CV)</span>
                </a>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Bio Prose & Animated Stats */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-7 space-y-8"
          >
            {/* Story Paragraphs */}
            <div className="glass-card p-6 sm:p-8 rounded-3xl space-y-5">
              <h3 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
                <span>{profileData.about.greeting}</span>
              </h3>

              <div className="space-y-4 text-sm sm:text-base text-gray-300 leading-relaxed font-normal">
                {profileData.about.paragraphs.map((p, index) => (
                  <p key={index} className="text-justify sm:text-left">
                    {p}
                  </p>
                ))}
              </div>

              <div className="pt-2 border-t border-white/[0.06] flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-gray-400">
                <div>
                  <span className="text-indigo-400">● </span> Trạng thái:&nbsp;
                  <span className="text-white font-medium">{profileData.contactInfo.freelanceStatus}</span>
                </div>
                <div>
                  <span className="text-cyan-400">● </span> Thời gian làm việc:&nbsp;
                  <span className="text-white font-medium">{profileData.contactInfo.workingHours}</span>
                </div>
              </div>
            </div>

            {/* Stats Grid with Count-up */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {profileData.stats.map((stat, idx) => (
                <div
                  key={idx}
                  className="glass-card p-5 rounded-2xl flex flex-col items-center text-center space-y-2 hover:border-indigo-500/30"
                >
                  <div className="p-2 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                    {getStatIcon(idx)}
                  </div>
                  <div>
                    <CountUp target={stat.value} suffix={stat.suffix} />
                    <div className="text-xs text-gray-400 font-medium mt-1 leading-snug">
                      {stat.label}
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </motion.div>

        </div>
      </div>
    </section>
  );
};
