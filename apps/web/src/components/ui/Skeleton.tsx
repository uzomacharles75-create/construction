import { motion } from 'framer-motion';

export const Skeleton = ({ className }: { className?: string }) => (
  <motion.div
    animate={{ opacity: [0.5, 1, 0.5] }}
    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
    className={`bg-slate-200 rounded-2xl ${className}`}
  />
);

// Specific skeleton for Dashboard Cards
export const CardSkeleton = () => (
  <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 space-y-4">
    <Skeleton className="w-12 h-12 rounded-xl" />
    <div className="space-y-2">
      <Skeleton className="w-24 h-3" />
      <Skeleton className="w-32 h-6" />
    </div>
  </div>
);