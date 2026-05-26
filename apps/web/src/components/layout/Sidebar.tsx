import { NavLink } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import apiClient from '../../api/client';
import { useAuthStore } from '../../store/useAuthStore';
import { 
  LayoutDashboard, Building2, Briefcase, TrendingUp, Store, 
  ClipboardList, FileText, Calculator, Landmark,
  Users, Sparkles, Files, Settings, Crown, HardHat, ShieldCheck, BarChart3, LogOut,
  Inbox, Wrench
} from 'lucide-react';

const NavItem = ({ icon: Icon, label, path, badge, onNavigate }: any) => (
  <NavLink 
    to={path}
    onClick={onNavigate}
    className={({ isActive }) => `
      flex items-center justify-between px-4 py-2.5 rounded-xl transition-all mb-0.5 group
      ${isActive 
        ? 'bg-brand-yellow text-brand-navy shadow-lg shadow-yellow-900/20' 
        : 'text-brand-navy/50 hover:bg-brand-navy-card/5 hover:text-white'}
    `}
  >
    <div className="flex items-center gap-3">
      <Icon size={18} className="shrink-0" />
      <span className="text-[13px] font-medium tracking-tight">{label}</span>
    </div>
    {badge && (
      <span className="bg-brand-yellow/20 text-brand-yellow text-[10px] px-1.5 py-0.5 rounded-md font-bold">
        {badge}
      </span>
    )}
  </NavLink>
);

export const Sidebar = ({ onNavigate }: { onNavigate?: () => void }) => {
  const { user, logout } = useAuthStore();
  const role = user?.role;

  const { data: pendingQueue } = useQuery({
    queryKey: ['admin-pending-count'],
    queryFn: async () => {
      const { data } = await apiClient.get('/admin/pending');
      return data;
    },
    enabled: role === 'admin',
    refetchInterval: 30000,
  });

  const { data: summary } = useQuery({ 
    queryKey: ['dashboard-summary'], 
    queryFn: async () => (await apiClient.get('/auth/company/summary')).data 
  });

  return (
    <aside className="w-[min(280px,85vw)] sm:w-[260px] h-[100dvh] bg-brand-navy text-white flex flex-col p-4 overflow-y-auto no-scrollbar border-r border-brand-border/5">
      {/* LOGO AREA */}
      <div className="flex items-center gap-3 mb-8 px-2">
        <div className="w-8 h-8 bg-brand-yellow rounded-lg flex items-center justify-center font-black text-brand-navy text-xs italic">BH</div>
        <h2 className="text-lg font-bold tracking-tight text-white">BuildHub</h2>
      </div>

      <nav className="flex-1">
        {/* SUPER ADMIN MENU */}
        {role === 'admin' && (
          <>
            <p className="text-[10px] font-black text-brand-muted uppercase tracking-widest px-4 mb-2">Platform Master</p>
            <NavItem icon={LayoutDashboard} label="Dashboard" path="/admin" onNavigate={onNavigate} />
            <NavItem 
              icon={ShieldCheck} 
              label="Verification Queue" 
              path="/admin/verifications" 
              badge={pendingQueue?.length > 0 ? pendingQueue.length : null} 
              onNavigate={onNavigate} 
            />
            <NavItem icon={Users} label="Manage Companies" path="/admin/users" onNavigate={onNavigate} />
            <NavItem icon={BarChart3} label="System Stats" path="/admin/stats" onNavigate={onNavigate} />
            <NavItem icon={Settings} label="Global Settings" path="/admin/settings" onNavigate={onNavigate} />
          </>
        )}

        {/* COMPANY OWNER MENU */}
        {role === 'owner' && (
          <>
            <p className="text-[10px] font-black text-brand-muted uppercase tracking-widest px-4 mb-2">Business Ops</p>
            <NavItem icon={LayoutDashboard} label="Dashboard" path="/dashboard" onNavigate={onNavigate} />
            <NavItem icon={Building2} label="Business Profile" path="/dashboard/settings/business" onNavigate={onNavigate} />
            <NavItem icon={Wrench} label="My Services" path="/dashboard/services" onNavigate={onNavigate} />
            <NavItem icon={Inbox} label="Inquiries" path="/dashboard/inquiries" badge={summary?.msgCount} onNavigate={onNavigate} />
            <NavItem icon={Store} label="Marketplace" path="/dashboard/marketplace" badge={summary?.orderCount} onNavigate={onNavigate} />
            <NavItem icon={ClipboardList} label="Tenders & Jobs" path="/dashboard/tenders" badge={summary?.tenderCount} onNavigate={onNavigate} />
            <NavItem icon={Landmark} label="Finance & Reports" path="/dashboard/finance" onNavigate={onNavigate} />
            <NavItem icon={FileText} label="Invoices" path="/dashboard/invoices" onNavigate={onNavigate} />
            <NavItem icon={Users} label="Workers & Team" path="/dashboard/workforce" onNavigate={onNavigate} />
            <NavItem icon={Calculator} label="BOQ Tools" path="/dashboard/boq" onNavigate={onNavigate} />
          </>
        )}

        {/* STAFF MENU */}
        {role === 'staff' && (
          <>
            <p className="text-[10px] font-black text-brand-muted uppercase tracking-widest px-4 mb-2">Field Operations</p>
            <NavItem icon={HardHat} label="Site Portal" path="/staff/dashboard" onNavigate={onNavigate} />
            <NavItem icon={Briefcase} label="My Assignments" path="/staff/projects" onNavigate={onNavigate} />
            <NavItem icon={Sparkles} label="Engineering AI" path="/staff/ai" onNavigate={onNavigate} />
            <NavItem icon={Files} label="Site Documents" path="/staff/documents" onNavigate={onNavigate} />
            <NavItem icon={Settings} label="My Settings" path="/staff/settings" onNavigate={onNavigate} />
          </>
        )}

        {/* LOGOUT */}
        <div className="mt-4 pt-4 border-t border-brand-border/5">
          <button 
            onClick={logout}
            className="flex items-center gap-3 px-4 py-2.5 w-full text-brand-muted hover:text-rose-400 transition-all"
          >
            <LogOut size={18} />
            <span className="text-[13px] font-medium">Sign Out</span>
          </button>
        </div>
      </nav>

      {/* IDENTITY CARD */}
      <div className="mt-8 p-4 bg-brand-navy-card/5 rounded-2xl border border-brand-border/10 shrink-0">
        {role === 'staff' ? (
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-brand-yellow/20 rounded-xl flex items-center justify-center text-brand-yellow">
               <HardHat size={20} />
             </div>
             <div>
                <p className="text-[10px] text-brand-muted font-bold uppercase tracking-tighter">Site Engineer</p>
                <p className="text-xs font-bold text-white truncate w-24">{user?.name}</p>
             </div>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-2">
              <p className="text-[10px] text-white/50 font-bold uppercase tracking-widest">{role === 'admin' ? 'Ruler' : 'Owner'}</p>
              <Crown size={14} className="text-brand-yellow" />
            </div>
            <p className="text-sm font-bold text-white truncate">{user?.name}</p>
            {role === 'owner' && (
              <button className="w-full mt-3 py-2 bg-brand-yellow text-brand-navy rounded-xl text-[10px] font-black">
                Manage Plan
              </button>
            )}
          </>
        )}
      </div>
    </aside>
  );
};
