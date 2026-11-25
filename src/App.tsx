import React, { useEffect } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { setLenis } from './lib/smooth';
import { setTheme } from './lib/theme';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { PortfolioIntro } from './components/PortfolioIntro';
import { PortfolioShowcase } from './components/PortfolioShowcase';
import { Contact } from './components/Contact';
import { MusicProvider } from './lib/music';
import { MusicSection } from './components/MusicSection';

gsap.registerPlugin(ScrollTrigger);

export const App: React.FC = () => {
  useEffect(() => {
    setTheme('dark');
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Lenis drives the scroll; GSAP's ticker drives Lenis so ScrollTrigger stays frame-accurate
    const lenis = new Lenis({ duration: reduce ? 0.01 : 1.15, smoothWheel: true, touchMultiplier: 1.6 });
    setLenis(lenis);
    lenis.on('scroll', ScrollTrigger.update);
    const tick = (t: number) => lenis.raf(t * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    // images change layout height — re-measure once they land
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener('load', refresh);

    return () => {
      window.removeEventListener('load', refresh);
      gsap.ticker.remove(tick);
      lenis.destroy();
      setLenis(null);
    };
  }, []);

  return (
    <MusicProvider>
    <div className="relative min-h-screen overflow-x-clip selection:bg-blue-600/30">
      <div className="topo-layer" aria-hidden />
      <Navbar />
      <main className="relative">
        <Hero />
        <About />
        <MusicSection />
        <PortfolioIntro />
        <PortfolioShowcase />
        <Contact />
      </main>
    </div>
    </MusicProvider>
  );
};

export default App;




