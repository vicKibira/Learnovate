
import React, { useState, useMemo } from 'react';
import { 
  BookOpen, Folder, FileText, Plus, Search, 
  MoreVertical, Download, ExternalLink, Trash2, 
  Layers, Database, Zap, Sparkles, Filter,
  CheckCircle, Clock, Share2, Upload, FileCode,
  LayoutGrid, List, FileArchive, ArrowUpRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CurriculumHub: React.FC<{ store: any }> = ({ store }) => {
  const { data, currentUser } = store;
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Filter courses assigned to this trainer
  const trainerCourses = useMemo(() => {
    const batches = data.trainingClasses.filter((t: any) => t.trainerId === currentUser.id);
    return Array.from(new Set(batches.map((b: any) => b.courseName)));
  }, [data.trainingClasses, currentUser.id]);

  const mockResources = [
    { id: '1', name: 'Python Basics - Day 1 Slides', type: 'PDF', course: 'Python Advanced', date: '2024-03-15', size: '2.4 MB' },
    { id: '2', name: 'Machine Learning Sandbox', type: 'CODE', course: 'ML Mastery', date: '2024-03-18', size: '15 KB' },
    { id: '3', name: 'Final Assessment Quiz', type: 'DOC', course: 'Python Advanced', date: '2024-03-20', size: '1.1 MB' },
    { id: '4', name: 'Reference Architectures', type: 'ARCHIVE', course: 'AWS Essentials', date: '2024-03-22', size: '45 MB' },
  ];

  const filteredResources = mockResources.filter(r => 
    r.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    r.course.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-10 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex items-center gap-2 mb-3">
             <div className="w-10 h-1 bg-indigo-500 rounded-full" />
             <span className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.4em]">Asset Management</span>
          </motion.div>
          <h2 className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter">
            Digital <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-500">Curriculum</span>
          </h2>
          <p className="text-slate-500 dark:text-slate-400 font-bold text-lg mt-3">Orchestrating high-impact learning materials and technical resources.</p>
        </div>
        <div className="flex gap-4">
           <motion.button 
             whileHover={{ scale: 1.05, y: -4 }}
             whileTap={{ scale: 0.95 }}
             className="px-8 py-5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-[2rem] font-black uppercase tracking-widest text-[10px] shadow-2xl flex items-center gap-3 transition-all"
           >
             <Upload className="w-5 h-5" />
             Import Material
           </motion.button>
        </div>
      </div>

      {/* Analytics Brief */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { label: 'Active Courses', value: trainerCourses.length, icon: <Layers className="w-6 h-6 text-indigo-600" />, color: 'bg-indigo-50' },
          { label: 'Cloud Storage', value: '1.2 GB', icon: <Database className="w-6 h-6 text-emerald-600" />, color: 'bg-emerald-50' },
          { label: 'Resource Views', value: '1,240', icon: <Zap className="w-6 h-6 text-amber-600" />, color: 'bg-amber-50' },
        ].map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/40 border border-white/60 dark:border-white/5 relative overflow-hidden group"
          >
            <div className="flex items-center justify-between mb-6">
               <div className={`p-4 rounded-2xl ${stat.color} shadow-sm border border-white/50`}>
                 {stat.icon}
               </div>
               <Sparkles className="w-4 h-4 text-slate-200 dark:text-slate-700" />
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
            <h3 className="text-3xl font-black text-slate-900 dark:text-white">{stat.value}</h3>
          </motion.div>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="glass p-10 rounded-[3rem] shadow-xl shadow-slate-200/30 dark:shadow-none border border-white/60 dark:border-white/5">
        {/* Toolbar */}
        <div className="flex flex-col lg:flex-row gap-6 items-center justify-between mb-12">
           <div className="flex-1 relative group w-full">
              <Search className="w-6 h-6 absolute left-8 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-all" />
              <input 
                type="text" 
                placeholder="Query materials, course tags, or assessment keys..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-20 pr-8 py-6 bg-slate-50/50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 rounded-[2rem] focus:ring-8 focus:ring-indigo-500/5 focus:border-indigo-400 outline-none font-bold transition-all dark:text-white text-lg"
              />
           </div>
           <div className="flex items-center gap-4">
              <div className="flex bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-700">
                <button onClick={() => setViewMode('grid')} className={`p-3 rounded-xl transition-all ${viewMode === 'grid' ? 'bg-white dark:bg-slate-700 shadow-sm text-indigo-600' : 'text-slate-400'}`}><LayoutGrid className="w-5 h-5" /></button>
                <button onClick={() => setViewMode('list')} className={`p-3 rounded-xl transition-all ${viewMode === 'list' ? 'bg-white dark:bg-slate-700 shadow-sm text-indigo-600' : 'text-slate-400'}`}><List className="w-5 h-5" /></button>
              </div>
           </div>
        </div>

        {/* Directory Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
          {/* Folders */}
          {trainerCourses.map((course: any) => (
            <motion.div 
              whileHover={{ y: -8, scale: 1.02 }}
              key={course}
              className="p-8 bg-white dark:bg-slate-800 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 shadow-xl group cursor-pointer"
            >
              <div className="flex items-start justify-between mb-6">
                <div className="p-4 bg-amber-50 dark:bg-amber-500/10 rounded-2xl text-amber-500 group-hover:bg-amber-500 group-hover:text-white transition-all">
                  <Folder className="w-8 h-8 fill-current" />
                </div>
                <MoreVertical className="w-5 h-5 text-slate-300" />
              </div>
              <h4 className="text-xl font-black text-slate-900 dark:text-white truncate">{course}</h4>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">12 Active Resources</p>
              <div className="mt-8 flex items-center justify-between">
                 <div className="flex -space-x-2">
                   {[1, 2].map(i => <div key={i} className="w-6 h-6 rounded-full border-2 border-white dark:border-slate-800 bg-slate-100" />)}
                 </div>
                 <ArrowUpRight className="w-5 h-5 text-indigo-500 opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0" />
              </div>
            </motion.div>
          ))}

          {/* Files */}
          {filteredResources.map((file) => (
            <motion.div 
              key={file.id}
              whileHover={{ y: -8 }}
              className="p-8 bg-slate-50 dark:bg-slate-900/40 rounded-[2.5rem] border border-transparent hover:border-indigo-100 dark:hover:border-indigo-500/20 transition-all flex flex-col group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="p-2 bg-white dark:bg-slate-800 rounded-xl shadow-lg text-slate-400 hover:text-indigo-600"><Download className="w-4 h-4" /></button>
              </div>
              <div className="flex items-center gap-4 mb-6">
                 {file.type === 'PDF' && <FileText className="w-10 h-10 text-rose-500" />}
                 {file.type === 'CODE' && <FileCode className="w-10 h-10 text-indigo-500" />}
                 {file.type === 'DOC' && <FileText className="w-10 h-10 text-blue-500" />}
                 {file.type === 'ARCHIVE' && <FileArchive className="w-10 h-10 text-amber-500" />}
              </div>
              <h4 className="text-lg font-black text-slate-900 dark:text-white truncate mb-1">{file.name}</h4>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{file.course} • {file.size}</p>
              <div className="mt-auto pt-6 flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-400">{new Date(file.date).toLocaleDateString()}</span>
                <button className="text-[10px] font-black text-indigo-500 uppercase tracking-widest hover:underline">Quick Preview</button>
              </div>
            </motion.div>
          ))}

          {/* Add New Trigger */}
          <motion.button 
            whileHover={{ scale: 0.98 }}
            className="p-8 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-[2.5rem] flex flex-col items-center justify-center text-slate-400 hover:border-indigo-400 hover:text-indigo-500 transition-all group"
          >
            <div className="w-12 h-12 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center mb-4 group-hover:bg-indigo-50 transition-all">
              <Plus className="w-6 h-6" />
            </div>
            <span className="text-xs font-black uppercase tracking-widest">Create Module</span>
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default CurriculumHub;
