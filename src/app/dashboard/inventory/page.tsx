"use client";

import { useState, useMemo } from 'react';
import { 
  Search, Filter, ArrowUpDown, ChevronRight, 
  Plus, History, Package, AlertTriangle, 
  ArrowRight, Download, Upload, Info, X, 
  Check, Save, Layers, Settings
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import BrutalistDrawer from '@/components/BrutalistDrawer';

// Mocked inventory data with variants
const initialInventory = [
  { id: 'v1', productName: 'AERO STRIKE X', sku: 'ASX-BLK-10', variant: 'Black / 10', onHand: 50, committed: 12, available: 38, threshold: 10, isBundle: false },
  { id: 'v2', productName: 'AERO STRIKE X', sku: 'ASX-WHT-09', variant: 'White / 9', onHand: 5, committed: 2, available: 3, threshold: 10, isBundle: false },
  { id: 'v3', productName: 'VOID RUNNER', sku: 'VR-GRY-11', variant: 'Grey / 11', onHand: 0, committed: 0, available: 0, threshold: 5, isBundle: false },
  { id: 'v4', productName: 'TERRA FORM', sku: 'TF-BRN-10', variant: 'Brown / 10', onHand: 120, committed: 45, available: 75, threshold: 20, isBundle: false },
  { id: 'v5', productName: 'ELITE PACK', sku: 'EP-BNDL-01', variant: 'Core Essentials', onHand: 20, committed: 5, available: 15, threshold: 5, isBundle: true },
];

const mockLedger = [
  { id: 1, timestamp: '2026-10-24 10:12:05', event: 'Order Placement', delta: -1, actor: 'System (Checkout)', sku: 'ASX-BLK-10' },
  { id: 2, timestamp: '2026-10-24 09:45:12', event: 'Manual Adjustment', delta: +50, actor: 'Staff: Alex R.', sku: 'TF-BRN-10' },
  { id: 3, timestamp: '2026-10-23 16:20:00', event: 'API Sync', delta: -5, actor: 'API: ShippingApp', sku: 'VR-GRY-11' },
];

export default function InventoryPage() {
  const [inventoryList, setInventoryList] = useState(initialInventory);
  const [activeView, setActiveView] = useState<'main' | 'ledger' | 'settings'>('main');
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVariant, setSelectedVariant] = useState<any>(null);
  const [isAdjustmentOpen, setIsAdjustmentOpen] = useState(false);
  const [adjustmentMode, setAdjustmentMode] = useState<'relative' | 'absolute'>('relative');
  const [adjustmentValue, setAdjustmentValue] = useState<string>('');
  
  // Filtering Logic
  const filteredInventory = useMemo(() => {
    return inventoryList.filter(item => {
      const matchesSearch = item.productName.toLowerCase().includes(searchQuery.toLowerCase()) || item.sku.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesTab = activeTab === 'All' || 
                        (activeTab === 'Low Stock' && item.available <= item.threshold && item.available > 0) ||
                        (activeTab === 'Out of Stock' && item.available === 0) ||
                        (activeTab === 'Bundles' && item.isBundle);
      return matchesSearch && matchesTab;
    });
  }, [searchQuery, activeTab, inventoryList]);

  const handleOpenAdjustment = (variant: any) => {
    setSelectedVariant(variant);
    setIsAdjustmentOpen(true);
    setAdjustmentValue('');
  };

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleExport = () => {
    showToast('Exporting inventory data...');
  };

  const handleSaveAdjustment = () => {
    const newVal = parseInt(adjustmentValue);
    if (isNaN(newVal)) return;

    setInventoryList(prev => prev.map(item => {
      if (item.id === selectedVariant.id) {
        let finalOnHand = item.onHand;
        if (adjustmentMode === 'relative') {
          finalOnHand += newVal;
        } else {
          finalOnHand = newVal;
        }

        if (finalOnHand < item.committed) {
          toast.error("Cannot reduce On Hand below Committed quantity.");
          return item;
        }

        return {
          ...item,
          onHand: finalOnHand,
          available: finalOnHand - item.committed
        };
      }
      return item;
    }));

    setIsAdjustmentOpen(false);
    showToast(`Inventory updated for ${selectedVariant.sku}`);
  };

  return (
    <div className="flex h-full overflow-hidden bg-white dark:bg-black relative">
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

      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Header */}
        <div className="px-6 py-8 border-b border-foreground/10 flex justify-between items-end bg-background/50 backdrop-blur-sm sticky top-0 z-10">
          <div>
            <h1 className="text-2xl font-black uppercase tracking-tight mb-2">Inventory</h1>
            <div className="flex gap-4">
               {['main', 'ledger', 'settings'].map(view => (
                <button 
                  key={view}
                  onClick={() => setActiveView(view as any)}
                  className={`text-[10px] font-black uppercase tracking-widest pb-1 border-b-2 transition-colors ${activeView === view ? 'border-foreground text-foreground' : 'border-transparent text-foreground/30 hover:text-foreground/60'}`}
                >
                  {view === 'main' ? 'Inventory View' : view === 'ledger' ? 'Audit Ledger' : 'Automation Settings'}
                </button>
               ))}
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={handleExport} className="flex items-center gap-2 px-3 py-1.5 bg-secondary hover:bg-black/5 text-[10px] font-black uppercase tracking-widest transition-colors">
              <Download size={14} /> Export CSV
            </button>
            <button onClick={() => toast('Import feature coming soon!')} className="flex items-center gap-2 px-3 py-1.5 bg-secondary hover:bg-black/5 text-[10px] font-black uppercase tracking-widest transition-colors border-l border-foreground/5">
              <Upload size={14} /> Import
            </button>
          </div>
        </div>

        {activeView === 'main' && (
          <div className="flex-1 overflow-y-auto p-6 space-y-8">
            {/* KPI Row (Small & Dense) */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-0 border border-foreground/10 divide-x divide-foreground/10">
               <div className="p-4 space-y-1">
                 <h3 className="text-[9px] font-black uppercase tracking-widest text-foreground/40">Total On Hand</h3>
                 <span className="text-xl font-black">195 Units</span>
               </div>
               <div className="p-4 space-y-1">
                 <h3 className="text-[9px] font-black uppercase tracking-widest text-foreground/40">Committed</h3>
                 <span className="text-xl font-black">59 Units</span>
               </div>
               <div className="p-4 space-y-1">
                 <h3 className="text-[9px] font-black uppercase tracking-widest text-foreground/40">Low Stock Variants</h3>
                 <span className="text-xl font-black text-red-500">1</span>
               </div>
               <div className="p-4 space-y-1">
                 <h3 className="text-[9px] font-black uppercase tracking-widest text-foreground/40">Active Bundles</h3>
                 <span className="text-xl font-black">1</span>
               </div>
            </div>

            {/* Inventory Controls */}
            <div className="bg-white dark:bg-black/20 border border-foreground/10">
              <div className="flex flex-col sm:flex-row justify-between border-b border-foreground/10">
                <div className="flex items-center">
                  {['All', 'Low Stock', 'Out of Stock', 'Bundles'].map((tab) => (
                    <button 
                      key={tab} 
                      onClick={() => setActiveTab(tab)}
                      className={`px-6 py-4 text-[10px] font-black uppercase tracking-widest border-b-2 transition-colors ${activeTab === tab ? 'border-foreground text-foreground' : 'border-transparent text-foreground/40 hover:text-foreground/60'}`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
                <div className="flex items-center border-l border-foreground/10 divide-x divide-foreground/10">
                  <div className="relative">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/30" />
                    <input 
                      type="text" 
                      placeholder="Search SKU or Product..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="py-4 pl-10 pr-4 text-[10px] font-black uppercase tracking-widest bg-transparent focus:outline-none w-48 lg:w-64"
                    />
                  </div>
                  <button className="p-4 text-foreground/60 hover:text-foreground transition-colors"><Filter size={18} /></button>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-secondary/20">
                    <tr className="border-b border-foreground/10">
                      <th className="p-4 text-[10px] font-black uppercase tracking-widest text-foreground/40">Variant / SKU</th>
                      <th className="p-4 text-[10px] font-black uppercase tracking-widest text-foreground/40 text-right">On Hand</th>
                      <th className="p-4 text-[10px] font-black uppercase tracking-widest text-foreground/40 text-right">Committed</th>
                      <th className="p-4 text-[10px] font-black uppercase tracking-widest text-foreground/40 text-right">Available</th>
                      <th className="p-4 text-[10px] font-black uppercase tracking-widest text-foreground/40 text-center">Alerts</th>
                      <th className="p-4 text-[10px] font-black uppercase tracking-widest text-foreground/40 w-10"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-foreground/5">
                    {filteredInventory.map((item) => (
                      <tr 
                        key={item.id} 
                        onClick={() => handleOpenAdjustment(item)}
                        className="hover:bg-secondary/10 transition-colors group cursor-pointer"
                      >
                        <td className="p-4">
                          <div className="flex flex-col">
                            <span className="text-xs font-black uppercase tracking-tight mb-0.5">{item.productName}</span>
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-bold text-foreground/40 tracking-widest uppercase">{item.sku}</span>
                              <span className="text-[10px] font-bold text-foreground/60">•</span>
                              <span className="text-[10px] font-bold text-foreground/60 uppercase">{item.variant}</span>
                              {item.isBundle && (
                                <span className="bg-blue-50 text-blue-600 text-[8px] font-black px-1.5 py-0.5 uppercase tracking-widest border border-blue-200">Bundle</span>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="p-4 text-right">
                          <span className="font-display text-base font-black border-b border-dotted border-foreground/20 group-hover:border-foreground transition-colors">
                            {item.onHand}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <div className="group/tooltip relative inline-block">
                             <span className="text-base font-black text-foreground/40 cursor-help border-b border-dotted border-foreground/10">{item.committed}</span>
                             {item.committed > 0 && (
                               <div className="absolute right-0 bottom-full mb-2 w-48 bg-black text-white p-3 hidden group-hover/tooltip:block z-50 border border-white/10">
                                 <h4 className="text-[8px] font-black uppercase tracking-widest mb-2 border-b border-white/10 pb-1">Committed Orders</h4>
                                 <div className="space-y-1">
                                    <div className="text-[9px] font-bold flex justify-between hover:text-white/70 transition-colors cursor-pointer">
                                      <span>#1001</span>
                                      <span className="text-white/40">1 Unit</span>
                                    </div>
                                    <div className="text-[9px] font-bold flex justify-between hover:text-white/70 transition-colors cursor-pointer">
                                      <span>#1004</span>
                                      <span className="text-white/40">3 Units</span>
                                    </div>
                                 </div>
                               </div>
                             )}
                          </div>
                        </td>
                        <td className="p-4 text-right">
                          <span className={`font-display text-lg font-black ${item.available === 0 ? 'text-red-500' : item.available <= item.threshold ? 'text-orange-500' : 'text-foreground'}`}>
                            {item.available}
                          </span>
                        </td>
                        <td className="p-4 text-center">
                          {item.available <= item.threshold && (
                             <div className="inline-flex items-center gap-1.5 text-orange-500 animate-pulse">
                               <AlertTriangle size={12} />
                               <span className="text-[9px] font-black uppercase tracking-widest">Low</span>
                             </div>
                          )}
                          {item.available === 0 && (
                             <div className="inline-flex items-center gap-1.5 text-red-500">
                               <X size={12} strokeWidth={3} />
                               <span className="text-[9px] font-black uppercase tracking-widest">OOS</span>
                             </div>
                          )}
                        </td>
                        <td className="p-4">
                           <div className="text-foreground/20 group-hover:text-foreground transition-colors">
                             <ChevronRight size={18} />
                           </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeView === 'ledger' && (
          <div className="flex-1 overflow-y-auto p-6">
             <div className="bg-white dark:bg-black/20 border border-foreground/10 overflow-hidden">
                <div className="p-4 border-b border-foreground/10 flex justify-between items-center bg-secondary/20">
                   <h2 className="text-[10px] font-black uppercase tracking-widest">Operational Audit Trail</h2>
                   <div className="flex gap-2">
                      <button className="p-1.5 hover:bg-black/5 transition-colors"><Download size={14} /></button>
                   </div>
                </div>
                <table className="w-full text-left border-collapse">
                   <thead className="bg-secondary/10">
                      <tr>
                        <th className="p-4 text-[10px] font-black uppercase tracking-widest text-foreground/40">Timestamp</th>
                        <th className="p-4 text-[10px] font-black uppercase tracking-widest text-foreground/40">SKU / Item</th>
                        <th className="p-4 text-[10px] font-black uppercase tracking-widest text-foreground/40">Event Type</th>
                        <th className="p-4 text-[10px] font-black uppercase tracking-widest text-foreground/40 text-center">Delta</th>
                        <th className="p-4 text-[10px] font-black uppercase tracking-widest text-foreground/40">Actor</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-foreground/5">
                      {mockLedger.map(entry => (
                        <tr key={entry.id} className="hover:bg-secondary/5 transition-colors">
                          <td className="p-4 text-[10px] font-bold text-foreground/60">{entry.timestamp}</td>
                          <td className="p-4 text-[10px] font-black uppercase tracking-tight">{entry.sku}</td>
                          <td className="p-4">
                             <span className="text-[9px] font-black uppercase tracking-widest bg-secondary/50 px-2 py-0.5 border border-foreground/5">
                               {entry.event}
                             </span>
                          </td>
                          <td className="p-4 text-center">
                             <span className={`font-display text-sm font-black ${entry.delta > 0 ? 'text-green-600' : 'text-red-600'}`}>
                               {entry.delta > 0 ? `+${entry.delta}` : entry.delta}
                             </span>
                          </td>
                          <td className="p-4 text-[10px] font-bold text-foreground/80 uppercase">{entry.actor}</td>
                        </tr>
                      ))}
                   </tbody>
                </table>
             </div>
          </div>
        )}

        {activeView === 'settings' && (
           <div className="flex-1 overflow-y-auto p-6 max-w-2xl">
              <div className="space-y-12">
                 <section className="space-y-6">
                    <div className="flex items-center gap-3">
                       <Settings size={20} className="text-foreground/40" />
                       <h2 className="text-lg font-black uppercase tracking-tight">Global Safeguards</h2>
                    </div>
                    <div className="bg-secondary/20 border border-foreground/10 p-6 space-y-6">
                       <div>
                          <label className="block text-[10px] font-black uppercase tracking-widest mb-3">Universal Low-Stock Alert Trigger</label>
                          <div className="flex gap-2">
                             <input type="number" defaultValue="5" className="bg-white dark:bg-black border border-foreground/20 px-4 py-2 font-black text-sm w-24 outline-none focus:border-foreground" />
                             <span className="text-[10px] font-bold uppercase tracking-widest self-center text-foreground/40">Units remaining</span>
                          </div>
                          <p className="text-[9px] font-bold text-foreground/30 mt-3 uppercase tracking-wide">Sets the default threshold for all items unless overridden on the product page.</p>
                       </div>
                       <div className="pt-6 border-t border-foreground/10 flex items-center justify-between">
                          <div className="space-y-1">
                             <h4 className="text-[10px] font-black uppercase tracking-widest">In-App Notifications</h4>
                             <p className="text-[9px] font-bold text-foreground/30 uppercase">Alert the dashboard icon when items hit threshold.</p>
                          </div>
                          <div className="w-10 h-5 bg-foreground relative">
                             <div className="absolute right-0.5 top-0.5 w-4 h-4 bg-background"></div>
                          </div>
                       </div>
                    </div>
                 </section>

                 <section className="space-y-6">
                    <div className="flex items-center gap-3">
                       <Layers size={20} className="text-foreground/40" />
                       <h2 className="text-lg font-black uppercase tracking-tight">Bundle Configuration Engine</h2>
                    </div>
                    <div className="bg-secondary/20 border border-foreground/10 p-6">
                       <div className="space-y-4">
                          <p className="text-xs font-bold text-foreground/60 leading-relaxed uppercase tracking-wide">
                            Configure virtual parent items linked to multiple component SKUs.
                          </p>
                          <button className="flex items-center gap-2 px-4 py-3 bg-black text-white text-[10px] font-black uppercase tracking-widest hover:bg-black/80 transition-all">
                            <Plus size={14} /> Create New Bundle
                          </button>
                       </div>
                    </div>
                 </section>
              </div>
           </div>
        )}
      </div>

      {/* Slide-out Adjustment Panel */}
      <BrutalistDrawer 
        isOpen={isAdjustmentOpen} 
        onClose={() => setIsAdjustmentOpen(false)}
      >
        <div className="p-8 flex-1 overflow-y-auto">
          <div className="flex justify-between items-start mb-12">
            <div>
              <h2 className="text-xl font-black uppercase tracking-tight mb-2">Adjust Inventory</h2>
              <p className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest">{selectedVariant?.sku}</p>
            </div>
            <button onClick={() => setIsAdjustmentOpen(false)} className="p-2 hover:bg-secondary transition-colors"><X size={20} /></button>
          </div>

          <div className="space-y-12">
            {/* Current Status Block */}
            <div className="grid grid-cols-2 gap-0 border border-foreground/10 divide-x divide-foreground/10 bg-white dark:bg-black/40">
              <div className="p-4 space-y-1">
                <span className="text-[9px] font-black uppercase tracking-widest text-foreground/40 block">Current Stock</span>
                <span className="text-2xl font-black">{selectedVariant?.onHand}</span>
              </div>
              <div className="p-4 space-y-1">
                <span className="text-[9px] font-black uppercase tracking-widest text-foreground/40 block">Reserved</span>
                <span className="text-2xl font-black">{selectedVariant?.committed}</span>
              </div>
            </div>

            {/* Adjustment Input Block */}
            <div className="space-y-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest opacity-40">Adjustment Method</label>
                <div className="grid grid-cols-2 gap-2">
                  <button 
                    onClick={() => setAdjustmentMode('relative')}
                    className={`p-4 border-2 flex flex-col items-start gap-2 transition-all ${adjustmentMode === 'relative' ? 'border-foreground bg-foreground text-background' : 'border-foreground/10 hover:border-foreground/30 text-foreground/60'}`}
                  >
                    <Plus size={16} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Add / Remove</span>
                  </button>
                  <button 
                    onClick={() => setAdjustmentMode('absolute')}
                    className={`p-4 border-2 flex flex-col items-start gap-2 transition-all ${adjustmentMode === 'absolute' ? 'border-foreground bg-foreground text-background' : 'border-foreground/10 hover:border-foreground/30 text-foreground/60'}`}
                  >
                    <Check size={16} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Set Exact</span>
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                  <div className="flex justify-between items-end">
                    <label className="text-[10px] font-black uppercase tracking-widest opacity-40">
                      {adjustmentMode === 'relative' ? "How many units to add or subtract?" : "What is the new total stock level?"}
                    </label>
                  </div>
                  <div className="relative">
                    <input 
                      type="number" 
                      value={adjustmentValue}
                      onChange={(e) => setAdjustmentValue(e.target.value)}
                      placeholder={adjustmentMode === 'relative' ? "e.g. 10 or -5" : "e.g. 100"}
                      className="w-full bg-secondary/30 border-b-4 border-foreground p-6 font-display text-4xl font-black outline-none transition-all placeholder:text-foreground/10"
                    />
                  </div>
                  <p className="text-[9px] font-bold text-foreground/40 uppercase tracking-widest leading-relaxed">
                    {adjustmentMode === 'relative' 
                      ? "Use positive numbers to add stock, and negative numbers (e.g. -5) to remove it."
                      : "This will override the current stock level with this exact number."}
                  </p>
              </div>
            </div>

            {/* Summary / Result Box */}
            <div className="p-6 bg-secondary/20 border border-foreground/10 space-y-4">
              <div className="flex justify-between items-center">
                <div className="space-y-1">
                  <span className="text-[10px] font-black uppercase tracking-widest text-foreground/40 block">New Available Stock</span>
                  <div className="flex items-center gap-3">
                    <span className="text-xl font-black">
                      {adjustmentValue ? (adjustmentMode === 'relative' ? selectedVariant?.available + parseInt(adjustmentValue) : parseInt(adjustmentValue) - selectedVariant?.committed) : selectedVariant?.available}
                    </span>
                    <span className="text-[10px] font-bold text-foreground/20 uppercase tracking-widest">Units</span>
                  </div>
                </div>
                <div className={`w-12 h-12 flex items-center justify-center border-2 ${adjustmentValue ? 'border-foreground animate-pulse' : 'border-foreground/10 opacity-20'}`}>
                  <ArrowRight size={20} />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-8 border-t border-foreground/10 bg-secondary/10 flex gap-3">
          <button 
            onClick={() => setIsAdjustmentOpen(false)}
            className="flex-1 py-4 text-[10px] font-black uppercase tracking-widest hover:bg-black/5 transition-colors border border-foreground/10"
          >
            Cancel
          </button>
          <button 
            onClick={handleSaveAdjustment}
            className="flex-1 py-4 bg-black text-white text-[10px] font-black uppercase tracking-widest hover:bg-black/80 transition-colors flex items-center justify-center gap-2"
          >
            <Save size={14} /> Update Inventory
          </button>
        </div>
      </BrutalistDrawer>
    </div>
  );
}
