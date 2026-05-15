import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, ArrowRight, HardHat, Store, Briefcase } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
  const [step, setStep] = useState(1);
  const [role, setRole] = useState('');
  const navigate = useNavigate();

  const handleFinish = () => {
    // Logic to save data would go here
    navigate('/dashboard');
  };

  const steps = [
    { s: 1, t: "Personal", d: "Your account" },
    { s: 2, t: "Company", d: "Business info" },
    { s: 3, t: "Role", d: "Your specialty" }
  ];

  return (
    <div className="min-h-screen bg-brand-soft flex items-center justify-center p-4 md:p-6">
      <div className="bg-white w-full max-w-lg lg:max-w-4xl rounded-[2.5rem] md:rounded-[3rem] shadow-2xl flex overflow-hidden min-h-[550px]">
        
        {/* LEFT SIDEBAR: PROGRESS (Visible on Desktop) */}
        <div className="hidden lg:flex w-1/3 bg-brand-navy p-12 text-white flex-col justify-between">
          <div>
            <div className="text-2xl font-black mb-12 italic tracking-tighter">BuildHub</div>
            <div className="space-y-8">
              {steps.map((item) => (
                <div key={item.s} className={`flex gap-4 items-center transition-opacity duration-500 ${step >= item.s ? 'opacity-100' : 'opacity-30'}`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${step >= item.s ? 'bg-brand-blue border-brand-blue' : 'border-white'}`}>
                    {step > item.s ? <CheckCircle2 size={20} /> : <span className="text-sm font-bold">{item.s}</span>}
                  </div>
                  <div>
                    <p className="text-sm font-bold">{item.t}</p>
                    <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">{item.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">
            Secure Onboarding v1.0
          </div>
        </div>

        {/* RIGHT SIDE: FORM CONTENT */}
        <div className="flex-1 p-8 md:p-16 relative flex flex-col justify-center">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}>
                <h2 className="text-3xl font-black text-brand-navy mb-2 tracking-tight">Create Account</h2>
                <p className="text-slate-400 mb-8 text-sm">Join the ecosystem of African builders.</p>
                <div className="space-y-4">
                  <input type="text" placeholder="Full Name" className="w-full p-4 bg-slate-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-brand-blue transition-all" />
                  <input type="email" placeholder="Email Address" className="w-full p-4 bg-slate-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-brand-blue transition-all" />
                  <input type="password" placeholder="Create Password" className="w-full p-4 bg-slate-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-brand-blue transition-all" />
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}>
                <h2 className="text-3xl font-black text-brand-navy mb-2 tracking-tight">Business Info</h2>
                <p className="text-slate-400 mb-8 text-sm">How should clients identify your company?</p>
                <div className="space-y-4">
                  <input type="text" placeholder="Legal Company Name" className="w-full p-4 bg-slate-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-brand-blue transition-all" />
                  <div className="grid grid-cols-2 gap-4">
                    <input type="text" placeholder="City" className="p-4 bg-slate-50 rounded-2xl border-none outline-none" />
                    <input type="text" placeholder="Country" className="p-4 bg-slate-50 rounded-2xl border-none outline-none" />
                  </div>
                  <textarea placeholder="Brief company bio..." className="w-full p-4 bg-slate-50 rounded-2xl border-none h-24 md:h-32 resize-none outline-none" />
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}>
                <h2 className="text-3xl font-black text-brand-navy mb-2 tracking-tight">Final Step</h2>
                <p className="text-slate-400 mb-8 text-sm">Select your primary activity on BuildHub.</p>
                <div className="grid grid-cols-1 gap-3">
                  {[
                    { id: 'contractor', title: 'Contractor / Builder', icon: HardHat },
                    { id: 'supplier', title: 'Material Supplier', icon: Store },
                    { id: 'client', title: 'Project Owner', icon: Briefcase },
                  ].map((item) => (
                    <button 
                      key={item.id}
                      onClick={() => setRole(item.id)}
                      className={`flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-left ${role === item.id ? 'border-brand-blue bg-blue-50' : 'border-slate-50 bg-slate-50 hover:border-slate-200'}`}
                    >
                      <div className={`p-2 rounded-xl ${role === item.id ? 'bg-brand-blue text-white' : 'bg-white text-slate-400'}`}>
                        <item.icon size={20} />
                      </div>
                      <span className={`font-bold text-sm ${role === item.id ? 'text-brand-blue' : 'text-brand-navy'}`}>{item.title}</span>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* NAVIGATION BUTTONS */}
          <div className="mt-12 flex items-center justify-between">
            <div>
               {step === 1 && (
                  <p className="text-xs text-slate-400">
                    Existing user? <Link to="/login" className="text-brand-blue font-bold">Sign In</Link>
                  </p>
               )}
               {step > 1 && (
                  <button onClick={() => setStep(step - 1)} className="text-slate-400 font-bold hover:text-brand-navy transition-colors text-sm">
                    Back
                  </button>
               )}
            </div>
            <button 
              onClick={() => step < 3 ? setStep(step + 1) : handleFinish()}
              className="px-10 py-4 bg-brand-navy text-white rounded-2xl font-bold flex items-center gap-2 hover:bg-brand-blue transition-all shadow-xl shadow-slate-200"
            >
              {step === 3 ? 'Get Started' : 'Next Step'}
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;