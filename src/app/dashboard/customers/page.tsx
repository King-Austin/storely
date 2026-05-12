"use client";

import { useState } from 'react';
import { 
  Search, Filter, ArrowUpDown, Plus, 
  MoreHorizontal, User, Mail, MapPin,
  ChevronRight, AlertCircle, ShoppingBag,
  DollarSign, TrendingUp
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import BrutalistModal from '@/components/BrutalistModal';

const mockCustomers = [
  { id: 'u1', name: 'Alex Rivera', email: 'alex@rivera.com', orders: 12, spent: '$1,240.00', location: 'New York, US', status: 'Active' },
  { id: 'u2', name: 'Jordan Smith', email: 'j.smith@void.com', orders: 4, spent: '$320.00', location: 'London, UK', status: 'New' },
  { id: 'u3', name: 'Casey Chen', email: 'casey.c@void.com', orders: 1, spent: '$145.00', location: 'Toronto, CA', status: 'New' },
  { id: 'u4', name: 'Riley Taylor', email: 'riley@taylor.tech', orders: 28, spent: '$5,600.00', location: 'Berlin, DE', status: 'VIP' },
  { id: 'u5', name: 'Morgan Lee', email: 'morgan@lee.com', orders: 0, spent: '$0.00', location: 'Seoul, KR', status: 'Prospect' },
];

export default function CustomersPage() {
  const [customerList, setCustomerList] = useState(mockCustomers);
  const [selectedCustomers, setSelectedCustomers] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<any>(null);

  const handleExport = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + ["ID,Name,Email,Orders,Spent,Location,Status"].join(",") + "\n"
      + filteredCustomers.map(c => `${c.id},${c.name},${c.email},${c.orders},${c.spent},${c.location},${c.status}`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "customers_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleAddCustomer = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newCustomer = {
      id: Math.random().toString(36).substr(2, 9),
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      orders: 0,
      spent: '$0.00',
      location: formData.get('location') as string || 'Unknown',
      status: 'New'
    };
    setCustomerList([newCustomer, ...customerList]);
    setIsAddModalOpen(false);
  };

  const handleEditCustomer = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingCustomer) return;
    const formData = new FormData(e.currentTarget);
    setCustomerList(prev => prev.map(c => {
      if (c.id === editingCustomer.id) {
        return {
          ...c,
          name: formData.get('name') as string,
          email: formData.get('email') as string,
          location: formData.get('location') as string || c.location,
        };
      }
      return c;
    }));
    toast.success('Customer profile updated!');
    setEditingCustomer(null);
  };

  const filteredCustomers = customerList.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchQuery.toLowerCase()) || customer.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === 'All' || 
                      (activeTab === 'New' && customer.status === 'New') ||
                      (activeTab === 'VIP' && customer.status === 'VIP') ||
                      (activeTab === 'Prospect' && customer.status === 'Prospect');
    return matchesSearch && matchesTab;
  });

  const toggleSelect = (id: string) => {
    setSelectedCustomers(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedCustomers.length === filteredCustomers.length) {
      setSelectedCustomers([]);
    } else {
      setSelectedCustomers(filteredCustomers.map(c => c.id));
    }
  };

  return (
    <div className="p-6 lg:p-10 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-black uppercase tracking-tight">Customers</h1>
        <div className="flex gap-2">
          <button 
            onClick={handleExport}
            className="flex items-center gap-2 px-3 py-1.5 bg-secondary hover:bg-black/5 text-xs font-bold uppercase tracking-widest transition-colors"
          >
            Export
          </button>
          <button onClick={() => toast('Import feature coming soon!')} className="flex items-center gap-2 px-3 py-1.5 bg-secondary hover:bg-black/5 text-xs font-bold uppercase tracking-widest transition-colors border-l border-foreground/5">
            <User size={14} /> Import
          </button>
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 bg-foreground text-background hover:bg-foreground/90 text-xs font-black uppercase tracking-widest transition-all shadow-sm"
          >
            Add Customer
          </button>
        </div>
      </div>

      {/* Add / Edit Customer Modal */}
      <BrutalistModal 
        isOpen={isAddModalOpen || !!editingCustomer} 
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingCustomer(null);
        }}
        title={editingCustomer ? "Edit Profile" : "Register Customer"}
      >
        <form onSubmit={editingCustomer ? handleEditCustomer : handleAddCustomer} className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-widest opacity-40">Full Name</label>
            <input required name="name" defaultValue={editingCustomer?.name || ""} className="w-full bg-secondary/20 border-2 border-foreground p-3 text-xs font-black uppercase outline-none" placeholder="JOHN DOE" />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-widest opacity-40">Email Address</label>
            <input required name="email" type="email" defaultValue={editingCustomer?.email || ""} className="w-full bg-secondary/20 border-2 border-foreground p-3 text-xs font-black uppercase outline-none" placeholder="JOHN@EXAMPLE.COM" />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-widest opacity-40">Location</label>
            <input name="location" defaultValue={editingCustomer?.location || ""} className="w-full bg-secondary/20 border-2 border-foreground p-3 text-xs font-black uppercase outline-none" placeholder="NEW YORK, US" />
          </div>
          <button type="submit" className="w-full py-4 bg-foreground text-background font-black text-xs uppercase tracking-widest hover:bg-foreground/90 transition-all">
            {editingCustomer ? "Save Changes" : "Create Profile"}
          </button>
        </form>
      </BrutalistModal>

      {/* CRM KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border border-foreground/10 divide-x divide-foreground/10 bg-white dark:bg-black/20">
        <div className="p-6 space-y-2">
          <div className="flex items-center gap-2 text-foreground/40">
            <User size={14} />
            <h3 className="text-[10px] font-black uppercase tracking-widest">Total Customers</h3>
          </div>
          <div className="flex items-end gap-2">
            <span className="text-2xl font-black">{customerList.length}</span>
            <span className="text-[10px] font-bold text-green-500 flex items-center mb-1">
              <TrendingUp size={10} className="mr-0.5" /> +12%
            </span>
          </div>
        </div>
        <div className="p-6 space-y-2">
          <div className="flex items-center gap-2 text-foreground/40">
            <ShoppingBag size={14} />
            <h3 className="text-[10px] font-black uppercase tracking-widest">Avg. Orders / Customer</h3>
          </div>
          <span className="text-2xl font-black">4.2</span>
        </div>
        <div className="p-6 space-y-2">
          <div className="flex items-center gap-2 text-foreground/40">
            <DollarSign size={14} />
            <h3 className="text-[10px] font-black uppercase tracking-widest">Avg. Lifetime Value</h3>
          </div>
          <span className="text-2xl font-black">$284.00</span>
        </div>
      </div>

      <div className="bg-white dark:bg-black/20 border border-foreground/10 overflow-hidden">
        <div className="flex flex-col sm:flex-row justify-between border-b border-foreground/10">
          <div className="flex items-center overflow-x-auto no-scrollbar">
            {['All', 'New', 'Returning', 'VIP', 'Prospect', 'Abandoned'].map((tab) => (
              <button 
                key={tab} 
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-4 text-[10px] font-black uppercase tracking-widest border-b-2 transition-colors whitespace-nowrap ${activeTab === tab ? 'border-foreground text-foreground' : 'border-transparent text-foreground/40 hover:text-foreground/60'}`}
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
                placeholder="Search customers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="py-4 pl-10 pr-4 text-[10px] font-black uppercase tracking-widest bg-transparent focus:outline-none w-48 lg:w-64"
              />
            </div>
            <button className="p-4 text-foreground/60 hover:text-foreground transition-colors"><Filter size={18} /></button>
          </div>
        </div>

        {selectedCustomers.length > 0 && (
          <div className="bg-secondary/50 px-4 py-3 border-b border-foreground/10 flex items-center justify-between animate-in fade-in slide-in-from-top-1">
            <span className="text-xs font-black uppercase tracking-widest text-foreground">{selectedCustomers.length} selected</span>
            <div className="flex items-center gap-1">
              <button onClick={() => {
                toast(`Exporting ${selectedCustomers.length} customers...`);
                setSelectedCustomers([]);
              }} className="px-3 py-1.5 bg-white dark:bg-black border border-foreground/10 text-[10px] font-black uppercase tracking-widest hover:bg-secondary transition-colors">Export Details</button>
              <button onClick={() => {
                toast(`Sending email to ${selectedCustomers.length} customers...`);
                setSelectedCustomers([]);
              }} className="px-3 py-1.5 bg-white dark:bg-black border border-foreground/10 text-[10px] font-black uppercase tracking-widest hover:bg-secondary transition-colors">Email Customers</button>
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
                    checked={selectedCustomers.length === filteredCustomers.length && filteredCustomers.length > 0} 
                    onChange={toggleSelectAll}
                    className="w-4 h-4 accent-foreground cursor-pointer" 
                  />
                </th>
                <th className="p-4 text-[10px] font-black uppercase tracking-widest text-foreground/40">Customer Name</th>
                <th className="p-4 text-[10px] font-black uppercase tracking-widest text-foreground/40">Email</th>
                <th className="p-4 text-[10px] font-black uppercase tracking-widest text-foreground/40 text-center">Orders</th>
                <th className="p-4 text-[10px] font-black uppercase tracking-widest text-foreground/40 text-right">Total Spent</th>
                <th className="p-4 text-[10px] font-black uppercase tracking-widest text-foreground/40">Location</th>
                <th className="p-4 text-[10px] font-black uppercase tracking-widest text-foreground/40 text-center">Status</th>
                <th className="p-4 w-10"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-foreground/5">
              {filteredCustomers.length > 0 ? (
                filteredCustomers.map((customer) => (
                  <tr 
                    key={customer.id} 
                    onClick={() => setEditingCustomer(customer)}
                    className={`hover:bg-secondary/10 transition-colors group cursor-pointer ${selectedCustomers.includes(customer.id) ? 'bg-secondary/5' : ''}`}
                  >
                    <td className="p-4" onClick={(e) => e.stopPropagation()}>
                      <input 
                        type="checkbox" 
                        checked={selectedCustomers.includes(customer.id)}
                        onChange={() => toggleSelect(customer.id)}
                        className="w-4 h-4 accent-foreground cursor-pointer" 
                      />
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                         <div className="w-8 h-8 bg-foreground text-background flex items-center justify-center text-[10px] font-black uppercase tracking-tighter">
                           {customer.name.split(' ').map(n => n[0]).join('')}
                         </div>
                         <span className="text-xs font-black uppercase tracking-tight group-hover:underline underline-offset-4 decoration-foreground/20">{customer.name}</span>
                      </div>
                    </td>
                    <td className="p-4 text-xs font-medium text-foreground/60 lowercase">{customer.email}</td>
                    <td className="p-4 text-center text-xs font-bold">{customer.orders}</td>
                    <td className="p-4 text-right text-xs font-black tracking-tight">{customer.spent}</td>
                    <td className="p-4 text-[10px] font-bold text-foreground/40 uppercase tracking-widest">
                       <div className="flex items-center gap-1.5">
                         <MapPin size={12} className="text-foreground/20" />
                         {customer.location}
                       </div>
                    </td>
                    <td className="p-4 text-center">
                       <span className={`inline-block px-2 py-0.5 text-[9px] font-black uppercase tracking-widest border ${
                        customer.status === 'VIP' ? 'bg-purple-100 text-purple-700 border-purple-200' : 
                        customer.status === 'Active' ? 'bg-green-100 text-green-700 border-green-200' : 
                        customer.status === 'New' ? 'bg-blue-100 text-blue-700 border-blue-200' : 
                        'bg-gray-100 text-gray-700 border-gray-200'
                      }`}>
                        {customer.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="p-24 text-center">
                    <AlertCircle size={40} className="mx-auto text-foreground/10 mb-4" />
                    <p className="font-display text-2xl font-black uppercase tracking-tight text-foreground/20">No customers found</p>
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
