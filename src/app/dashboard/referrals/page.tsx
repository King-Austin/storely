"use client";

import { useState } from 'react';
import { 
  Users, Gift, TrendingUp, Copy, 
  ExternalLink, Share2, DollarSign, 
  CheckCircle2, Clock, Calendar, 
  ArrowRight, Download, History,
  Wallet, Info, Landmark
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import BrutalistModal from '@/components/BrutalistModal';

interface Downline {
  id: string;
  name: string;
  email: string;
  plan: 'Basic' | 'Professional' | 'Business';
  price: number;
  dateJoined: string;
  commission: number;
}

interface PayoutRecord {
  id: string;
  amount: number;
  date: string;
  status: 'Paid' | 'Processing';
}

export default function ReferralProgramPage() {
  const referralLink = "https://storely.app/ref/my-unique-shop";
  
  const downlines: Downline[] = [
    { id: '1', name: 'Ayodeji Balogun', email: 'wiz@starboy.com', plan: 'Business', price: 50000, dateJoined: 'Oct 12, 2025', commission: 11500 },
    { id: '2', name: 'David Adeleke', email: 'obo@dmw.com', plan: 'Professional', price: 29000, dateJoined: 'Oct 15, 2025', commission: 6670 },
    { id: '3', name: 'Damini Ogulu', email: 'burna@giant.com', plan: 'Basic', price: 5200, dateJoined: 'Oct 20, 2025', commission: 1196 },
    { id: '4', name: 'Tiwa Savage', email: 'tiwa@mavin.com', plan: 'Business', price: 50000, dateJoined: 'Oct 22, 2025', commission: 11500 },
  ];

  const payoutHistory: PayoutRecord[] = [
    { id: 'P1', amount: 24500, date: 'Sep 30, 2025', status: 'Paid' },
    { id: 'P2', amount: 18200, date: 'Aug 31, 2025', status: 'Paid' },
  ];

  const totalDownlines = downlines.length;
  const monthlyRecurringRevenue = downlines.reduce((acc, curr) => acc + curr.commission, 0);
  const nextPayoutDate = 'Nov 30, 2025';

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink);
    toast.success('Referral link copied to clipboard');
  };

  return (
    <div className="p-6 lg:p-10 space-y-10 bg-white dark:bg-black/20 min-h-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-2xl font-black uppercase tracking-tight flex items-center gap-3">
            <Gift className="text-foreground" /> Referral Program
          </h1>
          <p className="text-[10px] font-bold uppercase tracking-widest text-foreground/40 mt-1">
            Earn 23% recurring commission for every friend you refer.
          </p>
        </div>
        <a 
          href="/dashboard/referrals/history"
          className="flex items-center gap-2 px-6 py-2 border-2 border-foreground font-black uppercase tracking-widest text-[10px] hover:bg-foreground hover:text-background transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
        >
          <History size={14} /> Payout History
        </a>
      </div>

      {/* Referral Link Card */}
      <div className="bg-white dark:bg-black border-2 border-foreground p-8 relative overflow-hidden group">
        <div className="absolute right-0 top-0 w-32 h-32 bg-foreground/5 -mr-16 -mt-16 rounded-full group-hover:scale-110 transition-transform duration-500"></div>
        <div className="relative z-10 space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-foreground text-background">
              <Share2 size={20} />
            </div>
            <h2 className="text-sm font-black uppercase tracking-widest">Your Unique Referral Link</h2>
          </div>
          
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 bg-secondary/20 border-2 border-foreground p-4 font-mono text-sm break-all flex items-center">
              {referralLink}
            </div>
            <button 
              onClick={copyToClipboard}
              className="px-8 py-4 bg-foreground text-background font-black uppercase tracking-[0.2em] text-[10px] hover:bg-foreground/90 transition-all flex items-center justify-center gap-3 shadow-[6px_6px_0px_0px_rgba(0,0,0,0.2)]"
            >
              <Copy size={16} /> Copy Link
            </button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-black border-2 border-foreground p-8 space-y-2">
          <div className="flex justify-between items-start">
            <p className="text-[10px] font-black uppercase tracking-widest opacity-40">Total Referrals</p>
            <Users size={16} className="opacity-20" />
          </div>
          <p className="text-4xl font-black">{totalDownlines}</p>
          <p className="text-[9px] font-bold text-green-600 uppercase">Growing +2 this week</p>
        </div>

        <div className="bg-foreground text-background p-8 space-y-2 shadow-[8px_8px_0px_0px_rgba(0,0,0,0.2)]">
          <div className="flex justify-between items-start">
            <p className="text-[10px] font-black uppercase tracking-widest opacity-40">Estimated Monthly Earnings</p>
            <TrendingUp size={16} className="opacity-40 text-green-400" />
          </div>
          <p className="text-4xl font-black">₦{monthlyRecurringRevenue.toLocaleString()}</p>
          <p className="text-[9px] font-bold opacity-60 uppercase">Recurring at 23% commission</p>
        </div>

        <div className="bg-white dark:bg-black border-2 border-foreground p-8 space-y-2">
          <div className="flex justify-between items-start">
            <p className="text-[10px] font-black uppercase tracking-widest opacity-40">Next Automatic Payout</p>
            <Calendar size={16} className="opacity-20" />
          </div>
          <p className="text-4xl font-black">₦{monthlyRecurringRevenue.toLocaleString()}</p>
          <p className="text-[10px] font-black uppercase tracking-widest italic mt-2">{nextPayoutDate}</p>
        </div>
      </div>

      {/* Policy & Info */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="p-6 bg-secondary/10 border-2 border-dashed border-foreground/10 space-y-4">
          <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
            <Info size={14} /> How it works
          </h3>
          <ul className="space-y-3">
            <li className="text-[10px] font-bold text-foreground/60 uppercase flex items-start gap-3">
              <div className="w-1.5 h-1.5 bg-foreground/20 rounded-full mt-1 shrink-0"></div>
              Refer a friend using your unique link. When they subscribe to any plan, you get <span className="text-foreground font-black">23% recurring commission</span>.
            </li>
            <li className="text-[10px] font-bold text-foreground/60 uppercase flex items-start gap-3">
              <div className="w-1.5 h-1.5 bg-foreground/20 rounded-full mt-1 shrink-0"></div>
              Commissions are paid out automatically on the <span className="text-foreground font-black">last day of every month</span>.
            </li>
            <li className="text-[10px] font-bold text-foreground/60 uppercase flex items-start gap-3">
              <div className="w-1.5 h-1.5 bg-foreground/20 rounded-full mt-1 shrink-0"></div>
              You continue to earn as long as your referred users maintain an active subscription.
            </li>
          </ul>
        </div>

        <div className="p-6 border-2 border-foreground space-y-4 flex flex-col justify-center">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 flex items-center justify-center border-2 border-green-500 text-green-600">
              <Landmark size={24} />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest opacity-40">Payout Destination</p>
              <p className="text-sm font-black uppercase tracking-tight italic">Saved Settlement Account</p>
            </div>
          </div>
          <p className="text-[9px] font-bold text-foreground/40 uppercase">Referral payouts are automatically combined with your main store withdrawals.</p>
        </div>
      </div>

      {/* Downlines Table */}
      <div className="space-y-6">
        <h2 className="text-xl font-black uppercase tracking-tighter italic flex items-center gap-2">
          <Users size={24} /> Your Downlines
        </h2>
        
        <div className="bg-white dark:bg-black border-2 border-foreground overflow-hidden shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <table className="w-full text-left">
            <thead className="bg-secondary/20 border-b-2 border-foreground">
              <tr>
                <th className="p-5 text-[10px] font-black uppercase tracking-widest">Referred User</th>
                <th className="p-5 text-[10px] font-black uppercase tracking-widest">Active Plan</th>
                <th className="p-5 text-[10px] font-black uppercase tracking-widest text-center">Plan Amount</th>
                <th className="p-5 text-[10px] font-black uppercase tracking-widest">Date Joined</th>
                <th className="p-5 text-[10px] font-black uppercase tracking-widest text-right">Your Commission (23%)</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-foreground/10">
              {downlines.map((user) => (
                <tr key={user.id} className="hover:bg-secondary/5 transition-colors group">
                  <td className="p-5">
                    <p className="text-sm font-black tracking-tight">{user.name}</p>
                    <p className="text-[10px] font-bold text-foreground/40 uppercase">{user.email}</p>
                  </td>
                  <td className="p-5">
                    <span className="px-3 py-1 bg-secondary/10 border-2 border-foreground text-[8px] font-black uppercase tracking-widest">
                      {user.plan}
                    </span>
                  </td>
                  <td className="p-5 text-center font-bold text-sm tracking-tight italic">
                    ₦{user.price.toLocaleString()}
                  </td>
                  <td className="p-5 text-[10px] font-bold text-foreground/40 uppercase">
                    {user.dateJoined}
                  </td>
                  <td className="p-5 text-right font-black text-sm text-green-600 italic tracking-tight">
                    ₦{user.commission.toLocaleString()}
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
