import { DashboardShell } from '../components/layout/DashboardShell';
import { User, MessageSquare, MapPin, Clock, CheckCircle2, ArrowRight } from 'lucide-react';

const DirectoryLeads = () => {
  const leads = [
    { id: 1, client: "Paul Biya Jr.", project: "Villa Foundation", location: "Bastos, Yaoundé", status: "New", date: "10m ago" },
    { id: 2, client: "Mercy Johnson", project: "Roofing Sheets", location: "Lekki, Lagos", status: "Contacted", date: "2h ago" },
    { id: 3, client: "Samuel Eto'o", project: "Sports Complex", location: "Bonanjo, Douala", status: "Negotiating", date: "1 day ago" },
  ];

  return (
    <DashboardShell>
      <div className="max-w-[1600px] mx-auto">
        <header className="mb-10">
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Directory Inquiries</h1>
          <p className="text-sm text-slate-400 font-medium">New leads from potential clients finding your business profile.</p>
        </header>

        <div className="grid grid-cols-1 gap-4">
          {leads.map((lead) => (
            <div key={lead.id} className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row items-center justify-between group">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 font-black text-xl">
                  {lead.client[0]}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-800">{lead.project}</h3>
                  <div className="flex items-center gap-4 mt-1 text-slate-400 text-xs font-medium">
                    <span className="flex items-center gap-1"><User size={14}/> {lead.client}</span>
                    <span className="flex items-center gap-1"><MapPin size={14}/> {lead.location}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-8 mt-4 md:mt-0">
                <div className="text-right hidden md:block">
                  <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Received</p>
                  <p className="text-xs font-bold text-slate-500">{lead.date}</p>
                </div>
                <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase ${
                  lead.status === 'New' ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'bg-slate-100 text-slate-500'
                }`}>{lead.status}</span>
                <button className="p-4 bg-slate-50 rounded-2xl group-hover:bg-[#001529] group-hover:text-white transition-all">
                  <MessageSquare size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardShell>
  );
};

export default DirectoryLeads;