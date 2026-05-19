import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { DashboardShell } from '../components/layout/DashboardShell';
import apiClient from '../api/client';
import { useAuthStore } from '../store/useAuthStore';
import { 
  Users, 
  UserPlus, 
  ShieldCheck,
  Briefcase,
  Star,
  Loader2,
  Search,
  X,
  Inbox,
  HardHat,
  CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- SUB-COMPONENT: WORKER CARD ---
const WorkerCard = ({ worker }: any) => (
  <motion.div 
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={{ y: -5 }}
    className="bg-white p-8 rounded-[3rem] border border-slate-50 shadow-sm hover:shadow-xl transition-all flex flex-col items-center text-center relative overflow-hidden"
  >
    <div className="absolute top-6 right-6">
       <div className={`w-3 h-3 rounded-full border-2 border-white shadow-sm ${
         worker.status === 'Active' ? 'bg-emerald-500' : 'bg-amber-400'
       }`} />
    </div>

    <div className="relative mb-6">
      <div className="w-24 h-24 rounded-[2.5rem] overflow-hidden bg-slate-50 ring-4 ring-slate-50 border border-slate-100 flex items-center justify-center">
        {worker.image ? (
          <img src={worker.image} alt={worker.name} className="w-full h-full object-cover" />
        ) : (
          <span className="text-3xl font-black text-[#001529] italic opacity-20">{worker.name.charAt(0)}</span>
        )}
      </div>
    </div>

    <h3 className="text-xl font-black text-[#001529] mb-1">{worker.name}</h3>
    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6">{worker.role}</p>
    
    <div className="flex items-center gap-1.5 text-amber-500 mb-8 bg-amber-50/50 px-3 py-1 rounded-full">
      <Star size={14} fill="currentColor" />
      <span className="text-[10px] font-black">{worker.rating || '5.0'} Verified</span>
    </div>

    <div className="flex flex-wrap justify-center gap-2 mb-10">
      {worker.skills?.map((skill: string) => (
        <span key={skill} className="px-3 py-1 bg-slate-50 text-slate-500 text-[9px] font-black uppercase rounded-lg border border-slate-100 tracking-wider">
          {skill}
        </span>
      ))}
    </div>

    <div className="w-full grid grid-cols-2 gap-3 mt-auto">
      <button className="py-4 bg-[#001529] text-white text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-blue-600 transition-all shadow-lg shadow-blue-900/10">
        Profile
      </button>
      <button className="py-4 bg-slate-50 text-slate-500 text-[10px] font-black uppercase tracking-widest rounded-2xl border border-slate-100 hover:bg-white hover:text-blue-600 transition-all">
        Message
      </button>
    </div>
  </motion.div>
);

const Workforce = () => {
  const queryClient = useQueryClient();
  const { user } = useAuthStore(); // REAL USER DATA
  const [searchTerm, setSearchTerm] = useState('');
  
  // MODAL STATE
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newMember, setNewMember] = useState({ name: '', role: 'Site Engineer', skills: '' });

  // 1. FETCH REAL WORKERS
  const { data: workers, isLoading } = useQuery({
    queryKey: ['workforce-list'],
    queryFn: async () => {
      const { data } = await apiClient.get('/workforce');
      return data;
    }
  });

  // 2. ADD MEMBER MUTATION
  const addMutation = useMutation({
    mutationFn: (data: any) => apiClient.post('/workforce', data),
    onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['workforce-list'] });
        setIsModalOpen(false);
        setNewMember({ name: '', role: 'Site Engineer', skills: '' });
    }
  });

  const filteredWorkers = workers?.filter((w: any) => 
    w.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    w.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardShell>
      <div className="max-w-[1600px] mx-auto pb-20">
        
        {/* HEADER */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-black text-[#001529] tracking-tight italic">
                {user?.company ? `${user.company} Workforce` : "Workforce & HR"}
            </h1>
            <p className="text-sm text-slate-400 font-medium">Manage professional site engineers, foremen, and team growth.</p>
          </div>
          <div className="flex items-center gap-3">
             <div className="hidden md:flex items-center bg-white border border-slate-100 rounded-2xl px-4 py-2.5 w-64 focus-within:ring-4 ring-blue-50 transition-all shadow-sm">
                <Search size={18} className="text-slate-300" />
                <input 
                    type="text" 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by name or role..." 
                    className="bg-transparent border-none outline-none text-xs ml-3 w-full font-medium" 
                />
             </div>
             <button 
                onClick={() => setIsModalOpen(true)}
                className="bg-blue-600 text-white px-8 py-4 rounded-3xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-900/20 hover:bg-blue-700 transition-all flex items-center gap-2"
             >
                <UserPlus size={18} /> Add Member
             </button>
          </div>
        </header>

        {/* ANALYTICS STRIP */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-[#001529] p-8 rounded-[3rem] text-white shadow-2xl relative overflow-hidden flex items-center justify-between">
            <div className="absolute top-[-10px] right-[-10px] opacity-10"><Users size={80} /></div>
            <div className="relative z-10">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Active Personnel</p>
              <h3 className="text-4xl font-black italic">{isLoading ? "..." : workers?.filter((w:any) => w.status === 'Active').length}</h3>
            </div>
            <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg relative z-10">
               <ShieldCheck size={24} />
            </div>
          </div>

          <div className="bg-white p-8 rounded-[3rem] border border-slate-50 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Team Efficiency</p>
              <h3 className="text-4xl font-black text-[#001529] italic">94%</h3>
            </div>
            <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600">
               <Briefcase size={24} />
            </div>
          </div>

          <div className="bg-white p-8 rounded-[3rem] border border-slate-50 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Assets</p>
              <h3 className="text-4xl font-black text-[#001529] italic">{isLoading ? "..." : workers?.length || 0}</h3>
            </div>
            <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600">
               <Users size={24} />
            </div>
          </div>
        </div>

        {/* WORKER GRID */}
        {isLoading ? (
          <div className="py-20 text-center"><Loader2 className="animate-spin text-blue-600 mx-auto" size={40} /></div>
        ) : filteredWorkers?.length === 0 ? (
          <div className="bg-white p-20 rounded-[4rem] text-center border-2 border-dashed border-slate-100">
             <Inbox className="mx-auto text-slate-100 mb-4" size={64} />
             <h3 className="text-xl font-bold text-slate-400">No members found</h3>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <AnimatePresence>
              {filteredWorkers?.map((worker: any) => (
                <WorkerCard key={worker._id} worker={worker} />
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* --- ADD MEMBER MODAL (NEW) --- */}
        <AnimatePresence>
          {isModalOpen && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
               <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={() => setIsModalOpen(false)}
                className="absolute inset-0 bg-[#001529]/60 backdrop-blur-md" 
               />
               
               <motion.div 
                initial={{ scale: 0.9, y: 20, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={{ scale: 0.9, y: 20, opacity: 0 }}
                className="bg-white w-full max-w-md rounded-[3rem] p-10 relative z-10 shadow-2xl border border-white"
               >
                  <button onClick={() => setIsModalOpen(false)} className="absolute top-8 right-8 text-slate-300 hover:text-rose-500 transition-colors">
                    <X size={24} />
                  </button>
                  
                  <div className="mb-10 text-center">
                    <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mx-auto mb-4">
                        <HardHat size={32} />
                    </div>
                    <h2 className="text-2xl font-black text-[#001529] tracking-tight">Onboard Member</h2>
                    <p className="text-slate-400 text-xs font-medium mt-1 uppercase tracking-widest">BuildHub Professional Registry</p>
                  </div>

                  <div className="space-y-4">
                     <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Full Name</label>
                        <input 
                            type="text" 
                            value={newMember.name}
                            onChange={(e) => setNewMember({...newMember, name: e.target.value})}
                            className="w-full p-4 bg-slate-50 border-none rounded-2xl text-sm font-bold text-[#001529] outline-none focus:ring-2 ring-blue-600/20" 
                            placeholder="e.g. Samuel Ndip"
                        />
                     </div>
                     <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Professional Role</label>
                        <select 
                            value={newMember.role}
                            onChange={(e) => setNewMember({...newMember, role: e.target.value})}
                            className="w-full p-4 bg-slate-50 border-none rounded-2xl text-sm font-bold text-[#001529] outline-none"
                        >
                            <option>Site Engineer</option>
                            {/*<option>Architect</option>
                            <option>Site Foreman</option>
                            <option>Quantity Surveyor</option>*/}
                        </select>
                     </div>
                     <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Key Skills</label>
                        <input 
                            type="text" 
                            value={newMember.skills}
                            onChange={(e) => setNewMember({...newMember, skills: e.target.value})}
                            className="w-full p-4 bg-slate-50 border-none rounded-2xl text-sm font-bold text-[#001529] outline-none focus:ring-2 ring-blue-600/20" 
                            placeholder="e.g. AutoCAD, Masonry, Safety"
                        />
                     </div>
                  </div>

                  <button 
                    onClick={() => addMutation.mutate({
                        ...newMember, 
                        skills: newMember.skills.split(',').map(s => s.trim())
                    })}
                    disabled={addMutation.isPending || !newMember.name}
                    className="w-full mt-10 bg-blue-600 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl hover:bg-blue-700 disabled:bg-slate-100 transition-all flex items-center justify-center gap-3"
                  >
                    {addMutation.isPending ? <Loader2 className="animate-spin" size={18} /> : <CheckCircle2 size={18} />}
                    Verify & Onboard
                  </button>
               </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </DashboardShell>
  );
};

export default Workforce;