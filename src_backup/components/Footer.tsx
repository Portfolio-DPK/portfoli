import React from 'react';
import { ArrowUp, Mail } from 'lucide-react';
import { profileData } from '../data/profile';
import { GithubIcon, LinkedinIcon, InstagramIcon } from './SocialIcons';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getSocialIcon = (name: string) => {
    switch (name.toLowerCase()) {
      case 'github':
        return <GithubIcon className="w-4 h-4" />;
      case 'linkedin':
        return <LinkedinIcon className="w-4 h-4" />;
      case 'instagram':
        return <InstagramIcon className="w-4 h-4" />;
      default:
        return <Mail className="w-4 h-4" />;
    }
  };

  return (
    <footer className="relative z-10 border-t border-white/[0.08] bg-[#050510]/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          
          {/* Logo & Copyright */}
          <div className="flex flex-col items-center md:items-start space-y-2 text-center md:text-left">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-mono font-bold text-xs text-white">
                &lt;E/&gt;
              </div>
              <span className="font-bold text-white text-base">
                {profileData.name}
              </span>
            </div>
            <p className="text-xs text-gray-400">
              © {new Date().getFullYear()} Eka Wahyu Maulidan. Thiết kế và phát triển với tâm huyết.
            </p>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-3">
            {profileData.socialLinks.map((social) => (
              <a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.name}
                className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-gray-400 hover:text-white hover:border-indigo-500/50 hover:bg-white/[0.08] transition-all"
                title={social.label}
              >
                {getSocialIcon(social.name)}
              </a>
            ))}
          </div>

          {/* Back to top button */}
          <div>
            <button
              onClick={scrollToTop}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl glass-button text-xs font-semibold text-gray-300 hover:text-white hover:border-indigo-400/50 transition-all hover:-translate-y-1"
            >
              <span>Về đầu trang</span>
              <ArrowUp className="w-3.5 h-3.5 text-cyan-400" />
            </button>
          </div>

        </div>
      </div>
    </footer>
  );
};
