import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { DashboardShell } from '../../components/layout/DashboardShell';
import apiClient from '../../api/client';
import { 
  Layers, 
  MapPin, 
  ClipboardCheck, 
  Loader2, 
  Activity, 
  ArrowRight,
  Inbox
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const StaffProjects = () => {
  // 1. FETCH REAL ASSIGNED SITES
  const { data: projects, isLoading } = useQuery({
    queryKey: ['staff-assigned-projects'],
    queryFn: async () => {
      const { data } = await apiClient.get('/projects'); // Backend filters by staff assignment
      return data;
    }
  });

  return (
    <DashboardShell>
      <div className="max-w-[1600px] mx-auto pb-20">
        
        {/* HEADER SECTION */}
        <header className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-black text-[#001529] tracking-tight italic">Assigned Sites</h1>
            <p className="text-sm text-slate-400 font-medium">Monitoring site execution, resource logistics, and milestone progress.</p>
          </div>
          {!isLoading && projects?.length > 0 && (
            <div className="bg-blue-50 px-6 py-3 rounded-2xl border border-blue-100 flex items-center gap-3">
               <Activity size={18} className="text-blue-600 animate-pulse" />
               <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">
                  {projects.length} Active Assignments
               </span>
            </div>
          )}
        </header>

        {/* LOADING STATE */}
        {isLoading ? (
          <div className="py-20 text-center flex flex-col items-center">
            <Loader2 className="animate-spin text-blue-600 mb-4" size={40} />
            <p className="font-black text-slate-400 uppercase tracking-widest text-xs">Syncing Field Data...</p>
          </div>
        ) : projects?.length === 0 ? (
          /* EMPTY STATE */
          <div className="bg-white p-20 rounded-[4rem] text-center border-2 border-dashed border-slate-100">
             <Inbox className="mx-auto text-slate-100 mb-4" size={64} />
             <h3 className="text-xl font-bold text-slate-400">No sites assigned</h3>
             <p className="text-sm text-slate-300 mt-1 max-w-xs mx-auto">
                You haven't been assigned to any active projects. Contact your Site Manager for deployment.
             </p>
          </div>
        ) : (
          /* PROJECT GRID (REAL DATA) */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <AnimatePresence>
              {projects?.map((site: any, i: number) => (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ y: -8 }}
                  key={site._id} 
                  className="bg-white p-10 rounded-[3.5rem] border border-slate-50 shadow-sm hover:shadow-2xl transition-all group relative overflow-hidden"
                >
                  <div className="flex justify-between items-start mb-8 relative z-10">
                     <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform duration-500">
                        <Layers size={28}/>
                     </div>
                     <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                       site.status === 'In Progress' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-blue-50 text-blue-600 border-blue-100'
                     }`}>
                        {site.status}
                     </span>
                  </div>

                  <h3 className="text-2xl font-black text-[#001529] mb-2 leading-tight">{site.name}</h3>
                  <div className="flex items-center gap-2 text-slate-400 text-sm font-bold uppercase tracking-tight mb-10">
                    <MapPin size={16} className="text-blue-600" /> {site.location}
                  </div>
                  
                  {/* REAL PROGRESS LOGIC */}
                  <div className="space-y-3 mb-10">
                     <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        <span>Milestone Completion</span>
                        <span className="text-[#001529]">{site.progress}%</span>
                     </div>
                     <div className="w-full h-2.5 bg-slate-50 rounded-full overflow-hidden border border-slate-100">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${site.progress}%` }}
                          transition={{ duration: 1.5, ease: "easeOut" }}
                          className="h-full bg-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.4)]" 
                        />
                     </div>
                  </div>

                  <Link 
                    to={`/dashboard/projects/${site._id}`}
                    className="w-full py-5 bg-slate-50 text-slate-500 font-black text-[10px] uppercase tracking-[0.2em] rounded-2xl group-hover:bg-[#001529] group-hover:text-white transition-all flex items-center justify-center gap-3 shadow-sm group-hover:shadow-blue-900/20"
                  >
                     <ClipboardCheck size={18} /> Open Field Dashboard
                  </Link>

                  {/* BACKGROUND DECORATION */}
                  <div className="absolute bottom-[-20px] right-[-20px] opacity-[0.03] pointer-events-none group-hover:opacity-10 transition-opacity">
                    <Layers size={200} />
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* COMPLIANCE FOOTER */}
        <div className="mt-20 pt-8 border-t border-slate-100 text-center flex items-center justify-center gap-8 opacity-40">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">BuildHub ISO 9001:2015 Compliant</p>
            <div className="w-1.5 h-1.5 bg-slate-200 rounded-full" />
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">Engineering Standard v4.2</p>
        </div>
      </div>
    </DashboardShell>
  );
};

export default StaffProjects;