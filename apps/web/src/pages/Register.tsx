import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle2, 
  ArrowRight, 
  HardHat, 
  Store, 
  Loader2, 
  AlertCircle, 
  Eye, 
  EyeOff, 
  User, 
  Mail, 
  Lock, 
  Building2 
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { useAuthStore } from '../store/useAuthStore';
import apiClient from '../api/client';
import { PublicNavbar } from '../components/layout/PublicNavbar';

const Register = () => {
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  // 1. CONSOLIDATED FORM STATE
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    companyName: '',
    city: '',
    country: '',
    description: '',
    role: 'owner' 
  });

  const [error, setError] = useState<string | null>(null);

  // 2. BACKEND MUTATION
  const registerMutation = useMutation({
    mutationFn: (data: any) => apiClient.post('/auth/register', data),
    onSuccess: (response) => {
      const { user, token } = response.data;
      setAuth(user, token);
      navigate('/dashboard');
    },
    onError: (err: any) => {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    }
  });

  const handleNext = () => {
    if (step === 1 && (!formData.name || !formData.email || !formData.password)) return;
    if (step === 2 && (!formData.companyName || !formData.city)) return;
    setStep(step + 1);
  };

  const handleFinish = () => {
    setError(null);
    registerMutation.mutate(formData);
  };

  const steps = [
    { s: 1, t: "Identity", d: "Security & Login" },
    { s: 2, t: "Business", d: "Company Profile" },
    { s: 3, t: "Specialty", d: "Select Role" }
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4 md:p-6">
      <PublicNavbar />
      
      <div className="bg-white w-full max-w-lg lg:max-w-4xl rounded-[3rem] shadow-2xl flex overflow-hidden min-h-[600px] border border-white mt-10">
        
        {/* LEFT SIDEBAR: PROGRESS (Visible on Desktop) */}
        <div className="hidden lg:flex w-1/3 bg-[#001529] p-12 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-[-20px] left-[-20px] w-40 h-40 bg-blue-600/10 blur-[80px] rounded-full" />
          
          <div className="relative z-10">
            <div className="text-2xl font-black mb-12 italic tracking-tighter">BuildHub</div>
            <div className="space-y-10">
              {steps.map((item) => (
                <div key={item.s} className={`flex gap-4 items-center transition-all duration-500 ${step >= item.s ? 'opacity-100' : 'opacity-20'}`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${step >= item.s ? 'bg-blue-600 border-blue-600 shadow-[0_0_20px_rgba(37,99,235,0.4)]' : 'border-white'}`}>
                    {step > item.s ? <CheckCircle2 size={20} /> : <span className="text-sm font-bold">{item.s}</span>}
                  </div>
                  <div>
                    <p className="text-sm font-bold tracking-tight">{item.t}</p>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{item.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="text-[9px] text-slate-500 uppercase tracking-[0.3em] font-black relative z-10">
            Certified Cloud Infrastructure
          </div>
        </div>

        {/* RIGHT SIDE: FORM CONTENT */}
        <div className="flex-1 p-8 md:p-16 relative flex flex-col justify-center">
          
          {error && (
             <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="mb-6 p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-center gap-3 text-rose-600 text-xs font-bold">
                <AlertCircle size={16} /> {error}
             </motion.div>
          )}

          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}>
                <h2 className="text-3xl font-black text-[#001529] mb-2 tracking-tight">Personal Identity</h2>
                <p className="text-slate-400 mb-10 text-sm font-medium leading-relaxed">Let's set up your master administrative account.</p>
                
                <div className="space-y-4">
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                    <input 
                      type="text" 
                      placeholder="Full Legal Name" 
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full p-5 pl-12 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 ring-blue-600/20 transition-all font-medium text-sm" 
                    />
                  </div>
                  
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                    <input 
                      type="email" 
                      placeholder="Email Address" 
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full p-5 pl-12 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 ring-blue-600/20 transition-all font-medium text-sm" 
                    />
                  </div>

                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                    <input 
                      type={showPassword ? "text" : "password"} 
                      placeholder="Create Secure Password" 
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                      className="w-full p-5 pl-12 pr-14 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 ring-blue-600/20 transition-all font-medium text-sm" 
                    />
                    <button 
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600 transition-colors"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}>
                <h2 className="text-3xl font-black text-[#001529] mb-2 tracking-tight">Business Profile</h2>
                <p className="text-slate-400 mb-10 text-sm font-medium leading-relaxed">This branding will appear on your public directory listing.</p>
                <div className="space-y-4">
                  <div className="relative">
                    <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                    <input 
                        type="text" 
                        placeholder="Registered Company Name" 
                        value={formData.companyName}
                        onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                        className="w-full p-5 pl-12 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 ring-blue-600/20 transition-all font-bold text-[#001529]" 
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <input 
                        type="text" 
                        placeholder="City" 
                        value={formData.city}
                        onChange={(e) => setFormData({...formData, city: e.target.value})}
                        className="p-5 bg-slate-50 border-none rounded-2xl outline-none font-medium text-sm focus:ring-2 ring-blue-600/20" 
                    />
                    <input 
                        type="text" 
                        placeholder="Country" 
                        value={formData.country}
                        onChange={(e) => setFormData({...formData, country: e.target.value})}
                        className="p-5 bg-slate-50 border-none rounded-2xl outline-none font-medium text-sm focus:ring-2 ring-blue-600/20" 
                    />
                  </div>
                  <textarea 
                    placeholder="Brief description of construction services..." 
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full p-6 bg-slate-50 rounded-[2rem] border-none h-32 resize-none outline-none text-sm font-medium focus:ring-2 ring-blue-600/20" 
                  />
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}>
                <h2 className="text-3xl font-black text-[#001529] mb-2 tracking-tight">Select Specialty</h2>
                <p className="text-slate-400 mb-8 text-sm font-medium leading-relaxed">Choose how you will engage with the BuildHub ecosystem.</p>
                <div className="grid grid-cols-1 gap-3">
                  {[
                    { id: 'owner', title: 'Builder / Contractor', icon: HardHat, desc: 'Manage projects, workers, and BOQs.' },
                    { id: 'supplier', title: 'Material Supplier', icon: Store, desc: 'Sell equipment and materials.' },
                  ].map((item) => (
                    <button 
                      key={item.id}
                      onClick={() => setFormData({...formData, role: item.id})}
                      className={`flex items-start gap-5 p-6 rounded-[2rem] border-2 transition-all text-left ${formData.role === item.id ? 'border-blue-600 bg-blue-50' : 'border-slate-50 bg-slate-50 hover:border-slate-200'}`}
                    >
                      <div className={`p-4 rounded-2xl shrink-0 ${formData.role === item.id ? 'bg-blue-600 text-white shadow-xl' : 'bg-white text-slate-400'}`}>
                        <item.icon size={24} />
                      </div>
                      <div>
                        <span className={`font-black text-sm block mb-1 ${formData.role === item.id ? 'text-blue-600' : 'text-[#001529]'}`}>{item.title}</span>
                        <span className="text-[11px] text-slate-400 font-medium">{item.desc}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* NAVIGATION BUTTONS */}
          <div className="mt-12 flex items-center justify-between shrink-0">
            <div>
               {step === 1 && (
                  <p className="text-xs text-slate-400 font-medium px-2">
                    Already have an account? <Link to="/login" className="text-blue-600 font-black hover:underline">Log in</Link>
                  </p>
               )}
               {step > 1 && (
                  <button onClick={() => setStep(step - 1)} className="text-slate-400 font-black hover:text-[#001529] transition-colors text-[10px] uppercase tracking-widest px-4 py-2 hover:bg-slate-50 rounded-xl">
                    Back
                  </button>
               )}
            </div>
            <button 
              onClick={() => step < 3 ? handleNext() : handleFinish()}
              disabled={registerMutation.isPending}
              className="px-10 py-5 bg-[#001529] text-white rounded-[1.5rem] font-black text-[10px] uppercase tracking-[0.2em] shadow-2xl shadow-blue-900/20 hover:bg-blue-700 hover:scale-[1.02] transition-all flex items-center gap-3 disabled:bg-slate-300"
            >
              {registerMutation.isPending ? <Loader2 className="animate-spin" size={18} /> : (
                <>
                  {step === 3 ? 'Initialize Office' : 'Continue'}
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;