import { DashboardShell } from '../../components/layout/DashboardShell';
import {  Globe2, Activity, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

const AdminStats = () => {
  return (
    <DashboardShell>
      <div className="max-w-[1600px] mx-auto">
        <header className="mb-10">
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Platform Analytics</h1>
          <p className="text-sm text-slate-400 font-medium italic underline underline-offset-4 decoration-blue-600/20">Real-time data from across the African continent.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
          
          {/* TRANSACTION VOLUME CHART PREVIEW */}
          <div className="lg:col-span-2 bg-white p-10 rounded-[3.5rem] border border-slate-100 shadow-sm relative overflow-hidden">
             <div className="flex justify-between items-center mb-10">
                <div>
                   <h3 className="text-xl font-bold text-slate-800">Transaction Volume</h3>
                   <p className="text-xs text-slate-400 font-medium">Marketplace & Tender Payments (Monthly)</p>
                </div>
                <div className="text-right">
                   <h2 className="text-3xl font-black text-blue-600">$1.2M</h2>
                   <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">+22% Growth</p>
                </div>
             </div>
             
             {/* Simple SVG Chart Representation */}
             <div className="h-48 flex items-end gap-2 px-2">
                {[40, 60, 45, 90, 65, 80, 100, 70, 85, 95, 110, 120].map((h, i) => (
                  <motion.div 
                    key={i}
                    initial={{ height: 0 }}
                    animate={{ height: `${h}%` }}
                    transition={{ delay: i * 0.05 }}
                    className="flex-1 bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-lg"
                  />
                ))}
             </div>
             <div className="flex justify-between mt-4 px-2 text-[10px] font-black text-slate-300 uppercase tracking-tighter">
                <span>Jan</span><span>Mar</span><span>Jun</span><span>Sep</span><span>Dec</span>
             </div>
          </div>

          {/* GEOGRAPHIC REACH */}
          <div className="bg-[#001529] p-10 rounded-[3.5rem] text-white flex flex-col justify-between">
             <div>
                <Globe2 className="text-blue-500 mb-6" size={32} />
                <h3 className="text-xl font-bold mb-2">Regional Presence</h3>
                <p className="text-slate-400 text-xs mb-8">Active companies per region.</p>
                
                <div className="space-y-6">
                   {[
                     { l: "CEMAC (Cameroon, Gabon...)", v: 450, p: "70%" },
                     { l: "ECOWAS (Nigeria, Ghana...)", v: 620, p: "85%" },
                     { l: "EAC (Kenya, Rwanda...)", v: 170, p: "30%" }
                   ].map((reg, i) => (
                     <div key={i}>
                        <div className="flex justify-between text-[10px] font-bold mb-2 uppercase tracking-widest">
                           <span className="text-slate-500">{reg.l}</span>
                           <span>{reg.v}</span>
                        </div>
                        <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                           <div className="h-full bg-blue-600" style={{ width: reg.p }} />
                        </div>
                     </div>
                   ))}
                </div>
             </div>
          </div>
        </div>

        {/* SYSTEM PERFORMANCE GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex items-center gap-6">
              <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-500">
                <Activity size={28} />
              </div>
              <div>
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">API Response</p>
                 <h4 className="text-xl font-black text-slate-800">42ms</h4>
                 <p className="text-[10px] font-bold text-emerald-500">Stable</p>
              </div>
           </div>
           <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex items-center gap-6">
              <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
                <Zap size={28} />
              </div>
              <div>
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">AI Load</p>
                 <h4 className="text-xl font-black text-slate-800">12%</h4>
                 <p className="text-[10px] font-bold text-blue-500">Available</p>
              </div>
           </div>
        </div>
      </div>
    </DashboardShell>
  );
};

export default AdminStats;