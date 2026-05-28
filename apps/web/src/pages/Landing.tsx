import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, ShieldCheck, Zap, Globe, BarChart3, CheckCircle2, PlayCircle } from 'lucide-react';
import { PublicNavbar } from '../components/layout/PublicNavbar';
import { PublicFooter } from '../components/layout/PublicFooter';

const FeatureCard = ({ icon: Icon, title, desc }: any) => (
  <motion.div
    whileHover={{ y: -6 }}
    className="p-8 bg-card rounded-[2.5rem] border border-border hover:border-primary/30 hover:shadow-yellow transition-all duration-500 group"
  >
    <div className="w-14 h-14 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-brand-navy transition-all">
      <Icon size={26} />
    </div>
    <h3 className="text-xl font-black text-foreground mb-3 tracking-tight">{title}</h3>
    <p className="text-muted-foreground leading-relaxed font-medium text-sm">{desc}</p>
  </motion.div>
);

const Landing = () => (
  <div className="min-h-screen bg-background overflow-hidden">
    <PublicNavbar />

    {/* HERO */}
    <section className="pt-36 sm:pt-48 pb-24 px-6 text-center relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-primary/5 blur-[120px] rounded-full -z-10" />
      <motion.div initial={{ opacity:0, y:30 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.8 }} className="max-w-4xl mx-auto">
        <span className="px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-8 inline-block">
          The Industry Standard for Construction
        </span>
        <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black text-foreground tracking-tighter mb-6 leading-[0.9]">
          The Operating System<br/>for <span className="text-primary">Build.</span>
        </h1>
        <p className="text-lg sm:text-xl text-muted-foreground mb-12 max-w-2xl mx-auto font-medium leading-relaxed">
          From BOQs and Invoices to Marketplace sourcing. Run your entire construction office from one elegant workspace.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/register" className="bg-primary text-brand-navy px-10 py-5 rounded-2xl font-black text-base shadow-yellow hover:bg-primary-dim hover:scale-[1.02] transition-all flex items-center gap-3">
            Start Building Free <ArrowRight size={20} />
          </Link>
          <button className="flex items-center gap-3 px-10 py-5 text-foreground/60 font-bold hover:text-foreground hover:bg-white/5 rounded-2xl transition-all">
            <PlayCircle size={22} className="text-primary" /> Watch the Film
          </button>
        </div>
      </motion.div>
    </section>

    {/* FEATURES */}
    <section className="py-24 px-6 max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-4xl sm:text-5xl font-black text-foreground tracking-tight mb-4">Built for every phase.</h2>
        <p className="text-foreground/40 text-lg font-medium">Everything you need to scale your construction business.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <FeatureCard icon={Zap} title="BOQ Engine" desc="Generate precise Bill of Quantities with AI assistance and marketplace-live pricing data." />
        <FeatureCard icon={ShieldCheck} title="Secure Payments" desc="Escrow-style financial protection. Invoices are only settled when work is verified." />
        <FeatureCard icon={Globe} title="Public Directory" desc="Get found by clients across Africa. Your professional profile is your new digital storefront." />
      </div>
    </section>

    {/* STATS */}
    <section className="py-24 px-6 mx-6 mb-10 rounded-[3rem] bg-card border border-border relative overflow-hidden">
      <div className="absolute right-0 top-0 opacity-5 pointer-events-none"><BarChart3 size={400} /></div>
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        <div>
          <h2 className="text-4xl sm:text-5xl font-black text-foreground mb-8 leading-tight">Empowering Africa's<br/>Infrastructure.</h2>
          <div className="space-y-5">
            {["10k+ Registered Contractors","2M+ Materials Listed in Marketplace","340+ Successful Tenders Awarded"].map(item => (
              <div key={item} className="flex items-center gap-4">
                <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center shrink-0">
                  <CheckCircle2 size={14} className="text-brand-navy" />
                </div>
                <span className="text-foreground/70 font-semibold">{item}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-primary/5 border border-primary/20 p-10 rounded-[2.5rem]">
          <h3 className="text-2xl font-black text-foreground mb-4 italic leading-snug">"BuildHub saved us 30% on material costs during our last residential project."</h3>
          <p className="text-primary font-black uppercase tracking-widest text-xs">— Vertex Builders Ltd</p>
        </div>
      </div>
    </section>

    {/* CTA */}
    <section className="py-32 text-center px-6">
      <h2 className="text-5xl sm:text-6xl font-black text-foreground tracking-tighter mb-10">Ready to modernize?</h2>
      <Link to="/register" className="inline-block bg-primary text-brand-navy px-14 py-6 rounded-3xl font-black text-xl shadow-yellow hover:scale-105 transition-transform">
        Create your office now
      </Link>
    </section>

    <PublicFooter />
  </div>
);

export default Landing;
