import { NavLink } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import apiClient from '../../api/client';
import { useAuthStore } from '../../store/useAuthStore';
import { 
  LayoutDashboard, Building2, Briefcase, TrendingUp, Store, 
  ClipboardList, FileText, Calculator, Landmark, MessageSquare, 
  Users, Sparkles, Files, Settings, Crown, HardHat, ShieldCheck, BarChart3, LogOut 
} from 'lucide-react';

const NavItem = ({ icon: Icon, label, path, badge, onNavigate }: any) => (
  <NavLink 
    to={path}
    onClick={onNavigate}
    className={({ isActive }) => `
      flex items-center justify-between px-4 py-2.5 rounded-xl transition-all mb-0.5 group
      ${isActive 
        ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' 
        : 'text-slate-400 hover:bg-white/5 hover:text-white'}
    `}
  >
    <div className="flex items-center gap-3">
      <Icon size={18} className="shrink-0" />
      <span className="text-[13px] font-medium tracking-tight">{label}</span>
    </div>
    {badge && (
      <span className="bg-slate-700/50 text-[10px] px-1.5 py-0.5 rounded-md text-slate-300 font-bold">
        {badge}
      </span>
    )}
  </NavLink>
);

export const Sidebar = ({ onNavigate }: { onNavigate?: () => void }) => {
  const { user, logout } = useAuthStore();
  const role = user?.role; // 'admin', 'owner', or 'staff'

  // MOVE THE HOOK INSIDE THE COMPONENT HERE:
    const { data: pendingQueue } = useQuery({
    queryKey: ['admin-pending-count'],
    queryFn: async () => {
      const { data } = await apiClient.get('/admin/pending');
      return data;
    },
    enabled: role === 'admin', // Only runs for the SuperAdmin
    refetchInterval: 30000, // Refresh every 30 seconds to stay "Live"
  });

  const { data: summary } = useQuery({ 
    queryKey: ['dashboard-summary'], 
    queryFn: async () => (await apiClient.get('/auth/company/summary')).data 
  });

  return (
    <aside className="w-[min(280px,85vw)] sm:w-[260px] h-[100dvh] bg-[#001529] text-white flex flex-col p-4 overflow-y-auto no-scrollbar border-r border-white/5">
      {/* LOGO AREA */}
      <div className="flex items-center gap-3 mb-8 px-2">
        <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center font-black text-[#001529] text-xs italic">BH</div>
        <h2 className="text-lg font-bold tracking-tight text-white">BuildHub</h2>
      </div>

      <nav className="flex-1">
        {/* ==========================================
            1. SUPER ADMIN MENU (Platform Ruler)
            ========================================== */}
        {role === 'admin' && (
          <>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-4 mb-2">Platform Master</p>
            <NavItem icon={LayoutDashboard} label="Dashboard" path="/admin" onNavigate={onNavigate} />
            
            {/* REAL BADGE LOGIC: replaced "14" with pendingQueue.length */}
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

        {/* ==========================================
            2. COMPANY OWNER MENU (/dashboard/*)
            ========================================== */}
        {role === 'owner' && (
          <>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-4 mb-2">Business Ops</p>
            <NavItem icon={LayoutDashboard} label="Dashboard" path="/dashboard" onNavigate={onNavigate} />
            <NavItem icon={Building2} label="Business Profile" path="/dashboard/settings/business" onNavigate={onNavigate} />
            <NavItem icon={TrendingUp} label="Directory Leads" path="/dashboard/directory" badge={summary?.msgCount} onNavigate={onNavigate} />
            <NavItem icon={Store} label="Marketplace" path="/dashboard/marketplace" badge={summary?.orderCount} onNavigate={onNavigate} />
            <NavItem icon={ClipboardList} label="Tenders & Jobs" path="/dashboard/tenders" badge={summary?.tenderCount} onNavigate={onNavigate} />
            <NavItem icon={Landmark} label="Finance & Reports" path="/dashboard/finance" onNavigate={onNavigate} />
            <NavItem icon={FileText} label="Invoices" path="/dashboard/invoices" onNavigate={onNavigate} />
            <NavItem icon={Users} label="Workers & Team" path="/dashboard/workforce" onNavigate={onNavigate} />
            <NavItem icon={Calculator} label="BOQ Tools" path="/dashboard/boq" onNavigate={onNavigate} />
          </>
        )}

        {/* ==========================================
            3. STAFF MENU (/staff/*)
            ========================================== */}
        {role === 'staff' && (
          <>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-4 mb-2">Field Operations</p>
            <NavItem icon={HardHat} label="Site Portal" path="/staff/dashboard" onNavigate={onNavigate} />
            <NavItem icon={Briefcase} label="My Assignments" path="/staff/projects" onNavigate={onNavigate} />
            <NavItem icon={MessageSquare} label="Site Messages" path="/staff/messages" badge="18" onNavigate={onNavigate} />
            <NavItem icon={Sparkles} label="Engineering AI" path="/staff/ai" onNavigate={onNavigate} />
            <NavItem icon={Files} label="Site Documents" path="/staff/documents" onNavigate={onNavigate} />
            <NavItem icon={Settings} label="My Settings" path="/staff/settings" onNavigate={onNavigate} />
          </>
        )}

        {/* SHARED LOGOUT BUTTON */}
        <div className="mt-4 pt-4 border-t border-white/5">
          <button 
            onClick={logout}
            className="flex items-center gap-3 px-4 py-2.5 w-full text-slate-500 hover:text-rose-400 transition-all"
          >
            <LogOut size={18} />
            <span className="text-[13px] font-medium">Sign Out</span>
          </button>
        </div>
      </nav>

      {/* DYNAMIC IDENTITY CARD */}
      <div className="mt-8 p-4 bg-white/5 rounded-2xl border border-white/10 shrink-0">
        {role === 'staff' ? (
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-blue-600/20 rounded-xl flex items-center justify-center text-blue-400">
               <HardHat size={20} />
             </div>
             <div>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">Site Engineer</p>
                <p className="text-xs font-bold text-white truncate w-24">{user?.name}</p>
             </div>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-2">
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{role === 'admin' ? 'Ruler' : 'Owner'}</p>
              <Crown size={14} className="text-amber-400" />
            </div>
            <p className="text-sm font-bold text-white truncate">{user?.name}</p>
            {role === 'owner' && <button className="w-full mt-3 py-2 bg-blue-600 text-white rounded-xl text-[10px] font-bold">Manage Plan</button>}
          </>
        )}
      </div>
    </aside>
  );
};