import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { DashboardShell } from '../components/layout/DashboardShell';
import apiClient from '../api/client';
import { 
  Search, 
  UploadCloud, 
  FolderPlus, 
  MoreVertical,
  FileText,
  Image as ImageIcon,
  Loader2,
  Inbox
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const DocItem = ({ doc }: any) => {
  const isImage = doc.fileType === 'Image' || doc.name.match(/\.(jpg|jpeg|png|webp)$/i);
  
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -5 }}
      className="bg-white p-6 rounded-[2.5rem] border border-slate-50 shadow-sm hover:shadow-xl transition-all group flex flex-col justify-between"
    >
      <div className="flex justify-between items-start mb-6">
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
          isImage ? 'bg-blue-50 text-blue-600' : 'bg-rose-50 text-rose-500'
        }`}>
          {isImage ? <ImageIcon size={28} /> : <FileText size={28} />}
        </div>
        <button className="text-slate-300 group-hover:text-[#001529] transition-colors">
          <MoreVertical size={18} />
        </button>
      </div>
      <div>
        <h4 className="font-bold text-[#001529] text-sm truncate mb-1" title={doc.name}>
          {doc.name}
        </h4>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
          {doc.fileSize || 'N/A'} • {new Date(doc.createdAt).toLocaleDateString()}
        </p>
      </div>
    </motion.div>
  );
};

const Documents = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // 1. FETCH DOCUMENTS FROM DATABASE
  const { data: documents, isLoading } = useQuery({
    queryKey: ['company-documents'],
    queryFn: async () => {
      const { data } = await apiClient.get('/documents');
      return data;
    }
  });

  // 2. FILTER LOGIC
  const filteredDocs = documents?.filter((doc: any) => 
    doc.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 3. DYNAMIC STATS CALCULATION
  const stats = {
    drawings: documents?.filter((d: any) => d.name.toLowerCase().includes('blueprint') || d.fileType === 'DWG').length || 0,
    contracts: documents?.filter((d: any) => d.name.toLowerCase().includes('contract')).length || 0,
    invoices: documents?.filter((d: any) => d.name.toLowerCase().includes('inv')).length || 0,
    photos: documents?.filter((d: any) => d.fileType === 'Image').length || 0,
  };

  return (
    <DashboardShell>
      <div className="max-w-7xl mx-auto pb-20">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-black text-[#001529] tracking-tight">Cloud Documents</h1>
            <p className="text-sm text-slate-400 font-medium">Secure storage for company blueprints and project files.</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="hidden md:flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 text-slate-500 rounded-2xl font-bold text-xs hover:bg-slate-50 transition-all">
              <FolderPlus size={18} /> New Folder
            </button>
            <button className="bg-[#001529] text-white px-8 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-900/20 flex items-center gap-2 hover:bg-blue-600 transition-all">
              <UploadCloud size={18} /> Upload File
            </button>
          </div>
        </header>

        {/* DYNAMIC STORAGE STATS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {[
            { label: 'Drawings', val: stats.drawings, color: 'text-blue-600' },
            { label: 'Contracts', val: stats.contracts, color: 'text-purple-600' },
            { label: 'Invoices', val: stats.invoices, color: 'text-emerald-600' },
            { label: 'Photos', val: stats.photos, color: 'text-amber-600' },
          ].map((stat, i) => (
            <div key={i} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
               <h3 className={`text-2xl font-black ${stat.color}`}>{stat.val} <span className="text-[10px] text-slate-300">Files</span></h3>
            </div>
          ))}
        </div>

        {/* SEARCH BAR */}
        <div className="relative mb-12">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
          <input 
            type="text" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by file name, project ID or extension..." 
            className="w-full bg-white border border-slate-100 rounded-[2.5rem] py-5 pl-16 pr-6 shadow-premium outline-none text-[#001529] font-medium focus:ring-4 ring-blue-50 transition-all"
          />
        </div>

        {/* FILE GRID (REAL DATA) */}
        {isLoading ? (
          <div className="py-20 text-center flex flex-col items-center">
            <Loader2 className="animate-spin text-blue-600 mb-4" size={40} />
            <p className="font-bold text-slate-400">Accessing Cloud Storage...</p>
          </div>
        ) : filteredDocs?.length === 0 ? (
          <div className="bg-white p-20 rounded-[4rem] text-center border-2 border-dashed border-slate-100">
             <Inbox className="mx-auto text-slate-100 mb-4" size={64} />
             <h3 className="text-xl font-bold text-slate-400">No documents found</h3>
             <p className="text-sm text-slate-300 mt-1">Upload your first file to get started</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <AnimatePresence>
              {filteredDocs?.map((doc: any) => (
                <DocItem key={doc._id} doc={doc} />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </DashboardShell>
  );
};

export default Documents;