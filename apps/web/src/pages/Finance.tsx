import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { DashboardShell } from '../components/layout/DashboardShell';
import apiClient from '../api/client';
import { 
  FileText, 
  ArrowUpRight, 
  ArrowDownRight, 
  Plus, 
  Download,
  Filter,
  DollarSign,
  PieChart,
  Calendar,
  Loader2,
  TrendingUp
} from 'lucide-react';
import { motion } from 'framer-motion';

const FinanceCard = ({ title, amount, trend, isPositive, isLoading }: any) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className="bg-white p-6 rounded-[2.5rem] shadow-premium border border-slate-50"
  >
    <div className="flex justify-between items-start mb-4">
      <div className="p-3 bg-slate-50 rounded-2xl text-slate-400">
        <DollarSign size={20} />
      </div>
      {!isLoading && (
        <div className={`flex items-center gap-1 text-[10px] font-black px-2 py-1 rounded-lg ${
          isPositive ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
        }`}>
          {isPositive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
          {trend}%
        </div>
      )}
    </div>
    <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">{title}</p>
    <h3 className="text-3xl font-black text-[#001529] mt-1 tracking-tighter">
      {isLoading ? <Loader2 className="animate-spin text-slate-200" size={24} /> : `$${amount?.toLocaleString()}`}
    </h3>
  </motion.div>
);

const InvoiceRow = ({ inv }: any) => {
  const statusStyles: any = {
    Paid: "bg-emerald-50 text-emerald-600 border-emerald-100",
    Pending: "bg-amber-50 text-amber-600 border-amber-100",
    Overdue: "bg-rose-50 text-rose-600 border-rose-100",
  };

  return (
    <tr className="group hover:bg-slate-50/50 transition-colors border-b border-slate-50">
      <td className="px-8 py-5">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-white group-hover:text-blue-600 transition-all">
            <FileText size={18} />
          </div>
          <div>
            <p className="font-black text-[#001529] text-xs">{inv.invoiceNumber}</p>
            <p className="text-[10px] text-slate-400 font-medium">Issued {new Date(inv.createdAt).toLocaleDateString()}</p>
          </div>
        </div>
      </td>
      <td className="px-8 py-5 font-bold text-slate-600 text-xs">{inv.client?.name || "Private Project"}</td>
      <td className="px-8 py-5 font-black text-[#001529] text-sm">${inv.totalAmount?.toLocaleString()}</td>
      <td className="px-8 py-5">
        <span className={`px-4 py-1 rounded-full text-[9px] font-black border uppercase tracking-widest ${statusStyles[inv.status]}`}>
          {inv.status}
        </span>
      </td>
      <td className="px-8 py-5 text-right">
        <button className="p-2 text-slate-300 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all">
          <Download size={18} />
        </button>
      </td>
    </tr>
  );
};

