import { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { DashboardShell } from '../components/layout/DashboardShell';
import { useAuthStore } from '../store/useAuthStore';
import apiClient from '../api/client';
import { io } from 'socket.io-client';
import { 
  Search, 
  Paperclip, 
  Send, 
  MoreHorizontal, 
  Phone, 
  Video,
  Sparkles,
  CheckCheck,
  Loader2,
  MessageSquare,
  ArrowLeft
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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
      <motion.div layout className="min-h-[calc(100dvh-8rem)] h-[calc(100dvh-8rem)] sm:h-[calc(100dvh-10rem)] flex bg-white rounded-2xl sm:rounded-[3rem] shadow-premium border border-slate-50 overflow-hidden">
        
        {/* CONTACTS SIDEBAR */}
        <aside className={`${showList ? 'flex' : 'hidden'} md:flex w-full md:w-[280px] lg:w-[340px] border-r border-slate-100 flex-col bg-white shrink-0`}>
          <div className="p-4 sm:p-8 border-b border-slate-50">
            <h2 className="text-xl sm:text-2xl font-black text-[#001529] mb-4 sm:mb-6">Messages</h2>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              <input 
                type="text" 
                placeholder="Search team..." 
                className="w-full bg-slate-50 border-none rounded-2xl py-3 pl-12 pr-4 text-xs font-medium outline-none focus:ring-2 ring-blue-600/10 transition-all"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {loadingChats ? (
              <div className="p-10 text-center animate-pulse text-slate-300 font-bold">Syncing inbox...</div>
            ) : conversations?.map((chat: any) => (
              <div 
                key={chat._id}
                onClick={() => setActiveChat(chat)}
                className={`p-6 flex gap-4 cursor-pointer transition-all border-l-4 ${
                  activeChat?._id === chat._id ? 'bg-blue-50 border-blue-600' : 'hover:bg-slate-50 border-transparent'
                }`}
              >
                <div className="relative shrink-0">
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center font-black text-blue-600">
                    {chat.participants.find((p: any) => p._id !== user?.id)?.name.charAt(0)}
                  </div>
                  {chat.isOnline && <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-4 border-white rounded-full" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline mb-1">
                    <h4 className="font-bold text-[#001529] truncate text-sm">
                      {chat.participants.find((p: any) => p._id !== user?.id)?.name}
                    </h4>
                    <span className="text-[9px] font-black text-slate-300 uppercase">
                      {chat.lastMsgTime}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 truncate font-medium">{chat.lastMessage}</p>
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* CHAT WINDOW */}
        <main className={`${showChat ? 'flex' : 'hidden'} md:flex flex-1 flex-col bg-[#F8FAFC] min-w-0`}>
          {activeChat ? (
            <>
              {/* CHAT HEADER */}
              <header className="px-4 sm:px-10 py-4 sm:py-5 bg-white/80 backdrop-blur-md border-b border-slate-100 flex items-center justify-between shrink-0 gap-2">
                <div className="flex items-center gap-3 min-w-0">
                  <button type="button" onClick={() => setActiveChat(null)} className="md:hidden p-2 rounded-xl bg-slate-50 text-slate-600 shrink-0" aria-label="Back">
                    <ArrowLeft size={20} />
                  </button>
                  <div className="w-10 h-10 rounded-xl bg-[#001529] flex items-center justify-center text-white font-black text-xs italic shrink-0">
                    {activeChat.participants.find((p: any) => p._id !== user?.id)?.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-[#001529] text-sm">
                      {activeChat.participants.find((p: any) => p._id !== user?.id)?.name}
                    </h3>
                    <p className="text-[9px] text-emerald-500 font-black uppercase tracking-widest">Connected Now</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2.5 text-slate-400 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-all border border-transparent hover:border-blue-100"><Phone size={20} /></button>
                  <button className="p-2.5 text-slate-400 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-all border border-transparent hover:border-blue-100"><Video size={20} /></button>
                </div>
              </header>

              {/* MESSAGES LIST */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-10 space-y-6 sm:space-y-8 custom-scrollbar">
                {loadingMessages ? (
                  <div className="h-full flex items-center justify-center text-slate-300 font-bold italic">Decrypting channel...</div>
                ) : messages?.map((msg: any, i: number) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex flex-col ${msg.senderId === user?.id ? 'items-end' : 'items-start'}`}
                  >
                    <motion.div className={`max-w-[85%] sm:max-w-[75%] p-4 sm:p-5 rounded-2xl sm:rounded-[2rem] text-xs font-medium leading-relaxed shadow-sm ${
                      msg.senderId === user?.id 
                      ? 'bg-blue-600 text-white rounded-tr-none shadow-blue-900/10' 
                      : 'bg-white text-slate-700 border border-slate-100 rounded-tl-none'
                    }`}>
                      {msg.text}
                    </motion.div>
                    <div className="mt-2 px-2 flex items-center gap-1">
                      <span className="text-[9px] text-slate-300 font-black uppercase tracking-tighter">
                        {new Date(msg.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </span>
                      {msg.senderId === user?.id && <CheckCheck size={12} className="text-blue-400" />}
                    </div>
                  </motion.div>
                ))}
                <div ref={scrollRef} />
              </div>

              {/* INPUT FOOTER */}
              <footer className="p-4 sm:p-8 bg-white border-t border-slate-100 shrink-0">
                <form onSubmit={sendMessage} className="flex items-center gap-4 bg-slate-50 p-2 rounded-[2rem] border border-slate-100 focus-within:ring-4 ring-blue-50 transition-all">
                  <button type="button" className="p-3 text-slate-300 hover:text-blue-600 transition-all"><Paperclip size={20} /></button>
                  <input 
                    type="text" 
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Coordinate with your team..." 
                    className="flex-1 bg-transparent border-none outline-none text-sm font-medium text-[#001529] py-2"
                  />
                  <button type="submit" className="bg-[#001529] p-4 rounded-2xl text-white hover:bg-blue-600 transition-all shadow-xl">
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
                    <button key={txt} onClick={() => setInputText(txt)} className="text-[9px] font-black uppercase tracking-widest text-slate-400 border border-slate-100 px-3 sm:px-4 py-1.5 rounded-lg hover:bg-slate-50 transition-all">{txt}</button>
                  ))}
                </div>
              </footer>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-center p-20">
               <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <div className="w-24 h-24 bg-white rounded-[3rem] shadow-xl border border-slate-100 flex items-center justify-center mx-auto mb-6 text-slate-200">
                    <MessageSquare size={40} />
                  </div>
                  <h3 className="text-2xl font-black text-[#001529]">Your Communication Hub</h3>
                  <p className="text-sm text-slate-400 mt-2 max-w-sm">Select a contact or site engineer from the list to start coordinating your project in real-time.</p>
               </motion.div>
            </div>
          )}
        </main>

      </motion.div>
    </DashboardShell>
  );
};

export default Messages;