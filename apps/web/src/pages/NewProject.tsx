import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../api/client';
import { DashboardShell } from '../components/layout/DashboardShell';
import { COUNTRIES, getRegions, getCities } from '../lib/locations';
import { ArrowLeft, Loader2, MapPin, Save } from 'lucide-react';

const labelCls = 'block text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1';
const inputCls = 'w-full px-4 py-3 rounded-xl border border-border bg-background text-sm font-medium text-foreground';

const NewProject = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [name, setName] = useState('');
  const [clientName, setClientName] = useState('');
  const [budget, setBudget] = useState('');
  const [country, setCountry] = useState('');
  const [region, setRegion] = useState('');
  const [city, setCity] = useState('');

  const regions = country ? getRegions(country) : [];
  const cities = country && region ? getCities(country, region) : [];
  const selectedCountry = COUNTRIES.find((c) => c.name === country);

  const createMutation = useMutation({
    mutationFn: async () =>
      apiClient.post('/projects', {
        name,
        clientName,
        budget: Number(budget) || 0,
        country: country || undefined,
        region: region || undefined,
        city: city || undefined,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard-projects'] });
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      navigate('/dashboard/projects');
    },
  });

  const canSave = name.trim() && clientName.trim();

  return (
    <DashboardShell>
      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground text-xs font-bold mb-6"
        >
          <ArrowLeft size={16} /> Back
        </button>

        <h1 className="text-3xl font-black text-foreground tracking-tight italic mb-1">New Project</h1>
        <p className="text-brand-muted text-sm font-medium mb-8">
          Set the project location — it powers regional AI pricing and tax estimates.
        </p>

        <div className="bg-card rounded-[2.5rem] border border-border p-8 space-y-5">
          <div>
            <label className={labelCls}>Project name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Bonapriso Mixed-Use Tower" className={inputCls} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Client</label>
              <input value={clientName} onChange={(e) => setClientName(e.target.value)} placeholder="Client name" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Budget</label>
              <input type="number" min={0} value={budget} onChange={(e) => setBudget(e.target.value)} placeholder="0" className={inputCls} />
            </div>
          </div>

          {/* LOCATION CASCADE */}
          <div className="pt-2">
            <p className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-foreground/70 mb-3">
              <MapPin size={14} className="text-primary" /> Location
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className={labelCls}>Country</label>
                <select
                  value={country}
                  onChange={(e) => { setCountry(e.target.value); setRegion(''); setCity(''); }}
                  className={inputCls}
                >
                  <option value="">Select…</option>
                  {COUNTRIES.map((c) => <option key={c.name} value={c.name}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className={labelCls}>Region / State</label>
                <select
                  value={region}
                  onChange={(e) => { setRegion(e.target.value); setCity(''); }}
                  disabled={!country}
                  className={`${inputCls} disabled:opacity-50`}
                >
                  <option value="">{country ? 'Select…' : '—'}</option>
                  {regions.map((r) => <option key={r.name} value={r.name}>{r.name}</option>)}
                </select>
              </div>
              <div>
                <label className={labelCls}>City</label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  disabled={!region}
                  className={`${inputCls} disabled:opacity-50`}
                >
                  <option value="">{region ? 'Select…' : '—'}</option>
                  {cities.map((ct) => <option key={ct} value={ct}>{ct}</option>)}
                </select>
              </div>
            </div>

            {selectedCountry && (
              <p className="text-[11px] font-bold text-muted-foreground mt-3">
                Currency <span className="text-foreground">{selectedCountry.currency}</span> ·
                VAT <span className="text-foreground">{(selectedCountry.vat * 100).toFixed(1)}%</span>
                {city && <> · AI pricing will target <span className="text-foreground">{[city, region, country].filter(Boolean).join(', ')}</span></>}
              </p>
            )}
          </div>

          <button
            onClick={() => createMutation.mutate()}
            disabled={!canSave || createMutation.isPending}
            className="w-full flex items-center justify-center gap-2 bg-primary text-brand-navy px-6 py-3.5 rounded-xl font-black text-xs uppercase tracking-widest shadow-xl hover:bg-primary-dim transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {createMutation.isPending ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            Create Project
          </button>
        </div>
      </div>
    </DashboardShell>
  );
};

export default NewProject;
