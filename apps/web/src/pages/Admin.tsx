import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../api/client';
import { DashboardShell } from '../components/layout/DashboardShell';
import { ShieldAlert, CheckCircle, XCircle, BarChart } from 'lucide-react';

const Admin = () => {
  const queryClient = useQueryClient();

  // 1. Fetch Pending Companies
  const { data: pendingCompanies, isLoading: loadingQueue } = useQuery({
    queryKey: ['admin-pending'],
    queryFn: async () => {
      const { data } = await apiClient.get('/admin/pending');
      return data;
    }
  });

  // 2. Fetch Stats
  const { data: stats } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const { data } = await apiClient.get('/admin/stats');
      return data;
    }
  });

  // 3. Mutation to Verify/Reject
  const verifyMutation = useMutation({
    mutationFn: ({ id, status }: { id: string, status: string }) => 
      apiClient.put(`/admin/verify/${id}`, { status }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-pending'] })
  });

  return (
    <DashboardShell>
      <div className="max-w-7xl mx-auto pb-20">
        <div className="flex items-center gap-4 mb-10">
          <div className="bg-rose-500 p-3 rounded-2xl text-white shadow-lg">
            <ShieldAlert size={24} />
          </div>
          <h1 className="text-4xl font-black text-brand-navy tracking-tight italic">SuperAdmin</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* PENDING APPROVALS LIST (REAL DATA) */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-xl font-bold text-brand-navy">Company Verification Queue</h2>
            
            {loadingQueue ? <p>Loading queue...</p> : pendingCompanies?.map((company: any) => (
              <div key={company._id} className="bg-brand-navy-card border border-brand-border p-6 rounded-[2.5rem] shadow-premium border border-brand-border flex items-center justify-between transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-brand-navy-light rounded-2xl flex items-center justify-center text-white/50 font-black">
                    {company.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-brand-navy">{company.name}</h4>
                    <p className="text-xs text-white/50">{company.city}, {company.country}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => verifyMutation.mutate({ id: company._id, status: 'verified' })}
                    className="p-3 bg-emerald-50 text-emerald-500 rounded-xl hover:bg-emerald-500 hover:text-white transition-all">
                    <CheckCircle size={20} />
                  </button>
                  <button 
                    onClick={() => verifyMutation.mutate({ id: company._id, status: 'rejected' })}
                    className="p-3 bg-rose-50 text-rose-400 rounded-xl hover:bg-rose-600 hover:text-white transition-all">
                    <XCircle size={20} />
                  </button>
                </div>
              </div>
            ))}
            
            {pendingCompanies?.length === 0 && (
               <div className="p-10 text-center bg-brand-navy-light rounded-[3rem] text-white/50 font-medium">
                  Queue is empty. All companies are verified.
               </div>
            )}
          </div>

          {/* SYSTEM STATS (REAL DATA) */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-brand-navy">Platform Pulse</h2>
            <div className="bg-brand-navy p-8 rounded-[2.5rem] text-white shadow-2xl">
               <BarChart className="text-brand-yellow mb-4" />
               <p className="text-white/50 text-xs font-bold uppercase tracking-widest mb-1">Marketplace Volume</p>
               <h3 className="text-4xl font-black mb-6">${stats?.totalMarketplaceVolume.toLocaleString()}</h3>
               <div className="space-y-4">
                 <div className="flex justify-between text-xs">
                   <span className="text-brand-muted font-bold">Active Companies</span>
                   <span className="font-black">{stats?.activeCompanies}</span>
                 </div>
                 <div className="flex justify-between text-xs">
                   <span className="text-brand-muted font-bold">Live Tenders</span>
                   <span className="font-black">{stats?.liveTenders}</span>
                 </div>
               </div>
            </div>
          </div>

        </div>
      </div>
    </DashboardShell>
  );
};

export default Admin;