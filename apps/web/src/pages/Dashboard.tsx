import { Link } from 'react-router-dom'; // Added this for navigation
import { DashboardShell } from '../components/layout/DashboardShell';
import { 
  Briefcase, MessageCircle, ClipboardList, DollarSign, 
  FileText, Plus, ChevronRight, Users, Shield, 
  BarChart, Sparkles, MapPin, Store, Building2, Calculator
} from 'lucide-react';

const StatCard = ({ icon: Icon, title, value, sub, iconBg, iconColor }: any) => (
  <div className="bg-white p-5 rounded-2xl border border-slate-100 flex gap-4">
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${iconBg} ${iconColor}`}>
      <Icon size={20} />
    </div>
    <div>
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{title}</p>
      <h3 className="text-xl font-black text-slate-800">{value}</h3>
      <p className="text-[10px] text-slate-400 font-medium mt-0.5">{sub}</p>
    </div>
  </div>
);

// Updated QuickAccess to use React Router Link
const QuickAccess = ({ icon: Icon, label, bg, path }: any) => (
  <Link to={path} className="flex flex-col items-center gap-2 cursor-pointer group">
    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${bg} text-white shadow-sm transition-all group-hover:scale-110 group-hover:shadow-lg`}>
      <Icon size={22} />
    </div>
    <span className="text-[10px] font-bold text-slate-500 group-hover:text-blue-600 transition-colors">{label}</span>
  </Link>
);

