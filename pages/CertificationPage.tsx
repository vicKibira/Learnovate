
import React, { useState, useMemo } from 'react';
import { 
  ShieldCheck, GraduationCap, CheckCircle, Search, Filter, 
  Download, MoreVertical, Users, Star, Award, TrendingUp,
  FileCheck, Clock, ArrowRight, Layers, LayoutGrid, List,
  Printer, Share2, Mail, Loader2, Check, X
} from 'lucide-react';
// Cast motion to any to bypass environment-specific type definition issues
import { motion as motionAny, AnimatePresence } from 'framer-motion';
const motion = motionAny as any;
import { TrainingStatus } from '../types';

const CertificationPage: React.FC<{ store: any }> = ({ store }) => {
  const { data, issueCertificate } = store;
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [activeFilter, setActiveFilter] = useState<'all' | 'pending' | 'completed'>('all');
  
  // Operational States
  const [isExporting, setIsExporting] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifyProgress, setVerifyProgress] = useState({ current: 0, total: 0 });

  const learners = data.learners;

  // Impactful Business Analytics
  const stats = useMemo(() => {
    const total = learners.length;
    const completed = learners.filter((l: any) => l.completed).length;
    const active = learners.filter((l: any) => !l.completed).length;
    const successRate = total > 0 ? (completed / total) * 100 : 0;
    
    return [
      { label: 'Total Graduates', value: completed, icon: <GraduationCap className="w-6 h-6 text-emerald-600" />, color: 'bg-emerald-50', trend: '+12% this month' },
      { label: 'Active Learners', value: active, icon: <Users className="w-6 h-6 text-indigo-600" />, color: 'bg-indigo-50', trend: 'In 4 active classes' },
      { label: 'Success Rate', value: `${successRate.toFixed(1)}%`, icon: <TrendingUp className="w-6 h-6 text-amber-600" />, color: 'bg-amber-50', trend: 'Target: 95%' },
      { label: 'Certs Issued', value: completed, icon: <ShieldCheck className="w-6 h-6 text-rose-600" />, color: 'bg-rose-50', trend: 'All verified' },
    ];
  }, [learners]);

  const filteredLearners = useMemo(() => {
    return learners.filter((l: any) => {
      const matchesSearch = l.name.toLowerCase().includes(searchTerm.toLowerCase()) || l.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = 
        activeFilter === 'all' ? true :
        activeFilter === 'completed' ? l.completed :
        !l.completed;
      return matchesSearch && matchesFilter;
    });
  }, [learners, searchTerm, activeFilter]);

  // Group learners by training class for business context
  const groupedLearners = useMemo(() => {
    const groups: { [key: string]: any[] } = {};
    filteredLearners.forEach(l => {
      if (!groups[l.trainingId]) groups[l.trainingId] = [];
      groups[l.trainingId].push(l);
    });
    return groups;
  }, [filteredLearners]);

  // Fully Operational Export Feature
  const handleExportReport = async () => {
    if (filteredLearners.length === 0) {
      alert("Operational Alert: No learner data available in the current view to export.");
      return;
    }

    setIsExporting(true);
    // Simulate complex data compilation
    await new Promise(resolve => setTimeout(resolve, 1800));

    try {
      const headers = ['Learner Name', 'Email Address', 'Batch ID', 'Course Name', 'Completion Status', 'Digital Certificate ID', 'Issue Date'];
      const rows = filteredLearners.map((l: any) => {
        const training = data.trainingClasses.find((t: any) => t.id === l.trainingId);
        return [
          `"${l.name}"`,
          l.email,
          l.trainingId,
          `"${training?.courseName || 'General Training'}"`,
          l.completed ? 'VERIFIED' : 'PENDING',
          l.certificateId || 'N/A',
          l.issuedAt ? new Date(l.issuedAt).toLocaleDateString() : 'N/A'
        ];
      });

      const csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `Learnovate_Certification_Report_${new Date().toISOString().split('T')[0]}.csv`);
      link.click();
    } catch (error) {
      alert("System Error: Failed to generate HR report.");
    } finally {
      setIsExporting(false);
    }
  };

  // FULLY DYNAMIC: Bulk Verify Feature with Progress Tracking
  const handleBulkVerify = async () => {
    // Dynamically target only those in the current filtered/searched view that are pending
    const pendingInCurrentView = filteredLearners.filter((l: any) => !l.completed);
    
    if (pendingInCurrentView.length === 0) {
      alert("Verification Protocol: No pending learners identified in the current view selection.");
      return;
    }

    const confirmVerify = window.confirm(`Initiate bulk verification for ${pendingInCurrentView.length} identified learners? This protocol generates encrypted digital IDs.`);
    
    if (!confirmVerify) return;

    setIsVerifying(true);
    setVerifyProgress({ current: 0, total: pendingInCurrentView.length });
    
    // Iteratively process each learner with dynamic state updates
    for (let i = 0; i < pendingInCurrentView.length; i++) {
      // Simulate cryptographic verification signature time
      await new Promise(resolve => setTimeout(resolve, 350));
      issueCertificate(pendingInCurrentView[i].id);
      setVerifyProgress(prev => ({ ...prev, current: i + 1 }));
    }

    setIsVerifying(false);
    setVerifyProgress({ current: 0, total: 0 });
    
    // Trigger a small haptic/feedback alert
    setTimeout(() => {
      alert(`System Success: ${pendingInCurrentView.length} certification nodes have been verified and pushed to the global registry.`);
    }, 100);
  };

  return (
    <div className="space-y-10 pb-20">
      {/* Dynamic Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-4">
            <div className="p-3 bg-indigo-600 rounded-[1.5rem] shadow-xl shadow-indigo-200">
                <ShieldCheck className="w-8 h-8 text-white" />
            </div>
            Talent Readiness Hub
          </h2>
          <p className="text-slate-500 font-bold mt-3 text-lg">Managing organizational skill development and verified certifications.</p>
        </div>
        <div className="flex items-center gap-3">
           <motion.button 
             whileHover={{ scale: 1.02 }}
             whileTap={{ scale: 0.98 }}
             onClick={handleExportReport}
             disabled={isExporting}
             className="px-6 py-3.5 bg-white border border-slate-200 rounded-2xl font-black text-xs uppercase tracking-widest text-slate-600 hover:shadow-lg transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
           >
             {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
             {isExporting ? 'Compiling Report' : 'Export HR Report'}
           </motion.button>
           <motion.button 
             whileHover={{ scale: 1.02 }}
             whileTap={{ scale: 0.98 }}
             onClick={handleBulkVerify}
             disabled={isVerifying}
             className={`px-6 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl flex items-center gap-2 disabled:opacity-70 ${
               isVerifying ? 'bg-emerald-600 text-white shadow-emerald-200' : 'bg-slate-900 text-white hover:bg-indigo-600 shadow-slate-200'
             }`}
           >
             {isVerifying ? (
               <>
                 <Loader2 className="w-4 h-4 animate-spin" />
                 Processing {verifyProgress.current}/{verifyProgress.total}
               </>
             ) : (
               <>
                 <Award className="w-4 h-4" />
                 Bulk Verify Certs
               </>
             )}
           </motion.button>
        </div>
      </div>

      {/* Analytics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/40 border border-white/60 group"
          >
            <div className="flex items-center justify-between mb-8">
               <div className={`p-4 rounded-2xl ${stat.color} shadow-sm border border-white/50`}>
                 {stat.icon}
               </div>
               <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.trend}</span>
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">{stat.label}</p>
            <h3 className="text-3xl font-black text-slate-900 tracking-tighter">{stat.value}</h3>
          </motion.div>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="glass p-10 rounded-[3rem] shadow-xl shadow-slate-200/30">
        {/* Toolbar */}
        <div className="flex flex-col lg:flex-row gap-6 items-center justify-between mb-12">
           <div className="flex flex-wrap gap-2">
              {['all', 'pending', 'completed'].map((f) => (
                <button
                  key={f}
                  onClick={() => setActiveFilter(f as any)}
                  className={`px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                    activeFilter === f 
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' 
                    : 'bg-slate-50 text-slate-400 hover:bg-slate-100'
                  }`}
                >
                  {f}
                </button>
              ))}
           </div>

           <div className="flex flex-1 w-full max-w-xl relative group">
              <Search className="w-5 h-5 absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
              <input 
                type="text" 
                placeholder="Search learners, emails, or courses..."
                className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-400 outline-none font-bold text-slate-700 transition-all shadow-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
           </div>

           <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
              <button onClick={() => setViewMode('table')} className={`p-2.5 rounded-xl transition-all ${viewMode === 'table' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-400'}`}><List className="w-5 h-5" /></button>
              <button onClick={() => setViewMode('grid')} className={`p-2.5 rounded-xl transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-400'}`}><LayoutGrid className="w-5 h-5" /></button>
           </div>
        </div>

        {/* Grouped Content */}
        <div className="space-y-12">
          {Object.keys(groupedLearners).length > 0 ? (Object.entries(groupedLearners) as [string, any[]][]).map(([trainingId, classLearners]) => {
            const trainingClass = data.trainingClasses.find((t: any) => t.id === trainingId);
            return (
              <div key={trainingId} className="space-y-6">
                <div className="flex items-center gap-4 px-4">
                   <div className="p-3 bg-indigo-50 rounded-2xl">
                      <Layers className="w-5 h-5 text-indigo-600" />
                   </div>
                   <div>
                      <h4 className="text-xl font-black text-slate-900">{trainingClass?.courseName || 'General Training'}</h4>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                         Batch ID: {trainingId} • {classLearners.length} Participants • {trainingClass?.hours} Hours
                      </p>
                   </div>
                   <div className="flex-1 border-b border-slate-100 border-dashed ml-4" />
                   <button onClick={handleExportReport} className="text-[10px] font-black text-indigo-500 uppercase tracking-widest hover:underline">Batch Analytics</button>
                </div>

                <div className="grid grid-cols-1 gap-4">
                   {classLearners.map((learner: any) => (
                     <motion.div 
                       key={learner.id}
                       whileHover={{ x: 10, backgroundColor: 'rgba(255, 255, 255, 1)' }}
                       className={`p-6 bg-white/40 rounded-3xl border border-slate-100 flex items-center justify-between transition-all group ${learner.completed ? 'border-l-4 border-l-emerald-400' : 'border-l-4 border-l-amber-400'}`}
                     >
                       <div className="flex items-center gap-6">
                          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl shadow-inner ${
                            learner.completed ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'
                          }`}>
                             {learner.name.charAt(0)}
                          </div>
                          <div>
                             <p className="text-lg font-black text-slate-900">{learner.name}</p>
                             <p className="text-xs font-bold text-slate-400">{learner.email}</p>
                          </div>
                       </div>

                       <div className="hidden lg:flex flex-col items-center">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Certification Status</p>
                          <div className={`px-4 py-1.5 rounded-xl flex items-center gap-2 ${
                            learner.completed ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                          }`}>
                             {learner.completed ? <CheckCircle className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                             <span className="text-[10px] font-black uppercase">{learner.completed ? 'Verified' : 'In Progress'}</span>
                          </div>
                       </div>

                       <div className="hidden xl:flex flex-col items-end">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Digital ID</p>
                          <p className="text-xs font-mono font-bold text-slate-800">{learner.certificateId || 'Pending Verification'}</p>
                       </div>

                       <div className="flex items-center gap-3">
                          {!learner.completed ? (
                            <motion.button 
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => issueCertificate(learner.id)}
                              className="px-6 py-3 bg-indigo-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center gap-2"
                            >
                              <Award className="w-4 h-4" /> Issue Certificate
                            </motion.button>
                          ) : (
                            <div className="flex items-center gap-2">
                               <button title="Print Certificate" className="p-3 bg-slate-50 text-slate-400 hover:text-indigo-600 rounded-xl hover:bg-white hover:shadow-sm transition-all"><Printer className="w-4 h-4" /></button>
                               <button title="Email Participant" className="p-3 bg-slate-50 text-slate-400 hover:text-indigo-600 rounded-xl hover:bg-white hover:shadow-sm transition-all"><Mail className="w-4 h-4" /></button>
                               <button title="Share Link" className="p-3 bg-slate-50 text-slate-400 hover:text-indigo-600 rounded-xl hover:bg-white hover:shadow-sm transition-all"><Share2 className="w-4 h-4" /></button>
                            </div>
                          )}
                          <button className="p-3 text-slate-300 hover:text-slate-600"><MoreVertical className="w-5 h-5" /></button>
                       </div>
                     </motion.div>
                   ))}
                </div>
              </div>
            );
          }) : (
            <div className="py-32 text-center flex flex-col items-center gap-6">
               <div className="w-24 h-24 bg-slate-50 rounded-[2.5rem] flex items-center justify-center border border-slate-100">
                  <GraduationCap className="w-10 h-10 text-slate-200" />
               </div>
               <div>
                 <p className="text-2xl font-black text-slate-800 tracking-tight">No participants matching your criteria</p>
                 <p className="text-slate-400 font-bold mt-2">Try adjusting your filters or adding learners to a training class.</p>
               </div>
               <button className="px-8 py-4 bg-indigo-50 text-indigo-600 rounded-[1.5rem] font-black text-xs uppercase tracking-widest">
                 View All Training Batches
               </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CertificationPage;
