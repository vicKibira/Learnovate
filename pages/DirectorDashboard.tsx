
import React, { useMemo, useState } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    AreaChart, Area, PieChart, Pie, Cell, LineChart, Line
} from 'recharts';
import {
    DollarSign, Users, Briefcase, TrendingUp,
    ArrowUpRight, ArrowDownRight, Target, Clock,
    ChevronRight, Award, Globe, CreditCard, Eye,
    CheckCircle2, ListFilter, Wallet, MoreHorizontal,
    Plus, X, Download, Filter, Save, Loader2, Check,
    UserPlus, Mail, Phone, Activity, PieChart as PieChartIcon,
    Zap, ShieldCheck, Sparkles, Rocket, Calendar
} from 'lucide-react';
import { UserRole, DealStage, LeadStatus } from '../types';
// Cast motion to any to bypass environment-specific type definition issues
import { motion as motionAny, AnimatePresence } from 'framer-motion';
const motion = motionAny as any;

const DirectorDashboard: React.FC<{ store: any }> = ({ store }) => {
    const { data, currentUser, theme } = store;
    const isDark = theme === 'dark';

    // --- BUSINESS INTELLIGENCE CALCULATIONS ---

    const totalRevenue = useMemo(() => data.invoices.filter((i: any) => i.status === 'Paid').reduce((a: number, b: any) => a + b.amount, 0), [data.invoices]);
    const activeDealsValue = useMemo(() => data.deals.filter((d: any) => d.stage !== DealStage.CLOSED_WON && d.stage !== DealStage.CLOSED_LOST).reduce((a: number, b: any) => a + b.value, 0), [data.deals]);
    const conversionRate = useMemo(() => {
        const totalLeads = data.leads.length;
        const converted = data.leads.filter((l: any) => l.status === LeadStatus.CONVERTED).length;
        return totalLeads > 0 ? Math.round((converted / totalLeads) * 100) : 0;
    }, [data.leads]);

    const quarterlyGrowth = [
        { name: 'Q1', revenue: 450000, targets: 400000 },
        { name: 'Q2', revenue: 520000, targets: 480000 },
        { name: 'Q3', revenue: 480000, targets: 550000 },
        { name: 'Q4', revenue: 610000, targets: 580000 },
    ];

    const regionData = [
        { name: 'North America', value: 400 },
        { name: 'Europe', value: 300 },
        { name: 'APAC', value: 200 },
        { name: 'Middle East', value: 100 },
    ];

    const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b'];

    return (
        <div className="space-y-10 pb-20 overflow-hidden">
            {/* Dynamic Background Accents */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[120px] -mr-64 -mt-64 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-violet-500/5 rounded-full blur-[120px] -ml-64 -mb-64 pointer-events-none" />

            {/* Hero Header */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pt-6 relative z-10">
                <div>
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-1.5 bg-indigo-600 rounded-full" />
                        <span className="text-xs font-black text-indigo-600 uppercase tracking-[0.4em]">Executive Command Center</span>
                    </motion.div>
                    <h2 className="text-6xl font-black text-slate-900 dark:text-white tracking-tighter leading-none">
                        Director <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-500">Dashboard</span>
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 font-bold text-xl mt-4">
                        Harmonizing global sales velocity, training excellence, and operational health.
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <button className="px-8 py-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] font-black uppercase tracking-widest text-[10px] shadow-xl flex items-center gap-3 transition-all hover:bg-slate-50 dark:text-white">
                        <Calendar className="w-5 h-5 text-indigo-500" />
                        Annual Overview
                    </button>
                    <button className="px-8 py-5 bg-indigo-600 text-white rounded-[2.5rem] font-black uppercase tracking-widest text-[10px] shadow-2xl flex items-center gap-3 transition-all hover:bg-indigo-700 hover:scale-105 active:scale-95">
                        <Rocket className="w-5 h-5" />
                        Strategic Vision
                    </button>
                </div>
            </div>

            {/* Platinum Metric Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
                {[
                    { label: 'Total Enterprise Revenue', value: `$${(totalRevenue / 1000).toFixed(1)}k`, icon: <DollarSign className="w-6 h-6" />, delta: '+18.4%', color: 'indigo' },
                    { label: 'Pipeline Value', value: `$${(activeDealsValue / 1000).toFixed(1)}k`, icon: <Activity className="w-6 h-6" />, delta: '+5.2%', color: 'violet' },
                    { label: 'Lead Conversion', value: `${conversionRate}%`, icon: <Target className="w-6 h-6" />, delta: '+2.1%', color: 'emerald' },
                    { label: 'Market Velocity', value: '4.8x', icon: <Zap className="w-6 h-6" />, delta: 'Steady', color: 'amber' },
                ].map((stat, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        whileHover={{ y: -5 }}
                        className="glass p-10 rounded-[4rem] shadow-2xl border border-white/60 dark:border-white/5 relative overflow-hidden group"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700" />
                        <div className="flex items-start justify-between mb-10">
                            <div className={`p-5 rounded-3xl bg-${stat.color}-50 dark:bg-${stat.color}-500/10 text-${stat.color}-600`}>{stat.icon}</div>
                            <span className="text-[10px] font-black px-4 py-2 bg-emerald-100 text-emerald-600 rounded-full tracking-widest">
                                {stat.delta}
                            </span>
                        </div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 leading-none">{stat.label}</p>
                        <h3 className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter leading-none">{stat.value}</h3>
                    </motion.div>
                ))}
            </div>

            {/* Intelligence Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 relative z-10">
                {/* Main Growth Area Chart */}
                <div className="lg:col-span-2 glass p-12 rounded-[5rem] shadow-2xl border border-white/60 dark:border-white/5 overflow-hidden">
                    <div className="flex items-center justify-between mb-12">
                        <div>
                            <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Growth Trajectory</h3>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2 flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-indigo-500" /> Projected vs Actual Revenue
                            </p>
                        </div>
                        <div className="flex bg-slate-100 dark:bg-slate-800 p-2 rounded-2xl">
                            <button className="px-6 py-2 bg-white dark:bg-slate-700 rounded-xl text-[10px] font-black uppercase tracking-widest text-indigo-600 shadow-sm">Revenue</button>
                            <button className="px-6 py-2 text-slate-400 text-[10px] font-black uppercase tracking-widest hover:text-slate-600">Volume</button>
                        </div>
                    </div>
                    <div className="h-[450px] w-full mt-6">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={[
                                { m: 'Jan', v: 450000, t: 420000 }, { m: 'Feb', v: 490000, t: 450000 }, { m: 'Mar', v: 470000, t: 500000 },
                                { m: 'Apr', v: 550000, t: 520000 }, { m: 'May', v: 610000, t: 580000 }, { m: 'Jun', v: 680000, t: 650000 },
                                { m: 'Jul', v: 720000, t: 700000 }, { m: 'Aug', v: 780000, t: 750000 }, { m: 'Sep', v: 850000, t: 820000 },
                                { m: 'Oct', v: 920000, t: 880000 }, { m: 'Nov', v: 1100000, t: 950000 }, { m: 'Dec', v: 1250000, t: 1050000 }
                            ]}>
                                <defs>
                                    <linearGradient id="mainGrad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="10 10" vertical={false} stroke={isDark ? '#334155' : '#e2e8f0'} />
                                <XAxis dataKey="m" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 900 }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 900 }} tickFormatter={(v) => `$${v / 1000}k`} />
                                <Tooltip
                                    contentStyle={{
                                        borderRadius: '32px',
                                        backgroundColor: isDark ? '#0f172a' : '#fff',
                                        border: 'none',
                                        boxShadow: '0 40px 60px -15px rgba(0,0,0,0.15)',
                                        padding: '24px'
                                    }}
                                />
                                <Area type="monotone" dataKey="v" stroke="#6366f1" strokeWidth={8} fillOpacity={1} fill="url(#mainGrad)" dot={{ r: 10, fill: '#6366f1', strokeWidth: 5, stroke: isDark ? '#1e293b' : '#fff' }} />
                                <Area type="monotone" dataKey="t" stroke="#94a3b8" strokeWidth={3} strokeDasharray="10 10" fill="transparent" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Operational Health Side Panels */}
                <div className="space-y-10">
                    {/* Global Distribution */}
                    <div className="glass p-10 rounded-[4rem] shadow-2xl border border-white/60 dark:border-white/5">
                        <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight mb-10">Market Share</h3>
                        <div className="h-[250px] relative">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={regionData}
                                        innerRadius={70}
                                        outerRadius={100}
                                        paddingAngle={10}
                                        dataKey="value"
                                    >
                                        {regionData.map((e, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Total</p>
                                <p className="text-4xl font-black text-slate-900 dark:text-white leading-none">1.2k</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 mt-8">
                            {regionData.map((r, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{r.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Strategic Insight Card */}
                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="p-10 bg-indigo-600 rounded-[4rem] text-white shadow-2xl relative overflow-hidden group"
                    >
                        <div className="absolute top-0 right-0 p-8 opacity-20 group-hover:rotate-12 transition-transform duration-700">
                            <Sparkles className="w-16 h-16" />
                        </div>
                        <h4 className="text-2xl font-black tracking-tight mb-4">Director's Insight</h4>
                        <p className="text-indigo-100 font-medium text-lg leading-relaxed">
                            APAC region shows a 25% surge in retail training demand. Recommend reallocating 3 senior trainers by next sprint.
                        </p>
                        <button className="mt-8 px-8 py-3 bg-white text-indigo-700 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl hover:bg-emerald-400 hover:text-white transition-all">
                            Review Allocation
                        </button>
                    </motion.div>
                </div>
            </div>

            {/* Organizational Performance Table */}
            <div className="glass p-12 rounded-[5.5rem] shadow-2xl border border-white/60 dark:border-white/5 relative z-10">
                <div className="flex items-center justify-between mb-12">
                    <div>
                        <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Recent High-Value Activity</h3>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2 flex items-center gap-2">
                            Top 10 business events across all departments
                        </p>
                    </div>
                    <button className="text-[10px] font-black text-indigo-600 uppercase tracking-widest flex items-center gap-2 hover:gap-3 transition-all">
                        Deep Audit Registry <ChevronRight className="w-4 h-4" />
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-slate-100 dark:border-white/5">
                                <th className="pb-8 px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Stakeholder</th>
                                <th className="pb-8 px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Dimension</th>
                                <th className="pb-8 px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Magnitude</th>
                                <th className="pb-8 px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                                <th className="pb-8 px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Maturity</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 dark:divide-white/5">
                            {[
                                { boss: 'Global Core Inc', dim: 'Corporate Deal', val: '$245,000', status: 'In Final Negotiation', mate: '92%' },
                                { boss: 'Tech Academy P2', dim: 'Training Rollout', val: 'Over 500 Seats', status: 'Ongoing Deployment', mate: '45%' },
                                { boss: 'Sarah Jenkins', dim: 'Hiring Pipeline', val: 'Senior VP Sales', status: 'Offer Extension', mate: '100%' },
                                { boss: 'Finance Hub V4', dim: 'Invoicing Batch', val: '$1.2M Cluster', status: 'Partial Settlement', mate: '68%' },
                                { boss: 'Lead Gen Echo', dim: 'Marketing Campaign', val: '2.4k Qualified', status: 'Active Campaign', mate: '15%' },
                            ].map((row, i) => (
                                <tr key={i} className="group hover:bg-slate-50 dark:hover:bg-white/5 transition-all">
                                    <td className="py-8 px-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center text-indigo-600 font-black">
                                                {row.boss.charAt(0)}
                                            </div>
                                            <span className="text-lg font-black text-slate-800 dark:text-white leading-none">{row.boss}</span>
                                        </div>
                                    </td>
                                    <td className="py-8 px-4 font-bold text-slate-500 dark:text-slate-400">{row.dim}</td>
                                    <td className="py-8 px-4 font-black text-slate-900 dark:text-white">{row.val}</td>
                                    <td className="py-8 px-4">
                                        <span className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-[10px] font-black uppercase tracking-widest text-indigo-500">
                                            {row.status}
                                        </span>
                                    </td>
                                    <td className="py-8 px-4 text-right">
                                        <div className="flex items-center justify-end gap-3 font-black text-slate-900 dark:text-white">
                                            {row.mate}
                                            <div className="w-16 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: row.mate }}
                                                    className="h-full bg-indigo-600"
                                                />
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default DirectorDashboard;
