import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore'; // Ensure path is correct

const Login = () => {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login); // Correctly hook into Zustand
  
  // 1. Create State for inputs
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log("Attempting login with:", email);

    // 2. Logic to decide which dashboard to show
    if (email.toLowerCase().includes('staff')) {
      login('staff');
      navigate('/staff'); // Direct to Staff Portal
    } else if (email.toLowerCase().includes('admin')) {
      login('admin');
      navigate('/admin'); // Direct to Admin Panel
    } else {
      login('owner');
      navigate('/dashboard'); // Direct to Main Dashboard
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-soft p-6">
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-8 md:p-12 rounded-[2.5rem] md:rounded-[3rem] shadow-2xl w-full max-w-md"
      >
        <div className="text-center mb-10">
          <div className="w-14 h-14 bg-[#001F3F] rounded-2xl flex items-center justify-center text-white font-black italic mx-auto mb-6 shadow-xl shadow-slate-200">
            B
          </div>
          <h2 className="text-3xl font-black text-brand-navy mb-2 tracking-tighter">Welcome back</h2>
          <p className="text-slate-400 text-sm font-medium">Access your construction workspace.</p>
        </div>
        
        {/* 3. The Form */}
        <form className="space-y-5" onSubmit={handleLogin}>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 px-2">Account Email</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)} // Bind input to state
              placeholder="staff@buildhub.com or admin@buildhub.com" 
              className="w-full p-4 rounded-2xl bg-slate-50 border-none outline-none focus:ring-2 focus:ring-brand-blue transition-all font-medium text-sm text-brand-navy" 
            />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center px-2">
               <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Security Key</label>
               <button type="button" className="text-[10px] font-bold text-brand-blue hover:underline">Reset</button>
            </div>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)} // Bind input to state
              placeholder="••••••••" 
              className="w-full p-4 rounded-2xl bg-slate-50 border-none outline-none focus:ring-2 focus:ring-brand-blue transition-all font-medium text-sm text-brand-navy" 
            />
          </div>

          <button 
            type="submit"
            className="w-full bg-[#001F3F] text-white p-5 rounded-2xl font-black shadow-2xl shadow-slate-200 hover:bg-slate-800 hover:translate-y-[-2px] active:translate-y-[0px] transition-all mt-4"
          >
            Enter Dashboard
          </button>
        </form>

        <div className="mt-10 text-center border-t border-slate-50 pt-8">
          <p className="text-xs text-slate-400 font-medium">
            New to the platform? <br/>
            <Link to="/register" className="text-brand-blue font-bold hover:underline mt-2 inline-block">Create a Business ID</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;