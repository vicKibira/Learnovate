
import React, { useMemo } from 'react';
import {
    BarChart3, Users, TrendingUp, UserPlus,
    UserMinus, Activity, Sparkles, Filter,
    ChevronRight, ArrowUpRight, ArrowDownRight,
    Globe, Briefcase, Heart, Shield
} from 'lucide-react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    AreaChart, Area, PieChart, Pie, Cell, LineChart, Line
} from 'recharts';
// Cast motion to any to bypass environment-specific type definition issues
import { motion as motionAny, AnimatePresence } from 'framer-motion';
const motion = motionAny as any;

const WorkforceAnalytics: React.FC<{ store: any }> = ({ store }) => {
    const { theme } = store;
    const isDark = theme === 'dark';

    const headcountData = [
        { month: 'Jan', count: 120 },
        { month: 'Feb', count: 125 },
        { month: 'Mar', count: 128 },
        { month: 'Apr', count: 135 },
        { month: 'May', count: 142 },
        { month: 'Jun', count: 150 },
    ];

    const departmentData = [
        { name: 'Sales', value: 45 },
        { name: 'Training', value: 30 },
        { name: 'Operations', value: 15 },
        { name: 'HR/Finance', value: 10 },
    ];

    const retentionData = [
        { month: 'Jan', rate: 98 },
        { month: 'Feb', rate: 97 },
        { month: 'Mar', rate: 99 },
        { month: 'Apr', rate: 96 },
        { month: 'May', rate: 98 },
        { month: 'Jun', rate: 97 },
    ];

    const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ec4899'];

    return (
        <div className="space-y-10 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-2 mb-3">
                        <div className="w-10 h-1 bg-indigo-500 rounded-full" />
                        <span className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.4em]">Strategic Insights</span>
                    </motion.div>
                    <h2 className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter">
                        Workforce <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-500">Analytics</span>
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 font-bold text-lg mt-3">Monitoring headcount velocity, retention health, and organizational composition.</p>
                </div>
                <div className="flex gap-4">
                    <button className="px-8 py-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem] font-black uppercase tracking-widest text-[10px] shadow-xl flex items-center gap-3 transition-all hover:border-indigo-500 dark:text-white">
                        <Filter className="w-5 h-5 text-indigo-500" />
                        Fiscal Year 2024
                    </button>
                </div>
            </div>

            {/* Primary Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {[
                    { label: 'Total Headcount', value: '150', icon: <Users className="w-6 h-6 text-indigo-600" />, delta: '+15%', color: 'bg-indigo-50' },
                    { label: 'Retention Rate', value: '97.2%', icon: <Activity className="w-6 h-6 text-emerald-600" />, delta: '+0.4%', color: 'bg-emerald-50' },
                    { label: 'Open Roles', value: '12', icon: <UserPlus className="w-6 h-6 text-rose-600" />, delta: 'High', color: 'bg-rose-50' },
                    { label: 'Avg Tenure', value: '2.4y', icon: <Briefcase className="w-6 h-6 text-amber-600" />, delta: '+0.2y', color: 'bg-amber-50' },
                ].map((stat, i) => (
                    <motion.div
                        key={i}
                        whileHover={{ y: -5 }}
                        className="glass p-10 rounded-[3.5rem] shadow-xl border border-white/60 dark:border-white/5"
                    >
                        <div className="flex items-start justify-between mb-8">
                            <div className={`p-4 rounded-2xl ${stat.color} shadow-inner`}>{stat.icon}</div>
                            <span className={`text-[10px] font-black px-3 py-1.5 rounded-full ${stat.label === 'Open Roles' ? 'bg-indigo-100 text-indigo-600' : 'bg-emerald-100 text-emerald-600'}`}>
                                {stat.delta}
                            </span>
                        </div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{stat.label}</p>
                        <h3 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">{stat.value}</h3>
                    </motion.div>
                ))}
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* Headcount Growth */}
                <div className="glass p-12 rounded-[4rem] shadow-xl border border-white/60 dark:border-white/5 relative overflow-hidden">
                    <div className="flex items-center justify-between mb-12">
                        <div>
                            <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Growth Velocity</h3>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Monthly headcount progression</p>
                        </div>
                        <Sparkles className="w-6 h-6 text-indigo-500 animate-pulse" />
                    </div>
                    <div className="h-[350px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={headcountData}>
                                <defs>
                                    <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="10 10" vertical={false} stroke={isDark ? '#334155' : '#e2e8f0'} />
                                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 900 }} />
                                <Tooltip
                                    contentStyle={{
                                        borderRadius: '24px',
                                        backgroundColor: isDark ? '#0f172a' : '#fff',
                                        border: 'none',
                                        boxShadow: '0 20px 40px -10px rgba(0,0,0,0.1)'
                                    }}
                                />
                                <Area type="monotone" dataKey="count" stroke="#6366f1" strokeWidth={6} fillOpacity={1} fill="url(#colorCount)" dot={{ r: 8, fill: '#6366f1', strokeWidth: 4, stroke: isDark ? '#1e293b' : '#fff' }} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Department Distribution */}
                <div className="glass p-12 rounded-[4rem] shadow-xl border border-white/60 dark:border-white/5 relative overflow-hidden">
                    <div className="flex items-center justify-between mb-12">
                        <div>
                            <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Department Mix</h3>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Total workforce segmentation</p>
                        </div>
                    </div>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={departmentData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={80}
                                    outerRadius={120}
                                    paddingAngle={10}
                                    dataKey="value"
                                >
                                    {departmentData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="grid grid-cols-2 gap-6 mt-12">
                        {departmentData.map((d, i) => (
                            <div key={i} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
                                <div className="flex items-center gap-3">
                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{d.name}</span>
                                </div>
                                <span className="text-sm font-black text-slate-900 dark:text-white">{d.value}%</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Retention Health Section */}
            <div className="glass p-12 rounded-[4rem] shadow-2xl border border-white/60 dark:border-white/5">
                <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
                    <div className="flex-1">
                        <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter mb-4">Retention Ecosystem</h3>
                        <p className="text-slate-500 dark:text-slate-400 font-bold text-lg mb-8">Stability remains high with a 1.2% voluntary churn rate over the last quarter.</p>
                        <div className="space-y-6">
                            {[
                                { label: 'Voluntary Churn', value: '1.2%', icon: <UserMinus className="text-rose-500" /> },
                                { label: 'Involuntary Churn', value: '0.4%', icon: <Shield className="text-indigo-500" /> },
                                { label: 'Employee NPS', value: '78', icon: <Heart className="text-pink-500" /> },
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-6 p-6 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-transparent hover:border-indigo-100 transition-all">
                                    <div className="w-12 h-12 bg-white dark:bg-slate-700 rounded-2xl flex items-center justify-center shadow-sm">{item.icon}</div>
                                    <div className="flex-1">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.label}</p>
                                        <h4 className="text-xl font-black text-slate-900 dark:text-white">{item.value}</h4>
                                    </div>
                                    <ArrowUpRight className="w-5 h-5 text-emerald-500" />
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="flex-1 w-full">
                        <div className="h-[400px] w-full bg-slate-50 dark:bg-slate-900/40 rounded-[3rem] p-10 border border-slate-100 dark:border-white/5">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={retentionData}>
                                    <CartesianGrid strokeDasharray="10 10" vertical={false} stroke={isDark ? '#334155' : '#e2e8f0'} />
                                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 900 }} />
                                    <YAxis domain={[90, 100]} hide />
                                    <Tooltip contentStyle={{ borderRadius: '24px' }} />
                                    <Line type="monotone" dataKey="rate" stroke="#10b981" strokeWidth={6} dot={{ r: 8, fill: '#10b981' }} />
                                </LineChart>
                            </ResponsiveContainer>
                            <div className="mt-8 text-center">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Retention (%) over trailing 6 months</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Diversity & Inclusion Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="p-12 bg-slate-900 text-white rounded-[4rem] shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-700">
                        <Globe className="w-32 h-32" />
                    </div>
                    <h3 className="text-3xl font-black tracking-tighter mb-4">Global Reach</h3>
                    <p className="text-slate-400 font-medium text-lg leading-relaxed mb-10">
                        Our workforce represents 12 distinct nationalities, bringing diverse perspectives to our training pedagogy.
                    </p>
                    <div className="flex items-center gap-4">
                        {[1, 2, 3, 4].map(i => <div key={i} className="w-10 h-10 rounded-full bg-white/10 border border-white/20" />)}
                        <span className="text-xs font-black uppercase tracking-widest text-indigo-400">+8 regions</span>
                    </div>
                </div>
                <div className="p-12 bg-indigo-600 text-white rounded-[4rem] shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-20 group-hover:rotate-12 transition-transform duration-700">
                        <Heart className="w-32 h-32" />
                    </div>
                    <h3 className="text-3xl font-black tracking-tighter mb-4">Culture Impact</h3>
                    <p className="text-indigo-100 font-medium text-lg leading-relaxed mb-10">
                        85% of employees participate in at least one Wellness initiative monthly, contributing to our high culture pulse.
                    </p>
                    <button className="px-10 py-4 bg-white text-indigo-700 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl hover:bg-emerald-400 hover:text-white transition-all">
                        Analyze Pulse Data
                    </button>
                </div>
            </div>
        </div>
    );
};

export default WorkforceAnalytics;
