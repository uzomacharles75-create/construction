import { useState, useRef, useEffect } from 'react';
import { DashboardShell } from '../components/layout/DashboardShell';
import { Sparkles, Zap, FileSearch, BarChart, Plus, Send, Loader2 } from 'lucide-react';
import apiClient from '../api/client';
import { motion} from 'framer-motion';

const AIAssistant = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{role: string, content: string}[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (text: string = input) => {
    if (!text.trim()) return;
    
    const userMsg = { role: 'user', content: text };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const { data } = await apiClient.post('/ai/chat', { 
        message: text,
        history: messages.slice(-5) // Send last 5 messages for context
      });
      
      setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: "I'm sorry, I'm having trouble connecting to the site data right now." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardShell>
      <div className="max-w-6xl mx-auto h-[calc(100vh-140px)] flex flex-col">
        <header className="mb-8 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center text-foreground shadow-lg">
                <Sparkles size={24} />
             </div>
             <h1 className="text-3xl font-black text-foreground tracking-tight italic">BuildHub AI</h1>
          </div>
          <button 
            onClick={() => setMessages([])}
            className="flex items-center gap-2 px-5 py-2.5 bg-card border border-border rounded-xl font-bold text-muted-foreground hover:text-rose-500 transition-all shadow-sm text-xs"
          >
             <Plus size={16} /> New Session
          </button>
        </header>

        <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-8 overflow-hidden">
          
          {/* LEFT: CHAT INTERFACE */}
          <div className="lg:col-span-2 bg-card rounded-[3rem] shadow-premium border border-border flex flex-col overflow-hidden">
             
             {/* Chat History */}
             <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar">
                {messages.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-center px-12">
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                      <div className="w-20 h-20 bg-primary-pale rounded-full flex items-center justify-center mx-auto mb-6">
                        <Zap className="text-primary" size={32} />
                      </div>
                      <h2 className="text-2xl font-bold text-foreground mb-4">How can I assist your site today?</h2>
                      <div className="grid grid-cols-2 gap-3">
                        {['Analyze BOQ', 'Draft Proposal', 'Material Estimate', 'Safety Check'].map(task => (
                          <button 
                            key={task} 
                            onClick={() => handleSendMessage(task)}
                            className="p-4 bg-muted rounded-2xl text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:bg-primary hover:text-brand-navy transition-all"
                          >
                            {task}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  </div>
                ) : (
                  messages.map((m, i) => (
                    <motion.div 
                      initial={{ opacity: 0, x: m.role === 'user' ? 20 : -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      key={i} 
                      className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[85%] p-5 rounded-[2rem] text-sm leading-relaxed ${
                        m.role === 'user' 
                        ? 'bg-primary text-brand-navy rounded-tr-none shadow-lg shadow-yellow'
                        : 'bg-muted text-foreground/90 rounded-tl-none border border-border'
                      }`}>
                        {m.content}
                      </div>
                    </motion.div>
                  ))
                )}
                {isLoading && (
                  <div className="flex gap-2 items-center text-primary font-bold text-xs animate-pulse">
                    <Loader2 className="animate-spin" size={14} /> AI is analyzing...
                  </div>
                )}
                <div ref={scrollRef} />
             </div>
             
             {/* Input Bar */}
             <div className="p-6 bg-card border-t border-border">
               <form 
                onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
                className="bg-muted p-2 rounded-[2rem] border border-border flex items-center gap-4 focus-within:ring-4 ring-primary transition-all"
               >
                  <input 
                    type="text" 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask about project budgets, site logs, or materials..." 
                    className="flex-1 bg-transparent border-none outline-none px-6 py-2 text-sm font-medium text-foreground/90" 
                  />
                  <button 
                    disabled={isLoading}
                    className="bg-background p-4 rounded-2xl text-foreground hover:bg-primary disabled:opacity-50 transition-all shadow-xl"
                  >
                     <Send size={18} />
                  </button>
               </form>
             </div>
          </div>

          {/* RIGHT: INSIGHTS PANEL (Static but formatted) */}
          <div className="space-y-6 overflow-y-auto pr-2 custom-scrollbar hidden lg:block">
             <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] px-2">Live Site Analytics</h3>
             <div className="bg-background p-8 rounded-[3rem] text-foreground shadow-2xl relative overflow-hidden">
                <div className="absolute top-[-20px] right-[-20px] opacity-10"><BarChart size={120} /></div>
                <h4 className="font-bold mb-4 flex items-center gap-2"><Zap size={16} className="text-primary" /> Market Prediction</h4>
                <p className="text-[11px] text-muted-foreground leading-relaxed italic">
                  "Steel prices in Douala are expected to stabilize after a 5% drop in logistical fees this quarter."
                </p>
             </div>
             
             <div className="bg-card border border-border p-8 rounded-[3rem] border border-border shadow-sm">
                <FileSearch className="text-primary mb-4" size={24} />
                <h4 className="font-bold text-foreground mb-2">Budget Risk Alert</h4>
                <p className="text-[11px] text-brand-muted leading-relaxed">
                  'Akwa Heights' is trending <span className="text-rose-500 font-bold">12% over budget</span> on Finishing materials. Use AI to compare alternative suppliers.
                </p>
                <button className="mt-6 text-[10px] font-black text-primary uppercase hover:underline">Run Full Audit</button>
             </div>
          </div>

        </div>
      </div>
    </DashboardShell>
  );
};

export default AIAssistant;