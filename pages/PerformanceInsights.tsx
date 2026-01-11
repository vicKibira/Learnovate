import React, { useMemo, useState } from 'react';
import { 
  BarChart3, TrendingUp, Users, Star, 
  MessageSquare, ShieldCheck, Heart, Zap,
  CheckCircle2, AlertCircle, Clock, Calendar,
  ArrowUpRight, Target, Sparkles, Activity,
  X, Lightbulb, TrendingDown, BookOpen, Rocket
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area, PieChart, Pie, Cell, Radar, RadarChart, PolarGrid, PolarAngleAxis
} from 'recharts';
// Cast motion to any to bypass environment-specific type definition issues
import { motion as motionAny, AnimatePresence } from 'framer-motion';
const motion = motionAny as any;

interface ImprovementTip {
  title: string;
  description: string;
  icon: React.ReactNode;
  impact: 'High' | 'Medium';
}

const PerformanceInsights: React.FC<{ store: any }> = ({ store }) => {
  const { data, currentUser, theme } = store;
  const isDark = theme === 'dark';
  const [showImprovementModal, setShowImprovementModal] = useState(false);

  // Trainer Specific Intelligence
  const intel = useMemo(() => {
    const batches = data.trainingClasses.filter((t: any) => t.trainerId === currentUser.id);
    const totalLearners = data.learners.filter((l: any) => batches.some(b => b.id === l.trainingId));
    const completions = totalLearners.filter(l => l.completed).length;
    const successRate = totalLearners.length > 0 ? (completions / totalLearners.length) * 100 : 0;
    
    return { batches, totalLearners, completions, successRate };
  }, [data, currentUser.id]);

  const skillData = [
    { subject: 'Technical Accuracy', A: 95, fullMark: 100 },
    { subject: 'Engagement', A: 88, fullMark: 100 },
    { subject: 'Clarity', A: 92, fullMark: 100 },
    { subject: 'Speed', A: 85, fullMark: 100 },
    { subject: 'Preparation', A: 98, fullMark: 100 },
  ];

  const sentimentData = [
    { name: 'Mon', satisfaction: 85 },
    { name: 'Tue', satisfaction: 90 },
    { name: 'Wed', satisfaction: 88 },
    { name: 'Thu', satisfaction: 95 },
    { name: 'Fri', satisfaction: 92 },
  ];

  // Logic to generate dynamic improvement tips based on real-time metrics
  const dynamicTips = useMemo(() => {
    const tips: ImprovementTip[] = [];

    // Success Rate based tips
    if (intel.successRate < 90) {
      tips.push({
        title: 'Enhance Post-Session Support',
        description: `Your success rate is at ${intel.successRate.toFixed(1)}%. Consider providing additional office hours or summarized study notes to help students crossing the finish line.`,
        icon: <TrendingDown className="w-5 h-5 text-rose-500" />,
        impact: 'High'
      });
    } else {
      tips.push({
        title: 'Advanced Mentorship Program',
        description: 'With a high success rate, you are ready to lead peer-mentoring sessions for new faculty members.',
        icon: <Rocket className="w-5 h-5 text-emerald-500" />,
        impact: 'Medium'
      });
    }

    // Skill-gap based tips (finding the lowest score in skillData)
    const lowestSkill = [...skillData].sort((a, b) => a.A - b.A)[0];
    if (lowestSkill.A < 90) {
      tips.push({
        title: `Optimize ${lowestSkill.subject}`,
        description: `Your ${lowestSkill.subject.toLowerCase()} score is ${lowestSkill.A}%. Review recent session recordings to identify friction points and adjust your delivery pace.`,
        icon: <Target className="w-5 h-5 text-amber-500" />,
        impact: 'High'
      });
    }

    // General engagement tip
    tips.push({
      title: 'Interactive Knowledge Checks',
      description: 'Recent student feedback suggests shorter, more frequent quizzes during long sessions boost retention significantly.',
      icon: <Lightbulb className="w-5 h-5 text-indigo-500" />,
      impact: 'Medium'
    });

    return tips;
  }, [intel, skillData]);

  return (
    <div className="space-y-10 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-2 mb-3">
             <div className="w-10 h-1 bg-emerald-500 rounded-full" />
             <span className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.4em]">Teaching Quality</span>
          </motion.div>
          <h2 className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter">
            Success <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">Reports</span>
          </h2>
          <p className="text-slate-500 dark:text-slate-400 font-bold text-lg mt-3">Tracking how well classes are going and how students are progressing.</p>
        </div>
        <button 
          onClick={() => setShowImprovementModal(true)}
          className="px-8 py-5 bg-emerald-600 text-white rounded-[2rem] font-black uppercase tracking-widest text-[10px] shadow-2xl flex items-center gap-3 transition-all hover:bg-emerald-700"
        >
          <Lightbulb className="w-5 h-5" /> View Growth Tips
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {[
          { label: 'Completion Rate', value: `${intel.successRate.toFixed(1)}%`, icon: <CheckCircle2 className="w-6 h-6 text-emerald-600" />, color: 'bg-emerald-50' },
          { label: 'Total Students', value: intel.totalLearners.length, icon: <Users className="w-6 h-6 text-indigo-600" />, color: 'bg-indigo-50' },
          { label: 'Teaching Score', value: '4.8', icon: <Star className="w-6 h-6 text-amber-600" />, color: 'bg-amber-50' },
          { label: 'Active Batches', value: intel.batches.length, icon: <Zap className="w-6 h-6 text-rose-600" />, color: 'bg-rose-50' },
        ].map((stat, i) => (
          <motion.div key={i} className="glass p-10 rounded-[3rem] shadow-xl border border-white/60 dark:border-white/5">
            <div className="flex items-start justify-between mb-8">
               <div className={`p-4 rounded-2xl ${stat.color} shadow-inner`}>{stat.icon}</div>
               <span className="text-[10px] font-black text-emerald-500 bg-emerald-50 px-3 py-1.5 rounded-full">+4.2%</span>
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{stat.label}</p>
            <h3 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">{stat.value}</h3>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Skill Radar */}
        <div className="glass p-12 rounded-[4rem] shadow-xl border border-white/60 dark:border-white/5">
          <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight mb-12">Faculty Skill Matrix</h3>
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={skillData}>
                <PolarGrid stroke={isDark ? '#334155' : '#e2e8f0'} />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 900 }} />
                <Radar name="Skills" dataKey="A" stroke="#10b981" fill="#10b981" fillOpacity={0.6} />
                <Tooltip contentStyle={{ borderRadius: '24px' }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Student Satisfaction */}
        <div className="glass p-12 rounded-[4rem] shadow-xl border border-white/60 dark:border-white/5">
          <div className="flex items-center justify-between mb-12">
            <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Satisfaction Trend</h3>
            <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl text-[10px] font-black uppercase tracking-widest">
               Real-time
            </div>
          </div>
          <div className="h-[320px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={sentimentData}>
                <defs>
                  <linearGradient id="colorSatisfaction" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="10 10" vertical={false} stroke={isDark ? '#334155' : '#e2e8f0'} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 900}} />
                <Tooltip contentStyle={{ borderRadius: '24px' }} />
                <Area type="monotone" dataKey="satisfaction" stroke="#10b981" strokeWidth={6} fillOpacity={1} fill="url(#colorSatisfaction)" dot={{ r: 8, fill: '#10b981' }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Improvement Modal */}
      <AnimatePresence>
        {showImprovementModal && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 md:p-12">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowImprovementModal(false)} className="absolute inset-0 bg-slate-950/90 backdrop-blur-2xl" />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 50 }}
              className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-[3.5rem] shadow-2xl overflow-hidden border border-white/20"
            >
              <div className="p-10 border-b border-slate-100 dark:border-white/5 flex items-center justify-between bg-gradient-to-r from-emerald-50/50 to-white dark:from-slate-800/50 dark:to-slate-900">
                <div className="flex items-center gap-6">
                   <div className="w-16 h-16 bg-emerald-600 rounded-2xl flex items-center justify-center text-white shadow-xl">
                      <Sparkles className="w-8 h-8" />
                   </div>
                   <div>
                     <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">Strategic Growth</h3>
                     <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mt-2">Personalized insights for performance optimization</p>
                   </div>
                </div>
                <button onClick={() => setShowImprovementModal(false)} className="p-4 bg-white dark:bg-slate-800 border border-slate-100 dark:border-white/5 text-slate-400 rounded-2xl group">
                   <X className="w-7 h-7 group-hover:rotate-90 transition-transform" />
                </button>
              </div>

              <div className="p-10 space-y-6">
                {dynamicTips.map((tip, i) => (
                  <div key={i} className="p-6 bg-slate-50 dark:bg-slate-800 rounded-[2rem] border border-slate-100 dark:border-slate-700 flex gap-6">
                     <div className="w-12 h-12 bg-white dark:bg-slate-700 rounded-2xl flex items-center justify-center shadow-sm flex-shrink-0">
                        {tip.icon}
                     </div>
                     <div>
                        <div className="flex items-center gap-3 mb-1">
                           <h4 className="text-lg font-black text-slate-900 dark:text-white leading-tight">{tip.title}</h4>
                           <span className={`px-3 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest ${tip.impact === 'High' ? 'bg-rose-50 text-rose-600' : 'bg-amber-50 text-amber-600'}`}>
                              {tip.impact} Impact
                           </span>
                        </div>
                        <p className="text-sm font-medium text-slate-500 dark:text-slate-400 leading-relaxed">{tip.description}</p>
                     </div>
                  </div>
                ))}
              </div>
              
              <div className="p-10 bg-slate-900 border-t border-white/10 text-center">
                 <button onClick={() => setShowImprovementModal(false)} className="px-10 py-4 bg-white text-slate-900 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-emerald-400 transition-all">Understood</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PerformanceInsights;