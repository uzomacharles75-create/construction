import React from 'react';
import { PublicNavbar } from '../components/layout/PublicNavbar';
import { ShieldCheck, MapPin, Star, Phone, Mail, Globe, CheckCircle2, Image as ImageIcon } from 'lucide-react';
import { motion } from 'framer-motion';

const PublicCompanyProfile = () => {
  return (
    <div className="min-h-screen bg-white">
      <PublicNavbar />
      
      {/* COVER & BRANDING */}
      <header className="relative pt-20">
        <div className="h-80 bg-slate-900 overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&q=80" 
            className="w-full h-full object-cover opacity-60" 
            alt="Cover" 
          />
        </div>
        <div className="max-w-7xl mx-auto px-6 relative -mt-24 pb-12">
          <div className="bg-white rounded-[3rem] p-8 shadow-2xl border border-white flex flex-col md:flex-row items-end gap-8">
            <div className="w-40 h-40 bg-white rounded-[2.5rem] shadow-xl border-4 border-white overflow-hidden flex items-center justify-center shrink-0">
               <span className="text-6xl font-black text-brand-navy italic">B</span>
            </div>
            <div className="flex-1 pb-4">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-4xl font-black text-brand-navy tracking-tight">Vertex Builders Ltd</h1>
                <ShieldCheck className="text-brand-blue" size={28} />
              </div>
              <div className="flex flex-wrap items-center gap-6 text-slate-500 font-medium text-sm">
                <div className="flex items-center gap-1"><MapPin size={16} /> Douala, Cameroon</div>
                <div className="flex items-center gap-1"><Star size={16} className="text-amber-500" fill="currentColor" /> 4.9 (124 Reviews)</div>
                <div className="flex items-center gap-1"><CheckCircle2 size={16} className="text-emerald-500" /> Verified Member</div>
              </div>
            </div>
            <div className="flex gap-3 pb-4">
              <button className="bg-brand-navy text-white px-8 py-4 rounded-2xl font-bold shadow-xl hover:bg-slate-800 transition-all">
                Request a Quote
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-12 pb-32">
        {/* LEFT: INFO */}
        <div className="lg:col-span-2 space-y-12">
          <section>
            <h2 className="text-2xl font-black text-brand-navy mb-4 italic underline decoration-brand-blue underline-offset-8">About the Company</h2>
            <p className="text-slate-600 leading-relaxed text-lg font-medium">
              Vertex Builders has been a leader in residential and commercial infrastructure across Central Africa for over 15 years. We specialize in turn-key solutions, from initial architectural design to final structural completion.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-brand-navy mb-8">Our Services</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {['Foundation & Civil Works', 'Full Home Roofing', 'Architectural Planning', 'Project Management'].map(service => (
                <div key={service} className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 flex items-center justify-between group hover:bg-white hover:shadow-xl transition-all">
                  <span className="font-bold text-brand-navy">{service}</span>
                  <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-brand-blue opacity-0 group-hover:opacity-100 transition-opacity">
                    →
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* RIGHT: SIDEBAR CONTACT */}
        <aside className="space-y-8">
           <div className="bg-brand-soft p-8 rounded-[2.5rem] space-y-6">
              <h3 className="font-black text-brand-navy uppercase tracking-widest text-xs">Direct Contact</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-4 text-slate-600">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-brand-blue shadow-sm"><Phone size={18} /></div>
                  <span className="font-bold text-sm">+237 670 000 000</span>
                </div>
                <div className="flex items-center gap-4 text-slate-600">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-brand-blue shadow-sm"><Mail size={18} /></div>
                  <span className="font-bold text-sm">contact@vertex.cm</span>
                </div>
                <div className="flex items-center gap-4 text-slate-600">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-brand-blue shadow-sm"><Globe size={18} /></div>
                  <span className="font-bold text-sm">www.vertexbuilders.cm</span>
                </div>
              </div>
           </div>
        </aside>
      </main>
    </div>
  );
};

export default PublicCompanyProfile;