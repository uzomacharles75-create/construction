
import { DashboardShell } from '../components/layout/DashboardShell';
import { 
  Briefcase, 
  MapPin, 
  Clock, 
  DollarSign, 
  ArrowUpRight,
  Filter,
  BadgeCheck
} from 'lucide-react';
import { motion } from 'framer-motion';

const TenderCard = ({ title,  location, budget, deadline, category, priority = false }: any) => (
  <motion.div 
    whileHover={{ x: 10 }}
    className={`bg-white p-6 rounded-[2.5rem] border ${priority ? 'border-brand-blue/30 shadow-blue-50' : 'border-slate-100'} shadow-premium flex flex-col md:flex-row items-center gap-6 group cursor-pointer transition-all`}
  >
    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 ${priority ? 'bg-brand-blue text-white' : 'bg-slate-50 text-slate-400'}`}>
      <Briefcase size={28} />
    </div>

    <div className="flex-1">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-[10px] font-black uppercase tracking-widest text-brand-blue bg-blue-50 px-2 py-0.5 rounded-md">{category}</span>
        {priority && <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-md">Urgent</span>}
      </div>
      <h3 className="text-xl font-bold text-brand-navy group-hover:text-brand-blue transition-colors">{title}</h3>
      <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-slate-400 font-medium">
        <div className="flex items-center gap-1">
          <MapPin size={14} />
          <span>{location}</span>
        </div>
        <div className="flex items-center gap-1 text-slate-500">
          <Clock size={14} />
          <span>Closes: {deadline}</span>
        </div>
      </div>
    </div>

    <div className="text-right flex flex-col items-end gap-2 w-full md:w-auto border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-8">
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Est. Budget</p>
      <p className="text-2xl font-black text-brand-navy">${budget.toLocaleString()}</p>
      <button className="flex items-center gap-2 text-brand-blue font-bold text-sm hover:underline">
        Bid on project <ArrowUpRight size={16} />
      </button>
    </div>
  </motion.div>
);

const TenderBoard = () => {
  const tenders = [
    { title: "Commercial Office Waterproofing", client: "EcoBank Plaza", location: "Victoria Island, NG", budget: 45000, deadline: "Oct 24", category: "Maintenance", priority: true },
    { title: "Luxury 5-Bedroom Villa (Full Build)", client: "Private Client", location: "Bastos, Yaoundé", budget: 280000, deadline: "Nov 12", category: "Civil Works" },
    { title: "Solar Grid Installation (150kW)", client: "Industrial Park", location: "Douala, CM", budget: 125000, deadline: "Oct 30", category: "Electrical" },
    { title: "Highway Drainage Expansion", client: "Min. of Works", location: "Accra, GH", budget: 1500000, deadline: "Dec 05", category: "Infrastructure" },
  ];

  return (
    <DashboardShell>
      <div className="max-w-6xl mx-auto">
        {/* HEADER SECTION */}
        <header className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <h1 className="text-4xl font-black text-brand-navy tracking-tight">Tenders & Jobs</h1>
            <p className="text-slate-500 font-medium mt-1">High-value opportunities updated in real-time.</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="bg-white px-5 py-3 rounded-2xl border border-slate-200 text-brand-navy font-bold flex items-center gap-2 hover:bg-slate-50 transition-all shadow-sm">
              <Filter size={18} />
              Filter
            </button>
            <button className="bg-brand-blue text-white px-8 py-3 rounded-2xl font-bold shadow-xl shadow-blue-200 hover:scale-105 transition-transform">
              Post a Tender
            </button>
          </div>
        </header>

        {/* STATS STRIP */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 flex items-center gap-4 shadow-premium">
             <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-brand-blue">
               <DollarSign size={24} />
             </div>
             <div>
               <p className="text-2xl font-black text-brand-navy">$2.4M</p>
               <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Live Volume</p>
             </div>
          </div>
          <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 flex items-center gap-4 shadow-premium">
             <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-500">
               <Briefcase size={24} />
             </div>
             <div>
               <p className="text-2xl font-black text-brand-navy">158</p>
               <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Active Jobs</p>
             </div>
          </div>
          <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 flex items-center gap-4 shadow-premium">
             <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-500">
               <BadgeCheck size={24} />
             </div>
             <div>
               <p className="text-2xl font-black text-brand-navy">12</p>
               <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Matches for you</p>
             </div>
          </div>
        </section>

        {/* THE TENDERS LIST */}
        <div className="space-y-4">
          {tenders.map((tender, index) => (
            <TenderCard key={index} {...tender} />
          ))}
        </div>

        <div className="mt-12 text-center">
          <button className="text-slate-400 font-bold hover:text-brand-navy transition-colors flex items-center gap-2 mx-auto text-sm">
            See more opportunities
            <Clock size={16} />
          </button>
        </div>
      </div>
    </DashboardShell>
  );
};

export default TenderBoard;