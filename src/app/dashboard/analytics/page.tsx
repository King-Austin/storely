"use client";

import { useState, useRef, useCallback } from 'react';
import { 
  Calendar, TrendingUp, TrendingDown, Minus, ArrowUpRight, 
  ChevronLeft, Download, Filter, Share2, Printer,
  BarChart3, PieChart, Activity, DollarSign, Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const kpis = [
  { id: 'sales', title: 'Total Sales', value: '$24,592.00', trend: '+14%', isPositive: true },
  { id: 'sessions', title: 'Online Sessions', value: '18,401', trend: '+2%', isPositive: true },
  { id: 'orders', title: 'Total Orders', value: '342', trend: '-4%', isPositive: false },
  { id: 'conversion', title: 'Conversion Rate', value: '2.84%', trend: '0%', isPositive: null },
];

const topProducts = [
  { id: 1, name: 'VOID RUNNER', cat: 'Footwear', sold: 142, revenue: '$21,300.00' },
  { id: 2, name: 'CORE ESSENTIAL', cat: 'Apparel', sold: 98, revenue: '$8,820.00' },
  { id: 3, name: 'ALL-WEATHER SHELL', cat: 'Outerwear', sold: 45, revenue: '$8,100.00' },
  { id: 4, name: 'UTILITY CARGO', cat: 'Apparel', sold: 34, revenue: '$4,420.00' },
  { id: 5, name: 'TACTICAL DUFFEL', cat: 'Accessories', sold: 21, revenue: '$2,520.00' },
];

const chartData = [
  { day: 'Mon', current: 1100, previous: 750 },
  { day: 'Tue', current: 1450, previous: 1050 },
  { day: 'Wed', current: 1250, previous: 600 },
  { day: 'Thu', current: 1900, previous: 1200 },
  { day: 'Fri', current: 1750, previous: 1400 },
  { day: 'Sat', current: 2800, previous: 2200 },
  { day: 'Sun', current: 3400, previous: 2750 },
];

export default function AnalyticsPage() {
  const [activeReport, setActiveReport] = useState<string | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const chartRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!chartRef.current) return;
    const rect = chartRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const segmentWidth = rect.width / chartData.length;
    const index = Math.min(Math.floor(x / segmentWidth), chartData.length - 1);
    setHoveredIndex(index);
  }, []);

  const handleMouseLeave = useCallback(() => setHoveredIndex(null), []);

  const renderReport = () => {
    const kpi = kpis.find(k => k.id === activeReport) || { title: 'Product Performance', value: '$24,592.00' };
    
    return (
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="space-y-6"
      >
        <div className="flex justify-between items-center bg-white rounded-xl p-4 border border-foreground/10 shadow-sm">
          <button 
            onClick={() => setActiveReport(null)}
            className="flex items-center gap-2 text-sm font-bold text-foreground/60 hover:text-foreground transition-colors"
          >
            <ChevronLeft size={18} /> Back to Overview
          </button>
          <div className="flex gap-2">
            <button className="p-2 bg-secondary/50 rounded-lg text-foreground/70 hover:text-foreground transition-colors"><Share2 size={18} /></button>
            <button className="p-2 bg-secondary/50 rounded-lg text-foreground/70 hover:text-foreground transition-colors"><Printer size={18} /></button>
            <button className="flex items-center gap-2 px-4 py-2 bg-[#1a1a1a] text-white rounded-full font-bold text-xs uppercase tracking-widest hover:bg-black transition-all">
              <Download size={14} /> Export Report
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl border border-foreground/10 p-8 shadow-sm">
              <div className="flex justify-between items-end mb-10">
                <div>
                  <h2 className="text-2xl font-black uppercase tracking-tight">{kpi.title}</h2>
                  <p className="text-xs font-bold text-foreground/40 uppercase tracking-widest mt-1">Deep-Dive Technical Analysis</p>
                </div>
                <div className="text-right">
                  <span className="text-3xl font-black tracking-tight">{kpi.value}</span>
                  <p className="text-[10px] font-bold text-green-600 uppercase tracking-widest mt-1">+12.4% vs prev month</p>
                </div>
              </div>
              
              <div className="h-64 relative p-4 flex items-end gap-1.5">
                {[...Array(24)].map((_, i) => (
                  <div 
                    key={i} 
                    className="flex-1 bg-foreground/5 hover:bg-foreground/20 rounded-t-sm transition-all cursor-pointer relative group"
                    style={{ height: `${Math.random() * 80 + 20}%` }}
                  >
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-[#1a1a1a] text-white text-[9px] font-bold px-2 py-1 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20 pointer-events-none">
                      ${Math.floor(Math.random() * 1000)}
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-between mt-4 px-2 text-[9px] font-bold text-foreground/30 uppercase tracking-widest">
                <span>00:00</span>
                <span>06:00</span>
                <span>12:00</span>
                <span>18:00</span>
                <span>23:59</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl border border-foreground/10 p-6 shadow-sm">
                <h3 className="text-xs font-black uppercase tracking-widest mb-6">Top Segments</h3>
                <div className="space-y-5">
                  {[
                    { label: 'Direct Traffic', value: '42%' },
                    { label: 'Social Media', value: '28%' },
                    { label: 'Email Marketing', value: '15%' },
                  ].map(s => (
                    <div key={s.label} className="space-y-2">
                      <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                        <span className="text-foreground/60">{s.label}</span>
                        <span>{s.value}</span>
                      </div>
                      <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                        <div className="h-full bg-foreground rounded-full" style={{ width: s.value }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-white rounded-2xl border border-foreground/10 p-6 shadow-sm flex flex-col justify-center items-center text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-secondary/30 flex items-center justify-center">
                  <PieChart size={32} strokeWidth={1.5} className="text-foreground/40" />
                </div>
                <div>
                  <h3 className="text-xs font-black uppercase tracking-widest">Distribution</h3>
                  <p className="text-[10px] font-bold text-foreground/40 uppercase mt-1 leading-relaxed">Balanced load across<br/>all active channels</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-foreground/10 p-6 shadow-sm space-y-6">
              <h3 className="text-xs font-black uppercase tracking-widest">Performance Insights</h3>
              <div className="space-y-3">
                {[
                  'Peak conversion observed at 8PM-10PM',
                  'Mobile users are 2x more likely to convert',
                  'Retargeting campaigns are outperforming search',
                ].map((insight, i) => (
                  <div key={i} className="flex gap-3 text-[10px] font-bold uppercase leading-relaxed p-3 bg-secondary/30 rounded-xl">
                    <Zap size={14} className="shrink-0 text-yellow-600" />
                    {insight}
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-[#1a1a1a] text-white p-8 rounded-2xl shadow-xl space-y-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Activity size={80} strokeWidth={1} />
              </div>
              <div className="flex justify-between items-start relative z-10">
                <div className="p-2 bg-white/10 rounded-lg">
                  <Activity size={24} className="text-green-400" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest opacity-40">System Status</span>
              </div>
              <div className="space-y-2 relative z-10">
                <h4 className="text-lg font-black uppercase leading-tight">Trajectory is optimal.</h4>
                <p className="text-[10px] font-bold opacity-40 leading-relaxed uppercase">Neural Analytics engine predicts a 5% growth by end of quarter.</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="p-6 md:p-8 w-full max-w-7xl mx-auto pb-24">
      
      <AnimatePresence mode="wait">
        {!activeReport ? (
          <motion.div 
            key="overview"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-8"
          >
            {/* Header Area */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
              <div>
                <h1 className="font-display text-3xl font-black uppercase tracking-tight mb-1">
                  Analytics
                </h1>
                <p className="text-xs font-bold text-foreground/50 uppercase tracking-widest">
                  Performance overview • Real-time Metrics
                </p>
              </div>
              
              <div className="flex items-center gap-2 bg-white border border-foreground/10 px-4 py-2 rounded-full shadow-sm cursor-pointer hover:bg-secondary/50 transition-colors">
                <Calendar size={14} className="text-foreground/60" />
                <span className="text-[10px] font-black uppercase tracking-widest text-foreground/70">Last 30 Days</span>
              </div>
            </div>

            {/* KPI Matrix */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {kpis.map((kpi) => (
                <div 
                  key={kpi.id}
                  onClick={() => setActiveReport(kpi.id)}
                  className="bg-white rounded-2xl border border-foreground/10 p-6 cursor-pointer group hover:border-foreground/30 hover:shadow-md transition-all"
                >
                  <div className="flex justify-between items-start mb-6">
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-foreground/40 group-hover:text-foreground/60 transition-colors">
                      {kpi.title}
                    </h3>
                    {kpi.isPositive !== null && (
                      <div className={`flex items-center gap-0.5 text-[10px] font-bold ${kpi.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                        {kpi.isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                        {kpi.trend}
                      </div>
                    )}
                  </div>
                  <div className="text-3xl font-black tracking-tight leading-none">
                    {kpi.value}
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-8">
              {/* Interactive Chart */}
              <div className="bg-white rounded-2xl border border-foreground/10 p-8 shadow-sm h-[400px] flex flex-col">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h2 className="font-black text-[10px] uppercase tracking-widest">Growth Projection</h2>
                    {hoveredIndex !== null && (
                      <motion.p 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        className="text-[9px] font-bold uppercase tracking-widest text-foreground/40 mt-1"
                      >
                        {chartData[hoveredIndex].day} — Current: <span className="text-foreground font-black">${chartData[hoveredIndex].current.toLocaleString()}</span>{' '}· Previous: <span className="text-foreground/40">${chartData[hoveredIndex].previous.toLocaleString()}</span>
                      </motion.p>
                    )}
                  </div>
                  <div className="flex gap-6">
                     <div className="flex items-center gap-2">
                        <div className="w-3 h-1 rounded-full bg-foreground" />
                        <span className="text-[9px] font-bold uppercase tracking-widest text-foreground/60">Current</span>
                     </div>
                     <div className="flex items-center gap-2">
                        <div className="w-3 h-1 rounded-full bg-foreground/20" />
                        <span className="text-[9px] font-bold uppercase tracking-widest text-foreground/60">Previous</span>
                     </div>
                  </div>
                </div>
                
                <div className="flex-1 flex gap-6 pt-2 pb-2">
                  {/* Y-Axis */}
                  <div className="flex flex-col justify-between h-full text-[8px] font-black uppercase text-foreground/30 text-right w-12 py-[2px]">
                    <span>$5,000</span>
                    <span>$3,750</span>
                    <span>$2,500</span>
                    <span>$1,250</span>
                    <span>$0</span>
                  </div>

                  <div className="flex-1 flex flex-col h-full min-h-0">
                    <div 
                      ref={chartRef}
                      className="flex-1 relative border-l border-b border-foreground/5 overflow-hidden cursor-crosshair"
                      onMouseMove={handleMouseMove}
                      onMouseLeave={handleMouseLeave}
                    >
                      {/* Grid Lines */}
                      <svg className="w-full h-full absolute inset-0 text-foreground/5" viewBox="0 0 100 100" preserveAspectRatio="none">
                        {[0, 25, 50, 75, 100].map(v => (
                          <line key={v} x1="0" y1={v} x2="100" y2={v} stroke="currentColor" strokeWidth="1" vectorEffect="non-scaling-stroke" />
                        ))}
                      </svg>

                      {/* Hover Vertical Line & Dot */}
                      {hoveredIndex !== null && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="absolute top-0 bottom-0 w-px bg-foreground/20 pointer-events-none"
                          style={{ left: `${(hoveredIndex / (chartData.length - 1)) * 100}%` }}
                        />
                      )}
                      
                      {/* Data Lines */}
                      <svg className="w-full h-full absolute inset-0" preserveAspectRatio="none" viewBox="0 0 100 100">
                        <defs>
                          <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="currentColor" stopOpacity="0.06" />
                            <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
                          </linearGradient>
                        </defs>
                        {/* Previous Period */}
                        <polyline 
                          fill="none" stroke="currentColor" strokeWidth="2" 
                          strokeOpacity="0.15" strokeDasharray="4, 4" 
                          points="0,85 16.7,78 33.3,88 50,65 66.7,45 83.3,25 100,18" 
                          vectorEffect="non-scaling-stroke" 
                        />
                        {/* Current Period */}
                        <polyline 
                          fill="none" stroke="currentColor" strokeWidth="3" 
                          points="0,78 16.7,71 33.3,75 50,62 66.7,65 83.3,44 100,32" 
                          strokeLinecap="round" strokeLinejoin="round" 
                          vectorEffect="non-scaling-stroke" 
                        />
                        <polygon fill="url(#chartGradient)" points="0,78 16.7,71 33.3,75 50,62 66.7,65 83.3,44 100,32 100,100 0,100" />
                        {/* Active Dots */}
                        {hoveredIndex !== null && (() => {
                          const currentPoints = [78, 71, 75, 62, 65, 44, 32];
                          const prevPoints   = [85, 78, 88, 65, 45, 25, 18];
                          const x = (hoveredIndex / (chartData.length - 1)) * 100;
                          return (
                            <>
                              <circle cx={x} cy={currentPoints[hoveredIndex]} r="2.5" fill="currentColor" vectorEffect="non-scaling-stroke" />
                              <circle cx={x} cy={prevPoints[hoveredIndex]} r="2" fill="currentColor" opacity="0.3" vectorEffect="non-scaling-stroke" />
                            </>
                          );
                        })()}
                      </svg>

                      {/* Tooltip */}
                      {hoveredIndex !== null && (
                        <motion.div
                          initial={{ opacity: 0, y: 4 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="absolute top-4 pointer-events-none z-10"
                          style={{ 
                            left: hoveredIndex > 4 ? 'auto' : `calc(${(hoveredIndex / (chartData.length - 1)) * 100}% + 12px)`,
                            right: hoveredIndex > 4 ? `calc(${100 - (hoveredIndex / (chartData.length - 1)) * 100}% + 12px)` : 'auto'
                          }}
                        >
                          <div className="bg-[#1a1a1a] text-white px-4 py-3 shadow-2xl min-w-[140px]">
                            <p className="text-[9px] font-black uppercase tracking-widest text-white/40 mb-2">{chartData[hoveredIndex].day}</p>
                            <div className="space-y-1.5">
                              <div className="flex items-center justify-between gap-4">
                                <div className="flex items-center gap-1.5">
                                  <div className="w-2 h-2 rounded-full bg-white" />
                                  <span className="text-[9px] font-bold uppercase text-white/60">Current</span>
                                </div>
                                <span className="text-[11px] font-black text-white">${chartData[hoveredIndex].current.toLocaleString()}</span>
                              </div>
                              <div className="flex items-center justify-between gap-4">
                                <div className="flex items-center gap-1.5">
                                  <div className="w-2 h-2 rounded-full bg-white/30" />
                                  <span className="text-[9px] font-bold uppercase text-white/60">Previous</span>
                                </div>
                                <span className="text-[11px] font-black text-white/50">${chartData[hoveredIndex].previous.toLocaleString()}</span>
                              </div>
                              <div className="pt-1.5 border-t border-white/10">
                                <div className="flex items-center justify-between">
                                  <span className="text-[8px] font-bold uppercase text-white/40">Change</span>
                                  <span className={`text-[10px] font-black ${
                                    chartData[hoveredIndex].current >= chartData[hoveredIndex].previous ? 'text-green-400' : 'text-red-400'
                                  }`}>
                                    {chartData[hoveredIndex].current >= chartData[hoveredIndex].previous ? '+' : ''}
                                    {(((chartData[hoveredIndex].current - chartData[hoveredIndex].previous) / chartData[hoveredIndex].previous) * 100).toFixed(1)}%
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </div>
                    {/* X-Axis Labels */}
                    <div className="flex justify-between mt-4 text-[8px] font-black uppercase tracking-[0.3em] px-2">
                      {chartData.map((d, i) => (
                        <span key={d.day} className={hoveredIndex === i ? 'text-foreground' : 'text-foreground/30'}>{d.day}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Top Products Ledger */}
              <div className="bg-white rounded-2xl border border-foreground/10 shadow-sm overflow-hidden flex flex-col h-[400px]">
                <div className="p-6 border-b border-foreground/5 flex justify-between items-center bg-secondary/10">
                  <h2 className="font-black text-[10px] uppercase tracking-widest">Top Products</h2>
                  <button 
                    onClick={() => setActiveReport('products')}
                    className="text-[9px] font-black uppercase tracking-widest text-foreground/60 hover:text-foreground flex items-center gap-1 transition-colors"
                  >
                    View Report <ArrowUpRight size={12} />
                  </button>
                </div>
                
                <div className="flex-1 overflow-y-auto custom-scrollbar">
                  <table className="w-full text-left">
                    <tbody className="divide-y divide-foreground/5">
                      {topProducts.map((product) => (
                        <tr key={product.id} className="hover:bg-secondary/20 transition-colors cursor-pointer">
                          <td className="px-6 py-4">
                            <div className="flex flex-col">
                              <span className="font-bold text-sm text-foreground">{product.name}</span>
                              <span className="text-[9px] font-bold tracking-widest uppercase text-foreground/30">{product.cat}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-right font-bold text-sm text-foreground/70">{product.sold} sold</td>
                          <td className="px-6 py-4 text-right font-black text-sm">{product.revenue}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </motion.div>
        ) : renderReport()}
      </AnimatePresence>

    </div>
  );
}
