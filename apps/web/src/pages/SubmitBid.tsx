import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { DashboardShell } from '../components/layout/DashboardShell';
import apiClient from '../api/client';
import { useAuthStore } from '../store/useAuthStore';
import { DollarSign, Clock, MessageSquare, Loader2 } from 'lucide-react';

const SubmitBid = () => {
  const { id } = useParams();
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ amount: '', duration: '', coverLetter: '' });

  const { data: tender } = useQuery({
    queryKey: ['tender', id],
    queryFn: async () => (await apiClient.get(`/tenders/${id}`)).data
  });

  const bidMutation = useMutation({
    mutationFn: (data: any) => apiClient.post(`/tenders/${id}/proposals`, data),
    onSuccess: () => {
      const msg = encodeURIComponent(
        `Hello, I'm ${user?.name} from ${user?.company}. I've submitted a bid for: "${tender?.title}".\n\n` +
        `Quote: $${formData.amount}\nTime: ${formData.duration} weeks.`
      );
      window.open(`https://wa.me/${tender?.whatsappNumber}?text=${msg}`, '_blank');
      navigate('/dashboard/tenders');
    }
  });

  return (
    <DashboardShell>
      <div className="max-w-2xl mx-auto pb-20 pt-10">
        <h1 className="text-3xl font-black text-[#001529] mb-10">Submit Bid</h1>
        <div className="bg-white p-10 rounded-[3rem] shadow-premium border border-slate-100 space-y-8">
           <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                 <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-2">Total Bid ($)</label>
                 <div className="relative"><DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-600" size={18}/><input required type="number" value={formData.amount} onChange={(e) => setFormData({...formData, amount: e.target.value})} className="w-full p-4 pl-12 bg-slate-50 border-none rounded-2xl font-bold" /></div>
              </div>
              <div className="space-y-2">
                 <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-2">Weeks to Finish</label>
                 <div className="relative"><Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-600" size={18}/><input required type="number" value={formData.duration} onChange={(e) => setFormData({...formData, duration: e.target.value})} className="w-full p-4 pl-12 bg-slate-50 border-none rounded-2xl font-bold" /></div>
              </div>
           </div>
           <button onClick={() => bidMutation.mutate(formData)} disabled={bidMutation.isPending} className="w-full bg-[#001529] text-white py-5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl flex items-center justify-center gap-3">
              {bidMutation.isPending ? <Loader2 className="animate-spin" /> : <MessageSquare size={18} />} Confirm & Open WhatsApp
           </button>
        </div>
      </div>
    </DashboardShell>
  );
};

export default SubmitBid;