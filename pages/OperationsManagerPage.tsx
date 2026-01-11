import React, { useMemo, useState } from 'react';
import { 
  Activity, Calendar, MapPin, User, Clock, CheckCircle,
  AlertTriangle, BookOpen, Layers, BarChart3, MoreVertical,
  Plus, Users, Sparkles, LayoutGrid, List, X, ShieldCheck, AlertCircle, Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrainingStatus, UserRole } from '../types';

const OperationsManagerPage: React.FC<{ store: any }> = ({ store }) => {
  const { data, scheduleTraining } = store;
  const [showAddModal, setShowAddModal] = useState(false);

  // Scheduling Form State
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

  // Derived Data for Scheduling
  const payableDeals = useMemo(() => {
    return data.deals.filter((d: any) => d.isPaid && !data.trainingClasses.find((t: any) => t.dealId === d.id));
  }, [data.deals, data.trainingClasses]);

  const trainers = useMemo(() => {
    return data.users.filter((u: any) => u.role === UserRole.TRAINER);
  }, [data.users]);

  const selectedTrainerProfile = useMemo(() => {
    if (!formData.trainerId) return null;
    return data.trainerProfiles.find((p: any) => p.userId === formData.trainerId);
  }, [formData.trainerId, data.trainerProfiles]);

  const scheduleConflict = useMemo(() => {
    if (!formData.startDate || !formData.trainerId || !selectedTrainerProfile) return null;
    const start = new Date(formData.startDate);
    const dayName = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][start.getDay()];
    // Check if the trainer has a defined slot for this day
    const hasSlot = selectedTrainerProfile.availabilitySlots?.some((s: any) => s.day === dayName);
    return !hasSlot;
  }, [formData.startDate, formData.trainerId, selectedTrainerProfile]);

  const handleOpenModal = () => setShowAddModal(true);
  const handleCloseModal = () => {
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    scheduleTraining(formData.dealId, {
      ...formData,
      status: TrainingStatus.PLANNED,
    });
    handleCloseModal();
  };

  // Global Operations Metrics
  const metrics = useMemo(() => {
    const ongoing = data.trainingClasses.filter((t: any) => t.status === TrainingStatus.ONGOING).length;
    const classroomsInUse = new Set(data.trainingClasses.filter((t: any) => t.status === TrainingStatus.ONGOING).map((t: any) => t.classroom)).size;
    const totalTrainers = data.users.filter((u: any) => u.role === UserRole.TRAINER).length;
    const activeTrainers = new Set(data.trainingClasses.filter((t: any) => t.status === TrainingStatus.ONGOING).map((t: any) => t.trainerId)).size;

    return [
      { label: 'Active Sessions', value: ongoing, icon: <BookOpen className="w-6 h-6 text-indigo-500" />, color: 'bg-indigo-50' },
      { label: 'Classroom Utilization', value: `${((classroomsInUse / 4) * 100).toFixed(0)}%`, icon: <MapPin className="w-6 h-6 text-emerald-500" />, color: 'bg-emerald-50' },
      { label: 'Trainer Workload', value: `${((activeTrainers / totalTrainers) * 100).toFixed(0)}%`, icon: <Activity className="w-6 h-6 text-amber-500" />, color: 'bg-amber-50' },
      { label: 'Upcoming Completion', value: data.trainingClasses.filter((t: any) => t.status === TrainingStatus.CONFIRMED).length, icon: <Sparkles className="w-6 h-6 text-rose-500" />, color: 'bg-rose-50' },
    ];
  }, [data]);

  // Classroom Status View
  const classrooms = ['1', '2', '3', '4'].map(id => {
    const currentClass = data.trainingClasses.find((t: any) => t.classroom === id && t.status === TrainingStatus.ONGOING);
    return { id, currentClass };
  });

  return (
    <div className="space-y-10 pb-20">
      {/* Dynamic Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-4">
            <div className="p-3 bg-indigo-600 rounded-[1.5rem] shadow-xl shadow-indigo-200">
               <Activity className="w-8 h-8 text-white" />
            </div>
            Operations Command
          </h2>
          <p className="text-slate-500 font-bold mt-3 text-lg">Orchestrating resources and excellence in training delivery.</p>
        </div>
        <div className="flex items-center gap-3">
           <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
              <button className="p-2.5 bg-white shadow-sm rounded-xl text-indigo-600"><LayoutGrid className="w-5 h-5" /></button>
              <button className="p-2.5 text-slate-400 hover:text-slate-600"><List className="w-5 h-5" /></button>
           </div>
           <button 
             onClick={handleOpenModal}
             className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200 flex items-center gap-2"
           >
             <Plus className="w-5 h-5" /> New Schedule Batch
           </button>
        </div>
      </div>

      {/* Real-time KPI Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {metrics.map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/40 border border-white/60 relative group"
          >
            <div className="flex items-start justify-between mb-8">
               <div className={`p-4 rounded-2xl ${stat.color} shadow-sm border border-white/50`}>
                 {stat.icon}
               </div>
               <button className="p-2 text-slate-300 hover:text-slate-600 transition-colors"><MoreVertical className="w-4 h-4" /></button>
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">{stat.label}</p>
            <h3 className="text-3xl font-black text-slate-900 tracking-tighter">{stat.value}</h3>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Resource View: Classroom Hub */}
        <div className="lg:col-span-2 glass p-10 rounded-[3rem] shadow-xl shadow-slate-200/30">
          <div className="flex items-center justify-between mb-12">
             <div>
               <h3 className="text-2xl font-black text-slate-900 tracking-tight">Resource Allocation</h3>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Classroom & Infrastructure Status</p>
             </div>
             <div className="px-5 py-2.5 bg-emerald-50 border border-emerald-100 rounded-2xl text-[10px] font-black text-emerald-600 uppercase tracking-widest">Live Updates Enabled</div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             {classrooms.map((room) => (
               <motion.div 
                 key={room.id}
                 whileHover={{ scale: 1.02 }}
                 className={`p-6 rounded-[2rem] border transition-all ${
                   room.currentClass 
                     ? 'bg-white border-indigo-100 shadow-xl shadow-indigo-500/5' 
                     : 'bg-slate-50/50 border-slate-100 border-dashed opacity-60'
                 }`}
               >
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black ${
                        room.currentClass ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-500'
                      }`}>
                        {room.id}
                      </div>
                      <h4 className="font-black text-slate-800">Classroom {room.id}</h4>
                    </div>
                    {room.currentClass ? (
                       <span className="px-3 py-1.5 bg-emerald-100 text-emerald-600 text-[9px] font-black uppercase tracking-wider rounded-lg flex items-center gap-1.5">
                         <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" /> Occupied
                       </span>
                    ) : (
                       <span className="px-3 py-1.5 bg-slate-100 text-slate-400 text-[9px] font-black uppercase tracking-wider rounded-lg">Available</span>
                    )}
                  </div>

                  {room.currentClass ? (
                    <div className="space-y-4">
                       <p className="text-sm font-black text-slate-900 leading-tight">{room.currentClass.courseName}</p>
                       <div className="flex items-center gap-6">
                          <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400">
                             <User className="w-3.5 h-3.5" />
                             {data.users.find((u: any) => u.id === room.currentClass.trainerId)?.name || 'TBA'}
                          </div>
                          <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400">
                             <Clock className="w-3.5 h-3.5" />
                             Ends: {new Date(room.currentClass.endDate).toLocaleDateString()}
                          </div>
                       </div>
                    </div>
                  ) : (
                    <p className="text-xs font-bold text-slate-300 italic py-4">No active sessions scheduled for this room today.</p>
                  )}
               </motion.div>
             ))}
          </div>
        </div>

        {/* Operational Timeline */}
        <div className="glass p-10 rounded-[3rem] shadow-xl shadow-slate-200/30">
           <h3 className="text-2xl font-black text-slate-900 mb-2">Global Timeline</h3>
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-10">Cross-Department Training Log</p>
           
           <div className="space-y-8 relative">
              <div className="absolute left-4 top-2 bottom-2 w-0.5 bg-slate-100 rounded-full" />
              
              {data.trainingClasses.slice(0, 5).map((t: any, idx: number) => (
                <div key={t.id} className="relative pl-10 group">
                   <div className="absolute left-3 top-1.5 w-2.5 h-2.5 bg-white border-2 border-indigo-600 rounded-full shadow-lg group-hover:scale-125 transition-transform" />
                   <div>
                      <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-1">{new Date(t.startDate).toLocaleDateString()}</p>
                      <h4 className="text-sm font-black text-slate-900 truncate">{t.courseName}</h4>
                      <p className="text-[11px] font-bold text-slate-400 mt-1 flex items-center gap-1.5">
                         <MapPin className="w-3 h-3" /> Room {t.classroom} • <Users className="w-3 h-3" /> {t.hours}h Session
                      </p>
                   </div>
                </div>
              ))}

              {data.trainingClasses.length === 0 && (
                <div className="py-12 text-center">
                   <AlertTriangle className="w-10 h-10 text-slate-100 mx-auto mb-4" />
                   <p className="text-xs font-bold text-slate-400">No events found in timeline.</p>
                </div>
              )}
           </div>

           <button className="w-full mt-12 py-4 border-2 border-dashed border-slate-200 text-slate-400 hover:text-indigo-600 hover:border-indigo-200 transition-all rounded-2xl font-black text-xs uppercase tracking-widest">
             Audit Full Operations Log
           </button>
        </div>
      </div>

      {/* Dynamic Scheduling Modal (Operations Hub Context) */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCloseModal}
              className="absolute inset-0 bg-white/20 dark:bg-slate-900/40 backdrop-blur-xl" 
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              className="relative bg-white dark:bg-slate-900 rounded-[3.5rem] w-full max-w-3xl shadow-2xl overflow-hidden border border-white/50"
            >
               <div className="p-10 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-indigo-50/30 to-white">
                  <div className="flex items-center gap-5">
                     <div className="p-4 bg-indigo-600 rounded-[1.5rem] shadow-xl shadow-indigo-200">
                        <Calendar className="w-7 h-7 text-white" />
                     </div>
                     <div>
                        <h3 className="text-3xl font-black text-slate-900 tracking-tight">Operations Scheduler</h3>
                        <p className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.2em] mt-1">Orchestrate Course Delivery</p>
                     </div>
                  </div>
                  <button onClick={handleCloseModal} className="p-4 hover:bg-slate-100 rounded-[1.5rem] transition-all group">
                    <X className="w-7 h-7 rotate-45 text-slate-400 group-hover:rotate-0 transition-transform" />
                  </button>
               </div>

               <form onSubmit={handleSubmit} className="p-12 space-y-10 max-h-[70vh] overflow-y-auto custom-scrollbar">
                  <div className="space-y-4">
                     <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Selection: Verified Payable Opportunity</label>
                     <select 
                      required
                      value={formData.dealId}
                      onChange={e => {
                        const deal = payableDeals.find((d: any) => d.id === e.target.value);
                        setFormData({...formData, dealId: e.target.value, courseName: deal?.title.split('-')[1]?.trim() || ''});
                      }}
                      className="w-full px-6 py-5 bg-slate-50 border border-slate-200 rounded-3xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 font-bold text-slate-800 shadow-inner"
                     >
                       <option value="">Select an eligible confirmed deal...</option>
                       {payableDeals.map((d: any) => (
                         <option key={d.id} value={d.id}>{d.title} — {d.clientName}</option>
                       ))}
                     </select>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Curriculum Designation</label>
                      <input 
                        required 
                        type="text" 
                        placeholder="e.g. Data Engineering Masterclass" 
                        value={formData.courseName} 
                        onChange={e => setFormData({...formData, courseName: e.target.value})} 
                        className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none font-bold shadow-inner" 
                      />
                    </div>
                    <div className="space-y-4">
                      <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Course Workload</label>
                      <select 
                        value={formData.hours} 
                        onChange={e => setFormData({...formData, hours: Number(e.target.value), duration: `${e.target.value} Hours`})} 
                        className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none font-bold shadow-inner"
                      >
                        <option value={8}>8 Hours Short Course</option>
                        <option value={24}>24 Hours Standard</option>
                        <option value={40}>40 Hours Bootcamp</option>
                        <option value={72}>72 Hours Masterclass</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Expert Faculty Assignment</label>
                      <select 
                        required 
                        value={formData.trainerId} 
                        onChange={e => setFormData({...formData, trainerId: e.target.value})} 
                        className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none font-bold shadow-inner"
                      >
                        <option value="">Choose expert instructor...</option>
                        {trainers.map((t: any) => <option key={t.id} value={t.id}>{t.name}</option>)}
                      </select>
                    </div>
                    <div className="space-y-4">
                      <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Room Allocation</label>
                      <select 
                        value={formData.classroom} 
                        onChange={e => setFormData({...formData, classroom: e.target.value as any})} 
                        className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none font-bold shadow-inner"
                      >
                        <option value="1">Executive Room 01</option>
                        <option value="2">Executive Room 02</option>
                        <option value="3">Advanced Lab 03</option>
                        <option value="4">Innovation Center 04</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Start Date</label>
                      <input 
                        required 
                        type="date" 
                        value={formData.startDate} 
                        onChange={e => setFormData({...formData, startDate: e.target.value})} 
                        className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none font-bold shadow-inner" 
                      />
                    </div>
                    <div className="space-y-4">
                      <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">End Date</label>
                      <input 
                        required 
                        type="date" 
                        value={formData.endDate} 
                        onChange={e => setFormData({...formData, endDate: e.target.value})} 
                        className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none font-bold shadow-inner" 
                      />
                    </div>
                  </div>

                  {/* Operational Availability Preview */}
                  <AnimatePresence>
                    {formData.trainerId && formData.startDate && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`p-6 rounded-3xl border ${scheduleConflict ? 'bg-rose-50 border-rose-100' : 'bg-emerald-50 border-emerald-100'} shadow-sm`}
                      >
                         <div className="flex items-start gap-4">
                            <div className={`p-3 rounded-2xl ${scheduleConflict ? 'bg-rose-100 text-rose-600' : 'bg-emerald-100 text-emerald-600'}`}>
                               {scheduleConflict ? <AlertCircle className="w-5 h-5" /> : <ShieldCheck className="w-5 h-5" />}
                            </div>
                            <div className="flex-1">
                               <p className={`text-sm font-black uppercase tracking-widest ${scheduleConflict ? 'text-rose-700' : 'text-emerald-700'}`}>
                                  Faculty Alignment: {scheduleConflict ? 'Slot Conflict Detected' : 'Resource Optimized'}
                                </p>
                                <p className="text-xs font-medium text-slate-500 mt-1 leading-relaxed">
                                   {scheduleConflict 
                                     ? `The assigned instructor has no scheduled availability for ${new Date(formData.startDate).toLocaleDateString('en-US', {weekday: 'long'})}. Proceed with caution.`
                                     : `This schedule is in full compliance with the instructor's operational slots for the selected start date.`
                                   }
                                </p>
                            </div>
                         </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="pt-8 flex gap-6">
                     <button type="button" onClick={handleCloseModal} className="flex-1 py-5 bg-slate-100 text-slate-600 font-black rounded-3xl uppercase tracking-widest text-xs shadow-sm hover:bg-slate-200 transition-all">Discard Plan</button>
                     <button type="submit" className="flex-1 py-5 bg-indigo-600 text-white font-black rounded-3xl shadow-2xl shadow-indigo-100 hover:bg-indigo-700 transition-all uppercase tracking-widest text-xs">Authorize Batch Schedule</button>
                  </div>
               </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default OperationsManagerPage;