
import { PublicNavbar } from '../components/layout/PublicNavbar';
import { Truck, ShieldCheck, ArrowLeft, Package, Star } from 'lucide-react';

const MarketplaceProduct = () => {
  return (
    <div className="min-h-screen bg-white">
      <PublicNavbar />
      <main className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
        <button className="flex items-center gap-2 text-slate-400 font-bold text-xs uppercase tracking-widest mb-10 hover:text-brand-navy transition-colors">
          <ArrowLeft size={16} /> Back to Marketplace
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          {/* IMAGE CANVAS */}
          <div className="aspect-square bg-slate-100 rounded-[3.5rem] overflow-hidden shadow-2xl border border-slate-50">
             <img src="https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80" className="w-full h-full object-cover" alt="Product" />
          </div>

          {/* PRODUCT SPECS */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="px-3 py-1 bg-blue-50 text-brand-blue rounded-full text-[10px] font-black uppercase tracking-widest">In Stock</span>
              <div className="flex items-center gap-1 text-amber-500 ml-2">
                <Star size={14} fill="currentColor" />
                <span className="text-xs font-bold">4.8 (2.4k Sold)</span>
              </div>
            </div>
            
            <h1 className="text-5xl font-black text-brand-navy tracking-tight mb-2">Portland Cement 42.5R</h1>
            <p className="text-xl text-slate-400 font-medium mb-8">Manufactured by Dangote Group Africa</p>

            <div className="flex items-end gap-3 mb-12">
               <span className="text-5xl font-black text-brand-navy">$8.50</span>
               <span className="text-slate-400 font-bold mb-2">/ Per Bag</span>
            </div>

            <div className="space-y-4 mb-12">
               <div className="flex items-center gap-4 p-5 bg-slate-50 rounded-2xl border border-slate-100">
                  <Truck className="text-brand-blue" />
                  <div>
                    <p className="text-sm font-bold text-brand-navy">Fast Delivery Available</p>
                    <p className="text-xs text-slate-400">Estimated 2-3 days to Douala/Yaoundé</p>
                  </div>
               </div>
               <div className="flex items-center gap-4 p-5 bg-slate-50 rounded-2xl border border-slate-100">
                  <ShieldCheck className="text-emerald-500" />
                  <div>
                    <p className="text-sm font-bold text-brand-navy">Verified Supplier</p>
                    <p className="text-xs text-slate-400">100% genuine product guarantee</p>
                  </div>
               </div>
            </div>

            <div className="flex gap-4">
               <button className="flex-1 bg-brand-navy text-white py-5 rounded-2xl font-black text-lg shadow-xl hover:bg-slate-800 transition-all flex items-center justify-center gap-3">
                 <Package size={20} /> Request Bulk Quote
               </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MarketplaceProduct;