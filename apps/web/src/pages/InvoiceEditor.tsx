import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { DashboardShell } from '../components/layout/DashboardShell';
import { useAuthStore } from '../store/useAuthStore';
import apiClient from '../api/client';
import { 
  Plus, 
  Trash2, 
  Send, 
  ChevronLeft,
  Settings,
  Loader2,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const InvoiceEditor = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuthStore(); // Pulling your real company branding

  // 1. STATE FOR DYNAMIC DATA
  const [items, setItems] = useState([
    { id: Date.now(), desc: '', qty: 1, rate: 0 },
  ]);

  const [client, setClient] = useState({
    name: '',
    address: '',
    email: ''
  });

  // 2. REAL-TIME CALCULATIONS
  const subtotal = items.reduce((acc, item) => acc + (item.qty * item.rate), 0);
  const tax = subtotal * 0.15; // 15% VAT
  const total = subtotal + tax;

  // 3. BACKEND INTEGRATION (Save to MongoDB)
  const createInvoiceMutation = useMutation({
    mutationFn: (invoiceData: any) => apiClient.post('/invoices', invoiceData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices-list'] });
      navigate('/dashboard/finance'); // Go back to finance hub after saving
    }
  });

  const addItem = () => {
    setItems([...items, { id: Date.now(), desc: '', qty: 1, rate: 0 }]);
  };

  const removeItem = (id: number) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  const updateItem = (id: number, field: string, value: any) => {
    setItems(items.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const handleSave = () => {
    if (!client.name) return alert("Please enter a client name.");
    
    createInvoiceMutation.mutate({
      client,
      items: items.map(({ desc, qty, rate }) => ({ description: desc, quantity: qty, rate, total: qty * rate })),
      subtotal,
      totalAmount: total,
      status: 'Pending'
    });
  };

  return (
    <DashboardShell>
      <motion.div layout className="max-w-[1400px] mx-auto min-h-0 flex flex-col">
        
        {/* HEADER */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 sm:mb-6 shrink-0">
          <motion.div layout className="flex items-center gap-3 sm:gap-4 min-w-0">
            <button onClick={() => navigate(-1)} className="p-2 hover:bg-brand-navy-card rounded-full transition-colors text-white/50">
              <ChevronLeft size={24} />
            </button>
            <h1 className="text-lg sm:text-2xl font-black text-white tracking-tight truncate">Generate Document</h1>
          </motion.div>
          <motion.div layout className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto shrink-0">
             <button className="hidden md:flex items-center gap-2 px-5 py-2.5 bg-brand-navy-card border border-brand-border rounded-xl font-bold text-white/50 text-xs hover:bg-brand-navy-light transition-all">
                <Settings size={16} /> Branding
             </button>
             <button 
                onClick={handleSave}
                disabled={createInvoiceMutation.isPending}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 sm:px-8 py-3 bg-brand-yellow text-brand-navy rounded-xl font-black text-xs uppercase tracking-widest shadow-xl shadow-yellow hover:bg-brand-yellow-dim transition-all"
             >
                {createInvoiceMutation.isPending ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                {createInvoiceMutation.isPending ? 'Saving...' : 'Issue Invoice'}
             </button>
          </motion.div>
        </header>

        <motion.div layout className="flex-1 flex flex-col lg:flex-row gap-6 lg:gap-8 overflow-hidden min-h-0">
          
          {/* LEFT: DATA ENTRY */}
          <section className="w-full lg:w-1/2 overflow-y-auto lg:pr-4 custom-scrollbar pb-6 lg:pb-10 max-h-[50vh] lg:max-h-none">
            <div className="space-y-6">
              {/* CLIENT DETAILS */}
              <div className="bg-brand-navy-card border border-brand-border p-8 rounded-[2.5rem] border border-brand-border shadow-sm">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50 mb-6 px-1">Recipient Information</h3>
                <div className="space-y-4">
                  <input 
                    type="text" 
                    placeholder="Client or Project Name"
                    className="w-full bg-brand-navy-light border-none rounded-2xl py-4 px-6 text-sm font-bold text-white focus:ring-2 focus:ring-brand-yellow/40 outline-none"
                    value={client.name}
                    onChange={(e) => setClient({...client, name: e.target.value})}
                  />
                  <input 
                    type="text" 
                    placeholder="Billing Address"
                    className="w-full bg-brand-navy-light border-none rounded-2xl py-4 px-6 text-sm text-white/70 focus:ring-2 focus:ring-brand-yellow/40 outline-none"
                    value={client.address}
                    onChange={(e) => setClient({...client, address: e.target.value})}
                  />
                </div>
              </div>

              {/* LINE ITEMS */}
              <div className="bg-brand-navy-card border border-brand-border p-8 rounded-[2.5rem] border border-brand-border shadow-sm">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50 mb-6 px-1">Invoice Line Items</h3>
                <div className="space-y-4">
                  <AnimatePresence>
                    {items.map((item) => (
                      <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} key={item.id} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
                        <input 
                          type="text" 
                          placeholder="Description"
                          className="flex-[3] bg-brand-navy-light border-none rounded-2xl py-4 px-6 text-xs font-medium text-white outline-none"
                          value={item.desc}
                          onChange={(e) => updateItem(item.id, 'desc', e.target.value)}
                        />
                        <input 
                          type="number" 
                          placeholder="Qty"
                          className="flex-1 bg-brand-navy-light border-none rounded-2xl py-4 px-2 text-xs font-black text-white outline-none text-center"
                          value={item.qty}
                          onChange={(e) => updateItem(item.id, 'qty', parseInt(e.target.value) || 0)}
                        />
                        <input 
                          type="number" 
                          placeholder="Rate"
                          className="flex-[1.5] bg-brand-navy-light border-none rounded-2xl py-4 px-2 text-xs font-black text-white outline-none text-center"
                          value={item.rate}
                          onChange={(e) => updateItem(item.id, 'rate', parseInt(e.target.value) || 0)}
                        />
                        <button onClick={() => removeItem(item.id)} className="p-3 text-rose-500 hover:bg-rose-50 rounded-xl transition-all"><Trash2 size={18} /></button>
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  <button onClick={addItem} className="w-full py-4 border-2 border-dashed border-brand-border rounded-2xl text-white/50 font-bold text-[10px] uppercase tracking-widest hover:border-brand-yellow hover:text-brand-yellow transition-all flex items-center justify-center gap-2">
                    <Plus size={14} /> Add Line Item
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* RIGHT: LIVE PREVIEW (THE A4 CANVAS) */}
          <section className="w-full lg:w-1/2 bg-brand-navy rounded-2xl sm:rounded-[3rem] p-4 sm:p-10 flex justify-center overflow-x-auto overflow-y-auto custom-scrollbar shadow-inner min-h-[320px] lg:min-h-0">
            <motion.div layout className="w-full max-w-[595px] min-h-[600px] sm:min-h-[842px] bg-brand-navy-card shadow-2xl p-6 sm:p-14 flex flex-col shrink-0">
              
              {/* AUTOMATIC BRANDING FROM AUTH STORE */}
              <div className="flex justify-between items-start mb-16">
                <div>
                  <div className="w-14 h-14 bg-brand-navy rounded-2xl flex items-center justify-center text-white font-black text-xl italic mb-6">
                    {user?.company?.charAt(0) || 'B'}
                  </div>
                  <h2 className="text-xl font-black text-white">{user?.company || 'My Company'}</h2>
                  <p className="text-[10px] text-white/50 font-bold uppercase tracking-tighter italic">BuildHub Premium Member</p>
                </div>
                <div className="text-right">
                  <h1 className="text-5xl font-light text-white/15 uppercase tracking-tighter mb-4">Invoice</h1>
                  <p className="text-sm font-black text-white">#DRAFT-{new Date().getFullYear()}</p>
                  <p className="text-[10px] text-white/50 font-bold mt-1 uppercase tracking-widest">{new Date().toLocaleDateString()}</p>
                </div>
              </div>

              <div className="mb-12">
                <p className="text-[9px] font-black uppercase tracking-widest text-white/35 mb-2">Billed to</p>
                <h4 className="font-black text-white text-sm uppercase">{client.name || 'Recipient Name'}</h4>
                <p className="text-[10px] text-brand-muted w-2/3 leading-relaxed mt-1">{client.address || 'Recipient Address'}</p>
              </div>

              <table className="w-full mb-12">
                <thead>
                  <tr className="border-b-2 border-brand-border text-[9px] uppercase font-black text-white">
                    <th className="py-4 text-left">Item Description</th>
                    <th className="py-4 text-center">Qty</th>
                    <th className="py-4 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-border">
                  {items.map((item) => (
                    <tr key={item.id}>
                      <td className="py-4 text-xs font-bold text-white/90">{item.desc || 'Untitled Service'}</td>
                      <td className="py-4 text-xs font-medium text-white/50 text-center">{item.qty}</td>
                      <td className="py-4 text-xs font-black text-white text-right">${(item.qty * item.rate).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="mt-auto flex justify-end">
                <div className="w-56 space-y-3 pt-6 border-t-4 border-brand-border">
                  <div className="flex justify-between text-[10px] font-bold text-white/50 uppercase tracking-widest">
                    <span>Subtotal</span>
                    <span className="text-white">${subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-[10px] font-bold text-white/50 uppercase tracking-widest">
                    <span>Tax (15%)</span>
                    <span className="text-white">${tax.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-xl pt-4 border-t border-brand-border">
                    <span className="font-black text-white uppercase text-xs mt-1.5 tracking-tighter">Total Amount</span>
                    <span className="font-black text-brand-yellow">${total.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <motion.div layout className="mt-20 pt-10 border-t border-brand-border text-center">
                <p className="text-[9px] text-white/35 font-bold uppercase tracking-[0.3em]">BuildHub Digital Document • Securing African Infrastructure</p>
              </motion.div>
            </motion.div>
          </section>

        </motion.div>
      </motion.div>
    </DashboardShell>
  );
};

export default InvoiceEditor;