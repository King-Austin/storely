"use client";

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ShoppingBag } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import Link from 'next/link';
import { useStore } from '@/context/StoreContext';

const Navbar = ({ pageId }: { pageId?: string }) => {
  const { config } = useStore();
  const activePage = config.pages.find(p => p.id === (pageId || config.activePageId)) || config.pages[0]; const section = activePage.sections.find(s => s.type === 'navbar');
  const s = section?.settings || {};

  const navLinks = [
    { name: s.link1Label || 'New Releases', href: s.link1Href || '/#hero' },
    { name: s.link2Label || 'View All', href: s.link2Href || '/shop' },
    { name: s.link3Label || 'Log In', href: s.link3Href || '/login' },
  ];
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { cartCount } = useCart();
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleScroll = (e: any) => {
      // In iframes/portals, the scroll container might be a div, not the window
      const scrollPos = e.target.scrollTop || window.scrollY || window.pageYOffset || 0;
      setIsScrolled(scrollPos > 20);
    };

    const targetWindow = navRef.current?.ownerDocument?.defaultView || window;
    // Use capture phase (true) to catch scroll events from the inner scrollable div
    targetWindow.addEventListener('scroll', handleScroll, true);
    
    return () => targetWindow.removeEventListener('scroll', handleScroll, true);
  }, []);

  return (
    <>
      <motion.nav
        ref={navRef}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className={`sticky top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? 'bg-background/95 backdrop-blur-md shadow-sm py-4'
            : 'bg-transparent py-6'
        }`}
      >
        <div className="container-custom flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className={`font-display text-3xl font-black uppercase tracking-tighter transition-colors duration-300 ${
              isScrolled ? 'text-foreground' : 'text-foreground'
            }`}
          >
            {s.logoText || 'Storely'}
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`text-xs font-black uppercase tracking-widest transition-colors duration-300 hover:opacity-50 ${
                  isScrolled ? 'text-foreground' : 'text-foreground'
                }`}
              >
                {link.name}
              </Link>
            ))}
            <Link
              href="/cart"
              className="relative transition-colors duration-300 hover:opacity-50 text-foreground"
              aria-label="View Cart"
            >
              <ShoppingBag size={24} strokeWidth={2.5} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-foreground text-background text-[10px] font-black w-4 h-4 flex items-center justify-center rounded-full leading-none">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-6">
            <Link
              href="/cart"
              className="relative text-foreground"
              aria-label="View Cart"
            >
              <ShoppingBag size={24} strokeWidth={2.5} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-foreground text-background text-[10px] font-black w-4 h-4 flex items-center justify-center rounded-full leading-none">
                  {cartCount}
                </span>
              )}
            </Link>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`p-2 transition-colors duration-300 ${
                isScrolled ? 'text-foreground' : 'text-foreground'
              }`}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-foreground pt-24"
          >
            <div className="container-custom flex flex-col items-center justify-center h-full gap-8 py-12 relative overflow-y-auto">
              {navLinks.map((link, index) => (
                <motion.a
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="text-4xl md:text-6xl font-display font-black uppercase tracking-tighter text-background hover:text-background/50 transition-colors"
                >
                  {link.name}
                </motion.a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
