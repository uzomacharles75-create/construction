
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowRight, 
  ShieldCheck, 
  Zap, 
  Globe, 
  BarChart3, 
  CheckCircle2,
  PlayCircle
} from 'lucide-react';
import { PublicNavbar } from '../components/layout/PublicNavbar';
import { PublicFooter } from '../components/layout/PublicFooter';

const FeatureCard = ({ icon: Icon, title, desc }: any) => (
  <motion.div 
    whileHover={{ y: -10 }}
    className="p-6 sm:p-10 bg-slate-50 rounded-2xl sm:rounded-[3rem] border border-slate-100 hover:bg-white hover:shadow-2xl transition-all duration-500"
  >
    <div className="w-14 h-14 bg-brand-blue/10 text-brand-blue rounded-2xl flex items-center justify-center mb-6">
      <Icon size={28} />
    </div>
    <h3 className="text-2xl font-black text-brand-navy mb-4 tracking-tight">{title}</h3>
    <p className="text-slate-500 leading-relaxed font-medium">{desc}</p>
  </motion.div>
);

const Landing = () => {
  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* GLASS NAVBAR */}
     <PublicNavbar />

      {/* HERO SECTION */}
      <section className="pt-28 sm:pt-40 md:pt-48 pb-16 sm:pb-32 px-4 sm:px-6 md:px-10 text-center relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-brand-blue/5 blur-[120px] rounded-full -z-10" />
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          <span className="px-4 py-2 bg-slate-100 rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-8 inline-block">
            The Industry Standard for Construction
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black text-brand-navy tracking-tighter mb-6 sm:mb-8 leading-[0.95] sm:leading-[0.9]">
            The Operating System for <span className="text-brand-blue">Build.</span>
          </h1>
          <p className="text-base sm:text-xl md:text-2xl text-slate-500 mb-8 sm:mb-12 max-w-2xl mx-auto font-medium leading-relaxed px-2">
            From BOQs and Invoices to Marketplace sourcing. Run your entire construction office from one elegant workspace.
          </p>
          <div className="flex flex-col md:flex-row items-center justify-center gap-6">
            <Link to="/register" className="bg-brand-navy text-white px-10 py-5 rounded-2xl font-black text-lg shadow-2xl hover:bg-slate-800 transition-all flex items-center gap-3">
              Start Building Free
              <ArrowRight size={20} />
            </Link>
            <button className="flex items-center gap-3 px-10 py-5 text-brand-navy font-bold text-lg hover:bg-slate-50 rounded-2xl transition-all">
              <PlayCircle size={24} className="text-brand-blue" />
              Watch the Film
            </button>
          </div>
        </motion.div>
      </section>

      {/* BENTO GRID FEATURES */}
      <section id="features" className="py-16 sm:py-32 px-4 sm:px-6 md:px-10 max-w-7xl mx-auto">
        <div className="text-center mb-12 sm:mb-24">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-brand-navy tracking-tight mb-4">Built for every phase.</h2>
          <p className="text-slate-500 text-lg font-medium">Everything you need to scale your construction business.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard 
            icon={Zap} 
            title="BOQ Engine" 
            desc="Generate precise Bill of Quantities with AI assistance and marketplace-live pricing data." 
          />
          <FeatureCard 
            icon={ShieldCheck} 
            title="Secure Payments" 
            desc="Escrow-style financial protection. Invoices are only settled when work is verified." 
          />
          <FeatureCard 
            icon={Globe} 
            title="Public Directory" 
            desc="Get found by clients across Africa. Your professional profile is your new digital storefront." 
          />
        </div>
      </section>

      {/* SOCIAL PROOF / STATS */}
      <section className="bg-brand-navy py-32 px-10 rounded-[4rem] mx-6 mb-10 text-white overflow-hidden relative">
        <div className="absolute right-0 top-0 opacity-10">
          <BarChart3 size={400} />
        </div>
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
          <div>
            <h2 className="text-5xl font-black mb-8 leading-tight">Empowering Africa's <br/> Infrastructure.</h2>
            <div className="space-y-6">
              {[
                "10k+ Registered Contractors",
                "2M+ Materials Listed in Marketplace",
                "340+ Successful Tenders Awarded"
              ].map(item => (
                <div key={item} className="flex items-center gap-4">
                  <div className="w-6 h-6 bg-brand-blue rounded-full flex items-center justify-center">
                    <CheckCircle2 size={14} />
                  </div>
                  <span className="text-lg font-bold text-slate-300">{item}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-2xl p-12 rounded-[3rem] border border-white/10">
            <h3 className="text-3xl font-black mb-6 italic">"BuildHub saved us 30% on material costs during our last residential project."</h3>
            <p className="text-brand-blue font-black uppercase tracking-widest text-sm">— Vertex Builders Ltd</p>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-40 text-center">
        <h2 className="text-6xl font-black text-brand-navy tracking-tighter mb-10">Ready to modernize?</h2>
        <Link to="/register" className="bg-brand-navy mt-10 text-white px-12 py-6 rounded-3xl font-black text-xl shadow-2xl hover:scale-105 transition-transform">
          Create your office now
        </Link>
      </section>
       <PublicFooter />
    </div>
  );
};

export default Landing;