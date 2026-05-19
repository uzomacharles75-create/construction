import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { DashboardShell } from '../components/layout/DashboardShell';
import apiClient from '../api/client';
import { User, MessageSquare, MapPin, Loader2,  Inbox } from 'lucide-react';
import { motion } from 'framer-motion';

const DirectoryLeads = () => {
  const queryClient = useQueryClient();

  // 1. FETCH REAL INQUIRIES FROM BACKEND
  const { data: leads, isLoading } = useQuery({
    queryKey: ['directory-leads'],
    queryFn: async () => {
      const { data } = await apiClient.get('/inquiries'); // Fetches inquiries for your company
      return data;
    }
  });

  // 2. MUTATION TO UPDATE LEAD STATUS (e.g., New -> Contacted)
  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string, status: string }) => 
      apiClient.put(`/inquiries/${id}/status`, { status }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['directory-leads'] })
  });

  return (
    <DashboardShell>
      <div className="max-w-[1600px] mx-auto pb-20">
        <header className="mb-10">
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Directory Inquiries</h1>
          <p className="text-sm text-slate-400 font-medium italic underline underline-offset-4 decoration-blue-600/20">
            Real-time leads from potential clients finding your business profile.
          </p>
        </header>

        {isLoading ? (
          <div className="h-64 flex items-center justify-center font-bold text-slate-300 animate-pulse">
            <Loader2 className="animate-spin mr-2" /> Syncing with Directory...
          </div>
        ) : leads?.length === 0 ? (
          <div className="bg-white p-20 rounded-[3rem] border-2 border-dashed border-slate-100 text-center">
             <Inbox className="mx-auto text-slate-200 mb-4" size={48} />
             <h3 className="text-xl font-bold text-slate-400">No inquiries yet</h3>
             <p className="text-xs text-slate-300 mt-1 uppercase font-black tracking-widest">Update your profile to attract more clients</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {leads?.map((lead: any) => (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                key={lead._id} 
                className="bg-white p-6 rounded-[2.5rem] border border-slate-50 shadow-sm hover:shadow-xl transition-all flex flex-col md:flex-row items-center justify-between group"
              >
                <div className="flex items-center gap-6">
                  {/* DYNAMIC AVATAR BASED ON CLIENT NAME */}
                  <div className="w-16 h-16 bg-blue-600 rounded-[1.5rem] flex items-center justify-center text-white font-black text-xl shadow-lg shadow-blue-100">
                    {lead.clientName.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-slate-800">{lead.projectInterest || "General Inquiry"}</h3>
                    <div className="flex items-center gap-4 mt-1 text-slate-400 text-xs font-bold uppercase tracking-tight">
                      <span className="flex items-center gap-1"><User size={14} className="text-blue-600" /> {lead.clientName}</span>
                      <span className="flex items-center gap-1"><MapPin size={14} className="text-blue-600" /> {lead.location || "BuildHub Network"}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-8 mt-4 md:mt-0">
                  <div className="text-right hidden md:block">
                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">Received</p>
                    <p className="text-xs font-bold text-slate-500">
                      {new Date(lead.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  
                  {/* CLICKABLE STATUS BADGE */}
                  <button 
                    onClick={() => statusMutation.mutate({ id: lead._id, status: 'Contacted' })}
                    className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
                      lead.status === 'New' 
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 hover:bg-blue-700' 
                      : 'bg-slate-50 text-slate-400 border border-slate-100'
                    }`}
                  >
                    {lead.status}
                  </button>

                  <button className="p-4 bg-slate-50 rounded-2xl text-slate-400 group-hover:bg-[#001529] group-hover:text-white transition-all shadow-sm">
                    <MessageSquare size={20} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </DashboardShell>
  );
};

export default DirectoryLeads;