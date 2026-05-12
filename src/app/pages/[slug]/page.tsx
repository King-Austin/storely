"use client";

import { useStore } from '@/context/StoreContext';
import { notFound, useParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import PromoMarquee from '@/components/PromoMarquee';
import ProductGrid from '@/components/ProductGrid';
import FinalCTA from '@/components/FinalCTA';
import Footer from '@/components/Footer';

const COMPONENT_MAP: Record<string, React.FC<{ pageId?: string }>> = {
  navbar: Navbar,
  hero: Hero,
  marquee: PromoMarquee,
  products: ProductGrid,
  cta: FinalCTA,
  footer: Footer,
};

export default function PublicPage() {
  const { slug } = useParams() as { slug: string };
  const { config } = useStore();

  const page = config.pages.find(p => p.slug === slug);

  if (!page) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-background">
      {page.sections.filter(s => s.visible).map(section => {
        const Component = COMPONENT_MAP[section.type];
        return Component ? <Component key={section.id} pageId={page.id} /> : null;
      })}
    </main>
  );
}
