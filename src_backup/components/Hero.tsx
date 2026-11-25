import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowRight, 
  Send, 
  Mail, 
  Sparkles, 
  Code2, 
  Cpu 
} from 'lucide-react';
import { profileData } from '../data/profile';
import { GithubIcon, LinkedinIcon, InstagramIcon } from './SocialIcons';

export const Hero: React.FC = () => {
  // Typewriter effect logic
  const roles = profileData.typewriterRoles;
  const [currentRoleIndex, setCurrentRoleIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentRole = roles[currentRoleIndex];
    const typingSpeed = isDeleting ? 40 : 80;

    const timer = setTimeout(() => {
      if (!isDeleting) {
        if (displayedText.length < currentRole.length) {
          setDisplayedText(currentRole.slice(0, displayedText.length + 1));
        } else {
          // Pause before starting deletion
          setTimeout(() => setIsDeleting(true), 1800);
        }
      } else {
        if (displayedText.length > 0) {
          setDisplayedText(currentRole.slice(0, displayedText.length - 1));
        } else {
          setIsDeleting(false);
          setCurrentRoleIndex((prev) => (prev + 1) % roles.length);
        }
      }
    }, typingSpeed);

    return () => clearTimeout(timer);
  }, [displayedText, isDeleting, currentRoleIndex, roles]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const getSocialIcon = (name: string) => {
    switch (name.toLowerCase()) {
      case 'github':
        return <GithubIcon className="w-5 h-5" />;
      case 'linkedin':
        return <LinkedinIcon className="w-5 h-5" />;
      case 'instagram':
        return <InstagramIcon className="w-5 h-5" />;
      default:
        return <Mail className="w-5 h-5" />;
    }
  };

  return (
    <section id="hero" className="relative min-h-[92vh] flex items-center justify-center pt-28 pb-16 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Bio & Calls to Action */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 text-center lg:text-left space-y-6"
          >
            {/* Status Pill */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-indigo-950/40 border border-indigo-500/30 backdrop-blur-md"
            >
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span className="text-xs font-medium text-indigo-200">
                {profileData.status}
              </span>
            </motion.div>

            {/* Main Greeting & Name */}
            <div className="space-y-2">
              <h2 className="text-base sm:text-lg font-mono text-cyan-400 tracking-wide font-medium flex items-center justify-center lg:justify-start gap-2">
                <span>Xin chào, tôi là</span>
                <Sparkles className="w-4 h-4 text-cyan-400" />
              </h2>
              
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.1]">
                <span className="text-gradient">
                  {profileData.name}
                </span>
              </h1>
            </div>

            {/* Typewriter Role Title */}
            <div className="h-10 sm:h-12 flex items-center justify-center lg:justify-start">
              <div className="text-xl sm:text-2xl lg:text-3xl font-semibold text-gray-200 flex items-center gap-1 font-mono">
                <span className="text-indigo-400">&gt; </span>
                <span className="text-white border-b-2 border-indigo-400/80 pb-0.5">
                  {displayedText}
                </span>
                <span className="inline-block w-2 sm:w-2.5 h-6 sm:h-7 bg-cyan-400 animate-pulse ml-0.5"></span>
              </div>
            </div>

            {/* Bio Description */}
            <p className="text-base sm:text-lg text-gray-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
              {profileData.shortDescription}
            </p>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-4">
              <button
                onClick={() => scrollToSection('projects')}
                className="group relative inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 shadow-glow-md hover:shadow-glow-lg transition-all duration-300 hover:scale-[1.03] active:scale-[0.98]"
              >
                <span>Xem dự án</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </button>

              <button
                onClick={() => scrollToSection('contact')}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm text-gray-200 glass-button hover:text-white hover:border-indigo-400/50 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
              >
                <Send className="w-4 h-4 text-cyan-400" />
                <span>Liên hệ tôi</span>
              </button>
            </div>

            {/* Social Icons with Tooltip */}
            <div className="pt-4 flex items-center justify-center lg:justify-start gap-3">
              <span className="text-xs text-gray-400 font-mono mr-2 hidden sm:inline-block">
                Kết nối:
              </span>
              {profileData.socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.name}
                  className="p-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-gray-400 hover:text-white hover:border-indigo-500/50 hover:bg-indigo-600/10 hover:shadow-glow-sm transition-all duration-300 hover:-translate-y-1"
                  title={social.label}
                >
                  {getSocialIcon(social.name)}
                </a>
              ))}
            </div>
          </motion.div>

          {/* Right Column: Interactive Glowing Avatar Card */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 flex justify-center relative"
          >
            <div className="relative w-72 h-72 sm:w-96 sm:h-96">
              
              {/* Outer decorative pulsing rings */}
              <div className="absolute inset-0 rounded-full border border-indigo-500/20 animate-pulse-glow" />
              <div className="absolute -inset-4 rounded-full border border-purple-500/15 animate-spin" style={{ animationDuration: '30s' }} />

              {/* Glowing backdrops */}
              <div className="absolute inset-0 bg-gradient-to-tr from-indigo-600/30 via-purple-600/30 to-cyan-500/30 rounded-full filter blur-2xl" />

              {/* Avatar Main Circle */}
              <div className="relative w-full h-full rounded-full p-2 bg-gradient-to-tr from-indigo-500 via-purple-500 to-cyan-400 shadow-glow-lg">
                <div className="w-full h-full rounded-full overflow-hidden bg-[#0a0a1a] p-1 border-2 border-white/20">
                  <img
                    src={profileData.avatar}
                    alt={profileData.name}
                    className="w-full h-full object-cover rounded-full hover:scale-105 transition-transform duration-500"
                    loading="eager"
                  />
                </div>
              </div>

              {/* Floating Technology Badges */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -top-2 -left-4 sm:left-0 px-3.5 py-2 rounded-2xl glass-panel flex items-center gap-2 shadow-lg border border-cyan-500/30"
              >
                <div className="p-1 rounded-lg bg-cyan-500/20 text-cyan-400">
                  <Code2 className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[10px] text-gray-400 uppercase font-mono">Core Stack</div>
                  <div className="text-xs font-bold text-white">React &amp; TS</div>
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                className="absolute -bottom-4 -left-2 sm:left-4 px-3.5 py-2 rounded-2xl glass-panel flex items-center gap-2 shadow-lg border border-purple-500/30"
              >
                <div className="p-1 rounded-lg bg-purple-500/20 text-purple-400">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[10px] text-gray-400 uppercase font-mono">Aesthetics</div>
                  <div className="text-xs font-bold text-white">UI/UX Design</div>
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
                className="absolute top-1/2 -right-4 sm:-right-6 px-3.5 py-2 rounded-2xl glass-panel flex items-center gap-2 shadow-lg border border-indigo-500/30"
              >
                <div className="p-1 rounded-lg bg-indigo-500/20 text-indigo-400">
                  <Cpu className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[10px] text-gray-400 uppercase font-mono">Exploration</div>
                  <div className="text-xs font-bold text-white">AI &amp; Vision</div>
                </div>
              </motion.div>

            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};
