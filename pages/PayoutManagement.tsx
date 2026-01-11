
import React, { useMemo, useState } from 'react';
import { 
  Wallet, DollarSign, Clock, CheckCircle2, 
  ArrowUpRight, Users, Zap, ShieldCheck,
  Search, Filter, ExternalLink, MoreVertical,
  History, Coins, Receipt, Loader2, Sparkles, X,
  FileText, Download, ArrowLeft
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserRole, TrainingStatus } from '../types';

const PayoutManagement: React.FC<{ store: any }> = ({ store }) => {
  const { data, theme } = store;
  const isDark = theme === 'dark';
  const [searchTerm, setSearchTerm] = useState('');
  const [historySearch, setHistorySearch] = useState('');
  const [isProcessing, setIsProcessing] = useState<string | null>(null);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [isExportingHistory, setIsExportingHistory] = useState(false);

  const trainers = useMemo(() => {
    return data.users.filter((u: any) => u.role === UserRole.TRAINER);
  }, [data.users]);

  // Derive payout roster for current actions
  const payoutRoster = useMemo(() => {
    return trainers.map((t: any) => {
      const batches = data.trainingClasses.filter((tc: any) => tc.trainerId === t.id);
      const completedHours = batches
        .filter((tc: any) => tc.status === TrainingStatus.COMPLETED)
        .reduce((acc: number, tc: any) => acc + tc.hours, 0);
      const pendingHours = batches
        .filter((tc: any) => tc.status !== TrainingStatus.COMPLETED)
        .reduce((acc: number, tc: any) => acc + tc.hours, 0);
      
      const hourlyRate = 75; 
      return {
        ...t,
        completedHours,
        pendingHours,
        earned: completedHours * hourlyRate,
        accruing: pendingHours * hourlyRate,
        batches: batches.length
      };
    }).filter((t: any) => t.name.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [trainers, data.trainingClasses, searchTerm]);

  // Fully dynamic payment history derived from completed training classes
  const paymentHistory = useMemo(() => {
    const hourlyRate = 75;
    return data.trainingClasses
      .filter((tc: any) => tc.status === TrainingStatus.COMPLETED)
      .map((tc: any) => {
        const trainer = data.users.find((u: any) => u.id === tc.trainerId);
        return {
          id: `PAY-${tc.id}`,
          trainerName: trainer?.name || 'Unknown Trainer',
          courseName: tc.courseName,
          amount: tc.hours * hourlyRate,
          date: tc.endDate, // Assume payment processed on end date
          hours: tc.hours,
          status: 'Paid'
        };
      })
      .filter((p: any) => 
        p.trainerName.toLowerCase().includes(historySearch.toLowerCase()) || 
        p.courseName.toLowerCase().includes(historySearch.toLowerCase())
      )
      .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [data.trainingClasses, data.users, historySearch]);

  const handleAuthorizePayout = (trainerId: string) => {
    setIsProcessing(trainerId);
    setTimeout(() => {
      alert("Success: Payment has been sent to the trainer.");
      setIsProcessing(null);
    }, 1200);
  };

  const handleExportHistory = async () => {
    if (paymentHistory.length === 0) return;
    setIsExportingHistory(true);
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    try {
      const headers = ['Payment ID', 'Trainer', 'Training Class', 'Hours', 'Date', 'Amount Paid', 'Status'];
      const rows = paymentHistory.map(p => [
        p.id,
        `"${p.trainerName}"`,
        `"${p.courseName}"`,
        p.hours,
        new Date(p.date).toLocaleDateString(),
        p.amount,
        p.status
      ]);

      const csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `Learnovate_Payout_History_${new Date().toISOString().split('T')[0]}.csv`);
      link.click();
    } catch (error) {
      alert("Error: Failed to generate export file.");
    } finally {
      setIsExportingHistory(false);
    }
  };

  return (
    <div className="space-y-10 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex items-center gap-2 mb-3">
             <div className="w-10 h-1 bg-emerald-500 rounded-full" />
             <span className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.4em]">Staff Payments</span>
          </motion.div>
          <h2 className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter">
            Trainer <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">Payouts</span>
          </h2>
          <p className="text-slate-500 dark:text-slate-400 font-bold text-lg mt-3">Manage and track payments for all our training staff.</p>
        </div>
        <div className="flex gap-4">
           <motion.button 
             whileHover={{ scale: 1.05 }}
             whileTap={{ scale: 0.95 }}
             onClick={() => setShowHistoryModal(true)}
             className="px-8 py-5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-[2rem] font-black uppercase tracking-widest text-[10px] shadow-2xl flex items-center gap-3 transition-all"
           >
             <History className="w-5 h-5" />
             Payment History
           </motion.button>
        </div>
      </div>

      {/* Roster & Search */}
      <div className="glass p-8 rounded-[3.5rem] shadow-2xl shadow-slate-200/40 dark:shadow-none flex flex-col lg:flex-row gap-8 items-center border border-white/60 dark:border-white/5">
        <div className="flex-1 relative group w-full">
          <Search className="w-6 h-6 absolute left-8 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-500 transition-all" />
          <input 
            type="text" 
            placeholder="Search by trainer name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-20 pr-8 py-6 bg-slate-50/50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-[2rem] focus:ring-8 focus:ring-emerald-500/5 focus:border-emerald-500 outline-none font-bold transition-all dark:text-white text-lg placeholder:text-slate-300"
          />
        </div>
      </div>

      {/* Payout Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
        <AnimatePresence mode="popLayout">
          {payoutRoster.map((trainer, idx) => (
            <motion.div
              key={trainer.id}
              layout
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: idx * 0.05 }}
              className="group"
            >
              <div className="glass h-full p-10 rounded-[4rem] shadow-xl hover:shadow-[0_50px_100px_-20px_rgba(0,0,0,0.1)] transition-all duration-700 border border-white/60 dark:border-white/5 flex flex-col relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-[80px] -mr-10 -mt-10 group-hover:bg-emerald-500/10 transition-colors" />
                
                <div className="flex items-center gap-6 mb-10">
                   <div className="w-16 h-16 bg-slate-900 rounded-[1.8rem] flex items-center justify-center text-white font-black text-xl shadow-xl overflow-hidden">
                      {trainer.avatar ? <img src={trainer.avatar} className="w-full h-full object-cover" /> : trainer.name.charAt(0)}
                   </div>
                   <div>
                      <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter">{trainer.name}</h3>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Instructor</p>
                   </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-10">
                  <div className="p-5 bg-slate-50/50 dark:bg-slate-800/50 rounded-3xl border border-slate-100 dark:border-slate-700">
                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Earned (Finished)</p>
                    <h4 className="text-2xl font-black text-emerald-600">${trainer.earned.toLocaleString()}</h4>
                  </div>
                  <div className="p-5 bg-slate-50/50 dark:bg-slate-800/50 rounded-3xl border border-slate-100 dark:border-slate-700">
                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Coming Soon (In Progress)</p>
                    <h4 className="text-2xl font-black text-indigo-500">${trainer.accruing.toLocaleString()}</h4>
                  </div>
                </div>

                <div className="space-y-4 mb-10">
                   <div className="flex items-center justify-between text-xs font-bold">
                      <span className="text-slate-400 uppercase">Hours Completed</span>
                      <span className="text-slate-900 dark:text-white">{trainer.completedHours}h</span>
                   </div>
                   <div className="flex items-center justify-between text-xs font-bold">
                      <span className="text-slate-400 uppercase">Total Classes</span>
                      <span className="text-slate-900 dark:text-white">{trainer.batches}</span>
                   </div>
                </div>

                <div className="mt-auto">
                  {trainer.earned > 0 ? (
                    <motion.button 
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleAuthorizePayout(trainer.id)}
                      disabled={isProcessing === trainer.id}
                      className="w-full py-5 bg-emerald-600 text-white rounded-[2rem] font-black text-[10px] uppercase tracking-widest shadow-2xl shadow-emerald-200 hover:bg-emerald-700 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                    >
                      {isProcessing === trainer.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
                      Send Payment
                    </motion.button>
                  ) : (
                    <div className="w-full py-5 bg-slate-100 dark:bg-slate-800 text-slate-400 rounded-[2rem] font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-3 border border-slate-200 dark:border-slate-700">
                      <Clock className="w-4 h-4" /> No Earnings Yet
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Dynamic Payment History Modal */}
      <AnimatePresence>
        {showHistoryModal && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 md:p-12 overflow-y-auto">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowHistoryModal(false)} className="absolute inset-0 bg-slate-950/90 backdrop-blur-2xl" />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 50, filter: 'blur(10px)' }}
              animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, scale: 0.9, y: 50 }}
              className="relative w-full max-w-5xl bg-white dark:bg-slate-900 rounded-[4rem] shadow-2xl overflow-hidden border border-white/20 flex flex-col max-h-[85vh]"
            >
              <div className="p-10 border-b border-slate-100 dark:border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-8 bg-gradient-to-r from-emerald-50/50 to-white dark:from-slate-800/50 dark:to-slate-900">
                <div className="flex items-center gap-6">
                   <div className="w-16 h-16 bg-emerald-600 rounded-[2rem] flex items-center justify-center text-white shadow-xl">
                      <History className="w-8 h-8" />
                   </div>
                   <div>
                     <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">Payment History</h3>
                     <p className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.3em] mt-2">Log of all processed staff payments</p>
                   </div>
                </div>
                <button onClick={() => setShowHistoryModal(false)} className="p-4 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-slate-400 rounded-2xl hover:text-rose-500 transition-all group">
                   <X className="w-7 h-7 group-hover:rotate-90 transition-transform" />
                </button>
              </div>

              <div className="p-10 flex-1 overflow-y-auto custom-scrollbar space-y-8">
                 {/* History Search & Filter */}
                 <div className="flex flex-col md:flex-row gap-4 items-center">
                    <div className="flex-1 relative group w-full">
                       <Search className="w-5 h-5 absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-all" />
                       <input 
                         type="text" 
                         value={historySearch}
                         onChange={(e) => setHistorySearch(e.target.value)}
                         placeholder="Search by trainer or course name..." 
                         className="w-full pl-16 pr-8 py-5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-[2rem] focus:ring-8 focus:ring-emerald-500/5 outline-none font-bold dark:text-white"
                       />
                    </div>
                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleExportHistory}
                      disabled={isExportingHistory || paymentHistory.length === 0}
                      className="px-8 py-5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-3 shadow-xl transition-all disabled:opacity-50"
                    >
                      {isExportingHistory ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                      {isExportingHistory ? 'Exporting...' : 'Export CSV'}
                    </motion.button>
                 </div>

                 {/* History Table */}
                 <div className="bg-white dark:bg-slate-800/40 rounded-[3rem] border border-slate-100 dark:border-white/5 overflow-hidden">
                    <table className="w-full text-left">
                       <thead className="bg-slate-50 dark:bg-slate-900/50">
                          <tr>
                             <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Trainer</th>
                             <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Training Class</th>
                             <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Hours</th>
                             <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Processed Date</th>
                             <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Amount Paid</th>
                          </tr>
                       </thead>
                       <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                          {paymentHistory.map((pay, idx) => (
                             <motion.tr 
                               key={pay.id} 
                               initial={{ opacity: 0, x: -10 }} 
                               animate={{ opacity: 1, x: 0 }} 
                               transition={{ delay: idx * 0.03 }}
                               className="group hover:bg-slate-50 dark:hover:bg-white/5 transition-all"
                             >
                                <td className="p-6">
                                   <p className="text-sm font-black text-slate-900 dark:text-white">{pay.trainerName}</p>
                                   <p className="text-[10px] font-bold text-slate-400 uppercase">{pay.id}</p>
                                </td>
                                <td className="p-6">
                                   <p className="text-sm font-bold text-slate-600 dark:text-slate-300">{pay.courseName}</p>
                                </td>
                                <td className="p-6 text-center text-xs font-black text-slate-900 dark:text-white">
                                   {pay.hours}h
                                </td>
                                <td className="p-6 text-center text-xs font-bold text-slate-500">
                                   {new Date(pay.date).toLocaleDateString()}
                                </td>
                                <td className="p-6 text-right">
                                   <span className="text-lg font-black text-emerald-600">${pay.amount.toLocaleString()}</span>
                                </td>
                             </motion.tr>
                          ))}
                          {paymentHistory.length === 0 && (
                            <tr>
                               <td colSpan={5} className="p-20 text-center text-slate-400 font-bold uppercase tracking-widest italic opacity-50">No processed payments found</td>
                            </tr>
                          )}
                       </tbody>
                    </table>
                 </div>
              </div>

              <div className="p-10 bg-slate-900 border-t border-white/10 flex items-center justify-between">
                 <div className="flex items-center gap-4">
                    <div className="p-3 bg-emerald-500/20 text-emerald-400 rounded-xl">
                       <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <p className="text-white text-sm font-black uppercase tracking-widest">Financial Records Verified</p>
                 </div>
                 <button onClick={() => setShowHistoryModal(false)} className="px-8 py-4 bg-white text-slate-900 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-emerald-400 transition-all">Close History</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PayoutManagement;
