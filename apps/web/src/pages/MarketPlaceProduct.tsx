import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { PublicNavbar } from '../components/layout/PublicNavbar';
import apiClient from '../api/client';
import { 
  Truck, 
  ShieldCheck, 
  ArrowLeft, 
  Package, 
  Star, 
  Loader2, 
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import { motion } from 'framer-motion';

const MarketplaceProduct = () => {
  const { id } = useParams(); // Get product ID from URL
  const navigate = useNavigate();

  // 1. FETCH REAL PRODUCT DATA FROM BACKEND
  const { data: product, isLoading, isError } = useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      const { data } = await apiClient.get(`/marketplace/products/${id}`);
      return data;
    },
    enabled: !!id
  });

  // 2. HANDLE LOADING STATE (Apple-style clean loader)
  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin text-blue-600 mb-4 mx-auto" size={40} />
          <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Accessing Supply Database...</p>
        </div>
      </div>
    );
  }

  // 3. HANDLE ERROR OR 404
  if (isError || !product) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-6">
        <div className="max-w-md text-center">
          <AlertCircle className="text-rose-500 mx-auto mb-4" size={48} />
          <h2 className="text-2xl font-black text-[#001529]">Product Not Found</h2>
          <p className="text-slate-500 mt-2 mb-8">The material or equipment you're looking for might have been delisted or moved.</p>
          <button onClick={() => navigate('/marketplace')} className="bg-[#001529] text-white px-8 py-3 rounded-xl font-bold text-xs">
            Back to Marketplace
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <PublicNavbar />
      
      <main className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
        <motion.button 
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-400 font-black text-[10px] uppercase tracking-[0.2em] mb-10 hover:text-[#001529] transition-colors group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> 
          Back to Results
        </motion.button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          
          {/* IMAGE CANVAS (REAL CLOUDINARY URL) */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="aspect-square bg-slate-50 rounded-[3.5rem] overflow-hidden shadow-2xl border border-slate-100 flex items-center justify-center relative"
          >
             <img 
               src={product.image || "https://via.placeholder.com/600"} 
               className="w-full h-full object-cover" 
               alt={product.name} 
             />
             {!product.inStock && (
               <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center">
                  <span className="bg-rose-500 text-white px-8 py-3 rounded-2xl font-black uppercase tracking-widest shadow-xl">Out of Stock</span>
               </div>
             )}
          </motion.div>

          {/* PRODUCT SPECS */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center gap-2 mb-4">
              <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                product.inStock ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'
              }`}>
                {product.inStock ? 'Available' : 'Restocking Soon'}
              </span>
              <div className="flex items-center gap-1 text-amber-500 ml-2">
                <Star size={14} fill="currentColor" />
                <span className="text-[10px] font-black text-slate-600">{product.rating || '4.8'} Verified</span>
              </div>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-black text-[#001529] tracking-tight mb-2 leading-tight">
              {product.name}
            </h1>
            <p className="text-xl text-slate-400 font-medium mb-8">
              Supplied by <span className="text-blue-600 underline font-bold cursor-pointer">{product.supplier}</span>
            </p>

            <div className="flex items-end gap-3 mb-12 bg-slate-50 p-6 rounded-[2rem] border border-slate-100 w-fit">
               <span className="text-5xl font-black text-[#001529] tracking-tighter">${product.price?.toLocaleString()}</span>
               <span className="text-slate-400 font-bold mb-2 uppercase text-xs tracking-widest">/ Per {product.unit}</span>
            </div>

            <div className="space-y-4 mb-12">
               <div className="flex items-center gap-5 p-6 bg-white rounded-3xl border border-slate-100 shadow-sm">
                  <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
                    <Truck size={24} />
                  </div>
                  <div>
                    <p className="text-sm font-black text-[#001529]">Regional Logistics</p>
                    <p className="text-xs text-slate-400 font-medium">Estimated 3-5 days delivery to active sites.</p>
                  </div>
               </div>
               <div className="flex items-center gap-5 p-6 bg-white rounded-3xl border border-slate-100 shadow-sm">
                  <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600">
                    <ShieldCheck size={24} />
                  </div>
                  <div>
                    <p className="text-sm font-black text-[#001529]">Authenticity Guarantee</p>
                    <p className="text-xs text-slate-400 font-medium">100% genuine material certs included.</p>
                  </div>
               </div>
            </div>

            {/* ACTION FOOTER */}
            <div className="flex flex-col sm:flex-row gap-4">
               <button 
                disabled={!product.inStock}
                className="flex-1 bg-[#001529] text-white py-5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl shadow-blue-900/20 hover:bg-blue-700 disabled:bg-slate-200 transition-all flex items-center justify-center gap-3"
               >
                 <Package size={20} /> Request Bulk Quote
               </button>
               <button className="px-10 py-5 bg-white text-[#001529] font-black text-xs uppercase tracking-widest rounded-2xl border-2 border-[#001529] hover:bg-slate-50 transition-all">
                 Contact Rep
               </button>
            </div>
            
            <div className="mt-8 flex items-center gap-2 justify-center lg:justify-start text-[10px] font-black text-slate-300 uppercase tracking-widest">
              <CheckCircle2 size={12} className="text-emerald-500" /> Secure BuildHub Transaction
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default MarketplaceProduct;