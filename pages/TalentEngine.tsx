
import React, { useState, useMemo } from 'react';
import { 
  UserPlus, Search, Filter, MoreHorizontal, Mail, 
  Phone, Globe, Zap, ArrowUpRight, CheckCircle2,
  Clock, X, Send, Calendar, Star, LayoutGrid, List,
  Loader2, FilterX, User, Briefcase, Link as LinkIcon,
  Video, MessageSquare, Award, MapPin, Building
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Candidate {
  id: string;
  name: string;
  role: string;
  source: string;
  score: number;
  status: 'Interview' | 'Screening' | 'Offer' | 'Rejected';
  email: string;
  bio?: string;
  experience?: string;
}

const INITIAL_CANDIDATES: Candidate[] = [
  { 
    id: '1', 
    name: 'Dr. Sarah Connor', 
    role: 'Cybersecurity Lead', 
    source: 'LinkedIn', 
    score: 94, 
    status: 'Interview', 
    email: 's.connor@proton.me',
    bio: 'Specialist in threat intelligence and network perimeter defense with 12 years of experience.',
    experience: '12+ Years'
  },
  { 
    id: '2', 
    name: 'James Howlett', 
    role: 'DevOps Faculty', 
    source: 'Referral', 
    score: 88, 
    status: 'Screening', 
    email: 'logan@x.com',
    bio: 'Expert in CI/CD pipelines and Kubernetes orchestration. Former system architect at Weapon X.',
    experience: '8 Years'
  },
  { 
    id: '3', 
    name: 'Wanda Maximoff', 
    role: 'UX/UI Strategist', 
    source: 'Direct', 
    score: 91, 
    status: 'Offer', 
    email: 'chaos@magic.io',
    bio: 'Designing reality-bending user experiences for over 6 years. Specializes in visual storytelling.',
    experience: '6 Years'
  },
  { 
    id: '4', 
    name: 'Arthur Curry', 
    role: 'Data Scientist', 
    source: 'LinkedIn', 
    score: 76, 
    status: 'Rejected', 
    email: 'king@atlantis.co',
    bio: 'Focuses on deep-sea data analytics and oceanic trend forecasting.',
    experience: '4 Years'
  },
];

const TalentEngine: React.FC<{ store: any }> = () => {
  const [candidatesList, setCandidatesList] = useState<Candidate[]>(INITIAL_CANDIDATES);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  
  // Modal States
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [activeModalAction, setActiveModalAction] = useState<'email' | 'schedule' | 'details' | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // New Candidate Form State
  const [newCandidate, setNewCandidate] = useState({
    name: '',
    role: '',
    source: 'LinkedIn',
    email: '',
    score: 85
  });

  // Dynamic Filtering Logic
  const filteredCandidates = useMemo(() => {
    return candidatesList.filter(c => {
      const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            c.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            c.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'All' || c.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [candidatesList, searchTerm, statusFilter]);

  const handleAddCandidate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    const candidate: Candidate = {
      ...newCandidate,
      id: Math.random().toString(36).substr(2, 9),
      status: 'Screening',
      bio: 'New talent node recently synchronized with the engine.'
    };
    setCandidatesList([candidate, ...candidatesList]);
    setIsSubmitting(false);
    setShowAddModal(false);
    setNewCandidate({ name: '', role: '', source: 'LinkedIn', email: '', score: 85 });
  };

  const openActionModal = (candidate: Candidate, action: 'email' | 'schedule' | 'details') => {
    setSelectedCandidate(candidate);
    setActiveModalAction(action);
  };

  const closeActionModal = () => {
    setSelectedCandidate(null);
    setActiveModalAction(null);
  };

  const handleActionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSubmitting(false);
    alert(`Success: Action processed for ${selectedCandidate?.name}`);
    closeActionModal();
  };

  return (
    <div className="space-y-10 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex items-center gap-2 mb-3">
             <div className="w-10 h-1 bg-indigo-500 rounded-full" />
             <span className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.4em]">Hiring Center</span>
          </motion.div>
          <h2 className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter">
            Talent <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-500">Engine</span>
          </h2>
          <p className="text-slate-500 dark:text-slate-400 font-bold text-lg mt-3">Find, track, and manage new people for our team.</p>
        </div>
        <div className="flex gap-4">
           <motion.button 
             whileHover={{ scale: 1.05 }}
             whileTap={{ scale: 0.95 }}
             onClick={() => setShowAddModal(true)}
             className="px-8 py-5 bg-indigo-600 text-white rounded-[2rem] font-black uppercase tracking-widest text-[10px] shadow-2xl flex items-center gap-3 transition-all hover:bg-indigo-700"
           >
             <UserPlus className="w-5 h-5" /> Add Candidates
           </motion.button>
        </div>
      </div>

      {/* Filter & Search Box */}
      <div className="glass p-8 rounded-[3.5rem] shadow-2xl flex flex-col lg:flex-row gap-8 items-center border border-white/60 dark:border-white/5">
        <div className="flex-1 relative group w-full">
          <Search className="w-6 h-6 absolute left-8 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-all" />
          <input 
            type="text" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search for people, skills, or resumes..." 
            className="w-full pl-20 pr-8 py-6 bg-slate-50/50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-[2rem] focus:ring-8 focus:ring-indigo-500/5 outline-none font-bold dark:text-white text-lg placeholder:text-slate-300" 
          />
        </div>
        
        <div className="flex items-center gap-4 w-full lg:w-auto">
          <div className="flex bg-slate-100 dark:bg-slate-800 p-1.5 rounded-[2rem] border border-slate-200 dark:border-slate-700 overflow-x-auto whitespace-nowrap scrollbar-none">
            {['All', 'Interview', 'Screening', 'Offer', 'Rejected'].map(status => (
              <button 
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${statusFilter === status ? 'bg-white dark:bg-slate-700 shadow-xl text-indigo-600 dark:text-white' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'}`}
              >
                {status}
              </button>
            ))}
          </div>
          
          <div className="flex bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-700">
            <button onClick={() => setViewMode('grid')} className={`p-3 rounded-xl transition-all ${viewMode === 'grid' ? 'bg-white dark:bg-slate-700 shadow-sm text-indigo-600' : 'text-slate-400'}`}><LayoutGrid className="w-5 h-5" /></button>
            <button onClick={() => setViewMode('list')} className={`p-3 rounded-xl transition-all ${viewMode === 'list' ? 'bg-white dark:bg-slate-700 shadow-sm text-indigo-600' : 'text-slate-400'}`}><List className="w-5 h-5" /></button>
          </div>
        </div>
      </div>

      {/* Candidates Feed */}
      <div className={`grid gap-8 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'}`}>
        <AnimatePresence mode="popLayout">
          {filteredCandidates.map((c, i) => (
            <motion.div 
              key={c.id}
              layout
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: i * 0.05 }}
              className={`glass ${viewMode === 'grid' ? 'p-10 rounded-[3.5rem]' : 'p-6 rounded-[2rem] flex items-center justify-between'} shadow-xl border border-white/60 dark:border-white/5 relative group overflow-hidden`}
            >
              <div className={viewMode === 'grid' ? 'mb-0' : 'flex items-center gap-8 flex-1'}>
                <div className="absolute top-0 right-0 p-6 flex flex-col items-end">
                   <span className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest ${
                     c.status === 'Offer' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10' : 
                     c.status === 'Rejected' ? 'bg-rose-50 text-rose-600 dark:bg-rose-500/10' : 'bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10'
                   }`}>
                     {c.status}
                   </span>
                </div>
                
                <div className={`bg-gradient-to-tr from-indigo-500 to-violet-600 rounded-[2rem] flex items-center justify-center font-black text-white shadow-2xl group-hover:scale-110 transition-transform ${viewMode === 'grid' ? 'w-20 h-20 text-2xl mb-8' : 'w-14 h-14 text-xl'}`}>
                   {c.name.charAt(0)}
                </div>
                
                <div>
                  <h3 className={`font-black text-slate-900 dark:text-white tracking-tighter leading-none ${viewMode === 'grid' ? 'text-2xl mb-2' : 'text-xl'}`}>{c.name}</h3>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{c.role}</p>
                </div>
              </div>
              
              {viewMode === 'grid' && (
                <>
                  <div className="mt-8 grid grid-cols-2 gap-4">
                     <div className="p-4 bg-slate-50/50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700">
                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Match Score</p>
                        <p className="text-xl font-black text-indigo-600">{c.score}%</p>
                     </div>
                     <div className="p-4 bg-slate-50/50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700">
                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Found Via</p>
                        <p className="text-xs font-black text-slate-700 dark:text-white truncate">{c.source}</p>
                     </div>
                  </div>

                  <div className="mt-8 pt-8 border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
                     <div className="flex gap-2">
                       <button onClick={() => openActionModal(c, 'email')} className="p-3 bg-white dark:bg-slate-700 rounded-xl shadow-sm text-slate-400 hover:text-indigo-600" title="Send Email"><Mail className="w-4 h-4" /></button>
                       <button onClick={() => openActionModal(c, 'schedule')} className="p-3 bg-white dark:bg-slate-700 rounded-xl shadow-sm text-slate-400 hover:text-indigo-600" title="Schedule Call"><Calendar className="w-4 h-4" /></button>
                     </div>
                     <button onClick={() => openActionModal(c, 'details')} className="px-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 transition-all">View Details</button>
                  </div>
                </>
              )}

              {viewMode === 'list' && (
                <div className="flex items-center gap-6">
                   <div className="text-right hidden md:block">
                      <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Score</p>
                      <p className="text-sm font-black text-indigo-600">{c.score}%</p>
                   </div>
                   <div className="flex gap-2">
                      <button onClick={() => openActionModal(c, 'email')} className="p-3 bg-white dark:bg-slate-700 rounded-xl shadow-sm text-slate-400 hover:text-indigo-600"><Mail className="w-4 h-4" /></button>
                      <button onClick={() => openActionModal(c, 'details')} className="px-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 transition-all">View</button>
                   </div>
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Action Modals (Email, Schedule, Details) */}
      <AnimatePresence>
        {(selectedCandidate && activeModalAction) && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 md:p-12">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={closeActionModal} 
              className="absolute inset-0 bg-slate-950/90 backdrop-blur-2xl" 
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 50, filter: 'blur(10px)' }}
              animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, scale: 0.9, y: 50 }}
              className={`relative w-full ${activeModalAction === 'details' ? 'max-w-4xl' : 'max-w-xl'} bg-white dark:bg-slate-900 rounded-[3.5rem] shadow-2xl overflow-hidden border border-white/20`}
            >
              <div className="p-10 border-b border-slate-100 dark:border-white/5 flex items-center justify-between bg-gradient-to-r from-indigo-50/50 to-white dark:from-slate-800/50 dark:to-slate-900">
                <div className="flex items-center gap-6">
                   <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-white shadow-xl ${
                     activeModalAction === 'email' ? 'bg-indigo-600' :
                     activeModalAction === 'schedule' ? 'bg-violet-600' : 'bg-emerald-600'
                   }`}>
                      {activeModalAction === 'email' && <Mail className="w-8 h-8" />}
                      {activeModalAction === 'schedule' && <Calendar className="w-8 h-8" />}
                      {activeModalAction === 'details' && <User className="w-8 h-8" />}
                   </div>
                   <div>
                     <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter capitalize">{activeModalAction} Candidate</h3>
                     <p className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.3em] mt-2">Target: {selectedCandidate.name}</p>
                   </div>
                </div>
                <button onClick={closeActionModal} className="p-4 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-slate-400 rounded-2xl group">
                   <X className="w-7 h-7 group-hover:rotate-90 transition-transform" />
                </button>
              </div>

              <div className="p-10 max-h-[70vh] overflow-y-auto custom-scrollbar">
                {activeModalAction === 'email' && (
                  <form onSubmit={handleActionSubmit} className="space-y-6">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Subject</label>
                       <input required className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:ring-8 focus:ring-indigo-500/5 font-bold dark:text-white" defaultValue={`Interview Follow-up: ${selectedCandidate.role}`} />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Message Body</label>
                       <textarea rows={6} required className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:ring-8 focus:ring-indigo-500/5 font-bold dark:text-white resize-none" placeholder="Draft your message to the candidate..." defaultValue={`Dear ${selectedCandidate.name},\n\nWe were impressed by your background in ${selectedCandidate.role}. We'd like to move forward with...`} />
                    </div>
                    <button type="submit" disabled={isSubmitting} className="w-full py-5 bg-indigo-600 text-white font-black rounded-2xl uppercase tracking-widest text-[11px] shadow-2xl flex items-center justify-center gap-3">
                       {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                       Dispatch Email
                    </button>
                  </form>
                )}

                {activeModalAction === 'schedule' && (
                  <form onSubmit={handleActionSubmit} className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Interview Date</label>
                         <input required type="date" className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:ring-8 focus:ring-indigo-500/5 font-bold dark:text-white" />
                      </div>
                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Preferred Time</label>
                         <input required type="time" className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:ring-8 focus:ring-indigo-500/5 font-bold dark:text-white" />
                      </div>
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Interview Mode</label>
                       <select className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none font-black text-[10px] uppercase tracking-widest dark:text-white">
                          <option>Video Call (Google Meet)</option>
                          <option>In-Person HQ</option>
                          <option>Phone Screening</option>
                       </select>
                    </div>
                    <button type="submit" disabled={isSubmitting} className="w-full py-5 bg-violet-600 text-white font-black rounded-2xl uppercase tracking-widest text-[11px] shadow-2xl flex items-center justify-center gap-3">
                       {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Clock className="w-5 h-5" />}
                       Finalize Schedule
                    </button>
                  </form>
                )}

                {activeModalAction === 'details' && (
                  <div className="space-y-12">
                     <div className="flex flex-col md:flex-row items-center gap-10">
                        <div className="w-32 h-32 bg-gradient-to-tr from-indigo-500 to-violet-600 rounded-[2.5rem] flex items-center justify-center text-5xl font-black text-white shadow-2xl">
                           {selectedCandidate.name.charAt(0)}
                        </div>
                        <div className="text-center md:text-left flex-1">
                           <h4 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter leading-none">{selectedCandidate.name}</h4>
                           <p className="text-lg font-bold text-indigo-600 mt-2">{selectedCandidate.role}</p>
                           <div className="flex flex-wrap gap-4 mt-6 justify-center md:justify-start">
                              <div className="px-4 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center gap-2 border border-slate-100 dark:border-slate-700">
                                 <Building className="w-4 h-4 text-slate-400" />
                                 <span className="text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-300">Exp: {selectedCandidate.experience || 'N/A'}</span>
                              </div>
                              <div className="px-4 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center gap-2 border border-slate-100 dark:border-slate-700">
                                 <Zap className="w-4 h-4 text-amber-500" />
                                 <span className="text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-300">Score: {selectedCandidate.score}%</span>
                              </div>
                           </div>
                        </div>
                     </div>

                     <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div className="space-y-6">
                           <div className="p-8 bg-slate-50/50 dark:bg-slate-800/50 rounded-[2.5rem] border border-slate-100 dark:border-slate-700">
                              <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2"><Award className="w-4 h-4 text-indigo-500" /> Biography</h5>
                              <p className="text-sm font-medium text-slate-600 dark:text-slate-300 leading-relaxed italic">
                                 "{selectedCandidate.bio || 'No candidate summary provided yet. Synchronizing legacy data...'}"
                              </p>
                           </div>
                           <div className="p-8 bg-slate-50/50 dark:bg-slate-800/50 rounded-[2.5rem] border border-slate-100 dark:border-slate-700">
                              <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2"><Globe className="w-4 h-4 text-indigo-500" /> Digital Identity</h5>
                              <div className="space-y-3">
                                 <p className="text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-3"><Mail className="w-4 h-4 text-slate-400" /> {selectedCandidate.email}</p>
                                 <p className="text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-3"><LinkIcon className="w-4 h-4 text-slate-400" /> LinkedIn Profile / Resumé</p>
                              </div>
                           </div>
                        </div>

                        <div className="space-y-6">
                           <div className="p-8 bg-indigo-600 rounded-[2.5rem] text-white shadow-2xl shadow-indigo-900/20">
                              <h5 className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-6">Candidate Pipeline Actions</h5>
                              <div className="grid grid-cols-1 gap-3">
                                 <button onClick={() => setActiveModalAction('email')} className="w-full py-4 bg-white/10 hover:bg-white/20 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-3">
                                    <Mail className="w-4 h-4" /> Message Candidate
                                 </button>
                                 <button onClick={() => setActiveModalAction('schedule')} className="w-full py-4 bg-white/10 hover:bg-white/20 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-3">
                                    <Calendar className="w-4 h-4" /> Schedule Interview
                                 </button>
                                 <button className="w-full py-4 bg-emerald-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-xl flex items-center justify-center gap-3">
                                    <CheckCircle2 className="w-4 h-4" /> Approve for Offer
                                 </button>
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add Candidate Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 md:p-12">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => setShowAddModal(false)} 
              className="absolute inset-0 bg-slate-950/90 backdrop-blur-2xl" 
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 50, filter: 'blur(10px)' }}
              animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, scale: 0.9, y: 50 }}
              className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-[4rem] shadow-2xl overflow-hidden border border-white/20"
            >
              <div className="p-12 border-b border-slate-100 dark:border-white/5 flex items-center justify-between bg-gradient-to-r from-indigo-50/50 to-white dark:from-slate-800/50 dark:to-slate-900">
                <div className="flex items-center gap-8">
                   <div className="w-20 h-20 bg-indigo-600 rounded-[2.2rem] flex items-center justify-center text-white shadow-2xl">
                      <UserPlus className="w-10 h-10" />
                   </div>
                   <div>
                     <h3 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter leading-none">Add Talent</h3>
                     <p className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.3em] mt-3">Inject new candidate into pipeline</p>
                   </div>
                </div>
                <button onClick={() => setShowAddModal(false)} className="p-6 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-slate-400 rounded-3xl group">
                   <X className="w-8 h-8 group-hover:rotate-90 transition-transform" />
                </button>
              </div>

              <form onSubmit={handleAddCandidate} className="p-12 space-y-10 max-h-[70vh] overflow-y-auto custom-scrollbar">
                <div className="space-y-4">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 flex items-center gap-2">
                     <User className="w-3 h-3" /> Full Identity
                   </label>
                   <input 
                    required 
                    type="text" 
                    value={newCandidate.name} 
                    onChange={e => setNewCandidate({...newCandidate, name: e.target.value})} 
                    className="w-full px-8 py-5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl outline-none focus:ring-8 focus:ring-indigo-500/5 focus:border-indigo-500 font-bold dark:text-white text-lg" 
                    placeholder="Candidate Name" 
                   />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 flex items-center gap-2">
                      <Briefcase className="w-3 h-3" /> Targeted Role
                    </label>
                    <input 
                      required 
                      type="text" 
                      value={newCandidate.role} 
                      onChange={e => setNewCandidate({...newCandidate, role: e.target.value})} 
                      className="w-full px-8 py-5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl outline-none focus:ring-8 focus:ring-indigo-500/5 focus:border-indigo-500 font-bold dark:text-white" 
                      placeholder="e.g. Solutions Architect" 
                    />
                  </div>
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 flex items-center gap-2">
                      <LinkIcon className="w-3 h-3" /> Discovery Source
                    </label>
                    <select 
                      value={newCandidate.source} 
                      onChange={e => setNewCandidate({...newCandidate, source: e.target.value})}
                      className="w-full px-8 py-5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl outline-none focus:ring-8 focus:ring-indigo-500/5 focus:border-indigo-500 font-black dark:text-white appearance-none text-[10px] uppercase tracking-widest"
                    >
                      <option value="LinkedIn">LinkedIn</option>
                      <option value="Referral">Internal Referral</option>
                      <option value="Direct">Direct Application</option>
                      <option value="Recruiter">External Recruiter</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-4">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 flex items-center gap-2">
                     <Mail className="w-3 h-3" /> Communication Path
                   </label>
                   <input 
                    required 
                    type="email" 
                    value={newCandidate.email} 
                    onChange={e => setNewCandidate({...newCandidate, email: e.target.value})} 
                    className="w-full px-8 py-5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl outline-none focus:ring-8 focus:ring-indigo-500/5 focus:border-indigo-500 font-bold dark:text-white text-lg" 
                    placeholder="candidate@email.com" 
                   />
                </div>

                <div className="pt-8 flex gap-6">
                  <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 py-6 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-black rounded-[2rem] uppercase tracking-widest text-[10px] hover:bg-slate-200 transition-all">Abort Process</button>
                  <button type="submit" disabled={isSubmitting} className="flex-1 py-6 bg-indigo-600 text-white font-black rounded-[2rem] shadow-2xl hover:bg-indigo-700 transition-all uppercase tracking-widest text-[10px] flex items-center justify-center gap-3">
                    {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Zap className="w-5 h-5" />}
                    Inject Candidate
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TalentEngine;
