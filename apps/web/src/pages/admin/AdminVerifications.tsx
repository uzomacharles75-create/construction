import { DashboardShell } from '../../components/layout/DashboardShell';
import { Building2, Check, X, FileText, Globe, MapPin } from 'lucide-react';

const AdminVerifications = () => {
  return (
    <DashboardShell>
      <div className="max-w-[1400px] mx-auto">
        <h1 className="text-3xl font-black text-slate-800 mb-10 tracking-tight">Verification Queue</h1>

        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 group hover:border-blue-600/20 transition-all">
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center text-slate-300 group-hover:text-blue-600 transition-colors">
                  <Building2 size={32} />
                </div>
                <div>
                   <h3 className="text-xl font-black text-slate-800">Summit Contractors Africa</h3>
                   <div className="flex items-center gap-4 mt-1 text-slate-400 text-xs font-medium">
                      <span className="flex items-center gap-1"><MapPin size={14}/> Douala, CM</span>
                      <span className="flex items-center gap-1"><Globe size={14}/> summit-build.cm</span>
                   </div>
                   <div className="mt-4 flex gap-2">
                      <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase">Registered 2h ago</span>
                      <span className="px-3 py-1 bg-slate-50 text-slate-400 rounded-full text-[10px] font-black uppercase">Docs Uploaded</span>
                   </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                 <button className="px-6 py-3 bg-slate-50 text-slate-600 rounded-2xl font-bold text-xs hover:bg-slate-100 transition-all flex items-center gap-2">
                    <FileText size={16} /> Review Papers
                 </button>
                 <button className="p-4 bg-rose-50 text-rose-600 rounded-2xl hover:bg-rose-600 hover:text-white transition-all">
                    <X size={20} />
                 </button>
                 <button className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl hover:bg-emerald-600 hover:text-white transition-all shadow-xl shadow-emerald-100">
                    <Check size={20} />
                 </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardShell>
  );
};

export default AdminVerifications;