"use client";

import { useState } from 'react';
import { 
  Globe, Search, Plus, 
  CheckCircle2, AlertCircle, 
  ArrowRight, ExternalLink,
  ShieldCheck, History,
  Globe2, Check, DollarSign,
  Link as LinkIcon, Trash2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import BrutalistModal from '@/components/BrutalistModal';

interface Domain {
  name: string;
  tld: string;
  status: 'Available' | 'Taken' | 'Purchased';
  price: string;
}

interface UserDomain {
  id: string;
  name: string;
  tld: string;
  purchasedAt: string;
  isConnected: boolean;
}

const TLD_PRICES: Record<string, string> = {
  '.store': '$4.99 / year',
  '.com': '$12.99 / year',
  '.com.ng': '$3.50 / year',
};

export default function DomainsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<Domain[]>([]);
  const [userDomains, setUserDomains] = useState<UserDomain[]>([
    { id: '1', name: 'my-store', tld: '.store', purchasedAt: 'Oct 12, 2025', isConnected: true },
  ]);
  const [selectedDomain, setSelectedDomain] = useState<Domain | null>(null);
  const [isBuyModalOpen, setIsBuyModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [domainToDelete, setDomainToDelete] = useState<UserDomain | null>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery) return;
    
    setIsSearching(true);
    // Mock API delay
    setTimeout(() => {
      const cleanName = searchQuery.split('.')[0].toLowerCase().replace(/[^a-z0-9]/g, '');
      const results: Domain[] = [
        { name: cleanName, tld: '.store', status: 'Available', price: TLD_PRICES['.store'] },
        { name: cleanName, tld: '.com', status: Math.random() > 0.5 ? 'Available' : 'Taken', price: TLD_PRICES['.com'] },
        { name: cleanName, tld: '.com.ng', status: 'Available', price: TLD_PRICES['.com.ng'] },
      ];
      setSearchResults(results);
      setIsSearching(false);
    }, 800);
  };

  const handleBuyClick = (domain: Domain) => {
    setSelectedDomain(domain);
    setIsBuyModalOpen(true);
  };

  const confirmPurchase = () => {
    if (!selectedDomain) return;
    
    const newDomain: UserDomain = {
      id: Math.random().toString(36).substr(2, 9),
      name: selectedDomain.name,
      tld: selectedDomain.tld,
      purchasedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      isConnected: false,
    };
    
    setUserDomains([newDomain, ...userDomains]);
    setIsBuyModalOpen(false);
    toast.success(`${selectedDomain.name}${selectedDomain.tld} purchased successfully!`);
    setSelectedDomain(null);
    setSearchQuery('');
    setSearchResults([]);
  };

  const toggleConnection = (id: string) => {
    setUserDomains(prev => prev.map(d => {
      if (d.id === id) {
        const newState = !d.isConnected;
        toast.info(newState ? `Connecting ${d.name}${d.tld}...` : `Disconnecting ${d.name}${d.tld}...`);
        return { ...d, isConnected: newState };
      }
      return d;
    }));
  };

  const handleDeleteClick = (domain: UserDomain) => {
    setDomainToDelete(domain);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (!domainToDelete) return;
    setUserDomains(prev => prev.filter(d => d.id !== domainToDelete.id));
    toast.error(`${domainToDelete.name}${domainToDelete.tld} deleted.`);
    setIsDeleteModalOpen(false);
    setDomainToDelete(null);
  };

  return (
    <div className="p-6 lg:p-10 space-y-10 bg-white dark:bg-black/20 min-h-full">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-black uppercase tracking-tight">Domain Management</h1>
      </div>

      {/* Buy Modal */}
      <BrutalistModal 
        isOpen={isBuyModalOpen} 
        onClose={() => setIsBuyModalOpen(false)}
        title="Purchase Domain"
        maxWidth="max-w-md"
      >
        <div className="space-y-6">
          <div className="p-6 bg-secondary/20 border-2 border-foreground space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-black uppercase tracking-tight">{selectedDomain?.name}{selectedDomain?.tld}</h3>
                <p className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest">Yearly Subscription • Auto-renews</p>
              </div>
              <span className="text-xl font-black">{selectedDomain?.price}</span>
            </div>
            <div className="h-px bg-foreground/10 w-full"></div>
            <div className="flex justify-between text-sm font-bold uppercase">
              <span>Subtotal</span>
              <span>{selectedDomain?.price}</span>
            </div>
            <div className="flex justify-between text-sm font-bold uppercase">
              <span>Tax (0%)</span>
              <span>$0.00</span>
            </div>
            <div className="h-px bg-foreground/20 w-full border-dashed border-t"></div>
            <div className="flex justify-between text-lg font-black uppercase">
              <span>Total Due</span>
              <span>{selectedDomain?.price}</span>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 p-4 flex gap-3 items-start">
            <ShieldCheck size={18} className="text-yellow-600 shrink-0" />
            <p className="text-[9px] font-bold text-yellow-700 uppercase leading-relaxed">
              Domains are registered immediately. No refunds are available for domain registrations as per ICANN policy.
            </p>
          </div>

          <button 
            onClick={confirmPurchase}
            className="w-full py-4 bg-foreground text-background font-black text-xs uppercase tracking-widest hover:bg-foreground/90 transition-all flex items-center justify-center gap-2"
          >
            Confirm Purchase & Register
          </button>
        </div>
      </BrutalistModal>

      {/* Delete Confirmation Modal */}
      <BrutalistModal 
        isOpen={isDeleteModalOpen} 
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirm Deletion"
        maxWidth="max-w-sm"
      >
        <div className="space-y-6">
          <div className="p-6 bg-red-50 border-2 border-red-500 space-y-4">
            <div className="flex gap-3 items-start">
              <AlertCircle size={24} className="text-red-500 shrink-0" />
              <p className="text-xs font-black uppercase leading-relaxed text-red-600">
                Are you sure you want to delete <span className="underline decoration-2">{domainToDelete?.name}{domainToDelete?.tld}</span>? 
                This action is irreversible and will disconnect your website immediately.
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <button 
              onClick={() => setIsDeleteModalOpen(false)}
              className="flex-1 py-4 border-2 border-foreground font-black text-xs uppercase tracking-widest hover:bg-secondary transition-all"
            >
              Cancel
            </button>
            <button 
              onClick={confirmDelete}
              className="flex-1 py-4 bg-red-500 text-white font-black text-xs uppercase tracking-widest hover:bg-red-600 transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
            >
              Delete
            </button>
          </div>
        </div>
      </BrutalistModal>

      {/* Search Section */}
      <div className="space-y-6">
        <div className="bg-white dark:bg-black border-2 border-foreground shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8">
          <h2 className="text-xl font-black uppercase tracking-tighter mb-6 flex items-center gap-2 italic">
            <Globe2 size={24} /> Register New Domain
          </h2>
          
          <form onSubmit={handleSearch} className="flex gap-4">
            <div className="relative flex-1">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/30" />
              <input 
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="SEARCH FOR YOUR BRAND NAME..."
                className="w-full bg-secondary/20 border-2 border-foreground p-4 pl-12 text-sm font-black uppercase tracking-widest outline-none focus:bg-background transition-all"
              />
            </div>
            <button 
              type="submit"
              disabled={isSearching}
              className="bg-foreground text-background px-8 font-black uppercase tracking-widest text-xs hover:bg-foreground/90 disabled:opacity-50 transition-all"
            >
              {isSearching ? 'CHECKING...' : 'SEARCH'}
            </button>
          </form>

          {/* Search Results */}
          <AnimatePresence>
            {searchResults.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-8 divide-y divide-foreground/10 border-t border-foreground/10"
              >
                {searchResults.map((result, idx) => (
                  <div key={idx} className="py-4 flex items-center justify-between group">
                    <div className="flex items-center gap-3">
                      <span className="text-lg font-black uppercase tracking-tight">{result.name}{result.tld}</span>
                      {result.status === 'Taken' ? (
                        <span className="text-[9px] font-black uppercase tracking-widest px-1.5 py-0.5 bg-red-100 text-red-600 border border-red-200">Taken</span>
                      ) : (
                        <span className="text-[9px] font-black uppercase tracking-widest px-1.5 py-0.5 bg-green-100 text-green-600 border border-green-200">Available</span>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-6">
                      <span className="text-sm font-black tracking-tight">{result.price}</span>
                      <button 
                        disabled={result.status === 'Taken'}
                        onClick={() => handleBuyClick(result)}
                        className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest border-2 border-foreground transition-all ${
                          result.status === 'Taken' 
                            ? 'opacity-20 cursor-not-allowed' 
                            : 'bg-foreground text-background hover:bg-background hover:text-foreground'
                        }`}
                      >
                        {result.status === 'Taken' ? 'UNAVAILABLE' : 'BUY NOW'}
                      </button>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Your Domains Section */}
      <div className="space-y-6">
        <h2 className="text-xs font-black uppercase tracking-[0.2em] text-foreground/40">Connected Domains</h2>
        
        <div className="grid grid-cols-1 gap-4">
          {userDomains.map((domain) => (
            <div 
              key={domain.id}
              className="bg-white dark:bg-black/40 border-2 border-foreground/10 p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-foreground/30 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-secondary flex items-center justify-center border border-foreground/5">
                  <Globe size={20} className="text-foreground/40" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-black uppercase tracking-tight">{domain.name}{domain.tld}</h3>
                    {domain.isConnected && (
                      <span className="text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 bg-green-100 text-green-600 border border-green-200">Primary</span>
                    )}
                  </div>
                  <p className="text-[9px] font-bold text-foreground/30 uppercase tracking-widest mt-1">Purchased {domain.purchasedAt}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button 
                  onClick={() => toggleConnection(domain.id)}
                  className={`flex-1 md:flex-none px-6 py-3 text-[10px] font-black uppercase tracking-widest border-2 transition-all flex items-center justify-center gap-2 ${
                    domain.isConnected 
                      ? 'border-red-500 text-red-500 hover:bg-red-500 hover:text-white' 
                      : 'border-foreground text-foreground hover:bg-foreground hover:text-background'
                  }`}
                >
                  {domain.isConnected ? 'Disconnect Website' : 'Connect to Website'}
                </button>
                <button 
                  onClick={() => handleDeleteClick(domain)}
                  className="p-3 border-2 border-foreground/10 hover:border-red-500 hover:text-red-500 transition-all text-foreground/40"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}

          {userDomains.length === 0 && (
            <div className="py-20 border-2 border-dashed border-foreground/10 flex flex-col items-center justify-center text-center">
              <Globe size={48} className="text-foreground/10 mb-4" />
              <p className="text-sm font-black uppercase tracking-widest text-foreground/20">No domains found. Start by searching above.</p>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}


