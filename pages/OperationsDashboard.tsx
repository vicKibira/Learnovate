
import React, { useMemo, useState } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    AreaChart, Area, PieChart, Pie, Cell, LineChart, Line, RadialBarChart, RadialBar, Legend
} from 'recharts';
import {
    Activity, Calendar, MapPin, User, Clock, CheckCircle,
    AlertTriangle, BookOpen, Layers, BarChart3, MoreVertical,
    Plus, Users, Sparkles, LayoutGrid, List, X, ShieldCheck,
    AlertCircle, Zap, Search, Save, Briefcase, TrendingUp,
    TrendingDown, Gauge, Wallet, Info
} from 'lucide-react';
import { TrainingStatus, UserRole } from '../types';
import { motion as motionAny, AnimatePresence } from 'framer-motion';
const motion = motionAny as any;

const OperationsDashboard: React.FC<{ store: any }> = ({ store }) => {
    const { data, theme } = store;
    const isDark = theme === 'dark';

    // --- SIMPLE CALCULATIONS ---
    const ongoing = data.trainingClasses.filter((t: any) => t.status === TrainingStatus.ONGOING);
    const confirmed = data.trainingClasses.filter((t: any) => t.status === TrainingStatus.CONFIRMED);
    const paidDealsCount = data.deals.filter((d: any) => d.isPaid).length;

    // Work Speed: % of work currently happening vs all work booked
    const workSpeed = useMemo(() => {
        const totalWork = ongoing.length + confirmed.length;
        if (totalWork === 0) return 0;
        return Math.round((ongoing.length / totalWork) * 100);
    }, [ongoing, confirmed]);

    // Money Flow: Real Dollars in the rooms vs Coming Soon
    const moneyMetrics = useMemo(() => {
        const liveValue = ongoing.reduce((sum: number, t: any) => {
            const deal = data.deals.find((d: any) => d.id === t.dealId);
            return sum + (deal?.value || 0);
        }, 0);
        const comingValue = confirmed.reduce((sum: number, t: any) => {
            const deal = data.deals.find((d: any) => d.id === t.dealId);
            return sum + (deal?.value || 0);
        }, 0);
        return { liveValue, comingValue };
    }, [ongoing, confirmed, data.deals]);

    // Big List: The most important work right now
    const bigList = useMemo(() => {
        return ongoing
            .map((t: any) => {
                const deal = data.deals.find((d: any) => d.id === t.dealId);
                return { ...t, value: deal?.value || 0, client: deal?.clientName || 'Private' };
            })
            .sort((a, b) => b.value - a.value)
            .slice(0, 5);
    }, [ongoing, data.deals]);

    // Room Use Map (7-Day Heatmap Mock)
    const roomUseData = [
        { day: 'Mon', use: 40 }, { day: 'Tue', use: 75 }, { day: 'Wed', use: 90 },
        { day: 'Thu', use: 60 }, { day: 'Fri', use: 30 }, { day: 'Sat', use: 10 }, { day: 'Sun', use: 5 }
    ];

    // Money Flow History (Mock Trend)
    const flowHistory = [
        { name: 'Week 1', live: 12000, soon: 8000 },
        { name: 'Week 2', live: 15000, soon: 12000 },
        { name: 'Week 3', live: 18000, soon: 9000 },
        { name: 'Week 4', live: moneyMetrics.liveValue, soon: moneyMetrics.comingValue }
    ];

    return (
        <div className="space-y-12 pb-24 relative min-h-screen font-sans">
            {/* Background Decor */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-10%] left-[-10%] w-[1000px] h-[1000px] bg-indigo-500/5 dark:bg-indigo-600/5 rounded-full blur-[180px] animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[1000px] h-[1000px] bg-rose-500/5 dark:bg-rose-600/5 rounded-full blur-[180px] animate-pulse" style={{ animationDelay: '2s' }} />
            </div>

            {/* Header */}
            <div className="relative z-10 flex flex-col lg:flex-row lg:items-end justify-between gap-10 pt-10 px-2">
                <div>
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-1.5 bg-indigo-600 rounded-full" />
                        <span className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.4em]">Operations Commander</span>
                    </motion.div>
                    <h2 className="text-7xl font-black text-slate-900 dark:text-white tracking-tighter leading-none">
                        Business <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-rose-500">Flow.</span>
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 font-bold text-xl mt-4">
                        Watch your work speed and money flow in real-time.
                    </p>
                </div>
                <div className="flex items-center gap-4 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl p-3 rounded-[2.5rem] border border-white dark:border-white/5 shadow-2xl">
                    <div className="flex items-center gap-3 px-6 py-3 bg-emerald-500 text-white rounded-2xl shadow-lg shadow-emerald-500/30">
                        <Activity className="w-4 h-4 animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Live Flow</span>
                    </div>
                </div>
            </div>

            {/* High-Value Metric Row */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10 px-2">
                {/* Work Speed Gauge */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    className="lg:col-span-4 bg-white/50 dark:bg-slate-900/50 backdrop-blur-3xl rounded-[4rem] border border-white dark:border-white/5 shadow-2xl p-10 flex flex-col items-center justify-center text-center relative overflow-hidden group"
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight mb-8">Work Speed</h3>
                    <div className="relative w-full h-[250px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <RadialBarChart cx="50%" cy="50%" innerRadius="70%" outerRadius="100%" barSize={20} data={[{ name: 'Speed', value: workSpeed, fill: '#6366f1' }]}>
                                <RadialBar background dataKey="value" cornerRadius={30} />
                            </RadialBarChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex flex-col items-center justify-center pt-2">
                            <span className="text-6xl font-black text-slate-900 dark:text-white tracking-tighter">{workSpeed}%</span>
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Efficiency</span>
                        </div>
                    </div>
                    <p className="text-[11px] font-bold text-slate-500 mt-6 leading-relaxed max-w-[200px]">
                        We are currently doing <span className="text-indigo-600">{workSpeed}%</span> of all booked training.
                    </p>
                </motion.div>

                {/* Money Flow Trend */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                    className="lg:col-span-8 bg-white/50 dark:bg-slate-900/50 backdrop-blur-3xl rounded-[4rem] border border-white dark:border-white/5 shadow-2xl p-12 overflow-hidden"
                >
                    <div className="flex items-center justify-between mb-10">
                        <div>
                            <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Money Flow</h3>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-indigo-500" /> Cash in Rooms vs Future Bookings
                            </p>
                        </div>
                        <div className="text-right">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Live Value</p>
                            <p className="text-4xl font-black text-indigo-600 tracking-tighter">${moneyMetrics.liveValue.toLocaleString()}</p>
                        </div>
                    </div>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={flowHistory}>
                                <defs>
                                    <linearGradient id="liveMoney" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="soonMoney" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="10 10" vertical={false} stroke={isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'} />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 900 }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 900 }} tickFormatter={(v) => `$${v / 1000}k`} />
                                <Tooltip contentStyle={{ borderRadius: '24px', backgroundColor: isDark ? '#0f172a' : '#fff', border: 'none', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }} />
                                <Area type="monotone" dataKey="live" name="Live Money" stroke="#6366f1" strokeWidth={5} fillOpacity={1} fill="url(#liveMoney)" />
                                <Area type="monotone" dataKey="soon" name="Coming Soon" stroke="#f43f5e" strokeWidth={3} strokeDasharray="10 10" fillOpacity={1} fill="url(#soonMoney)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>
            </div>

            {/* Middle Section: Room Use & Help Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10 px-2 mt-12">
                {/* Room Use Heatmap */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                    className="lg:col-span-7 bg-white/50 dark:bg-slate-900/50 backdrop-blur-3xl rounded-[4rem] border border-white dark:border-white/5 shadow-2xl p-10 overflow-hidden"
                >
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight mb-10">Room Use Map</h3>
                    <div className="h-[250px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={roomUseData}>
                                <CartesianGrid strokeDasharray="10 10" vertical={false} stroke={isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'} />
                                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 900 }} />
                                <Tooltip cursor={{ fill: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }} contentStyle={{ borderRadius: '15px', border: 'none' }} />
                                <Bar dataKey="use" radius={[15, 15, 0, 0]}>
                                    {roomUseData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.use > 80 ? '#f43f5e' : entry.use > 50 ? '#6366f1' : '#10b981'} fillOpacity={0.8} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="flex items-center justify-center gap-8 mt-6">
                        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-rose-500" /><span className="text-[10px] font-black text-slate-400 uppercase">Too Busy</span></div>
                        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-indigo-500" /><span className="text-[10px] font-black text-slate-400 uppercase">Good Load</span></div>
                        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-emerald-500" /><span className="text-[10px] font-black text-slate-400 uppercase">Available</span></div>
                    </div>
                </motion.div>

                {/* Help Cards Sidebar */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                    className="lg:col-span-5 bg-gradient-to-br from-indigo-600 to-purple-700 rounded-[4.5rem] p-12 text-white shadow-2xl relative overflow-hidden group"
                >
                    <Sparkles className="absolute top-10 right-10 w-24 h-24 text-white/10 group-hover:rotate-12 transition-transform duration-1000" />
                    <h3 className="text-3xl font-black tracking-tighter mb-8 leading-tight">Helpful <br />Cards.</h3>
                    <div className="space-y-6">
                        {[
                            { text: "Room 2 is 100% full this week. Move some people?", icon: <AlertTriangle /> },
                            { text: "James Expert is free on Friday. Give him a class?", icon: <Plus /> },
                            { text: "Corporate deals are up 20%. Hire more trainers?", icon: <TrendingUp /> }
                        ].map((card, i) => (
                            <motion.div key={i} whileHover={{ x: 10 }} className="p-5 bg-white/10 backdrop-blur-md rounded-3xl border border-white/10 flex items-start gap-4">
                                <div className="p-3 bg-white/10 rounded-2xl">{card.icon}</div>
                                <p className="text-sm font-bold leading-relaxed">{card.text}</p>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>

            {/* Lower Section: The Big List */}
            <motion.div
                initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
                className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-3xl rounded-[5rem] border border-white dark:border-white/5 shadow-2xl p-16 relative z-10 px-2 mt-12 mx-2"
            >
                <div className="flex items-center justify-between mb-12 px-2">
                    <div>
                        <h3 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">Big List.</h3>
                        <p className="text-slate-400 font-bold mt-2">The most important classes happening now.</p>
                    </div>
                    <button className="px-8 py-4 bg-slate-100 dark:bg-white/5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-indigo-600 transition-all">
                        See All Activity
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {bigList.map((item, i) => (
                        <div key={i} className="p-8 bg-white dark:bg-slate-800 rounded-[3rem] border border-slate-100 dark:border-white/5 shadow-lg group hover:scale-105 transition-all">
                            <div className="flex items-start justify-between mb-8">
                                <div>
                                    <h4 className="text-xl font-black text-slate-900 dark:text-white mb-2 leading-tight">{item.courseName}</h4>
                                    <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">{item.client}</p>
                                </div>
                                <div className="p-4 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 rounded-2xl">
                                    <Briefcase className="w-5 h-5" />
                                </div>
                            </div>
                            <div className="flex items-end justify-between">
                                <div>
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Impact Value</p>
                                    <p className="text-2xl font-black text-slate-900 dark:text-white">${item.value.toLocaleString()}</p>
                                </div>
                                <span className="px-4 py-1.5 bg-emerald-500 text-white rounded-full text-[9px] font-black uppercase tracking-widest shadow-lg shadow-emerald-500/20">
                                    Big Deal
                                </span>
                            </div>
                        </div>
                    ))}
                    {bigList.length === 0 && (
                        <div className="col-span-full py-20 text-center text-slate-300 font-bold italic text-xl">
                            No high-value classes in flow yet.
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default OperationsDashboard;
