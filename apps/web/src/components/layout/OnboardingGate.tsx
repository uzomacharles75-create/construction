import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../../store/useAuthStore';
import apiClient from '../../api/client';
import {
  Building2, Wallet, CheckCircle2, ArrowRight, Loader2,
  MapPin, Globe, Phone, Briefcase, Sparkles, X,
  LayoutDashboard, FileText, Calculator, Store, Inbox, Wrench
} from 'lucide-react';
import toast from 'react-hot-toast';

// ─── Tour Steps ────────────────────────────────────────────────────
const TOUR_STEPS = [
  {
    icon: LayoutDashboard,
    title: 'Your Command Centre',
    desc: 'The dashboard gives you a real-time snapshot of projects, invoices, tenders, and business health at a glance.',
    color: 'bg-brand-yellow',
  },
  {
    icon: Wrench,
    title: 'My Services',
    desc: 'List your construction specialties. They appear on your public profile so clients can find and contact you directly.',
    color: 'bg-brand-yellow text-brand-navy',
    textColor: 'text-brand-navy',
  },
  {
    icon: Calculator,
    title: 'BOQ Engine',
    desc: 'Generate precise Bills of Quantities. Every line item is verified before export — no AI pricing errors slip through.',
    color: 'bg-rose-500',
  },
  {
    icon: Store,
    title: 'Marketplace',
    desc: 'Source materials and equipment from verified suppliers. Live pricing syncs directly into your BOQs.',
    color: 'bg-emerald-500',
  },
  {
    icon: FileText,
    title: 'Invoices & Finance',
    desc: 'Create professional invoices, track payments, and get full P&L reports — all in one place.',
    color: 'bg-purple-600',
  },
  {
    icon: Inbox,
    title: 'Inquiries',
    desc: 'Clients from the public directory send you messages here. Respond fast to win more contracts.',
    color: 'bg-orange-500',
  },
];

// ─── Main Onboarding Gate ─────────────────────────────────────────
interface OnboardingGateProps {
  children: React.ReactNode;
}

const STORAGE_KEY = 'buildhub-onboarded';

