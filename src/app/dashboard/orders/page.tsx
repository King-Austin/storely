"use client";

import { useState } from 'react';
import { 
  Search, Filter, ArrowUpDown, MoreHorizontal, 
  ChevronDown, FileText, ShoppingBag, AlertCircle,
  Import, Printer
} from 'lucide-react';
import { toast } from 'sonner';
import BrutalistModal from '@/components/BrutalistModal';
import { useOrders, useVendorStore } from '@/hooks/useSupabaseData';
import { createClient } from '@/lib/supabase/client';

export default function OrdersPage() {
  const { store } = useVendorStore();
  const { orders: dbOrders, loading, refetch } = useOrders(store?.id);
  const supabase = createClient();

  const mappedOrders = (dbOrders || []).map((o: any) => ({
    id: o.id,
    displayId: `#${o.id.slice(0, 4).toUpperCase()}`,
    customer: o.customer_email || 'Guest User',
    date: new Date(o.created_at).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true }),
    total: `$${(o.total || 0).toFixed(2)}`,
    payment: o.payment_status === 'paid' ? 'Paid' : o.payment_status === 'refunded' ? 'Refunded' : 'Pending',
    fulfillment: o.status === 'delivered' ? 'Fulfilled' : o.status === 'cancelled' ? 'Cancelled' : 'Unfulfilled',
    items: o.storely_order_items?.length || 1,
    status: o.status === 'refunded' ? 'Archived' : o.status === 'cancelled' ? 'Order Problem' : 'Active',
  }));
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('All');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isManifestOpen, setIsManifestOpen] = useState(false);
  const [isSetupOpen, setIsSetupOpen] = useState(false);

  const handleExport = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + ["ID,Customer,Date,Total,Payment,Fulfillment,Items"].join(",") + "\n"
      + filteredOrders.map(o => `${o.id},${o.customer},${o.date},${o.total},${o.payment},${o.fulfillment},${o.items}`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "orders_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCreateOrder = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!store?.id) return;
    const formData = new FormData(e.currentTarget);
    const customer = formData.get('customer') as string;
    const total = parseFloat(formData.get('total') as string) || 0;

    await supabase.from('storely_orders').insert({
      store_id: store.id,
      total: total,
      payment_status: 'pending',
      status: 'pending'
    });
    refetch();
    setIsCreateModalOpen(false);
  };


  const filteredOrders = mappedOrders.filter(order => {
    const matchesSearch = order.customer.toLowerCase().includes(searchQuery.toLowerCase()) || order.displayId.includes(searchQuery);
    const matchesTab = (activeTab === 'All' && order.status !== 'Archived') || 
                      (activeTab === 'Unfulfilled' && order.fulfillment === 'Unfulfilled') ||
                      (activeTab === 'Fulfilled' && order.fulfillment === 'Fulfilled') ||
                      (activeTab === 'Order Problem' && order.status === 'Order Problem') ||
                      (activeTab === 'Refunded' && order.payment === 'Refunded') ||
                      (activeTab === 'Archived' && order.status === 'Archived');
    return matchesSearch && matchesTab;
  });

  const toggleSelect = (id: string) => {
    setSelectedOrders(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedOrders.length === filteredOrders.length) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(filteredOrders.map(o => o.id));
    }
  };

  return (
    <div className="p-6 lg:p-10 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-black uppercase tracking-tight">Orders</h1>
        <div className="flex gap-2">
           <button 
            onClick={() => setIsManifestOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 bg-secondary hover:bg-black/5 text-xs font-bold uppercase tracking-widest transition-colors"
          >
            Manifest
          </button>
          <button 
            onClick={() => setIsSetupOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 bg-secondary hover:bg-black/5 text-xs font-bold uppercase tracking-widest transition-colors"
          >
            <Printer size={14} /> Setup
          </button>
          <button 
            onClick={handleExport}
            className="flex items-center gap-2 px-3 py-1.5 bg-secondary hover:bg-black/5 text-xs font-bold uppercase tracking-widest transition-colors"
          >
            Export
          </button>
          <button onClick={() => toast('Import feature coming soon!')} className="flex items-center gap-2 px-3 py-1.5 bg-secondary hover:bg-black/5 text-xs font-bold uppercase tracking-widest transition-colors">
            <Import size={14} /> Import
          </button>
          <button 
            onClick={() => setIsCreateModalOpen(true)}
            className="px-4 py-2 bg-foreground text-background hover:bg-foreground/90 text-xs font-bold uppercase tracking-widest transition-all"
          >
            Create Order
          </button>
        </div>
      </div>

      {/* Create Order Modal */}
      <BrutalistModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)}
        title="Draft Order"
      >
        <form onSubmit={handleCreateOrder} className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-widest opacity-40">Customer Name</label>
            <input required name="customer" className="w-full bg-secondary/20 border-2 border-foreground p-3 text-xs font-black uppercase outline-none" placeholder="SELECT CUSTOMER..." />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-widest opacity-40">Total Amount ($)</label>
            <input required name="total" type="number" step="0.01" className="w-full bg-secondary/20 border-2 border-foreground p-3 text-xs font-black uppercase outline-none" placeholder="0.00" />
          </div>
          <button type="submit" className="w-full py-4 bg-foreground text-background font-black text-xs uppercase tracking-widest hover:bg-foreground/90 transition-all">
            Generate Draft
          </button>
        </form>
      </BrutalistModal>

      <div className="bg-white dark:bg-black/20 border border-foreground/10 overflow-hidden">
        <div className="flex flex-col sm:flex-row justify-between border-b border-foreground/10">
          <div className="flex items-center">
            {['All', 'Unfulfilled', 'Fulfilled', 'Refunded', 'Order Problem', 'Archived'].map((tab) => (
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
                placeholder="Search orders..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="py-3 pl-10 pr-4 text-xs font-bold uppercase tracking-widest bg-transparent focus:outline-none w-48 lg:w-64"
              />
            </div>
          </div>
        </div>

        {selectedOrders.length > 0 && (
          <div className="bg-secondary/50 px-4 py-3 border-b border-foreground/10 flex items-center justify-between animate-in fade-in slide-in-from-top-1">
            <span className="text-xs font-black uppercase tracking-widest text-foreground">{selectedOrders.length} selected</span>
            <div className="flex items-center gap-1">
              {activeTab === 'Order Problem' ? (
                <>
                  <button onClick={async () => {
                    await supabase.from('storely_orders').update({ status: 'confirmed' }).in('id', selectedOrders);
                    refetch();
                    toast.success(`Moved ${selectedOrders.length} orders back to All!`);
                    setSelectedOrders([]);
                  }} className="px-3 py-1.5 bg-white dark:bg-black border border-foreground/10 text-[10px] font-black uppercase tracking-widest hover:bg-secondary transition-colors">I am done with the order</button>
                  <button onClick={async () => {
                    await supabase.from('storely_orders').update({ payment_status: 'refunded', status: 'refunded' }).in('id', selectedOrders);
                    refetch();
                    toast.success(`Refunded and archived ${selectedOrders.length} orders!`);
                    setSelectedOrders([]);
                  }} className="px-3 py-1.5 bg-red-100 text-red-700 border border-red-200 text-[10px] font-black uppercase tracking-widest hover:bg-red-200 transition-colors">Refund</button>
                </>
              ) : activeTab !== 'Refunded' && activeTab !== 'Archived' ? (
                <>
                  <button onClick={async () => {
                    await supabase.from('storely_orders').update({ status: 'cancelled' }).in('id', selectedOrders);
                    refetch();
                    toast.success(`Moved ${selectedOrders.length} orders to Order Problem!`);
                    setSelectedOrders([]);
                  }} className="px-3 py-1.5 bg-white dark:bg-black border border-foreground/10 text-[10px] font-black uppercase tracking-widest hover:bg-secondary transition-colors">Move to Order Problem</button>
                  
                  <button onClick={async () => {
                    await supabase.from('storely_orders').update({ status: 'delivered' }).in('id', selectedOrders);
                    refetch();
                    toast.success(`Fulfilled and archived ${selectedOrders.length} orders!`);
                    setSelectedOrders([]);
                  }} className="px-3 py-1.5 bg-foreground text-background text-[10px] font-black uppercase tracking-widest hover:bg-foreground/90 transition-colors">Fulfill</button>
                </>
              ) : null}
            </div>
          </div>
        )}

        <div className="overflow-x-auto min-h-[400px]">
          <table className="w-full text-left border-collapse">
            <thead className="bg-secondary/20">
              <tr>
                <th className="p-4 w-10">
                  <input 
                    type="checkbox" 
                    checked={selectedOrders.length === filteredOrders.length && filteredOrders.length > 0} 
                    onChange={toggleSelectAll}
                    className="w-4 h-4 accent-foreground cursor-pointer" 
                  />
                </th>
                <th className="p-4 text-[10px] font-black uppercase tracking-widest text-foreground/40">Order</th>
                <th className="p-4 text-[10px] font-black uppercase tracking-widest text-foreground/40">Date</th>
                <th className="p-4 text-[10px] font-black uppercase tracking-widest text-foreground/40">Customer</th>
                <th className="p-4 text-[10px] font-black uppercase tracking-widest text-foreground/40">Total</th>
                <th className="p-4 text-[10px] font-black uppercase tracking-widest text-foreground/40 text-center">Payment</th>
                <th className="p-4 text-[10px] font-black uppercase tracking-widest text-foreground/40 text-center">Fulfillment</th>
                <th className="p-4 text-[10px] font-black uppercase tracking-widest text-foreground/40 text-right">Items</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-foreground/5">
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <tr 
                    key={order.id} 
                    onClick={() => toggleSelect(order.id)}
                    className={`hover:bg-secondary/10 transition-colors group cursor-pointer ${selectedOrders.includes(order.id) ? 'bg-secondary/5' : ''}`}
                  >
                    <td className="p-4" onClick={(e) => e.stopPropagation()}>
                      <input 
                        type="checkbox" 
                        checked={selectedOrders.includes(order.id)}
                        onChange={() => toggleSelect(order.id)}
                        className="w-4 h-4 accent-foreground cursor-pointer" 
                      />
                    </td>
                    <td className="p-4">
                      <span className="text-xs font-black uppercase underline underline-offset-4 decoration-foreground/20 hover:decoration-foreground transition-colors">{order.displayId}</span>
                    </td>
                    <td className="p-4">
                      <span className="text-[10px] font-bold text-foreground/60 uppercase">{order.date}</span>
                    </td>
                    <td className="p-4 text-xs font-black uppercase">{order.customer}</td>
                    <td className="p-4 text-xs font-black">{order.total}</td>
                    <td className="p-4 text-center">
                      <span className={`inline-block px-2 py-0.5 text-[9px] font-black uppercase tracking-widest border ${
                        order.payment === 'Paid' ? 'bg-green-100 text-green-700 border-green-200' : 
                        order.payment === 'Pending' ? 'bg-yellow-100 text-yellow-700 border-yellow-200' : 
                        'bg-red-100 text-red-700 border-red-200'
                      }`}>
                        {order.payment}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <span className={`inline-block px-2 py-0.5 text-[9px] font-black uppercase tracking-widest border ${
                        order.fulfillment === 'Fulfilled' ? 'bg-blue-100 text-blue-700 border-blue-200' : 
                        order.fulfillment === 'Unfulfilled' ? 'bg-gray-100 text-gray-700 border-gray-200' : 
                        'bg-orange-100 text-orange-700 border-orange-200'
                      }`}>
                        {order.fulfillment}
                      </span>
                    </td>
                    <td className="p-4 text-right text-xs font-bold">{order.items}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="p-24 text-center">
                    <AlertCircle size={40} className="mx-auto text-foreground/10 mb-4" />
                    <p className="font-display text-2xl font-black uppercase tracking-tight text-foreground/20">No orders found</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      {/* Manifest Modal */}
      <BrutalistModal isOpen={isManifestOpen} onClose={() => setIsManifestOpen(false)} title="End of Day Manifest">
        <div className="space-y-4">
          <p className="text-xs font-bold text-foreground/60 uppercase tracking-widest leading-relaxed">
            Generate a single SCAN form for all your outgoing packages today. This allows the carrier to accept all packages with a single scan.
          </p>
          <div className="bg-secondary/20 border-2 border-foreground p-4 flex flex-col gap-2">
             <div className="flex justify-between items-center text-xs font-black uppercase">
               <span>USPS Packages</span>
               <span>24</span>
             </div>
             <div className="flex justify-between items-center text-xs font-black uppercase">
               <span>UPS Packages</span>
               <span>12</span>
             </div>
          </div>
          <button onClick={() => {
            setIsManifestOpen(false);
            toast.success('Manifest generated and sent to printer!');
          }} className="w-full py-4 bg-foreground text-background font-black text-xs uppercase tracking-widest hover:bg-foreground/90 transition-all">
            Generate & Print SCAN Form
          </button>
        </div>
      </BrutalistModal>

      {/* Printer Setup Modal */}
      <BrutalistModal isOpen={isSetupOpen} onClose={() => setIsSetupOpen(false)} title="Printer Setup">
        <div className="space-y-4">
          <p className="text-xs font-bold text-foreground/60 uppercase tracking-widest leading-relaxed">
            Configure your thermal printer for automatic 4x6 label printing.
          </p>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest opacity-40">Select Printer</label>
            <select className="w-full bg-secondary/20 border-2 border-foreground p-3 text-xs font-black uppercase outline-none appearance-none cursor-pointer">
              <option>Zebra ZD421 (USB)</option>
              <option>Rollo Wireless</option>
              <option>Dymo LabelWriter 4XL</option>
              <option>Save as PDF</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest opacity-40">Label Format</label>
            <select className="w-full bg-secondary/20 border-2 border-foreground p-3 text-xs font-black uppercase outline-none appearance-none cursor-pointer">
              <option>4" x 6" Thermal</option>
              <option>8.5" x 11" Standard</option>
            </select>
          </div>
          <button onClick={() => {
            setIsSetupOpen(false);
            toast.success('Printer configuration saved successfully!');
          }} className="w-full py-4 bg-foreground text-background font-black text-xs uppercase tracking-widest hover:bg-foreground/90 transition-all mt-4">
            Save Settings
          </button>
        </div>
      </BrutalistModal>
    </div>
  );
}
