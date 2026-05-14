"use client";

import { useState } from 'react';
import { 
  Search, Filter, ArrowUpDown, Plus, 
  Tag, Percent, Truck, MoreHorizontal,
  ChevronRight, AlertCircle, Calendar,
  CheckCircle2, Clock, XCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import BrutalistModal from '@/components/BrutalistModal';
import { useDiscounts, useVendorStore } from '@/hooks/useSupabaseData';
import { createClient } from '@/lib/supabase/client';

export default function DiscountsPage() {
  const { store } = useVendorStore();
  const { discounts: dbDiscounts, loading, refetch } = useDiscounts(store?.id);
  const supabase = createClient();

  const mappedDiscounts = (dbDiscounts || []).map((d: any) => ({
    id: d.id,
    code: d.code || '',
    type: d.type === 'percentage' ? 'Percentage' : d.type === 'fixed' ? 'Fixed Amount' : 'Free Shipping',
    value: d.type === 'percentage' ? `${d.value}%` : d.type === 'fixed' ? `$${(d.value || 0).toFixed(2)}` : 'Free',
    usage: d.usage_count || 0,
    status: d.is_active ? 'Active' : 'Expired',
    end: d.expires_at ? new Date(d.expires_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'Ongoing',
    rawValue: d.value
  }));
  const [selectedDiscounts, setSelectedDiscounts] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('All');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingDiscount, setEditingDiscount] = useState<any>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleCreateDiscount = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!store?.id) return;
    const formData = new FormData(e.currentTarget);
    const code = (formData.get('code') as string).toUpperCase();
    const uiType = formData.get('type') as string;
    let type = 'percentage';
    if (uiType === 'Fixed Amount') type = 'fixed';
    else if (uiType === 'Free Shipping') type = 'free_shipping';
    
    let rawValue = parseFloat(formData.get('value') as string);
    if (isNaN(rawValue)) rawValue = 0;

    await supabase.from('storely_discounts').insert({
      store_id: store.id,
      code,
      type,
      value: rawValue,
      is_active: true
    });

    refetch();
    setIsCreateModalOpen(false);
    showToast(`Discount code ${code} activated!`);
  };

  const handleEditDiscount = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingDiscount) return;
    const formData = new FormData(e.currentTarget);
    const code = (formData.get('code') as string).toUpperCase();
    const uiType = formData.get('type') as string;
    let type = 'percentage';
    if (uiType === 'Fixed Amount') type = 'fixed';
    else if (uiType === 'Free Shipping') type = 'free_shipping';
    
    let rawValue = parseFloat(formData.get('value') as string);
    if (isNaN(rawValue)) rawValue = 0;

    await supabase.from('storely_discounts').update({
      code,
      type,
      value: rawValue
    }).eq('id', editingDiscount.id);

    refetch();
    showToast(`Promotion ${code} updated!`);
    setEditingDiscount(null);
  };

  const filteredDiscounts = mappedDiscounts.filter(discount => {
    const matchesSearch = discount.code.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === 'All' || discount.status === activeTab;
    return matchesSearch && matchesTab;
  });

  const toggleSelect = (id: string) => {
    setSelectedDiscounts(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedDiscounts.length === filteredDiscounts.length) {
      setSelectedDiscounts([]);
    } else {
      setSelectedDiscounts(filteredDiscounts.map(d => d.id));
    }
  };

  return (
    <div className="p-6 lg:p-10 space-y-8 relative">
      <AnimatePresence>
        {toastMessage && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-6 right-6 z-[1000] bg-black text-white px-6 py-4 font-black text-xs uppercase tracking-widest shadow-2xl border-l-4 border-green-500"
          >
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-black uppercase tracking-tight">Discounts</h1>
        <div className="flex gap-2">
          <button onClick={() => showToast('Exporting discounts...')} className="flex items-center gap-2 px-3 py-1.5 bg-secondary hover:bg-black/5 text-xs font-bold uppercase tracking-widest transition-colors">
            Export
          </button>
          <button 
            onClick={() => setIsCreateModalOpen(true)}
            className="px-4 py-2 bg-foreground text-background hover:bg-foreground/90 text-xs font-black uppercase tracking-widest transition-all shadow-sm"
          >
            Create Discount
          </button>
        </div>
      </div>

      {/* Create / Edit Discount Modal */}
      <BrutalistModal 
        isOpen={isCreateModalOpen || !!editingDiscount} 
        onClose={() => {
          setIsCreateModalOpen(false);
          setEditingDiscount(null);
        }}
        title={editingDiscount ? "Update Promotion" : "Generate Code"}
      >
        <form onSubmit={editingDiscount ? handleEditDiscount : handleCreateDiscount} className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-widest opacity-40">Discount Code</label>
            <input required name="code" defaultValue={editingDiscount?.code || ""} className="w-full bg-secondary/20 border-2 border-foreground p-3 text-xs font-black uppercase outline-none" placeholder="E.G. FLASH50" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest opacity-40">Type</label>
              <select name="type" defaultValue={editingDiscount?.type || "Percentage"} className="w-full bg-secondary/20 border-2 border-foreground p-3 text-xs font-black uppercase outline-none">
                <option>Percentage</option>
                <option>Fixed Amount</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest opacity-40">Value</label>
              <input required name="value" type="number" step="0.01" defaultValue={editingDiscount?.rawValue || ""} className="w-full bg-secondary/20 border-2 border-foreground p-3 text-xs font-black uppercase outline-none" placeholder="20 or 10" />
            </div>
          </div>
          <button type="submit" className="w-full py-4 bg-foreground text-background font-black text-xs uppercase tracking-widest hover:bg-foreground/90 transition-all">
            {editingDiscount ? "Save Changes" : "Activate Promotion"}
          </button>
        </form>
      </BrutalistModal>

      <div className="bg-white dark:bg-black/20 border border-foreground/10 overflow-hidden">
        <div className="flex flex-col sm:flex-row justify-between border-b border-foreground/10">
          <div className="flex items-center">
            {['All', 'Active', 'Scheduled', 'Expired'].map((tab) => (
              <button 
                key={tab} 
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 text-xs font-black uppercase tracking-widest border-b-2 transition-colors ${activeTab === tab ? 'border-foreground text-foreground' : 'border-transparent text-foreground/40 hover:text-foreground/60'}`}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="flex items-center border-l border-foreground/10 divide-x divide-foreground/10">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/30" />
              <input 
                type="text" 
                placeholder="Search discounts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="py-3 pl-10 pr-4 text-xs font-bold uppercase tracking-widest bg-transparent focus:outline-none w-48 lg:w-64"
              />
            </div>
            <button className="p-3 text-foreground/60 hover:text-foreground transition-colors"><Filter size={18} /></button>
            <button className="p-3 text-foreground/60 hover:text-foreground transition-colors"><ArrowUpDown size={18} /></button>
          </div>
        </div>

        {selectedDiscounts.length > 0 && (
          <div className="bg-secondary/50 px-4 py-3 border-b border-foreground/10 flex items-center justify-between animate-in fade-in slide-in-from-top-1">
            <span className="text-xs font-black uppercase tracking-widest text-foreground">{selectedDiscounts.length} selected</span>
            <div className="flex items-center gap-1">
              <button onClick={async () => {
                await supabase.from('storely_discounts').update({ is_active: false }).in('id', selectedDiscounts);
                refetch();
                showToast(`Deactivated ${selectedDiscounts.length} discounts`);
                setSelectedDiscounts([]);
              }} className="px-3 py-1.5 bg-white dark:bg-black border border-foreground/10 text-[10px] font-black uppercase tracking-widest hover:bg-secondary transition-colors">Deactivate</button>
              <button onClick={async () => {
                await supabase.from('storely_discounts').delete().in('id', selectedDiscounts);
                refetch();
                showToast(`Deleted ${selectedDiscounts.length} discounts`);
                setSelectedDiscounts([]);
              }} className="px-3 py-1.5 bg-white dark:bg-black border border-red-500/20 text-[10px] font-black uppercase tracking-widest text-red-500 hover:bg-red-500 hover:text-white transition-colors">Delete</button>
            </div>
          </div>
        )}

        <div className="overflow-x-auto min-h-[400px]">
          <table className="w-full text-left border-collapse">
            <thead className="bg-secondary/20">
              <tr className="border-b border-foreground/10">
                <th className="p-4 w-10">
                  <input 
                    type="checkbox" 
                    checked={selectedDiscounts.length === filteredDiscounts.length && filteredDiscounts.length > 0} 
                    onChange={toggleSelectAll}
                    className="w-4 h-4 accent-foreground cursor-pointer" 
                  />
                </th>
                <th className="p-4 text-[10px] font-black uppercase tracking-widest text-foreground/40">Discount Code</th>
                <th className="p-4 text-[10px] font-black uppercase tracking-widest text-foreground/40 text-center">Status</th>
                <th className="p-4 text-[10px] font-black uppercase tracking-widest text-foreground/40">Type</th>
                <th className="p-4 text-[10px] font-black uppercase tracking-widest text-foreground/40">Value</th>
                <th className="p-4 text-[10px] font-black uppercase tracking-widest text-foreground/40 text-center">Used</th>
                <th className="p-4 text-[10px] font-black uppercase tracking-widest text-foreground/40">Ends</th>
                <th className="p-4 w-10"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-foreground/5">
              {filteredDiscounts.length > 0 ? (
                filteredDiscounts.map((discount) => (
                  <tr 
                    key={discount.id} 
                    onClick={() => setEditingDiscount(discount)}
                    className={`hover:bg-secondary/10 transition-colors group cursor-pointer ${selectedDiscounts.includes(discount.id) ? 'bg-secondary/5' : ''}`}
                  >
                    <td className="p-4" onClick={(e) => e.stopPropagation()}>
                      <input 
                        type="checkbox" 
                        checked={selectedDiscounts.includes(discount.id)}
                        onChange={() => toggleSelect(discount.id)}
                        className="w-4 h-4 accent-foreground cursor-pointer" 
                      />
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-4">
                         <div className="w-10 h-10 bg-secondary border border-foreground/5 flex items-center justify-center group-hover:border-foreground/20 transition-colors">
                           {discount.type === 'Percentage' ? <Percent size={16} /> : discount.type === 'Free Shipping' ? <Truck size={16} /> : <Tag size={16} />}
                         </div>
                         <span className="text-xs font-black uppercase tracking-widest bg-foreground text-background px-2 py-1 leading-none">{discount.code}</span>
                      </div>
                    </td>
                    <td className="p-4 text-center">
                       <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 text-[9px] font-black uppercase tracking-widest border ${
                        discount.status === 'Active' ? 'bg-green-100 text-green-700 border-green-200' : 
                        discount.status === 'Scheduled' ? 'bg-blue-100 text-blue-700 border-blue-200' : 
                        'bg-red-100 text-red-700 border-red-200'
                      }`}>
                        {discount.status === 'Active' ? <CheckCircle2 size={10} /> : discount.status === 'Scheduled' ? <Clock size={10} /> : <XCircle size={10} />}
                        {discount.status}
                      </span>
                    </td>
                    <td className="p-4 text-[10px] font-bold text-foreground/40 uppercase tracking-widest">{discount.type}</td>
                    <td className="p-4 text-xs font-black">{discount.value}</td>
                    <td className="p-4 text-center text-xs font-bold text-foreground/60">{discount.usage}</td>
                    <td className="p-4 text-[10px] font-bold text-foreground/40 uppercase tracking-widest">
                       <div className="flex items-center gap-1.5">
                         <Calendar size={12} className="text-foreground/20" />
                         {discount.end}
                       </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="p-24 text-center">
                    <AlertCircle size={40} className="mx-auto text-foreground/10 mb-4" />
                    <p className="font-display text-2xl font-black uppercase tracking-tight text-foreground/20">No discounts found</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
