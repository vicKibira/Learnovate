
import React, { useMemo, useState } from 'react';
import {
    GraduationCap, Users, Target, CheckCircle2,
    Clock, AlertTriangle, TrendingUp, Search,
    Filter, MoreVertical, Mail, MoreHorizontal,
    ChevronRight, Sparkles, BookOpen, Layers,
    Calendar, Award, Activity, SearchIcon
} from 'lucide-react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    Cell, ScatterChart, Scatter, ZAxis
} from 'recharts';
// Cast motion to any to bypass environment-specific type definition issues
import { motion as motionAny, AnimatePresence } from 'framer-motion';
const motion = motionAny as any;

const StudentNexus: React.FC<{ store: any }> = ({ store }) => {
    const { data, currentUser, theme } = store;
    const isDark = theme === 'dark';
    const [activeBatch, setActiveBatch] = useState('All Batches');

    // Filter batches for current trainer
    const batches = useMemo(() => {
        return Array.from(new Set(data.trainingClasses
            .filter((tc: any) => tc.trainerId === currentUser.id)
            .map((tc: any) => tc.courseName)));
    }, [data.trainingClasses, currentUser.id]);

    // Mock Progression Data for Heatmap / Matrix
    const matrixData = [
        { student: 'Alice Chen', module: 'Basics', score: 100 },
        { student: 'Alice Chen', module: 'Logic', score: 95 },
        { student: 'Alice Chen', module: 'API', score: 80 },
        { student: 'Bob Smith', module: 'Basics', score: 90 },
        { student: 'Bob Smith', module: 'Logic', score: 60 },
        { student: 'Bob Smith', module: 'API', score: 40 },
        { student: 'Charlie Davis', module: 'Basics', score: 85 },
        { student: 'Charlie Davis', module: 'Logic', score: 88 },
        { student: 'Charlie Davis', module: 'API', score: 75 },
        { student: 'Diana Prince', module: 'Basics', score: 92 },
        { student: 'Diana Prince', module: 'Logic', score: 45 },
        { student: 'Diana Prince', module: 'API', score: 20 },
    ];

    const students = Array.from(new Set(matrixData.map(d => d.student)));
    const modules = Array.from(new Set(matrixData.map(d => d.module)));

    const getScoreColor = (score: number) => {
        if (score >= 90) return 'bg-emerald-500';
        if (score >= 75) return 'bg-indigo-500';
        if (score >= 60) return 'bg-amber-500';
        return 'bg-rose-500';
    };

    return (
        <div className="space-y-10 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex items-center gap-2 mb-3">
                        <div className="w-10 h-1 bg-emerald-500 rounded-full" />
                        <span className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.4em]">Academy Operations</span>
                    </motion.div>
                    <h2 className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter">
                        Student <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">Nexus</span>
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 font-bold text-lg mt-3">Monitoring student progression and identifies intervention vectors.</p>
                </div>
                <div className="flex gap-4">
                    <select
                        value={activeBatch}
                        onChange={(e) => setActiveBatch(e.target.value)}
                        className="px-8 py-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.2rem] font-black uppercase tracking-widest text-[10px] shadow-xl outline-none focus:border-indigo-500 transition-all dark:text-white"
                    >
                        <option>All Batches</option>
                        {batches.map(b => <option key={b}>{b}</option>)}
                    </select>
                </div>
            </div>

            {/* Top Level Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {[
                    { label: 'Active Learners', value: '48', icon: <Users className="w-6 h-6 text-indigo-600" />, delta: '+12%', color: 'bg-indigo-50' },
                    { label: 'Avg Progress', value: '76%', icon: <Activity className="w-6 h-6 text-emerald-600" />, delta: '+4.5%', color: 'bg-emerald-50' },
                    { label: 'At Risk', value: '5', icon: <AlertTriangle className="w-6 h-6 text-rose-600" />, delta: '-2', color: 'bg-rose-50' },
                    { label: 'Cert Readiness', value: '18', icon: <Award className="w-6 h-6 text-amber-600" />, delta: '+8', color: 'bg-amber-50' },
                ].map((stat, i) => (
                    <motion.div
                        key={i}
                        whileHover={{ y: -5 }}
                        className="glass p-10 rounded-[3.5rem] shadow-xl border border-white/60 dark:border-white/5"
                    >
                        <div className="flex items-start justify-between mb-8">
                            <div className={`p-4 rounded-2xl ${stat.color} shadow-inner`}>{stat.icon}</div>
                            <span className={`text-[10px] font-black px-3 py-1.5 rounded-full ${stat.label === 'At Risk' ? 'bg-rose-100 text-rose-600' : 'bg-emerald-100 text-emerald-600'}`}>
                                {stat.delta}
                            </span>
                        </div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{stat.label}</p>
                        <h3 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">{stat.value}</h3>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
                {/* Learner Progress Heatmap */}
                <div className="glass p-12 rounded-[4rem] shadow-xl border border-white/60 dark:border-white/5 overflow-hidden">
                    <div className="flex items-center justify-between mb-12">
                        <div>
                            <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Competency Matrix</h3>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Cross-module performance heatmap</p>
                        </div>
                        <Sparkles className="w-6 h-6 text-indigo-500 animate-pulse" />
                    </div>

                    <div className="overflow-x-auto pb-4 -mx-4 px-4 custom-scrollbar">
                        <div className="min-w-[500px]">
                            <div className="grid grid-cols-5 gap-4 mb-6">
                                <div className="col-span-2" />
                                {modules.map(m => (
                                    <div key={m} className="text-center font-black text-[10px] text-slate-400 uppercase tracking-widest">{m}</div>
                                ))}
                            </div>
                            {students.map(s => (
                                <div key={s} className="grid grid-cols-5 gap-4 items-center mb-4">
                                    <div className="col-span-2">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-black text-slate-500 text-sm">
                                                {s.charAt(0)}
                                            </div>
                                            <span className="text-sm font-black text-slate-700 dark:text-slate-300">{s}</span>
                                        </div>
                                    </div>
                                    {modules.map(m => {
                                        const cell = matrixData.find(d => d.student === s && d.module === m);
                                        return (
                                            <div key={m} className={`h-12 rounded-2xl flex items-center justify-center text-white text-xs font-black shadow-lg shadow-black/5 group cursor-pointer relative ${getScoreColor(cell?.score || 0)}`}>
                                                {cell?.score}%
                                                <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
                                            </div>
                                        );
                                    })}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="mt-12 flex items-center gap-6 justify-center">
                        {[
                            { l: 'Critical', c: 'bg-rose-500' },
                            { l: 'Developing', c: 'bg-amber-500' },
                            { l: 'Proficient', c: 'bg-indigo-500' },
                            { l: 'Mastery', c: 'bg-emerald-500' },
                        ].map(item => (
                            <div key={item.l} className="flex items-center gap-2">
                                <div className={`w-3 h-3 rounded-full ${item.c}`} />
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.l}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Detailed Student Registry */}
                <div className="glass p-10 rounded-[4rem] shadow-2xl border border-white/60 dark:border-white/5 flex flex-col">
                    <div className="flex items-center justify-between mb-10">
                        <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Intervention Registry</h3>
                        <div className="relative group">
                            <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search registry..."
                                className="pl-12 pr-6 py-3 bg-slate-100 dark:bg-slate-800/50 rounded-2xl text-[10px] font-black uppercase tracking-widest outline-none border border-transparent focus:border-indigo-500 transition-all dark:text-white"
                            />
                        </div>
                    </div>

                    <div className="space-y-4 flex-1 overflow-y-auto max-h-[500px] pr-4 custom-scrollbar">
                        {[
                            { name: 'Diana Prince', status: 'At Risk', progress: 45, module: 'API Mastery', icon: <AlertTriangle className="text-rose-500" /> },
                            { name: 'Bob Smith', status: 'Developing', progress: 60, module: 'Advanced Logic', icon: <Activity className="text-amber-500" /> },
                            { name: 'Alice Chen', status: 'Mastery', progress: 95, module: 'Project Alpha', icon: <Award className="text-emerald-500" /> },
                            { name: 'Charlie Davis', status: 'Proficient', progress: 82, module: 'System Design', icon: <CheckCircle2 className="text-indigo-500" /> },
                        ].map((student, i) => (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.1 }}
                                key={i}
                                className="p-6 bg-slate-50 dark:bg-slate-900/40 rounded-[2.5rem] border border-transparent hover:border-indigo-500/20 transition-all group cursor-pointer"
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-white dark:bg-slate-800 rounded-xl shadow-sm">
                                            {student.icon}
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-black text-slate-900 dark:text-white">{student.name}</h4>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{student.module}</p>
                                        </div>
                                    </div>
                                    <button className="p-2 hover:bg-white dark:hover:bg-slate-800 rounded-xl transition-all">
                                        <MoreHorizontal className="w-5 h-5 text-slate-400" />
                                    </button>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
                                        <span className="text-slate-400">Completion</span>
                                        <span className="text-slate-900 dark:text-white">{student.progress}%</span>
                                    </div>
                                    <div className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${student.progress}%` }}
                                            transition={{ duration: 1, delay: i * 0.2 }}
                                            className={`h-full rounded-full ${student.status === 'At Risk' ? 'bg-rose-500' :
                                                student.status === 'Developing' ? 'bg-amber-500' :
                                                    student.status === 'Mastery' ? 'bg-emerald-500' : 'bg-indigo-500'
                                                }`}
                                        />
                                    </div>
                                </div>
                                <div className="mt-6 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-all">
                                    <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-indigo-500 hover:text-indigo-600">
                                        <Mail className="w-4 h-4" /> Send Nudge
                                    </button>
                                    <button className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-[9px] font-black uppercase tracking-widest shadow-lg shadow-indigo-500/20">
                                        View Dossier
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Strategic Vision Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="p-12 bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-[4rem] text-white shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-20 group-hover:scale-110 transition-transform duration-700">
                        <Layers className="w-32 h-32" />
                    </div>
                    <h3 className="text-3xl font-black tracking-tighter mb-4 relative z-10">Certification Funnel</h3>
                    <p className="text-indigo-100 text-lg font-medium leading-relaxed mb-10 relative z-10">
                        You have 12 students approaching Exam Readiness. Automated pre-assessment quizzes have been dispatched to the Python Advanced cohort.
                    </p>
                    <button className="px-8 py-4 bg-white text-indigo-700 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl hover:bg-emerald-400 hover:text-white transition-all relative z-10">
                        Review Readiness
                    </button>
                </div>

                <div className="p-12 bg-white dark:bg-slate-900 rounded-[4rem] border border-slate-200 dark:border-white/5 shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:rotate-12 transition-transform duration-700">
                        <Target className="w-32 h-32 text-slate-900 dark:text-white" />
                    </div>
                    <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter mb-4 relative z-10">Faculty Action Items</h3>
                    <div className="space-y-4 relative z-10">
                        {[
                            'Follow up with Diana Prince on API setup',
                            'Schedule 1-on-1 for Bob Smith on Logic flows',
                            'Review Exam Mock Scores for Batch A-12'
                        ].map((item, i) => (
                            <div key={i} className="flex items-center gap-4 text-slate-500 dark:text-slate-400 font-bold">
                                <div className="w-2 h-2 rounded-full bg-indigo-500" />
                                {item}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentNexus;
