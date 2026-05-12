"use client";

import { motion } from 'framer-motion';
import { useStore } from '@/context/StoreContext';

const Hero = ({ pageId }: { pageId?: string }) => {
  const { config } = useStore();
  const activePage = config.pages.find(p => p.id === (pageId || config.activePageId)) || config.pages[0]; const section = activePage.sections.find(s => s.type === 'hero');
  const s = section?.settings || {};

  if (!section?.visible) return null;

  return (
    <section id="hero" className="relative min-h-screen w-full flex flex-col flex-1 justify-center overflow-hidden bg-background pt-20">
      {/* Brutalist Typographic Content */}
      <div className="container-custom relative z-10 w-full mb-12">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col uppercase w-full"
        >
          <span className="text-sm md:text-base font-bold tracking-[0.3em] mb-4 md:mb-8 border-b-2 border-foreground w-max pb-2">
            {s.eyebrow}
          </span>
          <h1 className="font-display text-[12vw] leading-[0.85] tracking-tighter text-foreground whitespace-nowrap">
            {s.headline1}
            <br />
            <span className="text-transparent" style={{ WebkitTextStroke: 'min(4px, 0.8vw) var(--foreground)' }}>
              {s.headline2}
            </span>
          </h1>
          
          <div className="mt-16 md:mt-32 flex flex-col lg:flex-row justify-between items-start lg:items-end gap-10 w-full">
            <p className="max-w-xl text-lg md:text-2xl font-body font-semibold leading-tight lowercase whitespace-pre-line">
              {s.subtext}
            </p>
            <a href={s.ctaHref || "#"} className="inline-block py-5 px-12 bg-foreground text-background font-black tracking-widest text-sm md:text-base hover:scale-105 transition-transform duration-300 shadow-[8px_8px_0px_0px_rgba(0,0,0,0.2)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.2)]">
              {s.ctaText}
            </a>
          </div>
        </motion.div>
      </div>

      {/* Decorative structural line */}
      <div className="absolute overflow-hidden bottom-10 left-0 w-full flex items-center gap-4 text-xs font-black tracking-widest whitespace-nowrap opacity-20 pointer-events-none">
        <motion.div 
          animate={{ x: ["0%", "-50%"] }} 
          transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
          className="flex gap-10 min-w-max"
        >
            <span>{s.marqueeText}</span>
            <span>{s.marqueeText}</span>
            <span>{s.marqueeText}</span>
            <span>{s.marqueeText}</span>
            <span>{s.marqueeText}</span>
            <span>{s.marqueeText}</span>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
