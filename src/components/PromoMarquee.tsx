"use client";

import { motion } from 'framer-motion';
import { useStore } from '@/context/StoreContext';

const PromoMarquee = ({ pageId }: { pageId?: string }) => {
  const { config } = useStore();
  const activePage = config.pages.find(p => p.id === (pageId || config.activePageId)) || config.pages[0]; const section = activePage.sections.find(s => s.type === 'marquee');
  const s = section?.settings || {};

  if (!section?.visible) return null;

  return (
    <div className="w-full bg-foreground text-background py-3 overflow-hidden whitespace-nowrap flex relative z-20 pointer-events-none">
      <motion.div
        animate={{ x: ["0%", "-50%"] }}
        transition={{ repeat: Infinity, duration: 30.5, ease: "linear" }}
        className="flex gap-4 min-w-max text-xs md:text-sm font-black uppercase tracking-[0.2em]"
      >
        {Array.from({ length: 12 }).map((_, i) => (
          <span key={i} className="flex items-center gap-4">
            <span>{s.item1}</span>
            <span className="w-1.5 h-1.5 bg-background inline-block" />
            <span>{s.item2}</span>
            <span className="w-1.5 h-1.5 bg-background inline-block" />
            <span>{s.item3}</span>
            <span className="w-1.5 h-1.5 bg-background inline-block" />
          </span>
        ))}
      </motion.div>
    </div>
  );
};

export default PromoMarquee;
