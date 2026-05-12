"use client";

import { useStore } from '@/context/StoreContext';

const Footer = ({ pageId }: { pageId?: string }) => {
  const { config } = useStore();
  const activePage = config.pages.find(p => p.id === (pageId || config.activePageId)) || config.pages[0]; const section = activePage.sections.find(s => s.type === 'footer');
  const s = section?.settings || {};

  if (!section?.visible) return null;

  return (
    <footer className="py-24 bg-background border-t-8 border-foreground">
      <div className="container-custom">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12">
          {/* Logo */}
          <a
            href="#hero"
            className="font-display text-5xl md:text-6xl font-black uppercase tracking-tighter text-foreground leading-none"
          >
            {s.brandName || 'Storely'}
          </a>

          {/* Copyright */}
          <div className="text-center md:text-left">
            <p className="text-xs font-black uppercase tracking-widest text-foreground/50">
              © {new Date().getFullYear()} {s.brandName || 'Storely'} All rights reserved.
            </p>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-8">
            <a
              href={s.socialX || "#"}
              className="text-xs font-black uppercase tracking-widest text-foreground hover:opacity-50 transition-opacity"
            >
              X
            </a>
            <a
              href={s.socialInstagram || "#"}
              className="text-xs font-black uppercase tracking-widest text-foreground hover:opacity-50 transition-opacity"
            >
              INSTAGRAM
            </a>
            <a
              href={s.socialTiktok || "#"}
              className="text-xs font-black uppercase tracking-widest text-foreground hover:opacity-50 transition-opacity"
            >
              TIKTOK
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
