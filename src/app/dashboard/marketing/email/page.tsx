"use client";

import { useState } from 'react';
import { 
  Mail, Send, Plus, BarChart3, 
  MousePointer2, Eye, Users, 
  Clock, CheckCircle2, ChevronRight,
  Layout, FileText, TrendingUp,
  AlertTriangle, Activity,
  Globe, Filter, MoreVertical,
  UserPlus, Mailbox, SendHorizontal, Image as ImageIcon,
  Bold, Italic, List, Link2, Eraser
} from 'lucide-react';
import { toast } from 'sonner';

// ─── Sub-Components ──────────────────────────────────────────────────────────

const StatCard = ({ label, value, trend, status }: { label: string; value: string; trend?: string; status?: string }) => (
  <div className="p-6 space-y-2 border-r border-foreground/10 last:border-r-0">
    <div className="flex justify-between items-start">
      <h3 className="text-[10px] font-black uppercase tracking-widest text-foreground/40">{label}</h3>
      {trend && <span className="text-[9px] font-black text-green-500">{trend}</span>}
    </div>
    <div className="flex items-baseline gap-2">
      <span className="text-2xl font-black tracking-tighter">{value}</span>
      {status && <span className="text-[8px] font-black uppercase px-1 bg-secondary text-foreground/60">{status}</span>}
    </div>
  </div>
);

const EngagementGraph = () => {
  const points = "0,80 40,70 80,85 120,40 160,50 200,30 240,45 280,20 320,35 360,15 400,25";
  const clickPoints = "0,95 40,90 80,92 120,80 160,85 200,75 240,82 280,70 320,78 360,65 400,68";

  return (
    <div className="h-64 w-full relative group">
      <div className="absolute inset-0 flex flex-col justify-between opacity-5 pointer-events-none">
        {[...Array(5)].map((_, i) => <div key={i} className="border-t border-foreground w-full" />)}
      </div>
      
      <svg viewBox="0 0 400 100" className="w-full h-full overflow-visible" preserveAspectRatio="none">
        <path d={`M ${points} V 100 H 0 Z`} fill="url(#gradient-opens)" className="opacity-10" />
        <polyline fill="none" stroke="currentColor" strokeWidth="2.5" points={points} className="text-foreground transition-all duration-500" />
        <polyline fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 2" points={clickPoints} className="text-foreground/30" />
        <defs>
          <linearGradient id="gradient-opens" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="currentColor" />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute top-0 right-0 flex gap-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-0.5 bg-foreground" />
          <span className="text-[9px] font-black uppercase tracking-widest text-foreground/60">Unique Opens</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-0.5 bg-foreground/30 border-t border-dashed" />
          <span className="text-[9px] font-black uppercase tracking-widest text-foreground/40">Link Clicks</span>
        </div>
      </div>
    </div>
  );
};

// ─── Main Page Component ───────────────────────────────────────────────────────

