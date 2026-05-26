import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { DashboardShell } from '../components/layout/DashboardShell';
import apiClient from '../api/client';
import { User, MessageSquare, MapPin, Loader2, Inbox } from 'lucide-react';
import { motion } from 'framer-motion';
import { t, statusBadge } from '../theme';

const DirectoryLeads = () => {
  const queryClient = useQueryClient();

  const { data: leads, isLoading } = useQuery({
    queryKey: ['inquiries'],
    queryFn: async () => (await apiClient.get('/inquiries')).data,
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      apiClient.put(`/inquiries/${id}/status`, { status }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['inquiries'] }),
  });

  return (
    <DashboardShell>
      <div className="max-w-[1600px] mx-auto pb-20">
        <header className="mb-10">
          <h1 className={t.h1 + ' text-3xl'}>Inquiries</h1>
          <p className={t.muted + ' italic mt-1'}>Client inquiries received via the public directory.</p>
        </header>

        {isLoading ? (
          <div className="h-64 flex items-center justify-center text-white/35 font-bold animate-pulse">
            <Loader2 className="animate-spin mr-2" /> Syncing with Directory...
          </div>
        ) : leads?.length === 0 ? (
          <div className={t.emptyState}>
            <Inbox className="mx-auto text-white/15 mb-4" size={48} />
            <h3 className="text-xl font-bold text-white/50">No inquiries yet</h3>
            <p className={t.label + ' mt-1 italic'}>Update your profile to attract more clients</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {leads?.map((lead: any) => (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                key={lead._id}
                className="bg-brand-navy-card border border-brand-border p-6 rounded-[2.5rem] shadow-sm hover:shadow-card hover:border-brand-yellow/20 transition-all flex flex-col md:flex-row items-center justify-between group gap-6"
              >
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 bg-brand-yellow rounded-[1.5rem] flex items-center justify-center text-brand-navy font-black text-xl shadow-sm shrink-0">
                    {lead.clientName?.charAt(0) || '?'}
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-white">{lead.projectInterest || 'General Inquiry'}</h3>
                    <div className="flex items-center gap-4 mt-1 text-white/50 text-xs font-bold uppercase tracking-tight">
                      <span className="flex items-center gap-1"><User size={14} className="text-brand-yellow" /> {lead.clientName}</span>
                      <span className="flex items-center gap-1"><MapPin size={14} className="text-brand-yellow" /> {lead.location || 'BuildHub Network'}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-6 mt-4 md:mt-0">
                  <div className="text-right hidden md:block">
                    <p className={t.label + ' mb-0.5'}>Received</p>
                    <p className="text-xs font-bold text-white/50">{new Date(lead.createdAt).toLocaleDateString()}</p>
                  </div>

                  <button
                    onClick={() => statusMutation.mutate({ id: lead._id, status: 'Contacted' })}
                    className={statusBadge(lead.status) + ' px-5 py-2 cursor-pointer hover:opacity-80 transition-opacity'}
                  >
                    {lead.status}
                  </button>

                  <button className="p-4 bg-brand-navy-light border border-brand-border rounded-2xl text-white/50 group-hover:bg-brand-navy group-hover:text-white transition-all">
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
