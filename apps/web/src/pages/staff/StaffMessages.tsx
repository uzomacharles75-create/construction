import { DashboardShell } from '../../components/layout/DashboardShell';
import { Send } from 'lucide-react';

const StaffMessages = () => {
  return (
    <DashboardShell>
      <div className="h-[calc(100vh-160px)] flex bg-white rounded-[3.5rem] shadow-sm border border-slate-100 overflow-hidden">
        <aside className="w-80 border-r border-slate-100 flex flex-col bg-slate-50/50">
          <div className="p-8 border-b border-slate-100"><h2 className="font-black text-slate-800">Team Comms</h2></div>
          <div className="p-6 bg-blue-600 text-white shadow-lg m-4 rounded-[2rem] cursor-pointer">
             <p className="text-[10px] font-black uppercase opacity-60">MD</p>
             <p className="text-sm font-bold">Banye Victor</p>
             <p className="text-xs mt-2 truncate text-blue-100 italic">"Rebar check completed?"</p>
          </div>
        </aside>
        <main className="flex-1 flex flex-col">
          <div className="flex-1 p-10 overflow-y-auto space-y-6">
             <div className="max-w-[60%] bg-slate-100 text-slate-700 p-5 rounded-[2rem] rounded-tl-none text-xs font-medium">
                Sarah, I've seen the logs for Akwa Heights. Good job. Please proceed to the Concrete pour.
             </div>
          </div>
          <div className="p-8 bg-white border-t border-slate-100 flex gap-4">
             <input type="text" placeholder="Message Banye Victor..." className="flex-1 bg-slate-50 rounded-2xl px-6 py-4 text-xs font-medium outline-none border-none focus:ring-2 focus:ring-blue-600/20" />
             <button className="bg-blue-600 p-5 rounded-2xl text-white shadow-xl hover:bg-[#001529] transition-all"><Send size={20}/></button>
          </div>
        </main>
      </div>
    </DashboardShell>
  );
};

export default StaffMessages;