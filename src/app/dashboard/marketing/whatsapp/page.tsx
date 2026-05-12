"use client";

import { useState } from 'react';
import { 
  MessageSquare, Send, CheckCircle2, 
  Smartphone, QrCode, ShieldCheck,
  History, Users, BarChart2, MoreHorizontal,
  Search, Phone, Info, Paperclip, Smile,
  Check, CheckCheck, User
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import BrutalistModal from '@/components/BrutalistModal';

const mockChats = [
  { id: 1, name: 'Alex Rivera', lastMsg: 'When will the Aero Strike drop?', time: '10:12 AM', unread: 2, status: 'online' },
  { id: 2, name: 'Jordan Smith', lastMsg: 'Thanks for the quick shipping!', time: '09:45 AM', unread: 0, status: 'offline' },
  { id: 3, name: 'Casey Chen', lastMsg: 'Can I change my shipping address?', time: 'Yesterday', unread: 0, status: 'online' },
  { id: 4, name: 'Riley Taylor', lastMsg: 'The quality is amazing, wow.', time: 'Yesterday', unread: 0, status: 'offline' },
];

const mockMessages = [
  { id: 1, text: "Hey! I saw the teaser for the Aero Strike X.", sender: 'customer', time: '10:05 AM' },
  { id: 2, text: "When exactly is the drop happening?", sender: 'customer', time: '10:05 AM' },
  { id: 3, text: "Hey Alex! The drop is scheduled for Oct 28 at 10:00 AM EST.", sender: 'merchant', time: '10:10 AM' },
  { id: 4, text: "We'll send a broadcast 15 minutes before it goes live.", sender: 'merchant', time: '10:10 AM' },
  { id: 5, text: "Perfect, I'll be ready.", sender: 'customer', time: '10:12 AM' },
];

export default function WhatsAppMarketingPage() {
  const [view, setView] = useState<'analytics' | 'chat'>('chat');
  const [selectedChat, setSelectedChat] = useState(mockChats[0]);
  const [message, setMessage] = useState('');
  const [isBroadcastModalOpen, setIsBroadcastModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSendBroadcast = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const segment = formData.get('segment');
    setIsBroadcastModalOpen(false);
    showToast(`Executing broadcast to ${segment}...`);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-56px)] overflow-hidden bg-white dark:bg-black relative">
      <AnimatePresence>
        {toastMessage && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-6 right-6 z-[1000] bg-black text-white px-6 py-4 font-black text-xs uppercase tracking-widest shadow-2xl border-l-4 border-green-500"
          >
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Broadcast Modal */}
      <BrutalistModal 
        isOpen={isBroadcastModalOpen} 
        onClose={() => setIsBroadcastModalOpen(false)}
        title="New Broadcast"
      >
        <form onSubmit={handleSendBroadcast} className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-widest opacity-40">Audience Segment</label>
            <select name="segment" className="w-full bg-secondary/20 border-2 border-foreground p-3 text-xs font-black uppercase outline-none">
              <option>ALL CONTACTS (1,204)</option>
              <option>VIP MEMBERS (42)</option>
              <option>ABANDONED CARTS (128)</option>
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-widest opacity-40">Message Content</label>
            <textarea required name="message" rows={4} className="w-full bg-secondary/20 border-2 border-foreground p-3 text-xs font-bold outline-none" placeholder="Enter your broadcast message..." defaultValue="Hey! Check out our new drop: [URL]" />
          </div>
          <div className="bg-yellow-50 border border-yellow-200 p-4 flex gap-3 items-start">
            <ShieldCheck size={18} className="text-yellow-600 shrink-0" />
            <p className="text-[9px] font-bold text-yellow-700 uppercase leading-relaxed">Broadcasts will be sent with a 2-5 second delay between messages to ensure deliverability and avoid spam flags.</p>
          </div>
          <button type="submit" className="w-full py-4 bg-foreground text-background font-black text-xs uppercase tracking-widest hover:bg-foreground/90 transition-all flex items-center justify-center gap-2">
            <Send size={14} /> Execute Broadcast
          </button>
        </form>
      </BrutalistModal>

      {/* Page Header (Thin) */}
      <div className="px-6 h-16 border-b border-foreground/10 flex justify-between items-center bg-background shrink-0 z-10">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 animate-pulse"></div>
            <h1 className="text-xs font-black uppercase tracking-widest">WhatsApp Engine</h1>
          </div>
          <div className="flex gap-4">
            <button 
              onClick={() => setView('chat')}
              className={`text-[10px] font-black uppercase tracking-widest pb-1 border-b-2 transition-colors ${view === 'chat' ? 'border-foreground text-foreground' : 'border-transparent text-foreground/30 hover:text-foreground/60'}`}
            >
              Direct Chat
            </button>
            <button 
              onClick={() => setView('analytics')}
              className={`text-[10px] font-black uppercase tracking-widest pb-1 border-b-2 transition-colors ${view === 'analytics' ? 'border-foreground text-foreground' : 'border-transparent text-foreground/30 hover:text-foreground/60'}`}
            >
              Broadcasts & ROI
            </button>
          </div>
        </div>
        <div className="flex items-center gap-4">
           <span className="text-[9px] font-bold text-foreground/30 uppercase tracking-widest">+1 (555) 234-5678</span>
           <button className="p-2 hover:bg-secondary transition-colors"><MoreHorizontal size={16} /></button>
        </div>
      </div>

      {view === 'chat' ? (
        <div className="flex-1 flex overflow-hidden">
          
          {/* Chat List Sidebar */}
          <div className="w-80 border-r border-foreground/10 flex flex-col bg-secondary/10 shrink-0">
             <div className="p-4 border-b border-foreground/10 space-y-3 bg-white">
                <button 
                  onClick={() => setIsBroadcastModalOpen(true)}
                  className="w-full bg-foreground text-background py-2.5 text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-foreground/90 transition-all shadow-sm"
                >
                   <Send size={14} /> New Broadcast
                </button>
                <div className="relative">
                   <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/30" />
                   <input 
                     type="text" 
                     placeholder="Search conversations..."
                     className="w-full bg-background border border-foreground/5 py-2 pl-9 pr-3 text-[10px] font-bold uppercase tracking-widest focus:outline-none focus:border-foreground/20 transition-colors"
                   />
                </div>
             </div>
             <div className="flex-1 overflow-y-auto divide-y divide-foreground/5">
                {mockChats.map(chat => (
                  <button 
                    key={chat.id}
                    onClick={() => setSelectedChat(chat)}
                    className={`w-full p-4 flex items-start gap-3 hover:bg-white transition-colors text-left relative ${selectedChat.id === chat.id ? 'bg-white' : ''}`}
                  >
                    <div className="relative shrink-0">
                       <div className="w-10 h-10 bg-foreground text-background flex items-center justify-center text-xs font-black uppercase tracking-tighter">
                          {chat.name.split(' ').map(n => n[0]).join('')}
                       </div>
                       {chat.status === 'online' && (
                         <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 border-2 border-white dark:border-black"></div>
                       )}
                    </div>
                    <div className="flex-1 min-w-0">
                       <div className="flex justify-between items-center mb-0.5">
                          <span className="text-xs font-black uppercase tracking-tight truncate">{chat.name}</span>
                          <span className="text-[8px] font-bold text-foreground/30 uppercase">{chat.time}</span>
                       </div>
                       <p className="text-[10px] font-bold text-foreground/50 truncate uppercase tracking-wide">{chat.lastMsg}</p>
                    </div>
                    {chat.unread > 0 && (
                      <div className="absolute right-4 bottom-4 w-4 h-4 bg-green-500 text-white flex items-center justify-center text-[8px] font-black">
                        {chat.unread}
                      </div>
                    )}
                  </button>
                ))}
             </div>
          </div>

          {/* Main Chat Area */}
          <div className="flex-1 flex flex-col bg-background">
             {/* Chat Header */}
             <div className="h-14 border-b border-foreground/10 px-6 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                   <h2 className="text-sm font-black uppercase tracking-tight">{selectedChat.name}</h2>
                   <span className="text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 bg-green-100 text-green-700 border border-green-200">Customer</span>
                </div>
                <div className="flex items-center gap-4 text-foreground/40">
                   <button className="hover:text-foreground transition-colors"><Phone size={18} /></button>
                   <button className="hover:text-foreground transition-colors"><Search size={18} /></button>
                   <button className="hover:text-foreground transition-colors"><Info size={18} /></button>
                </div>
             </div>

             {/* Message Feed */}
             <div className="flex-1 overflow-y-auto p-8 space-y-6 flex flex-col bg-secondary/5">
                {mockMessages.map((msg, idx) => {
                  const isMerchant = msg.sender === 'merchant';
                  return (
                    <div key={msg.id} className={`max-w-[70%] ${isMerchant ? 'self-end' : 'self-start'}`}>
                       <div className={`p-4 border shadow-sm ${isMerchant ? 'bg-foreground text-background border-foreground' : 'bg-white text-foreground border-foreground/10'}`}>
                          <p className="text-xs font-bold leading-relaxed">{msg.text}</p>
                       </div>
                       <div className={`flex items-center gap-2 mt-1.5 ${isMerchant ? 'justify-end' : 'justify-start'}`}>
                          <span className="text-[8px] font-bold text-foreground/30 uppercase tracking-widest">{msg.time}</span>
                          {isMerchant && <CheckCheck size={12} className="text-green-500" />}
                       </div>
                    </div>
                  );
                })}
             </div>

             {/* Input Area */}
             <div className="p-4 bg-white border-t border-foreground/10">
                <div className="flex items-center gap-4 max-w-5xl mx-auto">
                   <div className="flex gap-2 text-foreground/30">
                      <button className="hover:text-foreground transition-colors"><Smile size={20} /></button>
                      <button className="hover:text-foreground transition-colors"><Paperclip size={20} /></button>
                   </div>
                   <input 
                     type="text" 
                     value={message}
                     onChange={(e) => setMessage(e.target.value)}
                     placeholder="Type a message..."
                     className="flex-1 py-3 px-4 bg-secondary/30 border border-foreground/5 text-xs font-bold focus:outline-none focus:border-foreground/20 transition-colors"
                   />
                   <button className="w-10 h-10 bg-foreground text-background flex items-center justify-center hover:bg-black transition-colors">
                      <Send size={18} />
                   </button>
                </div>
             </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto p-10 space-y-10">
           {/* Original Analytics Content */}
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-black/20 border border-foreground/10 p-6 space-y-4">
               <div className="flex justify-between items-start">
                 <h3 className="text-[10px] font-black uppercase tracking-widest text-foreground/40">Abandoned Cart Recovery</h3>
                 <span className="bg-green-100 text-green-700 text-[8px] font-black px-1.5 py-0.5 uppercase border border-green-200">Active</span>
               </div>
               <div className="space-y-1">
                 <span className="text-2xl font-black">24.5%</span>
                 <p className="text-[9px] font-bold text-foreground/40 uppercase tracking-wide">Recovery rate • Last 30 days</p>
               </div>
            </div>
            {/* ... other stats ... */}
            <div className="bg-white dark:bg-black/20 border border-foreground/10 p-6 space-y-4">
               <div className="flex justify-between items-start">
                 <h3 className="text-[10px] font-black uppercase tracking-widest text-foreground/40">Order Status Updates</h3>
                 <span className="bg-green-100 text-green-700 text-[8px] font-black px-1.5 py-0.5 uppercase border border-green-200">Active</span>
               </div>
               <div className="space-y-1">
                 <span className="text-2xl font-black">98.2%</span>
                 <p className="text-[9px] font-bold text-foreground/40 uppercase tracking-wide">Delivery success rate</p>
               </div>
            </div>
            <div className="bg-white dark:bg-black/20 border border-foreground/10 p-6 space-y-4">
               <div className="flex justify-between items-start">
                 <h3 className="text-[10px] font-black uppercase tracking-widest text-foreground/40">Newsletter Opt-ins</h3>
                 <span className="bg-secondary text-foreground/40 text-[8px] font-black px-1.5 py-0.5 uppercase border border-foreground/5">Ready</span>
               </div>
               <div className="space-y-1">
                 <span className="text-2xl font-black">1,204</span>
                 <p className="text-[9px] font-bold text-foreground/40 uppercase tracking-wide">Subscribed contacts</p>
               </div>
            </div>
          </div>

          <div className="bg-white dark:bg-black/20 border border-foreground/10 overflow-hidden">
             <div className="p-4 border-b border-foreground/10 flex justify-between items-center bg-secondary/20">
                <h2 className="text-[10px] font-black uppercase tracking-widest">Broadcast Activity</h2>
             </div>
             <table className="w-full text-left border-collapse">
                <thead className="bg-secondary/10">
                   <tr>
                      <th className="p-4 text-[10px] font-black uppercase tracking-widest text-foreground/40">Date</th>
                      <th className="p-4 text-[10px] font-black uppercase tracking-widest text-foreground/40">Campaign Name</th>
                      <th className="p-4 text-[10px] font-black uppercase tracking-widest text-foreground/40 text-center">Recipients</th>
                      <th className="p-4 text-[10px] font-black uppercase tracking-widest text-foreground/40 text-center">CTR</th>
                      <th className="p-4 text-[10px] font-black uppercase tracking-widest text-foreground/40 text-right">Revenue</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-foreground/5">
                   {[
                     { date: 'Oct 24, 02:30 PM', name: 'Winter Drop Preview', sent: 1204, ctr: '12.4%', revenue: '$4,520' },
                     { date: 'Oct 20, 10:15 AM', name: 'Flash Sale Alert', sent: 980, ctr: '18.9%', revenue: '$8,940' },
                     { date: 'Oct 15, 04:00 PM', name: 'Restock Notification', sent: 450, ctr: '32.1%', revenue: '$3,120' },
                   ].map((item, index) => (
                     <tr key={index} className="hover:bg-secondary/5 transition-colors group">
                       <td className="p-4 text-[10px] font-bold text-foreground/60">{item.date}</td>
                       <td className="p-4 text-xs font-black uppercase tracking-tight underline underline-offset-4 decoration-foreground/10 group-hover:decoration-foreground transition-all cursor-pointer">{item.name}</td>
                       <td className="p-4 text-center text-xs font-bold">{item.sent}</td>
                       <td className="p-4 text-center">
                          <span className="text-[10px] font-black text-green-600 bg-green-50 px-1.5 py-0.5 border border-green-100">{item.ctr}</span>
                       </td>
                       <td className="p-4 text-right text-xs font-black">{item.revenue}</td>
                     </tr>
                   ))}
                </tbody>
             </table>
          </div>
        </div>
      )}
    </div>
  );
}
