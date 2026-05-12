"use client";

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductGrid from '@/components/ProductGrid';

export default function ShopPage() {
  return (
    <main className="min-h-screen bg-background text-foreground flex flex-col justify-between">
      <Navbar />
      
      <div className="flex-1 mt-[88px] border-t-[8px] border-foreground pt-12">
        <ProductGrid title="THE COLLECTION." showShopAllLink={false} />
      </div>

      <Footer />
    </main>
  );
}
