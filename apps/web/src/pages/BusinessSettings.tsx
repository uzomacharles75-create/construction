
import { DashboardShell } from '../components/layout/DashboardShell';
import { Camera,  Globe,  Mail, Award } from 'lucide-react';

const BusinessSettings = () => {
  return (
    <DashboardShell>
      <div className="max-w-4xl">
        <header className="mb-10">
          <h1 className="text-4xl font-black text-brand-navy tracking-tight">Business Profile</h1>
          <p className="text-slate-500">Control how your business appears on the directory and documents.</p>
        </header>

        <div className="bg-white rounded-[3rem] shadow-premium border border-white overflow-hidden">
          {/* PROFILE COVER */}
          <div className="h-48 bg-gradient-to-r from-brand-navy to-indigo-900 relative">
            <button className="absolute bottom-4 right-8 bg-white/20 backdrop-blur-md text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-white/30 transition-all border border-white/20">
              Change Cover
            </button>
          </div>
          
          <div className="px-12 pb-12">
            {/* LOGO UPLOAD */}
            <div className="relative -top-12 flex items-end gap-6 mb-4">
              <div className="w-32 h-32 bg-white rounded-[2.5rem] shadow-2xl flex items-center justify-center border-4 border-white overflow-hidden group">
                <div className="absolute inset-0 bg-brand-navy/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                  <Camera className="text-white" />
                </div>
                <span className="text-4xl font-black text-brand-navy italic">B</span>
              </div>
              <div className="pb-4">
                <h2 className="text-2xl font-black text-brand-navy leading-tight">BuildHub Construction Ltd</h2>
                <p className="text-sm text-slate-400">Douala, Cameroon • Verified Supplier</p>
              </div>
            </div>

            {/* FORM FIELDS */}
            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2 px-1">Website</label>
                  <div className="flex items-center gap-3 bg-slate-50 px-4 py-3 rounded-2xl">
                    <Globe size={18} className="text-slate-300" />
                    <input type="text" className="bg-transparent border-none outline-none text-sm font-bold text-brand-navy w-full" defaultValue="www.buildhub.com" />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2 px-1">Email</label>
                  <div className="flex items-center gap-3 bg-slate-50 px-4 py-3 rounded-2xl">
                    <Mail size={18} className="text-slate-300" />
                    <input type="email" className="bg-transparent border-none outline-none text-sm font-bold text-brand-navy w-full" defaultValue="office@buildhub.com" />
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                 <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2 px-1">Business Sector</label>
                  <select className="w-full bg-slate-50 border-none px-4 py-4 rounded-2xl text-sm font-bold text-brand-navy appearance-none outline-none">
                    <option>General Construction</option>
                    <option>Material Supplier</option>
                    <option>Architectural Firm</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2 px-1">Certifications</label>
                  <div className="flex gap-2">
                    <div className="bg-emerald-50 text-emerald-600 px-3 py-1.5 rounded-lg text-[10px] font-bold border border-emerald-100 flex items-center gap-2">
                      <Award size={12} />
                      ISO 9001
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <button className="mt-12 bg-brand-navy text-white px-10 py-4 rounded-2xl font-bold shadow-xl hover:scale-105 transition-transform">
              Save Profile Changes
            </button>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
};

export default BusinessSettings;