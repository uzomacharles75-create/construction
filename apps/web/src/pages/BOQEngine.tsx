import React, { useState } from 'react';
import { DashboardShell } from '../components/layout/DashboardShell';
import { 
  Plus, 
  Download, 
  CheckCircle, 
  AlertCircle, 
  Sparkles, 
  MoreVertical,
  FileCheck,
  Lock
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const BOQRow = ({ item, onVerify }: any) => {
  const statusColors: any = {
    pending: "bg-amber-50 text-amber-600 border-amber-100",
    verified: "bg-emerald-50 text-emerald-600 border-emerald-100",
    ai: "bg-purple-50 text-purple-600 border-purple-100",
  };

  return (
    <motion.tr 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="group hover:bg-slate-50/50 transition-colors border-b border-slate-100"
    >
      <td className="px-6 py-4 text-sm font-medium text-slate-400">01</td>
      <td className="px-6 py-4">
        <div>
          <p className="text-sm font-bold text-brand-navy">{item.description}</p>
          <div className="flex gap-2 mt-1">
            {item.isAiSuggested && (
              <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-purple-500 bg-purple-50 px-2 py-0.5 rounded-md">
                <Sparkles size={10} /> AI Suggested
              </span>
            )}
          </div>
        </div>
      </td>
      <td className="px-6 py-4 text-sm text-slate-600 font-medium">{item.unit}</td>
      <td className="px-6 py-4 text-sm text-brand-navy font-bold">{item.qty}</td>
      <td className="px-6 py-4 text-sm text-brand-navy font-bold">${item.rate}</td>
      <td className="px-6 py-4 text-sm text-brand-navy font-black">${(item.qty * item.rate).toLocaleString()}</td>
      <td className="px-6 py-4">
        <button 
          onClick={() => onVerify(item.id)}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-bold transition-all ${statusColors[item.status]}`}
        >
          {item.status === 'verified' ? <CheckCircle size={14} /> : <AlertCircle size={14} />}
          {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
        </button>
      </td>
      <td className="px-6 py-4 text-right">
        <button className="text-slate-300 hover:text-brand-navy transition-colors">
          <MoreVertical size={18} />
        </button>
      </td>
    </motion.tr>
  );
};

const BOQEngine = () => {
  const [items, setItems] = useState([
    { id: 1, description: "Excavation for foundation", unit: "m3", qty: 45, rate: 120, status: 'verified', isAiSuggested: false },
    { id: 2, description: "Reinforcement Steel (12mm)", unit: "ton", qty: 2.5, rate: 850, status: 'pending', isAiSuggested: true },
    { id: 3, description: "Concrete Mix C25/30", unit: "m3", qty: 15, rate: 310, status: 'pending', isAiSuggested: false },
     { id: 4, description: "Bulk Earthworks & Excavation", unit: "m3", qty: 450, rate: 45, status: 'verified' },
  { id: 5, description: "Reinforced Concrete Foundation C30", unit: "m3", qty: 120, rate: 310, status: 'pending' },
  { id: 6, description: "Structural Steel Frames (Grade S355)", unit: "ton", qty: 12, rate: 1150, status: 'pending' },
  { id: 7, description: "Exterior Brick Cladding (Manual Red)", unit: "sqm", qty: 850, rate: 22, status: 'verified' }
  ]);

  const allVerified = items.every(item => item.status === 'verified');

  const verifyItem = (id: number) => {
    setItems(items.map(item => item.id === id ? { ...item, status: 'verified' } : item));
  };

  return (
    <DashboardShell>
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-3xl font-bold text-brand-navy tracking-tight">BOQ: Residential Villa</h1>
              <span className="px-3 py-1 bg-slate-100 text-slate-500 rounded-full text-[10px] font-bold uppercase">Draft</span>
            </div>
            <p className="text-slate-500">Create, verify and export your bill of quantities.</p>
          </div>
          
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 text-brand-navy rounded-2xl font-bold hover:bg-slate-50 transition-all text-sm">
              <Plus size={18} />
              Add Item
            </button>
            <button 
              disabled={!allVerified}
              className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold transition-all text-sm shadow-lg ${
                allVerified 
                ? "bg-brand-navy text-white hover:bg-slate-800" 
                : "bg-slate-100 text-slate-400 cursor-not-allowed shadow-none"
              }`}
            >
              {allVerified ? <Download size={18} /> : <Lock size={18} />}
              Export PDF
            </button>
          </div>
        </header>

        {/* VERIFICATION ALERTBAR */}
        <AnimatePresence>
          {!allVerified && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6 bg-amber-50 border border-amber-100 p-4 rounded-2xl flex items-center gap-3"
            >
              <AlertCircle className="text-amber-500" size={20} />
              <p className="text-sm font-medium text-amber-700">
                <span className="font-bold">Export Locked:</span> All items must be <span className="underline">verified</span> before you can generate the final BOQ document.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* THE TABLE */}
        <div className="bg-white rounded-[2rem] shadow-premium border border-white overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 text-slate-400 text-[10px] uppercase tracking-widest font-bold">
                <th className="px-6 py-5">#</th>
                <th className="px-6 py-5">Item Description</th>
                <th className="px-6 py-5">Unit</th>
                <th className="px-6 py-5">Qty</th>
                <th className="px-6 py-5">Rate</th>
                <th className="px-6 py-5">Total</th>
                <th className="px-6 py-5">Status</th>
                <th className="px-6 py-5 text-right"></th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <BOQRow key={item.id} item={item} onVerify={verifyItem} />
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-slate-50/30">
                <td colSpan={5} className="px-6 py-6 text-right font-bold text-slate-500">Subtotal</td>
                <td className="px-6 py-6 font-black text-2xl text-brand-navy">$45,200</td>
                <td colSpan={2}></td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* AI SUGGESTION PANEL */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 p-8 bg-gradient-to-br from-brand-navy to-indigo-900 rounded-[2.5rem] text-white relative overflow-hidden">
            <Sparkles className="absolute right-[-20px] top-[-20px] text-white/10 w-48 h-48" />
            <div className="relative z-10">
              <h3 className="text-xl font-bold mb-2">AI Cost Estimator</h3>
              <p className="text-indigo-100 text-sm mb-6 max-w-md">Our AI analyzed your description and suggests a market rate of <span className="font-bold text-white">$850 - $920</span> for Reinforcement Steel based on current marketplace data.</p>
              <button className="bg-white text-brand-navy px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-brand-soft transition-all">
                Apply Suggestion
              </button>
            </div>
          </div>
          
          <div className="p-8 bg-white border border-slate-100 rounded-[2.5rem] shadow-premium flex flex-col justify-center items-center text-center">
            <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-500 mb-4">
              <FileCheck size={32} />
            </div>
            <h4 className="font-bold text-brand-navy">Ready to Export?</h4>
            <p className="text-xs text-slate-400 mt-2">Verified items ensure 100% accuracy in your financial reporting.</p>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
};

export default BOQEngine;