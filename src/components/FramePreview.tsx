"use client";

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useStore } from '@/context/StoreContext';

export default function FramePreview({ children, className }: { children: React.ReactNode, className?: string }) {
  const [iframeRef, setIframeRef] = useState<HTMLIFrameElement | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const { config, setActivePage } = useStore();

  useEffect(() => {
    if (!iframeRef) return;

    const doc = iframeRef.contentDocument;
    if (!doc) return;

    // Inject styles and fonts from the parent document into the iframe
    const injectStyles = () => {
      const parentStyles = Array.from(document.querySelectorAll('style, link[rel="stylesheet"]'));
      
      parentStyles.forEach((style) => {
        // Prevent duplicate injection
        const isDuplicate = Array.from(doc.head.children).some(
          (child) => child.outerHTML === style.outerHTML
        );
        if (!isDuplicate) {
          doc.head.appendChild(style.cloneNode(true));
        }
      });

      // Inject Inter font
      const fontLink = document.createElement('link');
      fontLink.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap';
      fontLink.rel = 'stylesheet';
      doc.head.appendChild(fontLink);

      // Copy body classes for theme support
      doc.body.className = document.body.className;
      
      setIsLoaded(true);
    };

    injectStyles();

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeName === 'STYLE' || node.nodeName === 'LINK') {
            doc.head.appendChild(node.cloneNode(true));
          }
        });
      });
    });

    observer.observe(document.head, { childList: true });

    return () => observer.disconnect();
  }, [iframeRef]);

  const handlePreviewClick = (e: React.MouseEvent) => {
    // Look for link clicks
    const target = e.target as HTMLElement;
    const link = target.closest('a');
    
    if (link) {
      e.preventDefault();
      e.stopPropagation(); // Stop Next.js Link from seeing the event
      
      const href = link.getAttribute('href');
      if (!href) return;

      // 1. Handle builder pages
      if (href.startsWith('/pages/')) {
        const slug = href.replace('/pages/', '');
        const page = config.pages.find(p => p.slug === slug);
        if (page) {
          setActivePage(page.id);
          return;
        }
      } 
      
      // 2. Handle home
      if (href === '/' || href === '#home' || href === '/#hero') {
        const homePage = config.pages.find(p => p.slug === 'home');
        if (homePage) {
          setActivePage(homePage.id);
          return;
        }
      }

      // 3. Handle internal anchors
      if (href.startsWith('/#') || href.startsWith('#')) {
        const id = href.split('#').pop();
        if (id) {
          const el = iframeRef?.contentDocument?.getElementById(id);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
          return;
        }
      }

      // 4. Handle other internal routes (Shop, etc)
      // For now, we'll just show a "Coming Soon" or alert if it's not a builder page
      // but we MUST prevent the parent from navigating.
      console.log("Preview navigation to:", href);
    }
  };

  return (
    <iframe
      ref={setIframeRef}
      className={`w-full h-full border-none ${className || ''}`}
      title="Responsive Preview Frame"
    >
      {isLoaded && iframeRef?.contentDocument?.body && createPortal(
        <div 
          className="h-screen overflow-y-auto bg-background text-foreground font-body antialiased custom-scrollbar"
          onClickCapture={handlePreviewClick}
        >
          {children}
        </div>,
        iframeRef.contentDocument.body
      )}
    </iframe>
  );
}
