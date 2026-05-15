import { DashboardShell } from '../components/layout/DashboardShell';
import { Plus, Download } from 'lucide-react';

const Invoices = () => {
  const invoiceData = [
    { id: "INV-2025-001", client: "Banye Victor", date: "May 12, 2025", amount: "$12,500.00", status: "Paid" },
    { id: "INV-2025-002", client: "Sarah T.", date: "May 14, 2025", amount: "$8,200.00", status: "Pending" },
    { id: "INV-2025-003", client: "ABC Supplies", date: "May 15, 2025", amount: "$3,450.00", status: "Overdue" },
  ];

  return (
    <DashboardShell>
      <div className="max-w-[1600px] mx-auto">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight">Invoices & Receipts</h1>
            <p className="text-sm text-slate-400 font-medium">Generate and track professional billing documents.</p>
          </div>
          <button className="bg-blue-600 text-white px-8 py-4 rounded-3xl font-black text-xs shadow-xl shadow-blue-100 flex items-center gap-2">
            <Plus size={18} /> Create New Invoice
          </button>
        </header>

        {/* INVOICE TABLE */}
        <div className="bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-sm">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-[10px] font-black uppercase text-slate-400 border-b border-slate-100">
              <tr>
                <th className="px-8 py-6">Invoice ID</th>
                <th className="px-8 py-6">Client / Project</th>
                <th className="px-8 py-6">Date Issued</th>
                <th className="px-8 py-6">Total Amount</th>
                <th className="px-8 py-6">Status</th>
                <th className="px-8 py-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {invoiceData.map((inv, i) => (
                <tr key={i} className="text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all group">
                  <td className="px-8 py-6 text-blue-600">{inv.id}</td>
                  <td className="px-8 py-6">{inv.client}</td>
                  <td className="px-8 py-6 text-slate-400 font-medium">{inv.date}</td>
                  <td className="px-8 py-6 font-black text-slate-800">{inv.amount}</td>
                  <td className="px-8 py-6">
                    <span className={`px-4 py-1 rounded-full text-[9px] font-black uppercase ${
                      inv.status === 'Paid' ? 'bg-emerald-50 text-emerald-600' : 
                      inv.status === 'Overdue' ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-600'
                    }`}>{inv.status}</span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <button className="p-2 text-slate-300 hover:text-[#001529] group-hover:scale-110 transition-transform"><Download size={18}/></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardShell>
  );
};

export default Invoices;