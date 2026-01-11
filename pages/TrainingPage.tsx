import React, { useState, useMemo } from 'react';
import { 
  Calendar, Clock, MapPin, User, CheckCircle2, 
  AlertTriangle, Filter, Plus, BookOpen, UserPlus,
  ShieldCheck, AlertCircle, Info, Zap, X
} from 'lucide-react';
// Cast motion to any to bypass environment-specific type definition issues
import { motion as motionAny, AnimatePresence } from 'framer-motion';
const motion = motionAny as any;
import { TrainingStatus, UserRole } from '../types';

const TrainingPage: React.FC<{ store: any }> = ({ store }) => {
  const { data, scheduleTraining, currentUser } = store;
  const [showAdd, setShowAdd] = useState(false);

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

  const canManage = [UserRole.DIRECTOR, UserRole.TRAINING_MANAGER, UserRole.OPERATIONS_MANAGER].includes(currentUser.role);
  
  // Only show deals that are paid but NOT yet scheduled
  const payableDeals = data.deals.filter((d: any) => d.isPaid && !data.trainingClasses.find((t: any) => t.dealId === d.id));
  const trainers = data.users.filter((u: any) => u.role === UserRole.TRAINER);

  const selectedTrainerProfile = useMemo(() => {
    if (!formData.trainerId) return null;
    return data.trainerProfiles.find((p: any) => p.userId === formData.trainerId);
  }, [formData.trainerId, data.trainerProfiles]);

  const scheduleConflict = useMemo(() => {
    if (!formData.startDate || !formData.trainerId || !selectedTrainerProfile) return null;
    const start = new Date(formData.startDate);
    const dayName = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][start.getDay()];
    const hasSlot = selectedTrainerProfile.availabilitySlots?.some((s: any) => s.day === dayName);
    
    return !hasSlot;
  }, [formData.startDate, formData.trainerId, selectedTrainerProfile]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    scheduleTraining(formData.dealId, {
      ...formData,
      status: TrainingStatus.PLANNED,
    });
    setShowAdd(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <div className="p-3 bg-indigo-600 rounded-2xl shadow-xl shadow-indigo-200">
                <Calendar className="w-8 h-8 text-white" />
            </div>
            Operations & Training
          </h2>
          <p className="text-slate-500 font-medium mt-2">Manage course deliveries, resource scheduling, and trainer assignments.</p>
        </div>
        {canManage && (
          <motion.button 
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAdd(true)}
            className="flex items-center gap-3 px-8 py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-2xl shadow-slate-200 hover:bg-indigo-600 transition-all"
          >
            <Plus className="w-5 h-5" />
            New Training Batch
          </motion.button>
        )}
      </div>

      {/* Dynamic Operational Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { label: 'Ongoing Sessions', value: data.trainingClasses.filter((t: any) => t.status === TrainingStatus.ONGOING).length, icon: <BookOpen className="w-6 h-6 text-emerald-600" />, bg: 'bg-emerald-50' },
          { label: 'Upcoming This Week', value: data.trainingClasses.filter((t: any) => t.status === TrainingStatus.CONFIRMED).length, icon: <Clock className="w-6 h-6 text-indigo-600" />, bg: 'bg-indigo-50' },
          { label: 'Action Required', value: payableDeals.length, icon: <AlertTriangle className="w-6 h-6 text-rose-600" />, bg: 'bg-rose-50', sub: 'Paid deals waiting' },
        ].map((stat: any, i: number) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/40 border border-white/60"
          >
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">{stat.label}</p>
            <div className="flex items-center justify-between">
              <h3 className={`text-4xl font-black ${stat.label === 'Action Required' && stat.value > 0 ? 'text-rose-600 animate-pulse' : 'text-slate-900'} tracking-tighter`}>{stat.value}</h3>
              <div className={`p-4 rounded-2xl ${stat.bg} shadow-sm border border-white/50`}>{stat.icon}</div>
            </div>
            {stat.sub && <p className="text-[10px] font-bold text-slate-400 mt-4 uppercase tracking-widest">{stat.sub}</p>}
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <AnimatePresence mode="popLayout">
          {data.trainingClasses.map((t: any) => (
            <motion.div 
              key={t.id} 
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/20 overflow-hidden flex flex-col group transition-all hover:shadow-2xl hover:-translate-y-1"
            >
              <div className="p-10">
                <div className="flex items-start justify-between mb-8">
                  <div className="flex items-center gap-4">
                     <div className="p-4 bg-indigo-50 rounded-[1.5rem] group-hover:bg-indigo-600 group-hover:text-white transition-all">
                        <Zap className="w-6 h-6" />
                     </div>
                     <div>
                        <h3 className="text-2xl font-black text-slate-900 tracking-tight leading-none">{t.courseName}</h3>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2 flex items-center gap-2">
                           BATCH {t.id} <div className="w-1 h-1 bg-slate-300 rounded-full" /> {t.duration}
                        </p>
                     </div>
                  </div>
                  <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-[0.1em] shadow-sm border ${
                    t.status === TrainingStatus.ONGOING ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                    t.status === TrainingStatus.COMPLETED ? 'bg-slate-50 text-slate-500 border-slate-100' :
                    'bg-indigo-50 text-indigo-600 border-indigo-100'
                  }`}>
                    {t.status}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-10 mb-10">
                  <div className="space-y-6">
                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-indigo-500" />
                      <div>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Training Window</p>
                        <p className="text-sm font-black text-slate-800 mt-0.5">{new Date(t.startDate).toLocaleDateString()} - {new Date(t.endDate).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <MapPin className="w-5 h-5 text-indigo-500" />
                      <div>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Resource Lab</p>
                        <p className="text-sm font-black text-slate-800 mt-0.5">Executive Suite {t.classroom}</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div className="flex items-center gap-3">
                      <User className="w-5 h-5 text-indigo-500" />
                      <div>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Assigned Expert</p>
                        <p className="text-sm font-black text-slate-800 mt-0.5">{data.users.find((u: any) => u.id === t.trainerId)?.name || 'Lead Instructor'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-indigo-500" />
                      <div>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Workload</p>
                        <p className="text-sm font-black text-slate-800 mt-0.5">{t.hours} Total Hours</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-8 border-t border-slate-100">
                   <div className="flex -space-x-3">
                      {[1, 2, 3, 4].map(i => (
                        <div key={i} className="w-10 h-10 rounded-2xl border-4 border-white bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-500 shadow-sm">
                          L{i}
                        </div>
                      ))}
                      <div className="w-10 h-10 rounded-2xl border-4 border-white bg-indigo-600 flex items-center justify-center text-[10px] font-black text-white shadow-lg">
                        +8
                      </div>
                   </div>
                   <motion.button 
                     whileHover={{ scale: 1.02 }}
                     whileTap={{ scale: 0.98 }}
                     className="flex items-center gap-2.5 px-6 py-3 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-xl shadow-slate-100"
                   >
                     <UserPlus className="w-4 h-4" /> Manage Attendees
                   </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {data.trainingClasses.length === 0 && (
          <div className="col-span-full py-40 bg-white rounded-[3.5rem] border-3 border-dashed border-slate-100 flex flex-col items-center justify-center text-slate-400 gap-6">
             <div className="w-24 h-24 bg-slate-50 rounded-[2.5rem] flex items-center justify-center border border-slate-100">
                <Calendar className="w-12 h-12 text-slate-200" />
             </div>
             <div className="text-center">
                <p className="text-2xl font-black text-slate-800 tracking-tight">System Operational Idle</p>
                <p className="text-sm font-bold text-slate-400 mt-2">No training classes are currently active or scheduled.</p>
             </div>
          </div>
        )}
      </div>

      {/* Modern Scheduling Modal */}
      <AnimatePresence>
        {showAdd && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAdd(false)}
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
                        <h3 className="text-3xl font-black text-slate-900 tracking-tight">Class Orchestrator</h3>
                        <p className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.2em] mt-1">Configure delivery schedule</p>
                     </div>
                  </div>
                  <button onClick={() => setShowAdd(false)} className="p-4 hover:bg-slate-100 rounded-[1.5rem] transition-all group">
                    <X className="w-7 h-7 rotate-45 text-slate-400 group-hover:rotate-0 transition-transform" />
                  </button>
               </div>

               <form onSubmit={handleSubmit} className="p-12 space-y-10 max-h-[70vh] overflow-y-auto custom-scrollbar">
                  <div className="space-y-4">
                     <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Selection: Confirmed Business Opportunity</label>
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
                      <input required type="text" placeholder="e.g. Advanced Python for Data Science" value={formData.courseName} onChange={e => setFormData({...formData, courseName: e.target.value})} className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none font-bold shadow-inner" />
                    </div>
                    <div className="space-y-4">
                      <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Engagement Hours</label>
                      <select value={formData.hours} onChange={e => setFormData({...formData, hours: Number(e.target.value), duration: `${e.target.value} Hours`})} className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none font-bold shadow-inner">
                        <option value={8}>8 Hours Engagement</option>
                        <option value={24}>24 Hours Standard</option>
                        <option value={40}>40 Hours Intensive</option>
                        <option value={72}>72 Hours Masterclass</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Instructor Assignment</label>
                      <select required value={formData.trainerId} onChange={e => setFormData({...formData, trainerId: e.target.value})} className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none font-bold shadow-inner">
                        <option value="">Choose available trainer...</option>
                        {trainers.map((t: any) => <option key={t.id} value={t.id}>{t.name}</option>)}
                      </select>
                    </div>
                    <div className="space-y-4">
                      <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Facility Allocation</label>
                      <select value={formData.classroom} onChange={e => setFormData({...formData, classroom: e.target.value as any})} className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none font-bold shadow-inner">
                        <option value="1">Executive Room 01</option>
                        <option value="2">Executive Room 02</option>
                        <option value="3">Advanced Lab 03</option>
                        <option value="4">Innovation Center 04</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Session Inception</label>
                      <input required type="date" value={formData.startDate} onChange={e => setFormData({...formData, startDate: e.target.value})} className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none font-bold shadow-inner" />
                    </div>
                    <div className="space-y-4">
                      <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Projected Completion</label>
                      <input required type="date" value={formData.endDate} onChange={e => setFormData({...formData, endDate: e.target.value})} className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none font-bold shadow-inner" />
                    </div>
                  </div>

                  {/* High-Fidelity Availability Preview */}
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
                                  Schedule Alignment: {scheduleConflict ? 'Non-Compliant' : 'Optimal'}
                                </p>
                                <p className="text-xs font-medium text-slate-500 mt-1 leading-relaxed">
                                   {scheduleConflict 
                                     ? `Alert: The selected trainer is not typically available on ${new Date(formData.startDate).toLocaleDateString('en-US', {weekday: 'long'})}s according to their registry profile.`
                                     : `Confirmed: This schedule aligns perfectly with the instructor's preferred operational hours.`
                                   }
                                </p>
                            </div>
                         </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="pt-8 flex gap-6">
                     <button type="button" onClick={() => setShowAdd(false)} className="flex-1 py-5 bg-slate-100 text-slate-600 font-black rounded-3xl uppercase tracking-widest text-xs shadow-sm hover:bg-slate-200 transition-all">Abort Schedule</button>
                     <button type="submit" className="flex-1 py-5 bg-indigo-600 text-white font-black rounded-3xl shadow-2xl shadow-indigo-100 hover:bg-indigo-700 transition-all uppercase tracking-widest text-xs">Finalize Batch Creation</button>
                  </div>
               </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TrainingPage;