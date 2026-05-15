import { DashboardShell } from '../../components/layout/DashboardShell';
import { Search, Crown, ExternalLink } from 'lucide-react';

const AdminUsers = () => {
  return (
    <DashboardShell>
      <div className="max-w-[1600px] mx-auto">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Registered Companies</h1>
          <div className="bg-white px-4 py-2 rounded-2xl border border-slate-100 flex items-center gap-3 w-80 shadow-sm">
            <Search size={18} className="text-slate-300" />
            <input type="text" placeholder="Search by name or ID..." className="bg-transparent border-none outline-none text-xs w-full" />
          </div>
        </div>

        <div className="bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-sm">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-[10px] font-black uppercase text-slate-400">
              <tr>
                <th className="px-8 py-5">Company</th>
                <th className="px-8 py-5">Owner</th>
                <th className="px-8 py-5">Plan</th>
                <th className="px-8 py-5">Status</th>
                <th className="px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {[
                { n: "Vertex Builders", o: "Banye Victor", p: "Professional", s: "Active" },
                { n: "Dangote Group", o: "Aliko Dangote", p: "Enterprise", s: "Active" },
                { n: "Small Homes CM", o: "Jean Paul", p: "Basic", s: "Suspended" },
              ].map((c, i) => (
                <tr key={i} className="text-sm font-bold text-slate-700 hover:bg-slate-50/50 transition-all">
                  <td className="px-8 py-6 flex items-center gap-3">
                    <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 font-black">
                       {c.n[0]}
                    </div>
                    {c.n}
                  </td>
                  <td className="px-8 py-6 text-slate-500 font-medium">{c.o}</td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2">
                       <Crown size={14} className="text-amber-500" /> {c.p}
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase ${
                      c.s === 'Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                    }`}>{c.s}</span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <button className="p-2 text-slate-300 hover:text-[#001529]"><ExternalLink size={18}/></button>
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

export default AdminUsers;