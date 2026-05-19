import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { DashboardShell } from '../components/layout/DashboardShell';
import apiClient from '../api/client';
import { 
  Clock, 
  MapPin, 
  AlertTriangle,
  HardHat,
  Loader2,
  CheckCircle2,
  TrendingUp,
  Users
} from 'lucide-react';
import { motion } from 'framer-motion';

const ProjectDetail = () => {
  const { id } = useParams(); // Get Project ID from URL

  // 1. FETCH FULL PROJECT DATA
  const { data: project, isLoading, isError } = useQuery({
    queryKey: ['project', id],
    queryFn: async () => {
      const { data } = await apiClient.get(`/projects/${id}`);
      return data;
    },
    enabled: !!id
  });

  // 2. FETCH SITE LOGS
  const { data: logs } = useQuery({
    queryKey: ['site-logs', id],
    queryFn: async () => {
      const { data } = await apiClient.get(`/projects/${id}/logs`);
      return data;
    },
    enabled: !!id
  });

  if (isLoading) return (
    <div className="h-screen flex items-center justify-center bg-white">
      <div className="text-center">
        <Loader2 className="animate-spin text-blue-600 mb-4 mx-auto" size={40} />
        <p className="font-black text-slate-400 uppercase tracking-widest text-xs">Syncing Site Data...</p>
      </div>
    </div>
  );

  const budgetPercent = Math.round((project?.spent / project?.budget) * 100) || 0;

  return (
    <DashboardShell>
      <div className="max-w-7xl mx-auto pb-20">
        
        {/* HERO SECTION (REAL DATA) */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-12">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <div className="flex items-center gap-3 mb-2">
               <h1 className="text-4xl font-black text-[#001529] tracking-tight">{project?.name}</h1>
               <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase border ${
                 project?.status === 'In Progress' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-blue-50 text-blue-600'
               }`}>
                 {project?.status}
               </span>
            </div>
            <div className="flex items-center gap-4 text-slate-400 text-sm font-bold uppercase tracking-tight">
              <div className="flex items-center gap-1"><MapPin size={16} className="text-blue-600" /> {project?.location}</div>
              <div className="flex items-center gap-1"><Clock size={16} className="text-blue-600" /> Started: {new Date(project?.createdAt).toLocaleDateString()}</div>
            </div>
          </motion.div>

          <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-4 px-6">
            <div className="text-right">
              <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Client</p>
              <p className="text-sm font-black text-[#001529]">{project?.clientName || "Private"}</p>
            </div>
            <div className="w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-black text-xs italic shadow-lg">
               {project?.clientName?.charAt(0) || 'C'}
            </div>
          </div>
        </div>

        {/* ANALYTICS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          
          {/* BUDGET UTILIZATION */}
          <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm">
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 px-1">Budget Utilized</p>
             <div className="flex items-end gap-2 mb-6">
                <h3 className="text-4xl font-black text-[#001529]">${project?.spent?.toLocaleString()}</h3>
                <p className="text-slate-300 text-xs font-bold mb-1.5 uppercase">/ ${project?.budget?.toLocaleString()}</p>
             </div>
             <div className="w-full h-2.5 bg-slate-50 rounded-full overflow-hidden border border-slate-100">
                <motion.div 
                  initial={{ width: 0 }} 
                  animate={{ width: `${budgetPercent}%` }}
                  className={`h-full ${budgetPercent > 90 ? 'bg-rose-500' : 'bg-blue-600'} shadow-lg`} 
                />
             </div>
          </div>

          {/* COMPLETION PERCENTAGE */}
          <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm">
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 px-1">Project Completion</p>
             <h3 className="text-4xl font-black text-[#001529] mb-6 italic">{project?.progress}%</h3>
             <div className="flex gap-2">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(i => (
                  <div key={i} className={`flex-1 h-2 rounded-full transition-all duration-1000 ${i * 10 <= project?.progress ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]' : 'bg-slate-100'}`} />
                ))}
             </div>
          </div>

          {/* MATERIAL LOGISTICS */}
          <div className="bg-[#001529] p-8 rounded-[3rem] text-white flex flex-col justify-between shadow-2xl relative overflow-hidden">
             <TrendingUp className="absolute right-[-20px] top-[-20px] opacity-10 w-40 h-40" />
             <div className="flex justify-between items-start relative z-10">
               <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Logistics Alert</p>
               <AlertTriangle className="text-amber-500" size={20} />
             </div>
             <div className="relative z-10">
               <h3 className="text-xl font-bold mb-1 italic">Resource Shortage</h3>
               <p className="text-slate-400 text-[10px] font-medium leading-relaxed">Check Procurement for pending steel reinforcement delivery.</p>
             </div>
          </div>
        </div>

        {/* LOGS & TEAM GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          
          {/* DAILY SITE LOGS (REAL DATA) */}
          <div className="bg-white rounded-[3rem] shadow-premium border border-slate-50 overflow-hidden flex flex-col">
             <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
               <h3 className="font-black text-[#001529] uppercase text-xs tracking-widest">Site Execution Logs</h3>
               <button className="text-blue-600 font-black text-[10px] uppercase tracking-widest hover:underline">New Entry</button>
             </div>
             <div className="p-8 space-y-8 flex-1">
               {logs?.length === 0 ? (
                 <p className="text-center py-10 text-slate-300 italic">No logs recorded for this site yet.</p>
               ) : logs?.map((log: any, i: number) => (
                 <div key={i} className="flex gap-5 group">
                   <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center shrink-0 border border-slate-100 group-hover:bg-blue-50 group-hover:border-blue-100 transition-all">
                     <HardHat size={20} className="text-slate-400 group-hover:text-blue-600" />
                   </div>
                   <div className="flex-1">
                     <h4 className="text-sm font-black text-[#001529]">{log.title}</h4>
                     <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter mt-0.5">
                       {log.staffName} • {new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                     </p>
                   </div>
                   <div className="text-[9px] font-black text-blue-600 bg-blue-50 px-3 py-1 rounded-lg h-fit uppercase tracking-widest">{log.status}</div>
                 </div>
               ))}
             </div>
          </div>

          {/* ACTIVE WORKFORCE */}
          <div className="bg-white rounded-[3rem] shadow-premium border border-slate-50 p-10">
             <h3 className="font-black text-[#001529] uppercase text-xs tracking-widest mb-10">Site Workforce</h3>
             <div className="grid grid-cols-4 gap-6">
                {project?.workers?.length > 0 ? project.workers.map((worker: any, i: number) => (
                  <div key={i} className="flex flex-col items-center">
                    <div className="w-16 h-16 rounded-[1.5rem] bg-slate-50 mb-3 overflow-hidden ring-4 ring-slate-50 group border border-slate-100">
                       <img src={worker.avatar || `https://i.pravatar.cc/150?u=${worker._id}`} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                    </div>
                    <span className="text-[9px] font-black text-emerald-500 uppercase tracking-tighter">On Site</span>
                  </div>
                )) : (
                  <div className="col-span-4 py-10 text-center border-2 border-dashed border-slate-100 rounded-[2rem]">
                    <Users className="mx-auto text-slate-200 mb-2" size={32} />
                    <p className="text-[10px] font-black text-slate-300 uppercase">No team members assigned</p>
                  </div>
                )}
             </div>
             <button className="w-full mt-12 py-5 bg-[#001529] text-white font-black text-[10px] uppercase tracking-[0.2em] rounded-2xl shadow-xl hover:bg-blue-700 transition-all">
                Assign Technical Team
             </button>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
};

export default ProjectDetail;