export default function HighVolumeCommunicationsPage() {
  const [activeView, setActiveView] = useState<'overview' | 'subscribers' | 'composer'>('overview');

  return (
    <div className="min-h-screen bg-background">
      {/* Internal Navigation Tabs */}
      <div className="flex border-b border-foreground/10 bg-background px-6 lg:px-10 sticky top-0 z-30">
        <button 
          onClick={() => setActiveView('overview')}
          className={`px-6 py-4 text-[10px] font-black uppercase tracking-widest transition-all border-b-2 ${activeView === 'overview' ? 'border-foreground text-foreground' : 'border-transparent text-foreground/40 hover:text-foreground'}`}
        >
          Mission Control
        </button>
        <button 
          onClick={() => setActiveView('subscribers')}
          className={`px-6 py-4 text-[10px] font-black uppercase tracking-widest transition-all border-b-2 ${activeView === 'subscribers' ? 'border-foreground text-foreground' : 'border-transparent text-foreground/40 hover:text-foreground'}`}
        >
          Email List
        </button>
        <button 
          onClick={() => setActiveView('composer')}
          className={`px-6 py-4 text-[10px] font-black uppercase tracking-widest transition-all border-b-2 ${activeView === 'composer' ? 'border-foreground text-foreground' : 'border-transparent text-foreground/40 hover:text-foreground'}`}
        >
          Compose & Send
        </button>
      </div>

      <div className="p-6 lg:p-10 space-y-10">
        
        {activeView === 'overview' && (
          <div className="space-y-10">
            {/* Main Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground/40">Marketing Suite</span>
                  <div className="h-px w-8 bg-foreground/20" />
                </div>
                <h1 className="text-5xl md:text-6xl font-black uppercase tracking-tighter leading-none">
                  Email Engine
                </h1>
              </div>
              <button 
                onClick={() => setActiveView('composer')}
                className="px-6 py-3 bg-foreground text-background font-black text-[10px] uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all"
              >
                New Broadcaster
              </button>
            </div>

            {/* Stats Pulse */}
            <div className="grid grid-cols-1 md:grid-cols-4 border-2 border-foreground bg-background divide-x-2 divide-foreground overflow-hidden">
              <StatCard label="Network Throughput" value="1.2M /hr" trend="+14%" status="Stable" />
              <StatCard label="Global Open Rate" value="38.4%" trend="+2.1%" status="Above Avg" />
              <StatCard label="Bounce Protection" value="0.02%" trend="0.0%" status="Critical" />
              <StatCard label="Active Listeners" value="84,209" trend="+1.4K" status="Real-time" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-8 space-y-8">
                <div className="bg-background border-2 border-foreground p-8 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none"><Activity size={120} /></div>
                  <div className="flex justify-between items-center mb-8">
                    <div className="space-y-1">
                      <h2 className="text-[12px] font-black uppercase tracking-widest">Network Engagement</h2>
                      <p className="text-[10px] font-bold text-foreground/40 uppercase">Past 24 Hours Metrics</p>
                    </div>
                  </div>
                  <EngagementGraph />
                </div>

              </div>

              <div className="lg:col-span-4 space-y-8">
                <div className="border-2 border-foreground p-6 bg-secondary/5">
                  <h3 className="text-[10px] font-black uppercase tracking-widest mb-6 flex items-center gap-2"><Globe size={12} /> Regional Delivery</h3>
                  <div className="space-y-6">
                    {[{ region: 'North America', status: 'Optimal', load: '82%' }, { region: 'Asia Pacific', status: 'Lag Detected', load: '94%' }].map(r => (
                      <div key={r.region} className="space-y-2">
                        <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                          <span>{r.region}</span>
                          <span className={r.status === 'Optimal' ? 'text-green-500' : 'text-yellow-600'}>{r.status}</span>
                        </div>
                        <div className="h-3 border border-foreground bg-background overflow-hidden p-[1px]">
                          <div className={`h-full ${r.status === 'Optimal' ? 'bg-foreground' : 'bg-yellow-500'}`} style={{ width: r.load }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-2 border-foreground overflow-hidden">
                  <div className="bg-foreground text-background px-4 py-2 flex justify-between items-center">
                    <h3 className="text-[10px] font-black uppercase tracking-widest">Campaign Execution Log</h3>
                  </div>
                  <div className="divide-y-2 divide-foreground">
                    {[
                      { id: 'TX-402', name: 'WINTER_DROP_NORTH_AMERICA', volume: '450,000', status: 'COMPLETED', rate: '42%' },
                      { id: 'TX-399', name: 'ABANDONED_CART_FLOW_V3', volume: '12,000', status: 'STREAMING', rate: '68%' },
                    ].map((log) => (
                      <div key={log.id} className="p-4 flex items-center justify-between group hover:bg-secondary/10 transition-colors">
                        <div className="flex items-center gap-4">
                          <span className="text-[10px] font-mono text-foreground/40">{log.id}</span>
                          <span className="text-xs font-black uppercase tracking-tight">{log.name}</span>
                        </div>
                        <div className="flex items-center gap-8">
                          <div className="text-right">
                            <p className="text-[8px] font-black text-foreground/40 uppercase">Status</p>
                            <p className={`text-[8px] font-black px-1.5 py-0.5 border ${log.status === 'STREAMING' ? 'bg-blue-500 text-white border-blue-600 animate-pulse' : 'bg-green-100 text-green-700 border-green-200'}`}>{log.status}</p>
                          </div>
                          <MoreVertical size={14} className="text-foreground/20 cursor-pointer" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeView === 'subscribers' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="space-y-2">
                <h1 className="text-5xl md:text-6xl font-black uppercase tracking-tighter leading-none">Subscribers</h1>
                <p className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest">Total Audience: 84,209 Verified Nodes</p>
              </div>
              <button className="flex items-center gap-2 px-6 py-3 bg-foreground text-background font-black text-[10px] uppercase tracking-widest hover:scale-[1.02] transition-all">
                <UserPlus size={14} /> Add Subscriber
              </button>
            </div>

            <div className="bg-background border-2 border-foreground overflow-hidden">
              <div className="p-4 bg-secondary/20 border-b-2 border-foreground flex justify-between items-center">
                <div className="flex gap-4">
                   <button className="text-[10px] font-black uppercase tracking-widest border-b-2 border-foreground pb-1">All Members</button>
                   <button className="text-[10px] font-black uppercase tracking-widest text-foreground/40 hover:text-foreground transition-colors pb-1 border-b-2 border-transparent">VIP Nodes</button>
                   <button className="text-[10px] font-black uppercase tracking-widest text-foreground/40 hover:text-foreground transition-colors pb-1 border-b-2 border-transparent">Inactive</button>
                </div>
                <div className="flex items-center gap-3">
                   <Filter size={14} className="text-foreground/40" />
                   <span className="text-[10px] font-black uppercase tracking-widest">Filters</span>
                </div>
              </div>
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b-2 border-foreground bg-secondary/5">
                    <th className="p-4 text-[10px] font-black uppercase tracking-widest border-r-2 border-foreground">Subscriber</th>
                    <th className="p-4 text-[10px] font-black uppercase tracking-widest border-r-2 border-foreground">Status</th>
                    <th className="p-4 text-[10px] font-black uppercase tracking-widest border-r-2 border-foreground">Value</th>
                    <th className="p-4 text-[10px] font-black uppercase tracking-widest">Last Activity</th>
                  </tr>
                </thead>
                <tbody className="divide-y-2 divide-foreground">
                  {[
                    { name: 'Alex Thompson', email: 'alex@example.com', status: 'ACTIVE', value: '$1,240', last: '2 mins ago' },
                    { name: 'Sarah Jenkins', email: 'sarah.j@corp.com', status: 'ACTIVE', value: '$450', last: '1 hour ago' },
                    { name: 'Michael Chen', email: 'mchen@tech.io', status: 'BOUNCED', value: '$0', last: '2 days ago' },
                    { name: 'Elena Rodriguez', email: 'elena@studio.es', status: 'ACTIVE', value: '$2,890', last: '5 mins ago' },
                  ].map((sub, i) => (
                    <tr key={i} className="hover:bg-secondary/10 transition-colors cursor-pointer group">
                      <td className="p-4 border-r-2 border-foreground">
                        <div className="flex items-center gap-3">
                           <div className="w-8 h-8 bg-secondary border border-foreground/10 flex items-center justify-center font-black text-xs">{sub.name[0]}</div>
                           <div>
                             <p className="text-xs font-black uppercase tracking-tight">{sub.name}</p>
                             <p className="text-[9px] font-bold text-foreground/40">{sub.email}</p>
                           </div>
                        </div>
                      </td>
                      <td className="p-4 border-r-2 border-foreground">
                        <span className={`text-[8px] font-black px-1.5 py-0.5 border ${sub.status === 'ACTIVE' ? 'bg-green-100 text-green-700 border-green-200' : 'bg-red-100 text-red-700 border-red-200'}`}>
                          {sub.status}
                        </span>
                      </td>
                      <td className="p-4 border-r-2 border-foreground text-xs font-black">{sub.value}</td>
                      <td className="p-4 text-[10px] font-bold text-foreground/40">{sub.last}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="p-4 bg-secondary/5 border-t-2 border-foreground flex justify-center">
                 <button className="text-[10px] font-black uppercase tracking-widest hover:underline">Load more nodes...</button>
              </div>
            </div>
          </div>
        )}

        {activeView === 'composer' && (
          <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in zoom-in-95 duration-500">
            <div className="space-y-2">
              <h1 className="text-5xl md:text-6xl font-black uppercase tracking-tighter leading-none">Broadcast</h1>
              <p className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest">Neural Link Composer v4.2</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-background border-2 border-foreground p-8 space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-widest text-foreground/40">Broadcasting To</label>
                      <div className="flex items-center gap-2 p-3 border-2 border-foreground bg-secondary/5">
                        <Users size={14} />
                        <span className="text-[10px] font-black uppercase tracking-widest">Active Store Customers (42,104 recipients)</span>
                        <button className="ml-auto text-[10px] font-black uppercase border-b border-foreground">Edit Segment</button>
                      </div>
                    </div>
                    
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-widest text-foreground/40">Transmission Subject</label>
                      <input 
                        type="text" 
                        placeholder="Enter high-impact subject line..."
                        className="w-full bg-background border-2 border-foreground p-3 text-xs font-black uppercase tracking-tight focus:outline-none focus:ring-4 focus:ring-foreground/5"
                      />
                    </div>

                    <div className="space-y-1.5 pt-4">
                      <label className="text-[10px] font-black uppercase tracking-widest text-foreground/40">Email Body</label>
                      <div className="border-2 border-foreground">
                        <div className="p-2 border-b-2 border-foreground bg-secondary/20 flex gap-2 overflow-x-auto">
                          <button className="p-2 hover:bg-foreground/5 transition-colors"><Bold size={14} /></button>
                          <button className="p-2 hover:bg-foreground/5 transition-colors"><Italic size={14} /></button>
                          <button className="p-2 hover:bg-foreground/5 transition-colors"><List size={14} /></button>
                          <button className="p-2 hover:bg-foreground/5 transition-colors"><Link2 size={14} /></button>
                          <button className="p-2 hover:bg-foreground/5 transition-colors ml-auto"><ImageIcon size={14} /></button>
                          <button className="p-2 hover:bg-foreground/5 transition-colors"><Eraser size={14} /></button>
                        </div>
                        <textarea 
                          rows={12}
                          placeholder="Initialize communication protocol..."
                          className="w-full bg-background p-6 text-sm font-medium focus:outline-none resize-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-foreground text-background p-8 space-y-6 border-2 border-foreground">
                  <h3 className="text-[10px] font-black uppercase tracking-widest opacity-40">Transmission Settings</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase tracking-widest">Smart Scheduling</span>
                      <div className="w-8 h-4 bg-white/20 rounded-full relative"><div className="w-2 h-2 bg-white absolute left-1 top-1 rounded-full" /></div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase tracking-widest">A/B Content Test</span>
                      <div className="w-8 h-4 bg-white/20 rounded-full relative"><div className="w-2 h-2 bg-white absolute right-1 top-1 rounded-full" /></div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase tracking-widest">Personalization</span>
                      <div className="w-8 h-4 bg-white/20 rounded-full relative"><div className="w-2 h-2 bg-white absolute right-1 top-1 rounded-full" /></div>
                    </div>
                  </div>

                  <div className="pt-6 space-y-3">
                    <button 
                      onClick={() => toast('Executing Email Broadcast to active listeners...')}
                      className="w-full py-4 bg-white text-black font-black text-[11px] uppercase tracking-widest flex items-center justify-center gap-2 shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
                    >
                      <SendHorizontal size={14} /> Execute Broadcast
                    </button>
                    <button 
                      onClick={() => toast('Email Campaign saved as Blueprint!')}
                      className="w-full py-3 border border-white/20 font-black text-[9px] uppercase tracking-widest hover:bg-white/10 transition-all"
                    >
                      Save as Blueprint
                    </button>
                  </div>
                </div>

                <div className="p-6 border-2 border-foreground bg-secondary/5 space-y-3">
                  <h4 className="text-[9px] font-black uppercase tracking-widest opacity-40">Safety Check</h4>
                  <div className="flex items-center gap-2 text-[10px] font-black text-green-600">
                    <CheckCircle2 size={12} /> Spam Filter Score: 9.8/10
                  </div>
                  <div className="flex items-center gap-2 text-[10px] font-black text-green-600">
                    <CheckCircle2 size={12} /> All Links Verified
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
