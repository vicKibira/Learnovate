
import React, { useMemo, useState } from 'react';
import { 
  History, ShieldCheck, Download, Search, 
  ArrowUpRight, ArrowDownRight, Filter, 
  MoreVertical, FileText, CheckCircle2, 
  Clock, AlertCircle, Database, ShieldAlert,
  Calendar, CreditCard, Wallet, Users
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ComplianceVault: React.FC<{ store: any }> = ({ store }) => {
  const { data } = store;
  const [searchTerm, setSearchTerm] = useState('');

  const timeline = useMemo(() => {
    const transactions: any[] = [];
    
    // Add Invoices (Inflow)
    data.invoices.forEach((inv: any) => {
      const deal = data.deals.find((d: any) => d.id === inv.dealId);
      transactions.push({
        id: inv.id,
        date: inv.paymentDate || inv.dueDate,
        type: 'MONEY IN',
        label: `Invoice ${inv.invoiceNumber}`,
        sub: deal?.title || 'Payment received',
        amount: inv.amount,
        status: inv.status,
        icon: <CreditCard className="w-4 h-4 text-emerald-500" />
      });
    });

    // Add Mock Payouts (Outflow)
    data.users.filter((u: any) => u.role === 'Trainer').forEach((t: any) => {
      const batches = data.trainingClasses.filter((tc: any) => tc.trainerId === t.id && tc.status === 'Completed');
      if (batches.length > 0) {
        transactions.push({
          id: `PAY-${t.id}`,
          date: new Date().toISOString(),
          type: 'MONEY OUT',
          label: `Payment: ${t.name}`,
          sub: 'Paid for teaching classes',
          amount: batches.reduce((acc: number, b: any) => acc + (b.hours * 75), 0),
          status: 'Paid',
          icon: <Wallet className="w-4 h-4 text-rose-500" />
        });
      }
    });

    return transactions
      .filter(t => t.label.toLowerCase().includes(searchTerm.toLowerCase()) || t.sub.toLowerCase().includes(searchTerm.toLowerCase()))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [data, searchTerm]);

  return (
    <div className="space-y-10 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-2 mb-3">
             <div className="w-10 h-1 bg-indigo-600 rounded-full" />
             <span className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.4em]">History & Records</span>
          </motion.div>
          <h2 className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter">
            Transaction <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-indigo-900 dark:from-white dark:to-indigo-300">History</span>
          </h2>
          <p className="text-slate-500 dark:text-slate-400 font-bold text-lg mt-3">A list of all money coming in and going out to keep things clear and honest.</p>
        </div>
        <div className="flex gap-4">
           <motion.button 
             whileHover={{ scale: 1.05 }}
             whileTap={{ scale: 0.95 }}
             className="px-8 py-5 bg-white border border-slate-200 dark:bg-slate-800 dark:border-slate-700 dark:text-white rounded-[2rem] font-black uppercase tracking-widest text-[10px] shadow-xl flex items-center gap-3 transition-all"
           >
             <Download className="w-5 h-5" />
             Download History
           </motion.button>
        </div>
      </div>

      {/* Visual Timeline Deck */}
      <div className="glass p-12 rounded-[4rem] shadow-2xl border-white/60 dark:border-white/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-10"><ShieldCheck className="w-32 h-32 text-indigo-500/5" /></div>
        
        <div className="flex items-center justify-between mb-16 relative z-10">
           <div className="flex-1 max-w-xl relative group">
              <Search className="w-6 h-6 absolute left-8 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-all" />
              <input 
                type="text" 
                placeholder="Search by invoice name, trainer, or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-20 pr-8 py-6 bg-slate-50/50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-700 rounded-[2.5rem] focus:ring-8 focus:ring-indigo-500/5 focus:border-indigo-500 outline-none font-bold transition-all dark:text-white text-lg"
              />
           </div>
           <div className="flex items-center gap-6">
              <div className="text-right">
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Records Status</p>
                 <div className="flex items-center gap-2 mt-1">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                    <span className="text-xs font-black text-emerald-600 dark:text-emerald-400 uppercase">Up to Date</span>
                 </div>
              </div>
           </div>
        </div>

        <div className="space-y-6 relative z-10">
           {timeline.map((tx, idx) => (
             <motion.div 
               key={tx.id}
               initial={{ opacity: 0, x: -20 }}
               animate={{ opacity: 1, x: 0 }}
               transition={{ delay: idx * 0.05 }}
               className="group flex items-center gap-10 p-8 bg-white/40 dark:bg-slate-800/40 rounded-[3rem] border border-slate-100 dark:border-white/5 hover:bg-white dark:hover:bg-slate-800 hover:shadow-2xl transition-all"
             >
                <div className="flex flex-col items-center w-24 text-center">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{new Date(tx.date).toLocaleDateString('en-US', {month: 'short'})}</p>
                   <p className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">{new Date(tx.date).getDate()}</p>
                </div>

                <div className="w-14 h-14 bg-slate-50 dark:bg-slate-700 rounded-2xl flex items-center justify-center shadow-inner border border-white dark:border-slate-600">
                   {tx.icon}
                </div>

                <div className="flex-1">
                   <p className="text-[9px] font-black text-indigo-500 uppercase tracking-[0.2em] mb-1">{tx.type}</p>
                   <h4 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">{tx.label}</h4>
                   <p className="text-xs font-bold text-slate-400 mt-1">{tx.sub}</p>
                </div>

                <div className="text-center w-32">
                   <span className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest ${
                     tx.status === 'Paid' || tx.status === 'Processed' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                   }`}>
                      {tx.status === 'Processed' || tx.status === 'Paid' ? 'Success' : 'Pending'}
                   </span>
                </div>

                <div className="text-right min-w-[140px]">
                   <p className={`text-2xl font-black tracking-tighter ${tx.type === 'MONEY IN' ? 'text-emerald-500' : 'text-slate-900 dark:text-white'}`}>
                      {tx.type === 'MONEY IN' ? '+' : '-'}${tx.amount.toLocaleString()}
                   </p>
                </div>

                <button className="p-4 text-slate-300 hover:text-indigo-600 opacity-0 group-hover:opacity-100 transition-all"><MoreVertical className="w-5 h-5" /></button>
             </motion.div>
           ))}

           {timeline.length === 0 && (
             <div className="py-40 text-center flex flex-col items-center gap-6">
                <Database className="w-20 h-20 text-slate-100 dark:text-slate-800" />
                <p className="text-2xl font-black text-slate-400 uppercase tracking-tighter">No history found</p>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default ComplianceVault;
