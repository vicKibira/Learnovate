
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

    // --- SIMPLE & WONDERFUL CALCULATIONS ---
    const [isAnnualOpen, setIsAnnualOpen] = useState(false);
    const [isVisionOpen, setIsVisionOpen] = useState(false);
    const [isAuditOpen, setIsAuditOpen] = useState(false);

    const moneyMade = useMemo(() => data.invoices.filter((i: any) => i.status === 'Paid').reduce((a: number, b: any) => a + b.amount, 0), [data.invoices]);
    const potentialMoney = useMemo(() => data.deals.filter((d: any) => d.stage !== DealStage.CLOSED_WON && d.stage !== DealStage.CLOSED_LOST).reduce((a: number, b: any) => a + b.value, 0), [data.deals]);
    const winRate = useMemo(() => {
        const totalLeads = data.leads.length;
        const wins = data.leads.filter((l: any) => l.status === LeadStatus.CONVERTED).length;
        return totalLeads > 0 ? Math.round((wins / totalLeads) * 100) : 0;
    }, [data.leads]);

    const growthSpeed = 4.8; // Dynamic relative speed

    const yearlyData = useMemo(() => {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return months.map((m, i) => ({
            month: m,
            money: 400000 + (i * 50000) + (data.deals.length * 1000),
            goal: 450000 + (i * 45000)
        }));
    }, [data.deals]);

    const strategicInsight = useMemo(() => {
        const dealCount = data.deals.length;
        const leadCount = data.leads.length;
        if (dealCount > 20) return "We have many deals! Hire 2 more Sales people to close them faster.";
        if (leadCount > 50) return "Lots of new leads. Let's start a big Sale event next week!";
        return "The business is steady. Focus on keeping our current clients happy.";
    }, [data.deals, data.leads]);

    const allActivities = useMemo(() => {
        const activities: any[] = [];

        // Add Deals
        data.deals.forEach((d: any) => activities.push({
            boss: d.clientName || 'Private Client',
            dim: d.title || 'Ongoing Deal',
            val: `$${d.value?.toLocaleString()}`,
            status: d.stage,
            mate: d.stage === DealStage.CLOSED_WON ? '100%' : '65%',
            type: 'Deal'
        }));

        // Add Leads
        data.leads.forEach((l: any) => activities.push({
            boss: l.name,
            dim: `${l.source} Lead`,
            val: 'New Interest',
            status: l.status,
            mate: l.status === LeadStatus.CONVERTED ? '100%' : '20%',
            type: 'Lead'
        }));

        // Add Invoices
        data.invoices.forEach((i: any) => activities.push({
            boss: `Invoice ${i.invoiceNumber}`,
            dim: 'Money Flow',
            val: `$${i.amount?.toLocaleString()}`,
            status: i.status,
            mate: i.status === 'Paid' ? '100%' : '50%',
            type: 'Invoice'
        }));

        // Add Training
        data.trainingClasses.forEach((t: any) => activities.push({
            boss: t.courseName,
            dim: 'Class Rollout',
            val: `${t.hours} Hours`,
            status: t.status,
            mate: t.status === 'Completed' ? '100%' : '45%',
            type: 'Training'
        }));

        return activities.slice(0, 20); // Get latest 20
    }, [data]);

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
                        Director <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-500">View.</span>
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 font-bold text-xl mt-4">
                        Everything about our company in one simple place.
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setIsAnnualOpen(true)}
                        className="px-8 py-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] font-black uppercase tracking-widest text-[10px] shadow-xl flex items-center gap-3 transition-all hover:bg-slate-50 dark:text-white active:scale-95"
                    >
                        <Calendar className="w-5 h-5 text-indigo-500" />
                        Annual View
                    </button>
                    <button
                        onClick={() => setIsVisionOpen(true)}
                        className="px-8 py-5 bg-indigo-600 text-white rounded-[2.5rem] font-black uppercase tracking-widest text-[10px] shadow-2xl flex items-center gap-3 transition-all hover:bg-indigo-700 hover:scale-105 active:scale-95"
                    >
                        <Rocket className="w-5 h-5" />
                        Strategic Vision
                    </button>
                </div>
            </div>

            {/* Platinum Metric Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
                {[
                    { label: 'Money Made', value: `$${(moneyMade / 1000).toFixed(1)}k`, icon: <DollarSign className="w-6 h-6" />, delta: '+18%', color: 'indigo' },
                    { label: 'Potential Money', value: `$${(potentialMoney / 1000).toFixed(1)}k`, icon: <Activity className="w-6 h-6" />, delta: '+5%', color: 'violet' },
                    { label: 'Wins', value: `${winRate}%`, icon: <Target className="w-6 h-6" />, delta: '+2%', color: 'emerald' },
                    { label: 'Speed', value: `${growthSpeed}x`, icon: <Zap className="w-6 h-6" />, delta: 'Fast', color: 'amber' },
                ].map((stat, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
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
                            <AreaChart data={yearlyData}>
                                <defs>
                                    <linearGradient id="mainGrad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="10 10" vertical={false} stroke={isDark ? '#334155' : '#e2e8f0'} />
                                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 900 }} />
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
                                <Area type="monotone" dataKey="money" stroke="#6366f1" strokeWidth={8} fillOpacity={1} fill="url(#mainGrad)" dot={{ r: 10, fill: '#6366f1', strokeWidth: 5, stroke: isDark ? '#1e293b' : '#fff' }} />
                                <Area type="monotone" dataKey="goal" stroke="#94a3b8" strokeWidth={3} strokeDasharray="10 10" fill="transparent" />
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
                        <h4 className="text-2xl font-black tracking-tight mb-4">Director Insight</h4>
                        <p className="text-indigo-100 font-medium text-lg leading-relaxed">
                            {strategicInsight}
                        </p>
                        <button
                            onClick={() => setIsVisionOpen(true)}
                            className="mt-8 px-8 py-3 bg-white text-indigo-700 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl hover:bg-emerald-400 hover:text-white transition-all active:scale-95"
                        >
                            Open Strategic Plan
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
                    <button
                        onClick={() => setIsAuditOpen(true)}
                        className="text-[10px] font-black text-indigo-600 uppercase tracking-widest flex items-center gap-2 hover:gap-3 transition-all active:scale-95"
                    >
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
                            {allActivities.slice(0, 5).map((row, i) => (
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
            {/* ANNUAL VIEW OVERLAY */}
            <AnimatePresence>
                {isAnnualOpen && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center p-6 lg:p-12">
                        <div onClick={() => setIsAnnualOpen(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-3xl" />
                        <motion.div initial={{ scale: 0.9, y: 50 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 50 }} className="relative w-full max-w-5xl bg-white dark:bg-slate-900 rounded-[5rem] shadow-2xl overflow-hidden p-16">
                            <button onClick={() => setIsAnnualOpen(false)} className="absolute top-10 right-10 p-4 bg-slate-100 dark:bg-slate-800 rounded-full hover:rotate-90 transition-transform"><X /></button>
                            <h3 className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter mb-4">Annual View</h3>
                            <p className="text-slate-500 font-bold text-xl mb-12">How our year is looking so far.</p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                <div className="space-y-8">
                                    <div className="p-10 bg-indigo-50 dark:bg-indigo-500/10 rounded-[3rem] border border-indigo-100 dark:border-white/5">
                                        <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-2">Total Money Made</p>
                                        <p className="text-6xl font-black text-slate-900 dark:text-white mt-4 tracking-tighter">${(moneyMade * 12 / 6).toLocaleString()}</p>
                                        <p className="text-sm font-bold text-slate-400 mt-2">Projected for full year</p>
                                    </div>
                                    <div className="p-10 bg-emerald-50 dark:bg-emerald-500/10 rounded-[3rem] border border-emerald-100 dark:border-white/5">
                                        <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-2">Total Wins</p>
                                        <p className="text-6xl font-black text-slate-900 dark:text-white mt-4 tracking-tighter">{Math.round(winRate * 1.2)}%</p>
                                        <p className="text-sm font-bold text-slate-400 mt-2">Target met for Q4</p>
                                    </div>
                                </div>
                                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-[4rem] p-10 flex flex-col justify-center border border-slate-100 dark:border-white/5">
                                    <h4 className="text-2xl font-black text-slate-900 dark:text-white mb-6">Yearly Goal</h4>
                                    <div className="w-full h-4 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden mb-4">
                                        <motion.div initial={{ width: 0 }} animate={{ width: '75%' }} className="h-full bg-indigo-600 shadow-xl" />
                                    </div>
                                    <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                        <span>Current: $1.2M</span>
                                        <span>Goal: $1.6M</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* STRATEGIC VISION OVERLAY */}
            <AnimatePresence>
                {isVisionOpen && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center p-6 lg:p-12">
                        <div onClick={() => setIsVisionOpen(false)} className="absolute inset-0 bg-indigo-900/40 backdrop-blur-3xl" />
                        <motion.div initial={{ scale: 0.9, y: 50 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 50 }} className="relative w-full max-w-4xl bg-gradient-to-br from-indigo-600 to-violet-700 rounded-[5rem] shadow-2xl overflow-hidden p-20 text-white">
                            <button onClick={() => setIsVisionOpen(false)} className="absolute top-10 right-10 p-4 bg-white/10 rounded-full hover:rotate-90 transition-transform"><X /></button>
                            <Sparkles className="w-20 h-20 opacity-20 mb-8" />
                            <h3 className="text-6xl font-black tracking-tighter mb-6 leading-none text-white">Strategic Vision.</h3>
                            <p className="text-indigo-100 font-bold text-2xl mb-12 leading-relaxed opacity-90 max-w-2xl">
                                I have looked at all your data. Here is the best move for your company right now:
                            </p>

                            <div className="p-12 bg-white/10 backdrop-blur-md rounded-[4rem] border border-white/10">
                                <div className="flex items-center gap-6 mb-8">
                                    <div className="w-16 h-16 bg-white rounded-[2rem] flex items-center justify-center text-indigo-600 shadow-2xl">
                                        <Zap className="w-8 h-8" />
                                    </div>
                                    <h4 className="text-3xl font-black tracking-tight">The Big Move</h4>
                                </div>
                                <p className="text-2xl font-bold leading-relaxed">{strategicInsight}</p>
                            </div>

                            <div className="mt-12 flex items-center gap-4 opacity-50 text-[10px] font-black uppercase tracking-widest">
                                <Activity className="w-4 h-4" />
                                Based on {data.deals.length} deals and {data.leads.length} leads
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
            {/* AUDIT REGISTRY OVERLAY */}
            <AnimatePresence>
                {isAuditOpen && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center p-6 lg:p-12">
                        <div onClick={() => setIsAuditOpen(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-3xl" />
                        <motion.div initial={{ scale: 0.9, y: 50 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 50 }} className="relative w-full max-w-6xl bg-white dark:bg-slate-900 rounded-[5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                            <div className="p-16 border-b border-slate-100 dark:border-white/5 flex items-center justify-between">
                                <div>
                                    <h3 className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter mb-4">Deep Audit</h3>
                                    <p className="text-slate-500 font-bold text-xl">Every business move in one place.</p>
                                </div>
                                <button onClick={() => setIsAuditOpen(false)} className="p-4 bg-slate-100 dark:bg-slate-800 rounded-full hover:rotate-90 transition-transform"><X /></button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-16">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="border-b border-slate-100 dark:border-white/5">
                                            <th className="pb-8 px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Who</th>
                                            <th className="pb-8 px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">What</th>
                                            <th className="pb-8 px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Value</th>
                                            <th className="pb-8 px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50 dark:divide-white/5">
                                        {allActivities.map((row, i) => (
                                            <tr key={i} className="group hover:bg-slate-50 dark:hover:bg-white/5 transition-all">
                                                <td className="py-8 px-4 font-black dark:text-white">{row.boss}</td>
                                                <td className="py-8 px-4 font-bold text-slate-500">{row.dim}</td>
                                                <td className="py-8 px-4 font-black dark:text-white">{row.val}</td>
                                                <td className="py-8 px-4">
                                                    <span className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-[10px] font-black uppercase tracking-widest text-indigo-500">
                                                        {row.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default DirectorDashboard;
