"use client";

import { useState } from 'react';
import { notFound, useParams, useRouter } from 'next/navigation';
import { products } from '@/data/products';
import { useCart } from '@/context/CartContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';

export default function ProductPage() {
  const params = useParams();
  const id = params.id as string;
  const product = products.find(p => p.id === id);
  const { addItem } = useCart();
  const router = useRouter();
  const [selectedSize, setSelectedSize] = useState('10');

  if (!product) {
    return <div className="h-screen flex items-center justify-center font-display text-2xl font-black uppercase">Product Not Found</div>;
  }

  const relatedProducts = products.filter(p => p.id !== id).slice(0, 4);

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.numericPrice,
      size: selectedSize,
      quantity: 1
    });
  };

  const handleBuyNow = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.numericPrice,
      size: selectedSize,
      quantity: 1
    });
    router.push('/checkout');
  };

  const sizes = ['7', '8', '9', '10', '11', '12'];

  return (
    <main className="min-h-screen bg-background text-foreground flex flex-col justify-between">
      <Navbar />
      
      <div className="flex-1 mt-[88px] pb-24 border-t border-foreground/10">
        <div className="flex flex-col lg:flex-row max-w-7xl mx-auto px-6 lg:px-12 pt-12 lg:pt-24 gap-12 lg:gap-24">
          {/* Visual Container (Wireframe) */}
          <div className="w-full lg:w-1/2 aspect-square bg-secondary border border-foreground/10 flex items-center justify-center p-8 relative overflow-hidden group">
            <span className="font-display text-4xl md:text-5xl font-black text-foreground/20 uppercase break-words leading-none tracking-tight text-center transition-colors duration-500 group-hover:text-foreground">
              {product.name}
            </span>
            <div className="absolute top-6 left-6 flex gap-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">
              <span className="hover:text-foreground cursor-pointer transition-colors">Top</span>
              <span className="text-foreground border-b-2 border-foreground">Side</span>
              <span className="hover:text-foreground cursor-pointer transition-colors">Bottom</span>
            </div>
          </div>

          {/* Details Container */}
          <div className="w-full lg:w-1/2 flex flex-col justify-center max-w-md">
            {product.tag && (
              <span className="text-xs font-bold px-3 py-1.5 uppercase tracking-widest border border-foreground rounded-full inline-block w-max mb-6">
                {product.tag}
              </span>
            )}
            
            <h1 className="font-display text-3xl md:text-4xl font-black uppercase tracking-tight mb-2">
              {product.name}
            </h1>
            
            <div className="flex justify-between items-center mb-8 pb-8 border-b border-foreground/10">
              <span className="text-foreground/60 font-bold text-sm tracking-widest uppercase">{product.cat}</span>
              <span className="text-xl font-black">{product.price}</span>
            </div>
            
            <p className="font-body text-sm md:text-base font-medium mb-10 text-foreground/80 leading-relaxed">
              {product.desc}
            </p>

            <div className="mb-10">
              <div className="flex justify-between items-center mb-4">
                <span className="font-bold tracking-widest uppercase text-xs">Select Size</span>
                <span className="text-xs font-bold text-muted-foreground tracking-widest uppercase cursor-pointer hover:text-foreground transition-colors underline underline-offset-4">Size Guide</span>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {sizes.map(size => (
                  <button 
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`py-3 font-bold text-sm transition-all duration-300 border ${selectedSize === size ? 'bg-foreground text-background border-foreground shadow-md' : 'bg-transparent text-foreground border-foreground/20 hover:border-foreground'}`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full">
              <button 
                onClick={handleBuyNow}
                className="flex-1 bg-foreground text-background font-bold text-sm tracking-widest uppercase py-4 hover:bg-foreground/90 transition-colors shadow-sm"
              >
                Buy Now
              </button>
              <button 
                onClick={handleAddToCart}
                className="flex-1 bg-background text-foreground border-2 border-foreground font-bold text-sm tracking-widest uppercase py-4 hover:bg-secondary transition-colors"
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>

        {/* You May Also Like Section */}
        {relatedProducts.length > 0 && (
          <div className="max-w-7xl mx-auto px-6 lg:px-12 mt-32">
            <h2 className="font-display text-2xl font-black uppercase tracking-tight mb-10">You May Also Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {relatedProducts.map(related => (
                <Link key={related.id} href={`/product/${related.id}`} className="group block">
                  <div className="aspect-[4/5] bg-secondary border border-foreground/5 flex items-center justify-center p-6 mb-4 overflow-hidden relative group-hover:border-foreground/20 transition-colors">
                    <span className="font-display text-2xl font-black text-foreground/10 group-hover:text-foreground/30 uppercase text-center transition-colors duration-500">
                      {related.name}
                    </span>
                    {related.tag && (
                      <span className="absolute top-3 left-3 text-[10px] font-bold px-3 py-1.5 uppercase tracking-widest border border-foreground/20">
                        {related.tag}
                      </span>
                    )}
                  </div>
                  <h3 className="font-bold text-sm uppercase tracking-tight mb-1 pl-1">{related.name}</h3>
                  <p className="text-foreground/60 text-xs font-medium pl-1">{related.price}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}
