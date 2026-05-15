
import { DashboardShell } from '../components/layout/DashboardShell';
import { FileUp, MapPin, DollarSign } from 'lucide-react';

const CreateTender = () => {
  return (
    <DashboardShell>
      <div className="max-w-3xl mx-auto">
        <header className="mb-12">
          <h1 className="text-4xl font-black text-brand-navy tracking-tight">Post a Tender</h1>
          <p className="text-slate-500 mt-2">Describe your project and receive competitive bids from verified builders.</p>
        </header>

        <form className="space-y-8">
          {/* CORE DETAILS */}
          <div className="bg-white p-10 rounded-[2.5rem] shadow-premium border border-white space-y-6">
            <div>
              <label className="text-xs font-black uppercase tracking-widest text-slate-400 block mb-3">Project Title</label>
              <input type="text" placeholder="e.g. Modern Residential Complex Construction" className="w-full p-4 bg-slate-50 rounded-2xl border-none outline-none font-bold text-brand-navy" />
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="text-xs font-black uppercase tracking-widest text-slate-400 block mb-3">Location</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                  <input type="text" placeholder="Yaoundé, Cameroon" className="w-full p-4 pl-12 bg-slate-50 rounded-2xl border-none outline-none text-sm font-medium" />
                </div>
              </div>
              <div>
                <label className="text-xs font-black uppercase tracking-widest text-slate-400 block mb-3">Estimated Budget</label>
                <div className="relative">
                  <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                  <input type="number" placeholder="50,000" className="w-full p-4 pl-12 bg-slate-50 rounded-2xl border-none outline-none text-sm font-bold text-brand-navy" />
                </div>
              </div>
            </div>

            <div>
              <label className="text-xs font-black uppercase tracking-widest text-slate-400 block mb-3">Project Description</label>
              <textarea placeholder="Describe the scope of work, materials required, and specific expertise needed..." className="w-full p-4 bg-slate-50 rounded-2xl border-none outline-none text-sm font-medium h-48 resize-none" />
            </div>
          </div>

          {/* ATTACHMENTS */}
          <div className="bg-white p-10 rounded-[2.5rem] shadow-premium border border-white">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-6">Blueprints & Documents</h3>
            <div className="border-2 border-dashed border-slate-100 rounded-[2rem] p-12 text-center group hover:border-brand-blue transition-all cursor-pointer">
              <FileUp className="mx-auto text-slate-300 group-hover:text-brand-blue mb-4" size={48} />
              <p className="text-sm font-bold text-brand-navy">Drag and drop blueprints or site plans</p>
              <p className="text-xs text-slate-400 mt-1">PDF, JPG or PNG up to 20MB</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
             <button className="flex-1 bg-brand-navy text-white py-5 rounded-[1.5rem] font-black text-lg shadow-xl hover:bg-slate-800 transition-all">
               Publish Tender
             </button>
             <button className="px-10 py-5 bg-white text-slate-400 font-bold rounded-[1.5rem] border border-slate-100 hover:bg-slate-50 transition-all">
               Save as Draft
             </button>
          </div>
        </form>
      </div>
    </DashboardShell>
  );
};

export default CreateTender;