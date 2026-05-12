"use client";

import { useState } from 'react';
import { 
  CreditCard, Landmark, ArrowRight, 
  History, AlertCircle, CheckCircle2,
  DollarSign, ArrowUpRight, TrendingUp,
  Info, ShieldCheck, Wallet
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

export default function WithdrawalsPage() {
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [isSavingBank, setIsSavingBank] = useState(false);
  
  const availableBalance = 4280.50;
  const withdrawalFeePercent = 4.5;

  const handleSaveBank = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingBank(true);
    setTimeout(() => {
      toast.success('Bank details updated successfully');
      setIsSavingBank(false);
    }, 800);
  };

  return (
    <div className="p-6 lg:p-10 space-y-10 bg-white dark:bg-black/20 min-h-full">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-6">
          <h1 className="text-2xl font-black uppercase tracking-tight">Withdrawals</h1>
          <a 
            href="/dashboard/financials/withdrawals/history" 
            className="px-4 py-2 border-2 border-foreground font-black text-[10px] uppercase tracking-widest hover:bg-foreground hover:text-background transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
          >
            View History
          </a>
        </div>
        <div className="bg-green-100 text-green-700 px-3 py-1 border border-green-200 flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-[10px] font-black uppercase tracking-widest">Incoming: $240.50 today</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Balance & Withdraw */}
        <div className="lg:col-span-7 space-y-8">
          {/* Balance Card */}
          <div className="bg-foreground text-background p-8 border-2 border-foreground shadow-[8px_8px_0px_0px_rgba(0,0,0,0.2)]">
            <h2 className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60 mb-2">Available Balance</h2>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-black">${availableBalance.toLocaleString()}</span>
              <span className="text-sm font-bold opacity-40 uppercase tracking-widest">USD</span>
            </div>
            <div className="mt-8 pt-6 border-t border-background/10 flex items-center gap-4">
              <div className="flex-1">
                <p className="text-[10px] font-black uppercase opacity-40">Withdrawal Fee</p>
                <p className="text-lg font-black">{withdrawalFeePercent}%</p>
              </div>
              <div className="flex-1">
                <p className="text-[10px] font-black uppercase opacity-40">Processing Time</p>
                <p className="text-lg font-black">1-3 Days</p>
              </div>
            </div>
          </div>

          {/* Automatic Settlement Status */}
          <div className="bg-white dark:bg-black border-2 border-foreground p-8 space-y-6">
            <div className="flex justify-between items-start">
              <h3 className="text-xl font-black uppercase tracking-tight italic flex items-center gap-2">
                <CheckCircle2 size={24} className="text-green-600" /> Automatic Payouts
              </h3>
              <span className="text-[10px] font-black uppercase tracking-widest px-2 py-1 bg-green-100 text-green-700 border border-green-200">Active</span>
            </div>
            
            <p className="text-xs font-bold text-foreground/60 uppercase leading-relaxed">
              Your balance is automatically settled to your bank account every <span className="text-foreground font-black">24 hours</span>. No manual action is required.
            </p>

            <div className="p-6 bg-secondary/20 border-2 border-foreground space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-black uppercase tracking-widest opacity-40">Next Automatic Sweep</span>
                <span className="text-sm font-black uppercase tracking-tight italic">Tomorrow, 08:00 AM</span>
              </div>
              <div className="h-px bg-foreground/10 w-full"></div>
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-black uppercase tracking-widest opacity-40">Estimated Transfer</span>
                <span className="text-sm font-black uppercase tracking-tight text-green-600">${(availableBalance * 0.955).toFixed(2)}</span>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 p-4 flex gap-3 items-start">
              <Info size={18} className="text-yellow-600 shrink-0" />
              <p className="text-[9px] font-bold text-yellow-700 uppercase leading-relaxed">
                A 4.5% withdrawal fee is automatically deducted from every settlement. Ensure your bank details are correct to avoid delays.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Bank Details */}
        <div className="lg:col-span-5 space-y-8">
          <div className="bg-white dark:bg-black border-2 border-foreground p-8 space-y-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <h3 className="text-xl font-black uppercase tracking-tight italic flex items-center gap-2">
              <Landmark size={24} /> Settlement Account
            </h3>
            
            <form onSubmit={handleSaveBank} className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-foreground/40">Bank Name</label>
                <input 
                  type="text"
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  placeholder="E.G. UNITED BANK FOR AFRICA"
                  className="w-full bg-secondary/20 border-2 border-foreground p-4 text-xs font-black uppercase tracking-widest outline-none focus:bg-background transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-foreground/40">Account Number</label>
                <input 
                  type="text"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  placeholder="10 DIGIT ACCOUNT NUMBER"
                  className="w-full bg-secondary/20 border-2 border-foreground p-4 text-xs font-black uppercase tracking-widest outline-none focus:bg-background transition-all"
                />
              </div>
              <button 
                type="submit"
                disabled={isSavingBank}
                className="w-full py-4 border-2 border-foreground font-black uppercase tracking-widest text-xs hover:bg-foreground hover:text-background transition-all"
              >
                {isSavingBank ? 'SAVING...' : 'Update Bank Details'}
              </button>
            </form>

            <div className="pt-4 border-t border-foreground/5 flex gap-3 items-start">
              <ShieldCheck size={18} className="text-foreground/40 shrink-0" />
              <p className="text-[9px] font-bold text-foreground/40 uppercase leading-relaxed">
                Your bank details are encrypted and stored securely. Payouts are only sent to verified accounts in your legal name.
              </p>
            </div>
          </div>

          <div className="p-6 border-2 border-dashed border-foreground/10 space-y-4">
            <h4 className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
              <Info size={14} /> Withdrawal Policy
            </h4>
            <ul className="space-y-2">
              <li className="text-[9px] font-bold text-foreground/40 uppercase flex items-center gap-2">
                <div className="w-1 h-1 bg-foreground/20 rounded-full"></div>
                Minimum withdrawal amount is $10.00
              </li>
              <li className="text-[9px] font-bold text-foreground/40 uppercase flex items-center gap-2">
                <div className="w-1 h-1 bg-foreground/20 rounded-full"></div>
                4.5% flat fee applied to all bank settlements
              </li>
              <li className="text-[9px] font-bold text-foreground/40 uppercase flex items-center gap-2">
                <div className="w-1 h-1 bg-foreground/20 rounded-full"></div>
                Settlements processed within 24-72 hours
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
