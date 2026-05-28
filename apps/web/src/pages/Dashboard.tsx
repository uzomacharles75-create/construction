import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Skeleton } from '../components/ui/Skeleton';
import { DashboardShell } from '../components/layout/DashboardShell';
import { useAuthStore } from '../store/useAuthStore';
import apiClient from '../api/client';
import {
  Briefcase, Wrench, ClipboardList, FileText, Plus, ChevronRight,
  BarChart, Sparkles, MapPin, Store, Building2, Calculator,
  Loader2, TrendingUp, Inbox
} from 'lucide-react';
import { t } from '../theme';

const StatCard = ({ icon: Icon, title, value, sub, iconBg, isLoading }: any) => (
  <div className="bg-card border border-border p-5 rounded-3xl flex gap-4 shadow-sm hover:shadow-card transition-all">
    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${iconBg}`}>
      {isLoading
        ? <Loader2 size={18} className="animate-spin text-foreground/20" />
        : <Icon size={20} />
      }
    </div>
    <div className="flex-1 min-w-0">
      <p className={t.label + ' mb-1'}>{title}</p>
      {isLoading
        ? <Skeleton className="h-6 w-20 mb-1" />
        : <h3 className="text-xl font-black text-foreground tracking-tight">{value}</h3>
      }
      <p className="text-[10px] text-foreground/40 font-medium">{sub}</p>
    </div>
  </div>
);

const QuickAccess = ({ icon: Icon, label, bg, path }: any) => (
  <Link to={path} className="flex flex-col items-center gap-2 cursor-pointer group shrink-0">
    <div className={`w-14 h-14 rounded-[1.25rem] flex items-center justify-center ${bg} text-foreground shadow-sm transition-all group-hover:scale-110 group-hover:-translate-y-1`}>
      <Icon size={22} />
    </div>
    <span className="text-[10px] font-black text-foreground/40 uppercase tracking-tighter group-hover:text-primary transition-colors">{label}</span>
  </Link>
);

const Dashboard = () => {
  const { user } = useAuthStore();

  const { data: projects, isLoading: projectsLoading } = useQuery({
    queryKey: ['dashboard-projects'],
    queryFn: async () => {
      const { data } = await apiClient.get('/projects');
      return data.slice(0, 5);
    },
  });

  const { data: summary, isLoading: summaryLoading } = useQuery({
    queryKey: ['dashboard-summary'],
    queryFn: async () => (await apiClient.get('/auth/company/summary')).data,
  });

  return (
    <DashboardShell>
      <div className="max-w-[1600px] mx-auto pb-20">

        {/* HEADER */}
        <div className={t.pageHeader}>
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <h1 className="text-3xl font-black text-foreground tracking-tight leading-tight">
              Good morning, {user?.name?.split(' ')[0] || 'Member'} 👋
            </h1>
            <p className="text-xs text-foreground/40 font-bold uppercase tracking-widest mt-1 italic">
              {user?.company || 'BuildHub Workspace'} • Premium Tier
            </p>
          </motion.div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-card px-5 py-2.5 rounded-2xl border border-border text-[10px] font-black uppercase text-foreground/40 shadow-sm">
              <MapPin size={14} className="text-primary" />
              {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
            </div>
            <Link to="/dashboard/projects/new" className={t.btnPrimary + ' flex items-center gap-2'}>
              <Plus size={16} /> New Project
            </Link>
          </div>
        </div>

        {/* QUICK ACCESS BAR */}
        <div className="bg-card border border-border p-10 rounded-[3rem] flex justify-between shadow-sm mb-10 overflow-x-auto no-scrollbar gap-10">
          <QuickAccess icon={Building2}   label="Inquiries" bg="bg-background"     path="/dashboard/inquiries" />
          <QuickAccess icon={Store}       label="Market"    bg="bg-emerald-500"    path="/dashboard/marketplace" />
          <QuickAccess icon={ClipboardList} label="Tenders" bg="bg-orange-500"    path="/dashboard/tenders" />
          <QuickAccess icon={FileText}    label="Invoices"  bg="bg-purple-600"     path="/dashboard/invoices" />
          <QuickAccess icon={Calculator}  label="BOQ Tool"  bg="bg-rose-500"       path="/dashboard/boq" />
          <QuickAccess icon={Briefcase}   label="Projects"  bg="bg-indigo-600"     path="/dashboard/projects" />
          <QuickAccess icon={Wrench}      label="Services"  bg="bg-primary"   path="/dashboard/services" />
          <QuickAccess icon={Sparkles}    label="AI Hub"    bg="bg-violet-600"     path="/dashboard/ai" />
          <QuickAccess icon={BarChart}    label="Reports"   bg="bg-rose-600"       path="/dashboard/finance" />
        </div>

        {/* STATS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 mb-10">
          <StatCard title="Active Sites"   value={summary?.projectCount || '0'} sub="On-site operations" icon={Briefcase}     iconBg="bg-primary-pale text-primary" isLoading={summaryLoading} />
          <StatCard title="New Inquiries"  value={summary?.msgCount || '0'}     sub="Directory leads"   icon={Inbox}          iconBg="bg-emerald-500/10 text-emerald-400"     isLoading={summaryLoading} />
          <StatCard title="Open Tenders"   value={summary?.tenderCount || '0'}  sub="Market matches"   icon={ClipboardList}  iconBg="bg-orange-500/10 text-orange-400"       isLoading={summaryLoading} />
          <StatCard title="Total Revenue"  value={`$${summary?.totalIncome?.toLocaleString() || '0'}`} sub="Annual gross" icon={TrendingUp} iconBg="bg-purple-500/10 text-purple-400" isLoading={summaryLoading} />
          <StatCard title="Outstanding"    value={summary?.invoiceCount || '0'} sub="Pending payments" icon={FileText}       iconBg="bg-rose-500/10 text-rose-400"           isLoading={summaryLoading} />
        </div>

        {/* PROJECTS + FINANCE */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">

          {/* Projects table */}
          <div className="lg:col-span-2 bg-card border border-border rounded-[2.5rem] p-8 shadow-sm">
            <div className="flex justify-between items-center mb-8">
              <h3 className={t.label}>Live Project Pulse</h3>
              <Link to="/dashboard/projects" className="text-[10px] font-black text-primary border-b border-primary/20 hover:border-primary transition-all uppercase tracking-widest pb-0.5">
                View Portfolio
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-[9px] text-foreground/35 uppercase font-black tracking-[0.2em] border-b border-border">
                    <th className="pb-5">Site</th>
                    <th className="pb-5">Status</th>
                    <th className="pb-5">Progress</th>
                    <th className="pb-5 text-right">Budget</th>
                  </tr>
                </thead>
                <tbody>
                  {projectsLoading
                    ? [1,2,3,4].map(i => (
                        <tr key={i}><td colSpan={4} className="py-4"><Skeleton className="h-10 w-full" /></td></tr>
                      ))
                    : projects?.map((p: any) => (
                        <motion.tr
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          key={p._id}
                          className="text-xs font-bold text-foreground/70 hover:bg-muted/40 transition-colors cursor-pointer group border-b border-border"
                        >
                          <td className="py-5 font-black text-foreground">{p.name}</td>
                          <td>
                            <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${p.status === 'In Progress' ? 'bg-primary-pale text-primary' : 'bg-white/5 text-foreground/40'}`}>
                              {p.status}
                            </span>
                          </td>
                          <td>
                            <div className="w-32 h-1.5 bg-white/5 rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${p.progress}%` }}
                                className="h-full bg-primary"
                              />
                            </div>
                          </td>
                          <td className="text-right flex items-center justify-end gap-3 text-foreground font-black">
                            ${p.budget?.toLocaleString()}
                            <ChevronRight size={14} className="text-foreground/15 group-hover:text-primary transition-all" />
                          </td>
                        </motion.tr>
                      ))
                  }
                </tbody>
              </table>
            </div>
          </div>

          {/* Financial summary */}
          <div className="bg-card border border-border rounded-[2.5rem] p-10 flex flex-col items-center shadow-sm">
            <h3 className={t.label + ' w-full mb-10'}>Financial Telemetry</h3>
            <div className="relative w-52 h-52 flex items-center justify-center mb-10">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="104" cy="104" r="85" stroke="currentColor" strokeWidth="22" fill="transparent" className="text-foreground/5" />
                <motion.circle
                  cx="104" cy="104" r="85" stroke="currentColor" strokeWidth="22" fill="transparent"
                  strokeDasharray="534"
                  initial={{ strokeDashoffset: 534 }}
                  animate={{ strokeDashoffset: 534 - (534 * 0.75) }}
                  transition={{ duration: 2, ease: 'easeOut' }}
                  className="text-primary"
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <h2 className="text-3xl font-black text-foreground tracking-tighter italic">
                  {summaryLoading ? '...' : `$${((summary?.balance || 0) / 1000).toFixed(1)}k`}
                </h2>
                <p className={t.label + ' mt-1'}>Available</p>
              </div>
            </div>
            <div className="w-full space-y-5">
              {[
                { label: 'Total Revenue', value: summary?.totalIncome, color: 'bg-emerald-500' },
                { label: 'Total OpEx',    value: summary?.totalExpenses, color: 'bg-rose-500' },
              ].map(row => (
                <div key={row.label} className="flex justify-between items-center text-xs">
                  <div className="flex items-center gap-3 font-bold text-foreground/40">
                    <div className={`w-2.5 h-2.5 rounded-full ${row.color}`} />
                    <span className="uppercase tracking-widest text-[10px]">{row.label}</span>
                  </div>
                  <span className="font-black text-foreground">${row.value?.toLocaleString() || '0'}</span>
                </div>
              ))}
              <Link to="/dashboard/finance" className="block text-center text-primary text-[10px] font-black uppercase tracking-[0.2em] pt-6 hover:underline">
                Open Financial Audit →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
};

export default Dashboard;
