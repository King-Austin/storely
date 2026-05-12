"use client";

import { useState, useCallback } from 'react';
import { useStore, Section } from '@/context/StoreContext';
import { 
  ChevronDown, ChevronUp, Eye, EyeOff, 
  Grip, Monitor, Plus, Settings, 
  Smartphone, Tablet, Trash2, ExternalLink, FileText, MousePointer2
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import PromoMarquee from '@/components/PromoMarquee';
import ProductGrid from '@/components/ProductGrid';
import FinalCTA from '@/components/FinalCTA';
import Footer from '@/components/Footer';
import FramePreview from '@/components/FramePreview';
import BrutalistModal from '@/components/BrutalistModal';

// ─── Field Renderers ───────────────────────────────────────────────────────────
const FieldInput = ({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) => (
  <div className="space-y-1.5">
    <label className="text-[9px] font-black uppercase tracking-widest text-foreground/40">{label}</label>
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full bg-secondary/30 border border-foreground/10 px-3 py-2 text-[11px] font-bold focus:outline-none focus:border-foreground/40 transition-colors"
    />
  </div>
);

const FieldTextarea = ({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) => (
  <div className="space-y-1.5">
    <label className="text-[9px] font-black uppercase tracking-widest text-foreground/40">{label}</label>
    <textarea
      value={value}
      rows={3}
      onChange={(e) => onChange(e.target.value)}
      className="w-full bg-secondary/30 border border-foreground/10 px-3 py-2 text-[11px] font-bold focus:outline-none focus:border-foreground/40 transition-colors resize-none"
    />
  </div>
);

// ─── Settings Panel ────────────────────────────────────────────────────────────
const SectionSettings = ({ section, onChange }: { section: Section; onChange: (key: string, value: string) => void }) => {
  const s = section.settings;
  if (section.type === 'navbar') return (
    <div className="space-y-4">
      <FieldInput label="Brand / Logo Text" value={s.logoText} onChange={(v) => onChange('logoText', v)} />
      <FieldInput label="Link 1 Label" value={s.link1Label} onChange={(v) => onChange('link1Label', v)} />
      <FieldInput label="Link 2 Label" value={s.link2Label} onChange={(v) => onChange('link2Label', v)} />
      <FieldInput label="Link 3 Label" value={s.link3Label} onChange={(v) => onChange('link3Label', v)} />
    </div>
  );
  if (section.type === 'hero') return (
    <div className="space-y-4">
      <FieldInput label="Eyebrow Text" value={s.eyebrow} onChange={(v) => onChange('eyebrow', v)} />
      <FieldInput label="Headline Line 1" value={s.headline1} onChange={(v) => onChange('headline1', v)} />
      <FieldInput label="Headline Line 2" value={s.headline2} onChange={(v) => onChange('headline2', v)} />
      <FieldTextarea label="Sub-text" value={s.subtext} onChange={(v) => onChange('subtext', v)} />
      <FieldInput label="CTA Button Text" value={s.ctaText} onChange={(v) => onChange('ctaText', v)} />
      <FieldInput label="Scrolling Marquee" value={s.marqueeText} onChange={(v) => onChange('marqueeText', v)} />
    </div>
  );
  if (section.type === 'marquee') return (
    <div className="space-y-4">
      <FieldInput label="Item 1" value={s.item1} onChange={(v) => onChange('item1', v)} />
      <FieldInput label="Item 2" value={s.item2} onChange={(v) => onChange('item2', v)} />
      <FieldInput label="Item 3" value={s.item3} onChange={(v) => onChange('item3', v)} />
    </div>
  );
  if (section.type === 'products') return (
    <div className="space-y-4">
      <FieldInput label="Section Heading" value={s.heading} onChange={(v) => onChange('heading', v)} />
    </div>
  );
  if (section.type === 'cta') return (
    <div className="space-y-4">
      <FieldInput label="Headline" value={s.headline} onChange={(v) => onChange('headline', v)} />
      <FieldTextarea label="Sub-text" value={s.subtext} onChange={(v) => onChange('subtext', v)} />
      <FieldInput label="Button Label" value={s.buttonText} onChange={(v) => onChange('buttonText', v)} />
      <FieldInput label="Placeholder" value={s.placeholder} onChange={(v) => onChange('placeholder', v)} />
    </div>
  );
  if (section.type === 'footer') return (
    <div className="space-y-4">
      <FieldInput label="Brand Name" value={s.brandName} onChange={(v) => onChange('brandName', v)} />
      <FieldInput label="Tagline" value={s.tagline} onChange={(v) => onChange('tagline', v)} />
    </div>
  );
  return null;
};

// ─── Component Map for Preview ───────────────────────────────────────────────
const COMPONENT_MAP: Record<string, React.FC> = {
  navbar: Navbar,
  hero: Hero,
  marquee: PromoMarquee,
  products: ProductGrid,
  cta: FinalCTA,
  footer: Footer,
};

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function StoreBuilderPage() {
  const { config, updateSection, toggleVisible, moveUp, moveDown, deleteSection, addSection, setActivePage, addPage, deletePage } = useStore();
  
  const activePage = config.pages.find(p => p.id === config.activePageId) || config.pages[0];
  
  const [selectedId, setSelectedId] = useState<string | null>(activePage?.sections[0]?.id || null);
  const [viewport, setViewport] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [isSaved, setIsSaved] = useState(false);
  const [activeTab, setActiveTab] = useState<'sections' | 'pages'>('sections');
  const [isAddPageModalOpen, setIsAddPageModalOpen] = useState(false);

  const selectedSection = activePage?.sections.find(s => s.id === selectedId) ?? null;

  const handleUpdate = useCallback((key: string, value: string) => {
    if (selectedId) updateSection(selectedId, key, value);
  }, [selectedId, updateSection]);

  const handleSave = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="flex h-[calc(100vh-56px)] overflow-hidden bg-secondary/10">
      
      {/* ── Left Editor Panel ────────────────────────────────────────── */}
      <div className="w-80 shrink-0 bg-background border-r border-foreground/10 flex flex-col overflow-hidden z-10 shadow-lg">
        {/* Header & Tabs */}
        <div className="px-5 pt-4 pb-0 border-b border-foreground/10 bg-secondary/20 shrink-0">
          <h2 className="text-xs font-black uppercase tracking-widest mb-4">Store Builder</h2>
          <div className="flex gap-4">
            <button 
              onClick={() => setActiveTab('sections')}
              className={`pb-3 text-[10px] font-black uppercase tracking-widest transition-colors border-b-2 ${activeTab === 'sections' ? 'border-foreground text-foreground' : 'border-transparent text-foreground/40 hover:text-foreground'}`}
            >
              Sections
            </button>
            <button 
              onClick={() => setActiveTab('pages')}
              className={`pb-3 text-[10px] font-black uppercase tracking-widest transition-colors border-b-2 ${activeTab === 'pages' ? 'border-foreground text-foreground' : 'border-transparent text-foreground/40 hover:text-foreground'}`}
            >
              Pages
            </button>
          </div>
        </div>

        {activeTab === 'sections' ? (
          <>
            {/* Section List */}
            <div className="border-b border-foreground/10 shrink-0 max-h-[40%] overflow-y-auto custom-scrollbar">
              <div className="px-5 py-3 bg-secondary/10 flex justify-between items-center sticky top-0 z-10 backdrop-blur-sm">
                <h3 className="text-[9px] font-black uppercase tracking-widest text-foreground/50">Page: {activePage?.title}</h3>
              </div>
              <div className="divide-y divide-foreground/5">
                {activePage?.sections.map((section) => (
              <div
                key={section.id}
                onClick={() => setSelectedId(section.id)}
                className={`px-5 py-3 flex items-center gap-3 cursor-pointer transition-colors group ${selectedId === section.id ? 'bg-foreground text-background' : 'hover:bg-secondary/30'}`}
              >
                <Grip size={14} className={`${selectedId === section.id ? 'text-background/40' : 'text-foreground/20'}`} />
                <span className={`text-[11px] font-black uppercase tracking-widest flex-1 truncate ${!section.visible ? 'line-through opacity-50' : ''}`}>
                  {section.label}
                </span>
                <div className="flex items-center gap-0.5 shrink-0">
                  <button onClick={(e) => { e.stopPropagation(); moveUp(section.id); }} className={`p-1 rounded ${selectedId === section.id ? 'hover:bg-background/20 text-background' : 'hover:bg-secondary text-foreground/40'}`}>
                    <ChevronUp size={14} />
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); moveDown(section.id); }} className={`p-1 rounded ${selectedId === section.id ? 'hover:bg-background/20 text-background' : 'hover:bg-secondary text-foreground/40'}`}>
                    <ChevronDown size={14} />
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); toggleVisible(section.id); }} className={`p-1 rounded ${selectedId === section.id ? 'hover:bg-background/20 text-background' : 'hover:bg-secondary text-foreground/40'}`}>
                    {section.visible ? <Eye size={14} /> : <EyeOff size={14} />}
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); deleteSection(section.id); }} className={`p-1 rounded ${selectedId === section.id ? 'hover:bg-red-500/20 text-red-400' : 'hover:bg-red-50 text-red-400 opacity-0 group-hover:opacity-100'}`}>
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="p-4 border-t border-foreground/5 bg-secondary/5">
            <button 
              onClick={() => {
                const type = prompt("Enter section type (navbar, hero, marquee, products, cta, footer):");
                if (type && ['navbar', 'hero', 'marquee', 'products', 'cta', 'footer'].includes(type)) {
                  addSection(type as any);
                }
              }}
              className="w-full flex flex-col items-center justify-center py-4 border-2 border-dashed border-foreground/20 hover:border-foreground/50 hover:bg-foreground/5 transition-all text-foreground/60 hover:text-foreground"
            >
              <Plus size={20} className="mb-2" />
              <span className="text-[10px] font-black uppercase tracking-widest mt-1 opacity-50">Add Section</span>
            </button>
          </div>
        </div>

            {/* Section Settings */}
            {selectedSection ? (
              <div className="flex-1 overflow-y-auto p-5 custom-scrollbar bg-background">
                <h3 className="text-[10px] font-black uppercase tracking-widest mb-4 flex items-center gap-2">
                  <Settings size={12} className="opacity-50" />
                  {selectedSection.label} Settings
                </h3>
                <div className="space-y-4">
                  <SectionSettings section={selectedSection} onChange={handleUpdate} />
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-foreground/20 text-center bg-background">
                <Settings size={32} className="mb-4 opacity-50" />
                <p className="text-[10px] font-black uppercase tracking-widest">Select a section<br/>to edit</p>
              </div>
            )}
          </>
        ) : (
          <div className="flex-1 overflow-y-auto custom-scrollbar bg-background flex flex-col">
            <div className="p-4 space-y-2 flex-1">
              {config.pages.map(page => (
                <div 
                  key={page.id} 
                  className="flex items-center gap-2 group"
                >
                  <button
                    onClick={() => {
                      setActivePage(page.id);
                      setSelectedId(page.sections[0]?.id || null);
                      setActiveTab('sections');
                    }}
                    className={`flex-1 flex items-center gap-3 px-4 py-3 rounded-xl border text-left transition-all ${config.activePageId === page.id ? 'border-foreground bg-foreground text-background shadow-md' : 'border-foreground/10 hover:border-foreground/30 bg-background'}`}
                  >
                    <FileText size={14} className={config.activePageId === page.id ? 'text-background/50' : 'text-foreground/40'} />
                    <span className="text-[11px] font-black uppercase tracking-widest truncate">{page.title}</span>
                  </button>
                  {page.id !== 'page-home' && (
                    <button 
                      onClick={() => deletePage(page.id)}
                      className="p-3 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50 rounded-xl border border-transparent hover:border-red-100"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              ))}
            </div>
            
            <div className="p-4 border-t border-foreground/10 bg-secondary/10">
              <button 
                onClick={() => setIsAddPageModalOpen(true)}
                className="w-full flex flex-col items-center justify-center py-4 border-2 border-dashed border-foreground/20 hover:border-foreground/50 hover:bg-foreground/5 transition-all text-foreground/60 hover:text-foreground"
              >
                <Plus size={20} className="mb-2" />
                <span className="text-[10px] font-black uppercase tracking-widest">Add New Page</span>
              </button>
            </div>
          </div>
        )}

        {/* Add Page Modal */}
        <BrutalistModal 
          isOpen={isAddPageModalOpen} 
          onClose={() => setIsAddPageModalOpen(false)}
          title="New Page"
          maxWidth="max-w-sm"
        >
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const title = formData.get('title') as string;
              if (title) {
                const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
                addPage({ title, slug });
                setIsAddPageModalOpen(false);
              }
            }} 
            className="space-y-4"
          >
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest opacity-40">Page Title</label>
              <input required name="title" autoFocus className="w-full bg-secondary/20 border-2 border-foreground p-3 text-xs font-black uppercase outline-none" placeholder="E.G. CONTACT US" />
            </div>
            <button type="submit" className="w-full py-4 bg-foreground text-background font-black text-xs uppercase tracking-widest hover:bg-foreground/90 transition-all">
              Create Page
            </button>
          </form>
        </BrutalistModal>

        {/* Footer Actions */}
        <div className="p-4 border-t border-foreground/10 shrink-0 space-y-2 bg-secondary/10">
          <button onClick={handleSave} className={`w-full py-3 font-black text-[10px] uppercase tracking-widest transition-all ${isSaved ? 'bg-green-500 text-white' : 'bg-foreground text-background hover:bg-foreground/90'}`}>
            {isSaved ? '✓ Saved!' : 'Save Changes'}
          </button>
          <a href={`/pages/${activePage?.slug}`} target="_blank" rel="noopener noreferrer" className="w-full py-2.5 border border-foreground/10 text-[10px] font-black uppercase tracking-widest hover:bg-secondary transition-colors flex items-center justify-center gap-2 text-foreground/60">
            <ExternalLink size={12} /> Open Live Site
          </a>
        </div>
      </div>

      {/* ── Right Live Preview ───────────────────────────────────────── */}
      <div className="flex-1 flex flex-col overflow-hidden relative bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-secondary/20">
        
        {/* Toolbar */}
        <div className="h-14 bg-background/80 backdrop-blur-md border-b border-foreground/10 flex items-center justify-center shrink-0 z-10 px-4 absolute top-0 w-full">
          <div className="bg-secondary/50 rounded-lg p-1 flex gap-1 shadow-sm border border-foreground/5">
            {(['desktop', 'tablet', 'mobile'] as const).map(v => {
              const Icon = v === 'desktop' ? Monitor : v === 'tablet' ? Tablet : Smartphone;
              return (
                <button key={v} onClick={() => setViewport(v)} className={`p-2 rounded-md transition-all ${viewport === v ? 'bg-background shadow-sm text-foreground' : 'text-foreground/40 hover:text-foreground'}`}>
                  <Icon size={16} />
                </button>
              );
            })}
          </div>
        </div>

        {/* Preview Frame */}
        <div className="flex-1 flex justify-center pt-20 pb-10 px-4">
          <div 
            className={`bg-background shadow-2xl transition-all duration-300 relative transform-gpu overflow-hidden ${
              viewport === 'desktop' ? 'w-full max-w-6xl h-full rounded-lg border border-foreground/10' : 
              viewport === 'tablet' ? 'w-[768px] rounded-[2rem] border-[12px] border-foreground h-[1024px]' : 
              'w-[390px] rounded-[3rem] border-[14px] border-foreground h-[844px]'
            }`}
          >
              <FramePreview>
                {activePage?.sections.filter(s => s.visible).map(section => {
                  const Component = COMPONENT_MAP[section.type] as React.FC<{ pageId?: string }>;
                  return Component ? (
                    <div 
                      key={section.id} 
                      className={`${selectedId === section.id ? 'ring-4 ring-blue-500 z-20' : ''} ${section.type === 'navbar' ? 'sticky top-0 z-50' : 'relative'}`}
                    >
                      <Component pageId={activePage.id} />
                    </div>
                  ) : null;
                })}
              </FramePreview>
            </div>
          </div>
      </div>
    </div>
  );
}
