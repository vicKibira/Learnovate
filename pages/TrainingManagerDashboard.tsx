
import React, { useMemo, useState } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    AreaChart, Area, PieChart, Pie, Cell, LineChart, Line
} from 'recharts';
import {
    Building, Users, GraduationCap, Calendar,
    MapPin, Clock, CheckCircle2, AlertCircle,
    TrendingUp, ArrowUpRight, ArrowDownRight,
    MoreHorizontal, Plus, Search, Filter,
    BookOpen, Brain, Zap, Sparkles, Activity,
    Layout, ShieldCheck, Star, MousePointer2, X, Save,
    Briefcase
} from 'lucide-react';
import { UserRole, TrainingStatus } from '../types';
// Cast motion to any to bypass environment-specific type definition issues
import { motion as motionAny, AnimatePresence } from 'framer-motion';
const motion = motionAny as any;

const TrainingManagerDashboard: React.FC<{ store: any }> = ({ store }) => {
    const { data, currentUser, theme, scheduleTraining } = store;
    const isDark = theme === 'dark';

    // --- STATE ---
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearchExpanded, setIsSearchExpanded] = useState(false);
    const [showNewClassModal, setShowNewClassModal] = useState(false);
    const [showRoomsModal, setShowRoomsModal] = useState(false);
    const [newClass, setNewClass] = useState({
        dealId: '',
        courseName: '',
        trainerId: '',
        classroom: '1' as '1' | '2' | '3' | '4',
        hours: 40,
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    });

    // --- TRAINING PERFORMANCE CALCULATIONS ---

    const activeClasses = useMemo(() => {
        return data.trainingClasses.filter((t: any) =>
            t.status === TrainingStatus.ONGOING || t.status === TrainingStatus.CONFIRMED
        );
    }, [data.trainingClasses]);

    const ongoingClassesCount = activeClasses.filter((t: any) => t.status === TrainingStatus.ONGOING).length;
    const upcomingClassesCount = activeClasses.filter((t: any) => t.status === TrainingStatus.CONFIRMED).length;

    const totalLearners = useMemo(() => {
        return data.learners.length;
    }, [data.learners]);

    const trainerHours = [
        { name: 'Mon', hours: 24 },
        { name: 'Tue', hours: 32 },
        { name: 'Wed', hours: 28 },
        { name: 'Thu', hours: 40 },
        { name: 'Fri', hours: 35 },
        { name: 'Sat', hours: 15 },
        { name: 'Sun', hours: 5 },
    ];

    const courseMix = [
        { name: 'Python', value: 40, color: '#6366f1' },
        { name: 'Cloud', value: 30, color: '#10b981' },
        { name: 'AI/ML', value: 20, color: '#f59e0b' },
        { name: 'Soft Skills', value: 10, color: '#ec4899' },
    ];

    const filteredClasses = useMemo(() => {
        return data.trainingClasses.filter((t: any) =>
            t.courseName.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [data.trainingClasses, searchQuery]);

    const availableDeals = useMemo(() => {
        return data.deals.filter((d: any) =>
            d.isPaid && !data.trainingClasses.some((t: any) => t.dealId === d.id)
        );
    }, [data.deals, data.trainingClasses]);

    const trainers = useMemo(() => {
        return data.users.filter((u: any) => u.role === UserRole.TRAINER);
    }, [data.users]);

    const roomOccupancy = useMemo(() => {
        const rooms = { '1': null, '2': null, '3': null, '4': null } as any;
        data.trainingClasses.forEach((t: any) => {
            if (t.status === TrainingStatus.ONGOING) {
                rooms[t.classroom] = t;
            }
        });
        return rooms;
    }, [data.trainingClasses]);

    const handleCreateClass = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newClass.dealId || !newClass.trainerId) return;

        const deal = data.deals.find((d: any) => d.id === newClass.dealId);

        scheduleTraining(newClass.dealId, {
            dealId: newClass.dealId,
            courseName: deal?.title || 'Custom Course',
            duration: '5 Days',
            hours: newClass.hours,
            classroom: newClass.classroom,
            trainerId: newClass.trainerId,
            status: TrainingStatus.CONFIRMED,
            startDate: newClass.startDate,
            endDate: newClass.endDate
        });

        setShowNewClassModal(false);
        setNewClass({
            dealId: '',
            courseName: '',
            trainerId: '',
            classroom: '1',
            hours: 40,
            startDate: new Date().toISOString().split('T')[0],
            endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        });
    };

    return (
        <div className="space-y-12 pb-24 relative min-h-screen font-sans">
            {/* Background Decor */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-10%] right-[-5%] w-[800px] h-[800px] bg-indigo-500/10 dark:bg-indigo-600/5 rounded-full blur-[140px] animate-pulse" />
                <div className="absolute bottom-[-10%] left-[-5%] w-[800px] h-[800px] bg-emerald-500/10 dark:bg-emerald-600/5 rounded-full blur-[150px] animate-pulse" style={{ animationDelay: '2s' }} />
            </div>

            {/* Header */}
            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-10 pt-10 px-2">
                <div className="max-w-2xl">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-3 mb-6"
                    >
                        <span className="flex items-center gap-2 px-4 py-1.5 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-full text-[10px] font-black uppercase tracking-[0.3em] border border-indigo-500/20">
                            <Brain className="w-3 h-3 animate-bounce" /> Control Room
                        </span>
                        <span className="h-0.5 w-12 bg-slate-200 dark:bg-slate-800 rounded-full" />
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Training Terminal</span>
                    </motion.div>
                    <h2 className="text-7xl font-black text-slate-900 dark:text-white tracking-tighter leading-[0.9] mb-4">
                        Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-400 to-emerald-500 animate-gradient-x">Classes.</span>
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 font-bold text-xl leading-relaxed tracking-tight">
                        See what is happening now and what is coming next.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-6">
                    <div className={`relative transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] ${isSearchExpanded ? 'w-96' : 'w-16 sm:w-20'}`}>
                        <button
                            onClick={() => setIsSearchExpanded(!isSearchExpanded)}
                            className={`flex items-center justify-center p-6 bg-white/40 dark:bg-slate-900/40 backdrop-blur-3xl border border-white/50 dark:border-white/5 rounded-[3rem] shadow-2xl transition-all duration-500 relative z-20 ${isSearchExpanded ? 'bg-white dark:bg-slate-900 border-indigo-500/20' : 'hover:scale-110'}`}
                        >
                            <Search className={`w-6 h-6 transition-all duration-500 ${isSearchExpanded ? 'text-indigo-500' : 'text-slate-400'}`} />
                        </button>
                        <AnimatePresence>
                            {isSearchExpanded && (
                                <motion.input
                                    initial={{ x: 20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    exit={{ x: 20, opacity: 0 }}
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Find a class..."
                                    className="absolute inset-0 pl-16 pr-10 bg-white/40 dark:bg-slate-900/40 backdrop-blur-3xl border border-white/50 dark:border-white/5 rounded-[3rem] font-bold text-sm shadow-[0_20px_50px_rgba(0,0,0,0.05)] outline-none focus:ring-4 focus:ring-indigo-500/10 focus:bg-white dark:focus:bg-slate-900 transition-all dark:text-white"
                                    autoFocus
                                />
                            )}
                        </AnimatePresence>
                    </div>
                    <button
                        onClick={() => setShowNewClassModal(true)}
                        className="group relative px-10 py-6 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-[3rem] font-black uppercase tracking-widest text-[10px] shadow-2xl transition-all hover:scale-105 active:scale-95 flex items-center gap-4 overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <Plus className="w-5 h-5 relative z-10 group-hover:rotate-90 transition-transform duration-500" />
                        <span className="relative z-10 group-hover:translate-x-1 transition-transform">New Class</span>
                    </button>
                </div>
            </div>

            {/* Metrics Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10 px-2 mt-12">
                {[
                    { label: 'Classes Now', value: ongoingClassesCount, icon: <Activity className="w-6 h-6" />, delta: 'Steady', color: 'emerald', bg: 'from-emerald-500 to-teal-400' },
                    { label: 'Soon Classes', value: upcomingClassesCount, icon: <Calendar className="w-6 h-6" />, delta: '+4 New', color: 'indigo', bg: 'from-indigo-500 to-blue-400' },
                    { label: 'Total People', value: totalLearners, icon: <Users className="w-6 h-6" />, delta: 'Growing', color: 'amber', bg: 'from-amber-500 to-orange-400' },
                    { label: 'Time Spent', value: '420h', icon: <Clock className="w-6 h-6" />, delta: 'High', color: 'violet', bg: 'from-violet-500 to-purple-400' },
                ].map((stat, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.1, duration: 0.5 }}
                        whileHover={{ y: -10, scale: 1.02 }}
                        className="group relative p-10 bg-white/40 dark:bg-slate-900/40 backdrop-blur-2xl rounded-[4rem] border border-white dark:border-white/5 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.06)] overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br opacity-5 group-hover:opacity-10 transition-opacity duration-700" style={{ backgroundColor: stat.color }} />

                        <div className="flex items-start justify-between mb-12">
                            <div className={`p-5 rounded-3xl bg-white dark:bg-slate-800 shadow-xl text-slate-900 dark:text-white group-hover:scale-110 transition-transform duration-500`}>
                                {stat.icon}
                            </div>
                            <div className="text-right">
                                <span className={`text-[9px] font-black px-4 py-1.5 rounded-full tracking-widest uppercase border transition-all ${stat.color === 'emerald' ? 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-500/20 text-emerald-600' :
                                        'bg-slate-50 dark:bg-slate-500/10 border-slate-500/20 text-slate-500'
                                    }`}>
                                    {stat.delta}
                                </span>
                            </div>
                        </div>

                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4 leading-none">{stat.label}</p>
                        <h3 className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter leading-none group-hover:translate-x-2 transition-transform duration-500">
                            {stat.value}
                        </h3>

                        <div className="mt-8 pt-8 border-t border-slate-100/50 dark:border-white/5 flex items-center justify-between">
                            <div className="w-32 h-1 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: '75%' }}
                                    className={`h-full bg-gradient-to-r ${stat.bg}`}
                                />
                            </div>
                            <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Load</span>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Progress Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 px-2 relative z-10 mt-12">
                <div className="lg:col-span-2 relative">
                    <div className="absolute inset-x-0 -top-6 h-[0.5px] bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-800 to-transparent" />
                    <div className="p-12 bg-white/50 dark:bg-slate-900/50 backdrop-blur-3xl rounded-[5rem] border border-white dark:border-white/5 shadow-2xl">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-16 gap-6">
                            <div>
                                <h3 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter mb-2">Trainer Load</h3>
                                <div className="flex items-center gap-3">
                                    <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]" />
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active hours this week</p>
                                </div>
                            </div>
                        </div>

                        <div className="h-[480px] w-full mt-4">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={trainerHours}>
                                    <defs>
                                        <linearGradient id="glowHours" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.5} />
                                            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="12 12" vertical={false} stroke={isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)'} />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 900 }} dy={20} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 900 }} />
                                    <Tooltip
                                        cursor={{ stroke: '#10b981', strokeWidth: 2, strokeDasharray: '5 5' }}
                                        contentStyle={{
                                            borderRadius: '40px',
                                            backgroundColor: isDark ? 'rgba(15,23,42,0.9)' : 'rgba(255,255,255,0.9)',
                                            backdropFilter: 'blur(20px)',
                                            border: '1px solid rgba(255,255,255,0.1)',
                                            boxShadow: '0 50px 70px -15px rgba(0,0,0,0.2)',
                                            padding: '30px'
                                        }}
                                        itemStyle={{ fontWeight: 900, fontSize: '12px' }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="hours"
                                        stroke="#10b981"
                                        strokeWidth={10}
                                        fillOpacity={1}
                                        fill="url(#glowHours)"
                                        dot={{ r: 12, fill: '#10b981', strokeWidth: 6, stroke: isDark ? '#0f172a' : '#fff' }}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                <div className="space-y-12">
                    <div className="p-12 bg-white/40 dark:bg-slate-900/40 backdrop-blur-3xl rounded-[5rem] border border-white dark:border-white/5 shadow-2xl relative overflow-hidden group">
                        <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter mb-12">Class Mix</h3>
                        <div className="h-[280px] relative">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={courseMix}
                                        innerRadius={85}
                                        outerRadius={115}
                                        paddingAngle={12}
                                        dataKey="value"
                                        stroke="none"
                                    >
                                        {courseMix.map((c, i) => <Cell key={i} fill={c.color} />)}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] leading-none mb-2">Mix</p>
                                <p className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter leading-none">All</p>
                            </div>
                        </div>
                    </div>

                    <motion.div
                        whileHover={{ scale: 1.03, rotate: -1 }}
                        className="relative p-12 bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-800 rounded-[5rem] text-white shadow-[0_30px_70px_rgba(79,70,229,0.3)] group overflow-hidden"
                    >
                        <h4 className="text-3xl font-black tracking-tighter mb-4 leading-tight text-white">Class <br />Board.</h4>
                        <p className="text-indigo-100 font-bold text-lg leading-relaxed mb-10 opacity-90">
                            {ongoingClassesCount} classrooms are full. {availableDeals.length} deals waiting for scheduling.
                        </p>
                        <button
                            onClick={() => setShowRoomsModal(true)}
                            className="w-full py-6 bg-white text-indigo-700 rounded-[2rem] font-black uppercase tracking-widest text-[10px] shadow-2xl hover:bg-emerald-400 hover:text-white transition-all transform hover:-translate-y-1"
                        >
                            Check Rooms
                        </button>
                    </motion.div>
                </div>
            </div>

            {/* Class List */}
            <div className="relative z-10 px-2 mt-16 pb-12">
                <div className="bg-white/30 dark:bg-slate-900/30 backdrop-blur-3xl rounded-[6rem] border border-white dark:border-white/5 shadow-2xl overflow-hidden p-1">
                    <div className="p-16 flex items-center justify-between">
                        <div>
                            <h3 className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter leading-none mb-4">My Schedule.</h3>
                            <p className="text-slate-400 font-bold text-lg tracking-tight">All your classes in one place.</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-white/5 font-black text-[10px] uppercase tracking-widest text-slate-500">
                                <Filter className="w-3 h-3" /> Filter
                            </div>
                        </div>
                    </div>

                    <div className="overflow-x-auto px-10 pb-16">
                        <table className="w-full text-left min-w-[800px]">
                            <thead>
                                <tr className="border-b border-slate-100 dark:border-white/5">
                                    <th className="pb-10 px-8 text-[11px] font-black text-slate-400 uppercase tracking-[0.3em]">Course Name</th>
                                    <th className="pb-10 px-8 text-[11px] font-black text-slate-400 uppercase tracking-[0.3em]">Room</th>
                                    <th className="pb-10 px-8 text-[11px] font-black text-slate-400 uppercase tracking-[0.3em]">Hours</th>
                                    <th className="pb-10 px-8 text-[11px] font-black text-slate-400 uppercase tracking-[0.3em]">Status</th>
                                    <th className="pb-10 px-8 text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] text-right">Progress</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100/30 dark:divide-white/5">
                                {filteredClasses.map((t, i) => (
                                    <motion.tr key={i} className="group hover:bg-white/80 dark:hover:bg-white/5 transition-all duration-500 cursor-pointer">
                                        <td className="py-10 px-8">
                                            <div className="flex items-center gap-5">
                                                <div className="w-16 h-16 rounded-[2rem] bg-gradient-to-br from-indigo-100 to-indigo-200 dark:from-indigo-800 dark:to-indigo-700 flex items-center justify-center text-indigo-900 dark:text-white font-black text-xl shadow-lg ring-4 ring-white dark:ring-slate-900 group-hover:scale-110 transition-transform">
                                                    {t.courseName.charAt(0)}
                                                </div>
                                                <div>
                                                    <span className="text-xl font-black text-slate-900 dark:text-white tracking-tighter leading-none block mb-2">{t.courseName}</span>
                                                    <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest flex items-center gap-2">Active</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-10 px-8 font-black text-slate-400 text-lg uppercase italic">Room {t.classroom}</td>
                                        <td className="py-10 px-8 font-black text-2xl text-slate-900 dark:text-white">{t.hours}h</td>
                                        <td className="py-10 px-8">
                                            <div className={`inline-flex px-6 py-2.5 rounded-3xl text-[10px] font-black uppercase tracking-[0.2em] shadow-sm ${t.status === TrainingStatus.ONGOING ? 'bg-indigo-500 text-white' : 'bg-emerald-500 text-white'}`}>
                                                {t.status}
                                            </div>
                                        </td>
                                        <td className="py-10 px-8 text-right">
                                            <div className="flex flex-col items-end gap-3">
                                                <span className="font-black text-xl text-slate-900 dark:text-white">75%</span>
                                                <div className="w-32 h-1 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                                    <div className="h-full bg-indigo-500 w-3/4" />
                                                </div>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                                {filteredClasses.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="py-32 text-center text-slate-400 font-bold italic text-xl tracking-tight opacity-50">
                                            No classes found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* New Class Modal */}
            <AnimatePresence>
                {showNewClassModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowNewClassModal(false)} className="absolute inset-0 bg-white/40 dark:bg-black/80 backdrop-blur-2xl" />

                        <motion.div initial={{ opacity: 0, scale: 0.95, y: 30 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 30 }} className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-[5rem] shadow-[0_50px_100px_rgba(0,0,0,0.3)] overflow-hidden border border-white dark:border-white/5">
                            <div className="p-14 border-b border-slate-100 dark:border-white/5 flex items-center justify-between">
                                <div>
                                    <h3 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">New Class</h3>
                                    <p className="text-slate-400 font-bold text-sm mt-1">Schedule a new course for a paid deal.</p>
                                </div>
                                <button onClick={() => setShowNewClassModal(false)} className="p-5 hover:bg-slate-50 dark:hover:bg-white/5 rounded-[2rem] transition-all group">
                                    <X className="w-8 h-8 text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white group-hover:rotate-90 transition-all" />
                                </button>
                            </div>

                            <form onSubmit={handleCreateClass} className="p-14 space-y-10 group">
                                <div className="space-y-4">
                                    <label className="flex items-center gap-3 text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                                        <Briefcase className="w-4 h-4 text-indigo-500" /> Select Paid Deal
                                    </label>
                                    <select
                                        required
                                        value={newClass.dealId}
                                        onChange={e => setNewClass({ ...newClass, dealId: e.target.value })}
                                        className="w-full px-8 py-6 bg-slate-50 dark:bg-slate-800/50 border-none rounded-[2rem] outline-none font-black focus:ring-4 focus:ring-indigo-500/10 dark:text-white text-lg appearance-none cursor-pointer"
                                    >
                                        <option value="">Select a deal...</option>
                                        {availableDeals.map((d: any) => (
                                            <option key={d.id} value={d.id}>{d.title} ({d.clientName})</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                    <div className="space-y-4">
                                        <label className="flex items-center gap-3 text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                                            <Users className="w-4 h-4 text-emerald-500" /> Assign Trainer
                                        </label>
                                        <select
                                            required
                                            value={newClass.trainerId}
                                            onChange={e => setNewClass({ ...newClass, trainerId: e.target.value })}
                                            className="w-full px-8 py-6 bg-slate-50 dark:bg-slate-800/50 border-none rounded-[2rem] outline-none font-black focus:ring-4 focus:ring-emerald-500/10 dark:text-white text-lg appearance-none cursor-pointer"
                                        >
                                            <option value="">Select trainer...</option>
                                            {trainers.map((t: any) => (
                                                <option key={t.id} value={t.id}>{t.name}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="space-y-4">
                                        <label className="flex items-center gap-3 text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                                            <MapPin className="w-4 h-4 text-violet-500" /> Classroom
                                        </label>
                                        <select
                                            value={newClass.classroom}
                                            onChange={e => setNewClass({ ...newClass, classroom: e.target.value as any })}
                                            className="w-full px-8 py-6 bg-slate-50 dark:bg-slate-800/50 border-none rounded-[2rem] outline-none font-black focus:ring-4 focus:ring-violet-500/10 dark:text-white text-lg appearance-none cursor-pointer"
                                        >
                                            <option value="1">Classroom 1</option>
                                            <option value="2">Classroom 2</option>
                                            <option value="3">Classroom 3</option>
                                            <option value="4">Classroom 4</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                    <div className="space-y-4">
                                        <label className="flex items-center gap-3 text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                                            <Calendar className="w-4 h-4 text-indigo-500" /> Start Date
                                        </label>
                                        <input
                                            required
                                            type="date"
                                            value={newClass.startDate}
                                            onChange={e => setNewClass({ ...newClass, startDate: e.target.value })}
                                            className="w-full px-8 py-6 bg-slate-50 dark:bg-slate-800/50 border-none rounded-[2rem] outline-none font-black focus:ring-4 focus:ring-indigo-500/10 dark:text-white text-lg"
                                        />
                                    </div>
                                    <div className="space-y-4">
                                        <label className="flex items-center gap-3 text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                                            <Calendar className="w-4 h-4 text-emerald-500" /> End Date
                                        </label>
                                        <input
                                            required
                                            type="date"
                                            value={newClass.endDate}
                                            onChange={e => setNewClass({ ...newClass, endDate: e.target.value })}
                                            className="w-full px-8 py-6 bg-slate-50 dark:bg-slate-800/50 border-none rounded-[2rem] outline-none font-black focus:ring-4 focus:ring-emerald-500/10 dark:text-white text-lg"
                                        />
                                    </div>
                                </div>

                                <div className="pt-6">
                                    <button type="submit" className="group relative w-full py-8 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-[2.5rem] font-black text-xs uppercase tracking-[0.4em] shadow-2xl transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-4 overflow-hidden">
                                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-teal-500 opacity-0 group-hover:opacity-100 transition-all duration-700" />
                                        <Save className="w-5 h-5 relative z-10 group-hover:scale-110 transition-transform" />
                                        <span className="relative z-10">Schedule Class</span>
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Room Status Modal */}
            <AnimatePresence>
                {showRoomsModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowRoomsModal(false)} className="absolute inset-0 bg-white/40 dark:bg-black/80 backdrop-blur-2xl" />

                        <motion.div initial={{ opacity: 0, scale: 0.95, y: 30 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 30 }} className="relative w-full max-w-4xl bg-white dark:bg-slate-900 rounded-[5rem] shadow-[0_50px_100px_rgba(0,0,0,0.3)] overflow-hidden border border-white dark:border-white/5">
                            <div className="p-14 border-b border-slate-100 dark:border-white/5 flex items-center justify-between">
                                <div>
                                    <h3 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">Room Status</h3>
                                    <p className="text-slate-400 font-bold text-sm mt-1">Live occupancy of classrooms 1-4.</p>
                                </div>
                                <button onClick={() => setShowRoomsModal(false)} className="p-5 hover:bg-slate-50 dark:hover:bg-white/5 rounded-[2rem] transition-all group">
                                    <X className="w-8 h-8 text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white group-hover:rotate-90 transition-all" />
                                </button>
                            </div>

                            <div className="p-14 grid grid-cols-1 sm:grid-cols-2 gap-10">
                                {['1', '2', '3', '4'].map((roomNum) => {
                                    const occupancy = roomOccupancy[roomNum];
                                    return (
                                        <div key={roomNum} className="p-10 bg-slate-50 dark:bg-slate-800/50 rounded-[3rem] border border-slate-100 dark:border-white/5 relative overflow-hidden group">
                                            <div className="flex items-center justify-between mb-8">
                                                <h4 className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter">Room {roomNum}</h4>
                                                <div className={`w-4 h-4 rounded-full ${occupancy ? 'bg-rose-500 animate-pulse shadow-[0_0_10px_rgba(244,63,94,0.5)]' : 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]'}`} />
                                            </div>

                                            {occupancy ? (
                                                <div className="space-y-4">
                                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Ongoing Class</p>
                                                    <h5 className="text-xl font-black text-slate-900 dark:text-white leading-tight">{occupancy.courseName}</h5>
                                                    <div className="flex items-center gap-3 pt-4 border-t border-slate-200 dark:border-white/10">
                                                        <Users className="w-4 h-4 text-emerald-500" />
                                                        <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Trainer ID: {occupancy.trainerId.substring(0, 5)}...</span>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="flex flex-col items-center justify-center py-10 opacity-30 grayscale saturate-0">
                                                    <Sparkles className="w-12 h-12 text-emerald-500 mb-4" />
                                                    <p className="text-sm font-black text-slate-400 uppercase tracking-widest text-center">Ready for Use</p>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default TrainingManagerDashboard;
