import { Link } from 'react-router-dom';

export const PublicFooter = () => (
  <footer className="bg-brand-navy border-t border-brand-border mt-20">
    <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-4 gap-10">
      <div>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 bg-brand-yellow rounded-lg flex items-center justify-center font-black text-brand-navy text-xs italic">BH</div>
          <span className="font-black text-white text-base">BuildHub</span>
        </div>
        <p className="text-white/40 text-sm leading-relaxed">The operating system for Africa's construction industry.</p>
      </div>
      {[
        { title: 'Platform', links: [['Directory','/directory'],['Marketplace','/marketplace'],['Post Tender','/post-project']] },
        { title: 'Account',  links: [['Register','/register'],['Login','/login']] },
        { title: 'Company',  links: [['About','#'],['Privacy','#'],['Terms','#']] },
      ].map(col => (
        <div key={col.title}>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-yellow mb-4">{col.title}</p>
          <ul className="space-y-2">
            {col.links.map(([label, to]) => (
              <li key={label}>
                <Link to={to} className="text-white/40 hover:text-white text-sm font-medium transition-colors">{label}</Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
    <div className="border-t border-brand-border px-6 py-6 text-center text-white/20 text-xs font-medium">
      © {new Date().getFullYear()} BuildHub Africa. All rights reserved.
    </div>
  </footer>
);
