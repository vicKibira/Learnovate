
import React, { useState } from 'react';
import { 
  Rocket, Target, Award, Layers, TrendingUp, 
  Briefcase, Zap, Sparkles, UserCheck, BarChart3,
  Stairs, BookOpen, Search, X, CheckCircle2, Loader2,
  User, ArrowRight
} from 'lucide-react';
import { 
  ResponsiveContainer, Radar, RadarChart, PolarGrid, 
  PolarAngleAxis, PolarRadiusAxis, Radar as RadarArea, Tooltip 
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';

const skillGapData = [
  { subject: 'AI Tools', current: 45, target: 90 },
  { subject: 'Leadership', current: 70, target: 85 },
  { subject: 'Planning', current: 85, target: 95 },
  { subject: 'Coding', current: 60, target: 95 },
  { subject: 'Teamwork', current: 90, target: 95 },
];

const GrowthStrategy: React.FC<{ store: any }> = ({ store }) => {
  const isDark = store.theme === 'dark';
  const [showDesignModal, setShowDesignModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleCreatePath = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    // Simulate saving a growth plan
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSaving(false);
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      setShowDesignModal(false);
    }, 2000);
  };

  return (
    <div className="space-y-10 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-2 mb-3">
             <div className="w-10 h-1 bg-indigo-500 rounded-full" />
             <span className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.4em]">Training & Success</span>
          </motion.div>
          <h2 className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter">
            Growth <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-emerald-500">Strategy</span>
          </h2>
          <p className="text-slate-500 dark:text-slate-400 font-bold text-lg mt-3">Helping our team learn new skills and find new opportunities within the company.</p>
        </div>
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowDesignModal(true)}
          className="px-8 py-5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-[2rem] font-black uppercase tracking-widest text-[10px] shadow-2xl flex items-center gap-3 transition-all hover:bg-indigo-600 hover:text-white"
        >
          <BookOpen className="w-5 h-5" /> Create Growth Plan
        </motion.button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Radar Chart Card */}
        <div className="glass p-12 rounded-[4rem] shadow-xl border border-white/60 dark:border-white/5">
          <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight mb-12">Team Skills Radar</h3>
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={skillGapData}>
                <PolarGrid stroke={isDark ? '#334155' : '#e2e8f0'} />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 900 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                <RadarArea name="Where we are" dataKey="current" stroke="#6366f1" fill="#6366f1" fillOpacity={0.6} />
                <RadarArea name="Where we want to be" dataKey="target" stroke="#10b981" fill="#10b981" fillOpacity={0.2} strokeDasharray="5 5" />
                <Tooltip contentStyle={{ borderRadius: '24px' }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-8 mt-6">
             <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-indigo-500" />
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Where we are now</span>
             </div>
             <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-emerald-500 opacity-40 border border-dashed border-emerald-600" />
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Our goal</span>
             </div>
          </div>
        </div>

        {/* Career Tracks and Quick Stats */}
        <div className="space-y-8">
           <div className="glass p-10 rounded-[3.5rem] shadow-xl border border-white/60 dark:border-white/5">
              <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight mb-8">Career Journeys</h3>
              <div className="space-y-6">
                 {[
                   { name: 'Teacher to Manager', progress: 65, participants: 4 },
                   { name: 'Sales to Strategy', progress: 42, participants: 3 },
                   { name: 'Support to Quality Control', progress: 88, participants: 7 },
                 ].map((track, i) => (
                   <div key={i} className="space-y-3">
                      <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
                         <span className="text-slate-500">{track.name}</span>
                         <span className="text-indigo-600">{track.participants} people</span>
                      </div>
                      <div className="h-3 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                         <motion.div initial={{ width: 0 }} animate={{ width: `${track.progress}%` }} className="h-full bg-gradient-to-r from-indigo-500 to-indigo-600" />
                      </div>
                   </div>
                 ))}
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="glass p-8 rounded-[3rem] border border-emerald-100 dark:border-emerald-500/20 bg-emerald-50/10">
                 <Award className="w-10 h-10 text-emerald-500 mb-6" />
                 <h4 className="text-lg font-black text-slate-900 dark:text-white leading-none mb-2">New Skills Learned</h4>
                 <p className="text-3xl font-black text-emerald-600">124</p>
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-4">Total for this year</p>
              </div>
              <div className="glass p-8 rounded-[3rem] border border-amber-100 dark:border-amber-500/20 bg-amber-50/10">
                 <Zap className="w-10 h-10 text-amber-500 mb-6" />
                 <h4 className="text-lg font-black text-slate-900 dark:text-white leading-none mb-2">Promotions</h4>
                 <p className="text-3xl font-black text-amber-600">18</p>
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-4">Happy team members</p>
              </div>
           </div>
        </div>
      </div>

      {/* Dynamic Growth Plan Modal */}
      <AnimatePresence>
        {showDesignModal && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 md:p-12">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => setShowDesignModal(false)} 
              className="absolute inset-0 bg-slate-950/90 backdrop-blur-2xl" 
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 50, filter: 'blur(10px)' }}
              animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, scale: 0.9, y: 50 }}
              className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-[3.5rem] shadow-2xl overflow-hidden border border-white/20"
            >
              <div className="p-10 border-b border-slate-100 dark:border-white/5 flex items-center justify-between bg-gradient-to-r from-indigo-50/50 to-white dark:from-slate-800/50 dark:to-slate-900">
                <div className="flex items-center gap-6">
                   <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl">
                      <Rocket className="w-8 h-8" />
                   </div>
                   <div>
                     <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">Create Growth Plan</h3>
                     <p className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.3em] mt-2">Help someone reach their next goal</p>
                   </div>
                </div>
                <button onClick={() => setShowDesignModal(false)} className="p-4 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-slate-400 rounded-2xl group">
                   <X className="w-7 h-7 group-hover:rotate-90 transition-transform" />
                </button>
              </div>

              <form onSubmit={handleCreatePath} className="p-10 space-y-8">
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                     <User className="w-3 h-3" /> Team Member
                   </label>
                   <input required className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:ring-8 focus:ring-indigo-500/5 font-bold dark:text-white" placeholder="Who is this plan for?" />
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                     <Target className="w-3 h-3" /> New Target Role
                   </label>
                   <input required className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:ring-8 focus:ring-indigo-500/5 font-bold dark:text-white" placeholder="What role are they aiming for?" />
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                     <Zap className="w-3 h-3" /> Primary Skill to Learn
                   </label>
                   <select className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none font-black text-[10px] uppercase tracking-widest dark:text-white">
                      <option>Leadership & Management</option>
                      <option>Technical Architecture</option>
                      <option>Advanced Sales Strategy</option>
                      <option>Project Planning</option>
                   </select>
                </div>
                
                <button 
                  type="submit" 
                  disabled={isSaving || success}
                  className={`w-full py-5 rounded-2xl font-black uppercase tracking-widest text-[11px] shadow-2xl flex items-center justify-center gap-3 transition-all ${
                    success ? 'bg-emerald-500 text-white' : 'bg-indigo-600 text-white hover:bg-indigo-700'
                  }`}
                >
                   {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : success ? <CheckCircle2 className="w-5 h-5" /> : <ArrowRight className="w-5 h-5" />}
                   {isSaving ? 'Building Plan...' : success ? 'Plan Saved!' : 'Launch Growth Plan'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GrowthStrategy;
