import { useQuery } from '@tanstack/react-query';
import { DashboardShell } from '../../components/layout/DashboardShell';
import { useAuthStore } from '../../store/useAuthStore';
import apiClient from '../../api/client';
import { 
  HardHat, 
  CheckCircle2, 
  Clock,  
  AlertTriangle, 
  Plus, 
  Activity,
  MapPin,
  ClipboardList
} from 'lucide-react';
import { motion } from 'framer-motion';

const StaffDashboard = () => {
  const { user } = useAuthStore();

  // 1. FETCH ENGINEER'S CURRENT TASKS
  const { data: tasks, isLoading: tasksLoading } = useQuery({
    queryKey: ['staff-tasks'],
    queryFn: async () => {
      const { data } = await apiClient.get('/workforce/tasks'); // Real endpoint for assigned tasks
      return data;
    }
  });

  // 2. FETCH PROJECT ACTIVITY FEED
  const { data: feed, isLoading: feedLoading } = useQuery({
    queryKey: ['site-feed'],
    queryFn: async () => {
      const { data } = await apiClient.get('/projects/logs/recent'); // Real endpoint for global site logs
      return data;
    }
  });

  return (
    <DashboardShell>
      <div className="max-w-[1600px] mx-auto pb-20">
        
        {/* HEADER SECTION */}
        <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <h1 className="text-3xl font-black text-[#001529] tracking-tight italic">
                Engineering Workspace
            </h1>
            <p className="text-sm text-slate-400 font-medium">
                Welcome back, {user?.name} • {new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}
            </p>
          </div>
          <button className="bg-[#001529] text-white px-8 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-900/20 hover:bg-blue-600 transition-all flex items-center gap-2">
            <Plus size={18} /> Submit Daily Site Log
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT COLUMN: CRITICAL OPS */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* TOP STATS GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-blue-600 p-8 rounded-[3rem] text-white shadow-2xl shadow-blue-900/20 relative overflow-hidden"
              >
                <div className="absolute right-[-20px] top-[-20px] opacity-10"><Clock size={140} /></div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60 mb-3 px-1">Active Shift</p>
                <h3 className="text-4xl font-black italic tracking-tighter">08:00 — 17:00</h3>
                <div className="mt-8 flex items-center gap-2 bg-white/10 w-fit px-4 py-1.5 rounded-full border border-white/10">
                   <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                   <span className="text-[10px] font-black uppercase tracking-widest">Currently On Site</span>
                </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm flex flex-col justify-between"
              >
                <div>
                    <AlertTriangle className="text-amber-500 mb-4" size={32} />
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Safety Protocols</p>
                    <h3 className="text-2xl font-black text-[#001529] tracking-tight mt-1">2 Pending Inspections</h3>
                </div>
                <p className="text-xs text-slate-400 font-medium mt-4 italic">Verify equipment at Sector 4 before next pour.</p>
              </motion.div>
            </div>

            {/* ASSIGNED TASKS (REAL DATA) */}
            <div className="bg-white p-10 rounded-[3.5rem] border border-slate-100 shadow-premium">
              <div className="flex justify-between items-center mb-10">
                <h3 className="font-black text-[#001529] uppercase text-xs tracking-[0.2em] flex items-center gap-2">
                   <ClipboardList size={18} className="text-blue-600" /> Site Action Items
                </h3>
                <span className="text-[10px] font-black text-slate-300 uppercase">{tasks?.length || 0} Assigned</span>
              </div>

              <div className="space-y-4">
                {tasksLoading ? (
                    <div className="py-10 text-center animate-pulse font-bold text-slate-300 uppercase text-[10px] tracking-widest">Fetching Task Queue...</div>
                ) : tasks?.length === 0 ? (
                    <div className="py-10 text-center text-slate-300 italic">No technical tasks assigned for today.</div>
                ) : tasks?.map((task: any, i: number) => (
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    key={i} 
                    className="flex items-center gap-5 p-5 hover:bg-slate-50 rounded-[2rem] transition-all border border-transparent hover:border-slate-100 group"
                  >
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm ${
                        task.status === 'Completed' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-400 group-hover:bg-white transition-all'
                    }`}>
                      {task.status === 'Completed' ? <CheckCircle2 size={20} /> : <HardHat size={20} />}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-black text-[#001529]">{task.title}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">
                        <MapPin size={10} className="inline mr-1" /> {task.projectName}
                      </p>
                    </div>
                    <div className="text-right">
                        <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                            task.priority === 'Urgent' ? 'bg-rose-50 text-rose-600' : 'bg-slate-100 text-slate-400'
                        }`}>
                            {task.priority || 'Normal'}
                        </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: SITE FEED & LOGS */}
          <div className="space-y-8">
            <div className="bg-[#001529] p-10 rounded-[3.5rem] text-white shadow-2xl relative overflow-hidden flex flex-col h-full min-h-[600px]">
              <div className="absolute top-[-30px] right-[-30px] opacity-5"><Activity size={200} /></div>
              
              <h3 className="font-black text-xs uppercase tracking-[0.2em] mb-10 flex items-center gap-3 relative z-10">
                <span className="w-2 h-2 bg-blue-500 rounded-full animate-ping" /> Real-time Site Feed
              </h3>
              
              <div className="flex-1 space-y-10 relative before:absolute before:left-[7px] before:top-2 before:bottom-2 before:w-0.5 before:bg-white/10 z-10">
                {feedLoading ? (
                    <div className="pl-10 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Loading Site Pulse...</div>
                ) : feed?.map((item: any, i: number) => (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    key={i} 
                    className="relative pl-10 group"
                  >
                    <div className="absolute left-0 top-1.5 w-4 h-4 rounded-full bg-[#001529] border-2 border-blue-600 group-hover:scale-125 transition-transform" />
                    <p className="text-xs font-black text-white">{item.staffName}</p>
                    <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">{item.actionText}</p>
                    <p className="text-[9px] text-blue-500 mt-2 font-black uppercase tracking-widest">
                        {item.timeAgo || 'Just Now'}
                    </p>
                  </motion.div>
                ))}
              </div>

              <button className="mt-12 w-full py-4 bg-white/5 hover:bg-white/10 transition-all rounded-2xl text-[10px] font-black uppercase tracking-widest border border-white/10 relative z-10">
                View Full Timeline
              </button>
            </div>
          </div>

        </div>
      </div>
    </DashboardShell>
  );
};

export default StaffDashboard;