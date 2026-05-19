import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { DashboardShell } from '../../components/layout/DashboardShell';
import apiClient from '../../api/client';
import { Zap, DollarSign, Bell, Save, Loader2, ShieldCheck, Cpu } from 'lucide-react';
import { motion } from 'framer-motion';

const AdminSettings = () => {
  const queryClient = useQueryClient();

  // 1. LOCAL STATE FOR FORM
  const [settings, setSettings] = useState({
    marketplaceCommission: 2.5,
    tenderFee: 50,
    aiSystemPrompt: '',
    maintenanceMode: false
  });

  // 2. FETCH REAL GLOBAL CONFIG
  const { data: config, isLoading } = useQuery({
    queryKey: ['global-config'],
    queryFn: async () => {
      const { data } = await apiClient.get('/admin/settings');
      return data;
    }
  });

  // Sync local state when data arrives from MongoDB
  useEffect(() => {
    if (config) {
      setSettings({
        marketplaceCommission: config.marketplaceCommission || 2.5,
        tenderFee: config.tenderFee || 50,
        aiSystemPrompt: config.aiSystemPrompt || '',
        maintenanceMode: config.maintenanceMode || false
      });
    }
  }, [config]);

  // 3. SAVE MUTATION
  const saveMutation = useMutation({
    mutationFn: (newSettings: any) => apiClient.put('/admin/settings', newSettings),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['global-config'] });
      alert("Platform Configuration Updated Successfully.");
    }
  });

  if (isLoading) return (
    <div className="h-screen flex items-center justify-center bg-white">
      <Loader2 className="animate-spin text-blue-600" size={40} />
    </div>
  );

  return (
    <DashboardShell>
      <div className="max-w-4xl mx-auto pb-20">
        
        {/* HEADER SECTION */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div>
            <h1 className="text-4xl font-black text-[#001529] tracking-tight">Global Configuration</h1>
            <p className="text-sm text-slate-400 font-medium italic underline underline-offset-4 decoration-blue-600/20">Master controls for BuildHub Africa Infrastructure.</p>
          </div>
          <button 
            onClick={() => saveMutation.mutate(settings)}
            disabled={saveMutation.isPending}
            className="bg-blue-600 text-white px-10 py-4 rounded-[2rem] font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-900/20 hover:bg-blue-700 transition-all flex items-center gap-3"
          >
            {saveMutation.isPending ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
            Commit Changes
          </button>
        </header>

        <div className="space-y-8">
          
          {/* SECTION 1: REVENUE LOGIC */}
          <div className="bg-white p-10 rounded-[3.5rem] border border-slate-50 shadow-sm relative overflow-hidden">
            <div className="flex items-center gap-5 mb-10">
               <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 shadow-sm">
                  <DollarSign size={28} />
               </div>
               <div>
                  <h3 className="text-xl font-black text-[#001529]">Platform Revenue</h3>
                  <p className="text-xs text-slate-400 font-medium">Configure transaction commissions and bid fees.</p>
               </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Marketplace Cut (%)</label>
                  <input 
                    type="number" 
                    value={settings.marketplaceCommission}
                    onChange={(e) => setSettings({...settings, marketplaceCommission: parseFloat(e.target.value)})}
                    className="w-full p-5 bg-slate-50 border-none rounded-2xl text-sm font-black text-[#001529] outline-none focus:ring-4 ring-emerald-50 transition-all" 
                  />
               </div>
               <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Tender Listing Fee ($)</label>
                  <input 
                    type="number" 
                    value={settings.tenderFee}
                    onChange={(e) => setSettings({...settings, tenderFee: parseFloat(e.target.value)})}
                    className="w-full p-5 bg-slate-50 border-none rounded-2xl text-sm font-black text-[#001529] outline-none focus:ring-4 ring-emerald-50 transition-all" 
                  />
               </div>
            </div>
          </div>

          {/* SECTION 2: AI BRAIN LOGIC */}
          <div className="bg-[#001529] p-10 rounded-[3.5rem] text-white shadow-2xl relative overflow-hidden">
            <div className="absolute top-[-20px] right-[-20px] opacity-10"><Cpu size={180} /></div>
            <div className="flex items-center gap-5 mb-10 relative z-10">
               <div className="w-14 h-14 bg-blue-600/20 rounded-2xl flex items-center justify-center text-blue-400 border border-white/5 shadow-inner">
                  <Zap size={28} />
               </div>
               <div>
                  <h3 className="text-xl font-bold italic">AI Cognitive Core</h3>
                  <p className="text-xs text-slate-500 font-medium">Update the global system prompt for OpenAI integration.</p>
               </div>
            </div>
            <div className="space-y-4 relative z-10">
               <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] px-2">Global System Prompt</label>
               <textarea 
                value={settings.aiSystemPrompt}
                onChange={(e) => setSettings({...settings, aiSystemPrompt: e.target.value})}
                className="w-full p-6 bg-white/5 border border-white/10 rounded-[2rem] text-xs font-medium text-slate-300 h-40 outline-none focus:border-blue-500 transition-all resize-none" 
                placeholder="Instruct the AI on how to handle construction data..."
               />
            </div>
          </div>

          {/* SECTION 3: SYSTEM INTEGRITY */}
          <div className="bg-rose-50 border border-rose-100 p-10 rounded-[3.5rem] flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-6">
               <div className="w-16 h-16 bg-rose-600 rounded-3xl flex items-center justify-center text-white shadow-xl shadow-rose-900/20">
                  <Bell size={32} />
               </div>
               <div>
                  <h4 className="text-xl font-black text-rose-900">Platform Lockdown</h4>
                  <p className="text-xs text-rose-600 font-medium max-w-sm">Emergency Maintenance Mode. Enabling this will force-logout all non-admin sessions immediately.</p>
               </div>
            </div>
            
            {/* PREMIUM ANIMATED TOGGLE */}
            <div 
                onClick={() => setSettings({...settings, maintenanceMode: !settings.maintenanceMode})}
                className={`w-20 h-10 rounded-full p-1.5 transition-all cursor-pointer relative ${settings.maintenanceMode ? 'bg-rose-600' : 'bg-slate-200'}`}
            >
               <motion.div 
                animate={{ x: settings.maintenanceMode ? 40 : 0 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                className="w-7 h-7 bg-white rounded-full shadow-lg" 
               />
            </div>
          </div>

          <div className="pt-10 flex items-center justify-center gap-4 text-slate-300 font-black text-[9px] uppercase tracking-[0.4em]">
             <ShieldCheck size={14} /> Global Encryption Active • BuildHub Admin v4.2
          </div>
        </div>
      </div>
    </DashboardShell>
  );
};

export default AdminSettings;