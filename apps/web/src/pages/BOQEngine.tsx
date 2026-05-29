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
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const BOQRow = ({ item, onVerify, isVerifying }: any) => {
  const statusColors: any = {
    pending: "bg-amber-50 text-amber-600 border-amber-100",
    verified: "bg-emerald-50 text-emerald-600 border-emerald-100",
  };

  return (
    <motion.tr initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="group hover:bg-muted/50 transition-colors border-b border-border">
      <td className="px-6 py-4 text-sm font-medium text-muted-foreground">#</td>
      <td className="px-6 py-4">
        <div>
          <p className="text-sm font-bold text-foreground">{item.description}</p>
          {item.source === 'ai' && (
            <span className="flex items-center gap-1 text-[9px] font-black uppercase tracking-widest text-purple-500 mt-1">
              <Sparkles size={10} /> AI Suggested
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

const BOQEngine = () => {
  const queryClient = useQueryClient();

  // 1. FETCH REAL BOQ DATA
  const { data: boqData, isLoading } = useQuery({
    queryKey: ['boq-items'],
    queryFn: async () => {
      const { data } = await apiClient.get('/boq'); // Fetch items for current company
      return data;
    }
  });

  // 2. VERIFY ITEM MUTATION
  const verifyMutation = useMutation({
    mutationFn: (itemId: string) => apiClient.put(`/boq/verify/${itemId}`, { status: 'verified' }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['boq-items'] })
  });

  const items = boqData?.items || [];
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
                {items.map((item: any) => (
                  <BOQRow 
                    key={item._id} 
                    item={item} 
                    onVerify={verifyMutation.mutate} 
                    isVerifying={verifyMutation.isPending} 
                  />
                ))}
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
                 <button className="bg-primary text-brand-navy px-8 py-3 rounded-xl font-bold text-xs hover:bg-primary-dim transition-all">Request AI Analysis</button>
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
    </DashboardShell>
  );
};

export default BOQEngine;