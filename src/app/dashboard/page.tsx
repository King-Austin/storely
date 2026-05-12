"use client";

import { useState } from 'react';
import { ChevronUp, ChevronDown, CheckCircle2, ChevronRight, X } from 'lucide-react';

const setupSteps = [
  { id: 'products', title: 'Add products', completed: false, openByDefault: true },
  { id: 'digital', title: 'Manage your digital products', completed: false },
  { id: 'store', title: 'Set up your online store', completed: false },
  { id: 'settings', title: 'Store settings', completed: false },
  { id: 'launch', title: 'Launch your online store', completed: false },
];

export default function DashboardPage() {
  const [openStep, setOpenStep] = useState<string | null>('products');
  const [showBanner, setShowBanner] = useState(true);

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto pb-24">
      
      {/* Promo Banner */}
      {showBanner && (
        <div className="bg-[#1a1a1a] text-white rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 shadow-sm relative">
          <p className="font-bold text-sm tracking-wide mb-3 sm:mb-0 pr-8">
            Extend your trial for $1/month for 3 months on select plans.
          </p>
          <div className="flex items-center gap-4 shrink-0">
            <button className="bg-white text-black font-black text-xs uppercase tracking-widest px-4 py-2 rounded-full hover:bg-gray-200 transition-colors">
              Select a plan
            </button>
            <button 
              onClick={() => setShowBanner(false)}
              className="text-white/50 hover:text-white transition-colors p-1 absolute top-2 right-2 sm:static"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-2xl font-black uppercase tracking-tight mb-2">
          Get ready to sell
        </h1>
        <p className="text-sm font-bold text-foreground/60">
          Based on what you've told us, here's a guide to get started. As your business grows, you'll get fresh tips and insights here.
        </p>
      </div>

      {/* Setup Guide Card */}
      <div className="bg-background rounded-2xl border border-foreground/10 shadow-sm overflow-hidden mb-12">
        {/* Card Header */}
        <div className="p-6 pb-4 cursor-pointer hover:bg-black/5 transition-colors" onClick={() => setOpenStep(openStep ? null : 'products')}>
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="font-bold text-sm uppercase tracking-widest mb-1">Setup guide</h2>
              <p className="text-xs font-bold text-foreground/50">Use this personalized guide to get your store up and running.</p>
            </div>
            {openStep ? <ChevronUp size={20} className="text-foreground/40" /> : <ChevronDown size={20} className="text-foreground/40" />}
          </div>
          
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-black uppercase tracking-widest text-foreground/50">0 / 11 completed</span>
            <div className="flex-1 h-1 bg-secondary rounded-full overflow-hidden max-w-[120px]">
              <div className="h-full bg-foreground w-12 rounded-full hidden"></div>
            </div>
          </div>
        </div>

        {/* Steps Accordion */}
        {openStep && (
          <div className="border-t border-foreground/5">
            {setupSteps.map((step) => {
              const isOpen = openStep === step.id;
              
              return (
                <div key={step.id} className="border-b border-foreground/5 last:border-none">
                  {/* Step Header */}
                  <div 
                    className={`flex items-start gap-4 p-4 pl-6 cursor-pointer hover:bg-black/5 transition-colors ${isOpen ? 'bg-secondary/20' : ''}`}
                    onClick={() => setOpenStep(isOpen ? null : step.id)}
                  >
                    <div className="mt-0.5">
                      <div className="w-6 h-6 rounded-full border-2 border-dashed border-foreground/30 flex items-center justify-center">
                        {/* Placeholder for dotted circle when incomplete */}
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center">
                        <h3 className="font-bold text-sm">{step.title}</h3>
                      </div>
                      
                      {/* Expanded Content */}
                      {isOpen && step.id === 'products' && (
                        <div className="mt-4 flex flex-col md:flex-row gap-8 pb-4">
                          <div className="flex-1">
                            <p className="text-sm font-bold text-foreground/70 mb-6 leading-relaxed">
                              Write a description, add photos, and set pricing for the products you plan to sell. <a href="#" className="text-blue-600 hover:underline">Learn more</a>
                            </p>
                            <div className="flex flex-wrap items-center gap-4">
                              <button className="bg-foreground text-background font-bold text-xs uppercase tracking-widest px-5 py-2.5 rounded-full hover:bg-foreground/80 transition-colors shadow-sm">
                                Add product
                              </button>
                              <button className="text-xs font-bold text-foreground/60 hover:text-foreground transition-colors">
                                Import products
                              </button>
                            </div>
                          </div>
                          <div className="hidden md:flex w-48 h-32 bg-secondary rounded-xl items-center justify-center p-4 border border-foreground/5">
                            {/* wireframe geometric representation of products */}
                            <div className="grid grid-cols-2 gap-2 w-full h-full">
                              <div className="bg-foreground/10 rounded-md row-span-2"></div>
                              <div className="bg-foreground/20 rounded-md"></div>
                              <div className="bg-foreground/5 rounded-md flex items-center justify-center">
                                <div className="w-1/2 h-1/2 rounded-full border-2 border-foreground/20"></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Divider */}
      <div className="flex items-center justify-center gap-4 mb-12">
        <div className="h-px bg-foreground/10 flex-1"></div>
        <div className="flex items-center gap-2 text-foreground/40">
          <CheckCircle2 size={16} />
          <span className="text-[10px] font-bold uppercase tracking-widest">All caught up</span>
        </div>
        <div className="h-px bg-foreground/10 flex-1"></div>
      </div>

      {/* Discover Block */}
      <div className="bg-background rounded-2xl border border-foreground/10 shadow-sm p-6 lg:p-8 flex flex-col md:flex-row gap-8">
        <div className="flex-1">
          <h2 className="font-display text-xl font-black uppercase tracking-tight mb-2">Discover more of Storely</h2>
          <p className="text-sm font-bold text-foreground/60 mb-6">
            Browse features, apps, and sales channels to grow your business
          </p>
          <button className="bg-secondary text-foreground font-bold text-xs uppercase tracking-widest px-5 py-2.5 rounded-full hover:bg-secondary/80 transition-colors border border-foreground/10">
            Explore now
          </button>
        </div>
        <div className="hidden md:block w-1/3 bg-secondary rounded-xl min-h-[120px] relative overflow-hidden">
             {/* Diagonal stripes wireframe decoration */}
             <div className="absolute inset-0 opacity-20">
              <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="stripes" width="10" height="10" patternTransform="rotate(45)">
                    <line x1="0" y1="0" x2="0" y2="10" stroke="currentColor" strokeWidth="2" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#stripes)" />
              </svg>
            </div>
        </div>
      </div>

    </div>
  );
}
