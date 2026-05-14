"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  Home, ShoppingBag, Package, Users, 
  BarChart2, Megaphone, Tag, Layers,
  MonitorSmartphone, PlusCircle, Settings,
  Search, Bell, LogOut, ChevronDown, ChevronRight,
  CreditCard, History, Gift
} from 'lucide-react';
import { toast } from 'sonner';
import { createClient } from '@/lib/supabase/client';
import { useVendorStore } from '@/hooks/useSupabaseData';

const mainNavigation = [
  { name: 'Home', href: '/dashboard', icon: Home },
  { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart2 },
  { 
    name: 'Orders', 
    href: '/dashboard/orders', 
    icon: ShoppingBag,
    subItems: [
      { name: 'All Orders', href: '/dashboard/orders' },
      { name: 'Logistics', href: '/dashboard/orders/fulfillment' },
    ]
  },
  { 
    name: 'Products', 
    href: '/dashboard/products', 
    icon: Package,
    subItems: [
      { name: 'All Products', href: '/dashboard/products' },
      { name: 'Inventory', href: '/dashboard/inventory' },
    ]
  },
  { name: 'Customers', href: '/dashboard/customers', icon: Users },
  { 
    name: 'Marketing', 
    href: '/dashboard/marketing', 
    icon: Megaphone,
    subItems: [
      { name: 'Overview', href: '/dashboard/marketing' },
      { name: 'WhatsApp', href: '/dashboard/marketing/whatsapp' },
      { name: 'Email', href: '/dashboard/marketing/email' },
    ]
  },
  { name: 'Discounts', href: '/dashboard/discounts', icon: Tag },
  { 
    name: 'Referrals', 
    href: '/dashboard/referrals', 
    icon: Gift,
    subItems: [
      { name: 'Overview', href: '/dashboard/referrals' },
      { name: 'History', href: '/dashboard/referrals/history' },
    ]
  },
];

const salesChannels = [
  { 
    name: 'Online Store', 
    href: '/dashboard/online-store', 
    icon: MonitorSmartphone,
    subItems: [
      { name: 'Overview', href: '/dashboard/online-store' },
      { name: 'Store Builder', href: '/dashboard/online-store/store-builder' },
      { name: 'Domains', href: '/dashboard/online-store/domains' },
    ]
  },
];

