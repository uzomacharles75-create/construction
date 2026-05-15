import { DashboardShell } from '../../components/layout/DashboardShell';
import { BarChart3, Users, Building2, ShieldAlert, Activity, ArrowUpRight } from 'lucide-react';

const AdminDashboard = () => {
  return (
    <DashboardShell>
      <div className="max-w-[1600px] mx-auto">
        <header className="mb-10">
          <div className="flex items-center gap-4 mb-2">
            <div className="p-2 bg-rose-500 rounded-lg text-white">
              <ShieldAlert size={20} />
            </div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight">System Master Control</h1>
          </div>
          <p className="text-sm text-slate-400 font-medium">Global overview of BuildHub Africa Operations.</p>
        </header>

        {/* MASTER STATS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {[
            { t: "Total Marketplace Volume", v: "$4.2M", c: "+18%", i: BarChart3, bg: "bg-blue-600" },
            { t: "Active Companies", v: "1,240", c: "+24 new", i: Building2, bg: "bg-emerald-500" },
            { t: "Global Staff Users", v: "8,500", c: "Active", i: Users, bg: "bg-purple-600" },
            { t: "System Health", v: "99.9%", c: "Optimal", i: Activity, bg: "bg-rose-500" },
          ].map((s, i) => (
            <div key={i} className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm">
               <div className={`w-12 h-12 ${s.bg} rounded-2xl flex items-center justify-center text-white mb-4 shadow-lg`}>
                  <s.i size={24} />
               </div>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{s.t}</p>
               <h3 className="text-2xl font-black text-slate-800 mt-1">{s.v}</h3>
               <p className="text-[10px] font-bold text-emerald-500 mt-2">{s.c}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
           <div className="bg-[#001529] p-10 rounded-[3rem] text-white">
              <h3 className="text-xl font-bold mb-6">Recent Platform Activity</h3>
              <div className="space-y-6">
                 {[
                   "New Company 'Vertex Ltd' applied for verification",
                   "Marketplace order #9920 settled ($12,000)",
                   "System update v2.4 deployed to Production",
                 ].map((log, i) => (
                   <div key={i} className="flex gap-4 items-start border-l border-white/10 pl-6 relative">
                      <div className="absolute left-[-5px] top-1 w-2.5 h-2.5 bg-blue-500 rounded-full" />
                      <p className="text-sm font-medium text-slate-300">{log}</p>
                   </div>
                 ))}
              </div>
           </div>
        </div>
      </div>
    </DashboardShell>
  );
};

export default AdminDashboard;