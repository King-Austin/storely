"use client";

import { useState } from 'react';
import { 
  TrendingUp, Users, ShoppingBag, Target,
  Plus, ArrowRight, MousePointer2, Mail,
  MessageSquare, ChevronRight, BarChart3
} from 'lucide-react';

export default function MarketingPage() {
  return (
    <div className="p-6 lg:p-10 space-y-10">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black uppercase tracking-tight">Marketing</h1>
          <p className="text-xs font-bold text-foreground/40 uppercase tracking-widest mt-1">Campaign Command Center</p>
        </div>
        <button className="px-4 py-2 bg-foreground text-background hover:bg-foreground/90 text-xs font-black uppercase tracking-widest transition-all shadow-sm">
          Create Campaign
        </button>
      </div>

      {/* Marketing KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-0 border border-foreground/10 divide-x divide-foreground/10 bg-white dark:bg-black/20">
        <div className="p-6 space-y-2">
          <h3 className="text-[10px] font-black uppercase tracking-widest text-foreground/40">Marketing Sales</h3>
          <div className="flex items-end gap-2">
            <span className="text-2xl font-black">$42,500.00</span>
            <span className="text-[10px] font-bold text-green-500 flex items-center mb-1">
              +24%
            </span>
          </div>
        </div>
        <div className="p-6 space-y-2">
          <h3 className="text-[10px] font-black uppercase tracking-widest text-foreground/40">Conversions</h3>
          <span className="text-2xl font-black">3.8%</span>
        </div>
        <div className="p-6 space-y-2">
          <h3 className="text-[10px] font-black uppercase tracking-widest text-foreground/40">Total Reach</h3>
          <span className="text-2xl font-black">128.4K</span>
        </div>
        <div className="p-6 space-y-2">
          <h3 className="text-[10px] font-black uppercase tracking-widest text-foreground/40">Avg. ROI</h3>
          <span className="text-2xl font-black">5.2x</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Channel Performance */}
        <div className="bg-white dark:bg-black/20 border border-foreground/10 flex flex-col">
          <div className="p-4 border-b border-foreground/10 bg-secondary/20 flex justify-between items-center">
            <h2 className="text-[10px] font-black uppercase tracking-widest">Channel Reach Attribution</h2>
            <BarChart3 size={14} className="text-foreground/40" />
          </div>
          <div className="p-6 space-y-6">
            {[
              { name: 'Email Marketing', value: '84.5K', share: '65%', icon: Mail, color: 'bg-foreground' },
              { name: 'WhatsApp Broadcast', value: '32.1K', share: '25%', icon: MessageSquare, color: 'bg-green-500' },
              { name: 'Social Ads', value: '11.8K', share: '10%', icon: Target, color: 'bg-blue-500' },
            ].map(channel => (
              <div key={channel.name} className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <channel.icon size={14} className="text-foreground/40" />
                    <span className="text-xs font-black uppercase">{channel.name}</span>
                  </div>
                  <span className="text-xs font-bold uppercase tracking-tighter">{channel.value} Reach</span>
                </div>
                <div className="h-1.5 bg-secondary overflow-hidden">
                  <div className={`${channel.color} h-full`} style={{ width: channel.share }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions / Integration Status */}
        <div className="space-y-4">
           <div className="bg-green-50 border border-green-200 p-6 flex items-start gap-4">
              <div className="p-2 bg-green-500 text-white">
                 <MessageSquare size={18} />
              </div>
              <div className="flex-1">
                 <h3 className="text-[10px] font-black uppercase tracking-widest text-green-900 mb-1">WhatsApp Connected</h3>
                 <p className="text-[10px] font-bold text-green-700 uppercase tracking-wide leading-tight">Your account is active. 12 automated flows running.</p>
              </div>
              <ChevronRight size={16} className="text-green-400 mt-1" />
           </div>

           <div className="bg-white dark:bg-black/20 border border-foreground/10 p-6 flex items-start gap-4">
              <div className="p-2 bg-foreground text-background">
                 <Mail size={18} />
              </div>
              <div className="flex-1">
                 <h3 className="text-[10px] font-black uppercase tracking-widest mb-1">Email Health</h3>
                 <p className="text-[10px] font-bold text-foreground/40 uppercase tracking-wide leading-tight">Sender reputation: High. 99.2% deliverability.</p>
              </div>
              <ChevronRight size={16} className="text-foreground/20 mt-1" />
           </div>

           <button className="w-full bg-secondary hover:bg-black/5 border border-foreground/5 p-8 flex items-center justify-between group transition-colors">
              <div className="flex items-center gap-4 text-left">
                <Plus size={24} className="text-foreground/20 group-hover:text-foreground transition-colors" />
                <div>
                   <h3 className="text-sm font-black uppercase tracking-tight">New Campaign Drop</h3>
                   <p className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest">Initialize a technical drop across all channels</p>
                </div>
              </div>
              <ArrowRight size={20} className="text-foreground/10 group-hover:text-foreground transition-all group-hover:translate-x-1" />
           </button>
        </div>

      </div>
    </div>
  );
}
