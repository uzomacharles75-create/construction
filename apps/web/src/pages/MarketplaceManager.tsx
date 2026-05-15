import { DashboardShell } from '../components/layout/DashboardShell';
import { ShoppingBag, Truck, Plus, Package, Search, ChevronRight } from 'lucide-react';

const MarketplaceManager = () => {
  return (
    <DashboardShell>
      <div className="max-w-[1600px] mx-auto">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight">Supply Chain</h1>
            <p className="text-sm text-slate-400 font-medium italic underline decoration-blue-600/30 decoration-2">Manage material procurement and logistics.</p>
          </div>
          <button className="bg-blue-600 text-white px-8 py-4 rounded-3xl font-black text-xs shadow-xl shadow-blue-100 flex items-center gap-2">
            <ShoppingBag size={18} /> Order New Materials
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* TRACKING SECTION */}
          <div className="lg:col-span-2 space-y-6">
            <h3 className="font-bold text-slate-800 flex items-center gap-2"><Truck size={20} className="text-blue-600"/> Active Shipments</h3>
            {[
              { id: "ORD-9920", item: "500 Bags Portland Cement", supplier: "Dangote Group", status: "In Transit" },
              { id: "ORD-9841", item: "12 Tons Deformed Steel", supplier: "SteelCo Africa", status: "Processing" },
            ].map((order, i) => (
              <div key={i} className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm flex items-center justify-between">
                <div className="flex items-center gap-6">
                   <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400"><Package /></div>
                   <div>
                      <h4 className="font-black text-slate-800 text-sm">{order.item}</h4>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{order.supplier} • {order.id}</p>
                   </div>
                </div>
                <div className="flex items-center gap-6">
                   <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-3 py-1 rounded-full uppercase">{order.status}</span>
                   <ChevronRight size={18} className="text-slate-300" />
                </div>
              </div>
            ))}
          </div>

          {/* BUDGET WIDGET */}
          <div className="bg-[#001529] p-8 rounded-[3.5rem] text-white flex flex-col justify-between">
             <div>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Material Spending</p>
                <h2 className="text-4xl font-black">$42,500.00</h2>
                <p className="text-xs text-blue-400 mt-2 font-bold underline italic">Budget: $50,000.00</p>
             </div>
             <button className="w-full mt-10 py-4 bg-white/10 hover:bg-white/20 transition-all rounded-2xl text-[10px] font-black uppercase tracking-widest">Download Expense Report</button>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
};

export default MarketplaceManager;