"use client";

import { 
  History, ArrowLeft, Download, 
  ExternalLink, Search, Filter 
} from 'lucide-react';
import { motion } from 'framer-motion';

const historyData = [
  { id: '1', amount: '$1,000.00', fee: '$45.00', net: '$955.00', status: 'Completed', date: 'Oct 20, 2025', bank: 'United Bank' },
  { id: '2', amount: '$500.00', fee: '$22.50', net: '$477.50', status: 'Completed', date: 'Oct 15, 2025', bank: 'United Bank' },
  { id: '3', amount: '$2,140.00', fee: '$96.30', net: '$2,043.70', status: 'Completed', date: 'Oct 10, 2025', bank: 'United Bank' },
  { id: '4', amount: '$850.00', fee: '$38.25', net: '$811.75', status: 'Processing', date: 'Oct 05, 2025', bank: 'United Bank' },
];

export default function WithdrawalHistoryPage() {
  return (
    <div className="p-6 lg:p-10 space-y-10 bg-white dark:bg-black/20 min-h-full">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <a href="/dashboard/financials/withdrawals" className="p-2 border-2 border-foreground/10 hover:border-foreground transition-all">
            <ArrowLeft size={18} />
          </a>
          <h1 className="text-2xl font-black uppercase tracking-tight">Withdrawal History</h1>
        </div>
        <button className="flex items-center gap-2 px-6 py-2 bg-foreground text-background font-black uppercase tracking-widest text-[10px] hover:bg-foreground/90 transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <Download size={14} /> Export CSV
        </button>
      </div>
      
      {/* Financial Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border-2 border-foreground divide-x-2 border-foreground bg-white dark:bg-black/20">
        <div className="p-8 space-y-2">
          <p className="text-[10px] font-black uppercase tracking-widest opacity-40">Total Withdrawals</p>
          <p className="text-4xl font-black">$4,490.00</p>
        </div>
        <div className="p-8 space-y-2">
          <p className="text-[10px] font-black uppercase tracking-widest opacity-40">Lifetime Earnings</p>
          <p className="text-4xl font-black text-green-600">$12,740.50</p>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/30" />
          <input 
            type="text" 
            placeholder="SEARCH BY DATE OR BANK..."
            className="w-full bg-white dark:bg-black border-2 border-foreground p-4 pl-12 text-[10px] font-black uppercase tracking-widest outline-none focus:bg-secondary/10 transition-all"
          />
        </div>
        <button className="px-6 py-4 border-2 border-foreground font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:bg-secondary/10 transition-all">
          <Filter size={14} /> Filter by Status
        </button>
      </div>

      {/* History Table */}
      <div className="bg-white dark:bg-black border-2 border-foreground overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-secondary/20 border-b-2 border-foreground">
            <tr>
              <th className="p-5 text-[10px] font-black uppercase tracking-widest">Date</th>
              <th className="p-5 text-[10px] font-black uppercase tracking-widest">Gross Amount</th>
              <th className="p-5 text-[10px] font-black uppercase tracking-widest">Fee (4.5%)</th>
              <th className="p-5 text-[10px] font-black uppercase tracking-widest">Net Settlement</th>
              <th className="p-5 text-[10px] font-black uppercase tracking-widest">Bank</th>
              <th className="p-5 text-[10px] font-black uppercase tracking-widest text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y-2 divide-foreground/10">
            {historyData.map((tx) => (
              <tr key={tx.id} className="hover:bg-secondary/10 transition-colors group">
                <td className="p-5 text-[10px] font-bold text-foreground/60 uppercase">{tx.date}</td>
                <td className="p-5 text-sm font-black tracking-tight">{tx.amount}</td>
                <td className="p-5 text-xs font-bold text-red-500 tracking-tight">{tx.fee}</td>
                <td className="p-5 text-sm font-black text-green-600 tracking-tight">{tx.net}</td>
                <td className="p-5 text-[10px] font-black uppercase tracking-widest text-foreground/40">{tx.bank}</td>
                <td className="p-5 text-center">
                  <span className={`inline-block px-3 py-1 text-[8px] font-black uppercase tracking-widest border-2 ${
                    tx.status === 'Completed' ? 'bg-green-100 text-green-700 border-green-500' : 
                    tx.status === 'Processing' ? 'bg-yellow-100 text-yellow-700 border-yellow-500 animate-pulse' : 
                    'bg-red-100 text-red-700 border-red-500'
                  }`}>
                    {tx.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}
