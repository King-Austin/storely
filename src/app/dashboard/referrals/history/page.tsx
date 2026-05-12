"use client";

import { 
  History, ArrowLeft, Download, 
  ExternalLink, Search, Filter,
  TrendingUp, Wallet
} from 'lucide-react';
import { motion } from 'framer-motion';

const payoutHistory = [
  { id: 'P1', amount: 24500, date: 'Sep 30, 2025', status: 'Paid', method: 'Bank Transfer' },
  { id: 'P2', amount: 18200, date: 'Aug 31, 2025', status: 'Paid', method: 'Bank Transfer' },
  { id: 'P3', amount: 15400, date: 'Jul 31, 2025', status: 'Paid', method: 'Bank Transfer' },
  { id: 'P4', amount: 12100, date: 'Jun 30, 2025', status: 'Paid', method: 'Bank Transfer' },
];

export default function ReferralHistoryPage() {
  const totalPaid = payoutHistory.reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="p-6 lg:p-10 space-y-10 bg-white dark:bg-black/20 min-h-full">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <a href="/dashboard/referrals" className="p-2 border-2 border-foreground/10 hover:border-foreground transition-all">
            <ArrowLeft size={18} />
          </a>
          <h1 className="text-2xl font-black uppercase tracking-tight">Referral Payouts</h1>
        </div>
        <button className="flex items-center gap-2 px-6 py-2 bg-foreground text-background font-black uppercase tracking-widest text-[10px] hover:bg-foreground/90 transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <Download size={14} /> Export CSV
        </button>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 border-2 border-foreground divide-x-2 divide-foreground bg-white dark:bg-black/20">
        <div className="p-8 space-y-1">
          <p className="text-[10px] font-black uppercase tracking-widest opacity-40">Total Earned (Lifetime)</p>
          <p className="text-4xl font-black text-green-600">₦{totalPaid.toLocaleString()}</p>
        </div>
        <div className="p-8 space-y-1">
          <p className="text-[10px] font-black uppercase tracking-widest opacity-40">Last Payout Amount</p>
          <p className="text-4xl font-black">₦{payoutHistory[0].amount.toLocaleString()}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/30" />
          <input 
            type="text" 
            placeholder="SEARCH BY PAYOUT ID OR DATE..."
            className="w-full bg-white dark:bg-black border-2 border-foreground p-4 pl-12 text-[10px] font-black uppercase tracking-widest outline-none focus:bg-secondary/10 transition-all"
          />
        </div>
        <button className="px-6 py-4 border-2 border-foreground font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:bg-secondary/10 transition-all">
          <Filter size={14} /> Filter by Status
        </button>
      </div>

      {/* History Table */}
      <div className="bg-white dark:bg-black border-2 border-foreground overflow-hidden shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <table className="w-full text-left">
          <thead className="bg-secondary/20 border-b-2 border-foreground">
            <tr>
              <th className="p-5 text-[10px] font-black uppercase tracking-widest">Payout ID</th>
              <th className="p-5 text-[10px] font-black uppercase tracking-widest">Amount</th>
              <th className="p-5 text-[10px] font-black uppercase tracking-widest">Date</th>
              <th className="p-5 text-[10px] font-black uppercase tracking-widest">Method</th>
              <th className="p-5 text-[10px] font-black uppercase tracking-widest text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y-2 divide-foreground/10">
            {payoutHistory.map((record) => (
              <tr key={record.id} className="hover:bg-secondary/5 transition-colors group">
                <td className="p-5 font-mono text-xs">{record.id}</td>
                <td className="p-5 font-black tracking-tight text-lg">₦{record.amount.toLocaleString()}</td>
                <td className="p-5 text-[10px] font-bold uppercase text-foreground/40">{record.date}</td>
                <td className="p-5 text-[10px] font-black uppercase tracking-widest text-foreground/40 italic">{record.method}</td>
                <td className="p-5 text-center">
                  <span className={`inline-block px-3 py-1 text-[8px] font-black uppercase tracking-widest border-2 ${
                    record.status === 'Paid' ? 'bg-green-100 text-green-700 border-green-500' : 
                    'bg-yellow-100 text-yellow-700 border-yellow-500 animate-pulse'
                  }`}>
                    {record.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Help Section */}
      <div className="p-6 bg-secondary/10 border-2 border-dashed border-foreground/10 flex gap-4 items-start">
        <div className="p-2 bg-foreground text-background">
          <Wallet size={20} />
        </div>
        <div className="space-y-1">
          <h4 className="text-[10px] font-black uppercase tracking-widest">Payout Information</h4>
          <p className="text-[9px] font-bold text-foreground/40 uppercase leading-relaxed max-w-2xl">
            Referral commissions are calculated on the 25th of every month and paid out within 3-5 business days. 
            All payouts are processed in Naira (₦) to your saved settlement bank account.
          </p>
        </div>
      </div>
    </div>
  );
}
