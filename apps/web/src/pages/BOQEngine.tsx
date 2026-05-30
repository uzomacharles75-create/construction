import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../api/client';
import { DashboardShell } from '../components/layout/DashboardShell';
import {
  Plus,
  Download,
  CheckCircle,
  AlertCircle,
  Sparkles,
  MoreVertical,
  FileCheck,
  Lock,
  Loader2,
  X,
  Wand2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type Confidence = 'high' | 'medium' | 'low';

interface MarketplaceMatch {
  name: string;
  price: number;
  unit: string;
  supplier?: string;
  category?: string;
}

interface Suggestion {
  rate: number;
  unit: string;
  justification: string;
  confidence: Confidence;
  location?: string | null;
  vatRate?: number;
  marketplaceMatches?: MarketplaceMatch[];
  pricedFrom?: 'marketplace+ai' | 'ai';
}

const confidenceStyles: Record<Confidence, string> = {
  high: 'bg-emerald-50 text-emerald-600 border-emerald-200',
  medium: 'bg-amber-50 text-amber-600 border-amber-200',
  low: 'bg-rose-50 text-rose-600 border-rose-200',
};

const ConfidenceBadge = ({ level }: { level?: Confidence }) => {
  if (!level) return null;
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full border text-[9px] font-black uppercase tracking-widest ${confidenceStyles[level]}`}>
      {level} confidence
    </span>
  );
};

const BOQRow = ({ item, onVerify, isVerifying }: any) => {
  const statusColors: any = {
    pending: "bg-amber-50 text-amber-600 border-amber-100",
    verified: "bg-emerald-50 text-emerald-600 border-emerald-100",
    rejected: "bg-rose-50 text-rose-600 border-rose-100",
  };

  return (
    <motion.tr initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="group hover:bg-muted/50 transition-colors border-b border-border">
      <td className="px-6 py-4 text-sm font-medium text-muted-foreground">#</td>
      <td className="px-6 py-4">
        <div>
          <p className="text-sm font-bold text-foreground">{item.description}</p>
          {item.source === 'ai' && (
            <span className="flex items-center gap-2 mt-1">
              <span className="flex items-center gap-1 text-[9px] font-black uppercase tracking-widest text-purple-500">
                <Sparkles size={10} /> AI Suggested
              </span>
              <ConfidenceBadge level={item.confidence} />
            </span>
          )}
        </div>
      </td>
      <td className="px-6 py-4 text-sm text-foreground/70 font-medium">{item.unit}</td>
      <td className="px-6 py-4 text-sm text-foreground font-bold">{item.qty}</td>
      <td className="px-6 py-4 text-sm text-foreground font-bold">${item.rate}</td>
      <td className="px-6 py-4 text-sm text-foreground font-black">${(item.qty * item.rate).toLocaleString()}</td>
      <td className="px-6 py-4">
        <button
          onClick={() => onVerify(item._id)}
          disabled={item.status === 'verified' || isVerifying}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-[10px] font-black uppercase transition-all ${statusColors[item.status]}`}
        >
          {isVerifying ? <Loader2 size={12} className="animate-spin" /> : item.status === 'verified' ? <CheckCircle size={12} /> : <AlertCircle size={12} />}
          {item.status}
        </button>
      </td>
      <td className="px-6 py-4 text-right">
        <button className="text-foreground/35 hover:text-foreground"><MoreVertical size={18} /></button>
      </td>
    </motion.tr>
  );
};

