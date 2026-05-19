import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { DashboardShell } from '../components/layout/DashboardShell';
import apiClient from '../api/client';
import { 
  Briefcase, 
  MapPin, 
  Clock, 
  DollarSign, 
  ArrowUpRight,
  Filter,
  BadgeCheck,
  Loader2,
  Inbox,
  Eye
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- SUB-COMPONENT: TENDER CARD ---
const TenderCard = ({ tender }: any) => {
  // Logic to determine if deadline is within 7 days
  const isUrgent = new Date(tender.deadline).getTime() - new Date().getTime() < 604800000;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ x: 10 }}
      className={`bg-white p-6 rounded-[2.5rem] border ${isUrgent ? 'border-amber-200 shadow-amber-50' : 'border-slate-50'} shadow-premium flex flex-col md:flex-row items-center gap-6 group cursor-pointer transition-all`}
    >
      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 ${isUrgent ? 'bg-amber-50 text-amber-600' : 'bg-blue-50 text-blue-600'}`}>
        <Briefcase size={28} />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[9px] font-black uppercase tracking-widest text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
            {tender.category || 'General Construction'}
          </span>
          {isUrgent && (
            <span className="text-[9px] font-black uppercase tracking-widest text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md">
              Closing Soon
            </span>
          )}
        </div>
        <h3 className="text-xl font-black text-[#001529] group-hover:text-blue-600 transition-colors truncate">
            {tender.title}
        </h3>
        <div className="flex flex-wrap items-center gap-4 mt-3 text-[11px] text-slate-400 font-bold uppercase tracking-tight">
          <div className="flex items-center gap-1">
            <MapPin size={14} className="text-blue-600" />
            <span>{tender.location}</span>
          </div>
          <div className="flex items-center gap-1 text-slate-500">
            <Clock size={14} className="text-blue-600" />
            <span>Deadline: {new Date(tender.deadline).toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      <div className="text-right flex flex-col items-end gap-2 w-full md:w-auto border-t md:border-t-0 md:border-l border-slate-50 pt-4 md:pt-0 md:pl-8">
        <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Est. Project Budget</p>
        <p className="text-2xl font-black text-[#001529] tracking-tighter italic">
            ${tender.budget?.toLocaleString()}
        </p>
        
        {/* UPDATED ACTION: Go to Details first */}
        <Link 
          to={`/dashboard/tenders/${tender.slug}`} 
          className="flex items-center gap-2 text-blue-600 font-black text-[10px] uppercase tracking-widest hover:underline group-hover:pr-2 transition-all"
        >
          <Eye size={14} />
          View Project Details <ArrowUpRight size={14} />
        </Link>
      </div>
    </motion.div>
  );
};

const TenderBoard = () => {
  // 1. FETCH REAL TENDERS FROM MONGODB
  const { data: tenders, isLoading } = useQuery({
    queryKey: ['tenders-list'],
    queryFn: async () => {
      const { data } = await apiClient.get('/tenders');
      return data;
    }
  });

  // 2. DYNAMIC STATS CALCULATION
  const totalVolume = tenders?.reduce((acc: number, curr: any) => acc + (curr.budget || 0), 0) || 0;
  const openCount = tenders?.length || 0;

  return (
    <DashboardShell>
      <div className="max-w-6xl mx-auto pb-20">
        
        {/* HEADER SECTION */}
        <header className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6 px-2">
          <div>
            <h1 className="text-4xl font-black text-[#001529] tracking-tight italic">Tenders & Jobs</h1>
            <p className="text-sm text-slate-400 font-medium mt-1">High-value opportunities updated across the network in real-time.</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="bg-white px-5 py-3 rounded-2xl border border-slate-100 text-slate-400 font-black text-[10px] uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm">
              <Filter size={18} className="inline mr-2" /> Filter
            </button>
         {/*  <Link 
              to="/dashboard/tenders/create"
              className="bg-blue-600 text-white px-8 py-3.5 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-blue-900/20 hover:bg-blue-700 hover:scale-105 transition-all"
            >
              Post a Tender
            </Link>*/}
          </div>
        </header>

        {/* ANALYTICS STRIP (DATA DRIVEN) */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-[#001529] p-8 rounded-[3rem] text-white shadow-2xl relative overflow-hidden">
             <div className="absolute top-[-10px] right-[-10px] opacity-10"><DollarSign size={80} /></div>
             <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Live Market Volume</p>
             <h3 className="text-3xl font-black italic tracking-tighter">
                {isLoading ? "..." : `$${(totalVolume / 1000000).toFixed(1)}M`}
             </h3>
          </div>
          <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm flex items-center justify-between">
             <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Open Opportunities</p>
                <h3 className="text-3xl font-black text-[#001529]">{isLoading ? "---" : openCount}</h3>
             </div>
             <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 shadow-sm"><Briefcase size={24} /></div>
          </div>
          <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm flex items-center justify-between">
             <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Regional Matches</p>
                <h3 className="text-3xl font-black text-emerald-500">12</h3>
             </div>
             <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 shadow-sm"><BadgeCheck size={24} /></div>
          </div>
        </section>

        {/* TENDERS LIST (REAL DATA) */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="py-24 text-center">
              <Loader2 className="animate-spin text-blue-600 mx-auto mb-4" size={40} />
              <p className="font-black text-slate-300 uppercase tracking-widest text-xs">Scanning Construction Network...</p>
            </div>
          ) : openCount === 0 ? (
            <div className="bg-white p-24 rounded-[4rem] text-center border-2 border-dashed border-slate-100">
               <Inbox className="mx-auto text-slate-100 mb-4" size={64} />
               <h3 className="text-xl font-bold text-slate-400">No active tenders found</h3>
               <p className="text-sm text-slate-300 mt-1 font-medium">Check back soon or broaden your search criteria.</p>
            </div>
          ) : (
            <AnimatePresence>
              {tenders?.map((tender: any) => (
                <TenderCard key={tender.slug} tender={tender} />
              ))}
            </AnimatePresence>
          )}
        </div>

        {!isLoading && openCount > 0 && (
          <div className="mt-16 text-center">
            <button className="text-slate-400 font-black text-[10px] uppercase tracking-[0.4em] hover:text-blue-600 transition-all flex items-center gap-3 mx-auto">
              Syncing more opportunities <Clock size={16} />
            </button>
          </div>
        )}
      </div>
    </DashboardShell>
  );
};

export default TenderBoard;