
import { DashboardShell } from '../../components/layout/DashboardShell';
import {  UploadCloud,  Folder } from 'lucide-react';

const StaffDocuments = () => {
  return (
    <DashboardShell>
      <div className="max-w-[1400px] mx-auto">
        <header className="flex justify-between items-center mb-12">
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Site Documents & CAD</h1>
          <button className="bg-[#001529] text-white px-8 py-4 rounded-3xl font-bold text-xs flex items-center gap-2 shadow-xl">
             <UploadCloud size={18} /> Upload Field Document
          </button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
           {['Site Blueprints', 'Technical Manuals', 'Daily Logs', 'Safety Permits'].map(folder => (
              <div key={folder} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 hover:shadow-xl transition-all cursor-pointer group">
                 <Folder size={40} className="text-blue-600 mb-6 group-hover:scale-110 transition-transform" />
                 <h4 className="font-bold text-slate-800">{folder}</h4>
                 <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">24 Files</p>
              </div>
           ))}
        </div>
      </div>
    </DashboardShell>
  );
};

export default StaffDocuments;