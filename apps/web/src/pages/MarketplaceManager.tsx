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
  FileText
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
      <div className="max-w-[1600px] mx-auto pb-20">
        
        {/* HEADER */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
          <div>
            <h1 className="text-4xl font-black text-foreground tracking-tight">Supply Chain & Logistics</h1>
            <p className="text-sm text-muted-foreground font-medium italic underline underline-offset-4 decoration-blue-600/20">
                Manage material procurement, track deliveries, and control site spending.
            </p>
          </div>
          <Link 
            to="/dashboard/marketplace" 
            className="bg-primary text-brand-navy px-8 py-4 rounded-3xl font-black text-xs uppercase tracking-widest shadow-xl shadow-yellow hover:bg-primary-dim hover:scale-105 transition-all flex items-center gap-2"
          >
            <ShoppingBag size={18} /> Order Materials
          </Link>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* TRACKING SECTION (REAL DATA) */}
          <div className="lg:col-span-2 space-y-6">
            <h3 className="font-black text-foreground text-lg flex items-center gap-2 px-2">
                <Truck size={22} className="text-primary" /> Active Site Deliveries
            </h3>
            
            {ordersLoading ? (
              <div className="py-20 text-center animate-pulse flex flex-col items-center">
                <Loader2 className="animate-spin text-primary mb-4" size={32} />
                <p className="font-bold text-muted-foreground">Locating shipments...</p>
              </div>
            ) : orders?.length === 0 ? (
              <div className="bg-card border border-border p-20 rounded-[3rem] border-2 border-dashed border-border text-center">
                 <Package className="mx-auto text-slate-100 mb-4" size={48} />
                 <h3 className="text-xl font-bold text-muted-foreground">No active orders</h3>
                 <p className="text-xs text-foreground/35 mt-1 uppercase font-black tracking-widest">Your supply chain is currently idle</p>
              </div>
            ) : (
              <div className="space-y-4">
                {orders?.map((order: any) => (
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    key={order._id} 
                    className="bg-card border border-border p-8 rounded-[3rem] border border-border shadow-sm flex items-center justify-between hover:shadow-md transition-all group"
                  >
                    <div className="flex items-center gap-6">
                       <div className="w-16 h-16 bg-muted rounded-[1.5rem] flex items-center justify-center text-muted-foreground group-hover:bg-primary-pale group-hover:text-primary transition-colors">
                          <Package size={28} />
                       </div>
                       <div>
                          <h4 className="font-black text-foreground text-sm">{order.itemName}</h4>
                          <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-[0.1em] mt-1">
                            {order.supplier} • ID: {order.orderNumber}
                          </p>
                       </div>
                    </div>
                    <div className="flex items-center gap-6">
                       <span className={`text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest ${
                         order.status === 'In Transit' ? 'bg-primary-pale text-primary' : 'bg-amber-50 text-amber-600'
                       }`}>
                         {order.status}
                       </span>
                       <button className="p-3 bg-muted rounded-xl text-foreground/35 hover:bg-background hover:text-foreground transition-all">
                          <ChevronRight size={18} />
                       </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* ANALYTICS WIDGET (REAL DATA) */}
          <div className="space-y-6">
            <div className="bg-background p-10 rounded-[3.5rem] text-foreground shadow-2xl relative overflow-hidden h-[450px] flex flex-col justify-between">
               <div className="absolute top-[-20px] right-[-20px] opacity-5">
                  <TrendingUp size={240} />
               </div>
               
               <div className="relative z-10">
                  <p className="text-[11px] font-black text-brand-muted uppercase tracking-[0.2em] mb-3">Procurement Budget</p>
                  {statsLoading ? (
                    <div className="h-10 w-32 bg-card/10 animate-pulse rounded-lg" />
                  ) : (
                    <h2 className="text-5xl font-black italic tracking-tighter">${stats?.totalSpent?.toLocaleString() || '0.00'}</h2>
                  )}
                  <div className="mt-6 flex items-center gap-2">
                    <div className="w-full h-1.5 bg-card/10 rounded-full overflow-hidden">
                       <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${stats?.budgetUtilization || 0}%` }}
                        className="h-full bg-primary shadow-[0_0_15px_rgba(37,99,235,0.5)]" 
                       />
                    </div>
                    <span className="text-[10px] font-black text-primary">{stats?.budgetUtilization || 0}%</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-4 font-medium italic">Available Credit: ${stats?.availableCredit?.toLocaleString() || '0.00'}</p>
               </div>

               <div className="space-y-3 relative z-10">
                  <button className="w-full py-4 bg-card/10 hover:bg-card/20 transition-all rounded-2xl text-[10px] font-black uppercase tracking-widest border border-border/10 flex items-center justify-center gap-2">
                    <FileText size={14} /> Download Site Log
                  </button>
                  <button className="w-full py-4 bg-primary hover:bg-primary-dim transition-all rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg">
                    Manage Suppliers
                  </button>
               </div>
            </div>

            {/* QUICK INFO CARD */}
            <div className="bg-card border border-border p-8 rounded-[2.5rem] border border-border shadow-sm">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600">
                        <TrendingUp size={20} />
                    </div>
                    <div>
                        <h4 className="font-bold text-foreground text-sm">Efficiency Score</h4>
                        <p className="text-xs text-muted-foreground">Material waste reduced by 14%</p>
                    </div>
                </div>
            </div>
          </div>

        </div>
      </div>
    </DashboardShell>
  );
};

export default MarketplaceManager;