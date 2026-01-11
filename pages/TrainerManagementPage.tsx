import React, { useState, useMemo } from 'react';
import { 
  UserRoundSearch, Plus, Search, Filter, Mail, Phone, 
  MapPin, Award, Calendar as CalendarIcon, CheckCircle, Clock, 
  MoreVertical, Edit3, Trash2, X, ChevronRight, ChevronLeft, User as UserIcon,
  ShieldCheck, Trash, Zap, Sun, Moon, Briefcase, ArrowRight,
  UserPlus, Sparkles, Fingerprint, ChevronDown, RotateCcw,
  Camera, Upload, History as HistoryIcon, Tag, Search as SearchIcon,
  Star, TrendingUp, BarChart3, MessageSquare, ExternalLink,
  Target, GraduationCap, AlertCircle, Info, Sparkle,
  Activity, PieChart as PieIcon, Flame, Heart,
  Users, Database, LayoutGrid, List, Layers, Coins, 
  Quote, ThumbsUp, Trophy, Wallet, Receipt, LineChart,
  CalendarCheck
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  AreaChart, Area, Cell, PieChart, Pie, ScatterChart, Scatter, ZAxis
} from 'recharts';
// Cast motion to any to bypass environment-specific type definition issues
import { motion as motionAny, AnimatePresence } from 'framer-motion';
const motion = motionAny as any;
import { UserRole, TrainerProfile, AvailabilitySlot, TrainingStatus } from '../types';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const TrainerManagementPage: React.FC<{ store: any }> = ({ store }) => {
  const { data, updateTrainerProfile, addTrainerUser, updateUserAvatar } = store;
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'heatmap'>('grid');
  const [selectedTrainer, setSelectedTrainer] = useState<any>(null);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [activeProfileTab, setActiveProfileTab] = useState<'details' | 'calendar' | 'history' | 'analytics' | 'ledger' | 'mentorship'>('details');
  
  // Onboarding Form State
  const [onboardingForm, setOnboardingForm] = useState({
    name: '',
    email: '',
    bio: '',
    availability: 'Available' as any,
    skills: [] as string[]
  });

  // Skill Input State
  const [skillInput, setSkillInput] = useState('');
  const [skillLevel, setSkillLevel] = useState<'Beginner' | 'Intermediate' | 'Expert'>('Intermediate');

  const trainers = useMemo(() => {
    return data.users.filter((u: any) => u.role === UserRole.TRAINER && u.active);
  }, [data.users]);

  const getProfile = (userId: string) => {
    return data.trainerProfiles.find((p: any) => p.userId === userId) || {
      userId,
      skills: [],
      availability: 'Available',
      bio: '',
      courses: [],
      availabilitySlots: [],
      activityLog: []
    };
  };

  const getTrainerIntelligence = (userId: string) => {
    const batches = data.trainingClasses.filter((t: any) => t.trainerId === userId);
    const totalHours = batches.reduce((acc: number, b: any) => acc + b.hours, 0);
    const ongoing = batches.filter((b: any) => b.status === TrainingStatus.ONGOING).length;
    const completed = batches.filter((b: any) => b.status === TrainingStatus.COMPLETED).length;
    const utilization = Math.min(Math.round((totalHours / 160) * 100), 100);
    
    // Financial calculations
    const hourlyRate = 75; // Mock rate
    const earnings = totalHours * hourlyRate;
    const projectedEarnings = batches.filter((b: any) => b.status !== TrainingStatus.COMPLETED).reduce((acc: number, b: any) => acc + b.hours * hourlyRate, 0);

    const profile = getProfile(userId);
    const skillData = profile.skills.map((s: string) => {
      const [name, level] = s.split(':');
      return { 
        subject: name, 
        A: level === 'Expert' ? 100 : level === 'Intermediate' ? 65 : 35,
        fullMark: 100 
      };
    });

    return { batches, totalHours, ongoing, completed, utilization, skillData, earnings, projectedEarnings, hourlyRate };
  };

  const filteredTrainers = useMemo(() => {
    return trainers.filter((t: any) => {
      const matchesSearch = t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            t.email.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSearch;
    });
  }, [trainers, searchTerm]);

  const handleEditProfile = (trainer: any) => {
    const profile = getProfile(trainer.id);
    setSelectedTrainer({ 
      ...trainer, 
      ...profile,
      availabilitySlots: profile.availabilitySlots || [],
      activityLog: profile.activityLog || []
    });
    setEditModalOpen(true);
    setActiveProfileTab('details');
  };

  const handleSkillAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (skillInput.trim()) {
      const skillEntry = `${skillInput.trim()}:${skillLevel}`;
      if (!selectedTrainer.skills.some((s: string) => s.startsWith(skillInput.trim()))) {
        setSelectedTrainer({ ...selectedTrainer, skills: [...selectedTrainer.skills, skillEntry] });
      }
      setSkillInput('');
    }
  };

  const handleUpdateSlot = (slotId: string, field: keyof AvailabilitySlot, value: string) => {
    setSelectedTrainer({
      ...selectedTrainer,
      availabilitySlots: selectedTrainer.availabilitySlots.map((s: any) => 
        s.id === slotId ? { ...s, [field]: value } : s
      )
    });
  };

  const handleRemoveSlot = (slotId: string) => {
    setSelectedTrainer({
      ...selectedTrainer,
      availabilitySlots: selectedTrainer.availabilitySlots.filter((s: any) => s.id !== slotId)
    });
  };

  const saveProfile = () => {
    if (!selectedTrainer) return;
    const profile: TrainerProfile = {
      userId: selectedTrainer.id,
      skills: selectedTrainer.skills,
      availability: selectedTrainer.availability,
      bio: selectedTrainer.bio,
      courses: selectedTrainer.courses,
      availabilitySlots: selectedTrainer.availabilitySlots,
      activityLog: selectedTrainer.activityLog
    };
    updateTrainerProfile(profile);
    if (selectedTrainer.avatar) {
      updateUserAvatar(selectedTrainer.id, selectedTrainer.avatar);
    }
    setEditModalOpen(false);
  };

  return (
    <div className="space-y-10 pb-20 animate-in fade-in duration-700">
      {/* Dynamic Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-2 mb-3">
             <div className="w-10 h-1 bg-indigo-500 rounded-full" />
             <span className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.4em]">Faculty Management</span>
          </motion.div>
          <h2 className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter">
            Expert <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">Directory</span>
          </h2>
          <p className="text-slate-500 dark:text-slate-400 font-bold text-lg mt-3">Strategic oversight of global instructor talent and curriculum delivery.</p>
        </div>
        <div className="flex gap-4">
           <div className="flex bg-slate-100 dark:bg-slate-800 p-1.5 rounded-[1.5rem] border border-slate-200 dark:border-slate-700">
              <button 
                onClick={() => setViewMode('grid')}
                className={`p-3 rounded-xl transition-all ${viewMode === 'grid' ? 'bg-white dark:bg-slate-700 shadow-sm text-indigo-600 dark:text-white' : 'text-slate-400'}`}
              >
                <LayoutGrid className="w-5 h-5" />
              </button>
              <button 
                onClick={() => setViewMode('heatmap')}
                className={`p-3 rounded-xl transition-all ${viewMode === 'heatmap' ? 'bg-white dark:bg-slate-700 shadow-sm text-indigo-600 dark:text-white' : 'text-slate-400'}`}
              >
                <CalendarCheck className="w-5 h-5" />
              </button>
           </div>
           <motion.button 
             whileHover={{ scale: 1.05, y: -4 }}
             whileTap={{ scale: 0.95 }}
             onClick={() => setAddModalOpen(true)}
             className="px-8 py-5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-3xl font-black uppercase tracking-widest text-[10px] shadow-2xl flex items-center gap-3 transition-all"
           >
             <UserPlus className="w-5 h-5" />
             Onboard Faculty
           </motion.button>
        </div>
      </div>

      {/* Global Search Interface */}
      <motion.div 
        layout
        className="glass p-8 rounded-[3.5rem] shadow-2xl shadow-slate-200/40 dark:shadow-none border border-white/60 dark:border-white/5 flex flex-col md:flex-row gap-8 items-center border border-white/60 dark:border-white/5"
      >
        <div className="flex-1 relative group w-full">
          <Search className="w-6 h-6 absolute left-8 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-all" />
          <input 
            type="text" 
            placeholder="Search by expertise, name, or digital credential..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-20 pr-8 py-6 bg-slate-50/50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-[2rem] focus:ring-8 focus:ring-indigo-500/5 focus:border-indigo-500 outline-none font-bold transition-all dark:text-white text-lg placeholder:text-slate-300"
          />
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="px-8 py-6 bg-indigo-50/50 dark:bg-indigo-500/10 rounded-[2rem] border border-indigo-100 dark:border-indigo-500/20 flex items-center gap-5 whitespace-nowrap">
            <div className="p-3 bg-indigo-600 rounded-2xl text-white shadow-lg">
               <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-2">Verified Roster</p>
              <p className="text-xl font-black text-indigo-700 dark:text-indigo-400 leading-none">{filteredTrainers.length} Instructors</p>
            </div>
          </div>
        </div>
      </motion.div>

      <AnimatePresence mode="wait">
        {viewMode === 'grid' ? (
          <motion.div 
            key="grid" 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-10"
          >
            {filteredTrainers.map((trainer: any, idx: number) => {
              const profile = getProfile(trainer.id);
              const intel = getTrainerIntelligence(trainer.id);
              return (
                <motion.div
                  key={trainer.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9, y: 30 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: idx * 0.05, type: 'spring', damping: 20 }}
                  className="group relative"
                >
                  <div className="glass h-full p-10 rounded-[4rem] shadow-xl hover:shadow-[0_50px_100px_-20px_rgba(0,0,0,0.1)] transition-all duration-700 border border-white/60 dark:border-white/5 flex flex-col overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-[80px] -mr-10 -mt-10 group-hover:bg-indigo-500/10 transition-all duration-700" />
                    
                    <div className="flex items-start justify-between mb-8 relative z-10">
                      <span className={`px-4 py-1.5 rounded-2xl text-[9px] font-black uppercase tracking-widest flex items-center gap-2 shadow-sm ${
                        profile.availability === 'Available' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10' : 
                        profile.availability === 'Busy' ? 'bg-rose-50 text-rose-600 dark:bg-rose-500/10' : 'bg-amber-50 text-amber-600 dark:bg-amber-500/10'
                      }`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${
                          profile.availability === 'Available' ? 'bg-emerald-500 animate-pulse' : 
                          profile.availability === 'Busy' ? 'bg-rose-500' : 'bg-amber-500'
                        }`} />
                        {profile.availability}
                      </span>
                      <button onClick={() => handleEditProfile(trainer)} className="p-3 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 text-slate-400 hover:text-indigo-600 transition-all shadow-sm">
                        <ExternalLink className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex flex-col items-center text-center mb-10 relative z-10">
                      <div className="relative mb-8 group-hover:scale-105 transition-transform duration-700">
                        <div className="w-28 h-28 rounded-[3rem] bg-gradient-to-br from-indigo-500 to-violet-600 p-1 shadow-2xl relative overflow-hidden">
                          <div className="w-full h-full bg-white dark:bg-slate-900 rounded-[2.8rem] flex items-center justify-center text-4xl font-black text-indigo-600 overflow-hidden">
                            {trainer.avatar ? <img src={trainer.avatar} className="w-full h-full object-cover" /> : trainer.name.charAt(0)}
                          </div>
                        </div>
                        <div className="absolute -bottom-2 -right-2 p-3 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-50 dark:border-slate-700 group-hover:rotate-12 transition-transform">
                          <ShieldCheck className="w-5 h-5 text-indigo-500" />
                        </div>
                      </div>
                      <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter group-hover:text-indigo-600 transition-colors">{trainer.name}</h3>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-3">Elite Faculty</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-10 relative z-10">
                      <div className="p-5 bg-slate-50/50 dark:bg-slate-800/50 rounded-[2rem] border border-slate-100 dark:border-slate-700">
                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Utilization</p>
                        <div className="flex items-baseline gap-1">
                          <span className="text-xl font-black text-slate-900 dark:text-white">{intel.utilization}%</span>
                          <BarChart3 className="w-3.5 h-3.5 text-indigo-500" />
                        </div>
                      </div>
                      <div className="p-5 bg-slate-50/50 dark:bg-slate-800/50 rounded-[2rem] border border-slate-100 dark:border-slate-700">
                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Impact Score</p>
                        <div className="flex items-baseline gap-1">
                          <span className="text-xl font-black text-slate-900 dark:text-white">4.9</span>
                          <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                        </div>
                      </div>
                    </div>

                    <div className="mt-auto relative z-10">
                      <motion.button 
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleEditProfile(trainer)}
                        className="w-full py-5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-[2rem] font-black text-[10px] uppercase tracking-widest shadow-2xl transition-all flex items-center justify-center gap-3 hover:bg-indigo-600 dark:hover:bg-indigo-500"
                      >
                        <Zap className="w-4 h-4 fill-white dark:fill-slate-900" /> Access Analytics
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        ) : (
          <motion.div 
            key="heatmap" 
            initial={{ opacity: 0, scale: 0.98 }} 
            animate={{ opacity: 1, scale: 1 }} 
            exit={{ opacity: 0, scale: 0.98 }}
            className="glass p-12 rounded-[4rem] border border-white/60 dark:border-white/5 shadow-2xl"
          >
            <div className="flex items-center justify-between mb-12">
               <div>
                 <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Resource Capacity Matrix</h3>
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-2">Week-over-Week Load Distribution</p>
               </div>
               <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-indigo-100 rounded-sm" />
                    <span className="text-[9px] font-black text-slate-400 uppercase">Idle</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-indigo-400 rounded-sm" />
                    <span className="text-[9px] font-black text-slate-400 uppercase">Loaded</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-indigo-700 rounded-sm" />
                    <span className="text-[9px] font-black text-slate-400 uppercase">Saturated</span>
                  </div>
               </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="p-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Faculty Identity</th>
                    {DAYS.map(day => <th key={day} className="p-4 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">{day.slice(0, 3)}</th>)}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                  {trainers.map((t: any) => {
                    const profile = getProfile(t.id);
                    return (
                      <tr key={t.id} className="group hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                        <td className="p-4 py-6">
                           <div className="flex items-center gap-4">
                             <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-[10px] font-black text-white shadow-lg overflow-hidden">
                                {t.avatar ? <img src={t.avatar} /> : t.name.charAt(0)}
                             </div>
                             <div>
                               <p className="text-sm font-black text-slate-900 dark:text-white leading-none mb-1">{t.name}</p>
                               <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Global Resource</p>
                             </div>
                           </div>
                        </td>
                        {DAYS.map(day => {
                          const hasSlot = profile.availabilitySlots?.some((s: any) => s.day === day);
                          const isBusy = data.trainingClasses.some((tc: any) => tc.trainerId === t.id && tc.status === TrainingStatus.ONGOING);
                          return (
                            <td key={day} className="p-2">
                               <div className={`w-full h-12 rounded-xl border-2 transition-all cursor-help ${
                                 !hasSlot ? 'bg-slate-50 dark:bg-slate-800 border-transparent opacity-20' :
                                 isBusy ? 'bg-indigo-700 border-indigo-800 shadow-lg shadow-indigo-500/20' : 
                                 'bg-indigo-100 dark:bg-indigo-500/20 border-indigo-200 dark:border-indigo-500/30'
                               }`} title={isBusy ? 'Active Session' : hasSlot ? 'Available' : 'Resting'} />
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* COMPREHENSIVE TRAINER DASHBOARD MODAL */}
      <AnimatePresence>
        {isEditModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 md:p-12 overflow-y-auto overflow-x-hidden">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => setEditModalOpen(false)} 
              className="absolute inset-0 bg-white/20 dark:bg-slate-900/40 backdrop-blur-xl" 
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 50, filter: 'blur(10px)' }}
              animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, scale: 0.9, y: 50 }}
              className="relative w-full max-w-7xl bg-white dark:bg-slate-900 rounded-[4rem] shadow-2xl overflow-hidden border border-white/20 flex flex-col xl:flex-row h-[90vh]"
            >
              {/* Sidebar Branding & Navigation */}
              <div className="xl:w-80 bg-slate-50 dark:bg-slate-800/50 border-r border-slate-100 dark:border-white/5 p-12 flex flex-col">
                <div className="flex flex-col items-center text-center mb-12">
                   <div className="w-32 h-32 rounded-[3.5rem] bg-indigo-600 p-1 shadow-2xl mb-6 relative overflow-hidden group">
                     <div className="w-full h-full bg-white dark:bg-slate-900 rounded-[3.2rem] flex items-center justify-center text-4xl font-black text-indigo-600 overflow-hidden">
                        {selectedTrainer.avatar ? <img src={selectedTrainer.avatar} className="w-full h-full object-cover" /> : selectedTrainer.name.charAt(0)}
                     </div>
                     <label className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center cursor-pointer">
                        <Camera className="w-6 h-6 text-white mb-1" />
                        <span className="text-[8px] font-black text-white uppercase tracking-widest">Update</span>
                        <input type="file" className="hidden" />
                     </label>
                   </div>
                   <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter leading-tight">{selectedTrainer.name}</h3>
                   <p className="text-[9px] font-black text-indigo-500 uppercase tracking-[0.2em] mt-2">Verified Professional</p>
                </div>

                <div className="space-y-3 flex-1 overflow-y-auto custom-scrollbar pr-2">
                   {[
                     { id: 'details', label: 'Intelligence Profile', icon: <Fingerprint className="w-5 h-5" /> },
                     { id: 'calendar', label: 'Availability Matrix', icon: <CalendarIcon className="w-5 h-5" /> },
                     { id: 'history', label: 'Delivery History', icon: <HistoryIcon className="w-5 h-5" /> },
                     { id: 'analytics', label: 'Strategic Analytics', icon: <BarChart3 className="w-5 h-5" /> },
                     { id: 'ledger', label: 'Financial Ledger', icon: <Wallet className="w-5 h-5" /> },
                     { id: 'mentorship', label: 'Mentorship Hub', icon: <Quote className="w-5 h-5" /> }
                   ].map(tab => (
                     <button
                       key={tab.id}
                       onClick={() => setActiveProfileTab(tab.id as any)}
                       className={`w-full flex items-center gap-4 px-6 py-5 rounded-[1.8rem] transition-all duration-500 group ${activeProfileTab === tab.id ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-500/30' : 'text-slate-400 hover:bg-white dark:hover:bg-slate-800 hover:text-indigo-600'}`}
                     >
                       <div className={`${activeProfileTab === tab.id ? 'text-white' : 'text-slate-300 group-hover:text-indigo-500'}`}>{tab.icon}</div>
                       <span className="text-xs font-black uppercase tracking-widest">{tab.label}</span>
                     </button>
                   ))}
                </div>

                <button onClick={saveProfile} className="mt-8 py-5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-[2rem] font-black text-[10px] uppercase tracking-widest shadow-xl flex items-center justify-center gap-3">
                   <ShieldCheck className="w-5 h-5" /> Sync Profile
                </button>
              </div>

              {/* Main Tabbed Content Area */}
              <div className="flex-1 p-12 overflow-y-auto custom-scrollbar bg-white dark:bg-slate-900">
                <div className="flex items-center justify-between mb-16">
                   <div>
                     <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-2">Faculty Hub</h4>
                     <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter capitalize">{activeProfileTab.replace('details', 'Identity')} Details</h2>
                   </div>
                   <button onClick={() => setEditModalOpen(false)} className="p-5 bg-slate-50 dark:bg-slate-800 rounded-3xl text-slate-400 hover:text-rose-500 transition-all group">
                     <X className="w-8 h-8 group-hover:rotate-90 transition-transform" />
                   </button>
                </div>

                <AnimatePresence mode="wait">
                  {activeProfileTab === 'details' && (
                    <motion.div key="details" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-12 max-w-4xl">
                       <div className="space-y-6">
                         <label className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-3"><Briefcase className="w-5 h-5 text-indigo-500" /> Professional Narrative</label>
                         <textarea 
                           rows={6} 
                           value={selectedTrainer.bio} 
                           onChange={(e) => setSelectedTrainer({...selectedTrainer, bio: e.target.value})} 
                           className="w-full px-10 py-8 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 rounded-[3rem] outline-none font-bold text-slate-700 dark:text-slate-300 resize-none shadow-inner text-lg leading-relaxed"
                           placeholder="Architect the instructor's professional journey..."
                         />
                       </div>

                       <div className="space-y-10">
                         <label className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-3"><Award className="w-5 h-5 text-indigo-500" /> Expertise Matrix</label>
                         <form onSubmit={handleSkillAdd} className="flex gap-4">
                            <input type="text" value={skillInput} onChange={(e) => setSkillInput(e.target.value)} placeholder="Map New Domain (e.g. Azure Security)" className="flex-1 px-8 py-5 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-[2rem] outline-none font-bold text-slate-900 dark:text-white" />
                            <select value={skillLevel} onChange={(e) => setSkillLevel(e.target.value as any)} className="px-6 py-5 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-[2rem] outline-none font-black text-indigo-600 uppercase tracking-widest text-[10px] appearance-none cursor-pointer"><option>Beginner</option><option>Intermediate</option><option>Expert</option></select>
                            <button type="submit" className="p-5 bg-indigo-600 text-white rounded-[1.5rem] shadow-2xl shadow-indigo-200 hover:bg-indigo-700 transition-all"><Plus className="w-7 h-7" /></button>
                         </form>
                         
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {selectedTrainer.skills.map((skillEntry: string) => {
                               const [name, level] = skillEntry.includes(':') ? skillEntry.split(':') : [skillEntry, 'Expert'];
                               return (
                                 <motion.div layout key={name} className="p-6 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-[2rem] flex items-center justify-between group hover:shadow-xl transition-all border-l-8 border-l-indigo-600">
                                    <div className="flex items-center gap-5">
                                       <div className={`p-3 rounded-2xl ${level === 'Expert' ? 'bg-indigo-50 text-indigo-600' : 'bg-amber-50 text-amber-600'}`}>
                                          <Sparkle className="w-5 h-5" />
                                       </div>
                                       <div><p className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">{name}</p><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">{level} Proficiency</p></div>
                                    </div>
                                    <button onClick={() => setSelectedTrainer({...selectedTrainer, skills: selectedTrainer.skills.filter((s: string) => s !== skillEntry)})} className="p-3 text-slate-200 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all"><Trash2 className="w-5 h-5" /></button>
                                 </motion.div>
                               );
                            })}
                         </div>
                       </div>
                    </motion.div>
                  )}

                  {activeProfileTab === 'calendar' && (
                    <motion.div key="calendar" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-10">
                       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                          {DAYS.map(day => {
                             const daySlots = selectedTrainer.availabilitySlots.filter((s: any) => s.day === day);
                             return (
                               <div key={day} className="glass p-8 rounded-[3rem] border border-white/60 dark:border-white/5 flex flex-col min-h-[300px]">
                                  <div className="flex items-center justify-between mb-8">
                                     <h5 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-[0.2em]">{day}</h5>
                                     <button onClick={() => setSelectedTrainer({...selectedTrainer, availabilitySlots: [...selectedTrainer.availabilitySlots, { id: Math.random().toString(36).substr(2, 9), day, startTime: '09:00', endTime: '17:00' }]})} className="p-2 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-xl hover:bg-indigo-600 hover:text-white transition-all"><Plus className="w-4 h-4" /></button>
                                  </div>
                                  <div className="space-y-3 flex-1">
                                     {daySlots.map((slot: any) => (
                                       <div key={slot.id} className="group p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl space-y-3 relative border border-transparent hover:border-indigo-200 transition-all">
                                          <div className="flex items-center justify-between gap-2">
                                            <input type="time" value={slot.startTime} onChange={(e) => handleUpdateSlot(slot.id, 'startTime', e.target.value)} className="w-full bg-white dark:bg-slate-700 border-none rounded-lg p-1.5 text-[9px] font-black outline-none" />
                                            <span className="text-[8px] font-black text-slate-400">TO</span>
                                            <input type="time" value={slot.endTime} onChange={(e) => handleUpdateSlot(slot.id, 'endTime', e.target.value)} className="w-full bg-white dark:bg-slate-700 border-none rounded-lg p-1.5 text-[9px] font-black outline-none" />
                                          </div>
                                          <button onClick={() => handleRemoveSlot(slot.id)} className="absolute -top-2 -right-2 p-1.5 bg-rose-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-all shadow-lg scale-75"><X className="w-3 h-3" /></button>
                                       </div>
                                     ))}
                                     {daySlots.length === 0 && <div className="flex-1 flex flex-col items-center justify-center opacity-20 text-slate-400"><Moon className="w-8 h-8 mb-2" /><span className="text-[9px] font-black uppercase tracking-widest">Inactive</span></div>}
                                  </div>
                               </div>
                             );
                          })}
                       </div>
                    </motion.div>
                  )}

                  {activeProfileTab === 'history' && (
                    <motion.div key="history" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-12">
                       <div className="relative pl-12 space-y-16">
                          <div className="absolute left-6 top-2 bottom-2 w-1 bg-gradient-to-b from-indigo-500 to-transparent rounded-full" />
                          {data.trainingClasses.filter((t: any) => t.trainerId === selectedTrainer.id).sort((a: any, b: any) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()).map((batch: any, i: number) => (
                            <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} key={batch.id} className="relative group">
                               <div className="absolute -left-[30px] top-1/2 -translate-y-1/2 w-8 h-8 bg-white dark:bg-slate-900 border-4 border-indigo-600 rounded-full shadow-xl group-hover:scale-125 transition-transform duration-500" />
                               <div className="glass p-10 rounded-[3.5rem] border border-white/60 dark:border-white/5 flex flex-col md:flex-row items-center justify-between gap-10 hover:shadow-2xl transition-all border-l-8 border-l-indigo-600">
                                  <div className="flex items-center gap-8">
                                     <div className="w-20 h-20 bg-indigo-50 dark:bg-indigo-500/10 rounded-[2rem] flex items-center justify-center text-indigo-600 shadow-inner"><GraduationCap className="w-10 h-10" /></div>
                                     <div>
                                        <p className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.3em] mb-2">{new Date(batch.startDate).toLocaleDateString()} Batch</p>
                                        <h4 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{batch.courseName}</h4>
                                        <div className="flex items-center gap-6 mt-3">
                                           <div className="flex items-center gap-2 text-xs font-bold text-slate-400"><Users className="w-4 h-4" /> 12 Graduates</div>
                                           <div className="flex items-center gap-2 text-xs font-bold text-slate-400"><Clock className="w-4 h-4" /> {batch.hours} Hours</div>
                                        </div>
                                     </div>
                                  </div>
                                  <div className="flex flex-wrap gap-3">
                                     <button className="px-6 py-3 bg-emerald-50 text-emerald-600 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2"><CheckCircle className="w-4 h-4" /> Verification Clear</button>
                                     <button className="px-6 py-3 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2"><ShieldCheck className="w-4 h-4" /> Certs Audit</button>
                                  </div>
                               </div>
                            </motion.div>
                          ))}
                       </div>
                    </motion.div>
                  )}

                  {activeProfileTab === 'analytics' && (
                    <motion.div key="analytics" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-12 pb-12">
                       <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                          <div className="glass p-12 rounded-[4rem] shadow-xl border-white/60 dark:border-white/5 flex flex-col">
                             <h5 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-[0.2em] mb-12 flex items-center justify-between">
                                Talent Capability Mapping <Sparkles className="w-5 h-5 text-indigo-500" />
                             </h5>
                             <div className="h-[400px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                   <RadarChart cx="50%" cy="50%" outerRadius="80%" data={getTrainerIntelligence(selectedTrainer.id).skillData}>
                                      <PolarGrid stroke="#e2e8f0" />
                                      <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 900 }} />
                                      <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                                      <Radar name="Expertise" dataKey="A" stroke="#6366f1" fill="#6366f1" fillOpacity={0.6} dot={{ r: 4, fill: '#6366f1' }} />
                                   </RadarChart>
                                </ResponsiveContainer>
                             </div>
                          </div>

                          <div className="space-y-12">
                             <div className="grid grid-cols-2 gap-8">
                                <div className="glass p-10 rounded-[3rem] border-white/60 dark:border-white/5 relative overflow-hidden">
                                   <div className="absolute top-0 right-0 p-4"><Heart className="w-8 h-8 text-rose-500/10" /></div>
                                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Student Rating</p>
                                   <h3 className="text-4xl font-black text-slate-900 dark:text-white leading-none">4.92<span className="text-lg text-slate-400">/5</span></h3>
                                   <div className="flex items-center gap-1 mt-4">
                                      {[1, 2, 3, 4, 5].map(s => <Star key={s} className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />)}
                                   </div>
                                </div>
                                <div className="glass p-10 rounded-[3rem] border-white/60 dark:border-white/5 relative overflow-hidden">
                                   <div className="absolute top-0 right-0 p-4"><Flame className="w-8 h-8 text-amber-500/10" /></div>
                                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">NPS Velocity</p>
                                   <h3 className="text-4xl font-black text-slate-900 dark:text-white leading-none">94<span className="text-lg text-slate-400">%</span></h3>
                                   <p className="text-[9px] font-black text-emerald-500 uppercase tracking-widest mt-4">High Performance</p>
                                </div>
                             </div>

                             <div className="glass p-12 rounded-[4rem] border-white/60 dark:border-white/5">
                                <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-10">Historical Workload Trend</h5>
                                <div className="h-[180px] w-full">
                                   <ResponsiveContainer width="100%" height="100%">
                                      <AreaChart data={[
                                        { month: 'Jan', h: 30 }, { month: 'Feb', h: 45 }, { month: 'Mar', h: 60 },
                                        { month: 'Apr', h: 55 }, { month: 'May', h: 70 }, { month: 'Jun', h: 80 }
                                      ]}>
                                         <defs>
                                            <linearGradient id="colorH" x1="0" y1="0" x2="0" y2="1">
                                               <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/>
                                               <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                                            </linearGradient>
                                         </defs>
                                         <XAxis dataKey="month" hide />
                                         <Tooltip 
                                           contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 40px rgba(0,0,0,0.2)', fontSize: '10px', fontWeight: 'bold' }}
                                           labelStyle={{ display: 'none' }}
                                         />
                                         <Area type="monotone" dataKey="h" stroke="#6366f1" strokeWidth={4} fill="url(#colorH)" dot={{ r: 6, fill: '#6366f1' }} />
                                      </AreaChart>
                                   </ResponsiveContainer>
                                </div>
                             </div>
                          </div>
                       </div>
                    </motion.div>
                  )}

                  {activeProfileTab === 'ledger' && (
                    <motion.div key="ledger" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-12 pb-12">
                       <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                          <div className="p-8 bg-indigo-600 rounded-[2.5rem] text-white shadow-2xl shadow-indigo-200">
                             <div className="flex items-center justify-between mb-6">
                                <Wallet className="w-8 h-8 opacity-40" />
                                <span className="px-3 py-1 bg-white/20 rounded-lg text-[9px] font-black uppercase tracking-widest">Active Ledger</span>
                             </div>
                             <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-1">Total Payout Accrued</p>
                             <h3 className="text-4xl font-black tracking-tight">${getTrainerIntelligence(selectedTrainer.id).earnings.toLocaleString()}</h3>
                          </div>
                          <div className="p-8 bg-white dark:bg-slate-800 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 shadow-xl">
                             <div className="flex items-center justify-between mb-6">
                                <Receipt className="w-8 h-8 text-indigo-500" />
                                <span className="px-3 py-1 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 rounded-lg text-[9px] font-black uppercase tracking-widest">Projected</span>
                             </div>
                             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Upcoming Milestone ROI</p>
                             <h3 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">${getTrainerIntelligence(selectedTrainer.id).projectedEarnings.toLocaleString()}</h3>
                          </div>
                          <div className="p-8 bg-white dark:bg-slate-800 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 shadow-xl">
                             <div className="flex items-center justify-between mb-6">
                                <Coins className="w-8 h-8 text-indigo-500" />
                                <span className="px-3 py-1 bg-slate-100 dark:bg-white/10 text-slate-500 dark:text-slate-400 rounded-lg text-[9px] font-black uppercase tracking-widest">Global Rate</span>
                             </div>
                             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Hourly Faculty Rate</p>
                             <h3 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">${getTrainerIntelligence(selectedTrainer.id).hourlyRate}<span className="text-lg opacity-40">/hr</span></h3>
                          </div>
                       </div>

                       <div className="bg-white dark:bg-slate-800/40 rounded-[3rem] border border-slate-100 dark:border-white/5 overflow-hidden">
                          <table className="w-full text-left">
                            <thead className="bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-white/5">
                              <tr>
                                <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Assignment Cluster</th>
                                <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Delivery Metrics</th>
                                <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Fiscal Status</th>
                                <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Total Payout</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                               {getTrainerIntelligence(selectedTrainer.id).batches.map((batch: any) => (
                                 <tr key={batch.id} className="hover:bg-slate-50/50 dark:hover:bg-white/5 transition-all">
                                    <td className="p-6">
                                       <p className="text-sm font-black text-slate-900 dark:text-white">{batch.courseName}</p>
                                       <p className="text-[9px] font-bold text-slate-400 uppercase mt-1">Batch {batch.id}</p>
                                    </td>
                                    <td className="p-6">
                                       <div className="flex items-center gap-3">
                                          <Clock className="w-3.5 h-3.5 text-indigo-500" />
                                          <span className="text-xs font-bold text-slate-600 dark:text-slate-400">{batch.hours}h Certified Session</span>
                                       </div>
                                    </td>
                                    <td className="p-6">
                                       <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${
                                         batch.status === TrainingStatus.COMPLETED ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                                       }`}>
                                         {batch.status === TrainingStatus.COMPLETED ? 'Processed' : 'Accruing'}
                                       </span>
                                    </td>
                                    <td className="p-6 text-right font-black text-slate-900 dark:text-white">
                                       ${(batch.hours * 75).toLocaleString()}
                                    </td>
                                 </tr>
                               ))}
                            </tbody>
                          </table>
                       </div>
                    </motion.div>
                  )}

                  {activeProfileTab === 'mentorship' && (
                    <motion.div key="mentorship" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-12 pb-12">
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                          <div className="glass p-12 rounded-[4rem] border-white/60 dark:border-white/5 shadow-xl flex flex-col">
                             <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-10 flex items-center gap-3"><ThumbsUp className="w-5 h-5 text-indigo-500" /> Coaching Impact Index</h5>
                             <div className="flex-1 flex flex-col items-center justify-center text-center">
                                <div className="relative mb-8">
                                   <div className="w-48 h-48 rounded-full border-8 border-indigo-500/20 flex items-center justify-center relative">
                                      <div className="absolute inset-0 border-8 border-indigo-600 rounded-full" style={{ clipPath: 'polygon(0 0, 92% 0, 92% 100%, 0 100%)' }} />
                                      <h3 className="text-6xl font-black text-slate-900 dark:text-white tracking-tighter">92<span className="text-2xl opacity-40">%</span></h3>
                                   </div>
                                </div>
                                <p className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Student Success Ratio</p>
                                <p className="text-sm font-medium text-slate-400 mt-2">Verified through learner certification outcome</p>
                             </div>
                          </div>

                          <div className="space-y-10">
                             <div className="flex items-center justify-between mb-2">
                                <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Verified Learner Reviews</h5>
                                <div className="flex items-center gap-2">
                                   <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                                   <span className="text-sm font-black text-slate-900 dark:text-white">4.9 Overall</span>
                                </div>
                             </div>
                             <div className="space-y-6">
                                {[
                                  { name: 'Sarah K.', role: 'Cloud Engineer', text: 'Exceptionally knowledgeable and patient. Broke down complex AWS VPC concepts with ease.', score: 100 },
                                  { name: 'Michael T.', role: 'DevOps Lead', text: 'One of the best sessions I have attended in 10 years. Highly practical approach to security.', score: 98 },
                                  { name: 'Linda J.', role: 'HR Manager', text: 'Perfect pace and great interactive modules. Everyone in my team passed the certification!', score: 95 }
                                ].map((review, i) => (
                                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} key={i} className="p-8 bg-slate-50 dark:bg-slate-800/50 rounded-[2.5rem] border border-slate-100 dark:border-white/5 relative group">
                                     <div className="absolute -left-2 top-8 p-3 bg-indigo-600 text-white rounded-2xl shadow-xl scale-90 group-hover:scale-100 transition-all"><Quote className="w-4 h-4" /></div>
                                     <div className="pl-6">
                                        <p className="text-sm italic font-medium text-slate-600 dark:text-slate-300 leading-relaxed mb-6">"{review.text}"</p>
                                        <div className="flex items-center justify-between border-t border-slate-100 dark:border-white/5 pt-4">
                                           <div className="flex items-center gap-3">
                                              <div className="w-8 h-8 rounded-xl bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-[10px] font-black">{review.name.charAt(0)}</div>
                                              <div><p className="text-xs font-black text-slate-900 dark:text-white">{review.name}</p><p className="text-[8px] font-black text-slate-400 uppercase">{review.role}</p></div>
                                           </div>
                                           <div className="px-3 py-1 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 rounded-lg text-[9px] font-black uppercase tracking-widest">Sentiment: {review.score}%</div>
                                        </div>
                                     </div>
                                  </motion.div>
                                ))}
                             </div>
                          </div>
                       </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ONBOARDING MODAL */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 md:p-12 overflow-y-auto">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => setAddModalOpen(false)} 
              className="absolute inset-0 bg-white/20 dark:bg-slate-900/40 backdrop-blur-xl" 
            />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 30 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 30 }} className="relative w-full max-w-4xl bg-white dark:bg-slate-900 rounded-[4rem] shadow-2xl overflow-hidden border border-white/20">
              <div className="p-12 border-b border-slate-100 dark:border-white/5 flex items-center justify-between bg-gradient-to-r from-indigo-50/50 to-white dark:from-slate-800/50 dark:to-slate-900">
                 <div className="flex items-center gap-8">
                    <div className="w-20 h-20 bg-indigo-600 rounded-[2rem] flex items-center justify-center text-white shadow-2xl">
                        <UserPlus className="w-10 h-10" />
                    </div>
                    <div>
                        <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">Onboard Faculty</h3>
                        <p className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.3em] mt-2">Initialize New Talent Node</p>
                    </div>
                 </div>
                 <button onClick={() => setAddModalOpen(false)} className="p-5 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-slate-400 rounded-2xl group">
                    <X className="w-7 h-7 group-hover:rotate-90 transition-transform" />
                 </button>
              </div>

              <form onSubmit={(e) => {
                  e.preventDefault();
                  addTrainerUser({ name: onboardingForm.name, email: onboardingForm.email }, { bio: onboardingForm.bio, availability: onboardingForm.availability, skills: onboardingForm.skills, courses: [], availabilitySlots: [], activityLog: [] });
                  setAddModalOpen(false);
                }} className="p-12 space-y-12 max-h-[70vh] overflow-y-auto custom-scrollbar">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Identity Designation</label>
                    <input required type="text" value={onboardingForm.name} onChange={e => setOnboardingForm({...onboardingForm, name: e.target.value})} placeholder="e.g. Dr. Julian Pierce" className="w-full px-8 py-5 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-[2rem] focus:ring-8 focus:ring-indigo-500/5 focus:border-indigo-500 outline-none font-bold text-slate-800 dark:text-white text-lg" />
                  </div>
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Communication Channel</label>
                    <input required type="email" value={onboardingForm.email} onChange={e => setOnboardingForm({...onboardingForm, email: e.target.value})} placeholder="j.pierce@learnovate.tech" className="w-full px-8 py-5 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-[2rem] focus:ring-8 focus:ring-indigo-500/5 focus:border-indigo-500 outline-none font-bold text-slate-800 dark:text-white text-lg" />
                  </div>
                </div>
                <div className="pt-8 flex gap-6">
                  <button type="button" onClick={() => setAddModalOpen(false)} className="flex-1 py-6 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-black rounded-[2rem] uppercase tracking-widest text-[10px]">Abort Process</button>
                  <button type="submit" className="flex-1 py-6 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black rounded-[2rem] shadow-2xl hover:bg-indigo-600 dark:hover:bg-indigo-500 transition-all uppercase tracking-widest text-[10px]">Initialize Onboarding</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TrainerManagementPage;