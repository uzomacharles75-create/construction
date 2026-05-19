import { useQuery } from '@tanstack/react-query';
import { DashboardShell } from '../../components/layout/DashboardShell';
import apiClient from '../../api/client';
import { useAuthStore } from '../../store/useAuthStore';
import { 
  BarChart3, Users, Building2, ShieldAlert, Activity, 
  Loader2, TrendingUp, Globe2, Server
} from 'lucide-react';
import { motion} from 'framer-motion';

const AdminDashboard = () => {
  const { user } = useAuthStore();

  // 1. FETCH GLOBAL STATS (Total Volume, Verified Cos, etc)
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['admin-global-stats'],
    queryFn: async () => (await apiClient.get('/admin/stats')).data
  });

  // 2. FETCH SYSTEM ACTIVITY LOGS (Real registrations and tenders)
  const { data: logs, isLoading: logsLoading } = useQuery({
    queryKey: ['admin-activity-logs'],
    queryFn: async () => (await apiClient.get('/admin/activity')).data
  });

  return (
    <DashboardShell>
      <div className="max-w-[1600px] mx-auto pb-20">
        
        {/* DYNAMIC HEADER */}
        <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <div className="flex items-center gap-4 mb-2">
              <div className="p-2.5 bg-rose-500 rounded-2xl text-white shadow-xl shadow-rose-900/20">
                <ShieldAlert size={22} />
              </div>
              <h1 className="text-3xl font-black text-[#001529] tracking-tight italic">
                Master Control: {user?.name}
              </h1>
            </div>
            <p className="text-sm text-slate-400 font-medium">BuildHub Governance Console • Session: Encrypted</p>
          </div>

          <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 rounded-xl border border-emerald-100 text-emerald-600">
             <Server size={14} className={statsLoading ? 'animate-pulse' : ''} />
             <span className="text-[10px] font-black uppercase tracking-widest">
                {statsLoading ? 'Synchronizing...' : 'Infrastructure Nominal'}
             </span>
          </div>
        </header>

        {/* TOP METRICS (ZERO MOCK DATA) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {[
            { 
                t: "Platform Volume", 
                v: stats?.totalMarketplaceVolume ? `$${(stats.totalMarketplaceVolume).toLocaleString()}` : "$0.00", 
                i: BarChart3, bg: "bg-blue-600", s: "Total Paid Invoices" 
            },
            { 
                t: "Verified Companies", 
                v: stats?.activeCompanies || '0', 
                i: Building2, bg: "bg-emerald-500", s: "Active Tenants" 
            },
            { 
                t: "Global Staff Assets", 
                v: stats?.totalUsers || '0', 
                i: Users, bg: "bg-purple-600", s: "Identity Records" 
            },
            { 
                t: "Node Status", 
                v: stats?.systemHealth || "---", 
                i: Activity, bg: "bg-[#001529]", s: `Latency: ${stats?.latency || '0ms'}` 
            },
          ].map((s, i) => (
            <div key={i} className="bg-white p-7 rounded-[3rem] border border-slate-50 shadow-sm relative overflow-hidden group hover:shadow-xl transition-all">
               <div className={`w-14 h-14 ${s.bg} rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg group-hover:scale-110 transition-transform`}>
                  <s.i size={28} />
               </div>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">{s.t}</p>
               <h3 className="text-3xl font-black text-[#001529] tracking-tighter">
                  {statsLoading ? <Loader2 className="animate-spin text-slate-200" /> : s.v}
               </h3>
               <p className="text-[10px] font-bold text-slate-300 mt-2 uppercase tracking-tight">{s.s}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           
           {/* REAL ACTIVITY FEED */}
           <div className="lg:col-span-2 bg-[#001529] p-10 rounded-[4rem] text-white shadow-2xl relative overflow-hidden h-[600px] flex flex-col">
              <div className="absolute top-[-40px] right-[-40px] opacity-10"><Globe2 size={300} /></div>
              
              <div className="flex justify-between items-center mb-10 relative z-10">
                 <h3 className="text-xl font-bold flex items-center gap-3 italic">
                    <TrendingUp size={20} className="text-blue-500" /> Real-time Node Activity
                 </h3>
                 <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest px-3 py-1 bg-white/5 rounded-full border border-white/5">DB Stream: Active</span>
              </div>

              <div className="flex-1 space-y-8 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-0.5 before:bg-white/5 overflow-y-auto custom-scrollbar z-10 pr-4">
                 {logsLoading ? (
                    <div className="pl-12 text-slate-500 font-bold italic text-xs uppercase animate-pulse">Fetching Global Events...</div>
                 ) : !logs || logs.length === 0 ? (
                    <div className="pl-12 text-slate-500 italic text-sm py-20">No recent network activity detected.</div>
                 ) : (
                    logs.map((log: any, i: number) => (
                      <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }} key={i} className="flex gap-6 items-start relative pl-12 group">
                        <div className="absolute left-0 top-1.5 w-3 h-3 bg-[#001529] border-2 border-blue-500 rounded-full group-hover:scale-150 transition-transform" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-slate-300 leading-relaxed">{log.message}</p>
                          <p className="text-[9px] text-slate-500 mt-2 font-black uppercase tracking-[0.2em]">{log.region} • {log.timestamp}</p>
                        </div>
                        <div className="text-right">
                          <span className="text-[8px] font-black text-blue-400 uppercase bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">{log.type}</span>
                        </div>
                      </motion.div>
                    ))
                 )}
              </div>
              <button className="mt-10 w-full py-5 bg-white/5 hover:bg-white/10 transition-all rounded-3xl text-[10px] font-black uppercase tracking-widest border border-white/10 relative z-10">
                 Platform Activity Manifest
              </button>
           </div>

           {/* SYSTEM TELEMETRY */}
           <div className="space-y-6">
              <div className="bg-white p-10 rounded-[3.5rem] border border-slate-100 shadow-sm flex flex-col justify-between h-[300px]">
                 <div>
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Security Checksum</h4>
                    <div className="flex items-center gap-4 mb-2">
                       <Activity className="text-emerald-500" />
                       <h3 className="text-2xl font-black text-[#001529] italic">Tier-4</h3>
                    </div>
                    <p className="text-xs text-slate-400 font-medium">Platform nodes are verified across ECOWAS shards.</p>
                 </div>
                 <div className="h-1.5 bg-slate-50 rounded-full overflow-hidden">
                    <motion.div initial={{width: 0}} animate={{width: '100%'}} transition={{duration: 2}} className="h-full bg-blue-600 shadow-[0_0_10px_rgba(37,99,235,0.5)]" />
                 </div>
              </div>

              <div className="bg-white p-10 rounded-[3.5rem] border border-slate-100 shadow-sm">
                 <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Support Operations</h4>
                 <button className="w-full py-4 bg-slate-50 text-slate-500 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-[#001529] hover:text-white transition-all">Launch Global Support</button>
              </div>
           </div>

        </div>
      </div>
    </DashboardShell>
  );
};

export default AdminDashboard;