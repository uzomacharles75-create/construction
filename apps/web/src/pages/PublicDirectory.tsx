import { PublicNavbar } from '../components/layout/PublicNavbar';
import { ShieldCheck, MapPin, Star, Search, Filter } from 'lucide-react';
import { motion } from 'framer-motion';

const PublicDirectory = () => {
  return (
    <div className="min-h-screen bg-white">
      <PublicNavbar />
      
      {/* 1. HERO SEARCH SECTION */}
      <section className="pt-40 pb-20 px-6 bg-slate-50">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-6xl font-black text-[#001529] tracking-tighter mb-6">Find Verified Experts.</h1>
          <p className="text-lg text-slate-500 mb-10">Search through thousands of construction companies across the continent.</p>
          
          <div className="bg-white p-2 rounded-[2.5rem] shadow-2xl flex flex-col md:flex-row items-center gap-2 border border-slate-100 max-w-3xl mx-auto">
            <div className="flex-1 flex items-center gap-3 px-6 py-4">
              <Search className="text-slate-300" size={20} />
              <input type="text" placeholder="Service (e.g. Roofing)" className="w-full outline-none font-medium" />
            </div>
            <div className="w-px h-10 bg-slate-100 hidden md:block" />
            <div className="flex-1 flex items-center gap-3 px-6 py-4">
              <MapPin className="text-slate-300" size={20} />
              <input type="text" placeholder="City" className="w-full outline-none font-medium" />
            </div>
            <button className="bg-blue-600 text-white px-10 py-4 rounded-[2rem] font-black text-sm hover:bg-blue-700 transition-all w-full md:w-auto">
              Search
            </button>
          </div>
        </div>
      </section>

      {/* 2. DIRECTORY RESULTS */}
      <main className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
           {[
             { n: "Vertex Builders", r: 4.9, l: "Douala, CM", s: ["Roofing", "Foundations"], logo: "VB" },
             { n: "EcoDesign Ltd", r: 4.8, l: "Lagos, NG", s: ["Architecture", "Planning"], logo: "ED" },
           ].map((c, i) => (
             <motion.div whileHover={{ y: -5 }} key={i} className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-premium flex gap-8">
                <div className="w-32 h-32 bg-[#001529] rounded-[2.5rem] flex items-center justify-center text-white font-black text-4xl shrink-0 italic">
                   {c.logo}
                </div>
                <div className="flex-1">
                   <div className="flex items-center gap-2 mb-2">
                      <h2 className="text-2xl font-black text-slate-800">{c.n}</h2>
                      <ShieldCheck className="text-blue-600" />
                   </div>
                   <div className="flex gap-4 text-xs font-bold text-slate-400 uppercase mb-6">
                      <span className="flex items-center gap-1"><MapPin size={14}/> {c.l}</span>
                      <span className="flex items-center gap-1 text-amber-500"><Star size={14} fill="currentColor"/> {c.r}</span>
                   </div>
                   <div className="flex gap-2 mb-8">
                      {c.s.map(skill => (
                        <span key={skill} className="px-3 py-1 bg-slate-50 text-slate-500 rounded-lg text-[10px] font-black uppercase">{skill}</span>
                      ))}
                   </div>
                   <button className="w-full py-4 bg-[#001529] text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-600 transition-all">
                      View Company Profile
                   </button>
                </div>
             </motion.div>
           ))}
        </div>
      </main>
    </div>
  );
};

export default PublicDirectory;