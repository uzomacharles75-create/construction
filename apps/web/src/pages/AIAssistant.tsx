
import { DashboardShell } from '../components/layout/DashboardShell';
import { Sparkles, Zap, FileSearch,  BarChart, Plus } from 'lucide-react';


const AIAssistant = () => {
  return (
    <DashboardShell>
      <div className="max-w-5xl mx-auto h-[calc(100vh-140px)] flex flex-col">
        <header className="mb-10 flex items-center justify-between">
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 bg-gradient-to-tr from-purple-500 to-brand-blue rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-100">
                <Sparkles size={24} />
             </div>
             <h1 className="text-4xl font-black text-brand-navy tracking-tight italic">BuildHub AI</h1>
          </div>
          <button className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-100 rounded-2xl font-bold text-slate-400 hover:text-brand-navy transition-all shadow-sm">
             <Plus size={18} /> New Analysis
          </button>
        </header>

        <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-8 overflow-hidden">
          {/* LEFT: CHAT BOX */}
          <div className="lg:col-span-2 bg-white rounded-[3rem] shadow-premium border border-white p-8 flex flex-col">
             <div className="flex-1 flex items-center justify-center text-center px-12">
                <div>
                   <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Zap className="text-brand-blue" size={32} />
                   </div>
                   <h2 className="text-2xl font-bold text-brand-navy mb-4 tracking-tight">How can I assist your business today?</h2>
                   <p className="text-slate-400 text-sm mb-8">Ask me to analyze a BOQ, draft a tender proposal, or estimate material costs for a new project.</p>
                   
                   <div className="grid grid-cols-2 gap-4">
                      {['Analyze Budget', 'Draft Proposal', 'Compare Bids', 'Price Prediction'].map(task => (
                        <button key={task} className="p-4 bg-slate-50 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:bg-brand-blue hover:text-white transition-all">
                          {task}
                        </button>
                      ))}
                   </div>
                </div>
             </div>
             
             <div className="mt-8 bg-slate-50 p-2 rounded-2xl border border-slate-100 flex items-center gap-4">
                <input type="text" placeholder="Type a command or ask a question..." className="flex-1 bg-transparent border-none outline-none px-4 py-2 text-sm font-medium" />
                <button className="bg-brand-navy p-4 rounded-xl text-white">
                   <Sparkles size={18} />
                </button>
             </div>
          </div>

          {/* RIGHT: INSIGHTS PANEL */}
          <div className="space-y-6 overflow-y-auto pr-2 custom-scrollbar">
             <h3 className="text-sm font-black text-slate-300 uppercase tracking-widest px-2">AI Insights</h3>
             <div className="bg-brand-navy p-8 rounded-[2.5rem] text-white">
                <BarChart className="text-brand-blue mb-4" />
                <h4 className="font-bold mb-2">Cost Prediction</h4>
                <p className="text-xs text-slate-400 leading-relaxed italic">"Based on current marketplace trends, steel prices are expected to rise by 12% in the CEMAC region next quarter."</p>
             </div>
             <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                <FileSearch className="text-purple-500 mb-4" />
                <h4 className="font-bold text-brand-navy mb-2">Smart Analysis</h4>
                <p className="text-xs text-slate-400 leading-relaxed">Your project 'Residential Villa' is currently 15% over budget in the 'Masonry' category. Recommended action: Review marketplace for cheaper aggregates.</p>
             </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
};

export default AIAssistant;