export const OnboardingGate = ({ children }: OnboardingGateProps) => {
  const { user } = useAuthStore();
  const [phase, setPhase] = useState<'loading' | 'setup' | 'wallet' | 'tour' | 'done'>('loading');
  const [setupStep, setSetupStep] = useState(1); // 1=profile, 2=wallet
  const [tourStep, setTourStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Profile form state
  const [profile, setProfile] = useState({
    phone: '', website: '', sector: '', address: '', city: '', country: ''
  });
  // Wallet top-up state
  const [topupAmount, setTopupAmount] = useState('');
  const [topupNote, setTopupNote] = useState('');

  useEffect(() => {
    const alreadyOnboarded = localStorage.getItem(`${STORAGE_KEY}-${user?.id}`);
    if (alreadyOnboarded) {
      setPhase('done');
    } else {
      setPhase('setup');
    }
  }, [user?.id]);

  const handleProfileSave = async () => {
    if (!profile.phone || !profile.sector) {
      toast.error('Phone and sector are required.');
      return;
    }
    setIsSubmitting(true);
    try {
      await apiClient.put('/auth/company/profile', profile);
      toast.success('Business profile saved!');
      setSetupStep(2);
    } catch {
      toast.error('Failed to save profile. You can update it in Settings later.');
      setSetupStep(2); // allow skip
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleWalletTopup = async () => {
    if (!topupAmount || Number(topupAmount) < 1000) {
      toast.error('Minimum top-up is 1,000 XAF.');
      return;
    }
    setIsSubmitting(true);
    try {
      await apiClient.post('/wallet/topup', { amount: Number(topupAmount), note: topupNote || 'Initial top-up' });
      toast.success('Wallet topped up successfully!');
      setPhase('tour');
    } catch {
      // Wallet may not be built yet — allow skip
      toast('Wallet service not available yet — you can top up later.', { icon: 'ℹ️' });
      setPhase('tour');
    } finally {
      setIsSubmitting(false);
    }
  };

  const skipWallet = () => setPhase('tour');

  const finishTour = () => {
    localStorage.setItem(`${STORAGE_KEY}-${user?.id}`, '1');
    setPhase('done');
  };

  if (phase === 'loading') {
    return (
      <div className="min-h-screen bg-brand-navy flex items-center justify-center">
        <Loader2 className="animate-spin text-brand-yellow" size={40} />
      </div>
    );
  }

  if (phase === 'done') return <>{children}</>;

  return (
    <AnimatePresence mode="wait">
      {/* ── PHASE: SETUP ── */}
      {(phase === 'setup') && (
        <motion.div
          key="setup"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          className="fixed inset-0 z-50 bg-brand-navy flex items-center justify-center p-4"
        >
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-yellow/5 blur-[120px] rounded-full pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-brand-yellow/5 blur-[100px] rounded-full pointer-events-none" />

          <div className="bg-brand-navy-card rounded-[3rem] w-full max-w-2xl shadow-2xl overflow-hidden relative">
            {/* Header bar */}
            <div className="bg-brand-navy px-10 pt-10 pb-8 text-white">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-brand-yellow rounded-xl flex items-center justify-center font-black text-brand-navy text-sm italic">BH</div>
                <span className="text-sm font-bold text-white/60 uppercase tracking-widest">BuildHub Setup</span>
              </div>
              <h1 className="text-3xl font-black tracking-tight mb-2">
                {setupStep === 1 ? 'Complete Your Business Profile' : 'Fund Your Workspace Wallet'}
              </h1>
              <p className="text-white/50 text-sm font-medium">
                {setupStep === 1
                  ? 'Help clients find you. This takes 60 seconds.'
                  : 'Your wallet powers services, listings, and premium features.'}
              </p>
              {/* Step dots */}
              <div className="flex gap-2 mt-6">
                {[1, 2].map(s => (
                  <div key={s} className={`h-1.5 rounded-full transition-all ${s === setupStep ? 'w-8 bg-brand-yellow' : s < setupStep ? 'w-4 bg-brand-yellow/60' : 'w-4 bg-brand-navy-card/20'}`} />
                ))}
              </div>
            </div>

            {/* Body */}
            <div className="p-10">
              <AnimatePresence mode="wait">
                {setupStep === 1 && (
                  <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {[
                        { field: 'phone', label: 'Phone / WhatsApp *', icon: Phone, placeholder: '+237 6XX XXX XXX' },
                        { field: 'sector', label: 'Business Sector *', icon: Briefcase, placeholder: 'e.g. General Contractor' },
                        { field: 'city', label: 'City', icon: MapPin, placeholder: 'e.g. Douala' },
                        { field: 'country', label: 'Country', icon: Globe, placeholder: 'e.g. Cameroon' },
                        { field: 'website', label: 'Website (optional)', icon: Globe, placeholder: 'https://...' },
                        { field: 'address', label: 'Physical Address', icon: Building2, placeholder: 'Street, Quarter...' },
                      ].map(({ field, label, icon: Icon, placeholder }) => (
                        <div key={field}>
                          <label className="text-[10px] font-black uppercase tracking-widest text-white/50 px-1 mb-1 block">{label}</label>
                          <div className="relative">
                            <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-white/35" size={16} />
                            <input
                              type="text"
                              placeholder={placeholder}
                              value={(profile as any)[field]}
                              onChange={e => setProfile({ ...profile, [field]: e.target.value })}
                              className="w-full p-3.5 pl-10 bg-brand-navy-light rounded-2xl border-none outline-none focus:ring-2 focus:ring-brand-yellow/30 text-sm font-medium"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                    <button
                      onClick={handleProfileSave}
                      disabled={isSubmitting}
                      className="mt-8 w-full py-4 bg-brand-navy text-white rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-brand-navy-light transition-all shadow-xl"
                    >
                      {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <><ArrowRight size={18} /> Save & Continue</>}
                    </button>
                  </motion.div>
                )}

                {setupStep === 2 && (
                  <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                    <div className="bg-brand-yellow/10 rounded-3xl p-6 mb-6 border border-brand-yellow/20">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-brand-yellow rounded-2xl flex items-center justify-center">
                          <Wallet size={20} className="text-brand-navy" />
                        </div>
                        <div>
                          <p className="font-black text-brand-navy text-sm">BuildHub Wallet</p>
                          <p className="text-xs text-brand-muted">Used for BOQ exports, listings & more</p>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3 mb-5">
                      {[5000, 10000, 25000, 50000, 100000, 200000].map(amt => (
                        <button
                          key={amt}
                          onClick={() => setTopupAmount(String(amt))}
                          className={`p-3 rounded-2xl font-black text-sm transition-all ${topupAmount === String(amt) ? 'bg-brand-yellow text-brand-navy shadow-yellow' : 'bg-brand-navy-card text-brand-navy/70 hover:bg-brand-navy-card'}`}
                        >
                          {amt.toLocaleString()}
                        </button>
                      ))}
                    </div>
                    <input
                      type="number"
                      placeholder="Or enter custom amount (XAF)"
                      value={topupAmount}
                      onChange={e => setTopupAmount(e.target.value)}
                      className="w-full p-4 bg-brand-navy-light rounded-2xl border-none outline-none focus:ring-2 focus:ring-brand-yellow/30 text-sm font-medium mb-3"
                    />
                    <input
                      type="text"
                      placeholder="Payment reference / note (optional)"
                      value={topupNote}
                      onChange={e => setTopupNote(e.target.value)}
                      className="w-full p-4 bg-brand-navy-light rounded-2xl border-none outline-none focus:ring-2 focus:ring-brand-yellow/30 text-sm font-medium"
                    />
                    <div className="flex gap-3 mt-6">
                      <button onClick={skipWallet} className="flex-1 py-4 bg-brand-navy-light text-brand-muted rounded-2xl font-bold text-sm hover:bg-brand-navy-light transition-all">
                        Skip for Now
                      </button>
                      <button
                        onClick={handleWalletTopup}
                        disabled={isSubmitting}
                        className="flex-1 py-4 bg-brand-yellow text-brand-navy rounded-2xl font-black flex items-center justify-center gap-2 shadow-yellow hover:scale-[1.02] transition-all"
                      >
                        {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <><Wallet size={18} /> Top Up Wallet</>}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      )}

      {/* ── PHASE: WALLET (from setup step 2, kept in same flow above) ── */}

      {/* ── PHASE: TOUR ── */}
      {phase === 'tour' && (
        <motion.div
          key="tour"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <motion.div
            key={tourStep}
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 260, damping: 22 }}
            className="bg-brand-navy-card rounded-[3rem] w-full max-w-md shadow-2xl p-10 relative"
          >
            <button
              onClick={finishTour}
              className="absolute top-6 right-6 text-white/35 hover:text-brand-muted transition-colors"
            >
              <X size={20} />
            </button>

            {/* Step icon */}
            <div className={`w-16 h-16 ${TOUR_STEPS[tourStep].color} rounded-[1.5rem] flex items-center justify-center mb-6 text-white shadow-xl`}>
              {(() => {
                const Icon = TOUR_STEPS[tourStep].icon;
                return <Icon size={28} />;
              })()}
            </div>

            {/* Step count */}
            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-white/50 mb-3">
              Feature {tourStep + 1} of {TOUR_STEPS.length}
            </p>
            <h2 className="text-2xl font-black text-brand-navy mb-3 tracking-tight">{TOUR_STEPS[tourStep].title}</h2>
            <p className="text-brand-muted font-medium leading-relaxed text-sm mb-8">{TOUR_STEPS[tourStep].desc}</p>

            {/* Progress dots */}
            <div className="flex gap-2 mb-8">
              {TOUR_STEPS.map((_, i) => (
                <button key={i} onClick={() => setTourStep(i)} className={`h-1.5 rounded-full transition-all ${i === tourStep ? 'w-8 bg-brand-yellow' : i < tourStep ? 'w-4 bg-brand-yellow/50' : 'w-4 bg-brand-navy-light'}`} />
              ))}
            </div>

            <div className="flex gap-3">
              {tourStep > 0 && (
                <button onClick={() => setTourStep(tourStep - 1)} className="px-6 py-3 bg-brand-navy-light text-brand-muted rounded-2xl font-bold text-sm hover:bg-brand-navy-light transition-all">
                  Back
                </button>
              )}
              <button
                onClick={() => tourStep < TOUR_STEPS.length - 1 ? setTourStep(tourStep + 1) : finishTour()}
                className="flex-1 py-3 bg-brand-navy text-white rounded-2xl font-black text-sm flex items-center justify-center gap-2 hover:bg-brand-navy-light transition-all"
              >
                {tourStep === TOUR_STEPS.length - 1 ? (
                  <><CheckCircle2 size={16} /> Enter Dashboard</>
                ) : (
                  <>Next <ArrowRight size={16} /></>
                )}
              </button>
            </div>

            {tourStep === 0 && (
              <button onClick={finishTour} className="w-full text-center text-xs text-white/35 mt-4 hover:text-brand-muted transition-colors font-medium">
                Skip tour — go straight to dashboard
              </button>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
