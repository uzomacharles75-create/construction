import { DashboardShell } from '../../components/layout/DashboardShell';
import { ShieldCheck, Zap, DollarSign, Globe, Bell, Lock, Smartphone, Save } from 'lucide-react';

const AdminSettings = () => {
  return (
    <DashboardShell>
      <div className="max-w-4xl mx-auto">
        <header className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight">Global Configuration</h1>
            <p className="text-sm text-slate-400 font-medium">Platform-wide rules and infrastructure keys.</p>
          </div>
          <button className="bg-blue-600 text-white px-8 py-4 rounded-3xl font-bold text-xs flex items-center gap-2 shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all">
            <Save size={18} /> Save All Changes
          </button>
        </header>

        <div className="space-y-6">
          {/* PLATFORM FEES */}
          <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm">
            <div className="flex items-center gap-4 mb-8">
               <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-500">
                  <DollarSign size={24} />
               </div>
               <h3 className="text-xl font-bold text-slate-800">Revenue & Commissions</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Marketplace Commission (%)</label>
                  <input type="number" defaultValue="2.5" className="w-full p-4 bg-slate-50 border-none rounded-2xl text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-600/20" />
               </div>
               <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Tender Settlement Fee ($)</label>
                  <input type="number" defaultValue="50" className="w-full p-4 bg-slate-50 border-none rounded-2xl text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-600/20" />
               </div>
            </div>
          </div>

          {/* AI INFRASTRUCTURE */}
          <div className="bg-[#001529] p-8 rounded-[3rem] text-white">
            <div className="flex items-center gap-4 mb-8">
               <div className="w-12 h-12 bg-blue-600/20 rounded-2xl flex items-center justify-center text-blue-400">
                  <Zap size={24} />
               </div>
               <h3 className="text-xl font-bold">BuildHub AI (OpenAI Config)</h3>
            </div>
            <div className="space-y-6">
               <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Global System Prompt</label>
                  <textarea className="w-full p-5 bg-white/5 border border-white/10 rounded-[2rem] text-xs font-medium text-slate-300 h-32 outline-none" defaultValue="You are BuildHub AI, a construction industry expert specializing in African building codes and market rates..." />
               </div>
            </div>
          </div>

          {/* MAINTENANCE MODE */}
          <div className="bg-rose-50 border border-rose-100 p-8 rounded-[3rem] flex items-center justify-between">
            <div className="flex items-center gap-6">
               <div className="w-14 h-14 bg-rose-500 rounded-2xl flex items-center justify-center text-white shadow-lg">
                  <Bell size={28} />
               </div>
               <div>
                  <h4 className="text-lg font-black text-rose-900">Maintenance Mode</h4>
                  <p className="text-xs text-rose-600 font-medium">Force all users to a logout screen while updating database.</p>
               </div>
            </div>
            <div className="w-16 h-8 bg-rose-200 rounded-full p-1 relative cursor-pointer">
               <div className="w-6 h-6 bg-white rounded-full shadow-sm" />
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
};

export default AdminSettings;