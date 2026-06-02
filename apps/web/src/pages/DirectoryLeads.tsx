import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { DashboardShell } from '../components/layout/DashboardShell';
import apiClient from '../api/client';
import {
  User,
  MessageSquare,
  MapPin,
  Loader2,
  Inbox,
  Search,
  Phone,
  Clock3,
  ArrowUpRight,
  Filter,
  CheckCheck,
  BadgeAlert,
  XCircle,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { t, statusBadge } from '../theme';

type InquiryStatus = 'all' | 'new' | 'contacted' | 'closed';

const statusFilters: { key: InquiryStatus; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'new', label: 'New' },
  { key: 'contacted', label: 'Contacted' },
  { key: 'closed', label: 'Closed' },
];

const cleanPhone = (phone: string) => phone.replace(/[^0-9]/g, '');

const openWhatsApp = (phone: string) => {
  const clean = cleanPhone(phone);
  if (!clean) return;
  window.open(`https://wa.me/${clean}`, '_blank', 'noopener,noreferrer');
};

const formatInquiryTime = (value: string | Date) =>
  new Date(value).toLocaleString([], {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });

const DirectoryLeads = () => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState<InquiryStatus>('all');

  const { data: leads, isLoading } = useQuery({
    queryKey: ['inquiries'],
    queryFn: async () => (await apiClient.get('/inquiries')).data,
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: 'new' | 'contacted' | 'closed' }) =>
      apiClient.put(`/inquiries/${id}/status`, { status }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['inquiries'] }),
  });

  const inquiryList = Array.isArray(leads) ? leads : [];
  const todayKey = new Date().toDateString();

  const total = inquiryList.length;
  const newCount = inquiryList.filter((lead: any) => lead.status === 'new').length;
  const contactedCount = inquiryList.filter((lead: any) => lead.status === 'contacted').length;
  const todayCount = inquiryList.filter((lead: any) => new Date(lead.createdAt).toDateString() === todayKey).length;

  const filteredLeads = inquiryList.filter((lead: any) => {
    const matchesSearch = [lead.clientName, lead.clientPhone, lead.message]
      .filter(Boolean)
      .join(' ')
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesFilter = activeFilter === 'all' || lead.status === activeFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <DashboardShell>
      <div className="max-w-[1600px] mx-auto pb-20">
        <header className="mb-8 space-y-6">
          <div className="flex flex-col xl:flex-row xl:items-end xl:justify-between gap-6">
            <div>
              <p className={t.label}>Client inbox</p>
              <h1 className={t.h1 + ' text-3xl md:text-4xl'}>Inquiries</h1>
              <p className={t.muted + ' mt-2'}>Messages saved from public company profiles and directory clicks.</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full xl:w-auto">
              {[
                { label: 'Total', value: total, icon: Inbox },
                { label: 'New', value: newCount, icon: BadgeAlert },
                { label: 'Contacted', value: contactedCount, icon: CheckCheck },
                { label: 'Today', value: todayCount, icon: Clock3 },
              ].map(({ label, value, icon: Icon }) => (
                <div key={label} className={t.statCard + ' min-w-[8rem]'}>
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className={t.label + ' mb-1'}>{label}</p>
                      <p className="text-2xl font-black text-white">{value}</p>
                    </div>
                    <div className={t.iconBoxNavy}>
                      <Icon size={18} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-brand-navy-card border border-brand-border rounded-[2rem] p-4 md:p-5 flex flex-col lg:flex-row gap-3 lg:items-center">
            <div className="flex items-center gap-3 flex-1 bg-brand-navy-light border border-brand-border rounded-2xl px-4 py-3">
              <Search className="text-white/45 shrink-0" size={18} />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, phone, or message"
                className="bg-transparent outline-none text-sm font-medium text-white placeholder:text-white/35 w-full min-w-0"
              />
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <Filter size={16} className="text-white/35 shrink-0 ml-1" />
              {statusFilters.map((item) => {
                const active = activeFilter === item.key;
                return (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => setActiveFilter(item.key)}
                    className={`px-4 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border ${
                      active
                        ? 'bg-brand-yellow text-brand-navy border-brand-yellow shadow-yellow'
                        : 'bg-brand-navy text-white/55 border-brand-border hover:text-white hover:border-brand-yellow/20'
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>
        </header>

        {isLoading ? (
          <div className="h-64 flex items-center justify-center text-white/35 font-bold animate-pulse">
            <Loader2 className="animate-spin mr-2" /> Syncing inquiry inbox...
          </div>
        ) : filteredLeads.length === 0 ? (
          <div className={t.emptyState}>
            <Inbox className="mx-auto text-white/15 mb-4" size={48} />
            <h3 className="text-xl font-bold text-white/50">
              {total === 0 ? 'No inquiries yet' : 'No inquiries match your filters'}
            </h3>
            <p className={t.label + ' mt-1 italic'}>
              {total === 0 ? 'New leads will appear here once clients reach out.' : 'Try a different name, phone number, or status.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredLeads.map((lead: any) => {
              const clean = cleanPhone(lead.clientPhone || '');
              const replyUrl = clean ? `https://wa.me/${clean}` : '';
              const nextStatus = lead.status === 'contacted' ? 'new' : 'contacted';

              return (
                <motion.article
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={lead._id}
                  className="bg-brand-navy-card border border-brand-border p-5 md:p-6 rounded-[2rem] shadow-sm hover:shadow-card hover:border-brand-yellow/20 transition-all"
                >
                  <div className="flex flex-col xl:flex-row xl:items-stretch gap-5">
                    <button
                      type="button"
                      onClick={() => openWhatsApp(lead.clientPhone)}
                      className="flex items-start gap-4 text-left flex-1 min-w-0 group"
                    >
                      <div className="w-14 h-14 bg-brand-yellow rounded-[1.5rem] flex items-center justify-center text-brand-navy font-black text-xl shadow-sm shrink-0">
                        {lead.clientName?.charAt(0) || '?'}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-lg font-black text-white group-hover:text-brand-yellow transition-colors">
                            {lead.clientName || 'Unnamed Lead'}
                          </h3>
                          <span className={statusBadge(lead.status) + ' px-3 py-1'}>
                            {lead.status || 'new'}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-3 mt-2 text-white/45 text-xs font-bold uppercase tracking-tight">
                          <span className="flex items-center gap-1">
                            <Phone size={13} className="text-brand-yellow" /> {lead.clientPhone}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin size={13} className="text-brand-yellow" /> {lead.source === 'public_directory' ? 'Directory' : 'Profile'}
                          </span>
                          <span className="flex items-center gap-1">
                            <User size={13} className="text-brand-yellow" /> {lead.company?.name || 'BuildHub Company'}
                          </span>
                        </div>

                        <p className="mt-4 text-sm text-white/65 leading-relaxed line-clamp-3">
                          {lead.message}
                        </p>
                      </div>
                    </button>

                    <div className="flex flex-col sm:flex-row xl:flex-col items-stretch sm:items-end gap-3 shrink-0">
                      <div className="text-left sm:text-right xl:text-right">
                        <p className={t.label}>Received</p>
                        <p className="text-sm font-bold text-white/70">{formatInquiryTime(lead.createdAt)}</p>
                        {lead.lastContactedAt && (
                          <p className="text-[10px] font-black uppercase tracking-widest text-emerald-400 mt-1">
                            Contacted {formatInquiryTime(lead.lastContactedAt)}
                          </p>
                        )}
                      </div>

                      <div className="flex flex-wrap justify-end gap-2">
                        <a
                          href={replyUrl || undefined}
                          target={replyUrl ? '_blank' : undefined}
                          rel={replyUrl ? 'noreferrer' : undefined}
                          className={`px-4 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest border flex items-center gap-2 transition-all ${
                            replyUrl
                              ? 'bg-brand-yellow text-brand-navy border-brand-yellow hover:bg-brand-yellow-dim'
                              : 'bg-brand-navy-light text-white/30 border-brand-border pointer-events-none'
                          }`}
                        >
                          <MessageSquare size={14} />
                          Reply
                        </a>

                        <button
                          type="button"
                          onClick={() => statusMutation.mutate({ id: lead._id, status: nextStatus })}
                          className={`px-4 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest border flex items-center gap-2 transition-all ${
                            lead.status === 'contacted'
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/15'
                              : lead.status === 'closed'
                                ? 'bg-rose-500/10 text-rose-400 border-rose-500/20 hover:bg-rose-500/15'
                                : 'bg-brand-navy-light text-white/65 border-brand-border hover:bg-brand-navy hover:text-white'
                          }`}
                          disabled={statusMutation.isPending}
                        >
                          {statusMutation.isPending ? (
                            <Loader2 size={14} className="animate-spin" />
                          ) : (
                            <ArrowUpRight size={14} />
                          )}
                          {lead.status === 'contacted' ? 'Reopen' : lead.status === 'closed' ? 'Reopen' : 'Mark Contacted'}
                        </button>

                        <button
                          type="button"
                          onClick={() => openWhatsApp(lead.clientPhone)}
                          className="px-4 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest border bg-brand-navy text-white/75 border-brand-border hover:bg-brand-navy-light hover:text-white transition-all flex items-center gap-2"
                        >
                          <MessageSquare size={14} />
                          Open Chat
                        </button>

                        {lead.status === 'closed' && (
                          <span className="px-4 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest border bg-brand-navy-light text-white/40 border-brand-border flex items-center gap-2">
                            <XCircle size={14} />
                            Closed
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </div>
        )}
      </div>
    </DashboardShell>
  );
};

export default DirectoryLeads;
