import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const PublicNavbar = () => {
  const [open, setOpen] = useState(false);

  const navLinks = [
    { href: '/#features', label: 'Platform' },
    { href: '/directory', label: 'Directory' },
    { href: '/marketplace', label: 'Marketplace' },
  ];

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-xl border-b border-slate-100">
      <motion.div layout className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 min-w-0" onClick={() => setOpen(false)}>
          <div className="w-8 h-8 sm:w-9 sm:h-9 bg-brand-navy rounded-xl flex items-center justify-center shadow-lg shrink-0">
            <span className="text-white font-bold text-lg sm:text-xl">B</span>
          </div>
          <span className="text-xl sm:text-2xl font-bold tracking-tight text-brand-navy truncate">BuildHub</span>
        </Link>

        <div className="hidden md:flex items-center gap-8 text-sm font-bold text-slate-600">
          {navLinks.map((link) => (
            <a key={link.href} href={link.href} className="hover:text-brand-blue transition-colors">
              {link.label}
            </a>
          ))}
        </div>

        <motion.div layout className="hidden md:flex items-center gap-4">
          <Link to="/login" className="text-sm font-bold text-brand-navy">Log in</Link>
          <Link
            to="/register"
            className="bg-brand-navy text-white px-6 py-2.5 rounded-full text-sm font-bold shadow-xl hover:scale-105 transition-transform"
          >
            Join BuildHub
          </Link>
        </motion.div>

        <button
          type="button"
          className="md:hidden p-2.5 rounded-xl bg-slate-50 text-brand-navy"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? 'Close menu' : 'Open menu'}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </motion.div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-slate-100 bg-white/95 backdrop-blur-xl overflow-hidden"
          >
            <div className="px-4 py-6 flex flex-col gap-4">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="text-base font-bold text-slate-700 py-2"
                >
                  {link.label}
                </a>
              ))}
              <div className="pt-4 border-t border-slate-100 flex flex-col gap-3">
                <Link to="/login" onClick={() => setOpen(false)} className="text-center py-3 font-bold text-brand-navy border border-slate-200 rounded-2xl">
                  Log in
                </Link>
                <Link
                  to="/register"
                  onClick={() => setOpen(false)}
                  className="text-center py-3 bg-brand-navy text-white font-bold rounded-2xl shadow-lg"
                >
                  Join BuildHub
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
