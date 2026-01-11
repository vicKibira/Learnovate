
import React, { useState } from 'react';
import {
    Users, UserCheck, UserPlus, UserMinus,
    Search, Filter, Plus, ChevronRight,
    Clock, CheckCircle2, AlertTriangle, MessageSquare,
    ArrowRight, Sparkles, LayoutGrid, List,
    MoreVertical, Calendar, Mail, FileText
} from 'lucide-react';
// Cast motion to any to bypass environment-specific type definition issues
import { motion as motionAny, AnimatePresence } from 'framer-motion';
const motion = motionAny as any;

const LifecycleManager: React.FC<{ store: any }> = ({ store }) => {
    const { theme } = store;
    const isDark = theme === 'dark';
    const [activeStage, setActiveStage] = useState<'Onboarding' | 'Probation' | 'Mobility' | 'Offboarding'>('Onboarding');

    const lifecycleStages = [
        { name: 'Onboarding', count: 8, icon: <UserPlus className="w-5 h-5" />, color: 'bg-emerald-500' },
        { name: 'Probation', count: 12, icon: <Clock className="w-5 h-5" />, color: 'bg-indigo-500' },
        { name: 'Mobility', count: 5, icon: <Sparkles className="w-5 h-5" />, color: 'bg-amber-500' },
        { name: 'Offboarding', count: 3, icon: <UserMinus className="w-5 h-5" />, color: 'bg-rose-500' },
    ];

    const candidateData = {
        Onboarding: [
            { id: '1', name: 'James Wilson', role: 'Sales Lead', progress: 85, days: 12, status: 'Healthy' },
            { id: '2', name: 'Sophia Lane', role: 'Trainer', progress: 40, days: 4, status: 'Healthy' },
            { id: '3', name: 'Robert Fox', role: 'DevOps', progress: 15, days: 2, status: 'Action Needed' },
        ],
        Probation: [
            { id: '4', name: 'Elena Gilbert', role: 'Accountant', progress: 90, days: 88, status: 'Review Due' },
            { id: '5', name: 'Jeremy Hunt', role: 'Sales Retail', progress: 65, days: 45, status: 'Healthy' },
        ],
        Mobility: [
            { id: '6', name: 'Bonnie Bennett', role: 'Senior Trainer', from: 'Trainer', progress: 70, status: 'Healthy' },
        ],
        Offboarding: [
            { id: '7', name: 'Alaric Saltzman', role: 'Ops Manager', progress: 100, status: 'Completed' },
        ]
    };

    return (
        <div className="space-y-10 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex items-center gap-2 mb-3">
                        <div className="w-10 h-1 bg-emerald-500 rounded-full" />
                        <span className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.4em]">Employee Journey</span>
                    </motion.div>
                    <h2 className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter">
                        Lifecycle <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">Manager</span>
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 font-bold text-lg mt-3">Orchestrating every stage of the professional experience at Learnovate.</p>
                </div>
                <div className="flex gap-4">
                    <button className="px-8 py-5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-[2rem] font-black uppercase tracking-widest text-[10px] shadow-2xl flex items-center gap-3 transition-all hover:scale-105 active:scale-95">
                        <Plus className="w-5 h-5" />
                        Initiate Journey
                    </button>
                </div>
            </div>

            {/* Stage Selector Tabs */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {lifecycleStages.map((stage: any) => (
                    <motion.button
                        key={stage.name}
                        onClick={() => setActiveStage(stage.name)}
                        whileHover={{ y: -5 }}
                        className={`p-8 rounded-[3rem] border transition-all relative overflow-hidden text-left ${activeStage === stage.name
                                ? 'bg-white dark:bg-slate-900 shadow-2xl border-indigo-500 dark:border-indigo-400'
                                : 'bg-slate-50/50 dark:bg-slate-800/50 border-transparent hover:bg-white dark:hover:bg-slate-800 shadow-sm'
                            }`}
                    >
                        <div className="flex items-start justify-between mb-8">
                            <div className={`p-4 rounded-2xl ${activeStage === stage.name ? 'bg-indigo-600' : 'bg-slate-200 dark:bg-slate-700'} text-white transition-colors`}>
                                {stage.icon}
                            </div>
                            <span className="text-3xl font-black text-slate-900 dark:text-white">{stage.count}</span>
                        </div>
                        <h4 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">{stage.name}</h4>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Personnel Tracking</p>
                        {activeStage === stage.name && (
                            <motion.div layoutId="stage-active-pill" className="absolute bottom-4 right-8 w-8 h-1 bg-indigo-500 rounded-full" />
                        )}
                    </motion.button>
                ))}
            </div>

            {/* Stage Board Segment */}
            <div className="glass p-10 rounded-[4rem] shadow-2xl border border-white/60 dark:border-white/5">
                <div className="flex flex-col lg:flex-row gap-8 items-center justify-between mb-12">
                    <div className="flex-1 relative group w-full">
                        <Search className="w-6 h-6 absolute left-8 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-all" />
                        <input
                            type="text"
                            placeholder={`Search ${activeStage.toLowerCase()} pipeline...`}
                            className="w-full pl-20 pr-8 py-6 bg-slate-50/50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 rounded-[2.5rem] focus:ring-8 focus:ring-indigo-500/5 outline-none font-bold transition-all dark:text-white lg:text-lg"
                        />
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex bg-slate-100 dark:bg-slate-800 p-2 rounded-2xl">
                            <button className="p-3 bg-white dark:bg-slate-700 rounded-xl shadow-sm text-indigo-600"><LayoutGrid className="w-5 h-5" /></button>
                            <button className="p-3 text-slate-400"><List className="w-5 h-5" /></button>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                    <AnimatePresence mode="popLayout">
                        {(candidateData as any)[activeStage].map((person: any, i: number) => (
                            <motion.div
                                key={person.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ delay: i * 0.1 }}
                                className="p-8 bg-white dark:bg-slate-900/40 rounded-[3rem] border border-slate-100 dark:border-white/5 hover:border-indigo-500/30 transition-all group relative"
                            >
                                <div className="flex items-start justify-between mb-8">
                                    <div className="flex items-center gap-4">
                                        <div className="w-16 h-16 rounded-[1.5rem] bg-gradient-to-tr from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 flex items-center justify-center text-2xl font-black text-slate-400">
                                            {person.name.charAt(0)}
                                        </div>
                                        <div>
                                            <h4 className="text-xl font-black text-slate-900 dark:text-white leading-tight">{person.name}</h4>
                                            <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mt-1">{person.role}</p>
                                        </div>
                                    </div>
                                    <button className="p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-all">
                                        <MoreVertical className="w-5 h-5 text-slate-300" />
                                    </button>
                                </div>

                                <div className="space-y-4 mb-8">
                                    <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
                                        <span className="text-slate-400">Stage Progression</span>
                                        <span className="text-slate-900 dark:text-white">{person.progress}%</span>
                                    </div>
                                    <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${person.progress}%` }}
                                            transition={{ duration: 1.2, ease: "circOut" }}
                                            className="h-full bg-indigo-600 rounded-full"
                                        />
                                    </div>
                                </div>

                                <div className="flex items-center justify-between mt-auto pt-6 border-t border-slate-50 dark:border-white/5">
                                    <div className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest ${person.status === 'Healthy' ? 'bg-emerald-50 text-emerald-600' :
                                            person.status === 'Action Needed' ? 'bg-rose-50 text-rose-600' : 'bg-amber-50 text-amber-600'
                                        }`}>
                                        {person.status === 'Healthy' ? <CheckCircle2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                                        {person.status}
                                    </div>
                                    {person.days && (
                                        <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                            <Clock className="w-4 h-4" />
                                            Day {person.days}
                                        </div>
                                    )}
                                </div>

                                <div className="absolute inset-0 bg-indigo-600/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-[3rem] pointer-events-none" />
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {/* Add New Trigger */}
                    <motion.button
                        whileHover={{ scale: 0.98 }}
                        className="p-10 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-[3rem] flex flex-col items-center justify-center text-slate-400 hover:border-indigo-400 hover:text-indigo-500 transition-all group lg:min-h-[300px]"
                    >
                        <div className="w-16 h-16 rounded-3xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center mb-6 group-hover:bg-indigo-50 transition-all">
                            <Plus className="w-8 h-8" />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-[0.4em]">Register {activeStage === 'Onboarding' ? 'New Hire' : 'Event'}</span>
                    </motion.button>
                </div>
            </div>

            {/* Actionable Intelligence Footer */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                <div className="p-10 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-[3.5rem] shadow-xl xl:col-span-2">
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight mb-8">Pending Action Signal</h3>
                    <div className="space-y-4">
                        {[
                            { user: 'Robert Fox', task: 'Missing Hardware Provisioning', priority: 'High', icon: <AlertTriangle className="text-rose-500" /> },
                            { user: 'Elena Gilbert', task: 'Probation Review Documentation Pending', priority: 'Medium', icon: <FileText className="text-amber-500" /> },
                            { user: 'James Wilson', task: 'Final Knowledge Check Triggered', priority: 'Auto', icon: <CheckCircle2 className="text-emerald-500" /> },
                        ].map((item, i) => (
                            <div key={i} className="flex items-center gap-6 p-6 bg-slate-50 dark:bg-slate-800/40 rounded-3xl group cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-all">
                                <div className="p-4 bg-white dark:bg-slate-700 rounded-2xl shadow-sm">{item.icon}</div>
                                <div className="flex-1">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{item.user}</p>
                                    <h4 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">{item.task}</h4>
                                </div>
                                <span className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest ${item.priority === 'High' ? 'bg-rose-50 text-rose-600' : 'bg-slate-100 text-slate-500'
                                    }`}>{item.priority}</span>
                                <ChevronRight className="w-5 h-5 text-slate-200 group-hover:text-indigo-500 transition-all" />
                            </div>
                        ))}
                    </div>
                </div>

                <div className="p-12 bg-indigo-600 text-white rounded-[3.5rem] shadow-2xl relative overflow-hidden flex flex-col justify-center">
                    <div className="absolute top-0 right-0 p-8 opacity-20 rotate-12">
                        <Calendar className="w-32 h-32" />
                    </div>
                    <h3 className="text-3xl font-black tracking-tighter mb-6 relative z-10">Lifecycle Calendar</h3>
                    <p className="text-indigo-50 font-medium text-lg leading-relaxed mb-10 relative z-10">
                        4 Onboarding starts scheduled for next Monday. Automated welcome kits have been dispatched.
                    </p>
                    <button className="w-full py-5 bg-white text-indigo-700 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl hover:bg-emerald-400 hover:text-white transition-all relative z-10">
                        Sync Calendars
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LifecycleManager;
