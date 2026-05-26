import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { DashboardShell } from '../../components/layout/DashboardShell';
import apiClient from '../../api/client';
import { 
  Search, 
  Crown, 
  ExternalLink, 
  Loader2, 
  ShieldCheck, 
  MoreVertical,
  Inbox,
  Filter
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AdminUsers = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // 1. FETCH REAL REGISTERED COMPANIES
  const { data: companies, isLoading } = useQuery({
    queryKey: ['admin-companies-list'],
    queryFn: async () => {
      const { data } = await apiClient.get('/admin/companies');
      return data;
    }
  });

  // 2. SEARCH FILTER LOGIC
  const filteredCompanies = companies?.filter((c: any) => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.owner?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardShell>
      <div className="max-w-[1600px] mx-auto pb-20">
        
        {/* HEADER SECTION */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
          <div>
            <h1 className="text-3xl font-black text-white tracking-tight">Registered Companies</h1>
            <p className="text-sm text-white/50 font-medium italic underline underline-offset-4 decoration-blue-600/30">
               Managing {companies?.length || 0} business entities on the BuildHub network.
            </p>
          </div>
          
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="flex-1 md:w-80 bg-brand-navy-card border border-brand-border rounded-2xl px-4 py-2.5 flex items-center gap-3 focus-within:ring-4 ring-brand-yellow transition-all shadow-sm">
               <Search size={18} className="text-white/35" />
               <input 
                type="text" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search company or owner..." 
                className="bg-transparent border-none outline-none text-xs w-full font-medium" 
               />
            </div>
            <button className="p-3 bg-brand-navy-card border border-brand-border rounded-2xl text-white/50 hover:text-brand-yellow hover:bg-brand-yellow-pale transition-all shadow-sm">
               <Filter size={18} />
            </button>
          </div>
        </header>

        {/* DATA TABLE AREA */}
        <div className="bg-brand-navy-card rounded-[2.5rem] border border-brand-border overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-brand-navy-light text-[10px] font-black uppercase text-white/50 tracking-[0.2em] border-b border-brand-border">
                <tr>
                  <th className="px-10 py-6">Business Identity</th>
                  <th className="px-10 py-6">Admin / Owner</th>
                  <th className="px-10 py-6">Subscription</th>
                  <th className="px-10 py-6">Network Status</th>
                  <th className="px-10 py-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="py-20 text-center">
                      <div className="flex flex-col items-center gap-3">
                         <Loader2 className="animate-spin text-brand-yellow" size={32} />
                         <p className="font-bold text-white/35 uppercase text-[10px] tracking-widest">Querying Regional Database...</p>
                      </div>
                    </td>
                  </tr>
                ) : filteredCompanies?.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-24 text-center">
                       <Inbox className="mx-auto text-slate-100 mb-4" size={64} />
                       <h3 className="text-xl font-bold text-white/50">No matching entities</h3>
                       <p className="text-sm text-white/35 mt-1">Refine your search parameters or check verification queue.</p>
                    </td>
                  </tr>
                ) : (
                  <AnimatePresence>
                    {filteredCompanies?.map((c: any) => (
                      <motion.tr 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        key={c._slug} 
                        className="text-sm font-bold text-white/90 hover:bg-brand-navy-light/50 transition-colors group cursor-pointer"
                      >
                        <td className="px-10 py-6">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-brand-navy rounded-2xl flex items-center justify-center text-white font-black text-xs italic shadow-lg shadow-yellow transition-transform group-hover:scale-105">
                               {c.logo ? <img src={c.logo} className="w-full h-full object-cover rounded-2xl" alt="" /> : c.name.charAt(0)}
                            </div>
                            <div>
                               <p className="text-white font-black">{c.name}</p>
                               <p className="text-[10px] text-white/50 font-medium uppercase tracking-tighter mt-0.5">{c.city}, {c.country}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-10 py-6">
                           <div className="flex items-center gap-2">
                              <p className="text-brand-muted font-medium text-xs">{c.owner?.name || "Unassigned"}</p>
                              {c.isVerified && <ShieldCheck size={14} className="text-brand-yellow" />}
                           </div>
                        </td>
                        <td className="px-10 py-6">
                          <div className="flex items-center gap-2 bg-brand-navy-light w-fit px-3 py-1.5 rounded-xl border border-brand-border">
                             <Crown size={14} className={c.plan === 'Enterprise' ? 'text-amber-500' : 'text-brand-yellow'} /> 
                             <span className="text-[10px] font-black uppercase text-white">{c.plan}</span>
                          </div>
                        </td>
                        <td className="px-10 py-6">
                          <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                            c.status === 'verified' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 
                            c.status === 'suspended' ? 'bg-rose-50 text-rose-400 border border-rose-100' : 
                            'bg-brand-navy-light text-white/50'
                          }`}>
                            {c.status}
                          </span>
                        </td>
                        <td className="px-10 py-6 text-right">
                          <div className="flex justify-end gap-2">
                             <button className="p-2.5 text-white/35 hover:text-white hover:bg-brand-navy-card rounded-xl transition-all border border-transparent hover:border-brand-border shadow-sm">
                                <ExternalLink size={18}/>
                             </button>
                             <button className="p-2.5 text-white/35 hover:text-rose-500 rounded-xl transition-all">
                                <MoreVertical size={18}/>
                             </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* BOTTOM METRICS */}
        <div className="mt-8 flex flex-col md:flex-row items-center justify-between px-4 gap-4 opacity-50">
            <p className="text-[9px] font-black text-white/50 uppercase tracking-[0.4em]">BuildHub Africa • Master Directory v4.2</p>
            <div className="flex items-center gap-6">
               <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                  <span className="text-[9px] font-black text-brand-muted uppercase tracking-widest">Global Integrity Check: Pass</span>
               </div>
               <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-brand-yellow rounded-full" />
                  <span className="text-[9px] font-black text-brand-muted uppercase tracking-widest">System Load: 12%</span>
               </div>
            </div>
        </div>
      </div>
    </DashboardShell>
  );
};

export default AdminUsers;