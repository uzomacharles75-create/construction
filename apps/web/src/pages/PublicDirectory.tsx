import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { useDebounce } from '../hooks/useDebounce';
import { PublicNavbar } from '../components/layout/PublicNavbar';
import apiClient from '../api/client';
import { ShieldCheck, MapPin, Star, Search, Loader2, Inbox, UserCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { PublicFooter } from '../components/layout/PublicFooter';

const CompanyCard = ({ company }: { company: any }) => {
  const handleContact = () => {
    if (!company?.phone) return alert("Contact number not available.");
    const cleanNumber = company.phone.replace(/[^0-9]/g, '');
    window.open(`https://wa.me/${cleanNumber}`, '_blank');
  };

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -5 }}
      className="bg-white rounded-[2rem] overflow-hidden shadow-premium border border-slate-100 flex flex-col h-full"
    >
      <div className="h-56 relative overflow-hidden bg-[#001529] flex items-center justify-center">
        {company.logo ? (
          <img src={company.logo} className="w-full h-full object-cover transition-all duration-700 hover:scale-110" alt={company.name} />
        ) : (
          <span className="text-7xl font-black text-white italic opacity-20">{company.name.charAt(0)}</span>
        )}
        {company.status === 'verified' && (
          <div className="absolute bottom-4 left-4 bg-[#10B981] text-white px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg">
            <ShieldCheck size={14} fill="currentColor" />
            <span className="text-[10px] font-black uppercase tracking-wider">Verified</span>
          </div>
        )}
      </div>

      <div className="p-6 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-2xl font-black text-[#001529] tracking-tighter truncate capitalize">{company.name}</h3>
          <div className="bg-amber-50 text-amber-500 px-2 py-1 rounded-lg flex items-center gap-1">
             <Star size={12} fill="currentColor" />
             <span className="text-[10px] font-black">{company.rating || '5.0'}</span>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-slate-400 text-xs font-medium mb-6">
          <MapPin size={14} className="text-blue-600" />
          <span className="capitalize">{company.city}, {company.country}</span>
        </div>
        <div className="mt-auto pt-6 border-t border-slate-50 flex items-center justify-between gap-3">
          <button onClick={handleContact} className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl">
            Contact
          </button>
          <Link to={`/company/${company.slug}`} className="flex-1 bg-[#F8FAFC] text-[#001529] py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest border border-slate-100 flex items-center justify-center gap-2 hover:bg-[#001529] hover:text-white transition-all">
            <UserCircle size={16} /> View Profile
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

const PublicDirectory = () => {
  const [service, setService] = useState('');
  const [city, setCity] = useState('');

  const debouncedService = useDebounce(service, 400);
  const debouncedCity = useDebounce(city, 400);

  const { data: companies, isLoading, isFetching } = useQuery({
    queryKey: ['public-directory', debouncedService, debouncedCity],
    queryFn: async () => {
      const { data } = await apiClient.get('/explore/companies', { 
        params: { service: debouncedService, city: debouncedCity } 
      });
      return data;
    }
  });

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-inter">
      <PublicNavbar />
      
      {/* 1. BIDDING CTA (BROUGHT TO TOP, REDUCED BOTTOM MARGIN) */}
      <section className="pt-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-gradient-to-r from-[#001529] to-blue-900 rounded-[3rem] p-8 md:p-12 text-white shadow-2xl relative overflow-hidden">
            <div className="absolute right-[-50px] top-[-50px] w-80 h-80 bg-blue-500/10 blur-[100px] rounded-full" />
            
            <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
              <div className="max-w-2xl text-center lg:text-left">
                <span className="bg-blue-500/20 text-blue-300 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em]">
                  For Project Owners
                </span>
                <h2 className="text-3xl md:text-4xl font-black tracking-tighter mt-4 mb-3 leading-tight">
                  Have a project? Get <span className="text-blue-400 italic">Competitive Bids.</span>
                </h2>
                <p className="text-slate-400 font-medium text-base">
                  Broadcast your project to our verified network of builders instantly.
                </p>
              </div>

              <Link 
                to="/post-project" 
                className="bg-white text-[#001529] px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:bg-blue-50 hover:scale-105 transition-all shrink-0"
              >
                Request Bids Now
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. SEARCH SECTION (REDUCED TOP PADDING TO TIGHTEN SPACE) */}
      <section className="pt-12 pb-10 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-black text-[#001529] tracking-tighter mb-8 leading-[0.9]">
            Find Verified <span className="text-blue-600">Experts.</span>
          </h1>

          <div className="bg-white p-2 rounded-3xl md:rounded-[3rem] shadow-2xl flex flex-col md:flex-row items-center gap-2 border border-white max-w-4xl mx-auto relative">
            <div className="flex-1 flex items-center gap-3 px-6 py-4 w-full">
              <Search className={`${isFetching ? 'text-blue-600 animate-pulse' : 'text-slate-300'}`} size={22} />
              <input 
                type="text" 
                value={service} 
                onChange={(e) => setService(e.target.value)} 
                placeholder="Company Name or Service..." 
                className="w-full outline-none font-bold text-[#001529] text-sm bg-transparent placeholder:text-slate-300" 
              />
            </div>
            <div className="hidden md:block w-px h-10 bg-slate-100" />
            <div className="flex-1 flex items-center gap-3 px-6 py-4 w-full">
              <MapPin className="text-blue-600" size={22} />
              <input 
                type="text" 
                value={city} 
                onChange={(e) => setCity(e.target.value)} 
                placeholder="Filter by City..." 
                className="w-full outline-none font-bold text-[#001529] text-sm bg-transparent placeholder:text-slate-300" 
              />
            </div>
            {/* Visual Indicator for Live Search */}
            <div className="hidden md:flex px-8 text-[9px] font-black text-blue-600 uppercase tracking-widest">
               {isFetching ? <Loader2 className="animate-spin" size={14} /> : <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />}
               <span className="ml-2">{isFetching ? 'Searching' : 'Real-time'}</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. RESULTS GRID */}
      <main className="max-w-7xl mx-auto px-6 pb-32">
        <AnimatePresence mode="popLayout">
          {isLoading ? (
            <div className="py-20 text-center flex flex-col items-center">
              <Loader2 className="animate-spin text-blue-600 mb-4" size={40} />
              <p className="font-black text-slate-300 uppercase tracking-widest text-[10px]">Syncing Directory...</p>
            </div>
          ) : !companies || companies.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-24 bg-white rounded-[4rem] border border-slate-100 shadow-sm flex flex-col items-center">
               <Inbox className="text-slate-100 mb-4" size={80} />
               <p className="font-bold text-slate-400 uppercase tracking-widest text-[10px] italic">No experts found in this region.</p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                {companies.map((c: any) => (
                  <CompanyCard key={c._id} company={c} />
                ))}
            </div>
          )}
        </AnimatePresence>
      </main>
   <PublicFooter />
    </div>
  );
};

export default PublicDirectory;