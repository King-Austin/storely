"use client";

import { useState } from 'react';
import { 
  Search, Filter, ArrowUpDown, Truck, 
  Package, CheckCircle2, Clock, AlertTriangle,
  ChevronRight, Printer, MapPin, ExternalLink,
  MoreHorizontal
} from 'lucide-react';
import { toast } from 'sonner';
import BrutalistModal from '@/components/BrutalistModal';

const mockFulfillments = [
  { id: 'f1', orderId: '#1001', customer: 'Alex Rivera', destination: 'New York, US', status: 'In Queue', items: 1, shippingMethod: 'Standard' },
  { id: 'f2', orderId: '#1002', customer: 'Jordan Smith', destination: 'London, UK', status: 'Processing', items: 2, shippingMethod: 'Express' },
  { id: 'f3', orderId: '#1004', customer: 'Riley Taylor', destination: 'Berlin, DE', status: 'Ready to Ship', items: 3, shippingMethod: 'International' },
  { id: 'f4', orderId: '#1005', customer: 'Morgan Lee', destination: 'Seoul, KR', status: 'Processing', items: 1, shippingMethod: 'Standard' },
];

export default function FulfillmentPage() {
  const [fulfillmentList, setFulfillmentList] = useState(mockFulfillments);

  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('All');

  const filteredFulfillments = fulfillmentList.filter(f => {
    const matchesSearch = f.customer.toLowerCase().includes(searchQuery.toLowerCase()) || f.orderId.includes(searchQuery);
    const matchesTab = activeTab === 'All' || f.status === activeTab;
    return matchesSearch && matchesTab;
  });

  return (
    <div className="p-6 lg:p-10 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black uppercase tracking-tight">Delivery & Logistics Tracker</h1>
          <p className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest mt-1">Track active shipments and delivery status</p>
        </div>
        <div className="flex gap-2">
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-0 border border-foreground/10 divide-x divide-foreground/10 bg-white dark:bg-black/20">
        <div className="p-6 space-y-2">
          <div className="flex items-center gap-2 text-foreground/40 text-[10px] font-black uppercase tracking-widest">
            <Clock size={12} />
            To Fulfill
          </div>
          <span className="text-2xl font-black">{fulfillmentList.length}</span>
        </div>
        <div className="p-6 space-y-2">
          <div className="flex items-center gap-2 text-foreground/40 text-[10px] font-black uppercase tracking-widest">
            <CheckCircle2 size={12} />
            Delivered
          </div>
          <span className="text-2xl font-black text-green-500">18</span>
        </div>
        <div className="p-6 space-y-2">
          <div className="flex items-center gap-2 text-foreground/40 text-[10px] font-black uppercase tracking-widest">
            <Package size={12} />
            Packed Today
          </div>
          <span className="text-2xl font-black">24</span>
        </div>
        <div className="p-6 space-y-2">
          <div className="flex items-center gap-2 text-foreground/40 text-[10px] font-black uppercase tracking-widest">
            <Truck size={12} />
            In Transit
          </div>
          <span className="text-2xl font-black text-blue-500">156</span>
        </div>
      </div>

      <div className="bg-white dark:bg-black/20 border border-foreground/10 overflow-hidden">
        <div className="flex flex-col sm:flex-row justify-between border-b border-foreground/10">
          <div className="flex items-center">
            {['All', 'In Queue', 'Processing', 'Ready to Ship', 'Shipped', 'Delivered'].map((tab) => (
              <button 
                key={tab} 
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-4 text-[10px] font-black uppercase tracking-widest border-b-2 transition-colors ${activeTab === tab ? 'border-foreground text-foreground' : 'border-transparent text-foreground/40 hover:text-foreground/60'}`}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="flex items-center border-l border-foreground/10 divide-x divide-foreground/10 shrink-0">
             <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/30" />
              <input 
                type="text" 
                placeholder="Search orders..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="py-4 pl-10 pr-4 text-[10px] font-black uppercase tracking-widest bg-transparent focus:outline-none w-48 lg:w-64"
              />
            </div>
          </div>
        </div>



        <div className="overflow-x-auto min-h-[400px]">
          <table className="w-full text-left border-collapse">
            <thead className="bg-secondary/20">
              <tr className="border-b border-foreground/10">
                <th className="p-4 text-[10px] font-black uppercase tracking-widest text-foreground/40">Order</th>
                <th className="p-4 text-[10px] font-black uppercase tracking-widest text-foreground/40">Customer</th>
                <th className="p-4 text-[10px] font-black uppercase tracking-widest text-foreground/40">Method</th>
                <th className="p-4 text-[10px] font-black uppercase tracking-widest text-foreground/40 text-center">Status</th>
                <th className="p-4 text-[10px] font-black uppercase tracking-widest text-foreground/40">Destination</th>
                <th className="p-4 w-10"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-foreground/5">
              {filteredFulfillments.map((f) => (
                <tr key={f.id} className="hover:bg-secondary/10 transition-colors group">
                  <td className="p-4">
                    <div className="flex flex-col">
                      <span className="text-xs font-black uppercase tracking-tight mb-0.5">{f.orderId}</span>
                      <span className="text-[9px] font-bold text-foreground/40 uppercase tracking-widest">{f.items} Item{f.items > 1 ? 's' : ''}</span>
                    </div>
                  </td>
                  <td className="p-4 text-xs font-black uppercase tracking-tight">{f.customer}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-foreground/60 uppercase">
                      <Truck size={12} className="text-foreground/20" />
                      {f.shippingMethod}
                    </div>
                  </td>
                  <td className="p-4 text-center">
                    <span className={`inline-block px-2 py-0.5 text-[9px] font-black uppercase tracking-widest border ${
                      f.status === 'Delivered' ? 'bg-green-100 text-green-700 border-green-200' : 
                      f.status === 'Shipped' ? 'bg-blue-100 text-blue-700 border-blue-200' : 
                      f.status === 'Ready to Ship' ? 'bg-yellow-100 text-yellow-700 border-yellow-200' : 
                      f.status === 'Processing' ? 'bg-orange-100 text-orange-700 border-orange-200' : 
                      'bg-gray-100 text-gray-700 border-gray-200'
                    }`}>
                      {f.status}
                    </span>
                  </td>
                  <td className="p-4 text-[10px] font-bold text-foreground/40 uppercase tracking-widest">
                    <div className="flex items-center gap-1.5">
                      <MapPin size={12} className="text-foreground/20" />
                      {f.destination}
                    </div>
                  </td>
                  <td className="p-4">
                    <button className="text-foreground/20 group-hover:text-foreground transition-colors">
                      <ChevronRight size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
