import React, { useState } from 'react';
import { Sidebar } from './Sidebar'; // Importing the perfected dark sidebar
import { 
  Search, 
  Bell, 
  Menu, 
  X, 
  ChevronDown,
  Mail
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const DashboardShell = ({ children }: { children: React.ReactNode }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-screen bg-[#F8FAFC] overflow-hidden">
      
      {/* 1. DESKTOP SIDEBAR (Static) */}
      <div className="hidden lg:block shrink-0">
        <Sidebar />
      </div>

      {/* 2. MOBILE SIDEBAR (Slide-over) */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Background Blur Overlay */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-[#001529]/40 backdrop-blur-sm z-[60] lg:hidden"
            />
            {/* Sidebar Content */}
            <motion.div 
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 z-[70] w-[280px] lg:hidden"
            >
              <Sidebar />
              {/* Close Button for Mobile */}
              <button 
                onClick={() => setIsMobileMenuOpen(false)}
                className="absolute top-5 right-4 p-2 text-white/50 hover:text-white"
              >
                <X size={24} />
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* 3. MAIN VIEWPORT */}
      <main className="flex-1 flex flex-col min-w-0">
        
        {/* TOP NAVIGATION BAR */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-100 flex items-center justify-between px-4 md:px-8 shrink-0 z-50">
          
          <div className="flex items-center gap-4 flex-1">
            {/* Mobile Hamburger Button */}
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2.5 bg-slate-50 rounded-xl text-[#001529] lg:hidden border border-slate-100"
            >
              <Menu size={20} />
            </button>
            
            {/* Search Bar - Exactly like your reference image */}
            <div className="hidden md:flex items-center gap-3 bg-slate-50 px-4 py-2.5 rounded-2xl border border-slate-100 w-full max-w-md focus-within:ring-2 focus-within:ring-blue-600/20 transition-all">
              <Search size={18} className="text-slate-400" />
              <input 
                type="text" 
                placeholder="Search projects, materials, tasks..." 
                className="bg-transparent border-none outline-none text-sm w-full text-slate-600 font-medium" 
              />
            </div>
          </div>

          {/* User & Actions Area */}
          <div className="flex items-center gap-2 md:gap-4 ml-4">
            {/* Notification Icons */}
            <div className="flex items-center gap-1 md:gap-2 mr-2 md:mr-4">
              <button className="p-2.5 text-slate-400 hover:bg-slate-50 rounded-xl transition-all relative">
                <Mail size={20} />
                <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white shadow-sm"></span>
              </button>
              <button className="p-2.5 text-slate-400 hover:bg-slate-50 rounded-xl transition-all relative">
                <Bell size={20} />
                <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white shadow-sm"></span>
              </button>
            </div>

            {/* Profile Dropdown */}
            <div className="flex items-center gap-3 pl-4 border-l border-slate-100 py-2 cursor-pointer group">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-black text-[#001529]">Banye Construction Ltd</p>
                <p className="text-[10px] font-bold text-blue-600 uppercase tracking-tighter">Premium Member</p>
              </div>
              <div className="w-10 h-10 rounded-2xl bg-[#001529] flex items-center justify-center text-white font-black text-xs shadow-lg group-hover:scale-105 transition-transform">
                BH
              </div>
              <ChevronDown size={14} className="text-slate-300 group-hover:text-blue-600 transition-colors" />
            </div>
          </div>
        </header>

        {/* SCROLLABLE CONTENT AREA */}
        <section className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-8 custom-scrollbar">
          {children}
        </section>
      </main>
    </div>
  );
};