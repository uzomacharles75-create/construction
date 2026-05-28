import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { Lock, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { PublicNavbar } from '../components/layout/PublicNavbar';
import toast from 'react-hot-toast';
import apiClient from '../api/client';

const ResetPassword = () => {
  const { token } = useParams<{ token: string }>();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password || !confirmPassword) {
      toast.error("Please fill in all fields");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return;
    }
    if (!token) {
      toast.error("Invalid or missing reset token.");
      return;
    }

    setIsLoading(true);
    try {
      await apiClient.put(`/auth/resetpassword/${token}`, { password });
      toast.success("Password successfully reset!");
      navigate('/login');
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Invalid token or token has expired");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[100dvh] bg-background flex items-center justify-center p-4 pt-24">
      <PublicNavbar />
      
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative bg-card border border-border p-8 md:p-12 rounded-[2.5rem] shadow-card w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-muted rounded-2xl flex items-center justify-center text-foreground mx-auto mb-6 shadow-sm border border-border">
            <ShieldCheck size={28} />
          </div>
          <h2 className="text-3xl font-black text-foreground mb-2 tracking-tighter">Set New Password</h2>
          <p className="text-foreground/60 text-sm font-medium">
            Please enter your new password below.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/40 px-1 block">New Password</label>
            <div className="relative">
              <input 
                type={showPassword ? 'text' : 'password'} 
                value={password} 
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full p-4 pr-12 rounded-2xl bg-muted border border-border text-foreground placeholder-foreground/20 outline-none focus:ring-2 focus:ring-foreground/20 transition-all font-medium text-sm" 
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-foreground/30 hover:text-foreground/70 transition-colors"
              >
                {showPassword ? <EyeOff size={18}/> : <Eye size={18}/>}
              </button>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/40 px-1 block">Confirm Password</label>
            <div className="relative">
              <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/30" />
              <input 
                type={showPassword ? 'text' : 'password'} 
                value={confirmPassword} 
                onChange={e => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full p-4 pl-12 rounded-2xl bg-muted border border-border text-foreground placeholder-foreground/20 outline-none focus:ring-2 focus:ring-foreground/20 transition-all font-medium text-sm" 
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-foreground text-background p-4 rounded-2xl font-black shadow-sm hover:opacity-90 transition-all flex items-center justify-center gap-2 mt-4"
          >
            {isLoading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default ResetPassword;
