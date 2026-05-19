import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { PublicNavbar } from '../components/layout/PublicNavbar';
import apiClient from '../api/client';
import { 
  ShoppingBag, 
  Search, 
  Loader2, 
  Tag, 
  ArrowRight,
  TrendingUp,
  Inbox
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { PublicFooter } from '../components/layout/PublicFooter';

const PublicMarketplace = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // 1. FETCH REAL MATERIALS FROM BACKEND
  const { data: products, isLoading } = useQuery({
    queryKey: ['public-marketplace'],
    queryFn: async () => {
      const { data } = await apiClient.get('/marketplace/products');
      return data;
    }
  });

  // 2. CLIENT-SIDE SEARCH FILTER
  const filteredProducts = products?.filter((p: any) => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white">
      <PublicNavbar />
      
      <main className="pt-32 px-6 max-w-7xl mx-auto pb-40">
        
        {/* MARKETPLACE HERO */}
        <section className="mb-16">
          <div className="flex flex-col md:flex-row justify-between items-end gap-8">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
              <div className="flex items-center gap-3 mb-4">
                 <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                    <ShoppingBag size={20} />
                 </div>
                 <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-600">Direct Supply Chain</span>
              </div>
              <h1 className="text-5xl md:text-6xl font-black text-[#001529] tracking-tighter mb-4 leading-tight">
                Construction Market
              </h1>
              <p className="text-lg text-slate-400 font-medium max-w-xl">
                Source high-grade materials and heavy equipment directly from BuildHub verified suppliers.
              </p>
            </motion.div>

            {/* SEARCH COMPONENT */}
            <div className="w-full md:w-96 relative">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
              <input 
                type="text" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search zinc, cement, steel..." 
                className="w-full bg-slate-50 border border-slate-100 rounded-[2rem] py-5 pl-14 pr-6 shadow-sm outline-none text-[#001529] font-medium focus:ring-4 ring-blue-600/5 transition-all" 
              />
            </div>
          </div>
        </section>

        {/* RESULTS GRID */}
        {isLoading ? (
          <div className="py-40 text-center flex flex-col items-center">
            <Loader2 className="animate-spin text-blue-600 mb-4" size={40} />
            <p className="font-black text-slate-400 uppercase tracking-widest text-xs">Connecting to Suppliers...</p>
          </div>
        ) : filteredProducts?.length === 0 ? (
          <div className="text-center py-24 bg-slate-50 rounded-[4rem] border-2 border-dashed border-slate-100">
             <Inbox className="mx-auto text-slate-200 mb-4" size={64} />
             <h3 className="text-2xl font-black text-slate-400">No Materials Found</h3>
             <p className="text-slate-400 mt-2">Try a different search term or material category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <AnimatePresence>
              {filteredProducts?.map((p: any) => (
                <motion.div 
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  key={p._id} 
                  className="bg-white border border-slate-100 p-5 rounded-[3rem] shadow-sm hover:shadow-2xl transition-all group relative overflow-hidden"
                >
                  {/* PRODUCT IMAGE */}
                  <Link to={`/product/${p._id}`}>
                    <div className="aspect-square bg-slate-50 rounded-[2.5rem] overflow-hidden mb-6 relative">
                       <img 
                        src={p.image || "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80"} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                        alt={p.name}
                       />
                       <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[9px] font-black text-blue-600 shadow-sm border border-white/50">
                          {p.category.toUpperCase()}
                       </div>
                    </div>
                  </Link>

                  <div className="px-2">
                     <div className="flex items-center gap-2 mb-2">
                        <Tag size={12} className="text-slate-300" />
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest truncate">{p.supplier}</p>
                     </div>
                     <h3 className="font-black text-[#001529] text-lg mb-6 leading-tight group-hover:text-blue-600 transition-colors">
                        {p.name}
                     </h3>
                     <div className="flex justify-between items-end border-t border-slate-50 pt-4">
                        <div>
                           <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Price per {p.unit}</p>
                           <span className="text-3xl font-black text-[#001529] tracking-tighter">${p.price?.toLocaleString()}</span>
                        </div>
                        <Link 
                          to={`/product/${p._id}`}
                          className="bg-[#001529] text-white p-4 rounded-2xl shadow-xl shadow-blue-900/10 hover:bg-blue-600 hover:scale-110 transition-all active:scale-95"
                        >
                           <ShoppingBag size={20} />
                        </Link>
                     </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* BOTTOM PROMO */}
        <section className="mt-32 p-16 bg-[#001529] rounded-[5rem] relative overflow-hidden text-center text-white">
           <div className="absolute top-[-20%] left-[-10%] opacity-5"><TrendingUp size={400} /></div>
           <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
              <h2 className="text-4xl font-black mb-6 tracking-tight italic">Building at scale?</h2>
              <p className="text-blue-200 mb-10 max-w-lg mx-auto font-medium leading-relaxed">
                Connect with our Logistics team for bulk wholesale pricing and dedicated site delivery.
              </p>
              <button className="bg-blue-600 text-white px-10 py-5 rounded-[1.5rem] font-black text-xs uppercase tracking-widest shadow-2xl hover:bg-blue-700 transition-all flex items-center gap-3 mx-auto">
                 Request Enterprise Quote <ArrowRight size={16} />
              </button>
           </motion.div>
        </section>
      </main>
       <PublicFooter />
    </div>
  );
};

export default PublicMarketplace;