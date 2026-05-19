import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import apiClient from '../api/client'; // Your real Axios instance
import { Loader2, AlertCircle, ShieldCheck, Eye, EyeOff } from 'lucide-react';
import { PublicNavbar } from '../components/layout/PublicNavbar';

const Login = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [showPassword, setShowPassword] = useState(false);
  
  // 1. FORM STATE
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 2. REAL AUTHENTICATION LOGIC
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      // API call to Backend
      const response = await apiClient.post('/auth/login', { email, password });
      
      const { user, token } = response.data;

      // Save token and user to Zustand Store & LocalStorage
      setAuth(user, token);

      // 3. ROLE-BASED REDIRECTION (Now based on Database Role)
      if (user.role === 'admin') {
        navigate('/admin');
      } else if (user.role === 'staff') {
        navigate('/staff/dashboard');
      } else {
        navigate('/dashboard'); // Owners go here
      }

    } catch (err: any) {
      // Real error handling from Backend response
      const message = err.response?.data?.message || "Connection failed. Please try again.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[100dvh] flex items-center justify-center bg-brand-soft p-4 sm:p-6 pt-24 sm:pt-28">
      <PublicNavbar /> {/* Optional: A simple navbar for public pages */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-8 md:p-12 rounded-[2.5rem] md:rounded-[3rem] shadow-2xl w-full max-w-md border border-white"
      >
        <div className="text-center mb-10">
          <div className="w-14 h-14 bg-[#001F3F] rounded-2xl flex items-center justify-center text-white font-black italic mx-auto mb-6 shadow-xl shadow-blue-900/20">
            B
          </div>
          <h2 className="text-3xl font-black text-[#001F3F] mb-2 tracking-tighter">Welcome back</h2>
          <p className="text-slate-400 text-sm font-medium">Access your construction workspace.</p>
        </div>

        {/* ERROR DISPLAY */}
        {error && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-6 p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-center gap-3 text-rose-600 text-xs font-bold"
          >
            <AlertCircle size={16} />
            {error}
          </motion.div>
        )}
        
        <form className="space-y-5" onSubmit={handleLogin}>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 px-2">Account Email</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@company.com" 
              className="w-full p-4 rounded-2xl bg-slate-50 border-none outline-none focus:ring-2 focus:ring-blue-600/20 transition-all font-medium text-sm text-[#001F3F]" 
            />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center px-2">
               <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Security Key</label>
               <button type="button" className="text-[10px] font-bold text-blue-600 hover:underline">Forgot?</button>
            </div>
            <input 
              type={showPassword ? "text" : "password"} 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••" 
              className="w-full p-4 rounded-2xl bg-slate-50 border-none outline-none focus:ring-2 focus:ring-blue-600/20 transition-all font-medium text-sm text-[#001F3F]" 
            />
          </div>

          <div className="flex items-center gap-2 px-2 pb-2">
            <ShieldCheck size={14} className="text-emerald-500" />
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">End-to-End Encrypted</span>
          </div>

          <button 
            type="submit"
            disabled={isLoading}
            onClick={() => setShowPassword(!showPassword)}
            className="w-full bg-[#001F3F] text-white p-5 rounded-2xl font-black shadow-2xl shadow-blue-900/20 hover:bg-blue-700 hover:translate-y-[-2px] active:translate-y-[0px] disabled:bg-slate-300 disabled:translate-y-0 transition-all mt-2 flex items-center justify-center gap-3"
          >
             {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            {isLoading ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                Authenticating...
              </>
            ) : (
              'Login'
            )}
          </button>
        </form>

        <div className="mt-5 text-center border-t border-slate-50 pt-8">
          <p className="text-xs text-slate-400 font-medium">
            Don't have an account? <br/>
            <Link to="/register" className="text-blue-600 font-bold hover:underline mt-2 inline-block">Create a Business ID</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;