/* ------------------------------------------------------------------ */
/* AI ESTIMATOR MODAL: suggest -> confidence -> accept / edit / reject */
/* ------------------------------------------------------------------ */
const AIEstimatorModal = ({ onClose, onAccepted }: { onClose: () => void; onAccepted: () => void }) => {
  const [projectId, setProjectId] = useState('');
  const [description, setDescription] = useState('');
  const [unit, setUnit] = useState('');
  const [qty, setQty] = useState('1');
  const [rate, setRate] = useState('');          // editable: holds suggested rate, user can override
  const [suggestion, setSuggestion] = useState<Suggestion | null>(null);

  // Projects for the "insert into" target
  const { data: projects } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => (await apiClient.get('/projects')).data,
  });

  // 1. Ask the AI for a price
  const suggestMutation = useMutation({
    mutationFn: async () =>
      (await apiClient.post('/boq/suggest-pricing', { description, unit, projectId })).data as Suggestion,
    onSuccess: (data) => {
      setSuggestion(data);
      setRate(String(data.rate));
      if (!unit) setUnit(data.unit);
    },
  });

  // 2. Accept -> insert into the chosen project's BOQ as an AI-sourced item
  const acceptMutation = useMutation({
    mutationFn: async () =>
      apiClient.post(`/boq/project/${projectId}/item`, {
        description,
        unit: unit || suggestion?.unit,
        qty: Number(qty),
        rate: Number(rate),
        source: 'ai',
        suggestedRate: suggestion?.rate,
        confidence: suggestion?.confidence,
        aiJustification: suggestion?.justification,
      }),
    onSuccess: () => {
      onAccepted();
      onClose();
    },
  });

  const edited = suggestion && Number(rate) !== suggestion.rate;
  const canSuggest = description.trim().length > 0;
  const canAccept = !!suggestion && !!projectId && Number(qty) > 0 && Number(rate) >= 0;

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, y: 10 }} animate={{ scale: 1, y: 0 }}
        className="bg-card w-full max-w-lg rounded-[2.5rem] border border-border shadow-2xl p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-black text-foreground flex items-center gap-2">
            <Wand2 size={20} className="text-purple-500" /> AI Price Estimator
          </h3>
          <button onClick={onClose} className="text-foreground/40 hover:text-foreground"><X size={20} /></button>
        </div>

        {/* Target project */}
        <label className="block text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Add to project <span className="text-purple-500 normal-case">(sets pricing region)</span></label>
        <select
          value={projectId}
          onChange={(e) => setProjectId(e.target.value)}
          className="w-full mb-4 px-4 py-3 rounded-xl border border-border bg-background text-sm font-medium text-foreground"
        >
          <option value="">Select a project…</option>
          {(projects || []).map((p: any) => (
            <option key={p._id} value={p._id}>{p.name}</option>
          ))}
        </select>

        {/* Item description */}
        <label className="block text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Item description</label>
        <input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="e.g. 32.5N Portland cement, 50kg bag"
          className="w-full mb-4 px-4 py-3 rounded-xl border border-border bg-background text-sm font-medium text-foreground"
        />

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Unit (optional)</label>
            <input
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              placeholder="bag / m³ / unit"
              className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm font-medium text-foreground"
            />
          </div>
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Qty</label>
            <input
              type="number" min={1}
              value={qty}
              onChange={(e) => setQty(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm font-medium text-foreground"
            />
          </div>
        </div>

        <button
          onClick={() => suggestMutation.mutate()}
          disabled={!canSuggest || suggestMutation.isPending}
          className="w-full flex items-center justify-center gap-2 bg-primary text-brand-navy px-6 py-3 rounded-xl font-black text-xs uppercase tracking-wider hover:bg-primary-dim transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {suggestMutation.isPending ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
          {suggestion ? 'Re-estimate' : 'Get AI Price'}
        </button>

        {/* Suggestion result: accept / edit / reject */}
        <AnimatePresence>
          {suggestion && (
            <motion.div
              initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
              className="mt-6 border border-border rounded-2xl p-5 bg-muted/40"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                  {suggestion.pricedFrom === 'marketplace+ai' ? 'Marketplace-anchored' : 'AI Estimate'}
                  {suggestion.location ? ` · ${suggestion.location}` : ''}
                </span>
                <ConfidenceBadge level={suggestion.confidence} />
              </div>

              <p className="text-sm text-foreground/80 mb-4 italic">“{suggestion.justification}”</p>

              {/* AI vs marketplace comparison */}
              {suggestion.marketplaceMatches && suggestion.marketplaceMatches.length > 0 && (
                <div className="mb-4 border border-border rounded-xl overflow-hidden">
                  <div className="bg-muted px-3 py-2 text-[9px] font-black uppercase tracking-widest text-muted-foreground">
                    Marketplace reference prices
                  </div>
                  {suggestion.marketplaceMatches.map((m, i) => (
                    <div key={i} className="flex items-center justify-between px-3 py-2 text-xs border-t border-border first:border-t-0">
                      <span className="font-bold text-foreground/80 truncate pr-2">{m.name}{m.supplier ? <span className="text-foreground/40 font-medium"> · {m.supplier}</span> : null}</span>
                      <span className="font-black text-foreground whitespace-nowrap">${m.price}/{m.unit}</span>
                    </div>
                  ))}
                </div>
              )}

              {suggestion.vatRate !== undefined && (
                <div className="flex items-center justify-between text-[11px] font-bold text-muted-foreground mb-4 px-1">
                  <span>VAT ({(suggestion.vatRate * 100).toFixed(1)}%)</span>
                  <span>+${(Number(qty) * Number(rate || 0) * suggestion.vatRate).toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                </div>
              )}

              <div className="flex items-end gap-3 mb-5">
                <div className="flex-1">
                  <label className="block text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">
                    Rate {edited && <span className="text-purple-500 normal-case">(edited)</span>}
                  </label>
                  <div className="flex items-center gap-2">
                    <span className="text-foreground/50 font-bold">$</span>
                    <input
                      type="number" min={0}
                      value={rate}
                      onChange={(e) => setRate(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm font-bold text-foreground"
                    />
                  </div>
                </div>
                <div className="text-right">
                  <span className="block text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Line total</span>
                  <span className="text-lg font-black text-foreground">
                    ${(Number(qty) * Number(rate || 0)).toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => acceptMutation.mutate()}
                  disabled={!canAccept || acceptMutation.isPending}
                  className="flex-1 flex items-center justify-center gap-2 bg-emerald-500 text-white px-4 py-3 rounded-xl font-black text-xs uppercase tracking-wider hover:bg-emerald-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {acceptMutation.isPending ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle size={14} />}
                  Accept &amp; Add
                </button>
                <button
                  onClick={() => { setSuggestion(null); setRate(''); }}
                  className="flex-1 flex items-center justify-center gap-2 bg-card border border-border text-foreground px-4 py-3 rounded-xl font-black text-xs uppercase tracking-wider hover:bg-muted transition-all"
                >
                  <X size={14} /> Reject
                </button>
              </div>
              {!projectId && (
                <p className="text-[10px] font-bold text-amber-600 mt-3 text-center uppercase tracking-wider">Select a project above to accept this price.</p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

const BOQEngine = () => {
  const queryClient = useQueryClient();
  const [showEstimator, setShowEstimator] = useState(false);

  // 1. FETCH REAL BOQ DATA (GET /boq returns an array of BOQ docs for the company)
  const { data: boqData, isLoading } = useQuery({
    queryKey: ['boq-items'],
    queryFn: async () => {
      const { data } = await apiClient.get('/boq');
      return data;
    }
  });

  // 2. VERIFY ITEM MUTATION
  const verifyMutation = useMutation({
    mutationFn: (itemId: string) => apiClient.put(`/boq/verify/${itemId}`, { status: 'verified' }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['boq-items'] })
  });

  const refetchBOQ = () => queryClient.invalidateQueries({ queryKey: ['boq-items'] });

  // Flatten all company BOQs into a single item list (GET /boq returns an array)
  const items = Array.isArray(boqData)
    ? boqData.flatMap((boq: any) => (boq.items || []))
    : (boqData?.items || []);

  const allVerified = items.length > 0 && items.every((item: any) => item.status === 'verified');
  const subtotal = items.reduce((acc: number, item: any) => acc + (item.qty * item.rate), 0);

  if (isLoading) return <div className="p-20 text-center font-bold text-muted-foreground animate-pulse">Loading BOQ Engine...</div>;

  return (
    <DashboardShell>
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-black text-foreground tracking-tight italic">BOQ Estimation Engine</h1>
            <p className="text-brand-muted text-sm font-medium">Verify AI suggestions and market rates before exporting.</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowEstimator(true)}
              className="flex items-center gap-2 bg-card border border-border text-foreground px-6 py-3 rounded-2xl font-bold text-xs hover:bg-muted transition-all"
            >
              <Wand2 size={16} className="text-purple-500" /> AI Estimate
            </button>
            <button className="bg-card border border-border text-foreground px-6 py-3 rounded-2xl font-bold text-xs hover:bg-muted transition-all">
              <Plus size={18} className="inline mr-2" /> Add Item
            </button>
            <button
              disabled={!allVerified}
              className={`flex items-center gap-2 px-8 py-3 rounded-2xl font-black text-xs transition-all shadow-xl ${
                allVerified ? "bg-primary text-brand-navy hover:bg-primary-dim" : "bg-muted text-muted-foreground cursor-not-allowed"
              }`}
            >
              {allVerified ? <Download size={18} /> : <Lock size={18} />} Export PDF
            </button>
          </div>
        </header>

        <AnimatePresence>
          {!allVerified && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mb-6 bg-amber-50 border border-amber-100 p-4 rounded-2xl flex items-center gap-3">
              <AlertCircle className="text-amber-500" size={20} />
              <p className="text-[11px] font-black text-amber-700 uppercase tracking-wider">
                Export Locked: All line items must be verified by a human before finalization.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="bg-card rounded-[2.5rem] border border-border overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-muted text-[10px] text-muted-foreground font-black uppercase tracking-widest">
                <tr>
                  <th className="px-6 py-5">#</th>
                  <th className="px-6 py-5">Description</th>
                  <th className="px-6 py-5">Unit</th>
                  <th className="px-6 py-5">Qty</th>
                  <th className="px-6 py-5">Rate</th>
                  <th className="px-6 py-5">Total</th>
                  <th className="px-6 py-5">Status</th>
                  <th className="px-6 py-5"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {items.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-16 text-center text-sm font-bold text-muted-foreground">
                      No BOQ items yet. Use <span className="text-purple-500">AI Estimate</span> to suggest a price.
                    </td>
                  </tr>
                ) : (
                  items.map((item: any) => (
                    <BOQRow
                      key={item._id}
                      item={item}
                      onVerify={verifyMutation.mutate}
                      isVerifying={verifyMutation.isPending}
                    />
                  ))
                )}
              </tbody>
              <tfoot className="bg-muted/50">
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-right font-bold text-muted-foreground uppercase text-xs">Estimated Subtotal</td>
                  <td className="px-6 py-8 font-black text-3xl text-foreground">${subtotal.toLocaleString()}</td>
                  <td colSpan={2}></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* AI PANEL */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
           <div className="lg:col-span-2 bg-background p-10 rounded-[3.5rem] text-foreground relative overflow-hidden shadow-2xl">
              <Sparkles className="absolute right-[-20px] top-[-20px] text-foreground/5 w-64 h-64" />
              <div className="relative z-10">
                 <h3 className="text-2xl font-bold mb-2">BuildHub AI Estimator</h3>
                 <p className="text-muted-foreground text-sm mb-8 max-w-md">Our AI cross-references marketplace data and previous projects to suggest the most accurate market rates.</p>
                 <button
                   onClick={() => setShowEstimator(true)}
                   className="flex items-center gap-2 bg-primary text-brand-navy px-8 py-3 rounded-xl font-bold text-xs hover:bg-primary-dim transition-all"
                 >
                   <Wand2 size={16} /> Request AI Analysis
                 </button>
              </div>
           </div>

           <div className="bg-card border border-border p-10 rounded-[3.5rem] border border-border flex flex-col items-center text-center justify-center">
              <div className="w-16 h-16 bg-emerald-50 rounded-[1.5rem] flex items-center justify-center text-emerald-500 mb-6">
                 <FileCheck size={32} />
              </div>
              <h4 className="font-bold text-foreground">Accuracy Guaranteed</h4>
              <p className="text-xs text-muted-foreground mt-2">Verified items ensure 100% financial compliance and accurate profit forecasting.</p>
           </div>
        </div>
      </div>

      <AnimatePresence>
        {showEstimator && (
          <AIEstimatorModal onClose={() => setShowEstimator(false)} onAccepted={refetchBOQ} />
        )}
      </AnimatePresence>
    </DashboardShell>
  );
};

export default BOQEngine;
