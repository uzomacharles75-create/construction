import { useState, useRef, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { DashboardShell } from '../components/layout/DashboardShell';
import { Sparkles, Zap, FileSearch, Plus, Send, Loader2, ScanSearch, FolderKanban, Clock } from 'lucide-react';
import apiClient from '../api/client';
import { motion } from 'framer-motion';
import { t } from '../theme';

const typeIcon: Record<string, string> = {
  missing: '🟦', duplicate: '🟡', alternative: '🟣', outlier: '🔴',
};

const AIAssistant = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Real portfolio data for the sidebar + BOQ analysis target
  const { data: projects } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => (await apiClient.get('/projects')).data,
  });
  const { data: boqs } = useQuery({
    queryKey: ['boq-items'],
    queryFn: async () => (await apiClient.get('/boq')).data,
  });

  const boqList: any[] = Array.isArray(boqs) ? boqs : [];
  const projectList: any[] = Array.isArray(projects) ? projects : [];

  const totalBOQ = boqList.reduce((a, b) => a + (b.totalAmount || 0), 0);
  const pendingCount = boqList.reduce(
    (a, b) => a + (b.items || []).filter((i: any) => i.status === 'pending').length, 0
  );
  const riskProject = projectList
    .filter((p) => p.budget > 0)
    .map((p) => ({ ...p, util: (p.spent || 0) / p.budget }))
    .sort((a, b) => b.util - a.util)[0];

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const push = (role: string, content: string) => setMessages((prev) => [...prev, { role, content }]);

  const handleSendMessage = async (text: string = input) => {
    if (!text.trim()) return;
    push('user', text);
    setInput('');
    setIsLoading(true);
    try {
      const { data } = await apiClient.post('/ai/chat', {
        message: text,
        history: messages.slice(-5),
      });
      push('assistant', data.response);
    } catch {
      push('assistant', "I'm sorry, I'm having trouble connecting to the site data right now.");
    } finally {
      setIsLoading(false);
    }
  };

  // Wire the "Analyze BOQ" preset to our real /boq/:id/analyze endpoint
  const runBOQAnalysis = async (projectId?: string, projectName?: string) => {
    push('user', projectName ? `Analyze BOQ — ${projectName}` : 'Analyze BOQ');
    setIsLoading(true);
    try {
      let pid = projectId;
      let pname = projectName;
      if (!pid) {
        const withItems = boqList.find((b) => (b.items || []).length);
        if (!withItems) {
          push('assistant', 'You have no BOQ items yet. Add items in the BOQ Engine, then I can analyze them.');
          return;
        }
        pid = withItems.project?._id || withItems.project;
        pname = withItems.project?.name || 'your project';
      }

      const { data } = await apiClient.post(`/boq/project/${pid}/analyze`);
      const sug: any[] = data.suggestions || [];
      if (!sug.length) {
        push('assistant', `✅ I reviewed the BOQ for "${pname}" — no issues found. It looks complete.`);
        return;
      }
      const body = sug
        .map((s) =>
          `${typeIcon[s.type] || '•'} [${String(s.type).toUpperCase()} · ${s.severity}] ${s.title}\n   ${s.detail}` +
          (s.item ? `\n   → Add: ${s.item.qty} ${s.item.unit} @ $${s.item.rate}` : '')
        )
        .join('\n\n');
      push('assistant', `📋 BOQ Analysis — ${pname}\n\n${body}\n\nOpen the BOQ Engine to add or dismiss these suggestions.`);
    } catch {
      push('assistant', "I couldn't analyze the BOQ right now. Please try again in a moment.");
    } finally {
      setIsLoading(false);
    }
  };

  const onPreset = (task: string) =>
    task === 'Analyze BOQ' ? runBOQAnalysis() : handleSendMessage(task);

  return (
    <DashboardShell>
      <div className="max-w-6xl mx-auto h-[calc(100vh-140px)] flex flex-col">
        <header className="mb-8 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
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

            <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar">
              {messages.length === 0 ? (
                <div className="h-full flex items-center justify-center text-center px-12">
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                    <div className="w-20 h-20 bg-primary-pale rounded-full flex items-center justify-center mx-auto mb-6">
                      <Zap className="text-primary" size={32} />
                    </div>
                    <h2 className="text-2xl font-bold text-foreground mb-4">How can I assist your site today?</h2>
                    <div className="grid grid-cols-2 gap-3">
                      {['Analyze BOQ', 'Draft Proposal', 'Material Estimate', 'Safety Check'].map((task) => (
                        <button
                          key={task}
                          onClick={() => onPreset(task)}
                          className="p-4 bg-muted rounded-2xl text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:bg-primary hover:text-brand-navy transition-all flex items-center justify-center gap-1.5"
                        >
                          {task === 'Analyze BOQ' && <ScanSearch size={12} />}
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
                    <div className={`max-w-[85%] p-5 rounded-[2rem] text-sm leading-relaxed whitespace-pre-wrap ${
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

          {/* RIGHT: REAL PORTFOLIO ANALYTICS */}
          <div className="space-y-6 overflow-y-auto pr-2 custom-scrollbar hidden lg:block">
            <h3 className={`${t.label} px-2`}>Live Portfolio Analytics</h3>

            {/* Real portfolio snapshot */}
            <div className="bg-background p-8 rounded-[3rem] text-foreground shadow-2xl relative overflow-hidden">
              <div className="absolute top-[-20px] right-[-20px] opacity-10"><FolderKanban size={120} /></div>
              <h4 className="font-bold mb-5 flex items-center gap-2"><Zap size={16} className="text-primary" /> Portfolio</h4>
              <div className="space-y-4 relative z-10">
                <div className="flex items-end justify-between">
                  <span className="text-[11px] text-muted-foreground uppercase tracking-widest font-black">Projects</span>
                  <span className="text-2xl font-black">{projectList.length}</span>
                </div>
                <div className="flex items-end justify-between">
                  <span className="text-[11px] text-muted-foreground uppercase tracking-widest font-black">BOQ Value</span>
                  <span className="text-2xl font-black">${totalBOQ.toLocaleString()}</span>
                </div>
                <div className="flex items-end justify-between">
                  <span className="text-[11px] text-muted-foreground uppercase tracking-widest font-black flex items-center gap-1"><Clock size={12} /> Pending</span>
                  <span className="text-2xl font-black text-amber-400">{pendingCount}</span>
                </div>
              </div>
            </div>

            {/* Real budget-risk alert */}
            <div className="bg-card border border-border p-8 rounded-[3rem] shadow-sm">
              <FileSearch className="text-primary mb-4" size={24} />
              <h4 className="font-bold text-foreground mb-2">Budget Risk Alert</h4>
              {riskProject ? (
                <>
                  <p className="text-[11px] text-brand-muted leading-relaxed">
                    <span className="font-bold text-foreground">'{riskProject.name}'</span> is at{' '}
                    <span className={`font-bold ${riskProject.util > 0.9 ? 'text-rose-500' : riskProject.util > 0.7 ? 'text-amber-500' : 'text-emerald-500'}`}>
                      {Math.round(riskProject.util * 100)}% of budget
                    </span>{' '}
                    (${(riskProject.spent || 0).toLocaleString()} / ${riskProject.budget.toLocaleString()}).
                  </p>
                  <button
                    onClick={() => runBOQAnalysis(riskProject._id, riskProject.name)}
                    className="mt-6 text-[10px] font-black text-primary uppercase hover:underline flex items-center gap-1"
                  >
                    <ScanSearch size={12} /> Analyze this BOQ
                  </button>
                </>
              ) : (
                <p className="text-[11px] text-brand-muted leading-relaxed">
                  No budgeted projects yet. Create a project with a budget to see risk tracking.
                </p>
              )}
            </div>
          </div>

        </div>
      </div>
    </DashboardShell>
  );
};

export default AIAssistant;