const financialNavigation = [
  { 
    name: 'Withdrawals', 
    href: '/dashboard/financials/withdrawals', 
    icon: CreditCard,
    subItems: [
      { name: 'Overview', href: '/dashboard/financials/withdrawals' },
      { name: 'History', href: '/dashboard/financials/withdrawals/history' },
    ]
  },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [openMenus, setOpenMenus] = useState<string[]>([]);
  const { store, loading, refetch } = useVendorStore();

  const toggleMenu = (name: string) => {
    setOpenMenus(prev => 
      prev.includes(name) ? prev.filter(n => n !== name) : [...prev, name]
    );
  };

  useEffect(() => {
    async function checkStore() {
      if (!loading && store === null) {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          await supabase.from('storely_stores').insert({
            owner_id: user.id,
            name: 'My Store',
            slug: `store-${user.id.slice(0, 8)}`,
            currency: 'NGN',
          });
          refetch();
        }
      }
    }
    checkStore();
  }, [loading, store, refetch]);

  return (
    <div className="flex h-screen overflow-hidden bg-secondary/30">
      
      {/* Sidebar */}
      <aside className="w-64 bg-secondary/30 border-r border-foreground/5 hidden md:flex flex-col">
        {/* Sidebar Header / Logo */}
        <div className="h-14 flex items-center px-4 shrink-0">
          <Link href="/" className="font-display text-xl font-black uppercase tracking-tighter">
            Storely
          </Link>
        </div>

        {/* Sidebar Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-8 custom-scrollbar">
          
          {/* Main Nav */}
          <nav className="space-y-1">
            {mainNavigation.map((item) => {
              const isActive = pathname === item.href;
              const hasSubItems = item.subItems && item.subItems.length > 0;
              const isOpen = openMenus.includes(item.name);

              return (
                <div key={item.name} className="space-y-1">
                  {hasSubItems ? (
                    <button
                      onClick={() => toggleMenu(item.name)}
                      className={`w-full flex items-center justify-between px-3 py-1.5 text-sm font-bold tracking-wide transition-colors ${
                        isActive || pathname.startsWith(item.href)
                          ? 'bg-background text-foreground shadow-sm' 
                          : 'text-foreground/70 hover:bg-black/5'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <item.icon size={18} className={isActive ? 'text-foreground' : 'text-foreground/50'} strokeWidth={2.5} />
                        {item.name}
                      </div>
                      {isOpen ? <ChevronDown size={14} className="text-foreground/40" /> : <ChevronRight size={14} className="text-foreground/40" />}
                    </button>
                  ) : (
                    <Link
                      href={item.href}
                      className={`flex items-center gap-3 px-3 py-1.5 text-sm font-bold tracking-wide transition-colors ${
                        isActive 
                          ? 'bg-background text-foreground shadow-sm' 
                          : 'text-foreground/70 hover:bg-black/5'
                      }`}
                    >
                      <item.icon size={18} className={isActive ? 'text-foreground' : 'text-foreground/50'} strokeWidth={2.5} />
                      {item.name}
                    </Link>
                  )}

                  {/* Sub Items Dropdown */}
                  {hasSubItems && isOpen && (
                    <div className="ml-9 space-y-1 animate-in slide-in-from-top-1 duration-200">
                      {item.subItems?.map((sub) => {
                        const isSubActive = pathname === sub.href;
                        return (
                          <Link
                            key={sub.name}
                            href={sub.href}
                            className={`block px-3 py-1.5 text-[11px] font-bold uppercase tracking-widest transition-colors ${
                              isSubActive 
                                ? 'text-foreground' 
                                : 'text-foreground/40 hover:text-foreground/70'
                            }`}
                          >
                            {sub.name}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {/* Sales Channels */}
          <div>
            <div className="flex justify-between items-center px-3 mb-2">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-foreground/40">Sales channels</h3>
              <button className="text-foreground/40 hover:text-foreground"><PlusCircle size={14} /></button>
            </div>
            <nav className="space-y-1">
              {salesChannels.map((item) => {
                const isActive = pathname === item.href;
                const hasSubItems = item.subItems && item.subItems.length > 0;
                const isOpen = openMenus.includes(item.name);

                return (
                  <div key={item.name} className="space-y-1">
                    {hasSubItems ? (
                      <button
                        onClick={() => toggleMenu(item.name)}
                        className={`w-full flex items-center justify-between px-3 py-1.5 text-sm font-bold tracking-wide transition-colors ${
                          isActive || pathname.startsWith(item.href)
                            ? 'bg-background text-foreground shadow-sm' 
                            : 'text-foreground/70 hover:bg-black/5'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <item.icon size={18} className={isActive ? 'text-foreground' : 'text-foreground/50'} strokeWidth={2.5} />
                          {item.name}
                        </div>
                        {isOpen ? <ChevronDown size={14} className="text-foreground/40" /> : <ChevronRight size={14} className="text-foreground/40" />}
                      </button>
                    ) : (
                      <Link
                        href={item.href}
                        className={`flex items-center gap-3 px-3 py-1.5 text-sm font-bold tracking-wide transition-colors ${
                          isActive 
                            ? 'bg-background text-foreground shadow-sm' 
                            : 'text-foreground/70 hover:bg-black/5'
                        }`}
                      >
                        <item.icon size={18} className={isActive ? 'text-foreground' : 'text-foreground/50'} strokeWidth={2.5} />
                        {item.name}
                      </Link>
                    )}

                    {/* Sub Items Dropdown */}
                    {hasSubItems && isOpen && (
                      <div className="ml-9 space-y-1 animate-in slide-in-from-top-1 duration-200">
                        {item.subItems?.map((sub) => {
                          const isSubActive = pathname === sub.href;
                          return (
                            <Link
                              key={sub.name}
                              href={sub.href}
                              className={`block px-3 py-1.5 text-[11px] font-bold uppercase tracking-widest transition-colors ${
                                isSubActive 
                                  ? 'text-foreground' 
                                  : 'text-foreground/40 hover:text-foreground/70'
                              }`}
                            >
                              {sub.name}
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>
          </div>

          {/* Financials */}
          <div className="mt-8">
            <div className="flex justify-between items-center px-3 mb-2">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-foreground/40">Financials</h3>
              <button className="text-foreground/40 hover:text-foreground"><PlusCircle size={14} /></button>
            </div>
            <nav className="space-y-1">
              {financialNavigation.map((item) => {
                const isActive = pathname === item.href;
                const hasSubItems = item.subItems && item.subItems.length > 0;
                const isOpen = openMenus.includes(item.name);

                return (
                  <div key={item.name} className="space-y-1">
                    {hasSubItems ? (
                      <button
                        onClick={() => toggleMenu(item.name)}
                        className={`w-full flex items-center justify-between px-3 py-1.5 text-sm font-bold tracking-wide transition-colors ${
                          isActive || pathname.startsWith(item.href)
                            ? 'bg-background text-foreground shadow-sm' 
                            : 'text-foreground/70 hover:bg-black/5'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <item.icon size={18} className={isActive ? 'text-foreground' : 'text-foreground/50'} strokeWidth={2.5} />
                          {item.name}
                        </div>
                        {isOpen ? <ChevronDown size={14} className="text-foreground/40" /> : <ChevronRight size={14} className="text-foreground/40" />}
                      </button>
                    ) : (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={`flex items-center gap-3 px-3 py-1.5 text-sm font-bold tracking-wide transition-colors ${
                          isActive 
                            ? 'bg-background text-foreground shadow-sm' 
                            : 'text-foreground/70 hover:bg-black/5'
                        }`}
                      >
                        <item.icon size={18} className={isActive ? 'text-foreground' : 'text-foreground/50'} strokeWidth={2.5} />
                        {item.name}
                      </Link>
                    )}

                    {/* Sub Items Dropdown */}
                    {hasSubItems && isOpen && (
                      <div className="ml-9 space-y-1 animate-in slide-in-from-top-1 duration-200">
                        {item.subItems?.map((sub) => {
                          const isSubActive = pathname === sub.href;
                          return (
                            <Link
                              key={sub.name}
                              href={sub.href}
                              className={`block px-3 py-1.5 text-[11px] font-bold uppercase tracking-widest transition-colors ${
                                isSubActive 
                                  ? 'text-foreground' 
                                  : 'text-foreground/40 hover:text-foreground/70'
                              }`}
                            >
                              {sub.name}
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>
          </div>
          </div>

        {/* Sidebar Footer */}
        <div className="p-3 shrink-0 flex flex-col gap-1">
          <button className="w-full flex items-center gap-3 px-3 py-2 text-sm font-bold tracking-wide text-foreground/70 hover:bg-black/5 transition-colors">
            <Settings size={18} className="text-foreground/50" strokeWidth={2.5} />
            Settings
          </button>
          <button 
            onClick={async () => {
              const supabase = createClient();
              await supabase.auth.signOut();
              router.push('/login');
            }} 
            className="w-full flex items-center gap-3 px-3 py-2 text-sm font-bold tracking-wide text-foreground/70 hover:bg-black/5 hover:text-foreground transition-colors"
          >
            <LogOut size={18} className="text-foreground/50" strokeWidth={2.5} />
            Log Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* Top Navbar */}
        <header className="h-14 bg-[#1a1a1a] text-white flex items-center justify-between px-4 shrink-0">
          <div className="flex-1 flex items-center gap-4">
            {/* Mobile menu button could go here */}
          </div>

          <div className="flex-1 flex justify-center max-w-xl">
            <div className="relative w-full">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50" />
              <input 
                type="text" 
                placeholder="Search" 
                onClick={() => toast('Global Search initialized (⌘ K)')}
                className="w-full bg-white/10 hover:bg-white/20 border border-white/10 rounded-md py-1.5 pl-9 pr-12 text-sm font-medium text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all cursor-text"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                <kbd className="hidden sm:inline-block border border-white/20 rounded px-1.5 text-[10px] font-bold text-white/50 bg-white/5">⌘</kbd>
                <kbd className="hidden sm:inline-block border border-white/20 rounded px-1.5 text-[10px] font-bold text-white/50 bg-white/5">K</kbd>
              </div>
            </div>
          </div>

          <div className="flex-1 flex items-center justify-end gap-3">
            <button onClick={() => toast('0 New Notifications')} className="p-1.5 text-white/70 hover:text-white hover:bg-white/10 rounded-md transition-colors relative">
              <Bell size={18} />
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border border-[#1a1a1a]"></span>
            </button>
            <button onClick={() => toast('Store Switcher opened. Active: My Store')} className="flex items-center gap-2 bg-[#2a2a2a] hover:bg-[#3a3a3a] px-2 py-1 rounded-md transition-colors border border-white/10">
              <span className="text-xs font-bold shrink-0">My Store</span>
              <div className="w-5 h-5 rounded-sm bg-green-500 flex items-center justify-center text-[10px] font-black text-black">
                MS
              </div>
            </button>
          </div>
        </header>

        {/* Scrollable Dashboard View */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>

    </div>
  );
}
