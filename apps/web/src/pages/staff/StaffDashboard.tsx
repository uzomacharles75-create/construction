import { DashboardShell } from '../../components/layout/DashboardShell';
import { HardHat, CheckCircle2, Clock, MapPin, ClipboardList, MessageSquare, AlertTriangle, Plus } from 'lucide-react';

const StaffDashboard = () => {
  return (
    <DashboardShell>
      <div className="max-w-[1400px] mx-auto">
        <header className="mb-8 flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight">Engineer Portal</h1>
            <p className="text-sm text-slate-400 font-medium">Site updates for Oct 24, 2023</p>
          </div>
          <button className="bg-brand-navy text-white px-6 py-3 rounded-2xl font-bold text-xs flex items-center gap-2 shadow-xl">
            <Plus size={16} /> Submit Daily Log
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT: TODAY'S FOCUS */}
          <div className="lg:col-span-2 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-blue-600 p-6 rounded-[2.5rem] text-white shadow-xl shadow-blue-100">
                <Clock className="mb-4 opacity-60" />
                <p className="text-[10px] font-bold uppercase tracking-widest opacity-60">My Shift</p>
                <h3 className="text-2xl font-bold">08:00 - 17:00</h3>
                <p className="text-xs mt-2 opacity-80">Currently: On Site (Douala Project)</p>
              </div>
              <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm">
                <AlertTriangle className="mb-4 text-amber-500" />
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Safety Alerts</p>
                <h3 className="text-2xl font-bold text-slate-800">2 Pending</h3>
                <p className="text-xs mt-2 text-slate-400">Equipment inspection required</p>
              </div>
            </div>

            <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm">
              <h3 className="font-bold text-slate-800 mb-6">Assigned Tasks</h3>
              <div className="space-y-4">
                {[
                  { t: "Foundation Rebar Verification", p: "Akwa Heights", d: "Due 2pm", s: "Urgent" },
                  { t: "Material Inventory Check", p: "Eko Villa", d: "Due 5pm", s: "Normal" },
                  { t: "Site Safety Briefing", p: "General", d: "Done", s: "Completed" },
                ].map((task, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 hover:bg-slate-50 rounded-2xl transition-all border border-transparent hover:border-slate-100">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${task.s === 'Completed' ? 'bg-green-50 text-green-600' : 'bg-slate-50 text-slate-400'}`}>
                      {task.s === 'Completed' ? <CheckCircle2 size={18} /> : <HardHat size={18} />}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-slate-800">{task.t}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{task.p}</p>
                    </div>
                    <span className="text-[10px] font-black text-slate-300 uppercase">{task.d}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT: PROJECT TIMELINE & FEED */}
          <div className="space-y-8">
            <div className="bg-brand-navy p-8 rounded-[3rem] text-white">
              <h3 className="font-bold mb-6">Site Feed</h3>
              <div className="space-y-6 relative before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-white/10">
                {[
                  { u: "Foreman John", a: "Uploaded site photos", t: "10m ago" },
                  { u: "Admin", a: "Updated BOQ for Phase 2", t: "1h ago" },
                ].map((item, i) => (
                  <div key={i} className="relative pl-8">
                    <div className="absolute left-0 top-1.5 w-4 h-4 rounded-full bg-blue-600 border-4 border-brand-navy" />
                    <p className="text-xs font-bold">{item.u}</p>
                    <p className="text-[10px] text-slate-400">{item.a}</p>
                    <p className="text-[9px] text-slate-500 mt-1 uppercase font-bold">{item.t}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
};

export default StaffDashboard;