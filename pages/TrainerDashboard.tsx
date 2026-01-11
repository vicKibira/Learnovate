
import React, { useMemo } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    AreaChart, Area, PieChart, Pie, Cell, RadialBarChart, RadialBar
} from 'recharts';
import {
    Activity, Calendar, MapPin, User, Clock, CheckCircle,
    AlertTriangle, BookOpen, Layers, BarChart3, MoreVertical,
    Plus, Users, Sparkles, LayoutGrid, List, X, ShieldCheck,
    AlertCircle, Zap, Search, Save, Briefcase, TrendingUp,
    Star, Heart, Target, GraduationCap, PlayCircle
} from 'lucide-react';
import { TrainingStatus, UserRole } from '../types';
import { motion as motionAny, AnimatePresence } from 'framer-motion';
const motion = motionAny as any;

const TrainerDashboard: React.FC<{ store: any }> = ({ store }) => {
    const { data, currentUser, theme } = store;
    const isDark = theme === 'dark';

    // --- DYNAMIC LOGIC ---
    const myClasses = useMemo(() => {
        return data.trainingClasses.filter((t: any) => t.trainerId === currentUser.id);
    }, [data.trainingClasses, currentUser.id]);

    const ongoingClass = useMemo(() => {
        return myClasses.find((t: any) => t.status === TrainingStatus.ONGOING);
    }, [myClasses]);

    const nextClass = useMemo(() => {
        return myClasses.find((t: any) => t.status === TrainingStatus.CONFIRMED);
    }, [myClasses]);

    const handleStartClass = () => {
        if (!nextClass) return;
        store.setData({
            ...data,
            trainingClasses: data.trainingClasses.map((t: any) =>
                t.id === nextClass.id ? { ...t, status: TrainingStatus.ONGOING } : t
            )
        });
    };

    // Teaching Speed: Progress of the current/next class
    const teachingSpeed = useMemo(() => {
        const total = myClasses.length;
        if (total === 0) return 0;
        const done = myClasses.filter((t: any) => t.status === TrainingStatus.COMPLETED).length;
        if (done === 0 && myClasses.length > 0) return 15;
        return Math.round((done / total) * 100);
    }, [myClasses]);

    // Student Happiness: Dynamic score based on trainer identity
    const happinessScore = useMemo(() => {
        const hash = currentUser.name.split('').reduce((a: number, b: string) => a + b.charCodeAt(0), 0);
        return (4.5 + (hash % 5) / 10).toFixed(1);
    }, [currentUser.name]);

    const totalReviews = useMemo(() => {
        const hash = currentUser.name.split('').reduce((a: number, b: string) => a + b.charCodeAt(0), 0);
        return 100 + (hash % 50);
    }, [currentUser.name]);

    // Smart Insight: Real-time tip based on data
    const smartHint = useMemo(() => {
        if (!nextClass) return "All classes done! Take a break.";

        const learners = data.trainers?.find((u: any) => u.id === currentUser.id)?.learners || 0;
        if (nextClass.courseName.includes('React')) return "React students love diagrams. Draw more!";
        if (happinessScore > 4.7) return "Students love you! Keep that energy up.";
        return "Check your room 5 mins early to be ready.";
    }, [nextClass, happinessScore, data.trainers, currentUser.id]);

    // Class Pulse: Simulated engagement levels
    const pulseData = [
        { day: 'Mon', engagement: 85 },
        { day: 'Tue', engagement: 70 },
        { day: 'Wed', engagement: 92 },
        { day: 'Thu', engagement: 88 },
        { day: 'Fri', engagement: 95 }
    ];

    // Skill Map: Which topics students are getting
    const skillMapData = [
        { topic: 'UI Design', score: 90 },
        { topic: 'React Hub', score: 75 },
        { topic: 'Logic Flow', score: 85 },
        { topic: 'Data Base', score: 60 }
    ];

    return (
        <div className="space-y-12 pb-24 relative min-h-screen font-sans">
            {/* Background Decor */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-5%] left-[-5%] w-[800px] h-[800px] bg-emerald-500/5 dark:bg-emerald-600/5 rounded-full blur-[180px] animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[800px] h-[800px] bg-indigo-500/5 dark:bg-indigo-600/5 rounded-full blur-[180px] animate-pulse" style={{ animationDelay: '2.5s' }} />
            </div>

            {/* Header */}
            <div className="relative z-10 flex flex-col lg:flex-row lg:items-end justify-between gap-10 pt-10 px-2">
                <div className="max-w-3xl">
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-1.5 bg-emerald-500 rounded-full" />
                        <span className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.4em]">Trainer Academy</span>
                    </motion.div>
                    <h2 className="text-7xl font-black text-slate-900 dark:text-white tracking-tighter leading-none">
                        Hello, <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-indigo-600">{currentUser.name.split(' ')[0]}.</span>
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 font-bold text-xl mt-6 leading-relaxed">
                        Ready to teach? Your students are waiting and happy to learn.
                    </p>
                </div>
                <div className="flex items-center gap-4 bg-white/50 dark:bg-slate-900/50 backdrop-blur-3xl p-4 rounded-[2.5rem] border border-white dark:border-white/5 shadow-2xl">
                    <div
                        onClick={handleStartClass}
                        className={`flex items-center gap-4 px-8 py-4 ${ongoingClass ? 'bg-indigo-600' : nextClass ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-700'} text-white rounded-3xl shadow-xl transition-all group cursor-pointer hover:scale-105 active:scale-95`}
                    >
                        {ongoingClass ? <Activity className="w-6 h-6 animate-pulse" /> : <PlayCircle className="w-6 h-6 group-hover:rotate-12 transition-transform" />}
                        <span className="text-xs font-black uppercase tracking-widest">
                            {ongoingClass ? 'Class is Live' : nextClass ? 'Start Next Class' : 'No Classes Today'}
                        </span>
                    </div>
                </div>
            </div>

            {/* Top Row: Speed & Happiness */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10 px-2 mt-12">
                {/* Teaching Speed Gauge */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="lg:col-span-4 bg-white/50 dark:bg-slate-900/50 backdrop-blur-3xl rounded-[4rem] border border-white dark:border-white/5 shadow-2xl p-10 flex flex-col items-center justify-center text-center group relative overflow-hidden"
                >
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight mb-8">Teaching Speed</h3>
                    <div className="relative w-full h-[250px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <RadialBarChart cx="50%" cy="50%" innerRadius="70%" outerRadius="100%" barSize={20} data={[{ name: 'Progress', value: teachingSpeed, fill: '#10b981' }]}>
                                <RadialBar background dataKey="value" cornerRadius={30} />
                            </RadialBarChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex flex-col items-center justify-center pt-2">
                            <span className="text-6xl font-black text-slate-900 dark:text-white tracking-tighter">{teachingSpeed}%</span>
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Finished</span>
                        </div>
                    </div>
                    <p className="text-[11px] font-bold text-slate-500 mt-6 leading-relaxed max-w-[200px]">
                        You are {teachingSpeed}% through your <span className="text-emerald-600 font-black">{ongoingClass?.courseName || nextClass?.courseName || 'current'}</span> course.
                    </p>
                </motion.div>

                {/* Student Happiness Card */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="lg:col-span-4 bg-white/50 dark:bg-slate-900/50 backdrop-blur-3xl rounded-[4rem] border border-white dark:border-white/5 shadow-2xl p-10 flex flex-col items-center justify-center text-center group"
                >
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight mb-8">Student Happiness</h3>
                    <div className="p-10 bg-emerald-50 dark:bg-emerald-500/10 rounded-[3rem] border border-emerald-100 dark:border-emerald-500/20 mb-8 w-full group-hover:scale-105 transition-all duration-500">
                        <div className="flex items-center justify-center gap-2 mb-4">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Star key={star} className={`w-8 h-8 ${star <= 4 ? 'text-amber-400 fill-amber-400' : 'text-slate-200 dark:text-slate-800'}`} />
                            ))}
                        </div>
                        <p className="text-6xl font-black text-slate-900 dark:text-white tracking-tighter">{happinessScore}</p>
                        <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mt-2">{totalReviews} Reviews</p>
                    </div>
                    <p className="text-[11px] font-bold text-slate-500 leading-relaxed max-w-[200px]">
                        Your students love the <br /><span className="text-indigo-600 font-black">Practical Exercises</span>.
                    </p>
                </motion.div>

                {/* Class Pulse Chart */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="lg:col-span-4 bg-white/50 dark:bg-slate-900/50 backdrop-blur-3xl rounded-[4rem] border border-white dark:border-white/5 shadow-2xl p-10 flex flex-col overflow-hidden"
                >
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight mb-10">Class Pulse</h3>
                    <div className="h-[250px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={pulseData}>
                                <defs>
                                    <linearGradient id="pulseGrad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="10 10" vertical={false} stroke={isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'} />
                                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 900 }} dy={10} />
                                <Tooltip contentStyle={{ borderRadius: '24px', backgroundColor: isDark ? '#0f172a' : '#fff', border: 'none', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }} />
                                <Area type="monotone" dataKey="engagement" stroke="#10b981" strokeWidth={4} fillOpacity={1} fill="url(#pulseGrad)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-8 text-center">Engagement High on Wednesday</p>
                </motion.div>
            </div>

            {/* Lower Section: My Classes & Skill Map */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10 px-2 mt-12">
                {/* My Classes List */}
                <motion.div
                    initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}
                    className="lg:col-span-7 bg-white/50 dark:bg-slate-900/50 backdrop-blur-3xl rounded-[4rem] border border-white dark:border-white/5 shadow-2xl p-12 overflow-hidden"
                >
                    <div className="flex items-center justify-between mb-12">
                        <div>
                            <h3 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">My Classes.</h3>
                            <p className="text-slate-400 font-bold mt-2">Your schedule for this week.</p>
                        </div>
                        <div className="p-5 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 rounded-2xl">
                            <Calendar className="w-6 h-6" />
                        </div>
                    </div>

                    <div className="space-y-6">
                        {myClasses.map((item: any, i: number) => (
                            <motion.div
                                key={i}
                                whileHover={{ x: 10 }}
                                className="p-8 bg-white dark:bg-slate-800/80 rounded-[2.5rem] border border-slate-100 dark:border-white/5 shadow-lg flex items-center justify-between group"
                            >
                                <div className="flex items-center gap-6">
                                    <div className={`p-5 rounded-2xl ${item.status === TrainingStatus.ONGOING ? 'bg-emerald-500 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-400'} shadow-lg group-hover:scale-110 transition-transform`}>
                                        <GraduationCap className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-black text-slate-900 dark:text-white leading-tight">{item.courseName}</h4>
                                        <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mt-1 flex items-center gap-2">
                                            <MapPin className="w-3 h-3" /> Room {item.classroom}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-black text-slate-900 dark:text-white mb-1">{item.time}</p>
                                    <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${item.status === TrainingStatus.ONGOING ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>
                                        {item.status.split(' ')[0]}
                                    </span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Skill Map Chart */}
                <motion.div
                    initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}
                    className="lg:col-span-5 bg-white/50 dark:bg-slate-900/50 backdrop-blur-3xl rounded-[4rem] border border-white dark:border-white/5 shadow-2xl p-12 overflow-hidden flex flex-col"
                >
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight mb-10">Skill Map</h3>
                    <div className="flex-1 min-h-[300px] w-full mt-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={skillMapData} layout="vertical">
                                <CartesianGrid strokeDasharray="10 10" horizontal={false} stroke={isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'} />
                                <XAxis type="number" hide />
                                <YAxis dataKey="topic" type="category" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 900 }} width={80} />
                                <Tooltip cursor={{ fill: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }} contentStyle={{ borderRadius: '15px', border: 'none' }} />
                                <Bar dataKey="score" radius={[0, 15, 15, 0]}>
                                    {skillMapData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.score > 80 ? '#10b981' : entry.score > 70 ? '#6366f1' : '#f43f5e'} fillOpacity={0.8} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="mt-8 pt-8 border-t border-slate-100 dark:border-white/5">
                        <div className="flex items-center gap-4 bg-indigo-600 rounded-3xl p-6 text-white group cursor-default transition-all shadow-xl shadow-indigo-500/20">
                            <Sparkles className="w-6 h-6 animate-pulse" />
                            <div>
                                <p className="text-xs font-black uppercase tracking-widest">Smart Hint</p>
                                <p className="text-sm font-bold opacity-90 mt-1">{smartHint}</p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default TrainerDashboard;
