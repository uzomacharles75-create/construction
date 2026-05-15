import { DashboardShell } from '../components/layout/DashboardShell';
import { 
  Users, 
  UserPlus, 
  ShieldCheck,
  Briefcase,
  Star,
} from 'lucide-react';
import { motion } from 'framer-motion';

const WorkerCard = ({ name, role, status, skills, rating, image }: any) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className="bg-white p-6 rounded-[2.5rem] shadow-premium border border-slate-100 flex flex-col items-center text-center"
  >
    <div className="relative mb-4">
      <div className="w-24 h-24 rounded-[2rem] overflow-hidden bg-slate-100 ring-4 ring-slate-50">
        <img src={image} alt={name} className="w-full h-full object-cover" />
      </div>
      <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-4 border-white ${
        status === 'On-site' ? 'bg-emerald-500' : 'bg-slate-300'
      }`} />
    </div>

    <h3 className="text-lg font-bold text-brand-navy mb-1">{name}</h3>
    <p className="text-xs font-medium text-slate-400 uppercase tracking-widest mb-4">{role}</p>
    
    <div className="flex items-center gap-1 text-amber-500 mb-6">
      <Star size={14} fill="currentColor" />
      <span className="text-xs font-bold">{rating}</span>
    </div>

    <div className="flex flex-wrap justify-center gap-2 mb-8">
      {skills.map((skill: string) => (
        <span key={skill} className="px-3 py-1 bg-slate-50 text-slate-500 text-[10px] font-bold rounded-lg border border-slate-100">
          {skill}
        </span>
      ))}
    </div>

    <div className="w-full grid grid-cols-2 gap-2 mt-auto">
      <button className="py-3 bg-brand-navy text-white text-xs font-bold rounded-2xl hover:bg-brand-blue transition-all">
        Profile
      </button>
      <button className="py-3 bg-slate-50 text-slate-500 text-xs font-bold rounded-2xl border border-slate-100 hover:bg-slate-100 transition-all">
        Message
      </button>
    </div>
  </motion.div>
);

// NOTE: _AttendanceRow was removed from here because it was not being used.

const Workforce = () => {
  const workers = [
    { name: "Moussa Diop", role: "Site Foreman", status: "On-site", skills: ["Management", "Masonry"], rating: "4.9", image: "https://i.pravatar.cc/150?u=moussa" },
    { name: "Emmanuel Tabi", role: "Senior Welder", status: "On-site", skills: ["Steel Work", "TIG"], rating: "4.8", image: "https://i.pravatar.cc/150?u=emmanuel" },
    { name: "Aisha Bello", role: "Civil Engineer", status: "Off-site", skills: ["AutoCAD", "Structural"], rating: "5.0", image: "https://i.pravatar.cc/150?u=aisha" },
    { name: "Jean Paul", role: "Electrician", status: "On-site", skills: ["Wiring", "Solar"], rating: "4.7", image: "https://i.pravatar.cc/150?u=jean" },
  ];

  return (
    <DashboardShell>
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="text-4xl font-black text-brand-navy tracking-tight">Workforce</h1>
            <p className="text-slate-500 font-medium">Manage your team and site assignments.</p>
          </div>
          <button className="bg-brand-navy text-white px-8 py-4 rounded-2xl font-bold shadow-xl flex items-center gap-2">
            <UserPlus size={20} />
            Add Team Member
          </button>
        </header>

        {/* WORKFORCE STATS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-brand-blue p-8 rounded-[2.5rem] text-white shadow-xl shadow-blue-100 flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-xs font-bold uppercase tracking-widest mb-1">Active Workers</p>
              <h3 className="text-4xl font-black">24</h3>
            </div>
            <Users size={40} className="text-blue-300 opacity-50" />
          </div>
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-premium flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Attendance Today</p>
              <h3 className="text-4xl font-black text-brand-navy">92%</h3>
            </div>
            <ShieldCheck size={40} className="text-emerald-500 opacity-20" />
          </div>
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-premium flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Open Roles</p>
              <h3 className="text-4xl font-black text-brand-navy">04</h3>
            </div>
            <Briefcase size={40} className="text-brand-navy opacity-10" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {workers.map((worker, i) => (
              <WorkerCard key={i} {...worker} />
            ))}
          </div>

          <div className="lg:col-span-1 flex flex-col gap-6">
            <div className="bg-white rounded-[2.5rem] shadow-premium border border-slate-100 p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-brand-navy">Live Status</h2>
                <ShieldCheck size={20} className="text-emerald-500" />
              </div>
              <div className="space-y-6">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                    <div className="flex-1">
                      <p className="text-xs font-bold text-brand-navy">Site {i} - Douala</p>
                      <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wide">Active</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
};

export default Workforce;