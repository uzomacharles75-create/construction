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
    <div className="min-h-screen bg-card relative overflow-hidden">
      {/* Decorative Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/20 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[150px] rounded-full pointer-events-none" />

      <PublicNavbar />
      
      <main className="pt-32 px-6 max-w-7xl mx-auto pb-40 relative z-10">
        
        {/* MARKETPLACE HERO */}
        <section className="mb-20">
          <div className="flex flex-col md:flex-row justify-between items-end gap-12 bg-card/60 backdrop-blur-3xl border border-border/50 p-10 md:p-14 rounded-[3rem] shadow-2xl">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
              <div className="flex items-center gap-3 mb-6">
                 <div className="w-12 h-12 bg-gradient-to-br from-primary to-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg">
                    <ShoppingBag size={22} />
                 </div>
                 <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Direct Supply Chain</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-black text-foreground tracking-tighter mb-6 leading-[1.1]">
                Construction <br /> 
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-indigo-500">Marketplace</span>
              </h1>
              <p className="text-lg text-muted-foreground font-medium max-w-xl leading-relaxed">
                Source high-grade materials and heavy equipment directly from BuildHub verified suppliers. Instant procurement for your sites.
              </p>
            </motion.div>

            {/* SEARCH COMPONENT */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
              className="w-full md:w-[450px] relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary to-blue-600 rounded-[2rem] blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-500" />
              <div className="relative">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-primary" size={24} />
                <input 
                  type="text" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search materials, tools..." 
                  className="w-full bg-background/80 backdrop-blur-md border border-border rounded-[2rem] py-6 pl-16 pr-8 shadow-xl outline-none text-foreground font-semibold focus:ring-4 ring-primary/20 transition-all text-lg" 
                />
              </div>
            </motion.div>
          </div>
        </section>

        {/* RESULTS GRID */}
        {isLoading ? (
          <div className="py-40 text-center flex flex-col items-center">
            <Loader2 className="animate-spin text-primary mb-6" size={48} />
            <p className="font-black text-muted-foreground uppercase tracking-widest text-sm animate-pulse">Connecting to Suppliers...</p>
          </div>
        ) : filteredProducts?.length === 0 ? (
          <div className="text-center py-32 bg-muted/50 rounded-[4rem] border border-border border-dashed">
             <Inbox className="mx-auto text-foreground/20 mb-6" size={72} />
             <h3 className="text-3xl font-black text-foreground tracking-tight">No Materials Found</h3>
             <p className="text-muted-foreground mt-3 font-medium text-lg">Try a different search term or category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            <AnimatePresence>
              {filteredProducts?.map((p: any, idx: number) => (
                <motion.div 
                  layout
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05, duration: 0.5, ease: "easeOut" }}
                  key={p._id} 
                  className="bg-card border border-border p-4 rounded-[2.5rem] shadow-sm hover:shadow-2xl transition-all duration-500 group relative overflow-hidden"
                >
                  {/* Glowing effect on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  {/* PRODUCT IMAGE */}
                  <Link to={`/product/${p._id}`} className="block relative z-10">
                    <div className="aspect-[4/3] bg-muted rounded-[2rem] overflow-hidden mb-6 relative">
                       <img 
                        src={p.image || "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80"} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out" 
                        alt={p.name}
                       />
                       <div className="absolute top-4 left-4 bg-background/90 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-primary shadow-lg border border-primary/20">
                          {p.category}
                       </div>
                    </div>
                  </Link>

                  <div className="px-4 pb-4 relative z-10">
                     <div className="flex items-center gap-2 mb-3">
                        <Tag size={14} className="text-primary/70" />
                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest truncate">{p.supplier}</p>
                     </div>
                     <h3 className="font-black text-foreground text-xl mb-6 leading-tight group-hover:text-primary transition-colors">
                        {p.name}
                     </h3>
                     <div className="flex justify-between items-end border-t border-border/50 pt-5">
                        <div>
                           <p className="text-[10px] font-bold text-muted-foreground uppercase mb-1 tracking-widest">Price / {p.unit}</p>
                           <span className="text-3xl font-black text-foreground tracking-tighter">${p.price?.toLocaleString()}</span>
                        </div>
                        <Link 
                          to={`/product/${p._id}`}
                          className="w-14 h-14 bg-foreground text-background flex items-center justify-center rounded-[1.25rem] shadow-xl hover:bg-primary hover:text-white hover:-translate-y-1 hover:scale-105 transition-all duration-300 group/btn"
                        >
                           <ShoppingBag size={22} className="group-hover/btn:scale-110 transition-transform duration-300" />
                        </Link>
                     </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* BOTTOM PROMO */}
        <section className="mt-40 p-16 md:p-24 bg-foreground rounded-[4rem] relative overflow-hidden text-center text-background shadow-2xl">
           <div className="absolute top-[-50%] left-[-20%] w-[1000px] h-[1000px] opacity-[0.03] pointer-events-none rotate-12">
             <TrendingUp className="w-full h-full" />
           </div>
           <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 blur-[150px] rounded-full pointer-events-none" />
           
           <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="relative z-10">
              <h2 className="text-5xl md:text-6xl font-black mb-8 tracking-tighter leading-tight">
                Building at <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">Scale?</span>
              </h2>
              <p className="text-background/80 mb-12 max-w-2xl mx-auto font-medium leading-relaxed text-lg">
                Connect with our dedicated Logistics team for bulk wholesale pricing, priority site delivery, and custom supply chain management.
              </p>
              <button className="bg-primary hover:bg-blue-500 text-white px-12 py-6 rounded-3xl font-black text-sm uppercase tracking-widest shadow-[0_0_40px_rgba(37,99,235,0.4)] hover:shadow-[0_0_60px_rgba(37,99,235,0.6)] hover:-translate-y-2 transition-all flex items-center gap-3 mx-auto duration-300">
                 Request Enterprise Quote <ArrowRight size={20} />
              </button>
           </motion.div>
        </section>
      </main>
       <PublicFooter />
    </div>
  );
};

export default PublicMarketplace;