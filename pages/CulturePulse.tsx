
import React, { useState } from 'react';
import { 
  Heart, Zap, TrendingUp, Users, Activity, Sparkles, 
  MessageSquare, Star, Smile, Frown, ShieldCheck, PieChart as PieIcon,
  Loader2, CheckCircle2, Send
} from 'lucide-react';
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, 
  CartesianGrid, Tooltip, PieChart, Pie, Cell, BarChart, Bar
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';

const engagementData = [
  { month: 'Jan', score: 72 },
  { month: 'Feb', score: 75 },
  { month: 'Mar', score: 84 },
  { month: 'Apr', score: 81 },
  { month: 'May', score: 89 },
  { month: 'Jun', score: 92 },
];

const sentimentDistribution = [
  { name: 'Happy', value: 65, color: '#10b981' },
  { name: 'Okay', value: 25, color: '#6366f1' },
  { name: 'Unhappy', value: 10, color: '#f43f5e' },
];

const CulturePulse: React.FC<{ store: any }> = ({ store }) => {
  const isDark = store.theme === 'dark';
  const [launchStatus, setLaunchStatus] = useState<'idle' | 'sending' | 'success'>('idle');

  const handleLaunchSurvey = async () => {
    setLaunchStatus('sending');
    // Simulate survey distribution logic
    await new Promise(resolve => setTimeout(resolve, 2000));
    setLaunchStatus('success');
    setTimeout(() => setLaunchStatus('idle'), 3000);
  };

  return (
    <div className="space-y-10 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-2 mb-3">
             <div className="w-10 h-1 bg-rose-500 rounded-full" />
             <span className="text-[10px] font-black text-rose-500 uppercase tracking-[0.4em]">Team Mood</span>
          </motion.div>
          <h2 className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter">
            Culture <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-600 to-orange-500">Pulse</span>
          </h2>
          <p className="text-slate-500 dark:text-slate-400 font-bold text-lg mt-3">Tracking how happy and connected everyone feels at work.</p>
        </div>
        
        <motion.button 
          whileHover={launchStatus === 'idle' ? { scale: 1.05 } : {}}
          whileTap={launchStatus === 'idle' ? { scale: 0.95 } : {}}
          onClick={handleLaunchSurvey}
          disabled={launchStatus !== 'idle'}
          className={`px-8 py-5 rounded-[2rem] font-black uppercase tracking-widest text-[10px] shadow-2xl flex items-center gap-3 transition-all ${
            launchStatus === 'sending' ? 'bg-slate-400 cursor-not-allowed' :
            launchStatus === 'success' ? 'bg-emerald-500 text-white' :
            'bg-rose-600 text-white hover:bg-rose-700'
          }`}
        >
          {launchStatus === 'sending' ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" /> Sending Survey...
            </>
          ) : launchStatus === 'success' ? (
            <>
              <CheckCircle2 className="w-5 h-5" /> Survey Sent!
            </>
          ) : (
            <>
              <Send className="w-5 h-5" /> Send Happiness Survey
            </>
          )}
        </motion.button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {[
          { label: 'Employee Score', value: '78', icon: <Heart className="w-6 h-6 text-rose-600" />, trend: '+12.4%', color: 'bg-rose-50' },
          { label: 'People Voting', value: '94%', icon: <Users className="w-6 h-6 text-indigo-600" />, trend: 'Steady', color: 'bg-indigo-50' },
          { label: 'Stress Level', value: 'Low', icon: <Zap className="w-6 h-6 text-amber-600" />, trend: '-5.1%', color: 'bg-amber-50' },
          { label: 'Praise Given', value: '1,240', icon: <Star className="w-6 h-6 text-emerald-600" />, trend: '+42.1%', color: 'bg-emerald-50' },
        ].map((stat, i) => (
          <motion.div key={i} className="glass p-10 rounded-[3rem] shadow-xl border border-white/60 dark:border-white/5">
            <div className="flex items-start justify-between mb-8">
               <div className={`p-4 rounded-2xl ${stat.color} shadow-inner`}>{stat.icon}</div>
               <span className="text-[10px] font-black text-emerald-500 bg-emerald-50 px-3 py-1.5 rounded-full">{stat.trend}</span>
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{stat.label}</p>
            <h3 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">{stat.value}</h3>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 glass p-12 rounded-[4rem] shadow-xl border border-white/60 dark:border-white/5">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Happiness Over Time</h3>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">Checking in on the team over the last 6 months</p>
            </div>
            <div className="flex items-center gap-2 px-5 py-2.5 bg-rose-500/10 text-rose-600 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-rose-500/20">
               <Sparkles className="w-4 h-4 animate-pulse" /> Live Stats
            </div>
          </div>
          <div className="h-[320px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={engagementData}>
                <defs>
                  <linearGradient id="colorEngagement" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="10 10" vertical={false} stroke={isDark ? '#334155' : '#e2e8f0'} />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 900}} />
                <Tooltip contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 40px 80px -20px rgba(0,0,0,0.3)', backgroundColor: isDark ? '#0f172a' : '#fff', color: isDark ? '#fff' : '#000' }} />
                <Area type="monotone" dataKey="score" stroke="#f43f5e" strokeWidth={6} fillOpacity={1} fill="url(#colorEngagement)" dot={{ r: 8, fill: '#f43f5e' }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass p-12 rounded-[4rem] shadow-xl border border-white/60 dark:border-white/5 flex flex-col">
          <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight mb-12">Team Mood Breakdown</h3>
          <div className="h-[280px] w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={sentimentDistribution} cx="50%" cy="50%" innerRadius={80} outerRadius={100} paddingAngle={10} dataKey="value">
                  {sentimentDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <p className="text-[10px] font-black text-slate-400 uppercase">Overall Feeling</p>
              <p className="text-2xl font-black text-emerald-500">Happy</p>
            </div>
          </div>
          <div className="mt-10 space-y-4">
            {sentimentDistribution.map((item, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-widest">{item.name}</span>
                </div>
                <span className="text-sm font-black text-slate-900 dark:text-white">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CulturePulse;
