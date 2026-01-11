
import React, { useMemo } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    AreaChart, Area, PieChart, Pie, Cell, RadialBarChart, RadialBar
} from 'recharts';
import {
    Users, TrendingUp, Sparkles, Filter, Activity, Heart,
    Shield, Briefcase, UserPlus, UserMinus, Globe, Zap,
    Smile, Target, ChartBar, PlusCircle
} from 'lucide-react';
import { motion as motionAny, AnimatePresence } from 'framer-motion';
const motion = motionAny as any;

const HRDashboard: React.FC<{ store: any }> = ({ store }) => {
    const { data, theme } = store;
    const isDark = theme === 'dark';

    const [showHireModal, setShowHireModal] = React.useState(false);
    const [hireForm, setHireForm] = React.useState({ name: '', role: '', email: '' });

    // --- DYNAMIC LOGIC ---
    const totalPeople = data.users?.length || 0;

    const handleHire = (e: React.FormEvent) => {
        e.preventDefault();
        const newUser = {
            id: `u${Date.now()}`,
            name: hireForm.name,
            role: hireForm.role,
            email: hireForm.email,
            joinDate: new Date().toISOString().split('T')[0],
            status: 'Active'
        };
        store.setData({
            ...data,
            users: [...(data.users || []), newUser]
        });
        setShowHireModal(false);
        setHireForm({ name: '', role: '', email: '' });
    };

    // People Speed: How fast we are bringing people in (Mock for speed)
    const peopleSpeed = useMemo(() => {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const newHires = data.users?.filter((u: any) => new Date(u.joinDate) > thirtyDaysAgo).length || 0;
        return Math.min(100, 50 + newHires * 10);
    }, [data.users]);

    // Company Happiness (Mock score from global vibe)
    const happinessScore = 4.9;

    // Hiring Pulse: Simulated growth data
    const hiringPulseData = useMemo(() => {
        // Generate pulse based on real user join dates
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
        return months.map((m, i) => ({
            month: m,
            count: 100 + (i * 10) + (data.users?.length % 10)
        }));
    }, [data.users]);

    // Big List: Latest people joined
    const recentHires = useMemo(() => {
        return [...(data.users || [])]
            .sort((a, b) => new Date(b.joinDate).getTime() - new Date(a.joinDate).getTime())
            .slice(0, 5);
    }, [data.users]);

    return (
        <div className="space-y-12 pb-24 relative min-h-screen font-sans">
            {/* Background Decor */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-5%] left-[-5%] w-[800px] h-[800px] bg-violet-500/5 dark:bg-violet-600/5 rounded-full blur-[180px] animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[800px] h-[800px] bg-pink-500/5 dark:bg-pink-600/5 rounded-full blur-[180px] animate-pulse" style={{ animationDelay: '3s' }} />
            </div>

            {/* Header */}
            <div className="relative z-10 flex flex-col lg:flex-row lg:items-end justify-between gap-10 pt-10 px-2">
                <div>
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-1.5 bg-violet-500 rounded-full" />
                        <span className="text-[10px] font-black text-violet-600 uppercase tracking-[0.4em]">Culture Commander</span>
                    </motion.div>
                    <h2 className="text-7xl font-black text-slate-900 dark:text-white tracking-tighter leading-none">
                        People <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-pink-500">First.</span>
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 font-bold text-xl mt-6 leading-relaxed">
                        Watch your team grow and keep everyone happy.
                    </p>
                </div>
                <div className="flex items-center gap-4 bg-white/50 dark:bg-slate-900/50 backdrop-blur-3xl p-4 rounded-[2.5rem] border border-white dark:border-white/5 shadow-2xl">
                    <div
                        onClick={() => setShowHireModal(true)}
                        className="flex items-center gap-4 px-8 py-4 bg-violet-600 text-white rounded-3xl shadow-xl shadow-violet-500/30 group cursor-pointer hover:bg-violet-700 transition-all active:scale-95"
                    >
                        <UserPlus className="w-6 h-6 group-hover:scale-110 transition-transform" />
                        <span className="text-xs font-black uppercase tracking-widest">Hire New Person</span>
                    </div>
                </div>
            </div>

            {/* Top Row: Speed & Happiness */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10 px-2 mt-12">
                {/* People Speed Gauge */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
                    className="lg:col-span-4 bg-white/50 dark:bg-slate-900/50 backdrop-blur-3xl rounded-[4rem] border border-white dark:border-white/5 shadow-2xl p-10 flex flex-col items-center justify-center text-center group relative overflow-hidden"
                >
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight mb-8">People Speed</h3>
                    <div className="relative w-full h-[250px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <RadialBarChart cx="50%" cy="50%" innerRadius="70%" outerRadius="100%" barSize={20} data={[{ name: 'Speed', value: peopleSpeed, fill: '#8b5cf6' }]}>
                                <RadialBar background dataKey="value" cornerRadius={30} />
                            </RadialBarChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex flex-col items-center justify-center pt-2">
                            <span className="text-6xl font-black text-slate-900 dark:text-white tracking-tighter">{peopleSpeed}%</span>
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Hiring Pace</span>
                        </div>
                    </div>
                    <p className="text-[11px] font-bold text-slate-500 mt-6 leading-relaxed max-w-[200px]">
                        We are currently growing <span className="text-violet-600 font-black">Fast</span> with {totalPeople} people onboard.
                    </p>
                </motion.div>

                {/* Company Happiness Card */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="lg:col-span-4 bg-white/50 dark:bg-slate-900/50 backdrop-blur-3xl rounded-[4rem] border border-white dark:border-white/5 shadow-2xl p-10 flex flex-col items-center justify-center text-center group"
                >
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight mb-8">Company Happiness</h3>
                    <div className="p-10 bg-pink-50 dark:bg-pink-500/10 rounded-[3rem] border border-pink-100 dark:border-pink-500/20 mb-8 w-full group-hover:scale-105 transition-all duration-500">
                        <div className="flex items-center justify-center gap-2 mb-4 text-pink-500">
                            {[1, 2, 3, 4, 5].map((heart) => (
                                <Heart key={heart} className={`w-8 h-8 ${heart <= 5 ? 'fill-pink-500' : 'text-slate-200 dark:text-slate-800'}`} />
                            ))}
                        </div>
                        <p className="text-6xl font-black text-slate-900 dark:text-white tracking-tighter">{happinessScore}</p>
                        <p className="text-[10px] font-black text-pink-600 uppercase tracking-widest mt-2">Vibe Score</p>
                    </div>
                    <p className="text-[11px] font-bold text-slate-500 leading-relaxed max-w-[200px]">
                        Everyone loves the new <br /><span className="text-pink-600 font-black">Wellness Hub</span> program.
                    </p>
                </motion.div>

                {/* Hiring Pulse Chart */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="lg:col-span-4 bg-white/50 dark:bg-slate-900/50 backdrop-blur-3xl rounded-[4rem] border border-white dark:border-white/5 shadow-2xl p-10 flex flex-col overflow-hidden"
                >
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight mb-10">Hiring Pulse</h3>
                    <div className="h-[250px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={hiringPulseData}>
                                <defs>
                                    <linearGradient id="hiringGrad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="10 10" vertical={false} stroke={isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'} />
                                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 900 }} dy={10} />
                                <Tooltip contentStyle={{ borderRadius: '24px', backgroundColor: isDark ? '#0f172a' : '#fff', border: 'none', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }} />
                                <Area type="monotone" dataKey="count" stroke="#8b5cf6" strokeWidth={4} fillOpacity={1} fill="url(#hiringGrad)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-8 text-center">Steady Growth this Quarter</p>
                </motion.div>
            </div>

            {/* Middle Section: Help Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10 px-2 mt-12">
                {/* Big List: New Team Members */}
                <motion.div
                    initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}
                    className="lg:col-span-7 bg-white/50 dark:bg-slate-900/50 backdrop-blur-3xl rounded-[4rem] border border-white dark:border-white/5 shadow-2xl p-12 overflow-hidden"
                >
                    <div className="flex items-center justify-between mb-12">
                        <div>
                            <h3 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">Big List.</h3>
                            <p className="text-slate-400 font-bold mt-2">The newest faces in our family.</p>
                        </div>
                        <div className="p-5 bg-violet-50 dark:bg-violet-500/10 text-violet-600 rounded-2xl">
                            <Users className="w-6 h-6" />
                        </div>
                    </div>

                    <div className="space-y-6">
                        {recentHires.map((person: any, i: number) => (
                            <motion.div
                                key={i}
                                whileHover={{ x: 10 }}
                                className="p-8 bg-white dark:bg-slate-800/80 rounded-[2.5rem] border border-slate-100 dark:border-white/5 shadow-lg flex items-center justify-between group"
                            >
                                <div className="flex items-center gap-6">
                                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center text-white text-xl font-black shadow-lg shadow-violet-500/20 group-hover:rotate-6 transition-transform">
                                        {person.name.charAt(0)}
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-black text-slate-900 dark:text-white leading-tight">{person.name}</h4>
                                        <p className="text-[10px] font-black text-violet-500 uppercase tracking-widest mt-1">{person.role}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-black text-slate-400 mb-1">Joined {new Date(person.joinDate).toLocaleDateString()}</p>
                                    <span className="px-4 py-1.5 bg-emerald-500 text-white rounded-full text-[9px] font-black uppercase tracking-widest shadow-lg shadow-emerald-500/20">
                                        Fresh Start
                                    </span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Helpful Cards Sidebar */}
                <motion.div
                    initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}
                    className="lg:col-span-5 bg-gradient-to-br from-violet-600 to-pink-600 rounded-[4.5rem] p-12 text-white shadow-2xl relative overflow-hidden group"
                >
                    <Sparkles className="absolute top-10 right-10 w-24 h-24 text-white/10 group-hover:rotate-12 transition-transform duration-1000" />
                    <h3 className="text-3xl font-black tracking-tighter mb-8 leading-tight">Helpful <br />Cards.</h3>
                    <div className="space-y-6">
                        {[
                            { text: "3 new people are starting Monday. Are their desks ready?", icon: <Zap /> },
                            { text: "Team happiness is at 4.9! Plan a small party?", icon: <Smile /> },
                            { text: "Open roles in Sales are taking too long to fill.", icon: <Activity /> }
                        ].map((card, i) => (
                            <motion.div key={i} whileHover={{ x: 10 }} className="p-6 bg-white/10 backdrop-blur-md rounded-3xl border border-white/10 flex items-start gap-4">
                                <div className="p-3 bg-white/10 rounded-2xl">{card.icon}</div>
                                <p className="text-sm font-bold leading-relaxed">{card.text}</p>
                            </motion.div>
                        ))}
                    </div>
                    <div className="mt-12 pt-8 border-t border-white/10">
                        <button
                            onClick={() => store.setActiveTab('Workforce Analytics')}
                            className="w-full py-5 bg-white text-violet-700 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl hover:bg-pink-400 hover:text-white transition-all active:scale-95"
                        >
                            Check All Analytics
                        </button>
                    </div>
                </motion.div>
            </div>
            {/* ADD HIRE MODAL */}
            <AnimatePresence>
                {showHireModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowHireModal(false)} className="absolute inset-0 bg-slate-900/40 backdrop-blur-xl" />
                        <motion.div initial={{ opacity: 0, scale: 0.9, y: 30 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 30 }} className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-[3.5rem] shadow-2xl overflow-hidden border border-white/20">
                            <div className="p-10 border-b border-slate-50 dark:border-white/5">
                                <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">Hire Person</h3>
                                <p className="text-slate-400 font-bold mt-1 text-sm">Add a new face to the family.</p>
                            </div>
                            <form onSubmit={handleHire} className="p-10 space-y-8">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                                    <input required type="text" value={hireForm.name} onChange={e => setHireForm({ ...hireForm, name: e.target.value })} className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl outline-none font-bold focus:ring-4 focus:ring-violet-500/10 dark:text-white" placeholder="e.g. John Doe" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">User Role</label>
                                    <select required value={hireForm.role} onChange={e => setHireForm({ ...hireForm, role: e.target.value })} className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl outline-none font-bold focus:ring-4 focus:ring-violet-500/10 dark:text-white">
                                        <option value="">Select Role...</option>
                                        <option value="Trainer">Trainer</option>
                                        <option value="Sales Retail">Sales Retail</option>
                                        <option value="Sales Corporate">Sales Corporate</option>
                                        <option value="Operations">Operations</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                                    <input required type="email" value={hireForm.email} onChange={e => setHireForm({ ...hireForm, email: e.target.value })} className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl outline-none font-bold focus:ring-4 focus:ring-violet-500/10 dark:text-white" placeholder="john@company.com" />
                                </div>
                                <button type="submit" className="w-full py-5 bg-violet-600 text-white rounded-3xl font-black text-xs uppercase tracking-widest shadow-xl shadow-violet-500/30 hover:bg-violet-700 transition-all active:scale-95">
                                    Confirm Hire
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default HRDashboard;
