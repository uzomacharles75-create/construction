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
            <h1 className="text-3xl font-black text-[#001529] tracking-tight">Registered Companies</h1>
            <p className="text-sm text-slate-400 font-medium italic underline underline-offset-4 decoration-blue-600/30">
               Managing {companies?.length || 0} business entities on the BuildHub network.
            </p>
          </div>
          
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="flex-1 md:w-80 bg-white border border-slate-100 rounded-2xl px-4 py-2.5 flex items-center gap-3 focus-within:ring-4 ring-blue-50 transition-all shadow-sm">
               <Search size={18} className="text-slate-300" />
               <input 
                type="text" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search company or owner..." 
                className="bg-transparent border-none outline-none text-xs w-full font-medium" 
               />
            </div>
            <button className="p-3 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-all shadow-sm">
               <Filter size={18} />
            </button>
          </div>
        </header>

        {/* DATA TABLE AREA */}
        <div className="bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] border-b border-slate-100">
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
                         <Loader2 className="animate-spin text-blue-600" size={32} />
                         <p className="font-bold text-slate-300 uppercase text-[10px] tracking-widest">Querying Regional Database...</p>
                      </div>
                    </td>
                  </tr>
                ) : filteredCompanies?.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-24 text-center">
                       <Inbox className="mx-auto text-slate-100 mb-4" size={64} />
                       <h3 className="text-xl font-bold text-slate-400">No matching entities</h3>
                       <p className="text-sm text-slate-300 mt-1">Refine your search parameters or check verification queue.</p>
                    </td>
                  </tr>
                ) : (
                  <AnimatePresence>
                    {filteredCompanies?.map((c: any) => (
                      <motion.tr 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        key={c._slug} 
                        className="text-sm font-bold text-slate-700 hover:bg-slate-50/50 transition-colors group cursor-pointer"
                      >
                        <td className="px-10 py-6">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-[#001529] rounded-2xl flex items-center justify-center text-white font-black text-xs italic shadow-lg shadow-blue-900/10 transition-transform group-hover:scale-105">
                               {c.logo ? <img src={c.logo} className="w-full h-full object-cover rounded-2xl" alt="" /> : c.name.charAt(0)}
                            </div>
                            <div>
                               <p className="text-[#001529] font-black">{c.name}</p>
                               <p className="text-[10px] text-slate-400 font-medium uppercase tracking-tighter mt-0.5">{c.city}, {c.country}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-10 py-6">
                           <div className="flex items-center gap-2">
                              <p className="text-slate-500 font-medium text-xs">{c.owner?.name || "Unassigned"}</p>
                              {c.isVerified && <ShieldCheck size={14} className="text-blue-500" />}
                           </div>
                        </td>
                        <td className="px-10 py-6">
                          <div className="flex items-center gap-2 bg-slate-50 w-fit px-3 py-1.5 rounded-xl border border-slate-100">
                             <Crown size={14} className={c.plan === 'Enterprise' ? 'text-amber-500' : 'text-blue-400'} /> 
                             <span className="text-[10px] font-black uppercase text-[#001529]">{c.plan}</span>
                          </div>
                        </td>
                        <td className="px-10 py-6">
                          <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                            c.status === 'verified' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 
                            c.status === 'suspended' ? 'bg-rose-50 text-rose-600 border border-rose-100' : 
                            'bg-slate-100 text-slate-400'
                          }`}>
                            {c.status}
                          </span>
                        </td>
                        <td className="px-10 py-6 text-right">
                          <div className="flex justify-end gap-2">
                             <button className="p-2.5 text-slate-300 hover:text-[#001529] hover:bg-white rounded-xl transition-all border border-transparent hover:border-slate-100 shadow-sm">
                                <ExternalLink size={18}/>
                             </button>
                             <button className="p-2.5 text-slate-300 hover:text-rose-500 rounded-xl transition-all">
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
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.4em]">BuildHub Africa • Master Directory v4.2</p>
            <div className="flex items-center gap-6">
               <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                  <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Global Integrity Check: Pass</span>
               </div>
               <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full" />
                  <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">System Load: 12%</span>
               </div>
            </div>
        </div>
      </div>
    </DashboardShell>
  );
};

export default AdminUsers;