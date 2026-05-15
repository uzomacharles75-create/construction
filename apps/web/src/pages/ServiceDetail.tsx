
import { PublicNavbar } from '../components/layout/PublicNavbar';
import { 
  CheckCircle2, 
  MapPin, 
  Star, 
  ShieldCheck, 
  Calendar, 
  MessageCircle, 
  Share2,
  ArrowLeft
} from 'lucide-react';
import { motion } from 'framer-motion';

const ServiceDetail = () => {
  return (
    <div className="min-h-screen bg-white">
      <PublicNavbar />

      <main className="pt-24 pb-20 px-6 max-w-7xl mx-auto">
        {/* BACK BUTTON */}
        <button className="flex items-center gap-2 text-slate-500 hover:text-brand-navy transition-colors mb-8 group">
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-semibold text-sm">Back to Directory</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* LEFT: CONTENT (2/3) */}
          <div className="lg:col-span-2">
            <motion.h1 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-4xl md:text-5xl font-bold text-brand-navy mb-4 tracking-tight"
            >
              Full Home Roofing & Waterproofing
            </motion.h1>
            
            <div className="flex flex-wrap items-center gap-6 mb-8 text-sm font-medium text-slate-500">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-brand-soft rounded-full flex items-center justify-center">
                  <MapPin size={14} className="text-brand-blue" />
                </div>
                <span>Douala, Cameroon</span>
              </div>
              <div className="flex items-center gap-2">
                <Star size={16} className="text-amber-500" fill="currentColor" />
                <span className="text-brand-navy">4.9 (124 Reviews)</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck size={16} className="text-emerald-500" />
                <span className="text-emerald-500">Verified Professional</span>
              </div>
            </div>

            {/* GALLERY GRID */}
            <div className="grid grid-cols-2 gap-4 mb-12 h-[400px]">
              <div className="bg-slate-200 rounded-[2rem] overflow-hidden shadow-lg">
                <img src="https://images.unsplash.com/photo-1632759145351-1d592919f522?auto=format&fit=crop&q=80" className="w-full h-full object-cover" alt="roofing" />
              </div>
              <div className="grid grid-rows-2 gap-4">
                <div className="bg-slate-200 rounded-[2rem] overflow-hidden shadow-lg">
                  <img src="https://images.unsplash.com/photo-1505577058444-a3dab90d4253?auto=format&fit=crop&q=80" className="w-full h-full object-cover" alt="roofing detail" />
                </div>
                <div className="bg-slate-200 rounded-[2rem] overflow-hidden relative shadow-lg">
                  <img src="https://images.unsplash.com/photo-1482731215275-a1f151646268?auto=format&fit=crop&q=80" className="w-full h-full object-cover opacity-50" alt="more" />
                  <div className="absolute inset-0 flex items-center justify-center font-bold text-brand-navy">+12 Photos</div>
                </div>
              </div>
            </div>

            {/* DESCRIPTION */}
            <section className="prose prose-slate max-w-none mb-12">
              <h3 className="text-2xl font-bold text-brand-navy mb-4">About this service</h3>
              <p className="text-slate-600 leading-relaxed text-lg">
                We provide premium roofing solutions using high-grade aluminum and 
                composite materials. Our team specializes in both residential and 
                industrial roofing with a 10-year waterproofing guarantee.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                {['Leak Detection', 'Thermal Insulation', 'Gutter Cleaning', 'Structural Repair'].map((item) => (
                  <div key={item} className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <CheckCircle2 size={20} className="text-brand-blue" />
                    <span className="font-semibold text-brand-navy">{item}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* RIGHT: FLOATING CONTACT CARD (1/3) */}
          <aside className="lg:col-span-1">
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              className="sticky top-28 bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 p-8"
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <p className="text-slate-400 text-sm font-bold uppercase tracking-wider">Starting from</p>
                  <h2 className="text-4xl font-bold text-brand-navy">$2,500</h2>
                </div>
                <button className="p-3 bg-slate-50 rounded-full text-slate-400 hover:text-brand-blue transition-colors">
                  <Share2 size={20} />
                </button>
              </div>

              <div className="space-y-4 mb-8">
                <button className="w-full bg-brand-navy text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-all shadow-xl">
                  <Calendar size={18} />
                  Book a Site Visit
                </button>
                <button className="w-full bg-white border-2 border-brand-navy text-brand-navy py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-slate-50 transition-all">
                  <MessageCircle size={18} />
                  Chat with Expert
                </button>
              </div>

              <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100">
                <div className="flex gap-3">
                  <div className="w-10 h-10 bg-brand-blue rounded-full flex items-center justify-center shrink-0">
                    <ShieldCheck className="text-white" size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-brand-navy">BuildHub Guarantee</p>
                    <p className="text-xs text-slate-500 mt-1">Payment is held securely until the project is verified.</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-slate-100 text-center">
                <p className="text-xs text-slate-400 font-medium">Provided by</p>
                <h4 className="font-bold text-brand-navy text-lg mt-1 underline">Vertex Builders Ltd</h4>
              </div>
            </motion.div>
          </aside>

        </div>
      </main>
    </div>
  );
};

export default ServiceDetail;