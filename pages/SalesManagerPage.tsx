import React, { useMemo, useState } from 'react';
import { 
  Trophy, TrendingUp, Users, DollarSign, Target as TargetIcon,
  ArrowUpRight, ArrowDownRight, Briefcase, Zap, Star,
  CheckCircle2, Clock, MoreHorizontal, ChevronRight, UserPlus, X, Mail, ShieldCheck, UserCheck, Download, FileSpreadsheet, Loader2
} from 'lucide-react';
// Cast motion to any to bypass environment-specific type definition issues
import { motion as motionAny, AnimatePresence } from 'framer-motion';
const motion = motionAny as any;
import { UserRole, DealStage } from '../types';

const SalesManagerPage: React.FC<{ store: any }> = ({ store }) => {
  const { data, addSalesUser } = store;
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [newSalesPerson, setNewSalesPerson] = useState({
    name: '',
    email: '',
    role: UserRole.SALES_RETAIL
  });

  const metrics = useMemo(() => {
    const totalPipeline = data.deals.reduce((acc: number, d: any) => acc + d.value, 0);
    const closedWon = data.deals.filter((d: any) => d.stage === DealStage.CLOSED_WON).reduce((acc: number, d: any) => acc + d.value, 0);
    const winRate = data.deals.length > 0 ? (data.deals.filter((d: any) => d.stage === DealStage.CLOSED_WON).length / data.deals.length) * 100 : 0;
    
    return [
      { label: 'Revenue Velocity', value: `$${closedWon.toLocaleString()}`, trend: '+15.4%', icon: <Zap className="w-6 h-6 text-amber-500" />, color: 'bg-amber-50' },
      { label: 'Pipeline Strength', value: `$${totalPipeline.toLocaleString()}`, trend: '+8.2%', icon: <Briefcase className="w-6 h-6 text-indigo-500" />, color: 'bg-indigo-50' },
      { label: 'Win Ratio', value: `${winRate.toFixed(1)}%`, trend: '+2.1%', icon: <Trophy className="w-6 h-6 text-emerald-500" />, color: 'bg-emerald-50' },
      { label: 'Active Leads', value: data.leads.filter((l: any) => l.status === 'New').length, trend: '+12', icon: <Users className="w-6 h-6 text-rose-500" />, color: 'bg-rose-50' },
    ];
  }, [data]);

  // Team Performance Calculation
  const salesTeam = useMemo(() => {
    return data.users.filter((u: any) => [UserRole.SALES_RETAIL, UserRole.SALES_CORPORATE].includes(u.role));
  }, [data.users]);
  
  const teamPerformance = useMemo(() => {
    return salesTeam.map((member: any) => {
      const deals = data.deals.filter((d: any) => d.assignedTo === member.id && d.stage === DealStage.CLOSED_WON);
      const achieved = deals.reduce((acc: number, d: any) => acc + d.value, 0);
      const target = 50000; // Mock base target
      return {
        ...member,
        achieved,
        target,
        percentage: (achieved / target) * 100,
        dealCount: deals.length
      };
    });
  }, [data.deals, salesTeam]);

  const handleExportPerformanceReport = async () => {
    setIsExporting(true);
    await new Promise(resolve => setTimeout(resolve, 1500));

    try {
      const headers = ['Identity', 'Professional Email', 'Strategic Role', 'Quota Target', 'Cumulative Achievement', 'Completion Percentage', 'Closed Deals'];
      const rows = teamPerformance.map(m => [
        m.name,
        m.email,
        m.role,
        m.target,
        m.achieved,
        `${m.percentage.toFixed(1)}%`,
        m.dealCount
      ]);

      const csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `Learnovate_Performance_Report_${new Date().toISOString().split('T')[0]}.csv`);
      link.click();
    } catch (error) {
      alert("Operational Error: Performance report generation failed.");
    } finally {
      setIsExporting(false);
    }
  };

  const handleAddSalesPerson = (e: React.FormEvent) => {
    e.preventDefault();
    addSalesUser({
      name: newSalesPerson.name,
      email: newSalesPerson.email,
      role: newSalesPerson.role as any
    });
    setAddModalOpen(false);
    setNewSalesPerson({ name: '', email: '', role: UserRole.SALES_RETAIL });
  };

  return (
    <div className="space-y-10 pb-20">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-4">
            <div className="p-3 bg-indigo-600 rounded-[1.5rem] shadow-xl shadow-indigo-200">
               <Trophy className="w-8 h-8 text-white" />
            </div>
            Performance Center
          </h2>
          <p className="text-slate-500 dark:text-slate-400 font-bold mt-3 text-lg">Driving growth through data-driven sales leadership.</p>
        </div>
        <div className="flex items-center gap-3">
           <motion.button 
             whileHover={{ scale: 1.05 }}
             whileTap={{ scale: 0.95 }}
             onClick={() => setAddModalOpen(true)}
             className="px-6 py-3.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl font-black text-xs uppercase tracking-widest text-slate-600 dark:text-slate-300 hover:shadow-lg transition-all flex items-center gap-2"
           >
             <UserPlus className="w-5 h-5 text-indigo-500" /> Onboard Sales Rep
           </motion.button>
           
           <motion.button 
             whileHover={{ scale: 1.05 }}
             whileTap={{ scale: 0.95 }}
             disabled={isExporting}
             onClick={handleExportPerformanceReport}
             className={`px-8 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl flex items-center gap-3 ${
               isExporting 
               ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
               : 'bg-slate-900 text-white hover:bg-indigo-600 shadow-slate-200'
             }`}
           >
             {isExporting ? (
               <>
                 <Loader2 className="w-5 h-5 animate-spin" /> Compiling Data...
               </>
             ) : (
               <>
                 <FileSpreadsheet className="w-5 h-5" /> Export Performance Report
               </>
             )}
           </motion.button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {metrics.map((stat: any, i: number) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/40 border border-white/60 dark:border-white/5 relative overflow-hidden group"
          >
            <div className={`absolute top-0 right-0 w-32 h-32 ${stat.color} opacity-20 blur-3xl -mr-10 -mt-10 rounded-full group-hover:opacity-40 transition-opacity`} />
            <div className="flex items-center justify-between mb-8">
               <div className={`p-4 rounded-2xl ${stat.color} shadow-sm border border-white/50`}>
                 {stat.icon}
               </div>
               <div className="flex items-center gap-1 text-[10px] font-black text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 px-3 py-1.5 rounded-full">
                 {stat.trend} <ArrowUpRight className="w-3 h-3" />
               </div>
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">{stat.label}</p>
            <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">{stat.value}</h3>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Sales Team Quota Progress */}
        <div className="lg:col-span-2 glass p-10 rounded-[3rem] shadow-xl shadow-slate-200/30 dark:shadow-none border border-white/60 dark:border-white/5">
           <div className="flex items-center justify-between mb-12">
              <div>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white">Team Quota Tracking</h3>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Individual Progress vs Targets</p>
              </div>
              <button className="p-3 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-2xl transition-all border border-transparent hover:border-slate-100 dark:hover:border-slate-700"><MoreHorizontal className="w-5 h-5 text-slate-400" /></button>
           </div>

           <div className="space-y-10">
              {teamPerformance.map((member: any) => (
                <div key={member.id} className="space-y-4">
                  <div className="flex items-center justify-between">
                     <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-tr from-indigo-500 to-violet-600 rounded-2xl flex items-center justify-center text-white font-black shadow-lg">
                           {member.name.charAt(0)}
                        </div>
                        <div>
                           <p className="text-sm font-black text-slate-900 dark:text-white">{member.name}</p>
                           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{member.role}</p>
                        </div>
                     </div>
                     <div className="text-right">
                        <p className="text-sm font-black text-slate-900 dark:text-white">${member.achieved.toLocaleString()} / ${member.target.toLocaleString()}</p>
                        <p className={`text-[10px] font-black uppercase tracking-widest ${member.percentage >= 80 ? 'text-emerald-500' : 'text-amber-500'}`}>
                           {member.percentage.toFixed(1)}% Achieved
                        </p>
                     </div>
                  </div>
                  <div className="h-4 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden p-1 shadow-inner">
                     <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(member.percentage, 100)}%` }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        className={`h-full rounded-full shadow-lg ${
                           member.percentage >= 100 ? 'bg-gradient-to-r from-emerald-500 to-teal-400' :
                           member.percentage >= 70 ? 'bg-gradient-to-r from-indigo-500 to-indigo-400' :
                           'bg-gradient-to-r from-amber-500 to-orange-400'
                        }`}
                     />
                  </div>
                </div>
              ))}
           </div>
        </div>

        {/* Global Pipeline Distribution */}
        <div className="glass p-10 rounded-[3rem] shadow-xl shadow-slate-200/30 dark:shadow-none border border-white/60 dark:border-white/5 flex flex-col">
           <div className="flex items-center justify-between mb-10">
              <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Stage Analysis</h3>
              <TargetIcon className="w-5 h-5 text-indigo-500" />
           </div>
           <div className="flex-1 space-y-6">
              {Object.values(DealStage).slice(0, 5).map((stage, i) => {
                 const count = data.deals.filter((d: any) => d.stage === stage).length;
                 const max = Math.max(...Object.values(DealStage).map(s => data.deals.filter((d: any) => d.stage === s).length), 1);
                 return (
                    <div key={stage} className="space-y-2">
                       <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
                          <span>{stage}</span>
                          <span className="text-slate-900 dark:text-white">{count} Deals</span>
                       </div>
                       <div className="h-2 w-full bg-slate-50 dark:bg-slate-800 rounded-full overflow-hidden">
                          <motion.div 
                             initial={{ width: 0 }}
                             animate={{ width: `${(count / max) * 100}%` }}
                             className="h-full bg-indigo-500 rounded-full"
                          />
                       </div>
                    </div>
                 );
              })}
           </div>
           <div className="mt-10 pt-10 border-t border-slate-100 dark:border-white/5">
              <button className="w-full py-4 bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-indigo-600 transition-all rounded-2xl font-black text-[10px] uppercase tracking-widest border border-slate-100 dark:border-slate-700">
                 Full Pipeline Audit
              </button>
           </div>
        </div>
      </div>

      {/* Add Sales Rep Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setAddModalOpen(false)}
              className="absolute inset-0 bg-white/20 dark:bg-slate-900/40 backdrop-blur-xl" 
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              className="relative bg-white dark:bg-slate-900 rounded-[3.5rem] w-full max-w-2xl shadow-2xl overflow-hidden border border-white/20"
            >
              <div className="p-10 border-b border-slate-100 dark:border-white/5 flex items-center justify-between bg-gradient-to-r from-indigo-50/50 to-white dark:from-slate-800/50 dark:to-slate-900">
                <div className="flex items-center gap-6">
                   <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl">
                      <UserPlus className="w-8 h-8" />
                   </div>
                   <div>
                     <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">Onboard Talent</h3>
                     <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mt-1">Initialize Sales Node</p>
                   </div>
                </div>
                <button onClick={() => setAddModalOpen(false)} className="p-4 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl transition-all group">
                  <X className="w-6 h-6 rotate-45 text-slate-400 group-hover:rotate-0 transition-transform" />
                </button>
              </div>

              <form onSubmit={handleAddSalesPerson} className="p-10 space-y-8">
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Identity Designation</label>
                   <input required type="text" value={newSalesPerson.name} onChange={e => setNewSalesPerson({...newSalesPerson, name: e.target.value})} className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 font-bold dark:text-white" placeholder="Professional Name" />
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Communication Path</label>
                   <input required type="email" value={newSalesPerson.email} onChange={e => setNewSalesPerson({...newSalesPerson, email: e.target.value})} className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 font-bold dark:text-white" placeholder="email@learnovate.com" />
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Strategic Function</label>
                   <select value={newSalesPerson.role} onChange={e => setNewSalesPerson({...newSalesPerson, role: e.target.value as any})} className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 font-black dark:text-white appearance-none text-[10px] uppercase tracking-widest">
                      <option value={UserRole.SALES_RETAIL}>Retail Acquisition</option>
                      <option value={UserRole.SALES_CORPORATE}>Corporate Strategic</option>
                   </select>
                </div>
                <div className="pt-6 flex gap-4">
                  <button type="button" onClick={() => setAddModalOpen(false)} className="flex-1 py-5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-black rounded-2xl uppercase tracking-widest text-[10px]">Abort</button>
                  <button type="submit" className="flex-1 py-5 bg-indigo-600 text-white font-black rounded-2xl shadow-xl shadow-indigo-200 hover:bg-indigo-700 transition-all uppercase tracking-widest text-[10px]">Initialize Protocol</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SalesManagerPage;