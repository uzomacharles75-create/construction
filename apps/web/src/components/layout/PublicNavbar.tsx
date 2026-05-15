
export const PublicNavbar = () => {
  return (
    <nav className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-xl border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 bg-brand-navy rounded-xl flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-xl">B</span>
          </div>
          <span className="text-2xl font-bold tracking-tight text-brand-navy">BuildHub</span>
        </div>

        <div className="hidden md:flex items-center gap-8 text-sm font-bold text-slate-600">
          <a href="/features" className="hover:text-brand-blue transition-colors">Platform</a>
          <a href="/directory" className="hover:text-brand-blue transition-colors">Directory</a>
          <a href="/marketplace" className="hover:text-brand-blue transition-colors">Marketplace</a>
        </div>
        <div className="flex items-center gap-4">
          <a href="/login" className="text-sm font-bold text-brand-navy">Log in</a>
          <a href="/register" className="bg-brand-navy text-white px-6 py-2.5 rounded-full text-sm font-bold shadow-xl hover:scale-105 transition-transform">
            Join BuildHub
          </a>
        </div>
      </div>
    </nav>
  );
};