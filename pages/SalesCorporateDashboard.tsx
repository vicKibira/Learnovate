
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
    UserPlus, Mail, Phone, Activity, Search,
    Zap, Star, ShoppingBag, Gift, Calendar, Sparkles,
    MousePointer2, Flame, BookOpen, Tag, Building2
} from 'lucide-react';
import { UserRole, LeadStatus, DealStage } from '../types';
// Cast motion to any to bypass environment-specific type definition issues
import { motion as motionAny, AnimatePresence } from 'framer-motion';
const motion = motionAny as any;

const SalesCorporateDashboard: React.FC<{ store: any }> = ({ store }) => {
    const { data, currentUser, theme, addLead, createDealFromLead } = store;
    const isDark = theme === 'dark';

    // --- STATE ---
    const [searchQuery, setSearchQuery] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [newCorporate, setNewCorporate] = useState({
        name: '',
        email: '',
        phone: '',
        company: '',
        course: 'Big AI Plan',
        price: '15000'
    });

    // --- CORPORATE PERFORMANCE CALCULATIONS ---

    const personalCorporateDeals = useMemo(() => {
        return data.deals.filter((d: any) =>
            d.type === 'Corporate' &&
            d.assignedTo === currentUser.id &&
            (d.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                d.title.toLowerCase().includes(searchQuery.toLowerCase()))
        );
    }, [data.deals, currentUser.id, searchQuery]);

    const personalRevenue = useMemo(() => {
        return data.deals
            .filter((d: any) => d.type === 'Corporate' && d.assignedTo === currentUser.id && d.isPaid)
            .reduce((a: number, b: any) => a + b.value, 0);
    }, [data.deals, currentUser.id]);

    const activeLeads = useMemo(() => {
        return data.leads.filter((l: any) =>
            l.type === 'Corporate' &&
            l.assignedTo === currentUser.id &&
            l.status !== LeadStatus.CONVERTED
        );
    }, [data.leads, currentUser.id]);

    const estimatedCommission = useMemo(() => Math.round(personalRevenue * 0.08), [personalRevenue]);

    const monthlySales = [
        { name: 'Jan', sales: 45000, target: 40000 },
        { name: 'Feb', sales: 52000, target: 45000 },
        { name: 'Mar', sales: 48000, target: 50000 },
        { name: 'Apr', sales: 65000, target: 55000 },
        { name: 'May', sales: 72000, target: 60000 },
        { name: 'Jun', sales: 85000, target: 70000 },
    ];

    const categories = [
        { name: 'Cloud Work', value: 40, color: '#6366f1' },
        { name: 'Safety Work', value: 25, color: '#10b981' },
        { name: 'Team Work', value: 20, color: '#f59e0b' },
        { name: 'AI Work', value: 15, color: '#ec4899' },
    ];

    const handleAddSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const lead = addLead({
            name: newCorporate.name,
            email: newCorporate.email,
            phone: newCorporate.phone,
            source: 'Referral',
            type: 'Corporate',
            company: newCorporate.company,
            status: LeadStatus.NEW,
            assignedTo: currentUser.id
        });

        if (newCorporate.price && parseFloat(newCorporate.price) > 0) {
            createDealFromLead(lead.id, parseFloat(newCorporate.price));
        }

        setShowAddModal(false);
        setNewCorporate({ name: '', email: '', phone: '', company: '', course: 'Big AI Plan', price: '15000' });
    };

    return (
        <div className="space-y-12 pb-24 relative min-h-screen font-sans">
            {/* Background Decor */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-10%] right-[-5%] w-[700px] h-[700px] bg-indigo-500/10 dark:bg-indigo-600/5 rounded-full blur-[140px] animate-pulse" />
                <div className="absolute bottom-[-10%] left-[-5%] w-[700px] h-[700px] bg-emerald-500/10 dark:bg-emerald-600/5 rounded-full blur-[150px] animate-pulse" style={{ animationDelay: '2s' }} />
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
                            <Building2 className="w-3 h-3 animate-bounce" /> Big Sales
                        </span>
                        <span className="h-0.5 w-12 bg-slate-200 dark:bg-slate-800 rounded-full" />
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Company Sales</span>
                    </motion.div>
                    <h2 className="text-7xl font-black text-slate-900 dark:text-white tracking-tighter leading-[0.9] mb-4">
                        More <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-400 to-emerald-500 animate-gradient-x">Sales.</span>
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 font-bold text-xl leading-relaxed tracking-tight">
                        See your big sales and find your companies.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-6">
                    <div className="relative group">
                        <Search className="w-5 h-5 absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-all duration-500" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Find company..."
                            className="pl-16 pr-10 py-6 bg-white/40 dark:bg-slate-900/40 backdrop-blur-3xl border border-white/50 dark:border-white/5 rounded-[3rem] font-bold text-sm shadow-[0_20px_50px_rgba(0,0,0,0.05)] outline-none focus:ring-4 focus:ring-indigo-500/10 focus:bg-white dark:focus:bg-slate-900 transition-all dark:text-white w-72"
                        />
                    </div>
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="group relative px-10 py-6 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-[3rem] font-black uppercase tracking-widest text-[10px] shadow-2xl transition-all hover:scale-105 active:scale-95 flex items-center gap-4 overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <Plus className="w-5 h-5 relative z-10 group-hover:rotate-90 transition-transform duration-500" />
                        <span className="relative z-10 group-hover:translate-x-1 transition-transform">Add Company</span>
                    </button>
                </div>
            </div>

            {/* Metrics Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10 px-2 mt-12">
                {[
                    { label: 'Total Money', value: `$${(personalRevenue / 1000).toFixed(1)}k`, icon: <DollarSign className="w-6 h-6" />, delta: 'High', color: 'indigo', bg: 'from-indigo-500 to-purple-400' },
                    { label: 'My Pay', value: `$${(estimatedCommission / 1000).toFixed(1)}k`, icon: <Wallet className="w-6 h-6" />, delta: '+15%', color: 'emerald', bg: 'from-emerald-500 to-teal-400' },
                    { label: 'My Goal', value: '88%', icon: <Target className="w-6 h-6" />, delta: 'Closing', color: 'amber', bg: 'from-amber-500 to-orange-400' },
                    { label: 'Big People', value: activeLeads.length, icon: <Globe className="w-6 h-6" />, delta: 'Growing', color: 'violet', bg: 'from-violet-500 to-fuchsia-400' },
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
                                <span className={`text-[9px] font-black px-4 py-1.5 rounded-full tracking-widest uppercase border transition-all ${stat.color === 'indigo' ? 'bg-indigo-50 dark:bg-indigo-500/10 border-indigo-500/20 text-indigo-600' :
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
                                    animate={{ width: '85%' }}
                                    className={`h-full bg-gradient-to-r ${stat.bg}`}
                                />
                            </div>
                            <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Speed</span>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Progress & Portfolio */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 px-2 relative z-10 mt-12">
                <div className="lg:col-span-2 relative">
                    <div className="absolute inset-x-0 -top-6 h-[0.5px] bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-800 to-transparent" />
                    <div className="p-12 bg-white/50 dark:bg-slate-900/50 backdrop-blur-3xl rounded-[5rem] border border-white dark:border-white/5 shadow-2xl">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-16 gap-6">
                            <div>
                                <h3 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter mb-2">My Progress</h3>
                                <div className="flex items-center gap-3">
                                    <div className="w-3 h-3 rounded-full bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.5)]" />
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">How I sold this year</p>
                                </div>
                            </div>
                        </div>

                        <div className="h-[480px] w-full mt-4">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={monthlySales}>
                                    <defs>
                                        <linearGradient id="glowCorporate" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.5} />
                                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="12 12" vertical={false} stroke={isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)'} />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 900 }} dy={20} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 900 }} tickFormatter={(v) => `$${v / 1000}k`} />
                                    <Tooltip
                                        cursor={{ stroke: '#6366f1', strokeWidth: 2, strokeDasharray: '5 5' }}
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
                                        dataKey="sales"
                                        stroke="#6366f1"
                                        strokeWidth={10}
                                        fillOpacity={1}
                                        fill="url(#glowCorporate)"
                                        dot={{ r: 12, fill: '#6366f1', strokeWidth: 6, stroke: isDark ? '#0f172a' : '#fff' }}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                <div className="space-y-12">
                    <div className="p-12 bg-white/40 dark:bg-slate-900/40 backdrop-blur-3xl rounded-[5rem] border border-white dark:border-white/5 shadow-2xl relative overflow-hidden group">
                        <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter mb-12">My Work</h3>
                        <div className="h-[280px] relative">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={categories}
                                        innerRadius={85}
                                        outerRadius={115}
                                        paddingAngle={12}
                                        dataKey="value"
                                        stroke="none"
                                    >
                                        {categories.map((c, i) => <Cell key={i} fill={c.color} />)}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] leading-none mb-2">Up</p>
                                <p className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter leading-none">Big</p>
                            </div>
                        </div>
                    </div>

                    <motion.div
                        whileHover={{ scale: 1.03, rotate: -1 }}
                        className="relative p-12 bg-gradient-to-br from-emerald-600 via-teal-700 to-indigo-800 rounded-[5rem] text-white shadow-[0_30px_70px_rgba(16,185,129,0.3)] group overflow-hidden"
                    >
                        <h4 className="text-3xl font-black tracking-tighter mb-4 leading-tight text-white">Look <br />Here.</h4>
                        <p className="text-emerald-50 font-bold text-lg leading-relaxed mb-10 opacity-90">
                            Big companies want cloud work. Check your 3 new messages.
                        </p>
                        <button className="w-full py-6 bg-white text-emerald-700 rounded-[2rem] font-black uppercase tracking-widest text-[10px] shadow-2xl hover:bg-slate-900 hover:text-white transition-all transform hover:-translate-y-1">
                            Go Now
                        </button>
                    </motion.div>
                </div>
            </div>

            {/* Corporate Deals List */}
            <div className="relative z-10 px-2 mt-16 pb-12">
                <div className="bg-white/30 dark:bg-slate-900/30 backdrop-blur-3xl rounded-[6rem] border border-white dark:border-white/5 shadow-2xl overflow-hidden p-1">
                    <div className="p-16">
                        <h3 className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter leading-none mb-4">My Big Companies.</h3>
                        <p className="text-slate-400 font-bold text-lg tracking-tight">Big companies you are talking to right now.</p>
                    </div>

                    <div className="overflow-x-auto px-10 pb-16">
                        <table className="w-full text-left min-w-[800px]">
                            <thead>
                                <tr className="border-b border-slate-100 dark:border-white/5">
                                    <th className="pb-10 px-8 text-[11px] font-black text-slate-400 uppercase tracking-[0.3em]">Name</th>
                                    <th className="pb-10 px-8 text-[11px] font-black text-slate-400 uppercase tracking-[0.3em]">Plan</th>
                                    <th className="pb-10 px-8 text-[11px] font-black text-slate-400 uppercase tracking-[0.3em]">Price</th>
                                    <th className="pb-10 px-8 text-[11px] font-black text-slate-400 uppercase tracking-[0.3em]">Stage</th>
                                    <th className="pb-10 px-8 text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] text-right">Chance</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100/30 dark:divide-white/5">
                                {personalCorporateDeals.map((deal, i) => (
                                    <motion.tr key={i} className="group hover:bg-white/80 dark:hover:bg-white/5 transition-all duration-500 cursor-pointer">
                                        <td className="py-10 px-8">
                                            <div className="flex items-center gap-5">
                                                <div className="w-16 h-16 rounded-[2rem] bg-gradient-to-br from-indigo-100 to-indigo-200 dark:from-indigo-800 dark:to-indigo-700 flex items-center justify-center text-indigo-900 dark:text-white font-black text-xl shadow-lg ring-4 ring-white dark:ring-slate-900 group-hover:scale-110 transition-transform">
                                                    {deal.clientName.charAt(0)}
                                                </div>
                                                <div>
                                                    <span className="text-xl font-black text-slate-900 dark:text-white tracking-tighter leading-none block mb-2">{deal.clientName}</span>
                                                    <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest flex items-center gap-2">Big Company</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-10 px-8 font-black text-slate-400 text-lg uppercase italic">{deal.title.split('-')[1] || 'Big Plan'}</td>
                                        <td className="py-10 px-8 font-black text-2xl text-slate-900 dark:text-white">${deal.value.toLocaleString()}</td>
                                        <td className="py-10 px-8">
                                            <div className={`inline-flex px-6 py-2.5 rounded-3xl text-[10px] font-black uppercase tracking-[0.2em] shadow-sm ${deal.stage === DealStage.CLOSED_WON ? 'bg-indigo-500 text-white' : 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'}`}>
                                                {deal.stage.split(' ')[0]}
                                            </div>
                                        </td>
                                        <td className="py-10 px-8 text-right">
                                            <div className="flex items-center justify-end gap-6 font-black text-xl text-slate-900 dark:text-white">
                                                {deal.stage === DealStage.CLOSED_WON ? '100' : '75'}%
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                                {personalCorporateDeals.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="py-32 text-center text-slate-400 font-bold italic text-xl tracking-tight opacity-50">
                                            No companies found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Refined Add Company Modal */}
            <AnimatePresence>
                {showAddModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowAddModal(false)} className="absolute inset-0 bg-white/40 dark:bg-black/80 backdrop-blur-2xl" />

                        <motion.div initial={{ opacity: 0, scale: 0.95, y: 30 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 30 }} className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-[5rem] shadow-[0_50px_100px_rgba(0,0,0,0.3)] overflow-hidden border border-white dark:border-white/5">
                            <div className="p-14 border-b border-slate-100 dark:border-white/5 flex items-center justify-between">
                                <div>
                                    <h3 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">New Big Customer</h3>
                                    <p className="text-slate-400 font-bold text-sm mt-1">Add a new big customer.</p>
                                </div>
                                <button onClick={() => setShowAddModal(false)} className="p-5 hover:bg-slate-50 dark:hover:bg-white/5 rounded-[2rem] transition-all group">
                                    <X className="w-8 h-8 text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white group-hover:rotate-90 transition-all" />
                                </button>
                            </div>

                            <form onSubmit={handleAddSubmit} className="p-14 space-y-10 group">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                    <div className="space-y-4">
                                        <label className="flex items-center gap-3 text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                                            <Users className="w-4 h-4 text-indigo-500" /> Person Name
                                        </label>
                                        <input required type="text" value={newCorporate.name} onChange={e => setNewCorporate({ ...newCorporate, name: e.target.value })} className="w-full px-8 py-6 bg-slate-50 dark:bg-slate-800/50 border-none rounded-[2rem] outline-none font-black focus:ring-4 focus:ring-indigo-500/10 dark:text-white text-lg placeholder:text-slate-300 dark:placeholder:text-slate-700" placeholder="e.g. John" />
                                    </div>

                                    <div className="space-y-4">
                                        <label className="flex items-center gap-3 text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                                            <Building2 className="w-4 h-4 text-emerald-500" /> Company Name
                                        </label>
                                        <input required type="text" value={newCorporate.company} onChange={e => setNewCorporate({ ...newCorporate, company: e.target.value })} className="w-full px-8 py-6 bg-slate-50 dark:bg-slate-800/50 border-none rounded-[2rem] outline-none font-black focus:ring-4 focus:ring-emerald-500/10 dark:text-white text-lg placeholder:text-slate-300 dark:placeholder:text-slate-700" placeholder="Big Co." />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <label className="flex items-center gap-3 text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                                        <BookOpen className="w-4 h-4 text-violet-500" /> Plan
                                    </label>
                                    <select
                                        value={newCorporate.course}
                                        onChange={e => setNewCorporate({ ...newCorporate, course: e.target.value })}
                                        className="w-full px-8 py-6 bg-slate-50 dark:bg-slate-800/50 border-none rounded-[2rem] outline-none font-black focus:ring-4 focus:ring-violet-500/10 dark:text-white text-lg appearance-none cursor-pointer"
                                    >
                                        <option value="Big AI Plan">Big AI Plan</option>
                                        <option value="Cloud Safety">Cloud Safety</option>
                                        <option value="Big Tech Plan">Big Tech Plan</option>
                                        <option value="Big Data Plan">Big Data Plan</option>
                                    </select>
                                </div>

                                <div className="space-y-4">
                                    <label className="flex items-center gap-3 text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                                        <DollarSign className="w-4 h-4 text-emerald-500" /> Price ($)
                                    </label>
                                    <div className="relative">
                                        <DollarSign className="w-6 h-6 absolute left-8 top-1/2 -translate-y-1/2 text-slate-300" />
                                        <input required type="number" value={newCorporate.price} onChange={e => setNewCorporate({ ...newCorporate, price: e.target.value })} className="w-full pl-16 pr-8 py-6 bg-slate-50 dark:bg-slate-800/50 border-none rounded-[2rem] outline-none font-black focus:ring-4 focus:ring-emerald-500/10 dark:text-white text-lg placeholder:text-slate-300 dark:placeholder:text-slate-700" placeholder="15000" />
                                    </div>
                                </div>

                                <div className="pt-6">
                                    <button type="submit" className="group relative w-full py-8 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-[2.5rem] font-black text-xs uppercase tracking-[0.4em] shadow-2xl transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-4 overflow-hidden">
                                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-emerald-500 opacity-0 group-hover:opacity-100 transition-all duration-700" />
                                        <Save className="w-5 h-5 relative z-10 group-hover:scale-110 transition-transform" />
                                        <span className="relative z-10">Save Big Customer</span>
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default SalesCorporateDashboard;
