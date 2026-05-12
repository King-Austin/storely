"use client";

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { useStore } from '@/context/StoreContext';

const FinalCTA = ({ pageId }: { pageId?: string }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  // Ensure visibility in builder/preview environments where intersection observer might be tricky
  const animateState = isInView ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }; 
  
  const { config } = useStore();
  const activePage = config.pages.find(p => p.id === (pageId || config.activePageId)) || config.pages[0]; const section = activePage.sections.find(s => s.type === 'cta');
  const s = section?.settings || {};

  if (!section?.visible) return null;

  return (
    <section className="py-32 md:py-48 bg-foreground text-background">
      <div className="container-custom" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={animateState}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto text-center flex flex-col items-center"
        >
          <h2 className="font-display text-5xl md:text-8xl lg:text-[9rem] font-black uppercase tracking-tighter leading-none mb-8">
            {s.headline}
          </h2>
          <p className="text-xl md:text-2xl font-body font-bold mb-12 max-w-2xl lowercase text-background/80">
            {s.subtext}
          </p>

          <form className="w-full max-w-xl flex flex-col sm:flex-row gap-4" onSubmit={(e) => e.preventDefault()}>
            <input 
              type="email" 
              placeholder={s.placeholder} 
              className="w-full bg-transparent border-b-[3px] border-background/50 py-4 px-2 text-lg md:text-xl font-black uppercase tracking-widest text-background placeholder:text-background/30 focus:outline-none focus:border-background transition-colors"
              required
            />
            <button 
              type="submit" 
              className="bg-background text-foreground font-black text-lg md:text-xl tracking-widest uppercase px-10 py-5 hover:bg-background/80 transition-colors"
            >
              {s.buttonText}
            </button>
          </form>
        </motion.div>
      </div>
    </section>
  );
};

export default FinalCTA;
