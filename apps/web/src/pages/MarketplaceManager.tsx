import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { DashboardShell } from '../components/layout/DashboardShell';
import apiClient from '../api/client';
import { 
  ShoppingBag, 
  Truck, 
  Package, 
  ChevronRight, 
  Loader2, 
  TrendingUp,
  FileText,
  Clock
} from 'lucide-react';
import { motion } from 'framer-motion';

const MarketplaceManager = () => {
  // 1. FETCH ACTIVE SHIPMENTS
  const { data: orders, isLoading: ordersLoading } = useQuery({
    queryKey: ['active-shipments'],
    queryFn: async () => {
      const { data } = await apiClient.get('/marketplace/orders'); // Real Backend Route
      return data;
    }
  });

  // 2. FETCH PROCUREMENT STATS
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['procurement-stats'],
    queryFn: async () => {
      const { data } = await apiClient.get('/marketplace/stats'); // Real Backend Route
      return data;
    }
  });

  return (
    <DashboardShell>
      <div className="max-w-[1600px] mx-auto pb-20 relative">
        
        {/* Background Glows */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 blur-[150px] rounded-full pointer-events-none" />
        
        {/* HEADER */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end mb-14 gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.8)]" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Logistics Active</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-foreground tracking-tight leading-tight">
              Supply Chain <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-500">& Logistics</span>
            </h1>
            <p className="text-sm text-muted-foreground font-medium mt-3 max-w-lg">
                Manage material procurement, track active deliveries, and control your site spending limits in real time.
            </p>
          </div>
          <Link 
            to="/dashboard/marketplace" 
            className="bg-primary text-white px-8 py-4 rounded-[1.5rem] font-black text-xs uppercase tracking-widest shadow-[0_0_30px_rgba(37,99,235,0.3)] hover:shadow-[0_0_50px_rgba(37,99,235,0.5)] hover:-translate-y-1 hover:scale-105 transition-all duration-300 flex items-center gap-2"
          >
            <ShoppingBag size={18} /> New Order
          </Link>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
          
          {/* TRACKING SECTION */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between px-2">
              <h3 className="font-black text-foreground text-xl flex items-center gap-3">
                  <div className="w-10 h-10 rounded-[1rem] bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center text-white shadow-lg">
                    <Truck size={20} />
                  </div>
                  Active Deliveries
              </h3>
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                {orders?.length || 0} In Transit
              </span>
            </div>
            
            {ordersLoading ? (
              <div className="py-20 text-center animate-pulse flex flex-col items-center">
                <Loader2 className="animate-spin text-primary mb-4" size={32} />
                <p className="font-bold text-muted-foreground">Locating shipments...</p>
              </div>
            ) : orders?.length === 0 ? (
              <div className="bg-card/50 backdrop-blur-md border border-border/50 p-20 rounded-[3rem] border-dashed text-center">
                 <Package className="mx-auto text-foreground/20 mb-6" size={56} />
                 <h3 className="text-2xl font-black text-foreground tracking-tight">No active orders</h3>
                 <p className="text-sm text-muted-foreground mt-2 font-medium">Your supply chain is currently idle.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {orders?.map((order: any, idx: number) => (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1, duration: 0.5 }}
                    key={order._id} 
                    className="bg-card/80 backdrop-blur-md border border-border/50 p-6 rounded-[2.5rem] shadow-sm hover:shadow-xl transition-all duration-300 group relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-6">
                         <div className="w-16 h-16 bg-muted rounded-[1.5rem] flex items-center justify-center text-muted-foreground group-hover:bg-primary group-hover:text-white transition-all duration-300 shadow-sm group-hover:shadow-lg group-hover:scale-110">
                            <Package size={28} />
                         </div>
                         <div>
                            <h4 className="font-black text-foreground text-lg">{order.itemName}</h4>
                            <div className="flex items-center gap-2 mt-1 opacity-70">
                              <Clock size={12} className="text-muted-foreground" />
                              <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-[0.1em]">
                                {order.supplier} • #{order.orderNumber}
                              </p>
                            </div>
                         </div>
                      </div>
                      
                      <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto mt-4 sm:mt-0 border-t sm:border-t-0 border-border/50 pt-4 sm:pt-0">
                         <div className="flex items-center gap-2">
                           <span className={`w-2 h-2 rounded-full animate-pulse ${order.status === 'In Transit' ? 'bg-primary' : 'bg-amber-500'}`} />
                           <span className={`text-[10px] font-black uppercase tracking-widest ${
                             order.status === 'In Transit' ? 'text-primary' : 'text-amber-600'
                           }`}>
                             {order.status}
                           </span>
                         </div>
                         <button className="w-12 h-12 bg-muted rounded-[1.25rem] flex items-center justify-center text-foreground/40 hover:bg-foreground hover:text-background hover:scale-110 transition-all duration-300 shadow-sm">
                            <ChevronRight size={20} />
                         </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* ANALYTICS WIDGET */}
          <div className="space-y-6">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="bg-gradient-to-br from-slate-900 to-black p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden h-[460px] flex flex-col justify-between border border-white/10 group"
            >
               {/* High-tech glow effects */}
               <div className="absolute top-[-50px] right-[-50px] w-[200px] h-[200px] bg-primary/40 blur-[80px] rounded-full pointer-events-none group-hover:scale-150 transition-transform duration-1000" />
               <div className="absolute bottom-[-50px] left-[-50px] w-[200px] h-[200px] bg-blue-500/30 blur-[80px] rounded-full pointer-events-none group-hover:scale-150 transition-transform duration-1000 delay-100" />
               
               <div className="absolute top-4 right-4 opacity-10">
                  <TrendingUp size={180} />
               </div>
               
               <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_10px_rgba(52,211,153,0.8)]" />
                    <p className="text-[10px] font-black text-white/50 uppercase tracking-[0.2em]">Procurement Budget</p>
                  </div>
                  
                  {statsLoading ? (
                    <div className="h-14 w-40 bg-white/10 animate-pulse rounded-xl" />
                  ) : (
                    <h2 className="text-5xl md:text-6xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-white/60">
                      ${stats?.totalSpent?.toLocaleString() || '0.00'}
                    </h2>
                  )}
                  
                  <div className="mt-8 flex items-center gap-4">
                    <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden shadow-inner">
                       <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${stats?.budgetUtilization || 0}%` }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        className="h-full bg-gradient-to-r from-primary to-blue-400 shadow-[0_0_15px_rgba(37,99,235,0.8)] relative"
                       >
                         <div className="absolute top-0 right-0 bottom-0 w-10 bg-gradient-to-r from-transparent to-white/50" />
                       </motion.div>
                    </div>
                    <span className="text-sm font-black text-white drop-shadow-md">{stats?.budgetUtilization || 0}%</span>
                  </div>
                  <p className="text-xs text-white/60 mt-4 font-semibold uppercase tracking-widest">
                    Available Credit: <span className="text-emerald-400">${stats?.availableCredit?.toLocaleString() || '0.00'}</span>
                  </p>
               </div>

               <div className="space-y-3 relative z-10">
                  <button className="w-full py-4 bg-white/5 hover:bg-white/10 backdrop-blur-md transition-all rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest border border-white/10 flex items-center justify-center gap-2 group/btn">
                    <FileText size={16} className="text-white/50 group-hover/btn:text-white transition-colors" /> Download Log
                  </button>
                  <button className="w-full py-4 bg-gradient-to-r from-primary to-blue-600 hover:from-primary-dim hover:to-blue-700 transition-all rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:shadow-[0_0_30px_rgba(37,99,235,0.6)]">
                    Manage Suppliers
                  </button>
               </div>
            </motion.div>

            {/* QUICK INFO CARD */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-card border border-border p-8 rounded-[2.5rem] shadow-sm hover:shadow-xl transition-all duration-300 relative overflow-hidden group"
            >
                <div className="absolute right-0 top-0 w-32 h-32 bg-emerald-500/5 rounded-bl-[100px] pointer-events-none transition-transform duration-500 group-hover:scale-110" />
                <div className="flex items-center gap-5 relative z-10">
                    <div className="w-14 h-14 bg-emerald-50 rounded-[1.25rem] flex items-center justify-center text-emerald-600 shadow-sm border border-emerald-100 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                        <TrendingUp size={24} />
                    </div>
                    <div>
                        <h4 className="font-black text-foreground text-lg tracking-tight">Efficiency Score</h4>
                        <p className="text-xs text-muted-foreground font-semibold mt-1">Material waste reduced by 14%</p>
                    </div>
                </div>
            </motion.div>
          </div>

        </div>
      </div>
    </DashboardShell>
  );
};

export default MarketplaceManager;