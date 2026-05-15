
import { DashboardShell } from '../components/layout/DashboardShell';
import { 
  Search, 
  UploadCloud, 
  FolderPlus, 
  MoreVertical,
  FileText,
  Image as ImageIcon,
} from 'lucide-react';

const DocItem = ({ name, type, size, date }: any) => (
  <div className="bg-white p-6 rounded-[2rem] border border-slate-100 hover:shadow-xl transition-all group flex flex-col justify-between">
    <div className="flex justify-between items-start mb-4">
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
        type === 'pdf' ? 'bg-rose-50 text-rose-500' : 'bg-blue-50 text-blue-500'
      }`}>
        {type === 'pdf' ? <FileText size={28} /> : <ImageIcon size={28} />}
      </div>
      <button className="text-slate-300 group-hover:text-brand-navy"><MoreVertical size={18} /></button>
    </div>
    <div>
      <h4 className="font-bold text-brand-navy text-sm truncate mb-1">{name}</h4>
      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{size} • {date}</p>
    </div>
  </div>
);

const Documents = () => {
  return (
    <DashboardShell>
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-black text-brand-navy tracking-tight">Documents</h1>
            <p className="text-slate-500">Secure cloud storage for blueprints and legal files.</p>
          </div>
          <div className="flex gap-3">
            <button className="bg-white px-5 py-3 rounded-2xl border border-slate-200 text-slate-400 font-bold flex items-center gap-2 hover:bg-slate-50 transition-all">
              <FolderPlus size={18} />
              New Folder
            </button>
            <button className="bg-brand-navy text-white px-8 py-3 rounded-2xl font-bold shadow-xl flex items-center gap-2 hover:scale-105 transition-transform">
              <UploadCloud size={18} />
              Upload File
            </button>
          </div>
        </header>

        {/* STORAGE STATS */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12">
          {['Drawings', 'Contracts', 'Invoices', 'Site Photos'].map((cat, i) => (
            <div key={i} className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{cat}</p>
               <h3 className="text-xl font-bold text-brand-navy">124 Files</h3>
            </div>
          ))}
        </div>

        {/* SEARCH BAR */}
        <div className="relative mb-12">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder="Search documents by name or project..." 
            className="w-full bg-white border-none rounded-[2rem] py-5 pl-16 pr-6 shadow-premium outline-none text-brand-navy font-medium"
          />
        </div>

        {/* FILE GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <DocItem name="Foundation_Layout.pdf" type="pdf" size="4.2 MB" date="Oct 20, 2023" />
          <DocItem name="Client_Contract_v1.pdf" type="pdf" size="1.1 MB" date="Oct 18, 2023" />
          <DocItem name="Site_Visit_Photo_01.jpg" type="img" size="8.5 MB" date="Oct 22, 2023" />
          <DocItem name="BOQ_Export_Residential.pdf" type="pdf" size="520 KB" date="Today" />
        </div>
      </div>
    </DashboardShell>
  );
};

export default Documents;