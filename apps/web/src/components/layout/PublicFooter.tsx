import { Link } from 'react-router-dom';
import { Globe, ArrowUpRight, ShieldCheck } from 'lucide-react';


export const PublicFooter = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#001529] text-white pt-24 pb-12 px-6 rounded-t-[3rem] md:rounded-t-[5rem] mt-20 relative overflow-hidden">
      {/* BACKGROUND DECORATION */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/5 blur-[100px] rounded-full" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
          
          {/* BRANDING */}
          <div className="space-y-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center font-black text-[#001529] text-xl italic shadow-xl">
                BH
              </div>
              <span className="text-2xl font-black tracking-tighter italic">BuildHub</span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed font-medium max-w-xs">
              The professional operating system for African construction.
            </p>
            <div className="flex items-center gap-3 bg-white/5 border border-white/10 w-fit px-4 py-2 rounded-2xl">
                <ShieldCheck size={16} className="text-blue-400" />
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">Verified Platform</span>
            </div>
          </div>

          {/* PLATFORM LINKS */}
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-500 mb-8">Platform</h4>
            <ul className="space-y-4 text-sm font-bold text-slate-300">
              <li><Link to="/directory" className="hover:text-white transition-colors flex items-center gap-2 group">Directory <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 transition-all" /></Link></li>
              <li><Link to="/marketplace" className="hover:text-white transition-colors flex items-center gap-2 group">Marketplace <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 transition-all" /></Link></li>
              <li><Link to="/post-project" className="hover:text-white transition-colors flex items-center gap-2 group">Bidding Hub <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 transition-all" /></Link></li>
            </ul>
          </div>

          {/* COMPANY */}
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-500 mb-8">Company</h4>
            <ul className="space-y-4 text-sm font-bold text-slate-300">
              <li><a href="#" className="hover:text-white transition-colors">Enterprise</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Support</a></li>
            </ul>
          </div>

          {/* SOCIAL (TEXT BASED - NO ICON IMPORTS) */}
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-500 mb-8">Connect</h4>
            <div className="flex gap-3 mb-10">
                <button className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 transition-all">TW</button>
                <button className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 transition-all">FB</button>
                <button className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 transition-all">IN</button>
            </div>
            <div className="flex items-center gap-3 text-slate-400 font-black text-[10px] uppercase tracking-widest border-l border-white/10 pl-6">
                <Globe size={14} className="text-blue-400" />
                Regional Hub: Africa
            </div>
          </div>
        </div>

        {/* BOTTOM BAR */}
        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">
            © {currentYear} BuildHub Platform
          </p>
          <div className="flex gap-8 text-[10px] font-black text-slate-500 uppercase tracking-widest">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
};