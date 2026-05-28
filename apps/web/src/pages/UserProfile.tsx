import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuthStore } from '../store/useAuthStore';
import { DashboardShell } from '../components/layout/DashboardShell';
import { Save, User, Mail, Lock } from 'lucide-react';
import { t } from '../theme';
import toast from 'react-hot-toast';

const UserProfile = () => {
  const { user } = useAuthStore();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    password: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Dummy success since backend modification is restricted
    toast.success("User profile updated successfully (Frontend Demo)");
  };

  return (
    <DashboardShell>
      <div className="max-w-3xl mx-auto pb-20">
        <div className="mb-10">
          <h1 className="text-3xl font-black text-foreground tracking-tight">My Profile</h1>
          <p className="text-muted-foreground text-sm font-medium mt-1">Manage your personal account settings and identity.</p>
        </div>

        <motion.form 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmit} 
          className="bg-card border border-border rounded-3xl p-8 shadow-sm space-y-6"
        >
          <div className="flex items-center gap-6 mb-8 pb-8 border-b border-border">
             <div className="w-20 h-20 rounded-full bg-primary/20 text-primary flex items-center justify-center font-black text-2xl shadow-inner border border-primary/30">
               {formData.name.charAt(0) || 'U'}
             </div>
             <div>
               <h3 className="font-black text-foreground text-lg">{formData.name || 'User'}</h3>
               <p className="text-sm font-medium text-muted-foreground">{user?.role?.toUpperCase() || 'MEMBER'}</p>
             </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className={t.label}>Full Name</label>
              <div className="relative mt-2">
                <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className={t.input + " pl-12"}
                  placeholder="John Doe"
                />
              </div>
            </div>

            <div>
              <label className={t.label}>Email Address</label>
              <div className="relative mt-2">
                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input 
                  type="email" 
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  className={t.input + " pl-12"}
                  placeholder="john@example.com"
                />
              </div>
            </div>

            <div>
              <label className={t.label}>New Password</label>
              <div className="relative mt-2">
                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input 
                  type="password" 
                  value={formData.password}
                  onChange={e => setFormData({ ...formData, password: e.target.value })}
                  className={t.input + " pl-12"}
                  placeholder="••••••••"
                />
              </div>
              <p className="text-[10px] text-muted-foreground mt-2">Leave blank to keep current password</p>
            </div>
          </div>

          <div className="pt-6 mt-6 border-t border-border flex justify-end">
            <button type="submit" className={t.btnPrimary + " flex items-center gap-2"}>
              <Save size={16} /> Save Changes
            </button>
          </div>
        </motion.form>
      </div>
    </DashboardShell>
  );
};

export default UserProfile;
