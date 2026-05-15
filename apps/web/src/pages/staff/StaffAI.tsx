import { DashboardShell } from '../../components/layout/DashboardShell';
import { BrainCircuit, Sparkles, Zap, ChevronRight } from 'lucide-react';

const StaffAI = () => {
  return (
    <DashboardShell>
      <div className="max-w-4xl mx-auto">
        <div className="bg-gradient-to-br from-[#001529] to-[#002b52] p-16 rounded-[4rem] text-center text-white mb-10 shadow-2xl relative overflow-hidden">
           <BrainCircuit className="mx-auto mb-8 text-blue-400" size={56} />
           <h1 className="text-4xl font-black italic tracking-tighter mb-4">BuildHub AI <span className="text-blue-500">Eng.</span></h1>
           <p className="text-blue-200 font-medium mb-12 max-w-lg mx-auto">Technical assistant for material calculations, site reporting, and safety checklists.</p>
           
           <div className="grid grid-cols-2 gap-4 max-w-2xl mx-auto">
              {['Calculate Concrete Mix', 'Estimate Rebar Weight', 'Draft Daily Progress', 'Safety Risk Analysis'].map(t => (
                <button key={t} className="p-4 bg-white/10 hover:bg-white/20 rounded-2xl text-[11px] font-bold border border-white/5 transition-all text-left flex items-center justify-between group">
                  {t} <ChevronRight size={14} className="opacity-0 group-hover:opacity-100" />
                </button>
              ))}
           </div>
        </div>

        <div className="bg-white p-4 rounded-[2.5rem] border-2 border-slate-100 shadow-sm flex items-center gap-4 focus-within:border-blue-600 transition-all">
           <input type="text" placeholder="Sarah, what technical task can I help with?" className="flex-1 px-6 py-4 outline-none text-sm font-medium text-slate-700" />
           <button className="bg-blue-600 text-white p-5 rounded-[1.5rem] shadow-lg hover:scale-105 transition-transform"><Zap size={24}/></button>
        </div>
      </div>
    </DashboardShell>
  );
};

export default StaffAI;