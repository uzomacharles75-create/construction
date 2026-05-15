
import { DashboardShell } from '../components/layout/DashboardShell';
import { 
  Clock, 
  MapPin, 
  AlertTriangle,
  HardHat
} from 'lucide-react';

const ProjectDetail = () => {
  return (
    <DashboardShell>
      <div className="max-w-7xl mx-auto">
        {/* HERO SECTION */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-2">
               <h1 className="text-4xl font-black text-brand-navy tracking-tight">Residential Villa - Douala</h1>
               <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-bold uppercase border border-emerald-100">On Track</span>
            </div>
            <div className="flex items-center gap-4 text-slate-400 text-sm font-medium">
              <div className="flex items-center gap-1"><MapPin size={16} /> Bonamoussadi, Douala</div>
              <div className="flex items-center gap-1"><Clock size={16} /> Started: Aug 12, 2023</div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-4">
            <div className="text-right">
              <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Client</p>
              <p className="text-sm font-bold text-brand-navy">Dr. Samuel Eto'o</p>
            </div>
            <div className="w-10 h-10 bg-slate-100 rounded-full overflow-hidden">
               <img src="https://ui-avatars.com/api/?name=Samuel+Eto" alt="client" />
            </div>
          </div>
        </div>

        {/* FINANCIAL PULSE */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-premium">
             <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Budget Utilized</p>
             <div className="flex items-end gap-2 mb-4">
                <h3 className="text-4xl font-black text-brand-navy">$142,000</h3>
                <p className="text-slate-300 text-sm mb-1">/ $250,000</p>
             </div>
             <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                <div className="w-[56%] h-full bg-brand-blue" />
             </div>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-premium">
             <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Completion</p>
             <h3 className="text-4xl font-black text-brand-navy mb-4">42%</h3>
             <div className="flex gap-2">
                {[1,2,3,4,5,6,7].map(i => (
                  <div key={i} className={`flex-1 h-2 rounded-full ${i <= 3 ? 'bg-emerald-400' : 'bg-slate-100'}`} />
                ))}
             </div>
          </div>

          <div className="bg-brand-navy p-8 rounded-[2.5rem] text-white flex flex-col justify-between">
             <div className="flex justify-between items-start">
               <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Materials</p>
               <AlertTriangle className="text-amber-500" size={20} />
             </div>
             <div>
               <h3 className="text-xl font-bold mb-1 italic">Steel Shortage</h3>
               <p className="text-slate-400 text-xs">Awaiting delivery of 5 tons from SteelCo.</p>
             </div>
          </div>
        </div>

        {/* LOGS & TEAM */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="bg-white rounded-[2.5rem] shadow-premium border border-white overflow-hidden">
             <div className="p-8 border-b border-slate-50 flex justify-between items-center">
               <h3 className="text-xl font-bold text-brand-navy">Daily Site Logs</h3>
               <button className="text-brand-blue font-bold text-xs uppercase tracking-widest">New Entry</button>
             </div>
             <div className="p-8 space-y-8">
               {[
                { title: "Foundation Pouring", staff: "Eng. Moussa", time: "Oct 24, 09:00 AM", status: "Completed" },
                { title: "Electrical Rough-in", staff: "Jean-Paul", time: "Oct 23, 14:30 PM", status: "Ongoing" }
               ].map((log, i) => (
                 <div key={i} className="flex gap-4">
                   <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center shrink-0">
                     <HardHat size={18} className="text-slate-400" />
                   </div>
                   <div className="flex-1">
                     <h4 className="text-sm font-bold text-brand-navy">{log.title}</h4>
                     <p className="text-[10px] text-slate-400 font-medium">Logged by {log.staff} • {log.time}</p>
                   </div>
                   <div className="text-[10px] font-black text-brand-blue uppercase mt-1">{log.status}</div>
                 </div>
               ))}
             </div>
          </div>

          <div className="bg-white rounded-[2.5rem] shadow-premium border border-white p-8">
             <h3 className="text-xl font-bold text-brand-navy mb-8">Active Workforce</h3>
             <div className="grid grid-cols-4 gap-4">
                {[1,2,3,4,5].map(i => (
                  <div key={i} className="flex flex-col items-center">
                    <div className="w-14 h-14 rounded-2xl bg-slate-100 mb-2 overflow-hidden ring-2 ring-emerald-500 ring-offset-2">
                       <img src={`https://i.pravatar.cc/150?u=${i}`} alt="" />
                    </div>
                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-tighter">On Site</span>
                  </div>
                ))}
             </div>
             <button className="w-full mt-10 py-4 bg-slate-50 text-slate-400 font-bold text-xs rounded-2xl border border-slate-100 hover:bg-slate-100 transition-all">
                Manage Project Team
             </button>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
};

export default ProjectDetail;