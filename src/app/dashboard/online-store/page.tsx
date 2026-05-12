"use client";

import Link from 'next/link';
import { MonitorSmartphone, Paintbrush, FileText, Layers, ExternalLink, ArrowRight } from 'lucide-react';

const features = [
  {
    id: 'store-builder',
    title: 'Store Builder',
    description: 'Customize your storefront in real time — edit text, sections, images, and layout with a live preview.',
    href: '/dashboard/online-store/store-builder',
    icon: Paintbrush,
    badge: 'Live Editor',
    badgeColor: 'bg-green-100 text-green-700',
    cta: 'Open Builder',
  },
  {
    id: 'pages',
    title: 'Pages',
    description: 'Create and manage static pages like About Us, Contact, and Policies for your online store.',
    href: '/dashboard/online-store/pages',
    icon: FileText,
    badge: 'Active',
    badgeColor: 'bg-green-100 text-green-700',
    cta: 'Manage Pages',
  },
  {
    id: 'themes',
    title: 'Themes',
    description: 'Browse and switch between curated themes to give your store a completely new look instantly.',
    href: '#',
    icon: Layers,
    badge: 'Coming Soon',
    badgeColor: 'bg-yellow-100 text-yellow-700',
    cta: 'Browse Themes',
  },
];

export default function OnlineStorePage() {
  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto pb-24">

      {/* Header */}
      <div className="mb-10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-xl bg-foreground flex items-center justify-center">
              <MonitorSmartphone size={18} className="text-background" />
            </div>
            <h1 className="font-display text-2xl font-black uppercase tracking-tight">Online Store</h1>
          </div>
          <p className="text-sm font-bold text-foreground/50">
            Manage your public storefront — design, pages, and themes.
          </p>
        </div>
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 border border-foreground/15 px-4 py-2 text-[11px] font-black uppercase tracking-widest hover:bg-secondary transition-colors shrink-0 text-foreground/60"
        >
          <ExternalLink size={13} />
          View Live Store
        </a>
      </div>

      {/* Feature Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        {features.map((feature) => {
          const Icon = feature.icon;
          const isDisabled = feature.href === '#';

          const card = (
            <div
              className={`group relative bg-background border border-foreground/10 rounded-2xl p-6 flex flex-col gap-4 shadow-sm transition-all duration-200 ${
                isDisabled ? 'opacity-60 cursor-not-allowed' : 'hover:shadow-md hover:border-foreground/25 hover:-translate-y-0.5 cursor-pointer'
              }`}
            >
              {/* Badge */}
              <div className="flex items-start justify-between">
                <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center border border-foreground/5">
                  <Icon size={20} className="text-foreground/70" />
                </div>
                <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full ${feature.badgeColor}`}>
                  {feature.badge}
                </span>
              </div>

              {/* Content */}
              <div className="flex-1 space-y-1.5">
                <h2 className="font-bold text-sm uppercase tracking-widest">{feature.title}</h2>
                <p className="text-xs font-bold text-foreground/50 leading-relaxed">{feature.description}</p>
              </div>

              {/* CTA */}
              <div className={`flex items-center gap-1.5 text-[11px] font-black uppercase tracking-widest transition-colors ${
                isDisabled ? 'text-foreground/30' : 'text-foreground/60 group-hover:text-foreground'
              }`}>
                {feature.cta}
                <ArrowRight size={12} className={`transition-transform ${isDisabled ? '' : 'group-hover:translate-x-1'}`} />
              </div>
            </div>
          );

          return isDisabled ? (
            <div key={feature.id}>{card}</div>
          ) : (
            <Link key={feature.id} href={feature.href} className="block">
              {card}
            </Link>
          );
        })}
      </div>

      {/* Status Banner */}
      <div className="mt-8 bg-foreground text-background rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <p className="font-black text-sm uppercase tracking-widest mb-1">Your store is live</p>
          <p className="text-xs font-bold text-background/60">Customers can visit and browse your products right now.</p>
        </div>
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 bg-background text-foreground px-5 py-2.5 text-[11px] font-black uppercase tracking-widest hover:bg-background/90 transition-colors rounded-full"
        >
          Open Store
        </a>
      </div>

    </div>
  );
}
