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
    className="bg-brand-navy-card border border-brand-border p-6 rounded-[2.5rem] shadow-premium border border-brand-border"
  >
    <div className="flex justify-between items-start mb-4">
      <div className="p-3 bg-brand-navy-light rounded-2xl text-white/50">
        <DollarSign size={20} />
      </div>
      {!isLoading && (
        <div className={`flex items-center gap-1 text-[10px] font-black px-2 py-1 rounded-lg ${
          isPositive ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-400'
        }`}>
          {isPositive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
          {trend}%
        </div>
      )}
    </div>
    <p className="text-white/50 text-[10px] font-black uppercase tracking-widest">{title}</p>
    <h3 className="text-3xl font-black text-white mt-1 tracking-tighter">
      {isLoading ? <Loader2 className="animate-spin text-white/15" size={24} /> : `$${amount?.toLocaleString()}`}
    </h3>
  </motion.div>
);

const InvoiceRow = ({ inv }: any) => {
  const statusStyles: any = {
    Paid: "bg-emerald-50 text-emerald-600 border-emerald-100",
    Pending: "bg-amber-50 text-amber-600 border-amber-100",
    Overdue: "bg-rose-50 text-rose-400 border-rose-100",
  };

  return (
    <tr className="group hover:bg-brand-navy-light/50 transition-colors border-b border-brand-border">
      <td className="px-8 py-5">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-brand-navy-light rounded-xl flex items-center justify-center text-white/50 group-hover:bg-brand-navy-card group-hover:text-brand-yellow transition-all">
            <FileText size={18} />
          </div>
          <div>
            <p className="font-black text-white text-xs">{inv.invoiceNumber}</p>
            <p className="text-[10px] text-white/50 font-medium">Issued {new Date(inv.createdAt).toLocaleDateString()}</p>
          </div>
        </div>
      </td>
      <td className="px-8 py-5 font-bold text-white/70 text-xs">{inv.client?.name || "Private Project"}</td>
      <td className="px-8 py-5 font-black text-white text-sm">${inv.totalAmount?.toLocaleString()}</td>
      <td className="px-8 py-5">
        <span className={`px-4 py-1 rounded-full text-[9px] font-black border uppercase tracking-widest ${statusStyles[inv.status]}`}>
          {inv.status}
        </span>
      </td>
      <td className="px-8 py-5 text-right">
        <button className="p-2 text-white/35 hover:text-brand-yellow hover:bg-brand-yellow-pale rounded-xl transition-all">
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
            <h1 className="text-4xl font-black text-white tracking-tight">Finance Control</h1>
            <p className="text-sm text-white/50 font-medium italic">Monitor cash flow and tax-compliant documentation.</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="bg-brand-navy-card px-5 py-3 rounded-2xl border border-brand-border text-white/50 font-black text-[10px] uppercase tracking-widest hover:bg-brand-navy-light transition-all flex items-center gap-2">
              <Calendar size={16} /> Last 30 Days
            </button>
            <Link to="/dashboard/invoices/new" className="bg-brand-navy text-white px-8 py-3.5 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-yellow hover:bg-brand-yellow-dim hover:scale-105 transition-all flex items-center gap-2">
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
          <div className="lg:col-span-2 bg-brand-navy-card rounded-[3rem] shadow-premium border border-brand-border overflow-hidden">
            <div className="p-8 border-b border-brand-border flex justify-between items-center px-10">
              <h2 className="font-black text-white text-lg flex items-center gap-2">
                <TrendingUp size={20} className="text-brand-yellow" /> Recent Billing
              </h2>
              <button className="p-2.5 text-white/50 hover:bg-brand-navy-light rounded-xl transition-all border border-brand-border"><Filter size={18} /></button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-brand-navy-light/50 text-white/50 text-[10px] uppercase tracking-[0.2em] font-black">
                    <th className="px-10 py-5">Document</th>
                    <th className="px-10 py-5">Client</th>
                    <th className="px-10 py-5">Amount</th>
                    <th className="px-10 py-5">Status</th>
                    <th className="px-10 py-5"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {invoicesLoading ? (
                    <tr><td colSpan={5} className="py-20 text-center animate-pulse font-bold text-white/35">Fetching accounts...</td></tr>
                  ) : invoices?.length === 0 ? (
                    <tr><td colSpan={5} className="py-20 text-center text-white/50 font-medium">No invoices found for this period.</td></tr>
                  ) : invoices?.map((inv: any) => (
                    <InvoiceRow key={inv._id} inv={inv} />
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* PROFIT DISTRIBUTION CHART */}
          <div className="bg-brand-navy-card rounded-[3rem] shadow-premium border border-brand-border p-10">
            <div className="flex items-center justify-between mb-10">
              <h2 className="font-black text-white text-lg">Expense Logic</h2>
              <PieChart size={20} className="text-brand-yellow" />
            </div>
            
            <div className="space-y-8">
              {[
                { label: 'Site Materials', value: 45, color: 'bg-brand-yellow' },
                { label: 'Workforce Labor', value: 30, color: 'bg-indigo-500' },
                { label: 'Heavy Equipment', value: 15, color: 'bg-purple-500' },
                { label: 'Platform Fees', value: 10, color: 'bg-emerald-500' },
              ].map((item) => (
                <div key={item.label}>
                  <div className="flex justify-between text-[10px] font-black mb-3">
                    <span className="text-white/50 uppercase tracking-widest">{item.label}</span>
                    <span className="text-white">{item.value}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-brand-navy-light rounded-full overflow-hidden">
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

            <div className="mt-12 p-8 bg-brand-navy rounded-[2.5rem] text-white shadow-2xl">
               <p className="text-[10px] font-black text-brand-muted uppercase tracking-widest mb-1">Cumulative Spending</p>
               <h4 className="text-3xl font-black">${summary?.totalExpenses?.toLocaleString() || '0.00'}</h4>
               <button className="mt-6 w-full py-3 bg-brand-navy-card/10 hover:bg-brand-navy-card/20 transition-all rounded-xl text-[10px] font-black uppercase tracking-widest border border-brand-border/10">Analyze Variance</button>
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
};

export default Finance;