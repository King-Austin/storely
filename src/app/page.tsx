"use client";

import { useStore } from '@/context/StoreContext';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import PromoMarquee from '@/components/PromoMarquee';
import ProductGrid from '@/components/ProductGrid';
import FinalCTA from '@/components/FinalCTA';
import Footer from '@/components/Footer';

const COMPONENT_MAP: Record<string, React.FC> = {
  navbar: Navbar,
  hero: Hero,
  marquee: PromoMarquee,
  products: ProductGrid,
  cta: FinalCTA,
  footer: Footer,
};

export default function Home() {
  const { config } = useStore();
  
  const homePage = config.pages.find(p => p.slug === 'home') || config.pages[0];

  return (
    <main className="min-h-screen bg-background">
      {homePage?.sections.filter(s => s.visible).map(section => {
        const Component = COMPONENT_MAP[section.type] as React.FC<{ pageId?: string }>;
        return Component ? <Component key={section.id} pageId={homePage.id} /> : null;
      })}
    </main>
  );
}
