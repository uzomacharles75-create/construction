import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { DashboardShell } from '../components/layout/DashboardShell';
import apiClient from '../api/client';
import { 
  Plus, Trash2, Loader2, Wrench, CheckCircle2, 
  DollarSign, Clock, Tag, Globe, Lock
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const CATEGORIES = [
  'General Construction', 'Civil Engineering', 'Electrical Works',
  'Plumbing & Sanitation', 'Roofing', 'Interior Finishing',
  'Landscaping', 'Project Management', 'Architectural Design', 'Other'
];

const Services = () => {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: '', category: '', description: '', priceFrom: '', priceTo: '', unit: 'project', isPublic: true
  });

  const { data: services, isLoading } = useQuery({
    queryKey: ['company-services'],
    queryFn: async () => {
      const { data } = await apiClient.get('/services');
      return data;
    }
  });

  const addMutation = useMutation({
    mutationFn: (payload: any) => apiClient.post('/services', payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['company-services'] });
      toast.success('Service added to your profile!');
      setShowForm(false);
      setForm({ name: '', category: '', description: '', priceFrom: '', priceTo: '', unit: 'project', isPublic: true });
    },
    onError: () => toast.error('Failed to add service.')
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiClient.delete(`/services/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['company-services'] });
      toast.success('Service removed.');
    }
  });

  const handleSubmit = () => {
    if (!form.name || !form.category) return toast.error('Name and category are required.');
    addMutation.mutate(form);
  };

  return (
    <DashboardShell>
      <div className="max-w-[1400px] mx-auto pb-20">
        <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-brand-navy tracking-tight">My Services</h1>
            <p className="text-sm text-white/50 font-medium mt-1">
              Services listed here appear on your public directory profile.
            </p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 px-6 py-3 bg-brand-yellow text-brand-navy rounded-2xl font-black text-sm shadow-yellow hover:scale-[1.02] transition-all"
          >
            <Plus size={18} /> Add Service
          </button>
        </header>

        {/* ADD SERVICE FORM */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, y: -16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.98 }}
              className="bg-brand-navy-card rounded-[2.5rem] border border-brand-yellow/30 shadow-yellow p-8 mb-8"
            >
              <h3 className="text-lg font-black text-brand-navy mb-6 flex items-center gap-2">
                <Wrench size={18} className="text-brand-yellow" /> New Service
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-white/50 px-1 mb-1 block">Service Name *</label>
                  <input
                    type="text"
                    placeholder="e.g. Residential Foundation Works"
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    className="w-full p-4 bg-brand-navy-light rounded-2xl outline-none focus:ring-2 focus:ring-brand-yellow/40 font-medium text-sm border-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-white/50 px-1 mb-1 block">Category *</label>
                  <select
                    value={form.category}
                    onChange={e => setForm({ ...form, category: e.target.value })}
                    className="w-full p-4 bg-brand-navy-light rounded-2xl outline-none focus:ring-2 focus:ring-brand-yellow/40 font-medium text-sm border-none"
                  >
                    <option value="">Select category...</option>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-white/50 px-1 mb-1 block">Description</label>
                  <textarea
                    placeholder="Describe what this service includes..."
                    value={form.description}
                    onChange={e => setForm({ ...form, description: e.target.value })}
                    className="w-full p-4 bg-brand-navy-light rounded-2xl outline-none focus:ring-2 focus:ring-brand-yellow/40 font-medium text-sm border-none h-24 resize-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-white/50 px-1 mb-1 block">Price From (XAF)</label>
                  <input
                    type="number"
                    placeholder="50,000"
                    value={form.priceFrom}
                    onChange={e => setForm({ ...form, priceFrom: e.target.value })}
                    className="w-full p-4 bg-brand-navy-light rounded-2xl outline-none focus:ring-2 focus:ring-brand-yellow/40 font-medium text-sm border-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-white/50 px-1 mb-1 block">Price To (XAF)</label>
                  <input
                    type="number"
                    placeholder="500,000"
                    value={form.priceTo}
                    onChange={e => setForm({ ...form, priceTo: e.target.value })}
                    className="w-full p-4 bg-brand-navy-light rounded-2xl outline-none focus:ring-2 focus:ring-brand-yellow/40 font-medium text-sm border-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-white/50 px-1 mb-1 block">Pricing Unit</label>
                  <select
                    value={form.unit}
                    onChange={e => setForm({ ...form, unit: e.target.value })}
                    className="w-full p-4 bg-brand-navy-light rounded-2xl outline-none focus:ring-2 focus:ring-brand-yellow/40 font-medium text-sm border-none"
                  >
                    {['project', 'm²', 'm³', 'unit', 'day', 'hour'].map(u => <option key={u} value={u}>{u}</option>)}
                  </select>
                </div>
                <div className="flex items-center gap-3 pt-6 pl-1">
                  <button
                    onClick={() => setForm({ ...form, isPublic: !form.isPublic })}
                    className={`w-12 h-6 rounded-full transition-all ${form.isPublic ? 'bg-brand-yellow' : 'bg-brand-navy-light'} relative`}
                  >
                    <div className={`w-5 h-5 bg-brand-navy-card rounded-full absolute top-0.5 transition-all shadow ${form.isPublic ? 'left-6' : 'left-0.5'}`} />
                  </button>
                  <span className="text-sm font-bold text-white/70 flex items-center gap-1">
                    {form.isPublic ? <Globe size={14} className="text-brand-yellow" /> : <Lock size={14} />}
                    {form.isPublic ? 'Visible on public profile' : 'Hidden from directory'}
                  </span>
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button onClick={() => setShowForm(false)} className="px-6 py-3 text-white/50 font-black text-sm hover:text-white/70">Cancel</button>
                <button
                  onClick={handleSubmit}
                  disabled={addMutation.isPending}
                  className="px-8 py-3 bg-brand-navy text-white rounded-2xl font-black text-sm flex items-center gap-2 hover:bg-brand-navy-light transition-all"
                >
                  {addMutation.isPending ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle2 size={16} />}
                  Save Service
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* SERVICES LIST */}
        {isLoading ? (
          <div className="h-64 flex items-center justify-center text-white/35 animate-pulse font-bold">
            <Loader2 className="animate-spin mr-2" /> Loading services...
          </div>
        ) : services?.length === 0 ? (
          <div className="bg-brand-navy-card border border-brand-border p-20 rounded-[3rem] border-2 border-dashed border-brand-border text-center">
            <Wrench className="mx-auto text-white/15 mb-4" size={48} />
            <h3 className="text-xl font-bold text-white/50">No services yet</h3>
            <p className="text-xs text-white/35 mt-1 uppercase font-black tracking-widest">Add your first service to attract clients</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {services?.map((svc: any) => (
              <motion.div
                key={svc._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-brand-navy-card rounded-[2rem] border border-brand-border p-6 hover:shadow-card hover:border-brand-yellow/30 transition-all group relative"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-brand-yellow/10 rounded-2xl flex items-center justify-center text-brand-yellow">
                    <Wrench size={22} />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${svc.isPublic ? 'bg-emerald-50 text-emerald-600' : 'bg-brand-navy-light text-white/50'}`}>
                      {svc.isPublic ? 'Public' : 'Hidden'}
                    </span>
                    <button
                      onClick={() => deleteMutation.mutate(svc._id)}
                      className="p-2 rounded-xl opacity-0 group-hover:opacity-100 hover:bg-rose-50 hover:text-rose-500 text-white/35 transition-all"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                <h3 className="font-black text-brand-navy text-base mb-1">{svc.name}</h3>
                <span className="text-[10px] font-black uppercase tracking-widest text-white/50 flex items-center gap-1 mb-3">
                  <Tag size={10} /> {svc.category}
                </span>
                {svc.description && <p className="text-xs text-brand-muted font-medium mb-4 leading-relaxed line-clamp-2">{svc.description}</p>}
                {(svc.priceFrom || svc.priceTo) && (
                  <div className="flex items-center gap-1 text-brand-yellow font-black text-sm">
                    <DollarSign size={14} />
                    {svc.priceFrom && Number(svc.priceFrom).toLocaleString()}
                    {svc.priceTo && ` – ${Number(svc.priceTo).toLocaleString()}`} XAF
                    <span className="text-white/35 font-medium text-xs ml-1 flex items-center gap-1">
                      <Clock size={10} /> / {svc.unit}
                    </span>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </DashboardShell>
  );
};

export default Services;
