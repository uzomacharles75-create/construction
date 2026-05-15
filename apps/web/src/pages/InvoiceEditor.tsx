import { useState } from 'react';
import { DashboardShell } from '../components/layout/DashboardShell';
import { 
  Plus, 
  Trash2, 
  Send, 
  ChevronLeft,
  Settings,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const InvoiceEditor = () => {
  const [items, setItems] = useState([
    { id: 1, desc: 'Foundation Work - Phase 1', qty: 1, rate: 12500 },
  ]);

  const [client, setClient] = useState({
    name: 'Vertex Real Estate',
    address: '123 Business Way, Douala',
    email: 'billing@vertex.com'
  });

  const subtotal = items.reduce((acc, item) => acc + (item.qty * item.rate), 0);
  const tax = subtotal * 0.15;
  const total = subtotal + tax;

  const addItem = () => {
    setItems([...items, { id: Date.now(), desc: '', qty: 1, rate: 0 }]);
  };

  const removeItem = (id: number) => {
    setItems(items.filter(item => item.id !== id));
  };

  return (
    <DashboardShell>
      <div className="max-w-[1400px] mx-auto h-[calc(100vh-140px)] flex flex-col">
        {/* HEADER */}
        <header className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-white rounded-full transition-colors text-slate-400">
              <ChevronLeft size={24} />
            </button>
            <h1 className="text-2xl font-black text-brand-navy tracking-tight">Create Invoice <span className="text-slate-300 ml-2 font-medium">INV-2023-001</span></h1>
          </div>
          <div className="flex items-center gap-3">
             <button className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 rounded-xl font-bold text-slate-600 text-sm hover:bg-slate-50 transition-all">
                <Settings size={18} />
                Branding
             </button>
             <button className="flex items-center gap-2 px-6 py-2.5 bg-brand-navy text-white rounded-xl font-bold text-sm shadow-xl hover:bg-slate-800 transition-all">
                <Send size={18} />
                Send Invoice
             </button>
          </div>
        </header>

        <div className="flex-1 flex gap-8 overflow-hidden">
          
          {/* LEFT: DATA ENTRY (Scrollable) */}
          <section className="w-1/2 overflow-y-auto pr-4 custom-scrollbar pb-10">
            <div className="space-y-6">
              {/* CLIENT DETAILS */}
              <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-6">Client Information</h3>
                <div className="space-y-4">
                  <input 
                    type="text" 
                    placeholder="Client Name"
                    className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 text-sm font-bold text-brand-navy focus:ring-2 focus:ring-brand-blue transition-all outline-none"
                    value={client.name}
                    onChange={(e) => setClient({...client, name: e.target.value})}
                  />
                  <input 
                    type="text" 
                    placeholder="Client Address"
                    className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 text-sm text-slate-600 focus:ring-2 focus:ring-brand-blue transition-all outline-none"
                    value={client.address}
                  />
                </div>
              </div>

              {/* LINE ITEMS */}
              <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-6">Line Items</h3>
                <div className="space-y-4">
                  <AnimatePresence>
                    {items.map((item) => (
                      <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        key={item.id} 
                        className="flex items-center gap-3"
                      >
                        <input 
                          type="text" 
                          placeholder="Description"
                          className="flex-[3] bg-slate-50 border-none rounded-2xl py-4 px-6 text-sm font-medium text-brand-navy outline-none"
                          value={item.desc}
                        />
                        <input 
                          type="number" 
                          placeholder="Qty"
                          className="flex-1 bg-slate-50 border-none rounded-2xl py-4 px-4 text-sm font-bold text-brand-navy outline-none text-center"
                          value={item.qty}
                        />
                        <input 
                          type="number" 
                          placeholder="Rate"
                          className="flex-[1.5] bg-slate-50 border-none rounded-2xl py-4 px-4 text-sm font-bold text-brand-navy outline-none text-center"
                          value={item.rate}
                        />
                        <button 
                          onClick={() => removeItem(item.id)}
                          className="p-3 text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                        >
                          <Trash2 size={18} />
                        </button>
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  <button 
                    onClick={addItem}
                    className="w-full py-4 border-2 border-dashed border-slate-100 rounded-2xl text-slate-400 font-bold text-sm hover:border-brand-blue hover:text-brand-blue transition-all flex items-center justify-center gap-2"
                  >
                    <Plus size={18} />
                    Add New Line Item
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* RIGHT: LIVE PREVIEW (The "A4" Canvas) */}
          <section className="w-1/2 bg-slate-800 rounded-[3rem] p-10 flex justify-center overflow-y-auto">
            <div className="w-[595px] h-[842px] bg-white shadow-2xl p-12 flex flex-col shrink-0">
              {/* INVOICE CONTENT */}
              <div className="flex justify-between items-start mb-16">
                <div>
                   {/* Automatically pull logo from company profile */}
                  <div className="w-12 h-12 bg-brand-navy rounded-xl flex items-center justify-center text-white font-bold text-xl mb-4">
                    B
                  </div>
                  <h2 className="text-xl font-black text-brand-navy">BuildHub Ltd.</h2>
                  <p className="text-[10px] text-slate-400 font-medium">123 Avenue, Douala, CM</p>
                </div>
                <div className="text-right">
                  <h1 className="text-4xl font-light text-slate-300 uppercase tracking-tighter mb-2">Invoice</h1>
                  <p className="text-sm font-bold text-brand-navy">#INV-2023-001</p>
                  <p className="text-[10px] text-slate-400 font-medium mt-1">October 24, 2023</p>
                </div>
              </div>

              <div className="mb-12">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-300 mb-2">Billed to</p>
                <h4 className="font-bold text-brand-navy">{client.name}</h4>
                <p className="text-[10px] text-slate-500 w-1/3">{client.address}</p>
              </div>

              <table className="w-full mb-12">
                <thead>
                  <tr className="border-b-2 border-slate-50 text-[10px] uppercase font-black text-slate-300">
                    <th className="py-4 text-left">Description</th>
                    <th className="py-4 text-center">Qty</th>
                    <th className="py-4 text-right">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={item.id} className="border-b border-slate-50">
                      <td className="py-4 text-xs font-bold text-brand-navy">{item.desc || 'New Item'}</td>
                      <td className="py-4 text-xs font-medium text-slate-500 text-center">{item.qty}</td>
                      <td className="py-4 text-xs font-bold text-brand-navy text-right">${(item.qty * item.rate).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="mt-auto flex justify-end">
                <div className="w-48 space-y-3">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Subtotal</span>
                    <span className="font-bold text-brand-navy">${subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Tax (15%)</span>
                    <span className="font-bold text-brand-navy">${tax.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-lg pt-3 border-t-2 border-brand-navy">
                    <span className="font-black text-brand-navy uppercase text-[10px] mt-1.5">Total</span>
                    <span className="font-black text-brand-navy">${total.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="mt-20 pt-8 border-t border-slate-50">
                <p className="text-[8px] text-slate-400 text-center uppercase tracking-[0.2em] font-bold">Thank you for choosing BuildHub Services</p>
              </div>
            </div>
          </section>

        </div>
      </div>
    </DashboardShell>
  );
};

export default InvoiceEditor;