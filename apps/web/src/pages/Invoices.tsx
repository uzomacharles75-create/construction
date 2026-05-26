import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { DashboardShell } from '../components/layout/DashboardShell';
import apiClient from '../api/client';
import { 
  Plus, 
  Download, 
  FileText, 
  Search, 
  Loader2, 
  Inbox,
  ArrowUpRight
} from 'lucide-react';
import { motion } from 'framer-motion';

const Invoices = () => {
  // 1. FETCH REAL INVOICES FROM BACKEND
  const { data: invoices, isLoading } = useQuery({
    queryKey: ['invoices-list'],
    queryFn: async () => {
      const { data } = await apiClient.get('/invoices');
      return data;
    }
  });

  const getStatusStyle = (status: string) => {
    switch (status.toLowerCase()) {
      case 'paid': return "bg-emerald-50 text-emerald-600 border-emerald-100";
      case 'overdue': return "bg-rose-50 text-rose-400 border-rose-100";
      default: return "bg-amber-50 text-amber-600 border-amber-100";
    }
  };

  return (
    <DashboardShell>
      <div className="max-w-[1600px] mx-auto pb-20">
        
        {/* HEADER SECTION */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
          <div>
            <h1 className="text-3xl font-black text-white tracking-tight">Billing & Invoices</h1>
            <p className="text-sm text-white/50 font-medium">Manage your company's accounts receivable and historical receipts.</p>
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
             <div className="flex-1 md:w-64 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/35" size={16} />
                <input type="text" placeholder="Search ID or Client..." className="w-full pl-10 pr-4 py-2.5 bg-brand-navy-card border border-brand-border rounded-xl text-xs outline-none focus:ring-2 focus:ring-brand-yellow/10" />
             </div>
             <Link 
                to="/dashboard/invoices/new" 
                className="bg-brand-yellow text-brand-navy px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-yellow hover:bg-brand-yellow-dim transition-all flex items-center gap-2 shrink-0"
             >
                <Plus size={16} /> New Invoice
             </Link>
          </div>
        </header>

        {/* DATA TABLE AREA */}
        <div className="bg-brand-navy-card rounded-[2.5rem] border border-brand-border overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-brand-navy-light text-[10px] font-black uppercase text-white/50 tracking-[0.1em] border-b border-brand-border">
                <tr>
                  <th className="px-8 py-5">Invoice ID</th>
                  <th className="px-8 py-5">Client / Project</th>
                  <th className="px-8 py-5">Date Issued</th>
                  <th className="px-8 py-5">Total Amount</th>
                  <th className="px-8 py-5">Status</th>
                  <th className="px-8 py-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="py-20 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <Loader2 className="animate-spin text-brand-yellow" size={32} />
                        <p className="font-bold text-white/50 text-sm">Accessing Financial Records...</p>
                      </div>
                    </td>
                  </tr>
                ) : invoices?.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-24 text-center">
                       <Inbox className="mx-auto text-slate-100 mb-4" size={64} />
                       <h3 className="text-xl font-bold text-white/50">No documents found</h3>
                       <p className="text-sm text-white/35 mt-1">Create your first invoice to begin tracking revenue.</p>
                       <Link to="/dashboard/invoices/new" className="inline-block mt-6 text-brand-yellow font-bold text-xs underline">Generate Invoice Now</Link>
                    </td>
                  </tr>
                ) : (
                  invoices?.map((inv: any) => (
                    <motion.tr 
                      initial={{ opacity: 0 }} 
                      animate={{ opacity: 1 }} 
                      key={inv._id} 
                      className="text-sm font-bold text-white/90 hover:bg-brand-navy-light transition-colors group cursor-pointer"
                    >
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 bg-brand-navy-light rounded-xl flex items-center justify-center text-white/50 group-hover:bg-brand-navy-card group-hover:text-brand-yellow transition-all border border-transparent group-hover:border-brand-border">
                            <FileText size={16} />
                          </div>
                          <span className="text-brand-yellow font-black">{inv.invoiceNumber}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div>
                          <p className="text-white">{inv.client?.name || "Private Client"}</p>
                          <p className="text-[10px] text-white/50 font-medium uppercase tracking-tighter">Verified Project</p>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-white/50 font-medium italic">
                        {new Date(inv.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </td>
                      <td className="px-8 py-6 font-black text-white text-base">
                        ${inv.totalAmount?.toLocaleString()}
                      </td>
                      <td className="px-8 py-6">
                        <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${getStatusStyle(inv.status)}`}>
                          {inv.status}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex justify-end gap-2">
                          <button className="p-2.5 text-white/35 hover:text-brand-yellow hover:bg-brand-yellow-pale rounded-xl transition-all shadow-sm">
                            <Download size={18}/>
                          </button>
                          <button className="p-2.5 text-white/35 hover:text-white hover:bg-brand-navy-light rounded-xl transition-all">
                            <ArrowUpRight size={18}/>
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* SUMMARY FOOTER (Owner Analytics) */}
        {!isLoading && invoices?.length > 0 && (
          <div className="mt-8 flex justify-end">
            <div className="bg-brand-navy p-6 rounded-[2rem] text-white flex items-center gap-10 shadow-2xl px-10">
               <div>
                  <p className="text-[10px] font-black text-brand-muted uppercase tracking-widest mb-1">Total Outstanding</p>
                  <h4 className="text-2xl font-black italic">
                    ${invoices?.reduce((acc: number, curr: any) => curr.status === 'Pending' ? acc + curr.totalAmount : acc, 0).toLocaleString()}
                  </h4>
               </div>
               <div className="w-px h-10 bg-brand-navy-card/10" />
               <div>
                  <p className="text-[10px] font-black text-brand-muted uppercase tracking-widest mb-1">Documents</p>
                  <h4 className="text-2xl font-black italic">{invoices?.length}</h4>
               </div>
            </div>
          </div>
        )}
      </div>
    </DashboardShell>
  );
};

export default Invoices;