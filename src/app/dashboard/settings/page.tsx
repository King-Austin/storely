"use client";

import { useState } from 'react';
import { Save, Building2, CreditCard, Users, Bell, Shield, Package, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

const TABS = [
  { id: 'general', label: 'General', icon: Building2 },
  { id: 'billing', label: 'Billing', icon: CreditCard },
  { id: 'users', label: 'Users & Permissions', icon: Users },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'shipping', label: 'Shipping', icon: Package },
  { id: 'domains', label: 'Domains', icon: Globe },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('general');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast.success('Settings saved successfully!');
    }, 1000);
  };

  return (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto space-y-8 flex flex-col h-full">
      <div className="flex justify-between items-center shrink-0">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tight">Settings</h1>
          <p className="text-xs font-bold text-foreground/40 uppercase tracking-widest mt-1">Manage your store configuration</p>
        </div>
        <button 
          onClick={handleSave}
          className="flex items-center gap-2 px-6 py-3 bg-foreground text-background font-black text-xs uppercase tracking-widest hover:bg-foreground/90 transition-all shadow-sm"
        >
          {isSaving ? 'Saving...' : <><Save size={16} /> Save Changes</>}
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-8 flex-1 min-h-0">
        {/* Sidebar Nav */}
        <div className="w-full md:w-64 shrink-0 flex flex-col gap-2 overflow-y-auto custom-scrollbar pr-4">
          {TABS.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 p-4 border-2 transition-all text-left ${isActive ? 'bg-secondary border-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]' : 'border-transparent hover:bg-secondary/50 text-foreground/60 hover:text-foreground'}`}
              >
                <Icon size={18} />
                <span className="font-black text-xs uppercase tracking-widest">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-white border-2 border-foreground p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-y-auto custom-scrollbar">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-8"
            >
              {activeTab === 'general' && (
                <>
                  <div className="space-y-2 border-b-2 border-foreground/10 pb-6">
                    <h2 className="text-xl font-black uppercase tracking-tight">Store Details</h2>
                    <p className="text-xs font-bold text-foreground/50">Your customers will see this information.</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest">Store Name</label>
                      <input defaultValue="Storely" className="w-full p-4 bg-secondary/30 border border-foreground/20 font-black text-sm uppercase focus:outline-none focus:border-foreground" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest">Support Email</label>
                      <input defaultValue="support@storely.com" className="w-full p-4 bg-secondary/30 border border-foreground/20 font-bold text-sm focus:outline-none focus:border-foreground" />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-[10px] font-black uppercase tracking-widest">Store Industry</label>
                      <select className="w-full p-4 bg-secondary/30 border border-foreground/20 font-black text-sm uppercase focus:outline-none focus:border-foreground appearance-none">
                        <option>Apparel</option>
                        <option>Electronics</option>
                        <option>Beauty</option>
                        <option>Digital Goods</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2 border-b-2 border-foreground/10 pb-6 pt-6">
                    <h2 className="text-xl font-black uppercase tracking-tight">Store Currency</h2>
                    <p className="text-xs font-bold text-foreground/50">The currency your products are sold in.</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest">Primary Currency</label>
                    <select className="w-full p-4 bg-secondary/30 border border-foreground/20 font-black text-sm uppercase focus:outline-none focus:border-foreground appearance-none">
                      <option>USD - US Dollar</option>
                      <option>EUR - Euro</option>
                      <option>GBP - British Pound</option>
                    </select>
                  </div>
                </>
              )}

              {activeTab !== 'general' && (
                <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                  <Shield size={48} className="text-foreground/20" />
                  <h2 className="text-xl font-black uppercase tracking-tight">{TABS.find(t => t.id === activeTab)?.label} Settings</h2>
                  <p className="text-xs font-bold text-foreground/50">This section is currently under construction.</p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
