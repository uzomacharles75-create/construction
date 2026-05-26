import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { DashboardShell } from '../components/layout/DashboardShell';
import { FileUp, MapPin, DollarSign, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import apiClient from '../api/client';

const CreateTender = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // 1. FORM STATE
  const [formData, setFormData] = useState({
    title: '',
    location: '',
    budget: '',
    description: '',
    category: 'General Construction'
  });

  // 2. SUBMISSION MUTATION
  const tenderMutation = useMutation({
    mutationFn: (newTender: any) => apiClient.post('/tenders', newTender),
    onSuccess: () => {
      // Refresh tender lists across the app
      queryClient.invalidateQueries({ queryKey: ['tenders'] });
      // Redirect to the Tender Board
      navigate('/dashboard/tenders');
    }
  });

  const handleSubmit = (e: React.FormEvent, status: string) => {
    e.preventDefault();
    if (!formData.title || !formData.budget) {
      alert("Please fill in the project title and estimated budget.");
      return;
    }
    
    tenderMutation.mutate({
      ...formData,
      status: status === 'draft' ? 'Draft' : 'Open',
      budget: Number(formData.budget)
    });
  };

  return (
    <DashboardShell>
      <div className="max-w-3xl mx-auto pb-20">
        <header className="mb-12">
          <h1 className="text-4xl font-black text-white tracking-tight">Post a New Tender</h1>
          <p className="text-sm text-white/50 font-medium mt-2">Publish your project requirements to receive competitive bids from verified BuildHub contractors.</p>
        </header>

        <form className="space-y-8">
          {/* CORE DETAILS */}
          <div className="bg-brand-navy-card border border-brand-border p-10 rounded-[3rem] shadow-premium border border-brand-border space-y-6">
            <div>
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50 block mb-3 px-1">Project Title</label>
              <input 
                type="text" 
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                placeholder="e.g. Modern Residential Villa Construction" 
                className="w-full p-5 bg-brand-navy-light border-none rounded-2xl outline-none font-bold text-white focus:ring-2 ring-brand-yellow/40 transition-all" 
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50 block mb-3 px-1">Site Location</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-white/35" size={18} />
                  <input 
                    type="text" 
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    placeholder="City, Country" 
                    className="w-full p-5 pl-12 bg-brand-navy-light border-none rounded-2xl outline-none text-sm font-bold text-white focus:ring-2 ring-brand-yellow/40" 
                  />
                </div>
              </div>
              <div>
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50 block mb-3 px-1">Est. Budget ($)</label>
                <div className="relative">
                  <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-white/35" size={18} />
                  <input 
                    type="number" 
                    value={formData.budget}
                    onChange={(e) => setFormData({...formData, budget: e.target.value})}
                    placeholder="0.00" 
                    className="w-full p-5 pl-12 bg-brand-navy-light border-none rounded-2xl outline-none text-sm font-bold text-white focus:ring-2 ring-brand-yellow/40" 
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50 block mb-3 px-1">Project Scope & Description</label>
              <textarea 
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Describe the technical requirements, materials needed, and timeline expectations..." 
                className="w-full p-6 bg-brand-navy-light border-none rounded-[2rem] outline-none text-sm font-medium text-white/70 h-48 resize-none focus:ring-2 ring-brand-yellow/40 transition-all" 
              />
            </div>
          </div>

          {/* ATTACHMENTS (Visual Placeholder for Cloudinary) */}
          <div className="bg-brand-navy-card border border-brand-border p-10 rounded-[3rem] shadow-premium border border-brand-border">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50 mb-6 px-1">Blueprints & Documents</h3>
            <div className="border-2 border-dashed border-brand-border rounded-[2.5rem] p-12 text-center group hover:border-brand-yellow transition-all cursor-pointer bg-brand-navy-light/50">
              <FileUp className="mx-auto text-white/35 group-hover:text-brand-yellow mb-4 group-hover:scale-110 transition-transform" size={48} />
              <p className="text-sm font-bold text-white">Upload project site plans</p>
              <p className="text-[10px] text-white/50 mt-2 font-medium uppercase tracking-widest">PDF, DWG or JPG up to 20MB</p>
            </div>
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex flex-col md:flex-row items-center gap-4">
             <button 
                onClick={(e) => handleSubmit(e, 'open')}
                disabled={tenderMutation.isPending}
                className="w-full md:flex-1 bg-brand-navy text-white py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl hover:bg-brand-yellow-dim hover:scale-[1.02] transition-all flex items-center justify-center gap-3"
             >
               {tenderMutation.isPending ? <Loader2 size={18} className="animate-spin" /> : <CheckCircle2 size={18} />}
               Publish Tender
             </button>
             
             <button 
                onClick={(e) => handleSubmit(e, 'draft')}
                disabled={tenderMutation.isPending}
                className="w-full md:w-auto px-10 py-5 bg-brand-navy-card text-white/50 font-black text-[10px] uppercase tracking-widest rounded-2xl border border-brand-border hover:bg-brand-navy-light transition-all"
             >
               Save as Draft
             </button>
          </div>

          {tenderMutation.isError && (
            <div className="flex items-center gap-2 text-rose-500 font-bold text-xs justify-center italic">
              <AlertCircle size={14} /> Failed to connect to system. Please check your network.
            </div>
          )}
        </form>
      </div>
    </DashboardShell>
  );
};

export default CreateTender;