const Dashboard = () => {
  return (
    <DashboardShell>
      <div className="max-w-[1600px] mx-auto">
        
        {/* HEADER SECTION */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">Good morning, Banye Victor 👋</h1>
            <p className="text-xs text-slate-400 font-medium">Here's what's happening with your business today.</p>
          </div>
          <div className="flex items-center gap-4">
             <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-slate-100 text-xs font-bold text-slate-500">
               <MapPin size={14} /> May 12 - May 19, 2025
             </div>
             <Link to="/dashboard/projects/new" className="bg-blue-600 text-white px-6 py-2 rounded-xl font-bold text-xs flex items-center gap-2 shadow-lg shadow-blue-100">
               <Plus size={16} /> New
             </Link>
          </div>
        </div>

        {/* TOP STATS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-5 mb-8">
          <StatCard title="Active Projects" value="7" sub="2 nearing completion" icon={Briefcase} iconBg="bg-blue-50" iconColor="text-blue-600" />
          <StatCard title="Incoming Inquiries" value="12" sub="New messages" icon={MessageCircle} iconBg="bg-green-50" iconColor="text-green-600" />
          <StatCard title="New Tenders" value="8" sub="Match your profile" icon={ClipboardList} iconBg="bg-orange-50" iconColor="text-orange-600" />
          <StatCard title="Total Balance" value="$85,250.00" sub="This month" icon={DollarSign} iconBg="bg-purple-50" iconColor="text-purple-600" />
          <StatCard title="Pending Invoices" value="5" sub="$32,500.00" icon={FileText} iconBg="bg-red-50" iconColor="text-red-600" />
        </div>

        {/* PROJECT OVERVIEW & FINANCIAL SUMMARY */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          
          {/* Table Area */}
          <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-100 p-6 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-slate-800">Project Overview</h3>
              <Link to="/dashboard/projects" className="text-[10px] font-bold text-slate-400 border border-slate-100 px-3 py-1.5 rounded-lg hover:bg-slate-50 transition-all">View All Projects</Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-[10px] text-slate-400 uppercase font-bold border-b border-slate-50">
                    <th className="pb-4">Project Name</th>
                    <th className="pb-4">Status</th>
                    <th className="pb-4">Progress</th>
                    <th className="pb-4">Budget</th>
                    <th className="pb-4">Spent</th>
                    <th className="pb-4 text-right">Remaining</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {[
                    { n: "Apartment Construction", s: "In Progress", p: 65, b: "$120k", sp: "$85k", r: "$35k", c: "text-blue-600 bg-blue-50" },
                    { n: "Road Construction", s: "In Progress", p: 40, b: "$200k", sp: "$80k", r: "$120k", c: "text-blue-600 bg-blue-50" },
                    { n: "School Building", s: "Planning", p: 15, b: "$150k", sp: "$22k", r: "$128k", c: "text-orange-600 bg-orange-50" },
                    { n: "Warehouse Complex", s: "Completed", p: 100, b: "$75k", sp: "$75k", r: "$0", c: "text-green-600 bg-green-50" },
                  ].map((row, i) => (
                    <tr key={i} className="text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer group">
                      <td className="py-4">{row.n}</td>
                      <td><span className={`px-2 py-1 rounded-md text-[9px] ${row.c}`}>{row.s}</span></td>
                      <td><div className="w-24 h-1.5 bg-slate-100 rounded-full"><div className="h-full bg-blue-600 rounded-full" style={{width: `${row.p}%`}} /></div></td>
                      <td>{row.b}</td>
                      <td>{row.sp}</td>
                      <td className="text-right flex items-center justify-end gap-2">{row.r} <ChevronRight size={14} className="text-slate-300 group-hover:text-blue-600" /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Financial Summary Area */}
          <div className="bg-white rounded-3xl border border-slate-100 p-8 flex flex-col items-center shadow-sm">
            <div className="w-full flex justify-between items-center mb-8">
              <h3 className="font-bold text-slate-800">Financial Summary</h3>
              <select className="text-[10px] font-bold text-slate-400 bg-transparent border-none outline-none">
                <option>This Month</option>
                <option>Last Month</option>
              </select>
            </div>
            
            <div className="relative w-48 h-48 flex items-center justify-center mb-8">
               <svg className="w-full h-full transform -rotate-90">
                 <circle cx="96" cy="96" r="80" stroke="currentColor" strokeWidth="20" fill="transparent" className="text-slate-100" />
                 <circle cx="96" cy="96" r="80" stroke="currentColor" strokeWidth="20" fill="transparent" strokeDasharray="502" strokeDashoffset="150" className="text-blue-600" />
               </svg>
               <div className="absolute flex flex-col items-center">
                 <h2 className="text-2xl font-black text-slate-800">$85,250</h2>
                 <p className="text-[10px] text-slate-400 font-bold uppercase">Total Balance</p>
               </div>
            </div>

            <div className="w-full space-y-4">
              <div className="flex justify-between items-center text-xs">
                <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-emerald-500" /> Total Income</div>
                <span className="font-black">$120,000.00</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-red-500" /> Total Expenses</div>
                <span className="font-black">$85,250.00</span>
              </div>
              <Link to="/dashboard/finance" className="block text-center text-blue-600 text-[10px] font-bold pt-4 hover:underline">View Financial Report →</Link>
            </div>
          </div>
        </div>

        {/* BOTTOM GRID (Messages, Activity, Notifications) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
           <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-slate-800">Recent Messages</h3>
                <Link to="/dashboard/messages" className="text-blue-600 text-[10px] font-bold hover:underline">View All</Link>
              </div>
              <div className="space-y-4">
                 {[
                   { n: "John Doe", m: "Inquiry about 3-bedroom house...", t: "2m ago", new: true },
                   { n: "Sarah T.", m: "Request for quotation - Office Building", t: "1h ago", new: true },
                 ].map((m, i) => (
                   <div key={i} className="flex gap-4 p-3 hover:bg-slate-50 rounded-xl transition-all cursor-pointer">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">{m.n[0]}</div>
                      <div className="flex-1">
                        <p className="text-xs font-bold text-slate-800">{m.n}</p>
                        <p className="text-[10px] text-slate-400 truncate">{m.m}</p>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <span className="text-[9px] text-slate-300 font-bold">{m.t}</span>
                        {m.new && <span className="text-[8px] bg-blue-600 text-white px-1.5 py-0.5 rounded-full font-bold">New</span>}
                      </div>
                   </div>
                 ))}
              </div>
           </div>

           <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-slate-800">Worker Activity</h3>
                <Link to="/dashboard/workforce" className="text-blue-600 text-[10px] font-bold hover:underline">View All</Link>
              </div>
              <div className="space-y-6">
                 <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4"><Users size={18} className="text-blue-600" /> <span className="text-xs font-bold">Site Workers</span></div>
                    <span className="text-[10px] bg-green-50 text-green-600 px-2 py-1 rounded-md font-bold">Active</span>
                 </div>
                 <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4"><Shield size={18} className="text-emerald-600" /> <span className="text-xs font-bold">Engineers</span></div>
                    <span className="text-[10px] bg-green-50 text-green-600 px-2 py-1 rounded-md font-bold">Active</span>
                 </div>
              </div>
           </div>

           <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-slate-800">Notifications</h3>
                <Link to="/dashboard/notifications" className="text-blue-600 text-[10px] font-bold hover:underline">View All</Link>
              </div>
              <div className="space-y-4 text-xs font-medium text-slate-500">
                 <div className="flex gap-3 items-start"><div className="w-2 h-2 rounded-full bg-blue-600 mt-1.5 shrink-0" /> New tender matching your profile: Road Construction</div>
                 <div className="flex gap-3 items-start"><div className="w-2 h-2 rounded-full bg-blue-600 mt-1.5 shrink-0" /> New inquiry from Directory: John Doe is interested...</div>
              </div>
           </div>
        </div>

        {/* QUICK ACCESS BAR - ALL LINKS UPDATED */}
        <div className="bg-white p-8 rounded-3xl border border-slate-100 flex justify-between shadow-sm mb-10 overflow-x-auto no-scrollbar gap-8">
          <QuickAccess icon={Building2} label="Directory" bg="bg-blue-600" path="/dashboard/directory" />
          <QuickAccess icon={Store} label="Marketplace" bg="bg-emerald-500" path="/dashboard/marketplace" />
          <QuickAccess icon={ClipboardList} label="Tenders" bg="bg-orange-500" path="/dashboard/tenders" />
          <QuickAccess icon={FileText} label="Invoices" bg="bg-purple-600" path="/dashboard/finance" />
          <QuickAccess icon={Calculator} label="BOQ Tool" bg="bg-rose-500" path="/dashboard/boq" />
          <QuickAccess icon={Briefcase} label="Projects" bg="bg-indigo-600" path="/dashboard/projects/1" />
          <QuickAccess icon={MessageCircle} label="Messages" bg="bg-teal-600" path="/dashboard/messages" />
          <QuickAccess icon={Sparkles} label="AI Assistant" bg="bg-violet-600" path="/dashboard/ai" />
          <QuickAccess icon={BarChart} label="Reports" bg="bg-red-500" path="/dashboard/finance" />
        </div>

      </div>
    </DashboardShell>
  );
};

export default Dashboard;