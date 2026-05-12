"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

// ─── Types ─────────────────────────────────────────────────────────────────────

export type SectionType = 'navbar' | 'hero' | 'marquee' | 'products' | 'cta' | 'footer';

export interface Section {
  id: string;
  type: SectionType;
  label: string;
  visible: boolean;
  settings: Record<string, string>;
}

export interface BuilderPage {
  id: string;
  title: string;
  slug: string;
  sections: Section[];
}

export interface StoreConfig {
  pages: BuilderPage[];
  activePageId: string;
  logoUrl: string | null;
}

// ─── Defaults ──────────────────────────────────────────────────────────────────

const DEFAULT_SECTIONS: Section[] = [
  {
    id: 'navbar',
    type: 'navbar',
    label: 'Navigation Bar',
    visible: true,
    settings: {
      logoText: 'Storely',
      link1Label: 'New Releases',
      link1Href: '/#hero',
      link2Label: 'View All',
      link2Href: '/shop',
      link3Label: 'Log In',
      link3Href: '/login',
    },
  },
  {
    id: 'hero',
    type: 'hero',
    label: 'Hero Section',
    visible: true,
    settings: {
      eyebrow: 'Justin Dropped.',
      headline1: 'REDEFINE',
      headline2: 'PERFORMANCE',
      subtext: 'engineered for those who demand more.\nThe new standard in activewear is here.',
      ctaText: 'SHOP NOW',
      ctaHref: '#shop',
      marqueeText: 'PERFORMANCE STAYS IN MOTION.',
    },
  },
  {
    id: 'marquee',
    type: 'marquee',
    label: 'Promo Marquee',
    visible: true,
    settings: {
      item1: 'MEMBERS GET FREE SHIPPING',
      item2: 'NEW RELEASES JUST DROPPED',
      item3: 'SAVE UP TO 40% ON SALE',
    },
  },
  {
    id: 'products',
    type: 'products',
    label: 'Product Grid',
    visible: true,
    settings: {
      heading: 'Trending Now',
    },
  },
  {
    id: 'cta',
    type: 'cta',
    label: 'Email CTA',
    visible: true,
    settings: {
      headline: 'JOIN THE SQUAD.',
      subtext: 'sign up for exclusive drops, early access, and members-only products.',
      buttonText: 'JOIN',
      placeholder: 'ENTER EMAIL',
    },
  },
  {
    id: 'footer',
    type: 'footer',
    label: 'Footer',
    visible: true,
    settings: {
      brandName: 'Storely',
      tagline: 'Engineered for the relentless.',
      socialX: '#',
      socialInstagram: '#',
      socialTiktok: '#',
    },
  },
];

const DEFAULT_PAGES: BuilderPage[] = [
  {
    id: 'page-home',
    title: 'Home',
    slug: 'home',
    sections: DEFAULT_SECTIONS,
  },
  {
    id: 'page-about',
    title: 'About Us',
    slug: 'about-us',
    sections: [
      { id: 'navbar-about', type: 'navbar', label: 'Navigation Bar', visible: true, settings: { logoText: 'Storely' } },
      { id: 'hero-about', type: 'hero', label: 'Hero Section', visible: true, settings: { eyebrow: 'Our Story', headline1: 'BORN TO', headline2: 'PERFORM', subtext: 'We are a brand dedicated to relentless performance.', ctaText: 'SHOP NOW', ctaHref: '#shop' } },
      { id: 'footer-about', type: 'footer', label: 'Footer', visible: true, settings: { brandName: 'Storely' } },
    ],
  },
];

// ─── Context ────────────────────────────────────────────────────────────────────

interface StoreContextValue {
  config: StoreConfig;
  setActivePage: (id: string) => void;
  setSections: (sections: Section[]) => void;
  updateSection: (id: string, key: string, value: string) => void;
  toggleVisible: (id: string) => void;
  moveUp: (id: string) => void;
  moveDown: (id: string) => void;
  deleteSection: (id: string) => void;
  addSection: (type: SectionType) => void;
  setLogoUrl: (url: string | null) => void;
  addPage: (page: Omit<BuilderPage, 'id' | 'sections'>) => void;
  deletePage: (id: string) => void;
  resetToDefaults: () => void;
}

