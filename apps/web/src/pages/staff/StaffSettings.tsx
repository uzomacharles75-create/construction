import { DashboardShell } from '../../components/layout/DashboardShell';
import { User, Lock, Bell, ShieldCheck, ChevronRight, Camera } from 'lucide-react';

const SettingItem = ({ icon: Icon, title, desc }: any) => (
  <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 flex items-center justify-between hover:bg-slate-50 cursor-pointer transition-all group">
    <div className="flex items-center gap-5">
      <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:text-blue-600 transition-all">
        <Icon size={20} />
      </div>
      <div>
        <h4 className="text-sm font-bold text-slate-800">{title}</h4>
        <p className="text-[11px] text-slate-400 font-medium">{desc}</p>
      </div>
    </div>
    <ChevronRight size={18} className="text-slate-200 group-hover:text-blue-600" />
  </div>
);

const StaffSettings = () => {
  return (
    <DashboardShell>
      <div className="max-w-2xl mx-auto">
        <header className="text-center mb-12">
          <div className="relative inline-block mb-6">
            <div className="w-28 h-28 rounded-[2.5rem] bg-slate-100 border-4 border-white shadow-xl overflow-hidden">
               <img src="https://i.pravatar.cc/150?u=sarah" className="w-full h-full object-cover" alt="Sarah" />
            </div>
            <button className="absolute bottom-0 right-0 bg-blue-600 text-white p-2.5 rounded-xl shadow-lg border-2 border-white">
               <Camera size={16} />
            </button>
          </div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Engineer Sarah</h1>
          <p className="text-sm text-slate-400 font-medium italic">Site Engineer • Staff ID: #BH-9920</p>
        </header>

        <div className="space-y-4">
          <SettingItem icon={User} title="Personal Information" desc="Update your display name and contact details" />
          <SettingItem icon={Lock} title="Password & Security" desc="Manage your login credentials and 2FA" />
          <SettingItem icon={Bell} title="Notification Settings" desc="Control alerts for site tasks and messages" />
          <SettingItem icon={ShieldCheck} title="Verified Credentials" desc="Professional engineering certifications" />
        </div>

        <div className="mt-12 p-8 bg-rose-50 rounded-[2.5rem] border border-rose-100 flex items-center justify-between">
           <div>
              <h4 className="font-bold text-rose-900 text-sm">Danger Zone</h4>
              <p className="text-[10px] text-rose-500 font-medium">Request account deactivation from HR.</p>
           </div>
           <button className="text-rose-600 font-bold text-[10px] uppercase tracking-widest hover:underline">Contact Admin</button>
        </div>
      </div>
    </DashboardShell>
  );
};

export default StaffSettings;