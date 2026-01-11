
import React, { useMemo, useState } from 'react';
import {
    MessageSquare, Star, TrendingUp, Users,
    Search, Filter, CheckCircle2, AlertCircle,
    ThumbsUp, ThumbsDown, Sparkles, Activity,
    Calendar, Clock, ArrowUpRight, ChevronRight,
    User, Quote, Zap, Lightbulb
} from 'lucide-react';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    BarChart, Bar, PieChart, Pie, Cell
} from 'recharts';
// Cast motion to any to bypass environment-specific type definition issues
import { motion as motionAny, AnimatePresence } from 'framer-motion';
const motion = motionAny as any;

const FeedbackHub: React.FC<{ store: any }> = ({ store }) => {
    const { theme, currentUser } = store;
    const isDark = theme === 'dark';
    const [selectedSentiment, setSelectedSentiment] = useState<'All' | 'Positive' | 'Neutral' | 'Critical'>('All');

    const sentimentData = [
        { name: 'Week 1', score: 82 },
        { name: 'Week 2', score: 85 },
        { name: 'Week 3', score: 81 },
        { name: 'Week 4', score: 89 },
        { name: 'Week 5', score: 92 },
        { name: 'Week 6', score: 88 },
    ];

    const categoryData = [
        { name: 'Clarity', value: 45 },
        { name: 'Pacing', value: 25 },
        { name: 'Examples', value: 20 },
        { name: 'Soft Skills', value: 10 },
    ];

    const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444'];

    const feedbackList = [
        {
            id: '1',
            student: 'Alice Chen',
            course: 'Python Advanced',
            date: '2024-03-20',
            rating: 5,
            sentiment: 'Positive',
            comment: "The session on decorators was eye-opening. The trainer used real-world bank transaction examples which made it very clear.",
            tags: ['Clarity', 'Examples']
        },
        {
            id: '2',
            student: 'Bob Smith',
            course: 'AWS Essentials',
            date: '2024-03-19',
            rating: 4,
            sentiment: 'Positive',
            comment: "Great session, but the pacing was a bit fast during the Lambda section. Would appreciate more hands-on time.",
            tags: ['Pacing', 'Lab Time']
        },
        {
            id: '3',
            student: 'Charlie Davis',
            course: 'Python Advanced',
            date: '2024-03-18',
            rating: 3,
            sentiment: 'Neutral',
            comment: "The material is good, but I struggled with the setup phase. It took too long to get the environment ready.",
            tags: ['Tech Setup', 'Efficiency']
        },
        {
            id: '4',
            student: 'Diana Prince',
            course: 'Python Advanced',
            date: '2024-03-17',
            rating: 2,
            sentiment: 'Critical',
            comment: "Cloud IDE was laggy today. It made it hard to follow the live coding session.",
            tags: ['Infrastructure', 'Clarity']
        }
    ];

    const filteredFeedback = feedbackList.filter(f =>
        selectedSentiment === 'All' || f.sentiment === selectedSentiment
    );

    return (
        <div className="space-y-10 pb-20">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-2 mb-3">
                        <div className="w-10 h-1 bg-indigo-500 rounded-full" />
                        <span className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.4em]">Sentiment Intelligence</span>
                    </motion.div>
                    <h2 className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter">
                        Feedback <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-500">Hub</span>
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 font-bold text-lg mt-3">Synthesizing student voices into actionable teaching insights.</p>
                </div>
                <div className="flex gap-4">
                    <button className="px-8 py-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.2rem] font-black uppercase tracking-widest text-[10px] shadow-xl flex items-center gap-3 transition-all hover:border-indigo-500 dark:text-white">
                        <Calendar className="w-5 h-5 text-indigo-500" />
                        Last 30 Days
                    </button>
                    <button className="px-8 py-5 bg-indigo-600 text-white rounded-[2.2rem] font-black uppercase tracking-widest text-[10px] shadow-2xl flex items-center gap-3 transition-all hover:bg-indigo-700">
                        <Sparkles className="w-5 h-5" />
                        Generate PDF Report
                    </button>
                </div>
            </div>

            {/* Analytics Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Sentiment Trend */}
                <div className="lg:col-span-2 glass p-10 rounded-[3.5rem] shadow-xl border border-white/60 dark:border-white/5 relative overflow-hidden">
                    <div className="flex items-center justify-between mb-10">
                        <div>
                            <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Satisfaction Index</h3>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Weighted weekly average score</p>
                        </div>
                        <div className="flex items-center gap-3 px-5 py-2.5 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 rounded-2xl text-[10px] font-black uppercase tracking-widest">
                            <TrendingUp className="w-4 h-4" />
                            +5.4% vs Prev Month
                        </div>
                    </div>
                    <div className="h-[350px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={sentimentData}>
                                <defs>
                                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="10 10" vertical={false} stroke={isDark ? '#334155' : '#e2e8f0'} />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 900 }} />
                                <Tooltip
                                    contentStyle={{
                                        borderRadius: '24px',
                                        backgroundColor: isDark ? '#0f172a' : '#fff',
                                        border: 'none',
                                        boxShadow: '0 20px 40px -10px rgba(0,0,0,0.1)'
                                    }}
                                />
                                <Area type="monotone" dataKey="score" stroke="#6366f1" strokeWidth={6} fillOpacity={1} fill="url(#colorScore)" dot={{ r: 8, fill: '#6366f1', strokeWidth: 4, stroke: isDark ? '#1e293b' : '#fff' }} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Feedback Topics */}
                <div className="glass p-10 rounded-[3.5rem] shadow-xl border border-white/60 dark:border-white/5">
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight mb-8">Focus Topics</h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={categoryData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={100}
                                    paddingAngle={8}
                                    dataKey="value"
                                >
                                    {categoryData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="space-y-4 mt-6">
                        {categoryData.map((c, i) => (
                            <div key={i} className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                                    <span className="text-sm font-bold text-slate-500 dark:text-slate-400">{c.name}</span>
                                </div>
                                <span className="text-sm font-black text-slate-900 dark:text-white">{c.value}%</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Main Feedback List Section */}
            <div className="glass p-10 rounded-[4rem] shadow-2xl border border-white/60 dark:border-white/5">
                <div className="flex flex-col lg:flex-row gap-8 items-center justify-between mb-12">
                    <div className="flex items-center gap-4 bg-slate-100 dark:bg-slate-800 p-2 rounded-3xl w-full lg:w-auto">
                        {['All', 'Positive', 'Neutral', 'Critical'].map((s: any) => (
                            <button
                                key={s}
                                onClick={() => setSelectedSentiment(s)}
                                className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${selectedSentiment === s
                                    ? 'bg-white dark:bg-slate-700 shadow-md text-indigo-600'
                                    : 'text-slate-400 hover:text-slate-600'
                                    }`}
                            >
                                {s}
                            </button>
                        ))}
                    </div>
                    <div className="relative flex-1 group w-full">
                        <Search className="w-6 h-6 absolute left-8 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-all" />
                        <input
                            type="text"
                            placeholder="Search specific student comments or course modules..."
                            className="w-full pl-20 pr-8 py-6 bg-slate-50/50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 rounded-[2.5rem] focus:ring-8 focus:ring-indigo-500/5 outline-none font-bold transition-all dark:text-white lg:text-lg"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <AnimatePresence mode="popLayout">
                        {filteredFeedback.map((f, i) => (
                            <motion.div
                                key={f.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ delay: i * 0.1 }}
                                className="p-8 bg-white dark:bg-slate-800/50 rounded-[3rem] border border-slate-100 dark:border-white/5 hover:border-indigo-200 dark:hover:border-indigo-500/30 transition-all group shadow-sm shadow-slate-200/50"
                            >
                                <div className="flex items-start justify-between mb-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center text-indigo-600 text-xl font-black">
                                            {f.student.charAt(0)}
                                        </div>
                                        <div>
                                            <h4 className="text-lg font-black text-slate-900 dark:text-white leading-tight">{f.student}</h4>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">{f.course}</p>
                                        </div>
                                    </div>
                                    <div className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest ${f.sentiment === 'Positive' ? 'bg-emerald-50 text-emerald-600' :
                                        f.sentiment === 'Critical' ? 'bg-rose-50 text-rose-600' : 'bg-amber-50 text-amber-600'
                                        }`}>
                                        {f.sentiment}
                                    </div>
                                </div>

                                <div className="relative p-6 bg-slate-50 dark:bg-slate-900/40 rounded-[2rem] border border-transparent group-hover:bg-white dark:group-hover:bg-slate-800 transition-all">
                                    <Quote className="w-8 h-8 text-indigo-500/10 absolute top-4 left-4" />
                                    <p className="text-slate-600 dark:text-slate-300 font-medium italic leading-relaxed relative z-10">"{f.comment}"</p>
                                </div>

                                <div className="mt-8 flex flex-wrap gap-2">
                                    {f.tags.map(t => (
                                        <span key={t} className="px-4 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-full text-[9px] font-black uppercase tracking-widest">{t}</span>
                                    ))}
                                </div>

                                <div className="mt-8 pt-8 border-t border-slate-50 dark:border-white/5 flex items-center justify-between">
                                    <div className="flex items-center gap-1">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} className={`w-4 h-4 ${i < f.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-200'}`} />
                                        ))}
                                    </div>
                                    <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{f.date}</span>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </div>

            {/* Strategic Recommendation */}
            <motion.div
                whileHover={{ y: -5 }}
                className="bg-slate-900 dark:bg-indigo-600 p-12 rounded-[4rem] text-white flex flex-col lg:flex-row items-center gap-12 relative overflow-hidden shadow-2xl"
            >
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl animate-pulse" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/20 rounded-full -ml-32 -mb-32 blur-3xl" />

                <div className="w-24 h-24 bg-white/10 backdrop-blur-xl rounded-[2.5rem] flex items-center justify-center flex-shrink-0 animate-bounce-slow">
                    <Lightbulb className="w-12 h-12 text-amber-300" />
                </div>

                <div className="flex-1 text-center lg:text-left">
                    <h3 className="text-3xl font-black tracking-tighter mb-4">Quality Assurance Recommendation</h3>
                    <p className="text-indigo-100 text-lg font-medium leading-relaxed max-w-2xl">
                        Students consistently mention "Pacing" in Advanced Python. Consider allocating an extra 15 minutes for the 'Decorators' live workshop tomorrow to address environmental friction.
                    </p>
                </div>

                <button className="px-10 py-5 bg-white text-slate-900 rounded-[2rem] font-black uppercase tracking-[0.2em] text-[10px] shadow-xl hover:bg-emerald-400 hover:text-white transition-all">
                    Apply To Session
                </button>
            </motion.div>
        </div>
    );
};

export default FeedbackHub;