const StoreContext = createContext<StoreContextValue | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<StoreConfig>({
    pages: DEFAULT_PAGES,
    activePageId: 'page-home',
    logoUrl: null,
  });

  const setActivePage = useCallback((id: string) => {
    setConfig(prev => ({ ...prev, activePageId: id }));
  }, []);

  const setSections = useCallback((sections: Section[]) => {
    setConfig(prev => ({
      ...prev,
      pages: prev.pages.map(p => p.id === prev.activePageId ? { ...p, sections } : p)
    }));
  }, []);

  const updateSection = useCallback((id: string, key: string, value: string) => {
    setConfig(prev => ({
      ...prev,
      pages: prev.pages.map(p => 
        p.id === prev.activePageId 
          ? { ...p, sections: p.sections.map(s => s.id === id ? { ...s, settings: { ...s.settings, [key]: value } } : s) }
          : p
      )
    }));
  }, []);

  const toggleVisible = useCallback((id: string) => {
    setConfig(prev => ({
      ...prev,
      pages: prev.pages.map(p => 
        p.id === prev.activePageId 
          ? { ...p, sections: p.sections.map(s => s.id === id ? { ...s, visible: !s.visible } : s) }
          : p
      )
    }));
  }, []);

  const moveUp = useCallback((id: string) => {
    setConfig(prev => {
      const activePage = prev.pages.find(p => p.id === prev.activePageId);
      if (!activePage) return prev;
      
      const idx = activePage.sections.findIndex(s => s.id === id);
      if (idx <= 0) return prev;
      
      const nextSections = [...activePage.sections];
      [nextSections[idx - 1], nextSections[idx]] = [nextSections[idx], nextSections[idx - 1]];
      
      return {
        ...prev,
        pages: prev.pages.map(p => p.id === prev.activePageId ? { ...p, sections: nextSections } : p)
      };
    });
  }, []);

  const moveDown = useCallback((id: string) => {
    setConfig(prev => {
      const activePage = prev.pages.find(p => p.id === prev.activePageId);
      if (!activePage) return prev;
      
      const idx = activePage.sections.findIndex(s => s.id === id);
      if (idx >= activePage.sections.length - 1) return prev;
      
      const nextSections = [...activePage.sections];
      [nextSections[idx], nextSections[idx + 1]] = [nextSections[idx + 1], nextSections[idx]];
      
      return {
        ...prev,
        pages: prev.pages.map(p => p.id === prev.activePageId ? { ...p, sections: nextSections } : p)
      };
    });
  }, []);

  const deleteSection = useCallback((id: string) => {
    setConfig(prev => ({
      ...prev,
      pages: prev.pages.map(p => 
        p.id === prev.activePageId 
          ? { ...p, sections: p.sections.filter(s => s.id !== id) }
          : p
      )
    }));
  }, []);

  const addSection = useCallback((type: SectionType) => {
    const newId = `${type}-${Date.now()}`;
    const templates: Record<SectionType, Omit<Section, 'id'>> = {
      navbar: { type: 'navbar', label: 'Navigation Bar', visible: true, settings: { logoText: 'Storely', link1Label: 'Shop', link1Href: '/shop', link2Label: 'About', link2Href: '#', link3Label: 'Log In', link3Href: '/login' } },
      hero: { type: 'hero', label: 'Hero Section', visible: true, settings: { eyebrow: 'New Drop.', headline1: 'BOLD', headline2: 'VISION', subtext: 'Your tagline goes here.', ctaText: 'SHOP NOW', ctaHref: '#shop', marqueeText: 'SOMETHING STAYS IN MOTION.' } },
      marquee: { type: 'marquee', label: 'Promo Marquee', visible: true, settings: { item1: 'FREE SHIPPING', item2: 'NEW ARRIVALS', item3: 'MEMBERS SAVE MORE' } },
      products: { type: 'products', label: 'Product Grid', visible: true, settings: { heading: 'Shop Now' } },
      cta: { type: 'cta', label: 'Email CTA', visible: true, settings: { headline: 'STAY IN THE LOOP.', subtext: 'get early access and exclusive offers.', buttonText: 'JOIN', placeholder: 'ENTER EMAIL' } },
      footer: { type: 'footer', label: 'Footer', visible: true, settings: { brandName: 'Storely', tagline: 'Built for the relentless.', socialX: '#', socialInstagram: '#', socialTiktok: '#' } },
    };
    setConfig(prev => ({
      ...prev,
      pages: prev.pages.map(p => 
        p.id === prev.activePageId 
          ? { ...p, sections: [...p.sections, { id: newId, ...templates[type] }] }
          : p
      )
    }));
  }, []);

  const setLogoUrl = useCallback((url: string | null) => {
    setConfig(prev => ({ ...prev, logoUrl: url }));
  }, []);

  const addPage = useCallback((page: Omit<BuilderPage, 'id' | 'sections'>) => {
    const newId = `page-${Date.now()}`;
    // Duplicate the navbar and footer for the new page so it looks consistent
    const navbar = DEFAULT_SECTIONS.find(s => s.type === 'navbar');
    const footer = DEFAULT_SECTIONS.find(s => s.type === 'footer');
    
    const initialSections: Section[] = [];
    if (navbar) initialSections.push({ ...navbar, id: `navbar-${Date.now()}` });
    if (footer) initialSections.push({ ...footer, id: `footer-${Date.now()}` });

    setConfig(prev => ({
      ...prev,
      pages: [...prev.pages, { id: newId, ...page, sections: initialSections }],
      activePageId: newId,
    }));
  }, []);

  const deletePage = useCallback((id: string) => {
    setConfig(prev => {
      const nextPages = prev.pages.filter(p => p.id !== id);
      return {
        ...prev,
        pages: nextPages,
        activePageId: prev.activePageId === id ? (nextPages[0]?.id || '') : prev.activePageId
      };
    });
  }, []);

  const resetToDefaults = useCallback(() => {
    setConfig({ pages: DEFAULT_PAGES, activePageId: 'page-home', logoUrl: null });
  }, []);

  return (
    <StoreContext.Provider value={{ config, setActivePage, setSections, updateSection, toggleVisible, moveUp, moveDown, deleteSection, addSection, setLogoUrl, addPage, deletePage, resetToDefaults }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used inside <StoreProvider>');
  return ctx;
}
