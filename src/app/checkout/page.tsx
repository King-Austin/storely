"use client";

import { useCart } from '@/context/CartContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { useState } from 'react';

export default function CheckoutPage() {
  const { items, cartTotal, clearCart } = useCart();
  const [orderPlaced, setOrderPlaced] = useState(false);

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    clearCart();
    setOrderPlaced(true);
  };

  if (orderPlaced) {
    return (
      <main className="min-h-screen bg-background text-foreground flex flex-col justify-between">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center p-8 mt-24 text-center max-w-lg mx-auto">
          <h1 className="font-display text-4xl md:text-5xl font-black uppercase tracking-tight leading-none mb-4">Order Confirmed</h1>
          <p className="font-bold text-sm mb-10 uppercase tracking-widest text-muted-foreground">Your gear is on the way.</p>
          <Link href="/" className="inline-block bg-foreground text-background font-bold text-sm tracking-widest uppercase px-8 py-4 rounded-full hover:bg-foreground/90 transition-colors shadow-sm">
            Return to Store
          </Link>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background text-foreground flex flex-col justify-between">
      <Navbar />
      
      <div className="flex-1 mt-[88px] max-w-7xl mx-auto w-full px-6 lg:px-12 py-12 lg:py-24">
        <h1 className="font-display text-3xl md:text-4xl font-black uppercase tracking-tight mb-8 border-b border-foreground/10 pb-4">
          Checkout
        </h1>

        {items.length === 0 ? (
          <div className="py-24 text-center max-w-md mx-auto">
            <span className="font-display text-4xl md:text-6xl font-black text-foreground/10 uppercase tracking-tighter block leading-none mb-6">EMPTY</span>
            <p className="font-bold text-sm tracking-widest uppercase text-foreground/50 mb-10">Cart is empty.</p>
            <Link href="/" className="inline-block bg-foreground text-background font-bold text-sm tracking-widest uppercase px-8 py-4 rounded-full hover:bg-foreground/90 transition-colors">
              Return Home
            </Link>
          </div>
        ) : (
          <div className="flex flex-col-reverse lg:flex-row gap-12 lg:gap-24">
            {/* Form Section */}
            <div className="flex-1">
              <form onSubmit={handlePlaceOrder} className="space-y-10">
                <section>
                  <h2 className="font-bold text-sm uppercase tracking-widest border-b border-foreground/10 pb-3 mb-6">1. Shipping</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input type="text" placeholder="FIRST NAME" required className="w-full bg-secondary border border-foreground/10 py-3 px-4 font-bold text-xs uppercase tracking-widest placeholder:text-foreground/40 focus:outline-none focus:border-foreground/40 transition-colors" />
                    <input type="text" placeholder="LAST NAME" required className="w-full bg-secondary border border-foreground/10 py-3 px-4 font-bold text-xs uppercase tracking-widest placeholder:text-foreground/40 focus:outline-none focus:border-foreground/40 transition-colors" />
                    <input type="text" placeholder="ADDRESS" required className="col-span-1 md:col-span-2 w-full bg-secondary border border-foreground/10 py-3 px-4 font-bold text-xs uppercase tracking-widest placeholder:text-foreground/40 focus:outline-none focus:border-foreground/40 transition-colors" />
                    <input type="text" placeholder="CITY" required className="w-full bg-secondary border border-foreground/10 py-3 px-4 font-bold text-xs uppercase tracking-widest placeholder:text-foreground/40 focus:outline-none focus:border-foreground/40 transition-colors" />
                    <input type="text" placeholder="ZIP CODE" required className="w-full bg-secondary border border-foreground/10 py-3 px-4 font-bold text-xs uppercase tracking-widest placeholder:text-foreground/40 focus:outline-none focus:border-foreground/40 transition-colors" />
                  </div>
                </section>

                <section>
                  <h2 className="font-bold text-sm uppercase tracking-widest border-b border-foreground/10 pb-3 mb-6">2. Payment</h2>
                  <div className="grid grid-cols-1 gap-4">
                    <input type="text" placeholder="CARD NUMBER" required className="w-full bg-secondary border border-foreground/10 py-3 px-4 font-bold text-xs uppercase tracking-widest placeholder:text-foreground/40 focus:outline-none focus:border-foreground/40 transition-colors" />
                    <div className="grid grid-cols-2 gap-4">
                      <input type="text" placeholder="MM/YY" required className="w-full bg-secondary border border-foreground/10 py-3 px-4 font-bold text-xs uppercase tracking-widest placeholder:text-foreground/40 focus:outline-none focus:border-foreground/40 transition-colors" />
                      <input type="text" placeholder="CVC" required className="w-full bg-secondary border border-foreground/10 py-3 px-4 font-bold text-xs uppercase tracking-widest placeholder:text-foreground/40 focus:outline-none focus:border-foreground/40 transition-colors" />
                    </div>
                  </div>
                </section>

                <button type="submit" className="w-full bg-foreground text-background font-bold text-sm tracking-widest uppercase py-4 hover:bg-foreground/90 transition-all">
                  Place Order
                </button>
              </form>
            </div>

            {/* Summary Section */}
            <div className="w-full lg:w-[320px]">
              <div className="bg-secondary p-8 sticky top-32 border border-foreground/10">
                <h2 className="font-display text-2xl font-black uppercase tracking-tight mb-6 border-b border-foreground/10 pb-4">
                  Summary
                </h2>
                
                <div className="space-y-4 mb-6 max-h-[30vh] overflow-y-auto pr-2 custom-scrollbar">
                  {items.map(item => (
                    <div key={`${item.id}-${item.size}`} className="flex justify-between items-start">
                      <div className="pr-4">
                        <h3 className="font-bold uppercase tracking-tight text-sm leading-none mb-1">{item.name}</h3>
                        <p className="text-foreground/60 font-bold tracking-widest uppercase text-[10px]">Size: {item.size} • Qty: {item.quantity}</p>
                      </div>
                      <span className="font-bold text-sm">${item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-foreground/10 pt-6 space-y-4 mb-8">
                  <div className="flex justify-between font-bold uppercase tracking-widest text-xs">
                    <span>Subtotal</span>
                    <span>${cartTotal}</span>
                  </div>
                  <div className="flex justify-between font-bold uppercase tracking-widest text-xs text-foreground/50">
                    <span>Shipping</span>
                    <span>FREE</span>
                  </div>
                </div>

                <div className="flex justify-between items-end border-t border-foreground/10 pt-4">
                  <span className="font-bold uppercase tracking-widest text-sm">Total</span>
                  <span className="font-display text-3xl font-black tracking-tight leading-none">${cartTotal}</span>
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
