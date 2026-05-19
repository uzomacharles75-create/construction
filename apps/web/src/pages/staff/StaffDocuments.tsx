import { useQuery } from '@tanstack/react-query';
import { DashboardShell } from '../../components/layout/DashboardShell';
import apiClient from '../../api/client';
import { 
  UploadCloud, 
  Folder, 
  Search, 
  Loader2, 
  FileText, 
  ShieldCheck, 
  Layers,
  Inbox
} from 'lucide-react';
import { motion } from 'framer-motion';

const StaffDocuments = () => {
  // 1. FETCH REAL SITE DOCUMENTS
  const { data: documents, isLoading } = useQuery({
    queryKey: ['staff-documents'],
    queryFn: async () => {
      const { data } = await apiClient.get('/documents'); // Backend filters by Sarah's company/project
      return data;
    }
  });

  // 2. DYNAMIC FOLDER LOGIC (Grouping real data by category)
  const categories = [
    { 
      name: "Site Blueprints", 
      count: documents?.filter((d: any) => d.category === 'Blueprint' || d.fileType === 'DWG').length || 0,
      icon: Layers,
      color: "text-blue-600",
      bg: "bg-blue-50"
    },
    { 
      name: "Technical Manuals", 
      count: documents?.filter((d: any) => d.category === 'Manual').length || 0,
      icon: FileText,
      color: "text-purple-600",
      bg: "bg-purple-50"
    },
    { 
      name: "Daily Progress Logs", 
      count: documents?.filter((d: any) => d.category === 'Log').length || 0,
      icon: CheckCircle2, // Changed from CheckCircle for consistency
      color: "text-emerald-600",
      bg: "bg-emerald-50"
    },
    { 
      name: "Safety Permits", 
      count: documents?.filter((d: any) => d.category === 'Safety').length || 0,
      icon: ShieldCheck,
      color: "text-rose-600",
      bg: "bg-rose-50"
    },
  ];

  return (
    <DashboardShell>
      <div className="max-w-[1400px] mx-auto pb-20">
        
        {/* HEADER SECTION */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div>
            <h1 className="text-3xl font-black text-[#001529] tracking-tight">Field Documents & CAD</h1>
            <p className="text-sm text-slate-400 font-medium">Technical drawings and compliance certificates for your assigned sites.</p>
          </div>
          <button className="bg-[#001529] text-white px-8 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-900/20 hover:bg-blue-600 transition-all flex items-center gap-2">
             <UploadCloud size={18} /> Upload Site File
          </button>
        </header>

        {/* SEARCH & FILTER BAR */}
        <div className="bg-white p-2 rounded-[2rem] border border-slate-100 mb-12 flex items-center gap-4 shadow-sm focus-within:ring-4 ring-blue-50 transition-all">
           <div className="pl-6 text-slate-300"><Search size={20} /></div>
           <input type="text" placeholder="Search blueprints by Project ID or keyword..." className="flex-1 py-4 outline-none text-sm font-medium text-[#001529]" />
        </div>

        {/* DYNAMIC FOLDERS GRID */}
        {isLoading ? (
          <div className="py-20 text-center flex flex-col items-center">
            <Loader2 className="animate-spin text-blue-600 mb-4" size={40} />
            <p className="font-black text-slate-400 uppercase tracking-widest text-[10px]">Accessing Secure Field Server...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((folder, i) => (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -5 }}
                key={folder.name} 
                className="bg-white p-8 rounded-[3rem] border border-slate-50 shadow-sm hover:shadow-xl transition-all cursor-pointer group relative overflow-hidden"
              >
                 <div className="flex justify-between items-start mb-10">
                    <div className={`w-16 h-16 ${folder.bg} rounded-[1.5rem] flex items-center justify-center ${folder.color} group-hover:scale-110 transition-transform duration-500`}>
                       <folder.icon size={32} />
                    </div>
                    <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-[#001529] group-hover:text-white transition-all">
                        <Folder size={14} />
                    </div>
                 </div>
                 
                 <h4 className="font-black text-[#001529] text-lg tracking-tight">{folder.name}</h4>
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-2">
                    {folder.count} Documents Verified
                 </p>

                 {/* VISUAL ACCENT */}
                 <div className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r from-transparent via-blue-600 to-transparent w-full opacity-0 group-hover:opacity-100 transition-opacity`} />
              </motion.div>
            ))}
          </div>
        )}

        {/* EMPTY STATE LOGIC */}
        {!isLoading && documents?.length === 0 && (
           <div className="mt-12 bg-slate-50 p-20 rounded-[4rem] border-2 border-dashed border-slate-200 text-center">
              <Inbox className="mx-auto text-slate-200 mb-4" size={64} />
              <h3 className="text-xl font-black text-slate-400">Field Storage is Empty</h3>
              <p className="text-sm text-slate-400 mt-1 max-w-xs mx-auto font-medium leading-relaxed">
                Contact your project manager or upload blueprints to begin your site execution.
              </p>
           </div>
        )}

        {/* BOTTOM TECH FOOTER */}
        <div className="mt-20 pt-8 border-t border-slate-100 flex justify-between items-center opacity-50 px-4">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">BuildHub Cloud Security • 256-bit Encryption</p>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">Storage Zone: CEMAC-AFR-01</p>
        </div>
      </div>
    </DashboardShell>
  );
};

export default StaffDocuments;