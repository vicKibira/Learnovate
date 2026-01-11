
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
    MousePointer2, Flame, BookOpen, Tag
} from 'lucide-react';
import { UserRole, LeadStatus, DealStage } from '../types';
// Cast motion to any to bypass environment-specific type definition issues
import { motion as motionAny, AnimatePresence } from 'framer-motion';
const motion = motionAny as any;

const SalesRetailDashboard: React.FC<{ store: any }> = ({ store }) => {
    const { data, currentUser, theme, addLead, createDealFromLead } = store;
    const isDark = theme === 'dark';

    // --- STATE ---
    const [searchQuery, setSearchQuery] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [newCustomer, setNewCustomer] = useState({
        name: '',
        email: '',
        phone: '',
        course: 'Python Mastery',
        price: '1500'
    });

    // --- RETAIL PERFORMANCE CALCULATIONS ---

    const personalRetailDeals = useMemo(() => {
        return data.deals.filter((d: any) =>
            d.type === 'Retail' &&
            d.assignedTo === currentUser.id &&
            (d.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                d.title.toLowerCase().includes(searchQuery.toLowerCase()))
        );
    }, [data.deals, currentUser.id, searchQuery]);

    const personalRevenue = useMemo(() => {
        return data.deals
            .filter((d: any) => d.type === 'Retail' && d.assignedTo === currentUser.id && d.isPaid)
            .reduce((a: number, b: any) => a + b.value, 0);
    }, [data.deals, currentUser.id]);

    const activeLeads = useMemo(() => {
        return data.leads.filter((l: any) =>
            l.type === 'Retail' &&
            l.assignedTo === currentUser.id &&
            l.status !== LeadStatus.CONVERTED
        );
    }, [data.leads, currentUser.id]);

    const estimatedCommission = useMemo(() => Math.round(personalRevenue * 0.05), [personalRevenue]);

    const monthlySales = [
        { name: 'Jan', sales: 12400, target: 10000 },
        { name: 'Feb', sales: 15800, target: 12000 },
        { name: 'Mar', sales: 18200, target: 15000 },
        { name: 'Apr', sales: 22500, target: 20000 },
        { name: 'May', sales: 25100, target: 22000 },
        { name: 'Jun', sales: 28900, target: 25000 },
    ];

    const categories = [
        { name: 'Computers', value: 45, color: '#6366f1' },
        { name: 'Websites', value: 30, color: '#10b981' },
        { name: 'Programs', value: 15, color: '#f59e0b' },
        { name: 'AI Work', value: 10, color: '#ec4899' },
    ];

    const handleAddSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const lead = addLead({
            name: newCustomer.name,
            email: newCustomer.email,
            phone: newCustomer.phone,
            source: 'Call',
            type: 'Retail',
            company: newCustomer.course,
            status: LeadStatus.NEW,
            assignedTo: currentUser.id
        });

        if (newCustomer.price && parseFloat(newCustomer.price) > 0) {
            createDealFromLead(lead.id, parseFloat(newCustomer.price));
        }

        setShowAddModal(false);
        setNewCustomer({ name: '', email: '', phone: '', course: 'Python Mastery', price: '1500' });
    };

    return (
        <div className="space-y-12 pb-24 relative min-h-screen font-sans">
            {/* Background Decor */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-emerald-500/10 dark:bg-emerald-600/5 rounded-full blur-[140px] animate-pulse" />
                <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-blue-500/10 dark:bg-blue-600/5 rounded-full blur-[150px] animate-pulse" style={{ animationDelay: '2s' }} />
            </div>

            {/* Header */}
            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-10 pt-10 px-2">
                <div className="max-w-2xl">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-3 mb-6"
                    >
                        <span className="flex items-center gap-2 px-4 py-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full text-[10px] font-black uppercase tracking-[0.3em] border border-emerald-500/20">
                            <Flame className="w-3 h-3 animate-bounce" /> Good Job
                        </span>
                        <span className="h-0.5 w-12 bg-slate-200 dark:bg-slate-800 rounded-full" />
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Sales Overview</span>
                    </motion.div>
                    <h2 className="text-7xl font-black text-slate-900 dark:text-white tracking-tighter leading-[0.9] mb-4">
                        My <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 via-teal-400 to-indigo-500 animate-gradient-x">Sales.</span>
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 font-bold text-xl leading-relaxed tracking-tight">
                        See how much you sold and find your customers.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-6">
                    <div className="relative group">
                        <Search className="w-5 h-5 absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-all duration-500" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Find customer..."
                            className="pl-16 pr-10 py-6 bg-white/40 dark:bg-slate-900/40 backdrop-blur-3xl border border-white/50 dark:border-white/5 rounded-[3rem] font-bold text-sm shadow-[0_20px_50px_rgba(0,0,0,0.05)] outline-none focus:ring-4 focus:ring-emerald-500/10 focus:bg-white dark:focus:bg-slate-900 transition-all dark:text-white w-72"
                        />
                    </div>
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="group relative px-10 py-6 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-[3rem] font-black uppercase tracking-widest text-[10px] shadow-2xl transition-all hover:scale-105 active:scale-95 flex items-center gap-4 overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <Plus className="w-5 h-5 relative z-10 group-hover:rotate-90 transition-transform duration-500" />
                        <span className="relative z-10 group-hover:translate-x-1 transition-transform">Add Customer</span>
                    </button>
                </div>
            </div>

            {/* Metrics Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10 px-2 mt-12">
                {[
                    { label: 'Total Money', value: `$${(personalRevenue / 1000).toFixed(1)}k`, icon: <DollarSign className="w-6 h-6" />, delta: 'High', color: 'emerald', bg: 'from-emerald-500 to-teal-400' },
                    { label: 'My Pay', value: `$${(estimatedCommission / 1000).toFixed(1)}k`, icon: <Wallet className="w-6 h-6" />, delta: 'Bonus', color: 'indigo', bg: 'from-indigo-500 to-blue-400' },
                    { label: 'My Goal', value: '94%', icon: <Target className="w-6 h-6" />, delta: 'Almost Done', color: 'amber', bg: 'from-amber-500 to-orange-400' },
                    { label: 'Active People', value: activeLeads.length, icon: <Activity className="w-6 h-6" />, delta: 'Busy', color: 'violet', bg: 'from-violet-500 to-purple-400' },
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
                                    animate={{ width: '70%' }}
                                    className={`h-full bg-gradient-to-r ${stat.bg}`}
                                />
                            </div>
                            <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Speed</span>
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
                                <h3 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter mb-2">My Progress</h3>
                                <div className="flex items-center gap-3">
                                    <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]" />
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">How I sold this year</p>
                                </div>
                            </div>
                        </div>

                        <div className="h-[480px] w-full mt-4">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={monthlySales}>
                                    <defs>
                                        <linearGradient id="glowSales" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.5} />
                                            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="12 12" vertical={false} stroke={isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)'} />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 900 }} dy={20} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 900 }} tickFormatter={(v) => `$${v / 1000}k`} />
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
                                        dataKey="sales"
                                        stroke="#10b981"
                                        strokeWidth={10}
                                        fillOpacity={1}
                                        fill="url(#glowSales)"
                                        dot={{ r: 12, fill: '#10b981', strokeWidth: 6, stroke: isDark ? '#0f172a' : '#fff' }}
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
                                <p className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter leading-none">+18</p>
                            </div>
                        </div>
                    </div>

                    <motion.div
                        whileHover={{ scale: 1.03, rotate: -1 }}
                        className="relative p-12 bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-800 rounded-[5rem] text-white shadow-[0_30px_70px_rgba(79,70,229,0.3)] group overflow-hidden"
                    >
                        <h4 className="text-3xl font-black tracking-tighter mb-4 leading-tight text-white">Look <br />Here.</h4>
                        <p className="text-indigo-100 font-bold text-lg leading-relaxed mb-10 opacity-90">
                            People are buying Python courses. You have 4 new messages.
                        </p>
                        <button className="w-full py-6 bg-white text-indigo-700 rounded-[2rem] font-black uppercase tracking-widest text-[10px] shadow-2xl hover:bg-emerald-400 hover:text-white transition-all transform hover:-translate-y-1">
                            Go Now
                        </button>
                    </motion.div>
                </div>
            </div>

            {/* Customer List */}
            <div className="relative z-10 px-2 mt-16 pb-12">
                <div className="bg-white/30 dark:bg-slate-900/30 backdrop-blur-3xl rounded-[6rem] border border-white dark:border-white/5 shadow-2xl overflow-hidden p-1">
                    <div className="p-16">
                        <h3 className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter leading-none mb-4">My Customers.</h3>
                        <p className="text-slate-400 font-bold text-lg tracking-tight">People you are talking to right now.</p>
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
                                {personalRetailDeals.map((deal, i) => (
                                    <motion.tr key={i} className="group hover:bg-white/80 dark:hover:bg-white/5 transition-all duration-500 cursor-pointer">
                                        <td className="py-10 px-8">
                                            <div className="flex items-center gap-5">
                                                <div className="w-16 h-16 rounded-[2rem] bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 flex items-center justify-center text-slate-900 dark:text-white font-black text-xl shadow-lg ring-4 ring-white dark:ring-slate-900 group-hover:scale-110 transition-transform">
                                                    {deal.clientName.charAt(0)}
                                                </div>
                                                <div>
                                                    <span className="text-xl font-black text-slate-900 dark:text-white tracking-tighter leading-none block mb-2">{deal.clientName}</span>
                                                    <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest flex items-center gap-2">Talking</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-10 px-8 font-black text-slate-400 text-lg uppercase italic">{deal.title.split('-')[1] || 'Course'}</td>
                                        <td className="py-10 px-8 font-black text-2xl text-slate-900 dark:text-white">${deal.value.toLocaleString()}</td>
                                        <td className="py-10 px-8">
                                            <div className={`inline-flex px-6 py-2.5 rounded-3xl text-[10px] font-black uppercase tracking-[0.2em] shadow-sm ${deal.stage === DealStage.CLOSED_WON ? 'bg-emerald-500 text-white' : 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'}`}>
                                                {deal.stage.split(' ')[0]}
                                            </div>
                                        </td>
                                        <td className="py-10 px-8 text-right">
                                            <div className="flex items-center justify-end gap-6 font-black text-xl text-slate-900 dark:text-white">
                                                {deal.stage === DealStage.CLOSED_WON ? '100' : '82'}%
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                                {personalRetailDeals.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="py-32 text-center text-slate-400 font-bold italic text-xl tracking-tight opacity-50">
                                            No people found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Senior-Refined Add Customer Modal */}
            <AnimatePresence>
                {showAddModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowAddModal(false)} className="absolute inset-0 bg-white/40 dark:bg-black/80 backdrop-blur-2xl" />

                        <motion.div initial={{ opacity: 0, scale: 0.95, y: 30 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 30 }} className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-[5rem] shadow-[0_50px_100px_rgba(0,0,0,0.3)] overflow-hidden border border-white dark:border-white/5">
                            <div className="p-14 border-b border-slate-100 dark:border-white/5 flex items-center justify-between">
                                <div>
                                    <h3 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">New Sale</h3>
                                    <p className="text-slate-400 font-bold text-sm mt-1">Register a person and their interest.</p>
                                </div>
                                <button onClick={() => setShowAddModal(false)} className="p-5 hover:bg-slate-50 dark:hover:bg-white/5 rounded-[2rem] transition-all group">
                                    <X className="w-8 h-8 text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white group-hover:rotate-90 transition-all" />
                                </button>
                            </div>

                            <form onSubmit={handleAddSubmit} className="p-14 space-y-10 group">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                    <div className="space-y-4">
                                        <label className="flex items-center gap-3 text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                                            <Users className="w-4 h-4 text-emerald-500" /> Client Name
                                        </label>
                                        <input required type="text" value={newCustomer.name} onChange={e => setNewCustomer({ ...newCustomer, name: e.target.value })} className="w-full px-8 py-6 bg-slate-50 dark:bg-slate-800/50 border-none rounded-[2rem] outline-none font-black focus:ring-4 focus:ring-emerald-500/10 dark:text-white text-lg placeholder:text-slate-300 dark:placeholder:text-slate-700" placeholder="e.g. Joy" />
                                    </div>

                                    <div className="space-y-4">
                                        <label className="flex items-center gap-3 text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                                            <Tag className="w-4 h-4 text-indigo-500" /> Phone No.
                                        </label>
                                        <input required type="tel" value={newCustomer.phone} onChange={e => setNewCustomer({ ...newCustomer, phone: e.target.value })} className="w-full px-8 py-6 bg-slate-50 dark:bg-slate-800/50 border-none rounded-[2rem] outline-none font-black focus:ring-4 focus:ring-indigo-500/10 dark:text-white text-lg placeholder:text-slate-300 dark:placeholder:text-slate-700" placeholder="0123 456 789" />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <label className="flex items-center gap-3 text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                                        <BookOpen className="w-4 h-4 text-violet-500" /> Chosen Plan / Course
                                    </label>
                                    <select
                                        value={newCustomer.course}
                                        onChange={e => setNewCustomer({ ...newCustomer, course: e.target.value })}
                                        className="w-full px-8 py-6 bg-slate-50 dark:bg-slate-800/50 border-none rounded-[2rem] outline-none font-black focus:ring-4 focus:ring-violet-500/10 dark:text-white text-lg appearance-none cursor-pointer"
                                    >
                                        <option value="Python Mastery">Python Mastery</option>
                                        <option value="Web Design Pro">Web Design Pro</option>
                                        <option value="Data Science 101">Data Science 101</option>
                                        <option value="AI Engineering">AI Engineering</option>
                                        <option value="Full-stack Mastery">Full-stack Mastery</option>
                                    </select>
                                </div>

                                <div className="space-y-4">
                                    <label className="flex items-center gap-3 text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                                        <DollarSign className="w-4 h-4 text-emerald-500" /> Agreed Price ($)
                                    </label>
                                    <div className="relative">
                                        <DollarSign className="w-6 h-6 absolute left-8 top-1/2 -translate-y-1/2 text-slate-300" />
                                        <input required type="number" value={newCustomer.price} onChange={e => setNewCustomer({ ...newCustomer, price: e.target.value })} className="w-full pl-16 pr-8 py-6 bg-slate-50 dark:bg-slate-800/50 border-none rounded-[2rem] outline-none font-black focus:ring-4 focus:ring-emerald-500/10 dark:text-white text-lg placeholder:text-slate-300 dark:placeholder:text-slate-700" placeholder="1500" />
                                    </div>
                                </div>

                                <div className="pt-6">
                                    <button type="submit" className="group relative w-full py-8 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-[2.5rem] font-black text-xs uppercase tracking-[0.4em] shadow-2xl transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-4 overflow-hidden">
                                        <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-teal-500 opacity-0 group-hover:opacity-100 transition-all duration-700" />
                                        <Save className="w-5 h-5 relative z-10 group-hover:scale-110 transition-transform" />
                                        <span className="relative z-10">Confirm Sale</span>
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

export default SalesRetailDashboard;
