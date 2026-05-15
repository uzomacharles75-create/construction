import { DashboardShell } from '../../components/layout/DashboardShell';
import { Layers, MapPin,  ClipboardCheck } from 'lucide-react';

const StaffProjects = () => {
  const sites = [
    { n: "Akwa Heights Apartment", l: "Douala, CM", p: 65, t: "Foundation Phase" },
    { n: "Eko Atlantic Villa", l: "Lagos, NG", p: 15, t: "Site Clearing" },
  ];

  return (
    <DashboardShell>
      <div className="max-w-[1400px] mx-auto">
        <h1 className="text-3xl font-black text-slate-800 mb-10 tracking-tight">Assigned Sites</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {sites.map((site, i) => (
            <div key={i} className="bg-white p-8 rounded-[3.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group">
              <div className="flex justify-between items-start mb-6">
                 <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600"><Layers size={24}/></div>
                 <span className="bg-blue-50 text-blue-600 text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest">{site.t}</span>
              </div>
              <h3 className="text-2xl font-black text-slate-800 mb-2">{site.n}</h3>
              <div className="flex items-center gap-2 text-slate-400 text-sm mb-10 font-medium"><MapPin size={16}/> {site.l}</div>
              
              <div className="space-y-3 mb-10">
                 <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase">
                    <span>Overall Progress</span>
                    <span>{site.p}%</span>
                 </div>
                 <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-600 transition-all duration-1000" style={{width: `${site.p}%`}} />
                 </div>
              </div>

              <button className="w-full py-5 bg-slate-50 text-slate-500 font-bold text-xs rounded-2xl group-hover:bg-[#001529] group-hover:text-white transition-all flex items-center justify-center gap-3">
                 <ClipboardCheck size={18} /> Open Execution Log
              </button>
            </div>
          ))}
        </div>
      </div>
    </DashboardShell>
  );
};

export default StaffProjects;