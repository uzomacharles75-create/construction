import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { DashboardShell } from '../components/layout/DashboardShell';
import apiClient from '../api/client';
import { t } from '../theme';
import { useCurrencyStore } from '../store/useCurrencyStore';
import { getCurrencyByCountry } from '../lib/locations';
import {
  Plus, FolderKanban, Lock, MapPin, Loader2, CheckCircle2, Package,
} from 'lucide-react';

interface Project {
  _id: string;
  name: string;
  clientName?: string;
  budget?: number;
  spent?: number;
  status?: string;
  country?: string;
  region?: string;
  city?: string;
  location?: string;
}

interface BOQItem {
  _id: string;
  description: string;
  unit: string;
  qty: number;
  rate: number;
  status: string;
  source: string;
}

interface BOQ {
  _id: string;
  project?: { _id: string; name: string; location?: string };
  company?: string;
  items: BOQItem[];
  totalAmount: number;
  isLocked: boolean;
}

const ProjectCard = ({ project, boq, money }: { project: Project; boq?: BOQ; money: (n: number) => string }) => {
  const items = boq?.items || [];
  const verified = items.filter((i) => i.status === 'verified').length;
  const code = getCurrencyByCountry(project.country);
  const locked = !!boq?.isLocked;
  const loc = [project.city, project.country].filter(Boolean).join(', ') || project.location || 'No location';

  return (
    <Link
      to={`/dashboard/boq?project=${project._id}`}
      className={`${t.cardLg} ${t.cardHover} group block p-7 relative overflow-hidden`}
    >
      <div className="flex items-start justify-between mb-5">
        <div className={t.iconBoxYellow}>
          <FolderKanban size={22} />
        </div>
        {locked ? (
          <span className={`${t.badgeGreen} flex items-center gap-1`}>
            <Lock size={10} /> Locked
          </span>
        ) : (
          <span className={t.badgeAmber}>Active</span>
        )}
      </div>

      <h3 className="text-lg font-black text-foreground tracking-tight truncate">{project.name}</h3>
      <p className={`${t.muted} flex items-center gap-1.5 mt-1`}>
        <MapPin size={13} className="text-primary shrink-0" /> {loc}
      </p>

      <div className="mt-6 flex items-end justify-between">
        <div>
          <p className={t.label}>BOQ Value · {code}</p>
          <p className="text-2xl font-black text-foreground leading-none mt-1.5">{money(boq?.totalAmount || 0)}</p>
        </div>
      </div>

      <div className="mt-5 pt-5 border-t border-border flex items-center gap-5">
        <div className="flex items-center gap-1.5">
          <Package size={14} className="text-muted-foreground" />
          <span className="text-sm font-black text-foreground">{items.length}</span>
          <span className={t.micro + ' text-muted-foreground'}>items</span>
        </div>
        <div className="flex items-center gap-1.5">
          <CheckCircle2 size={14} className="text-emerald-500" />
          <span className="text-sm font-black text-foreground">{verified}/{items.length}</span>
          <span className={t.micro + ' text-muted-foreground'}>verified</span>
        </div>
      </div>
    </Link>
  );
};

const Projects = () => {
  const { fromUSD, format } = useCurrencyStore();
  const money = (usd: number) => format(fromUSD(usd || 0));

  const { data: projects, isLoading } = useQuery<Project[]>({
    queryKey: ['projects'],
    queryFn: async () => (await apiClient.get('/projects')).data,
  });

  const { data: boqs } = useQuery<BOQ[]>({
    queryKey: ['boq-items'],
    queryFn: async () => (await apiClient.get('/boq')).data,
  });

  const boqByProject = new Map<string, BOQ>();
  (boqs || []).forEach((b) => {
    if (b.project?._id) boqByProject.set(b.project._id, b);
  });

  const NewProjectBtn = (
    <Link to="/dashboard/projects/new" className={`${t.btnPrimary} inline-flex items-center gap-2`}>
      <Plus size={16} /> New Project
    </Link>
  );

  if (isLoading) {
    return (
      <DashboardShell>
        <div className="p-20 text-center text-muted-foreground font-bold flex items-center justify-center gap-2">
          <Loader2 className="animate-spin" size={18} /> Loading projects…
        </div>
      </DashboardShell>
    );
  }

  const all = projects || [];
  const active = all.filter((p) => !boqByProject.get(p._id)?.isLocked);
  const locked = all.filter((p) => boqByProject.get(p._id)?.isLocked);

  return (
    <DashboardShell>
      <div className="max-w-7xl mx-auto pb-20">
        <header className={t.pageHeader}>
          <div>
            <h1 className={`${t.h2} italic`}>Projects</h1>
            <p className={t.muted}>{all.length} project{all.length === 1 ? '' : 's'} · open one to manage its BOQ</p>
          </div>
          {NewProjectBtn}
        </header>

        {all.length === 0 ? (
          <div className={t.emptyState}>
            <div className={`${t.iconBoxYellow} mx-auto mb-6`}>
              <FolderKanban size={24} />
            </div>
            <h3 className="text-xl font-black text-foreground">No projects yet</h3>
            <p className="text-sm text-muted-foreground font-medium mt-2 mb-8 max-w-sm mx-auto">
              Create your first project to start building a Bill of Quantities and tracking budgets.
            </p>
            {NewProjectBtn}
          </div>
        ) : (
          <div className="space-y-12">
            {active.length > 0 && (
              <section>
                <h2 className={`${t.label} mb-5`}>Active · {active.length}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {active.map((p, i) => (
                    <motion.div
                      key={p._id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.04 }}
                    >
                      <ProjectCard project={p} boq={boqByProject.get(p._id)} money={money} />
                    </motion.div>
                  ))}
                </div>
              </section>
            )}

            {locked.length > 0 && (
              <section>
                <h2 className={`${t.label} mb-5 flex items-center gap-2`}>
                  <Lock size={12} /> Finalized / Locked · {locked.length}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {locked.map((p, i) => (
                    <motion.div
                      key={p._id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.04 }}
                    >
                      <ProjectCard project={p} boq={boqByProject.get(p._id)} money={money} />
                    </motion.div>
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </div>
    </DashboardShell>
  );
};

export default Projects;
