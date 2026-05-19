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
      case 'overdue': return "bg-rose-50 text-rose-600 border-rose-100";
      default: return "bg-amber-50 text-amber-600 border-amber-100";
    }
  };

  return (
    <DashboardShell>
      <div className="max-w-[1600px] mx-auto pb-20">
        
        {/* HEADER SECTION */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
          <div>
            <h1 className="text-3xl font-black text-[#001529] tracking-tight">Billing & Invoices</h1>
            <p className="text-sm text-slate-400 font-medium">Manage your company's accounts receivable and historical receipts.</p>
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
             <div className="flex-1 md:w-64 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                <input type="text" placeholder="Search ID or Client..." className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-100 rounded-xl text-xs outline-none focus:ring-2 ring-blue-600/10" />
             </div>
             <Link 
                to="/dashboard/invoices/new" 
                className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-900/20 hover:bg-blue-700 transition-all flex items-center gap-2 shrink-0"
             >
                <Plus size={16} /> New Invoice
             </Link>
          </div>
        </header>

        {/* DATA TABLE AREA */}
        <div className="bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-[10px] font-black uppercase text-slate-400 tracking-[0.1em] border-b border-slate-100">
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
                        <Loader2 className="animate-spin text-blue-600" size={32} />
                        <p className="font-bold text-slate-400 text-sm">Accessing Financial Records...</p>
                      </div>
                    </td>
                  </tr>
                ) : invoices?.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-24 text-center">
                       <Inbox className="mx-auto text-slate-100 mb-4" size={64} />
                       <h3 className="text-xl font-bold text-slate-400">No documents found</h3>
                       <p className="text-sm text-slate-300 mt-1">Create your first invoice to begin tracking revenue.</p>
                       <Link to="/dashboard/invoices/new" className="inline-block mt-6 text-blue-600 font-bold text-xs underline">Generate Invoice Now</Link>
                    </td>
                  </tr>
                ) : (
                  invoices?.map((inv: any) => (
                    <motion.tr 
                      initial={{ opacity: 0 }} 
                      animate={{ opacity: 1 }} 
                      key={inv._id} 
                      className="text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors group cursor-pointer"
                    >
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-white group-hover:text-blue-600 transition-all border border-transparent group-hover:border-slate-100">
                            <FileText size={16} />
                          </div>
                          <span className="text-blue-600 font-black">{inv.invoiceNumber}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div>
                          <p className="text-[#001529]">{inv.client?.name || "Private Client"}</p>
                          <p className="text-[10px] text-slate-400 font-medium uppercase tracking-tighter">Verified Project</p>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-slate-400 font-medium italic">
                        {new Date(inv.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </td>
                      <td className="px-8 py-6 font-black text-[#001529] text-base">
                        ${inv.totalAmount?.toLocaleString()}
                      </td>
                      <td className="px-8 py-6">
                        <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${getStatusStyle(inv.status)}`}>
                          {inv.status}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex justify-end gap-2">
                          <button className="p-2.5 text-slate-300 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all shadow-sm">
                            <Download size={18}/>
                          </button>
                          <button className="p-2.5 text-slate-300 hover:text-[#001529] hover:bg-slate-100 rounded-xl transition-all">
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
            <div className="bg-[#001529] p-6 rounded-[2rem] text-white flex items-center gap-10 shadow-2xl px-10">
               <div>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Total Outstanding</p>
                  <h4 className="text-2xl font-black italic">
                    ${invoices?.reduce((acc: number, curr: any) => curr.status === 'Pending' ? acc + curr.totalAmount : acc, 0).toLocaleString()}
                  </h4>
               </div>
               <div className="w-px h-10 bg-white/10" />
               <div>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Documents</p>
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