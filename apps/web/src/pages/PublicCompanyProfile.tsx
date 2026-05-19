import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { PublicNavbar } from '../components/layout/PublicNavbar';
import apiClient from '../api/client';
import { 
  ShieldCheck, 
  MapPin, 
  Star, 
  Phone, 
  Mail, 
  Globe, 
  CheckCircle2, 
  Loader2, 
  ArrowLeft,
  MessageSquare,
  Award,
  Image as ImageIcon
} from 'lucide-react';
import { motion } from 'framer-motion';

const PublicCompanyProfile = () => {
  const { id: slug } = useParams(); // URL parameter is now the Slug
  const navigate = useNavigate();

  // 1. FETCH DATA BY SLUG
  const { data: company, isLoading, isError } = useQuery({
    queryKey: ['public-company', slug],
    queryFn: async () => {
      const { data } = await apiClient.get(`/explore/company/${slug}`);
      return data;
    },
    enabled: !!slug
  });

  // --- WHATSAPP CHAT HANDLER ---
  const handleWhatsAppChat = () => {
    if (!company?.phone) {
      alert("This company hasn't provided a contact number yet.");
      return;
    }
    // Clean the phone number to only digits
    const cleanNumber = company.phone.replace(/[^0-9]/g, '');
    const message = encodeURIComponent(
      `Hello ${company.name}, I found your professional profile on BuildHub Africa and I am interested in hiring your services for a project.`
    );
    window.open(`https://wa.me/${cleanNumber}?text=${message}`, '_blank');
  };

  // 2. LOADING STATE
  if (isLoading) return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="animate-spin text-blue-600 mb-4 mx-auto" size={40} />
        <p className="font-black text-slate-400 uppercase tracking-widest text-[10px]">Opening Business Portfolio...</p>
      </div>
    </div>
  );

  // 3. ERROR STATE
  if (isError || !company) return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
       <h2 className="text-3xl font-black text-[#001529]">Company Identity Not Found</h2>
       <p className="text-slate-500 mt-2 mb-8 max-w-sm">The firm you are looking for hasn't registered a public profile or the link has expired.</p>
       <button onClick={() => navigate('/directory')} className="bg-[#001529] text-white px-8 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-xl shadow-blue-900/20">
          <ArrowLeft size={18} /> Back to Directory
       </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-white font-inter">
      <PublicNavbar />
      
      {/* 4. COVER & BRANDING SECTION */}
      <header className="relative pt-20">
        <div className="h-[450px] bg-[#001529] overflow-hidden relative">
          <img 
            src={company.coverImage || "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&q=80"} 
            className="w-full h-full object-cover opacity-40 grayscale hover:grayscale-0 transition-all duration-1000" 
            alt="Work Context" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
        </div>
        
        <div className="max-w-7xl mx-auto px-6 relative -mt-32 pb-12">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-[4rem] p-10 shadow-2xl border border-white flex flex-col md:flex-row items-end gap-10"
          >
            {/* DYNAMIC LOGO */}
            <div className="w-48 h-48 bg-white rounded-[3.5rem] shadow-2xl border-8 border-white overflow-hidden flex items-center justify-center shrink-0 relative z-10">
               {company.logo ? (
                 <img src={company.logo} className="w-full h-full object-cover" alt={company.name} />
               ) : (
                 <span className="text-7xl font-black text-[#001529] italic">{company.name.charAt(0)}</span>
               )}
            </div>

            <div className="flex-1 pb-4">
              <div className="flex items-center gap-4 mb-4">
                <h1 className="text-4xl md:text-5xl font-black text-[#001529] tracking-tighter">{company.name}</h1>
                {company.status === 'verified' && <ShieldCheck className="text-blue-600 shadow-sm" size={36} />}
              </div>
              
              <div className="flex flex-wrap items-center gap-8 text-slate-400 font-black uppercase text-[10px] tracking-[0.2em]">
                <div className="flex items-center gap-2"><MapPin size={16} className="text-blue-600" /> {company.city}, {company.country}</div>
                <div className="flex items-center gap-2 text-amber-500"><Star size={16} fill="currentColor" /> {company.rating || '5.0'} Global Rating</div>
                <div className="flex items-center gap-2 text-emerald-500"><CheckCircle2 size={16} /> Verified Entity</div>
              </div>
            </div>

            <div className="pb-4 w-full md:w-auto">
              <button 
                onClick={handleWhatsAppChat}
                className="w-full md:w-auto bg-blue-600 text-white px-12 py-5 rounded-[2rem] font-black text-xs uppercase tracking-widest shadow-2xl shadow-blue-900/30 hover:bg-blue-700 hover:scale-[1.02] transition-all"
              >
                Hire This Company
              </button>
            </div>
          </motion.div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-16 pb-40">
        
        {/* LEFT COLUMN: ABOUT & PORTFOLIO */}
        <div className="lg:col-span-2 space-y-20">
          <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
            <h2 className="text-xs font-black text-blue-600 uppercase tracking-[0.4em] mb-6">Corporate Profile</h2>
            <p className="text-slate-600 leading-relaxed text-2xl font-medium tracking-tight">
              {company.description || "The company hasn't provided an official description yet."}
            </p>
          </motion.section>

          {/* 5. DYNAMIC PORTFOLIO GALLERY */}
          <section>
            <div className="flex items-center gap-4 mb-12">
                <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-[#001529] border border-slate-100">
                    <ImageIcon size={20} />
                </div>
                <h2 className="text-3xl font-black text-[#001529] tracking-tight">Project Showcase</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {company.portfolio?.length > 0 ? company.portfolio.map((url: string, index: number) => (
                <motion.div 
                    whileHover={{ y: -5 }}
                    key={index} 
                    className="aspect-video rounded-[3rem] overflow-hidden shadow-lg border border-slate-100 bg-slate-50 group cursor-zoom-in"
                >
                  <img src={url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={`Project ${index + 1}`} />
                </motion.div>
              )) : (
                  <div className="col-span-2 py-20 text-center border-4 border-dashed border-slate-50 rounded-[4rem]">
                    <p className="text-slate-300 font-black uppercase text-xs tracking-widest italic">No Portfolio Images Uploaded</p>
                  </div>
              )}
            </div>
          </section>
        </div>

        {/* RIGHT COLUMN: CONTACT SIDEBAR */}
        <aside>
           <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="sticky top-28 bg-[#F8FAFC] p-12 rounded-[4rem] border border-slate-100 space-y-10 shadow-sm"
           >
              <h3 className="font-black text-[#001529] uppercase tracking-[0.3em] text-[10px] px-2">Official Channels</h3>
              
              <div className="space-y-8">
                <div className="flex items-center gap-6 text-[#001529] group">
                  <div className="w-14 h-14 bg-white rounded-[1.5rem] flex items-center justify-center text-blue-600 shadow-sm group-hover:shadow-md transition-all"><Phone size={24} /></div>
                  <div>
                    <p className="text-[9px] font-black text-slate-400 uppercase mb-0.5">Primary Line</p>
                    <span className="font-black text-sm tracking-tight">{company.phone || "Request via Email"}</span>
                  </div>
                </div>
                <div className="flex items-center gap-6 text-[#001529] group">
                  <div className="w-14 h-14 bg-white rounded-[1.5rem] flex items-center justify-center text-blue-600 shadow-sm group-hover:shadow-md transition-all"><Mail size={24} /></div>
                  <div>
                    <p className="text-[9px] font-black text-slate-400 uppercase mb-0.5">Corporate Mail</p>
                    <span className="font-black text-sm tracking-tight truncate block w-40">{company.email}</span>
                  </div>
                </div>
                <div className="flex items-center gap-6 text-[#001529] group cursor-pointer">
                  <div className="w-14 h-14 bg-white rounded-[1.5rem] flex items-center justify-center text-blue-600 shadow-sm group-hover:shadow-md transition-all"><Globe size={24} /></div>
                  <div>
                    <p className="text-[9px] font-black text-slate-400 uppercase mb-0.5">Cloud Identity</p>
                    <span className="font-black text-sm tracking-tight underline decoration-blue-100">{company.website || "No Website Linked"}</span>
                  </div>
                </div>
              </div>

              <div className="pt-10 border-t border-slate-200">
                 <button 
                   onClick={handleWhatsAppChat}
                   className="w-full py-5 bg-white border-2 border-[#001529] text-[#001529] rounded-[2rem] font-black text-xs uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center justify-center gap-3 shadow-sm active:scale-95"
                 >
                    <MessageSquare size={20} /> Open Direct Chat
                 </button>
                 <div className="mt-8 flex flex-col items-center gap-2">
                    <div className="flex items-center gap-1.5 text-blue-600">
                        <Award size={14} />
                        <p className="text-[10px] font-black uppercase tracking-widest">BuildHub Master Partner</p>
                    </div>
                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest italic opacity-50">
                        Member Registered {new Date(company.createdAt).getFullYear()}
                    </p>
                 </div>
              </div>
           </motion.div>
        </aside>

      </main>
    </div>
  );
};

export default PublicCompanyProfile;