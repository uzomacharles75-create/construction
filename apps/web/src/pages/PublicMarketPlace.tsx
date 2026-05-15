import { PublicNavbar } from '../components/layout/PublicNavbar';
import { Search } from 'lucide-react';

const PublicMarketplace = () => {
  return (
    <div className="min-h-screen bg-white">
      <PublicNavbar />
      
      <main className="pt-32 px-6 max-w-7xl mx-auto pb-20">
        <div className="flex justify-between items-end mb-12">
           <div>
              <h1 className="text-5xl font-black text-[#001529] tracking-tighter mb-4">Construction Market</h1>
              <p className="text-slate-500 font-medium">Verified materials and equipment from across Africa.</p>
           </div>
           <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center gap-3">
              <Search size={20} className="text-slate-300" />
              <input type="text" placeholder="Search materials..." className="bg-transparent outline-none text-sm font-medium" />
           </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
           {[1, 2, 3, 4].map(i => (
             <div key={i} className="bg-white border border-slate-100 p-4 rounded-[2.5rem] shadow-sm hover:shadow-2xl transition-all group">
                <div className="aspect-square bg-slate-100 rounded-[2rem] overflow-hidden mb-6">
                   <img src="https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80" className="w-full h-full object-cover" />
                </div>
                <div className="px-2">
                   <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1">Dangote Group</p>
                   <h3 className="font-bold text-slate-800 text-lg mb-4">Portland Cement 42.5R</h3>
                   <div className="flex justify-between items-center">
                      <span className="text-2xl font-black text-slate-800">$8.50</span>
                      <button className="bg-[#001529] text-white px-6 py-2 rounded-xl text-[10px] font-black uppercase">Buy</button>
                   </div>
                </div>
             </div>
           ))}
        </div>
      </main>
    </div>
  );
};

export default PublicMarketplace;