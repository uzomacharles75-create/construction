import { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { DashboardShell } from '../components/layout/DashboardShell';
import axios from 'axios';
import apiClient from '../api/client';
import { useAuthStore } from '../store/useAuthStore';
import { 
  Camera, Save, MapPin, 
  Loader2, Plus, Trash2, CheckCircle2 
} from 'lucide-react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

interface CompanyProfile {
  website?: string;
  email?: string;
  phone?: string;
  city?: string;
  country?: string;
  sector?: string;
  address?: string;
  logo?: string;
  name?: string;
   slug?: string;
  status?: string;
  portfolio?: string[];
}

const BusinessSettings = () => {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  const logoInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  // 1. STATE FOR INSTANT PREVIEWS
  const [tempLogo, setTempLogo] = useState<string | null>(null);
  const [tempGallery, setTempGallery] = useState<string[]>([]);

  interface BusinessFormData {
    website?: string;
    email?: string;
    phone?: string;
    city?: string;
    country?: string;
    sector?: string;
    address?: string;
  }

  const [formData, setFormData] = useState<BusinessFormData>({});

  const getPersistedSlug = () => {
    try {
      const raw = localStorage.getItem('buildhub-storage');
      if (!raw) return undefined;
      const parsed = JSON.parse(raw);
      return parsed?.user?.slug || parsed?.state?.user?.slug || undefined;
    } catch {
      return undefined;
    }
  };

  const getApiErrorMessage = (err: unknown, fallback: string) => {
    if (axios.isAxiosError(err)) {
      return (err.response?.data as { message?: string })?.message || err.message || fallback;
    }
    if (err instanceof Error) return err.message;
    return fallback;
  };

  // 2. FETCH REAL DATA (profile route works even when slug was missing in DB)
  const { data: company, isLoading } = useQuery<CompanyProfile, unknown>({
    queryKey: ['company-profile'],
    queryFn: async () => (await apiClient.get('/auth/company/profile')).data,
    enabled: !!user,
  });

  const companySlug = company?.slug ?? user?.slug ?? getPersistedSlug();

  const effectiveFormData = {
    website: formData.website !== undefined ? formData.website : company?.website ?? '',
    email: formData.email !== undefined ? formData.email : company?.email ?? '',
    phone: formData.phone !== undefined ? formData.phone : company?.phone ?? '',
    city: formData.city !== undefined ? formData.city : company?.city ?? '',
    country: formData.country !== undefined ? formData.country : company?.country ?? '',
    sector: formData.sector !== undefined ? formData.sector : company?.sector ?? 'General Construction',
    address: formData.address !== undefined ? formData.address : company?.address ?? ''
  };

  // Release temporary object URLs when preview state changes
  useEffect(() => {
    return () => {
      if (tempLogo) URL.revokeObjectURL(tempLogo);
    };
  }, [tempLogo]);

  useEffect(() => {
    return () => {
      tempGallery.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [tempGallery]);

  const logoPreview = tempLogo || company?.logo || undefined;

  // 3. LOGO UPLOAD LOGIC
  const handleLogoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!companySlug) {
      toast.error('Unable to upload logo. Missing company slug.');
      return;
    }

    // Snapshot before clearing input — FileList is live and empties when value is reset
    const previewUrl = URL.createObjectURL(file);
    setTempLogo(previewUrl);
    e.target.value = '';

    const uploadData = new FormData();
    uploadData.append('file', file, file.name);
    const toastId = toast.loading('Uploading logo...');
    try {
      await apiClient.post(`/auth/company/${companySlug}/logo`, uploadData);
      await queryClient.invalidateQueries({ queryKey: ['company-profile'] });
      toast.success('Identity Logo Updated', { id: toastId });
    } catch {
      toast.dismiss(toastId);
      setTempLogo(null);
    }
  };

  // 4. UPDATED GALLERY UPLOAD LOGIC (Prevents disappearing)
  const handleGalleryChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    // Snapshot before clearing input — FileList is live and empties when value is reset
    const selectedFiles = Array.from(e.target.files ?? []);
    if (selectedFiles.length === 0) return;
    if (!companySlug) {
      toast.error('Unable to upload gallery. Missing company slug.');
      return;
    }

    const localUrls = selectedFiles.map((f) => URL.createObjectURL(f));
    setTempGallery((prev) => [...prev, ...localUrls]);
    e.target.value = '';

    const uploadData = new FormData();
    selectedFiles.forEach((f) => uploadData.append('files', f, f.name));

    const toastId = toast.loading('Uploading portfolio...');
    try {
      await apiClient.post(`/auth/company/${companySlug}/gallery`, uploadData);
      await queryClient.invalidateQueries({ queryKey: ['company-profile'] });
      setTempGallery([]);
      toast.success('Portfolio Updated', { id: toastId });
    } catch {
      toast.dismiss(toastId);
      setTempGallery([]);
    }
  };

  // 5. DELETE GALLERY ITEM
  const deleteImage = async (imageUrl: string) => {
    if (!companySlug) {
      toast.error('Unable to remove image. Missing company slug.');
      return;
    }

    const tId = toast.loading('Removing image...');
    try {
      await apiClient.delete(`/auth/company/${companySlug}/gallery`, { data: { imageUrl } });
      await queryClient.invalidateQueries({ queryKey: ['company-profile'] });
      toast.success('Image Removed', { id: tId });
    } catch (err: unknown) {
      toast.error(getApiErrorMessage(err, 'Delete failed'), { id: tId });
    }
  };

  // 6. TEXT DATA MUTATION
  const updateMutation = useMutation({
    mutationFn: (data: Record<string, string>) => {
      if (!companySlug) {
        return Promise.reject(new Error('Missing company slug'));
      }
      return apiClient.put(`/auth/company/${companySlug}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['company-profile'] });
      toast.success('Business Profile Updated');
    },
    onError: (error: unknown) => {
      const message = error instanceof Error ? error.message : 'Update failed';
      toast.error(message);
    }
  });

  const isUpdating = updateMutation.status === 'pending';

  if (isLoading) return <div className="h-screen flex items-center justify-center bg-white"><Loader2 className="animate-spin text-blue-600" size={40} /></div>;

  return (
    <DashboardShell>
      <div className="max-w-6xl mx-auto pb-40">
        
        {/* MAIN PROFILE CARD */}
        <div className="bg-white rounded-[3.5rem] shadow-premium border border-slate-50 overflow-hidden mb-12">
          <div className="h-48 bg-[#001529] relative overflow-hidden">
             <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-transparent" />
          </div>

          <div className="px-12 pb-12">
            <div className="relative -top-20 flex flex-col md:flex-row items-end gap-8 mb-6">
              <div className="w-44 h-44 bg-white rounded-[3rem] shadow-2xl border-8 border-white overflow-hidden relative flex items-center justify-center group shrink-0">
                {logoPreview ? (
                   <img src={logoPreview} className="w-full h-full object-cover" alt="Logo Preview" />
                ) : (
                   <span className="text-6xl font-black text-[#001529] italic">{company?.name?.charAt(0)}</span>
                )}
                
                <div 
                  onClick={() => logoInputRef.current?.click()}
                  className="absolute inset-0 bg-[#001529]/70 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all cursor-pointer backdrop-blur-sm"
                >
                  <Camera className="text-white mb-2" size={32} />
                  <span className="text-[10px] text-white font-black uppercase tracking-widest text-center px-4">Update Identity Logo</span>
                </div>
                <input type="file" ref={logoInputRef} className="hidden" onChange={handleLogoChange} accept="image/*" />
              </div>

              <div className="pb-10">
                <div className="flex items-center gap-3 mb-2">
                   <h2 className="text-3xl font-black text-[#001529] tracking-tight">{company?.name}</h2>
                   {company?.status === 'verified' && <CheckCircle2 size={24} className="text-blue-600" />}
                </div>
                <p className="text-sm text-slate-400 font-bold uppercase tracking-widest flex items-center gap-2">
                   <MapPin size={14} className="text-blue-600" /> {effectiveFormData.city || 'City'}, {effectiveFormData.country || 'Country'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2 block">Business Website</label>
                  <input value={effectiveFormData.website} onChange={(e) => setFormData({...formData, website: e.target.value})} className="w-full p-5 bg-slate-50 border-none rounded-2xl text-sm font-bold text-[#001529] outline-none focus:ring-2 ring-blue-600/20 transition-all" placeholder="www.yourcompany.com" />
               </div>
               <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2 block">Verified Phone</label>
                  <input value={effectiveFormData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="w-full p-5 bg-slate-50 border-none rounded-2xl text-sm font-bold text-[#001529] outline-none focus:ring-2 ring-blue-600/20 transition-all" placeholder="+237 600..." />
               </div>
               <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2 block">City</label>
                    <input value={effectiveFormData.city} onChange={(e) => setFormData({...formData, city: e.target.value})} className="w-full p-5 bg-slate-50 border-none rounded-2xl text-sm font-bold text-[#001529]" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2 block">Country</label>
                    <input value={effectiveFormData.country} onChange={(e) => setFormData({...formData, country: e.target.value})} className="w-full p-5 bg-slate-50 border-none rounded-2xl text-sm font-bold text-[#001529]" />
                  </div>
               </div>
               <button
                 onClick={() => updateMutation.mutate(effectiveFormData)}
                 disabled={!companySlug || isUpdating}
                 className={`bg-[#001529] text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl flex items-center justify-center gap-3 h-[60px] self-end transition-all ${(!companySlug || isUpdating) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'}`}
               >
                 <Save size={18} /> Confirm Identity Update
               </button>
            </div>
          </div>
        </div>

        {/* --- DYNAMIC PROJECT GALLERY --- */}
        <div className="mt-12 bg-white rounded-[3.5rem] p-12 border border-slate-50 shadow-premium">
           <div className="flex justify-between items-center mb-10 px-2">
              <div>
                 <h3 className="text-2xl font-black text-[#001529]">Project Showcase</h3>
                 <p className="text-xs text-slate-400 font-medium">Visual evidence of your completed construction works.</p>
              </div>
              <button 
                onClick={() => galleryInputRef.current?.click()}
                className="bg-blue-600 text-white px-8 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-700 transition-all flex items-center gap-2 shadow-lg shadow-blue-900/20"
              >
                 <Plus size={16} /> Add Work
              </button>
              <input type="file" multiple ref={galleryInputRef} className="hidden" onChange={handleGalleryChange} accept="image/*" />
           </div>

           <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <AnimatePresence mode="popLayout">
                {/* 1. REAL DATABASE IMAGES */}
                {company?.portfolio?.map((url: string) => (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.8 }} 
                        animate={{ opacity: 1, scale: 1 }} 
                        exit={{ opacity: 0, scale: 0.8 }}
                        key={url} 
                        className="aspect-square rounded-[2.5rem] overflow-hidden shadow-sm relative group bg-slate-100 border border-slate-100"
                    >
                        <img 
                          src={url} 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                          alt="Portfolio Work" 
                        />
                        <div 
                          onClick={() => deleteImage(url)}
                          className="absolute inset-0 bg-rose-600/80 opacity-0 group-hover:opacity-100 transition-all flex flex-col items-center justify-center cursor-pointer backdrop-blur-sm"
                        >
                            <Trash2 className="text-white" size={28} />
                            <span className="text-[10px] text-white font-black mt-2 uppercase tracking-widest">Remove</span>
                        </div>
                    </motion.div>
                ))}

                {/* 2. LOADING PREVIEWS - Only shows while tempGallery has items */}
                {tempGallery.map((url, i) => (
                    <div key={`temp-${i}`} className="aspect-square rounded-[2.5rem] overflow-hidden relative border-4 border-blue-600/20 bg-slate-50">
                        <img src={url} className="w-full h-full object-cover opacity-40 blur-[1px]" alt="Uploading..." />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <Loader2 className="animate-spin text-blue-600" size={32} />
                        </div>
                    </div>
                ))}
              </AnimatePresence>

              {/* 3. UPLOAD TRIGGER BOX */}
              <div 
                onClick={() => galleryInputRef.current?.click()}
                className="aspect-square rounded-[2.5rem] border-4 border-dashed border-slate-100 flex flex-col items-center justify-center text-slate-200 cursor-pointer hover:border-blue-100 hover:text-blue-600 transition-all hover:bg-slate-50/50"
              >
                 <Plus size={40} className="mb-2" />
                 <span className="text-[9px] font-black uppercase tracking-widest">Select Files</span>
              </div>
           </div>
        </div>
      </div>
    </DashboardShell>
  );
};

export default BusinessSettings;