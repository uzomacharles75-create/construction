import { useState, useEffect, useRef } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { DashboardShell } from '../components/layout/DashboardShell';
import { useAuthStore } from '../store/useAuthStore';
import apiClient from '../api/client';
import { io } from 'socket.io-client';
import { 
  Search, 
  Paperclip, 
  Send, 
  Phone, 
  Video,
  Sparkles,
  CheckCheck,
  MessageSquare,
  ArrowLeft
} from 'lucide-react';
import { motion} from 'framer-motion';

// Initialize Socket.io (URL should match your backend)
const socket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000');

const Messages = () => {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const [activeChat, setActiveChat] = useState<any>(null);
  const [inputText, setInputText] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  // 1. FETCH CONVERSATIONS (The Sidebar List)
  const { data: conversations, isLoading: loadingChats } = useQuery({
    queryKey: ['conversations'],
    queryFn: async () => {
      const { data } = await apiClient.get('/messages/conversations');
      return data;
    }
  });

  // 2. FETCH MESSAGES FOR ACTIVE CHAT
  const { data: messages, isLoading: loadingMessages } = useQuery({
    queryKey: ['messages', activeChat?._id],
    queryFn: async () => {
      const { data } = await apiClient.get(`/messages/${activeChat._id}`);
      return data;
    },
    enabled: !!activeChat?._id
  });

  // 3. REAL-TIME SOCKET SETUP
  useEffect(() => {
    if (user?.id) {
      socket.emit('join_room', user.id);
      
      socket.on('receive_message', (newMessage) => {
        // Update the cache instantly when a message arrives
        queryClient.setQueryData(['messages', newMessage.conversationId], (old: any) => [...(old || []), newMessage]);
      });
    }

    return () => { socket.off('receive_message'); };
  }, [user?.id, queryClient]);

  // Auto-scroll logic
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 4. SEND MESSAGE LOGIC
  const sendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputText.trim() || !activeChat) return;

    const messageData = {
      conversationId: activeChat._id,
      text: inputText,
      senderId: user?.id
    };

    try {
      const { data } = await apiClient.post('/messages', messageData);
      socket.emit('send_message', data); // Broadcast via socket
      setInputText('');
      queryClient.invalidateQueries({ queryKey: ['conversations'] }); // Refresh sidebar order
    } catch (err) {
      console.error("Message failed to send");
    }
  };

  const showList = !activeChat;
  const showChat = !!activeChat;

  return (
    <DashboardShell>
      <motion.div layout className="min-h-[calc(100dvh-8rem)] h-[calc(100dvh-8rem)] sm:h-[calc(100dvh-10rem)] flex bg-brand-navy-card rounded-2xl sm:rounded-[3rem] shadow-premium border border-brand-border overflow-hidden">
        
        {/* CONTACTS SIDEBAR */}
        <aside className={`${showList ? 'flex' : 'hidden'} md:flex w-full md:w-[280px] lg:w-[340px] border-r border-brand-border flex-col bg-brand-navy-card shrink-0`}>
          <div className="p-4 sm:p-8 border-b border-brand-border">
            <h2 className="text-xl sm:text-2xl font-black text-white mb-4 sm:mb-6">Messages</h2>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/35" size={18} />
              <input 
                type="text" 
                placeholder="Search team..." 
                className="w-full bg-brand-navy-light border-none rounded-2xl py-3 pl-12 pr-4 text-xs font-medium outline-none focus:ring-2 focus:ring-brand-yellow/10 transition-all"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {loadingChats ? (
              <div className="p-10 text-center animate-pulse text-white/35 font-bold">Syncing inbox...</div>
            ) : conversations?.map((chat: any) => (
              <div 
                key={chat._id}
                onClick={() => setActiveChat(chat)}
                className={`p-6 flex gap-4 cursor-pointer transition-all border-l-4 ${
                  activeChat?._id === chat._id ? 'bg-brand-yellow-pale border-brand-yellow' : 'hover:bg-brand-navy-light border-transparent'
                }`}
              >
                <div className="relative shrink-0">
                  <div className="w-12 h-12 rounded-2xl bg-brand-navy-light flex items-center justify-center font-black text-brand-yellow">
                    {chat.participants.find((p: any) => p._id !== user?.id)?.name.charAt(0)}
                  </div>
                  {chat.isOnline && <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-4 border-brand-border rounded-full" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline mb-1">
                    <h4 className="font-bold text-white truncate text-sm">
                      {chat.participants.find((p: any) => p._id !== user?.id)?.name}
                    </h4>
                    <span className="text-[9px] font-black text-white/35 uppercase">
                      {chat.lastMsgTime}
                    </span>
                  </div>
                  <p className="text-[11px] text-white/50 truncate font-medium">{chat.lastMessage}</p>
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* CHAT WINDOW */}
        <main className={`${showChat ? 'flex' : 'hidden'} md:flex flex-1 flex-col bg-brand-navy min-w-0`}>
          {activeChat ? (
            <>
              {/* CHAT HEADER */}
              <header className="px-4 sm:px-10 py-4 sm:py-5 bg-brand-navy-card/80 backdrop-blur-md border-b border-brand-border flex items-center justify-between shrink-0 gap-2">
                <div className="flex items-center gap-3 min-w-0">
                  <button type="button" onClick={() => setActiveChat(null)} className="md:hidden p-2 rounded-xl bg-brand-navy-light text-white/70 shrink-0" aria-label="Back">
                    <ArrowLeft size={20} />
                  </button>
                  <div className="w-10 h-10 rounded-xl bg-brand-navy flex items-center justify-center text-white font-black text-xs italic shrink-0">
                    {activeChat.participants.find((p: any) => p._id !== user?.id)?.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-sm">
                      {activeChat.participants.find((p: any) => p._id !== user?.id)?.name}
                    </h3>
                    <p className="text-[9px] text-emerald-500 font-black uppercase tracking-widest">Connected Now</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2.5 text-white/50 hover:bg-brand-yellow-pale hover:text-brand-yellow rounded-xl transition-all border border-transparent hover:border-brand-yellow"><Phone size={20} /></button>
                  <button className="p-2.5 text-white/50 hover:bg-brand-yellow-pale hover:text-brand-yellow rounded-xl transition-all border border-transparent hover:border-brand-yellow"><Video size={20} /></button>
                </div>
              </header>

              {/* MESSAGES LIST */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-10 space-y-6 sm:space-y-8 custom-scrollbar">
                {loadingMessages ? (
                  <div className="h-full flex items-center justify-center text-white/35 font-bold italic">Decrypting channel...</div>
                ) : messages?.map((msg: any, i: number) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex flex-col ${msg.senderId === user?.id ? 'items-end' : 'items-start'}`}
                  >
                    <motion.div className={`max-w-[85%] sm:max-w-[75%] p-4 sm:p-5 rounded-2xl sm:rounded-[2rem] text-xs font-medium leading-relaxed shadow-sm ${
                      msg.senderId === user?.id 
                      ? 'bg-brand-yellow text-brand-navy rounded-tr-none shadow-yellow'
                      : 'bg-brand-navy-card text-white/90 border border-brand-border rounded-tl-none'
                    }`}>
                      {msg.text}
                    </motion.div>
                    <div className="mt-2 px-2 flex items-center gap-1">
                      <span className="text-[9px] text-white/35 font-black uppercase tracking-tighter">
                        {new Date(msg.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </span>
                      {msg.senderId === user?.id && <CheckCheck size={12} className="text-brand-yellow" />}
                    </div>
                  </motion.div>
                ))}
                <div ref={scrollRef} />
              </div>

              {/* INPUT FOOTER */}
              <footer className="p-4 sm:p-8 bg-brand-navy-card border-t border-brand-border shrink-0">
                <form onSubmit={sendMessage} className="flex items-center gap-4 bg-brand-navy-light p-2 rounded-[2rem] border border-brand-border focus-within:ring-4 ring-brand-yellow transition-all">
                  <button type="button" className="p-3 text-white/35 hover:text-brand-yellow transition-all"><Paperclip size={20} /></button>
                  <input 
                    type="text" 
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Coordinate with your team..." 
                    className="flex-1 bg-transparent border-none outline-none text-sm font-medium text-white py-2"
                  />
                  <button type="submit" className="bg-brand-navy p-4 rounded-2xl text-white hover:bg-brand-yellow transition-all shadow-xl">
                    <Send size={20} />
                  </button>
                </form>
                
                {/* AI REPLIES */}
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-4 sm:mt-5 px-1 sm:px-2">
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-purple-50 text-purple-600 rounded-lg border border-purple-100">
                    <Sparkles size={12} />
                    <span className="text-[9px] font-black uppercase tracking-widest">AI Assistance</span>
                  </div>
                  {['Confirm Receipt', 'Upload Photos', 'Site Check-in'].map(txt => (
                    <button key={txt} onClick={() => setInputText(txt)} className="text-[9px] font-black uppercase tracking-widest text-white/50 border border-brand-border px-3 sm:px-4 py-1.5 rounded-lg hover:bg-brand-navy-light transition-all">{txt}</button>
                  ))}
                </div>
              </footer>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-center p-20">
               <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <div className="w-24 h-24 bg-brand-navy-card rounded-[3rem] shadow-xl border border-brand-border flex items-center justify-center mx-auto mb-6 text-white/15">
                    <MessageSquare size={40} />
                  </div>
                  <h3 className="text-2xl font-black text-white">Your Communication Hub</h3>
                  <p className="text-sm text-white/50 mt-2 max-w-sm">Select a contact or site engineer from the list to start coordinating your project in real-time.</p>
               </motion.div>
            </div>
          )}
        </main>

      </motion.div>
    </DashboardShell>
  );
};

export default Messages;