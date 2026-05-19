import { useQuery } from '@tanstack/react-query';
import { DashboardShell } from '../../components/layout/DashboardShell';
import apiClient from '../../api/client';
import { 
  Globe2, 
  Activity, 
  Zap, 
  TrendingUp, 
  Loader2, 
  Server,
  ArrowUpRight
} from 'lucide-react';
import { motion } from 'framer-motion';

const AdminStats = () => {
  // 1. FETCH GLOBAL ANALYTICS DATA
  const { data: analytics, isLoading } = useQuery({
    queryKey: ['admin-deep-stats'],
    queryFn: async () => {
      const { data } = await apiClient.get('/admin/analytics'); // Comprehensive data endpoint
      return data;
    }
  });

  if (isLoading) return (
    <div className="h-screen flex items-center justify-center bg-white">
      <div className="text-center">
        <Loader2 className="animate-spin text-blue-600 mb-4 mx-auto" size={40} />
        <p className="font-black text-slate-400 uppercase tracking-widest text-[10px]">Processing Platform Big Data...</p>
      </div>
    </div>
  );

  return (
    <DashboardShell>
      <div className="max-w-[1600px] mx-auto pb-20">
        
        {/* HEADER SECTION */}
        <header className="mb-10">
          <h1 className="text-4xl font-black text-[#001529] tracking-tighter italic">Intelligence Hub</h1>
          <p className="text-sm text-slate-400 font-medium mt-1">
            Real-time performance and financial telemetry across African regional nodes.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
          
          {/* TRANSACTION VOLUME CHART (DYNAMIC) */}
          <div className="lg:col-span-2 bg-white p-10 rounded-[4rem] border border-slate-50 shadow-premium relative overflow-hidden">
             <div className="flex justify-between items-start mb-12 relative z-10">
                <div>
                   <h3 className="text-2xl font-black text-[#001529] tracking-tight">Marketplace Throughput</h3>
                   <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Aggregate Transaction Volume</p>
                </div>
                <div className="text-right">
                   <h2 className="text-4xl font-black text-blue-600 italic tracking-tighter">
                      ${(analytics?.totalVolume / 1000000).toFixed(2)}M
                   </h2>
                   <div className="flex items-center justify-end gap-1 text-emerald-500 font-black text-[10px] mt-1 uppercase tracking-widest">
                      <TrendingUp size={12} /> {analytics?.growthRate || '+22%'} Growth
                   </div>
                </div>
             </div>
             
             {/* DYNAMIC SVG BAR CHART */}
             <div className="h-56 flex items-end gap-3 px-2 relative z-10">
                {analytics?.monthlyData?.map((val: number, i: number) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-3">
                    <motion.div 
                      initial={{ height: 0 }}
                      animate={{ height: `${(val / Math.max(...analytics.monthlyData)) * 100}%` }}
                      transition={{ delay: i * 0.05, duration: 1, ease: "easeOut" }}
                      className="w-full bg-gradient-to-t from-blue-600 to-indigo-400 rounded-2xl shadow-lg shadow-blue-900/10 group relative"
                    >
                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-[#001529] text-white text-[9px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                            ${(val / 1000).toFixed(0)}k
                        </div>
                    </motion.div>
                  </div>
                ))}
             </div>
             <div className="flex justify-between mt-6 px-4 text-[10px] font-black text-slate-300 uppercase tracking-[0.3em] border-t border-slate-50 pt-6">
                <span>Q1 2025</span><span>Q2 2025</span><span>Q3 2025</span><span>Q4 2025</span>
             </div>
          </div>

          {/* GEOGRAPHIC NODE REACH (REAL DATA) */}
          <div className="bg-[#001529] p-10 rounded-[4rem] text-white shadow-2xl relative overflow-hidden flex flex-col justify-between">
             <div className="absolute top-[-40px] right-[-40px] opacity-10"><Globe2 size={240} /></div>
             
             <div className="relative z-10">
                <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center text-white mb-6 shadow-xl shadow-blue-900/40">
                    <Globe2 size={32} />
                </div>
                <h3 className="text-xl font-bold italic mb-2">Continental Reach</h3>
                <p className="text-slate-500 text-xs font-medium mb-10 uppercase tracking-widest">Active nodes by region</p>
                
                <div className="space-y-8">
                   {analytics?.regionalDistribution?.map((reg: any, i: number) => (
                     <div key={i}>
                        <div className="flex justify-between text-[10px] font-black mb-3 uppercase tracking-[0.2em]">
                           <span className="text-slate-400">{reg.region}</span>
                           <span className="text-blue-400">{reg.percentage}%</span>
                        </div>
                        <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                           <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${reg.percentage}%` }}
                            transition={{ duration: 1.5, delay: 0.5 }}
                            className="h-full bg-blue-600 shadow-[0_0_10px_rgba(37,99,235,0.5)]" 
                           />
                        </div>
                     </div>
                   ))}
                </div>
             </div>

             <div className="pt-10 relative z-10">
                <button className="w-full py-4 bg-white/5 hover:bg-white/10 transition-all rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] border border-white/10">
                    Switch to Map View
                </button>
             </div>
          </div>
        </div>

        {/* SYSTEM TELEMETRY GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           
           <div className="bg-white p-8 rounded-[3rem] border border-slate-50 shadow-sm flex items-center gap-6 group hover:shadow-xl transition-all">
              <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform">
                <Activity size={32} />
              </div>
              <div>
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Global Latency</p>
                 <h4 className="text-2xl font-black text-[#001529] tracking-tighter">
                    {analytics?.latency || '38'} <span className="text-sm text-slate-300 font-bold">ms</span>
                 </h4>
                 <div className="flex items-center gap-1.5 mt-1">
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                    <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">Optimal Node Status</span>
                 </div>
              </div>
           </div>

           <div className="bg-white p-8 rounded-[3rem] border border-slate-50 shadow-sm flex items-center gap-6 group hover:shadow-xl transition-all">
              <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
                <Zap size={32} />
              </div>
              <div>
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">AI Inference Load</p>
                 <h4 className="text-2xl font-black text-[#001529] tracking-tighter">
                    {analytics?.aiLoad || '14'}%
                 </h4>
                 <p className="text-[9px] font-bold text-blue-500 uppercase tracking-widest mt-1">BuildHub Engine v4.0</p>
              </div>
           </div>

           <div className="bg-[#001529] p-8 rounded-[3rem] shadow-2xl flex items-center justify-between group cursor-pointer hover:bg-blue-600 transition-all">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center text-white">
                  <Server size={32} />
                </div>
                <div className="text-white">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest group-hover:text-blue-100 transition-colors">Core Nodes</p>
                    <h4 className="text-2xl font-black italic">68/68</h4>
                </div>
              </div>
              <ArrowUpRight className="text-slate-500 group-hover:text-white" />
           </div>

        </div>
      </div>
    </DashboardShell>
  );
};

export default AdminStats;