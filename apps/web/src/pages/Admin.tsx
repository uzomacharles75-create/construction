import React from 'react';
import { DashboardShell } from '../components/layout/DashboardShell';
import { 
  ShieldAlert, 
  CheckCircle, 
  XCircle, 
  BarChart, 
  Building,
  ArrowUpRight
} from 'lucide-react';

const Admin = () => {
  return (
    <DashboardShell>
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-10">
          <div className="bg-rose-500 p-3 rounded-2xl text-white shadow-lg shadow-rose-100">
            <ShieldAlert size={24} />
          </div>
          <h1 className="text-4xl font-black text-brand-navy tracking-tight">SuperAdmin</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* PENDING APPROVALS LIST */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-xl font-bold text-brand-navy">Company Verification Requests</h2>
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white p-6 rounded-[2.5rem] shadow-premium border border-white flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400">
                    <Building size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-brand-navy">Summit Contractors Ltd.</h4>
                    <p className="text-xs text-slate-400">Douala, Cameroon • Applied 2 days ago</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="p-3 bg-emerald-50 text-emerald-500 rounded-xl hover:bg-emerald-100 transition-all"><CheckCircle size={20} /></button>
                  <button className="p-3 bg-rose-50 text-rose-500 rounded-xl hover:bg-rose-100 transition-all"><XCircle size={20} /></button>
                  <button className="px-6 py-3 bg-slate-50 text-brand-navy font-bold rounded-xl text-xs">Review Files</button>
                </div>
              </div>
            ))}
          </div>

          {/* SYSTEM STATS */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-brand-navy">Platform Pulse</h2>
            <div className="bg-brand-navy p-8 rounded-[2.5rem] text-white">
               <BarChart className="text-brand-blue mb-4" />
               <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Total Marketplace Volume</p>
               <h3 className="text-4xl font-black mb-6">$1.8M</h3>
               <div className="space-y-4">
                 <div className="flex justify-between text-xs">
                   <span className="text-slate-400">Active Companies</span>
                   <span className="font-bold">452</span>
                 </div>
                 <div className="flex justify-between text-xs">
                   <span className="text-slate-400">Live Tenders</span>
                   <span className="font-bold">89</span>
                 </div>
               </div>
               <button className="w-full mt-10 py-4 bg-white/10 hover:bg-white/20 transition-all rounded-2xl text-xs font-bold flex items-center justify-center gap-2">
                 View Global Reports <ArrowUpRight size={14} />
               </button>
            </div>
          </div>

        </div>
      </div>
    </DashboardShell>
  );
};

export default Admin;