
import React, { useState, useMemo } from 'react';
import { 
  ShieldAlert, ShieldCheck, AlertCircle, FileText, 
  Search, Filter, MoreVertical, Calendar, User, 
  Globe, Clock, ArrowRight, Download, CheckSquare,
  X, Loader2, CheckCircle2, FilterX
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ComplianceDoc {
  id: string;
  person: string;
  doc: string;
  status: 'Up to Date' | 'Expiring Soon' | 'Expired';
  expiry: string;
  risk: 'Low' | 'High' | 'Critical';
}

const INITIAL_DOCS: ComplianceDoc[] = [
  { id: '1', person: 'Linda HR', doc: 'Teaching License', status: 'Up to Date', expiry: '2025-12-01', risk: 'Low' },
  { id: '2', person: 'Alex Trainer', doc: 'Work Contract', status: 'Expiring Soon', expiry: '2024-05-15', risk: 'High' },
  { id: '3', person: 'David Finance', doc: 'Tax Papers', status: 'Up to Date', expiry: '2025-01-20', risk: 'Low' },
  { id: '4', person: 'Sarah Retail', doc: 'Privacy Certificate', status: 'Expired', expiry: '2024-01-10', risk: 'Critical' },
];

const ComplianceShield: React.FC<{ store: any }> = ({ store }) => {
  const [docsList] = useState<ComplianceDoc[]>(INITIAL_DOCS);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [isDownloading, setIsDownloading] = useState(false);
  const [isFixing, setIsFixing] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  // Dynamic Filtering Logic
  const filteredDocs = useMemo(() => {
    return docsList.filter(doc => {
      const matchesSearch = doc.person.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            doc.doc.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'All' || doc.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [docsList, searchTerm, statusFilter]);

  const missingCount = docsList.filter(d => d.status !== 'Up to Date').length;

  const handleDownload = async () => {
    setIsDownloading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const headers = ['Person', 'Document', 'Status', 'Expiry', 'Risk'];
    const rows = filteredDocs.map(d => [d.person, d.doc, d.status, d.expiry, d.risk]);
    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `compliance_report_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    setIsDownloading(false);
  };

  const handleFixMissing = async () => {
    setIsFixing(true);
    // Simulate sending reminders/requests to team members
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsFixing(false);
    alert('Request Sent: Reminders have been dispatched to all team members with missing or expiring documents.');
  };

  return (
    <div className="space-y-10 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex items-center gap-2 mb-3">
             <div className="w-10 h-1 bg-rose-600 rounded-full" />
             <span className="text-[10px] font-black text-rose-600 uppercase tracking-[0.4em]">Rules & Safety</span>
          </motion.div>
          <h2 className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter">
            Compliance <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-600 to-slate-900 dark:to-slate-300">Center</span>
          </h2>
          <p className="text-slate-500 dark:text-slate-400 font-bold text-lg mt-3">Making sure everyone has the right papers and follows the rules.</p>
        </div>
        <div className="flex gap-4">
           <motion.button 
             whileHover={{ scale: 1.05 }}
             whileTap={{ scale: 0.95 }}
             onClick={handleDownload}
             disabled={isDownloading}
             className="px-8 py-5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 dark:text-white rounded-[2rem] font-black uppercase tracking-widest text-[10px] shadow-xl flex items-center gap-3 transition-all hover:bg-slate-50"
           >
             {isDownloading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Download className="w-5 h-5" />}
             {isDownloading ? 'Preparing...' : 'Download Record'}
           </motion.button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 glass p-10 rounded-[4rem] shadow-2xl border border-white/60 dark:border-white/5 overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
             <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Team Document List</h3>
             
             <div className="flex flex-wrap items-center gap-3">
                <div className="flex bg-slate-50 dark:bg-slate-800 p-1.5 rounded-2xl border border-slate-100 dark:border-slate-700">
                  {['All', 'Expired', 'Expiring Soon'].map(status => (
                    <button
                      key={status}
                      onClick={() => setStatusFilter(status)}
                      className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${statusFilter === status ? 'bg-white dark:bg-slate-700 shadow-md text-rose-600 dark:text-white' : 'text-slate-400'}`}
                    >
                      {status}
                    </button>
                  ))}
                </div>

                <div className="flex gap-2">
                   <AnimatePresence>
                     {showSearch && (
                       <motion.input 
                         initial={{ width: 0, opacity: 0 }}
                         animate={{ width: 200, opacity: 1 }}
                         exit={{ width: 0, opacity: 0 }}
                         type="text"
                         value={searchTerm}
                         onChange={(e) => setSearchTerm(e.target.value)}
                         placeholder="Search names..."
                         className="px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-rose-500/20"
                       />
                     )}
                   </AnimatePresence>
                   <button 
                     onClick={() => setShowSearch(!showSearch)}
                     className={`p-3 rounded-xl transition-all ${showSearch ? 'bg-rose-500 text-white shadow-lg' : 'bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-rose-600'}`}
                   >
                     {showSearch ? <X className="w-4 h-4" /> : <Search className="w-4 h-4" />}
                   </button>
                   {statusFilter !== 'All' && (
                     <button onClick={() => setStatusFilter('All')} className="p-3 bg-rose-50 text-rose-500 rounded-xl hover:bg-rose-500 hover:text-white transition-all">
                       <FilterX className="w-4 h-4" />
                     </button>
                   )}
                </div>
             </div>
          </div>

          <div className="space-y-4">
            <AnimatePresence mode="popLayout">
              {filteredDocs.map((item, idx) => (
                <motion.div 
                  key={item.id} 
                  layout
                  initial={{ opacity: 0, x: -20 }} 
                  animate={{ opacity: 1, x: 0 }} 
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: idx * 0.05 }}
                  className="group flex flex-col md:flex-row md:items-center gap-6 p-6 bg-white/40 dark:bg-slate-800/40 rounded-[2.5rem] border border-slate-100 dark:border-white/5 hover:bg-white dark:hover:bg-slate-800 hover:shadow-2xl transition-all"
                >
                  <div className={`w-12 h-12 rounded-2xl flex-shrink-0 flex items-center justify-center ${
                    item.risk === 'Critical' ? 'bg-rose-100 text-rose-600' : 
                    item.risk === 'High' ? 'bg-amber-100 text-amber-600' : 'bg-emerald-100 text-emerald-600'
                  }`}>
                    {item.risk === 'Critical' ? <ShieldAlert className="w-6 h-6" /> : <ShieldCheck className="w-6 h-6" />}
                  </div>

                  <div className="flex-1">
                    <p className="text-sm font-black text-slate-900 dark:text-white">{item.person}</p>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">{item.doc}</p>
                  </div>

                  <div className="text-left md:text-center min-w-[120px]">
                    <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Due Date</p>
                    <p className="text-xs font-black text-slate-700 dark:text-slate-300">{new Date(item.expiry).toLocaleDateString()}</p>
                  </div>

                  <div className="min-w-[140px]">
                    <span className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center gap-2 w-fit ${
                      item.status === 'Up to Date' ? 'bg-emerald-50 text-emerald-600' : 
                      item.status === 'Expired' ? 'bg-rose-50 text-rose-600' : 'bg-amber-50 text-amber-600'
                    }`}>
                        <div className={`w-1 h-1 rounded-full ${
                          item.status === 'Up to Date' ? 'bg-emerald-500' : 
                          item.status === 'Expired' ? 'bg-rose-500 animate-pulse' : 'bg-amber-500'
                        }`} />
                        {item.status}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 ml-auto">
                    <button className="p-3 bg-slate-50 dark:bg-slate-700 rounded-xl text-slate-400 hover:text-rose-600 transition-colors">
                      <FileText className="w-4 h-4" />
                    </button>
                    <button className="p-3 text-slate-200 hover:text-slate-400 transition-colors"><MoreVertical className="w-5 h-5" /></button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {filteredDocs.length === 0 && (
              <div className="py-20 text-center flex flex-col items-center gap-4">
                <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-slate-200">
                  <Search className="w-8 h-8" />
                </div>
                <p className="text-sm font-black text-slate-400 uppercase tracking-widest">No matching documents found</p>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-8">
           <div className="glass p-10 rounded-[3.5rem] border-rose-100 dark:border-rose-500/20 bg-rose-50/5 text-center">
              <ShieldAlert className="w-16 h-16 text-rose-500 mx-auto mb-6" />
              <h3 className="text-2xl font-black text-slate-900 dark:text-white leading-tight">Missing Documents</h3>
              <p className="text-slate-500 font-bold mt-2">{missingCount} people have documents that are expired or will expire soon.</p>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleFixMissing}
                disabled={isFixing || missingCount === 0}
                className={`w-full mt-8 py-5 rounded-3xl font-black uppercase tracking-widest text-[10px] shadow-2xl transition-all flex items-center justify-center gap-3 ${
                  isFixing ? 'bg-slate-400 cursor-not-allowed' : 'bg-rose-600 text-white hover:bg-rose-700 shadow-rose-200'
                }`}
              >
                {isFixing ? <Loader2 className="w-5 h-5 animate-spin" /> : <ShieldCheck className="w-5 h-5" />}
                {isFixing ? 'Fixing...' : 'Fix Missing Papers'}
              </motion.button>
           </div>
           
           <div className="glass p-10 rounded-[3.5rem] border border-white/60 dark:border-white/5">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-8 text-center">Overall Status</h4>
              <div className="relative w-32 h-32 mx-auto">
                 <div className="absolute inset-0 rounded-full border-8 border-slate-100 dark:border-slate-800" />
                 <motion.div 
                   initial={{ rotate: -90 }}
                   animate={{ rotate: 0 }}
                   className="absolute inset-0 rounded-full border-8 border-emerald-500" 
                   style={{ clipPath: 'polygon(0 0, 92% 0, 92% 100%, 0 100%)' }} 
                 />
                 <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-black text-slate-900 dark:text-white">92%</span>
                 </div>
              </div>
              <p className="text-[10px] font-black text-slate-500 text-center uppercase tracking-widest mt-6">Papers Checked</p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default ComplianceShield;
