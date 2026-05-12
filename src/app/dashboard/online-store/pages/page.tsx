"use client";

import { useState } from 'react';
import { Plus, Search, FileText, MoreHorizontal, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import BrutalistModal from '@/components/BrutalistModal';
import Link from 'next/link';

const initialPages = [
  { id: '1', title: 'Home', slug: '/', status: 'Published', lastUpdated: '2 hours ago' },
  { id: '2', title: 'About Us', slug: '/about', status: 'Published', lastUpdated: '1 day ago' },
  { id: '3', title: 'Contact', slug: '/contact', status: 'Published', lastUpdated: '3 days ago' },
  { id: '4', title: 'Shipping Policy', slug: '/shipping', status: 'Draft', lastUpdated: '1 week ago' },
];

export default function PagesManagementPage() {
  const [pages, setPages] = useState(initialPages);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const handleAddPage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const title = formData.get('title') as string;
    if (title) {
      const slug = '/' + title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      const newPage = {
        id: Math.random().toString(36).substr(2, 9),
        title,
        slug,
        status: 'Draft',
        lastUpdated: 'Just now'
      };
      setPages([newPage, ...pages]);
      setIsAddModalOpen(false);
    }
  };

  return (
    <div className="p-6 lg:p-10 space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tight">Pages</h1>
          <p className="text-xs font-bold text-foreground/50 uppercase tracking-widest mt-1">Manage static pages for your store</p>
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 px-6 py-3 bg-foreground text-background font-black text-xs uppercase tracking-widest hover:bg-foreground/90 transition-all shadow-sm"
        >
          <Plus size={16} /> Add Page
        </button>
      </div>

      {/* Pages List */}
      <div className="bg-white border-2 border-foreground shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden flex flex-col">
        <div className="p-6 border-b-2 border-foreground flex justify-between items-center bg-secondary/10 shrink-0">
          <div className="relative w-64">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40" />
            <input 
              type="text" 
              placeholder="Search pages..."
              className="w-full py-2 pl-10 pr-4 text-xs font-black uppercase tracking-widest bg-white border-2 border-foreground focus:outline-none"
            />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b-2 border-foreground bg-secondary/20">
                <th className="px-6 py-4 text-[10px] font-black tracking-widest uppercase text-foreground/60">Title</th>
                <th className="px-6 py-4 text-[10px] font-black tracking-widest uppercase text-foreground/60">Status</th>
                <th className="px-6 py-4 text-[10px] font-black tracking-widest uppercase text-foreground/60">Last Updated</th>
                <th className="px-6 py-4 text-[10px] font-black tracking-widest uppercase text-foreground/60 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-foreground/10">
              {pages.map((page) => (
                <tr key={page.id} className="hover:bg-secondary/10 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <FileText size={16} className="text-foreground/40" />
                      <div className="flex flex-col">
                        <span className="font-black text-sm uppercase tracking-tight">{page.title}</span>
                        <span className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest">{page.slug}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-[9px] font-black uppercase tracking-widest border-2 ${page.status === 'Published' ? 'border-green-500 text-green-700 bg-green-50' : 'border-foreground/20 text-foreground/60 bg-secondary/20'}`}>
                      {page.status === 'Published' && <CheckCircle2 size={10} />}
                      {page.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-[10px] font-bold text-foreground/50 uppercase tracking-widest">
                    {page.lastUpdated}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link href="/dashboard/online-store/store-builder" className="inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-widest text-foreground hover:bg-foreground hover:text-background px-3 py-1.5 border-2 border-foreground transition-colors mr-2">
                      Edit <ArrowUpRight size={12} />
                    </Link>
                    <button className="p-1.5 text-foreground/40 hover:text-foreground transition-colors">
                      <MoreHorizontal size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <BrutalistModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="New Page"
        maxWidth="max-w-sm"
      >
        <form onSubmit={handleAddPage} className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-widest opacity-40">Page Title</label>
            <input required name="title" autoFocus className="w-full bg-secondary/20 border-2 border-foreground p-3 text-xs font-black uppercase outline-none" placeholder="E.G. CONTACT US" />
          </div>
          <button type="submit" className="w-full py-4 bg-foreground text-background font-black text-xs uppercase tracking-widest hover:bg-foreground/90 transition-all">
            Create Page
          </button>
        </form>
      </BrutalistModal>
    </div>
  );
}
