import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuthStore } from '../store/useAuthStore';
import { DashboardShell } from '../components/layout/DashboardShell';
import { Save, User, Mail, Lock, ShieldCheck, KeyRound } from 'lucide-react';
import toast from 'react-hot-toast';

const UserProfile = () => {
  const { user } = useAuthStore();
  
  // Basic Info State
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });

  // Password State
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Profile updated successfully (Frontend Demo)");
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New passwords do not match.");
      return;
    }
    if (!passwordData.currentPassword) {
      toast.error("Current password is required.");
      return;
    }
    toast.success("Password changed successfully (Frontend Demo)");
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  return (
    <DashboardShell>
      <div className="max-w-4xl mx-auto pb-20">
        
        {/* HEADER */}
        <div className="mb-10 pb-6 border-b border-border">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Account Settings</span>
          </div>
          <h1 className="text-4xl font-black text-foreground tracking-tight">Identity & Security</h1>
          <p className="text-sm font-semibold text-muted-foreground mt-2">Manage your personal details and secure your account.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
           
           {/* LEFT COLUMN: BASIC INFO */}
           <div className="lg:col-span-2 space-y-10">
              
              <motion.section 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card border border-border rounded-[2rem] p-8 shadow-sm"
              >
                 <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center text-foreground">
                       <User size={20} />
                    </div>
                    <div>
                       <h2 className="text-xl font-black text-foreground">Basic Information</h2>
                       <p className="text-xs font-semibold text-muted-foreground mt-1">Update your personal details.</p>
                    </div>
                 </div>

                 <form onSubmit={handleProfileSubmit} className="space-y-6">
                    <div className="flex items-center gap-6 mb-8 pb-8 border-b border-border">
                       <div className="w-24 h-24 rounded-full bg-foreground text-background flex items-center justify-center font-black text-3xl shadow-md">
                         {profileData.name.charAt(0) || 'U'}
                       </div>
                       <div>
                         <h3 className="font-black text-foreground text-xl">{profileData.name || 'User'}</h3>
                         <p className="text-sm font-bold uppercase tracking-widest text-primary mt-1">{user?.role || 'MEMBER'}</p>
                       </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       <div>
                         <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Full Name</label>
                         <div className="relative mt-2">
                           <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                           <input 
                             type="text" 
                             value={profileData.name}
                             onChange={e => setProfileData({ ...profileData, name: e.target.value })}
                             className="w-full bg-muted border border-border rounded-xl py-3.5 pl-12 pr-4 text-sm font-medium focus:border-foreground outline-none transition-all"
                           />
                         </div>
                       </div>
                       <div>
                         <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Email Address</label>
                         <div className="relative mt-2">
                           <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                           <input 
                             type="email" 
                             value={profileData.email}
                             onChange={e => setProfileData({ ...profileData, email: e.target.value })}
                             className="w-full bg-muted border border-border rounded-xl py-3.5 pl-12 pr-4 text-sm font-medium focus:border-foreground outline-none transition-all"
                           />
                         </div>
                       </div>
                    </div>

                    <div className="pt-4 flex justify-end">
                      <button type="submit" className="bg-foreground text-background px-8 py-3.5 rounded-xl font-black text-xs uppercase tracking-widest shadow-sm hover:shadow-md transition-all flex items-center gap-2">
                        <Save size={16} /> Update Profile
                      </button>
                    </div>
                 </form>
              </motion.section>

              {/* SECURITY & PASSWORD SECTION */}
              <motion.section 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-card border border-border rounded-[2rem] p-8 shadow-sm"
              >
                 <div className="flex items-center gap-4 mb-8 border-b border-border pb-6">
                    <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center text-red-600">
                       <ShieldCheck size={20} />
                    </div>
                    <div>
                       <h2 className="text-xl font-black text-foreground">Security & Password</h2>
                       <p className="text-xs font-semibold text-muted-foreground mt-1">Ensure your account stays secure.</p>
                    </div>
                 </div>

                 <form onSubmit={handlePasswordSubmit} className="space-y-6">
                    <div>
                      <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Current Password</label>
                      <div className="relative mt-2">
                        <KeyRound size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <input 
                          type="password" 
                          value={passwordData.currentPassword}
                          onChange={e => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                          className="w-full bg-muted border border-border rounded-xl py-3.5 pl-12 pr-4 text-sm font-medium focus:border-red-400 outline-none transition-all"
                          placeholder="Enter your current password"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                       <div>
                         <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">New Password</label>
                         <div className="relative mt-2">
                           <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                           <input 
                             type="password" 
                             value={passwordData.newPassword}
                             onChange={e => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                             className="w-full bg-muted border border-border rounded-xl py-3.5 pl-12 pr-4 text-sm font-medium focus:border-red-400 outline-none transition-all"
                             placeholder="New password"
                           />
                         </div>
                       </div>
                       <div>
                         <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Confirm New Password</label>
                         <div className="relative mt-2">
                           <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                           <input 
                             type="password" 
                             value={passwordData.confirmPassword}
                             onChange={e => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                             className="w-full bg-muted border border-border rounded-xl py-3.5 pl-12 pr-4 text-sm font-medium focus:border-red-400 outline-none transition-all"
                             placeholder="Confirm new password"
                           />
                         </div>
                       </div>
                    </div>

                    <div className="pt-4 flex justify-end">
                      <button type="submit" className="bg-red-500 hover:bg-red-600 text-white px-8 py-3.5 rounded-xl font-black text-xs uppercase tracking-widest shadow-sm hover:shadow-md transition-all flex items-center gap-2">
                        <ShieldCheck size={16} /> Change Password
                      </button>
                    </div>
                 </form>
              </motion.section>

           </div>

           {/* RIGHT COLUMN: INFO CARDS */}
           <div className="space-y-6">
              <div className="bg-muted border border-border p-6 rounded-[2rem]">
                 <h4 className="font-black text-foreground mb-2">Password Requirements</h4>
                 <ul className="text-xs font-medium text-muted-foreground space-y-2 mt-4">
                    <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-primary" /> Minimum 8 characters long</li>
                    <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-primary" /> At least one uppercase letter</li>
                    <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-primary" /> At least one number</li>
                    <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-primary" /> At least one special character</li>
                 </ul>
              </div>

              <div className="bg-foreground text-background p-6 rounded-[2rem] shadow-xl">
                 <h4 className="font-black mb-2 text-primary">Need Help?</h4>
                 <p className="text-xs font-medium text-background/70 leading-relaxed mb-6">
                   If you believe your account has been compromised, please contact our security team immediately.
                 </p>
                 <button className="w-full bg-background/10 hover:bg-background/20 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-colors">
                    Contact Support
                 </button>
              </div>
           </div>

        </div>
      </div>
    </DashboardShell>
  );
};

export default UserProfile;
