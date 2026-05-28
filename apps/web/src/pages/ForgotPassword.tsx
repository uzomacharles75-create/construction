import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft } from 'lucide-react';
import { PublicNavbar } from '../components/layout/PublicNavbar';
import toast from 'react-hot-toast';
import apiClient from '../api/client';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }
    
    setIsLoading(true);
    try {
      await apiClient.post('/auth/forgotpassword', { email });
      setIsSent(true);
      toast.success("Password reset instructions sent!");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Something went wrong. Please try again.");
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
        className="relative bg-card border border-border p-8 md:p-12 rounded-[2.5rem] shadow-card w-full max-w-md text-center"
      >
        {!isSent ? (
          <>
            <div className="w-16 h-16 bg-muted rounded-2xl flex items-center justify-center text-foreground mx-auto mb-6 shadow-sm border border-border">
              <Mail size={24} />
            </div>
            <h2 className="text-3xl font-black text-foreground mb-2 tracking-tighter">Reset Password</h2>
            <p className="text-foreground/60 text-sm font-medium mb-8">
              Enter the email address associated with your account and we'll send you a link to reset your password.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6 text-left">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/40 px-1 block">Account Email</label>
                <input 
                  type="email" 
                  value={email} 
                  onChange={e => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full p-4 rounded-2xl bg-muted border border-border text-foreground placeholder-foreground/20 outline-none focus:ring-2 focus:ring-foreground/20 transition-all font-medium text-sm" 
                />
              </div>

              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full bg-foreground text-background p-4 rounded-2xl font-black shadow-sm hover:opacity-90 transition-all flex items-center justify-center gap-2"
              >
                {isLoading ? 'Sending...' : 'Send Reset Link'}
              </button>
            </form>
          </>
        ) : (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="py-6">
            <h2 className="text-3xl font-black text-foreground mb-3 tracking-tighter">Check your email</h2>
            <p className="text-foreground/60 text-sm font-medium mb-8">
              We've sent a password reset link to <br/>
              <span className="font-bold text-foreground">{email}</span>
            </p>
          </motion.div>
        )}

        <div className="mt-8 text-center border-t border-border pt-6">
          <Link to="/login" className="text-xs text-foreground/60 font-bold hover:text-foreground transition-colors flex items-center justify-center gap-1">
            <ArrowLeft size={14} /> Back to Login
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
