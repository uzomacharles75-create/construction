import React, { useState } from 'react';
import { DashboardShell } from '../components/layout/DashboardShell';
import { 
  Search, 
  Paperclip, 
  Send, 
  MoreHorizontal, 
  Phone, 
  Video,
  Sparkles,
  CheckCheck,
  Image as ImageIcon
} from 'lucide-react';
import { motion } from 'framer-motion';

const ContactItem = ({ name, lastMsg, time, unread, active = false }: any) => (
  <div className={`p-4 flex gap-4 cursor-pointer transition-all border-l-4 ${
    active ? 'bg-blue-50/50 border-brand-blue' : 'hover:bg-slate-50 border-transparent'
  }`}>
    <div className="relative">
      <div className="w-12 h-12 rounded-full bg-slate-200 overflow-hidden">
        <img src={`https://ui-avatars.com/api/?name=${name}&background=random`} alt={name} />
      </div>
      <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full" />
    </div>
    <div className="flex-1 min-w-0">
      <div className="flex justify-between items-baseline mb-1">
        <h4 className="font-bold text-brand-navy truncate text-sm">{name}</h4>
        <span className="text-[10px] font-medium text-slate-400">{time}</span>
      </div>
      <p className="text-xs text-slate-500 truncate">{lastMsg}</p>
    </div>
    {unread > 0 && (
      <div className="w-5 h-5 bg-brand-blue rounded-full flex items-center justify-center">
        <span className="text-[10px] font-bold text-white">{unread}</span>
      </div>
    )}
  </div>
);

const MessageBubble = ({ text, time, isMine }: any) => (
  <motion.div 
    initial={{ opacity: 0, scale: 0.95, y: 10 }}
    animate={{ opacity: 1, scale: 1, y: 0 }}
    className={`flex flex-col ${isMine ? 'items-end' : 'items-start'} mb-6`}
  >
    <div className={`max-w-[70%] p-4 rounded-[1.5rem] text-sm shadow-sm ${
      isMine 
      ? 'bg-brand-navy text-white rounded-tr-none' 
      : 'bg-white text-slate-700 border border-slate-100 rounded-tl-none'
    }`}>
      {text}
    </div>
    <div className="flex items-center gap-1 mt-1 px-1">
      <span className="text-[10px] text-slate-400 font-medium">{time}</span>
      {isMine && <CheckCheck size={12} className="text-brand-blue" />}
    </div>
  </motion.div>
);

const Messages = () => {
  return (
    <DashboardShell>
      <div className="h-[calc(100vh-160px)] flex bg-white rounded-[2.5rem] shadow-premium border border-white overflow-hidden">
        
        {/* CONTACTS SIDEBAR */}
        <aside className="w-80 border-r border-slate-100 flex flex-col">
          <div className="p-6 border-b border-slate-50">
            <h2 className="text-xl font-bold text-brand-navy mb-4">Messages</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text" 
                placeholder="Search chats..." 
                className="w-full bg-slate-50 border-none rounded-xl py-2 pl-10 pr-4 text-xs focus:ring-1 focus:ring-brand-blue outline-none"
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            <ContactItem name="John Kamara" lastMsg="The cement delivery is on site now." time="12:45 PM" unread={2} active />
            <ContactItem name="Sarah (Architect)" lastMsg="Please review the updated BOQ." time="Yesterday" unread={0} />
            <ContactItem name="Dangote Logistics" lastMsg="Order #9920 has been shipped." time="Mon" unread={0} />
            <ContactItem name="Chief Engineer" lastMsg="Meeting at 10 AM tomorrow." time="Oct 12" unread={0} />
          </div>
        </aside>

        {/* CHAT WINDOW */}
        <main className="flex-1 flex flex-col bg-slate-50/30">
          {/* CHAT HEADER */}
          <header className="px-8 py-4 bg-white/80 backdrop-blur-md border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden">
                <img src="https://ui-avatars.com/api/?name=John+Kamara" alt="John" />
              </div>
              <div>
                <h3 className="font-bold text-brand-navy text-sm">John Kamara</h3>
                <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest">Active Now</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 text-slate-400 hover:text-brand-blue hover:bg-blue-50 rounded-xl transition-all"><Phone size={20} /></button>
              <button className="p-2 text-slate-400 hover:text-brand-blue hover:bg-blue-50 rounded-xl transition-all"><Video size={20} /></button>
              <button className="p-2 text-slate-400 hover:text-brand-blue hover:bg-blue-50 rounded-xl transition-all"><MoreHorizontal size={20} /></button>
            </div>
          </header>

          {/* CHAT MESSAGES */}
          <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
            <MessageBubble text="Hello, checking in on the foundation progress for the Douala project." time="10:00 AM" isMine={false} />
            <MessageBubble text="Hi John! We finished the excavation this morning. Concrete pouring starts at 2 PM." time="10:05 AM" isMine={true} />
            <MessageBubble text="Excellent. Has the site engineer signed off on the reinforcement steel?" time="12:30 PM" isMine={false} />
            <MessageBubble text="Yes, all verified and ready to go. Sending the photos now." time="12:45 PM" isMine={true} />
          </div>

          {/* CHAT INPUT */}
          <footer className="p-6 bg-white border-t border-slate-100">
            <div className="flex items-center gap-4 bg-slate-50 p-2 rounded-2xl border border-slate-100">
              <button className="p-2 text-slate-400 hover:text-brand-blue transition-all"><Paperclip size={20} /></button>
              <button className="p-2 text-slate-400 hover:text-brand-blue transition-all"><ImageIcon size={20} /></button>
              <input 
                type="text" 
                placeholder="Type your message..." 
                className="flex-1 bg-transparent border-none outline-none text-sm text-brand-navy py-2"
              />
              <button className="bg-brand-navy p-3 rounded-xl text-white hover:bg-brand-blue transition-all shadow-lg">
                <Send size={18} />
              </button>
            </div>
            
            {/* AI ASSISTANT QUICK REPLIES */}
            <div className="flex items-center gap-2 mt-4">
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 border border-purple-100 rounded-full text-purple-600">
                <Sparkles size={12} />
                <span className="text-[10px] font-bold uppercase tracking-wider">AI Suggestions</span>
              </div>
              <button className="text-[10px] font-bold text-slate-500 bg-white border border-slate-200 px-3 py-1.5 rounded-full hover:border-brand-blue transition-all">"Send site photos"</button>
              <button className="text-[10px] font-bold text-slate-500 bg-white border border-slate-200 px-3 py-1.5 rounded-full hover:border-brand-blue transition-all">"Confirm delivery"</button>
            </div>
          </footer>
        </main>

      </div>
    </DashboardShell>
  );
};

export default Messages;