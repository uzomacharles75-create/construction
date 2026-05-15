import React from 'react';
import { DashboardShell } from '../components/layout/DashboardShell';
import { 
  FileText, 
  ArrowUpRight, 
  ArrowDownRight, 
  Plus, 
  Download,
  Filter,
  DollarSign,
  PieChart,
  Calendar
} from 'lucide-react';
import { motion } from 'framer-motion';

const FinanceCard = ({ title, amount, trend, isPositive }: any) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className="bg-white p-6 rounded-[2.5rem] shadow-premium border border-white"
  >
    <div className="flex justify-between items-start mb-4">
      <div className="p-3 bg-slate-50 rounded-2xl text-slate-400">
        <DollarSign size={20} />
      </div>
      <div className={`flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-lg ${
        isPositive ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
      }`}>
        {isPositive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
        {trend}%
      </div>
    </div>
    <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">{title}</p>
    <h3 className="text-3xl font-black text-brand-navy mt-1 tracking-tighter">${amount}</h3>
  </motion.div>
);

const InvoiceRow = ({ id, client, date, amount, status }: any) => {
  const statusStyles: any = {
    paid: "bg-emerald-50 text-emerald-600 border-emerald-100",
    pending: "bg-amber-50 text-amber-600 border-amber-100",
    overdue: "bg-rose-50 text-rose-600 border-rose-100",
  };

  return (
    <tr className="group hover:bg-slate-50/50 transition-colors border-b border-slate-50">
      <td className="px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400">
            <FileText size={18} />
          </div>
          <div>
            <p className="font-bold text-brand-navy text-sm">{id}</p>
            <p className="text-[10px] text-slate-400 font-medium">Issued on {date}</p>
          </div>
        </div>
      </td>
      <td className="px-6 py-5 font-semibold text-slate-600 text-sm">{client}</td>
      <td className="px-6 py-5 font-black text-brand-navy text-sm">${amount.toLocaleString()}</td>
      <td className="px-6 py-5">
        <span className={`px-3 py-1 rounded-full text-[10px] font-bold border uppercase tracking-widest ${statusStyles[status]}`}>
          {status}
        </span>
      </td>
      <td className="px-6 py-5 text-right">
        <button className="text-slate-300 hover:text-brand-blue transition-colors">
          <Download size={18} />
        </button>
      </td>
    </tr>
  );
};

const Finance = () => {
  return (
    <DashboardShell>
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="text-4xl font-black text-brand-navy tracking-tight">Finance</h1>
            <p className="text-slate-500 font-medium">Manage your invoices, payments and cash flow.</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="bg-white px-5 py-3 rounded-2xl border border-slate-200 text-slate-400 font-bold flex items-center gap-2 hover:bg-slate-50 transition-all">
              <Calendar size={18} />
              Last 30 Days
            </button>
            <button className="bg-brand-navy text-white px-8 py-3 rounded-2xl font-bold shadow-xl shadow-slate-200 hover:scale-105 transition-transform flex items-center gap-2">
              <Plus size={18} />
              New Invoice
            </button>
          </div>
        </header>

        {/* FINANCIAL STATS GRID */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <FinanceCard title="Total Revenue" amount="124,500" trend="12.5" isPositive={true} />
          <FinanceCard title="Outstanding" amount="12,200" trend="2.1" isPositive={false} />
          <FinanceCard title="Net Profit" amount="42,800" trend="8.4" isPositive={true} />
          <FinanceCard title="Expenses" amount="69,500" trend="5.2" isPositive={true} />
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* RECENT INVOICES TABLE */}
          <div className="lg:col-span-2 bg-white rounded-[2.5rem] shadow-premium border border-white overflow-hidden">
            <div className="p-8 border-b border-slate-50 flex justify-between items-center">
              <h2 className="text-xl font-bold text-brand-navy">Recent Invoices</h2>
              <button className="p-2 text-slate-400 hover:bg-slate-50 rounded-xl transition-all"><Filter size={20} /></button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50/50 text-slate-400 text-[10px] uppercase tracking-widest font-bold">
                    <th className="px-6 py-4">Invoice</th>
                    <th className="px-6 py-4">Client</th>
                    <th className="px-6 py-4">Amount</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4"></th>
                  </tr>
                </thead>
                <tbody>
                  <InvoiceRow id="INV-0012" client="Vertex Real Estate" date="Oct 12, 2023" amount={12500} status="paid" />
                  <InvoiceRow id="INV-0013" client="Private Villa Project" date="Oct 14, 2023" amount={8200} status="pending" />
                  <InvoiceRow id="INV-0014" client="City Mall Expansion" date="Sep 28, 2023" amount={24000} status="overdue" />
                </tbody>
              </table>
            </div>
          </div>

          {/* PROFIT DISTRIBUTION CHART PLACEHOLDER */}
          <div className="bg-white rounded-[2.5rem] shadow-premium border border-white p-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-bold text-brand-navy">Breakdown</h2>
              <PieChart size={20} className="text-slate-300" />
            </div>
            
            <div className="space-y-6">
              {[
                { label: 'Materials', value: 45, color: 'bg-brand-blue' },
                { label: 'Labor', value: 30, color: 'bg-indigo-500' },
                { label: 'Equipment', value: 15, color: 'bg-purple-500' },
                { label: 'Profit', value: 10, color: 'bg-emerald-500' },
              ].map((item) => (
                <div key={item.label}>
                  <div className="flex justify-between text-xs font-bold mb-2">
                    <span className="text-slate-500 uppercase tracking-widest">{item.label}</span>
                    <span className="text-brand-navy">{item.value}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${item.value}%` }}
                      transition={{ duration: 1, delay: 0.5 }}
                      className={`h-full ${item.color}`} 
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10 p-6 bg-slate-50 rounded-3xl border border-slate-100">
               <p className="text-xs font-medium text-slate-500 mb-1">Total Expenses</p>
               <h4 className="text-2xl font-black text-brand-navy">$69,500.00</h4>
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
};

export default Finance;