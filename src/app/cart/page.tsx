"use client";

import { useCart } from '@/context/CartContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { Minus, Plus, X } from 'lucide-react';

export default function CartPage() {
  const { items, updateQuantity, removeItem, cartTotal } = useCart();

  return (
    <main className="min-h-screen bg-background text-foreground flex flex-col justify-between">
      <Navbar />
      
      <div className="flex-1 mt-[88px] max-w-7xl mx-auto w-full px-6 lg:px-12 py-12 lg:py-24">
        <h1 className="font-display text-3xl md:text-4xl font-black uppercase tracking-tight mb-8 border-b border-foreground/10 pb-4">
          Your Cart
        </h1>

        {items.length === 0 ? (
          <div className="py-24 text-center max-w-md mx-auto">
            <span className="font-display text-4xl md:text-6xl font-black text-foreground/10 uppercase tracking-tighter block leading-none mb-6">EMPTY</span>
            <p className="font-bold text-sm tracking-widest uppercase text-foreground/50 mb-10">Nothing to see here.</p>
            <Link href="/shop" className="inline-block bg-foreground text-background font-bold text-sm tracking-widest uppercase px-8 py-4 hover:bg-foreground/90 transition-colors">
              VIEW COLLECTION
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-24">
            {/* Cart Items */}
            <div className="flex-1">
              <div className="hidden md:grid grid-cols-12 gap-4 border-b border-foreground/10 pb-4 mb-6 font-bold uppercase tracking-widest text-xs text-foreground/50">
                <div className="col-span-6">Gear</div>
                <div className="col-span-3 text-center">Quantity</div>
                <div className="col-span-2 text-right">Total</div>
                <div className="col-span-1"></div>
              </div>

              <div className="space-y-6">
                {items.map(item => (
                  <div key={`${item.id}-${item.size}`} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center border-b border-foreground/10 pb-6 last:border-none">
                    <div className="col-span-1 md:col-span-6 flex gap-6 items-center">
                      <Link href={`/product/${item.id}`} className="w-20 h-24 bg-secondary flex items-center justify-center flex-shrink-0 group overflow-hidden">
                        <span className="font-display text-2xl font-black text-foreground/20 group-hover:text-foreground/40 uppercase tracking-tighter break-words text-center leading-none transition-colors duration-300">
                          {item.name.substring(0, 3)}
                        </span>
                      </Link>
                      <div>
                        <h3 className="font-bold uppercase tracking-tight text-base mb-1">
                          <Link href={`/product/${item.id}`} className="hover:opacity-50 transition-opacity">
                            {item.name}
                          </Link>
                        </h3>
                        <p className="text-foreground/60 font-bold tracking-widest uppercase text-xs">Size: {item.size}</p>
                        <p className="font-bold tracking-widest uppercase text-sm mt-1 md:hidden">${item.price}</p>
                      </div>
                    </div>

                    <div className="col-span-1 md:col-span-3 flex justify-between md:justify-center items-center mt-4 md:mt-0">
                      <span className="md:hidden font-bold uppercase tracking-widest text-xs text-foreground/50">Quantity</span>
                      <div className="flex items-center border border-foreground/20">
                        <button 
                          onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)}
                          className="w-8 h-8 flex items-center justify-center hover:bg-foreground hover:text-background transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus size={14} strokeWidth={2.5} />
                        </button>
                        <span className="w-10 text-center font-bold text-sm">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)}
                          className="w-8 h-8 flex items-center justify-center hover:bg-foreground hover:text-background transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus size={14} strokeWidth={2.5} />
                        </button>
                      </div>
                    </div>

                    <div className="col-span-1 md:col-span-2 flex justify-between md:justify-end items-center mt-2 md:mt-0">
                      <span className="md:hidden font-bold uppercase tracking-widest text-xs text-foreground/50">Total</span>
                      <span className="font-bold text-lg">${item.price * item.quantity}</span>
                    </div>

                    <div className="col-span-1 flex justify-end md:justify-center mt-2 md:mt-0">
                      <button 
                        onClick={() => removeItem(item.id, item.size)}
                        className="text-foreground/40 hover:text-foreground transition-colors p-2 flex items-center justify-center"
                        aria-label="Remove item"
                      >
                        <X size={18} strokeWidth={2.5} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Summary Block */}
            <div className="w-full lg:w-[320px]">
              <div className="bg-foreground text-background p-8 sticky top-32">
                <h2 className="font-display text-2xl font-black uppercase tracking-tight mb-6 border-b border-background/20 pb-4">
                  Summary
                </h2>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between font-bold uppercase tracking-widest text-xs">
                    <span>Subtotal</span>
                    <span>${cartTotal}</span>
                  </div>
                  <div className="flex justify-between font-bold uppercase tracking-widest text-xs text-background/60">
                    <span>Shipping</span>
                    <span>Free</span>
                  </div>
                </div>

                <div className="border-t border-background/20 pt-6 mb-8">
                  <div className="flex justify-between items-end">
                    <span className="font-bold uppercase tracking-widest text-sm">Total</span>
                    <span className="font-display text-3xl font-black tracking-tight leading-none">${cartTotal}</span>
                  </div>
                </div>

                <Link 
                  href="/checkout"
                  className="block text-center w-full bg-background text-foreground font-bold text-sm tracking-widest uppercase py-4 hover:bg-background/90 transition-colors shadow-sm"
                >
                  Checkout
                </Link>
                <div className="mt-4 text-center">
                  <Link href="/shop" className="font-bold text-xs tracking-widest uppercase text-background/50 hover:text-background transition-colors underline underline-offset-4">
                    Continue Shopping
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}
