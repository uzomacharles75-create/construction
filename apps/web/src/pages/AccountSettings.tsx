import { useState } from 'react';
import { DashboardShell } from '../components/layout/DashboardShell';
import { useAuthStore } from '../store/useAuthStore'; // Integrated real auth store
import { 
  User, 
  Mail, 
  Lock, 
  Bell, 
  ShieldCheck, 
  Smartphone, 
  Globe, 
  Trash2,
  ChevronRight,
  Camera,
  CreditCard
} from 'lucide-react';
import { motion } from 'framer-motion';

// Reusable row for settings
const SettingRow = ({ icon: Icon, title, desc, onClick }: any) => (
  <motion.div 
    whileHover={{ x: 5 }}
    onClick={onClick}
    className="flex items-center justify-between p-6 bg-white border border-slate-100 rounded-3xl hover:shadow-xl hover:shadow-slate-100 transition-all cursor-pointer group"
  >
    <div className="flex items-center gap-5">
      <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:text-blue-600 group-hover:bg-blue-50 transition-all">
        <Icon size={22} />
      </div>
      <div>
        <h4 className="text-sm font-bold text-brand-navy leading-tight">{title}</h4>
        <p className="text-[11px] text-slate-400 mt-0.5 font-medium">{desc}</p>
      </div>
    </div>
    <ChevronRight size={18} className="text-slate-300 group-hover:text-brand-navy transition-colors" />
  </motion.div>
);

const AccountSettings = () => {
  const { user, logout } = useAuthStore(); // Pulling real data from backend/store
  const [notifications, setNotifications] = useState(true);

  return (
    <DashboardShell>
      <div className="max-w-3xl mx-auto pb-20">
        
        {/* PAGE HEADER */}
        <header className="mb-12">
          <h1 className="text-4xl font-black text-brand-navy tracking-tight">Account Settings</h1>
          <p className="text-slate-500 font-medium mt-2">Manage your personal identity, security, and preferences.</p>
        </header>

        {/* PROFILE OVERVIEW CARD (DYNAMIC) */}
        <section className="bg-white rounded-[2.5rem] p-8 border border-white shadow-premium mb-10 flex items-center gap-8">
          <div className="relative group">
            <div className="w-24 h-24 rounded-[2rem] bg-slate-100 overflow-hidden ring-4 ring-slate-50 flex items-center justify-center">
              {/* If user has no avatar, show initials */}
              <span className="text-3xl font-black text-brand-navy italic opacity-20">
                {user?.name?.charAt(0) || 'U'}
              </span>
            </div>
            <button className="absolute -bottom-2 -right-2 bg-brand-navy text-white p-2.5 rounded-xl shadow-lg hover:bg-brand-blue transition-all">
              <Camera size={16} />
            </button>
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-black text-brand-navy">{user?.name}</h2>
            <p className="text-sm text-slate-400 font-medium capitalize">
                {user?.role} • BuildHub Workspace User
            </p>
            <div className="flex items-center gap-2 mt-3">
               <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                 user?.role === 'owner' ? 'bg-blue-50 text-blue-600' : 'bg-emerald-50 text-emerald-600'
               }`}>
                 {user?.role === 'owner' ? 'Admin Access' : 'Staff Access'}
               </span>
            </div>
          </div>
        </section>

        {/* SETTINGS GROUPS */}
        <div className="space-y-8">
          
          {/* PERSONAL INFORMATION */}
          <div className="space-y-4">
            <h3 className="text-xs font-black text-slate-300 uppercase tracking-[0.2em] px-2">Personal Identity</h3>
            <div className="space-y-3">
              <SettingRow 
                icon={User} 
                title="Profile Details" 
                desc={`Display Name: ${user?.name}`} 
              />
              <SettingRow 
                icon={Mail} 
                title="Email Address" 
                desc={`${user?.email} • Primary secure login`} 
              />
            </div>
          </div>

          {/* SECURITY */}
          <div className="space-y-4">
            <h3 className="text-xs font-black text-slate-300 uppercase tracking-[0.2em] px-2">Security & Privacy</h3>
            <div className="space-y-3">
              <SettingRow icon={Lock} title="Password" desc="Change or update your password" />
              <SettingRow icon={ShieldCheck} title="Two-Factor Authentication" desc="Enable 2FA for enhanced protection" />
              <SettingRow icon={Smartphone} title="Connected Devices" desc="Review active login sessions" />
            </div>
          </div>

          {/* PREFERENCES */}
          <div className="space-y-4">
            <h3 className="text-xs font-black text-slate-300 uppercase tracking-[0.2em] px-2">System Preferences</h3>
            <div className="space-y-3">
              {/* Premium iOS Style Toggle */}
              <div className="flex items-center justify-between p-6 bg-white border border-slate-100 rounded-3xl shadow-sm">
                <div className="flex items-center gap-5">
                  <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400">
                    <Bell size={22} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-brand-navy leading-tight">Push Notifications</h4>
                    <p className="text-[11px] text-slate-400 mt-0.5 font-medium">Alerts for site logs and invoices</p>
                  </div>
                </div>
                <button 
                  onClick={() => setNotifications(!notifications)}
                  className={`w-12 h-6 rounded-full transition-all relative ${notifications ? 'bg-blue-600' : 'bg-slate-200'}`}
                >
                  <motion.div 
                    animate={{ x: notifications ? 24 : 4 }}
                    className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm"
                  />
                </button>
              </div>

              <SettingRow icon={Globe} title="Language" desc="English (UK)" />
              {user?.role === 'owner' && (
                  <SettingRow icon={CreditCard} title="Subscription" desc="Professional Plan Manager" />
              )}
            </div>
          </div>

          {/* DANGER ZONE */}
          <div className="pt-10">
            <div className="p-8 bg-rose-50 rounded-[2.5rem] border border-rose-100 flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h4 className="font-black text-rose-900 text-lg">Danger Zone</h4>
                <p className="text-xs text-rose-600 font-medium max-w-sm">Revoke your access to BuildHub. This action is irreversible.</p>
              </div>
              <button 
                onClick={logout}
                className="bg-white text-rose-500 px-8 py-4 rounded-2xl font-bold text-sm shadow-sm border border-rose-200 hover:bg-rose-500 hover:text-white transition-all flex items-center gap-2"
              >
                <Trash2 size={18} />
                Delete Account
              </button>
            </div>
          </div>

        </div>
      </div>
    </DashboardShell>
  );
};

export default AccountSettings;