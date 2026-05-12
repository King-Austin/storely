"use client";

import { motion } from 'framer-motion';
import { products } from '@/data/products';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';
import { useStore } from '@/context/StoreContext';

interface ProductGridProps {
  title?: string;
  showShopAllLink?: boolean;
  pageId?: string;
}

const ProductGrid = ({ title, showShopAllLink = true, pageId }: ProductGridProps) => {
  const { config } = useStore();
  const activePage = config.pages.find(p => p.id === (pageId || config.activePageId)) || config.pages[0]; const section = activePage.sections.find(s => s.type === 'products');
  const s = section?.settings || {};
  
  const displayTitle = title || s.heading || "Trending Now";

  const { addItem } = useCart();
  const router = useRouter();

  const handleAddToCart = (e: React.MouseEvent, product: any) => {
    e.preventDefault(); 
    addItem({
      id: product.id,
      name: product.name,
      price: product.numericPrice,
      size: '10', // Default size for grid add
      quantity: 1
    });
  };

  const handleBuyNow = (e: React.MouseEvent, product: any) => {
    e.preventDefault();
    addItem({
      id: product.id,
      name: product.name,
      price: product.numericPrice,
      size: '10', // Default size for grid add
      quantity: 1
    });
    router.push('/checkout');
  };

  return (
    <section id="shop" className="py-24 bg-background text-foreground">
      <div className="container-custom">
        <div className="flex justify-between items-end mb-12">
          <h2 className="font-display text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none">
            {displayTitle}
          </h2>
          {showShopAllLink && (
            <Link href="/shop" className="font-black text-sm tracking-widest uppercase border-b-[3px] border-foreground pb-1 hover:text-foreground/50 transition-colors">
              Shop All
            </Link>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link href={`/product/${product.id}`} className="group cursor-pointer flex flex-col h-full">
                {/* Wireframe/Block Image Placeholder */}
                <div className="aspect-[4/5] w-full bg-secondary rounded-2xl relative overflow-hidden mb-4 flex items-center justify-center p-8 text-center group-hover:bg-foreground transition-colors duration-500">
                  <span className="font-display text-5xl font-black text-foreground/10 group-hover:text-background/10 transition-colors uppercase break-words leading-[0.8] tracking-tighter">
                    {product.name}
                  </span>
                  
                  {product.tag && (
                    <div className="absolute top-4 left-4 bg-foreground rounded-full text-background group-hover:bg-background group-hover:text-foreground text-[10px] font-black px-4 py-1.5 uppercase tracking-widest transition-colors">
                      {product.tag}
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="flex flex-col flex-1 px-1">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex flex-col">
                      <h3 className="font-black text-xl uppercase tracking-tighter">{product.name}</h3>
                      <span className="text-muted-foreground font-black text-sm tracking-widest uppercase">{product.cat}</span>
                    </div>
                    <span className="font-black text-xl">{product.price}</span>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex gap-3 mt-auto pt-2">
                    <button 
                      onClick={(e) => handleBuyNow(e, product)}
                      className="flex-1 rounded-full bg-foreground text-background font-black text-xs tracking-widest uppercase py-3 hover:bg-foreground/90 transition-colors shadow-sm cursor-pointer"
                    >
                      Buy Now
                    </button>
                    <button 
                      onClick={(e) => handleAddToCart(e, product)}
                      className="flex-1 rounded-full bg-background text-foreground border-2 border-foreground font-black text-xs tracking-widest uppercase py-3 hover:bg-secondary transition-colors cursor-pointer"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductGrid;
