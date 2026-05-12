"use client";

import { 
  CreditCard, DollarSign, ArrowUpRight, 
  ArrowDownRight, Calendar, Download,
  TrendingUp, Wallet, Clock, History
} from 'lucide-react';
import { motion } from 'framer-motion';

const mockTransactions = [
  { id: 't1', type: 'Payout', amount: '-$1,240.00', status: 'Completed', date: 'Oct 24, 2025', account: 'Bank ....4291' },
  { id: 't2', type: 'Order #1024', amount: '+$320.00', status: 'Completed', date: 'Oct 23, 2025', account: 'Sales' },
  { id: 't3', type: 'Order #1023', amount: '+$145.00', status: 'Completed', date: 'Oct 23, 2025', account: 'Sales' },
  { id: 't4', type: 'Payout', amount: '-$850.00', status: 'Processing', date: 'Oct 22, 2025', account: 'Bank ....4291' },
];

export default function FinancialsOverviewPage() {
  return (
    <div className="p-6 lg:p-10 space-y-10">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-black uppercase tracking-tight">Financials</h1>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-secondary hover:bg-black/5 text-xs font-bold uppercase tracking-widest transition-colors">
            <Download size={14} /> Export Report
          </button>
          <button className="px-6 py-2 bg-foreground text-background hover:bg-foreground/90 text-xs font-black uppercase tracking-widest transition-all shadow-sm">
            Withdraw Funds
          </button>
        </div>
      </div>

      {/* Financial KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border border-foreground/10 divide-x divide-foreground/10 bg-white dark:bg-black/20">
        <div className="p-8 space-y-4">
          <div className="flex items-center gap-2 text-foreground/40">
            <Wallet size={16} />
            <h3 className="text-[10px] font-black uppercase tracking-widest">Available for payout</h3>
          </div>
          <div className="space-y-1">
            <span className="text-3xl font-black">$4,280.50</span>
            <p className="text-[9px] font-bold text-green-500 uppercase tracking-widest flex items-center gap-1">
              <TrendingUp size={10} /> +$420.00 since yesterday
            </p>
          </div>
        </div>
        <div className="p-8 space-y-4">
          <div className="flex items-center gap-2 text-foreground/40">
            <Clock size={16} />
            <h3 className="text-[10px] font-black uppercase tracking-widest">Pending</h3>
          </div>
          <div className="space-y-1">
            <span className="text-3xl font-black text-foreground/40">$1,120.00</span>
            <p className="text-[9px] font-bold text-foreground/20 uppercase tracking-widest">Est. available in 48h</p>
          </div>
        </div>
        <div className="p-8 space-y-4">
          <div className="flex items-center gap-2 text-foreground/40">
            <Calendar size={16} />
            <h3 className="text-[10px] font-black uppercase tracking-widest">Last Payout</h3>
          </div>
          <div className="space-y-1">
            <span className="text-3xl font-black">$2,140.00</span>
            <p className="text-[9px] font-bold text-foreground/20 uppercase tracking-widest">OCT 20, 2025 • COMPLETED</p>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white dark:bg-black/20 border border-foreground/10 overflow-hidden">
        <div className="p-4 border-b border-foreground/10 flex justify-between items-center bg-secondary/20">
          <h2 className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
            <History size={14} className="opacity-40" />
            Recent Activity
          </h2>
          <button className="text-[9px] font-black uppercase tracking-widest hover:underline underline-offset-4 transition-all">View All Transactions</button>
        </div>
        <table className="w-full text-left border-collapse">
          <thead className="bg-secondary/10">
            <tr>
              <th className="p-4 text-[10px] font-black uppercase tracking-widest text-foreground/40">Date</th>
              <th className="p-4 text-[10px] font-black uppercase tracking-widest text-foreground/40">Type</th>
              <th className="p-4 text-[10px] font-black uppercase tracking-widest text-foreground/40">Account</th>
              <th className="p-4 text-[10px] font-black uppercase tracking-widest text-foreground/40 text-center">Status</th>
              <th className="p-4 text-[10px] font-black uppercase tracking-widest text-foreground/40 text-right">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-foreground/5">
            {mockTransactions.map((tx) => (
              <tr key={tx.id} className="hover:bg-secondary/10 transition-colors group">
                <td className="p-4 text-[10px] font-bold text-foreground/60">{tx.date}</td>
                <td className="p-4 text-xs font-black uppercase tracking-tight">{tx.type}</td>
                <td className="p-4 text-[10px] font-bold text-foreground/40 uppercase tracking-widest">{tx.account}</td>
                <td className="p-4 text-center">
                  <span className={`inline-block px-2 py-0.5 text-[8px] font-black uppercase tracking-widest border ${
                    tx.status === 'Completed' ? 'bg-green-100 text-green-700 border-green-200' : 
                    tx.status === 'Processing' ? 'bg-yellow-100 text-yellow-700 border-yellow-200' : 
                    'bg-gray-100 text-gray-700 border-gray-200'
                  }`}>
                    {tx.status}
                  </span>
                </td>
                <td className={`p-4 text-right text-xs font-black ${tx.amount.startsWith('-') ? 'text-foreground' : 'text-green-600'}`}>
                  {tx.amount}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Payout Schedule Info */}
      <div className="bg-foreground text-background p-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2">
          <h4 className="text-sm font-black uppercase tracking-tighter italic">Next Payout: Friday, Oct 31</h4>
          <p className="text-[10px] font-bold uppercase tracking-widest opacity-60">Estimated payout: $1,420.00 • Weekly Schedule</p>
        </div>
        <button className="px-8 py-3 border-2 border-background hover:bg-background hover:text-foreground transition-all text-xs font-black uppercase tracking-widest">
          Manage Payout Schedule
        </button>
      </div>
    </div>
  );
}
