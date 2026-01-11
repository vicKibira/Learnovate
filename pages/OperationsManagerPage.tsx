
import React, { useMemo, useState, useEffect } from 'react';
import {
  Activity, Calendar, MapPin, User, Clock, CheckCircle,
  AlertTriangle, BookOpen, Layers, BarChart3, MoreVertical,
  Plus, Users, Sparkles, LayoutGrid, List, X, ShieldCheck,
  AlertCircle, Zap, Search, Save, Briefcase, TrendingUp,
  Droplet, Hammer, Check
} from 'lucide-react';
import { TrainingStatus, UserRole } from '../types';
import { motion as motionAny, AnimatePresence } from 'framer-motion';
const motion = motionAny as any;

type RoomHealth = 'Ready' | 'Cleaning' | 'Repair';

const OperationsManagerPage: React.FC<{ store: any }> = ({ store }) => {
  const { data, scheduleTraining, theme } = store;
  const isDark = theme === 'dark';

  // --- STATE ---
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [roomHealths, setRoomHealths] = useState<Record<string, RoomHealth>>({
    '1': 'Ready', '2': 'Ready', '3': 'Ready', '4': 'Ready'
  });

  const [formData, setFormData] = useState({
    dealId: '',
    courseName: '',
    duration: '24 Hours',
    hours: 24,
    classroom: '1' as any,
    trainerId: '',
    startDate: '',
    endDate: '',
  });

  // Load room health from local storage for persistence
  useEffect(() => {
    const saved = localStorage.getItem('op_room_health');
    if (saved) setRoomHealths(JSON.parse(saved));
  }, []);

  const saveRoomHealth = (newHealths: Record<string, RoomHealth>) => {
    setRoomHealths(newHealths);
    localStorage.setItem('op_room_health', JSON.stringify(newHealths));
  };

  // --- DERIVED DATA ---
  const payableDeals = useMemo(() => {
    return data.deals.filter((d: any) => d.isPaid && !data.trainingClasses.find((t: any) => t.dealId === d.id));
  }, [data.deals, data.trainingClasses]);

  const trainers = useMemo(() => {
    return data.users.filter((u: any) => u.role === UserRole.TRAINER);
  }, [data.users]);

  const filteredSchedules = useMemo(() => {
    return data.trainingClasses.filter((t: any) =>
      t.courseName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [data.trainingClasses, searchQuery]);

  const roomOccupancy = useMemo(() => {
    const rooms = { '1': null, '2': null, '3': null, '4': null } as any;
    data.trainingClasses.forEach((t: any) => {
      if (t.status === TrainingStatus.ONGOING) {
        rooms[t.classroom] = t;
      }
    });
    return rooms;
  }, [data.trainingClasses]);

  const facultyStatus = useMemo(() => {
    return trainers.map((t: any) => {
      const isBusy = data.trainingClasses.some((tc: any) => tc.trainerId === t.id && tc.status === TrainingStatus.ONGOING);
      const nextClass = data.trainingClasses
        .filter((tc: any) => tc.trainerId === t.id && tc.status === TrainingStatus.CONFIRMED)
        .sort((a: any, b: any) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())[0];

      return { ...t, isBusy, nextClass };
    });
  }, [trainers, data.trainingClasses]);

  // --- CONFLICT DETECTION ---
  const conflict = useMemo(() => {
    if (!formData.startDate || !formData.endDate || !formData.classroom || !formData.trainerId) return null;

    const start = new Date(formData.startDate).getTime();
    const end = new Date(formData.endDate).getTime();

    // Check Room Health
    if (roomHealths[formData.classroom] !== 'Ready') {
      return `Room ${formData.classroom} is currently under ${roomHealths[formData.classroom].toLowerCase()} and cannot be booked.`;
    }

    // Check Room Overlap
    const roomOverlap = data.trainingClasses.find((t: any) => {
      if (t.classroom !== formData.classroom) return false;
      const tStart = new Date(t.startDate).getTime();
      const tEnd = new Date(t.endDate).getTime();
      return (start < tEnd && end > tStart);
    });
    if (roomOverlap) return `Room ${formData.classroom} is already booked for these dates (${roomOverlap.courseName}).`;

    // Check Trainer Overlap
    const trainerOverlap = data.trainingClasses.find((t: any) => {
      if (t.trainerId !== formData.trainerId) return false;
      const tStart = new Date(t.startDate).getTime();
      const tEnd = new Date(t.endDate).getTime();
      return (start < tEnd && end > tStart);
    });
    if (trainerOverlap) return `Trainer ${trainers.find((tr: any) => tr.id === formData.trainerId)?.name} is already busy during this period.`;

    return null;
  }, [formData, data.trainingClasses, roomHealths, trainers]);

  // --- ACTIONS ---
  const toggleRoomHealth = (roomId: string) => {
    const healths: RoomHealth[] = ['Ready', 'Cleaning', 'Repair'];
    const current = roomHealths[roomId];
    const next = healths[(healths.indexOf(current) + 1) % healths.length];
    saveRoomHealth({ ...roomHealths, [roomId]: next });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (conflict) return;

    scheduleTraining(formData.dealId, {
      ...formData,
      status: TrainingStatus.CONFIRMED,
    });
    setShowAddModal(false);
    setFormData({
      dealId: '',
      courseName: '',
      duration: '24 Hours',
      hours: 24,
      classroom: '1' as any,
      trainerId: '',
      startDate: '',
      endDate: '',
    });
  };

  return (
    <div className="space-y-12 pb-24 relative min-h-screen font-sans">
      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-10 pt-10 px-2">
        <div>
          <h2 className="text-6xl font-black text-slate-900 dark:text-white tracking-tighter">Impact <span className="text-indigo-600">Hub.</span></h2>
          <p className="text-slate-500 font-bold mt-2 text-lg">Resource readiness and capacity control.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="px-6 py-3 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center gap-3">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Systems Active</span>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-10 py-5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-[2.5rem] font-black uppercase tracking-widest text-[10px] shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center gap-4"
          >
            <Plus className="w-5 h-5" /> New Schedule
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 px-2 relative z-10">
        {/* Left Column: Room Health & Capacity */}
        <div className="lg:col-span-4 space-y-12">
          <div className="p-10 bg-white/40 dark:bg-slate-900/40 backdrop-blur-3xl rounded-[4rem] border border-white dark:border-white/5 shadow-2xl">
            <div className="flex items-center justify-between mb-10">
              <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter">Room Health</h3>
              <ShieldCheck className="w-5 h-5 text-indigo-500" />
            </div>
            <div className="space-y-6">
              {['1', '2', '3', '4'].map((id) => {
                const health = roomHealths[id];
                const occ = roomOccupancy[id];
                return (
                  <motion.div
                    key={id} whileHover={{ x: 5 }}
                    className={`p-6 rounded-[2rem] border transition-all cursor-pointer ${health === 'Ready' ? 'bg-white dark:bg-slate-800 border-slate-100 dark:border-white/5' :
                        health === 'Cleaning' ? 'bg-amber-50 dark:bg-amber-500/5 border-amber-100 dark:border-amber-500/20' :
                          'bg-rose-50 dark:bg-rose-500/5 border-rose-100 dark:border-rose-500/20'
                      }`}
                    onClick={() => toggleRoomHealth(id)}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center font-black text-slate-500">{id}</div>
                        <span className="font-black text-slate-900 dark:text-white">Room {id}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {health === 'Ready' && <CheckCircle className="w-4 h-4 text-emerald-500" />}
                        {health === 'Cleaning' && <Droplet className="w-4 h-4 text-amber-500 animate-bounce" />}
                        {health === 'Repair' && <Hammer className="w-4 h-4 text-rose-500 animate-pulse" />}
                        <span className={`text-[9px] font-black uppercase tracking-widest ${health === 'Ready' ? 'text-emerald-500' : health === 'Cleaning' ? 'text-amber-500' : 'text-rose-500'
                          }`}>{health}</span>
                      </div>
                    </div>
                    {occ && (
                      <div className="pt-4 mt-4 border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
                        <span className="text-[10px] font-bold text-slate-400 truncate max-w-[150px]">{occ.courseName}</span>
                        <span className="text-[9px] font-black text-indigo-500 uppercase">Occupied</span>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>

          <div className="p-10 bg-gradient-to-br from-indigo-600 to-violet-700 rounded-[4rem] text-white shadow-2xl relative overflow-hidden group">
            <Sparkles className="absolute top-10 right-10 w-20 h-20 text-white/10 group-hover:rotate-12 transition-transform duration-700" />
            <h3 className="text-3xl font-black tracking-tighter mb-4 leading-tight">Capacity <br />Check.</h3>
            <p className="text-indigo-100 font-bold mb-8">Classrooms are 75% full this week. Consider shift rotation.</p>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-white/10 rounded-3xl backdrop-blur-md">
                <p className="text-[9px] font-black uppercase tracking-widest text-indigo-200 mb-1">Total Slots</p>
                <p className="text-2xl font-black">120</p>
              </div>
              <div className="p-4 bg-white/10 rounded-3xl backdrop-blur-md">
                <p className="text-[9px] font-black uppercase tracking-widest text-indigo-200 mb-1">Booked</p>
                <p className="text-2xl font-black">92</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Faculty & Schedules */}
        <div className="lg:col-span-8 space-y-12">
          {/* Faculty Availability Board */}
          <div className="p-10 bg-white/40 dark:bg-slate-900/40 backdrop-blur-3xl rounded-[4rem] border border-white dark:border-white/5 shadow-2xl">
            <div className="flex items-center justify-between mb-10">
              <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">Faculty Readiness</h3>
              <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-white/5 rounded-2xl">
                <Users className="w-4 h-4 text-slate-400" />
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{trainers.length} Active</span>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {facultyStatus.map((t: any) => (
                <div key={t.id} className="p-6 bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-white/5 flex items-center justify-between group hover:shadow-xl transition-all">
                  <div className="flex items-center gap-4">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-900/40 dark:to-indigo-800/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-black text-xl shadow-inner group-hover:scale-110 transition-transform`}>
                      {t.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-black text-slate-900 dark:text-white leading-tight mb-1">{t.name}</h4>
                      <p className="text-[10px] font-bold text-slate-400 flex items-center gap-1.5 uppercase tracking-widest">
                        {t.isBusy ? <span className="text-rose-500 italic">In Session</span> : <span className="text-emerald-500">Ready for Duty</span>}
                      </p>
                    </div>
                  </div>
                  {t.nextClass && !t.isBusy && (
                    <div className="text-right">
                      <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-1">Next Start</p>
                      <p className="text-[11px] font-black text-indigo-500">{new Date(t.nextClass.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Impact Schedule Grid */}
          <div className="p-12 bg-white/40 dark:bg-slate-900/40 backdrop-blur-3xl rounded-[5rem] border border-white dark:border-white/5 shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between mb-12">
              <div>
                <h3 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">Impact Log.</h3>
                <p className="text-slate-400 font-bold mt-2">Classroom occupancy and student load.</p>
              </div>
              <div className="relative">
                <Search className="w-5 h-5 absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text" placeholder="Find batch..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                  className="pl-14 pr-8 py-4 bg-white/60 dark:bg-slate-800/60 backdrop-blur-lg rounded-3xl border-none outline-none font-bold text-sm shadow-inner dark:text-white w-64 focus:w-80 transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {filteredSchedules.map((t, i) => (
                <motion.div
                  key={i} whileHover={{ y: -5 }}
                  className="p-8 bg-white dark:bg-slate-800 rounded-[3rem] border border-slate-100 dark:border-white/5 shadow-lg group"
                >
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <h4 className="text-xl font-black text-slate-900 dark:text-white tracking-tight mb-1">{t.courseName}</h4>
                      <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest">Room {t.classroom} • {t.hours}h Total</p>
                    </div>
                    <div className={`p-4 rounded-2xl ${t.status === TrainingStatus.ONGOING ? 'bg-indigo-600 text-white shadow-indigo-500/30' : 'bg-emerald-500 text-white animate-pulse shadow-emerald-500/30'} shadow-lg group-hover:scale-110 transition-all`}>
                      {t.status === TrainingStatus.ONGOING ? <Activity className="w-5 h-5" /> : <ShieldCheck className="w-5 h-5" />}
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-6 border-t border-slate-100 dark:border-white/5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-[10px] font-black text-slate-500">
                        {data.users.find((u: any) => u.id === t.trainerId)?.name?.charAt(0) || 'T'}
                      </div>
                      <span className="text-[11px] font-bold text-slate-400">{data.users.find((u: any) => u.id === t.trainerId)?.name || 'TBA'}</span>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 dark:bg-white/5 rounded-xl">
                      <Users className="w-3.5 h-3.5 text-slate-400" />
                      <span className="text-[10px] font-black text-slate-500 uppercase">24 People</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Impact Scheduler Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowAddModal(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-2xl" />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 50 }}
              className="relative w-full max-w-4xl bg-white dark:bg-slate-900 rounded-[5rem] shadow-[0_50px_100px_rgba(0,0,0,0.4)] overflow-hidden border border-white/20"
            >
              <div className="p-16 border-b border-slate-100 dark:border-white/5 flex items-center justify-between bg-gradient-to-r from-indigo-50/30 to-white dark:from-slate-800/30 dark:to-slate-900">
                <div>
                  <h3 className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter">Impact Scheduler</h3>
                  <p className="text-slate-400 font-bold mt-2">Zero-conflict resource orchestration.</p>
                </div>
                <button onClick={() => setShowAddModal(false)} className="p-6 hover:bg-white dark:hover:bg-white/5 rounded-[2.5rem] transition-all group shadow-xl">
                  <X className="w-8 h-8 text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white group-hover:rotate-90 transition-all" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-16 space-y-12 max-h-[70vh] overflow-y-auto">
                {/* Conflict Guard Alert */}
                <AnimatePresence>
                  {conflict && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                      className="p-6 bg-rose-50 dark:bg-rose-500/10 border border-rose-100 dark:border-rose-500/20 rounded-[2rem] flex items-start gap-4 mb-8"
                    >
                      <AlertTriangle className="w-8 h-8 text-rose-500 mt-1" />
                      <div>
                        <p className="text-sm font-black text-rose-700 uppercase tracking-widest mb-1">Conflict Guard Alert</p>
                        <p className="text-xs font-bold text-rose-600/80 leading-relaxed">{conflict}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-indigo-500" /> Select Impact Deal
                    </label>
                    <select required value={formData.dealId} onChange={e => {
                      const d = payableDeals.find((deal: any) => deal.id === e.target.value);
                      setFormData({ ...formData, dealId: e.target.value, courseName: d?.title || '' });
                    }} className="w-full px-8 py-6 bg-slate-50 dark:bg-slate-800/50 border-none rounded-[2.5rem] outline-none font-black text-xl appearance-none cursor-pointer focus:ring-4 focus:ring-indigo-500/10 transition-all dark:text-white shadow-inner">
                      <option value="">Choose a confirmed opportunity...</option>
                      {payableDeals.map((d: any) => <option key={d.id} value={d.id}>{d.title}</option>)}
                    </select>
                  </div>
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                      <User className="w-4 h-4 text-emerald-500" /> Expert Faculty
                    </label>
                    <select required value={formData.trainerId} onChange={e => setFormData({ ...formData, trainerId: e.target.value })} className="w-full px-8 py-6 bg-slate-50 dark:bg-slate-800/50 border-none rounded-[2.5rem] outline-none font-black text-xl appearance-none cursor-pointer focus:ring-4 focus:ring-emerald-500/10 transition-all dark:text-white shadow-inner">
                      <option value="">Select trainer...</option>
                      {trainers.map((t: any) => <option key={t.id} value={t.id}>{t.name}</option>)}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-rose-500" /> Room Allocation
                    </label>
                    <select value={formData.classroom} onChange={e => setFormData({ ...formData, classroom: e.target.value as any })} className="w-full px-8 py-6 bg-slate-50 dark:bg-slate-800/50 border-none rounded-[2.5rem] outline-none font-black text-xl appearance-none cursor-pointer focus:ring-4 focus:ring-rose-500/10 transition-all dark:text-white shadow-inner">
                      <option value="1">Innovation Room 1</option>
                      <option value="2">Innovation Room 2</option>
                      <option value="3">Advanced Lab 3</option>
                      <option value="4">Advanced Lab 4</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Start</label>
                      <input type="date" required value={formData.startDate} onChange={e => setFormData({ ...formData, startDate: e.target.value })} className="w-full px-6 py-6 bg-slate-50 dark:bg-slate-800/50 border-none rounded-[2.5rem] outline-none font-black text-sm dark:text-white shadow-inner" />
                    </div>
                    <div className="space-y-4">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">End</label>
                      <input type="date" required value={formData.endDate} onChange={e => setFormData({ ...formData, endDate: e.target.value })} className="w-full px-6 py-6 bg-slate-50 dark:bg-slate-800/50 border-none rounded-[2.5rem] outline-none font-black text-sm dark:text-white shadow-inner" />
                    </div>
                  </div>
                </div>

                <button
                  type="submit" disabled={!!conflict}
                  className={`w-full py-10 rounded-[3rem] font-black uppercase tracking-[0.5em] text-xs shadow-2xl transition-all relative overflow-hidden group ${conflict ? 'bg-slate-100 text-slate-400 cursor-not-allowed grayscale' : 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 active:scale-95'
                    }`}
                >
                  {!conflict && <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-rose-600 opacity-0 group-hover:opacity-100 transition-all duration-700" />}
                  <span className="relative z-10 flex items-center justify-center gap-4">
                    <ShieldCheck className="w-6 h-6" /> Save High-Impact Schedule
                  </span>
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default OperationsManagerPage;