const Finance = () => {
  // 1. FETCH FINANCIAL SUMMARY
  const { data: summary, isLoading: summaryLoading } = useQuery({
    queryKey: ['finance-summary'],
    queryFn: async () => {
      const { data } = await apiClient.get('/auth/company/summary');
      return data;
    }
  });

  // 2. FETCH REAL INVOICES
  const { data: invoices, isLoading: invoicesLoading } = useQuery({
    queryKey: ['invoices-list'],
    queryFn: async () => {
      const { data } = await apiClient.get('/invoices');
      return data;
    }
  });

  return (
    <DashboardShell>
      <div className="max-w-[1600px] mx-auto pb-20">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="text-4xl font-black text-[#001529] tracking-tight">Finance Control</h1>
            <p className="text-sm text-slate-400 font-medium italic">Monitor cash flow and tax-compliant documentation.</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="bg-white px-5 py-3 rounded-2xl border border-slate-200 text-slate-400 font-black text-[10px] uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center gap-2">
              <Calendar size={16} /> Last 30 Days
            </button>
            <Link to="/dashboard/invoices/new" className="bg-[#001529] text-white px-8 py-3.5 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-blue-900/20 hover:bg-blue-700 hover:scale-105 transition-all flex items-center gap-2">
              <Plus size={18} /> New Invoice
            </Link>
          </div>
        </header>

        {/* FINANCIAL STATS GRID (CONNECTED TO BACKEND) */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <FinanceCard title="Total Revenue" amount={summary?.totalIncome || 0} trend="12.5" isPositive={true} isLoading={summaryLoading} />
          <FinanceCard title="Outstanding" amount={summary?.outstanding || 0} trend="2.1" isPositive={false} isLoading={summaryLoading} />
          <FinanceCard title="Net Profit" amount={summary?.balance || 0} trend="8.4" isPositive={true} isLoading={summaryLoading} />
          <FinanceCard title="Operating Expenses" amount={summary?.totalExpenses || 0} trend="5.2" isPositive={true} isLoading={summaryLoading} />
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* RECENT INVOICES TABLE (REAL DATA) */}
          <div className="lg:col-span-2 bg-white rounded-[3rem] shadow-premium border border-slate-100 overflow-hidden">
            <div className="p-8 border-b border-slate-50 flex justify-between items-center px-10">
              <h2 className="font-black text-[#001529] text-lg flex items-center gap-2">
                <TrendingUp size={20} className="text-blue-600" /> Recent Billing
              </h2>
              <button className="p-2.5 text-slate-400 hover:bg-slate-50 rounded-xl transition-all border border-slate-100"><Filter size={18} /></button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50/50 text-slate-400 text-[10px] uppercase tracking-[0.2em] font-black">
                    <th className="px-10 py-5">Document</th>
                    <th className="px-10 py-5">Client</th>
                    <th className="px-10 py-5">Amount</th>
                    <th className="px-10 py-5">Status</th>
                    <th className="px-10 py-5"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {invoicesLoading ? (
                    <tr><td colSpan={5} className="py-20 text-center animate-pulse font-bold text-slate-300">Fetching accounts...</td></tr>
                  ) : invoices?.length === 0 ? (
                    <tr><td colSpan={5} className="py-20 text-center text-slate-400 font-medium">No invoices found for this period.</td></tr>
                  ) : invoices?.map((inv: any) => (
                    <InvoiceRow key={inv._id} inv={inv} />
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* PROFIT DISTRIBUTION CHART */}
          <div className="bg-white rounded-[3rem] shadow-premium border border-slate-100 p-10">
            <div className="flex items-center justify-between mb-10">
              <h2 className="font-black text-[#001529] text-lg">Expense Logic</h2>
              <PieChart size={20} className="text-blue-600" />
            </div>
            
            <div className="space-y-8">
              {[
                { label: 'Site Materials', value: 45, color: 'bg-blue-600' },
                { label: 'Workforce Labor', value: 30, color: 'bg-indigo-500' },
                { label: 'Heavy Equipment', value: 15, color: 'bg-purple-500' },
                { label: 'Platform Fees', value: 10, color: 'bg-emerald-500' },
              ].map((item) => (
                <div key={item.label}>
                  <div className="flex justify-between text-[10px] font-black mb-3">
                    <span className="text-slate-400 uppercase tracking-widest">{item.label}</span>
                    <span className="text-[#001529]">{item.value}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${item.value}%` }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                      className={`h-full ${item.color}`} 
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12 p-8 bg-[#001529] rounded-[2.5rem] text-white shadow-2xl">
               <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Cumulative Spending</p>
               <h4 className="text-3xl font-black">${summary?.totalExpenses?.toLocaleString() || '0.00'}</h4>
               <button className="mt-6 w-full py-3 bg-white/10 hover:bg-white/20 transition-all rounded-xl text-[10px] font-black uppercase tracking-widest border border-white/10">Analyze Variance</button>
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
};

export default Finance;