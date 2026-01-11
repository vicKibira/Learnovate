import React, { useState, useMemo } from 'react';
import { 
  Plus, Search, Filter, MoreVertical, Mail, Phone, 
  Calendar, User, Building, Trash2, Edit2, ChevronRight,
  Download, X, Check, Loader2, FilterX, Target, UserPlus,
  MessageSquare, MessageCircle, Send, Hash, Sparkles,
  Zap, ArrowUpRight, Globe, Layers, Shield, ChevronDown,
  Activity, Thermometer, TrendingUp, MoreHorizontal,
  CheckSquare, Square
} from 'lucide-react';
// Cast motion to any to bypass environment-specific type definition issues
import { motion as motionAny, AnimatePresence } from 'framer-motion';
const motion = motionAny as any;
import { LeadStatus } from '../types';

const LeadsPage: React.FC<{ store: any }> = ({ store }) => {
  const { data, addLead, updateLeadStatus, createDealFromLead, currentUser } = store;
  
  // UI States
  const [showAddModal, setShowAddModal] = useState(false);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
  
  // Filter & Search States
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    status: [] as string[],
    type: [] as string[],
    source: [] as string[]
  });
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    type: 'Retail' as 'Retail' | 'Corporate',
    company: '',
    source: 'LinkedIn' as any,
    protocol: 'Email' as 'Email' | 'Chat' | 'WhatsApp'
  });

  // Simplified Funnel Stats
  const funnelStats = useMemo(() => {
    const total = data.leads.length;
    const newLeads = data.leads.filter((l: any) => l.status === LeadStatus.NEW).length;
    const converted = data.leads.filter((l: any) => l.status === LeadStatus.CONVERTED).length;
    const convRate = total > 0 ? (converted / total) * 100 : 0;
    
    return [
      { label: 'Total Leads', value: total, icon: <Activity className="w-5 h-5 text-indigo-500" />, trend: '+12% this month', color: 'bg-indigo-50' },
      { label: 'New Leads', value: newLeads, icon: <Zap className="w-5 h-5 text-amber-500" />, trend: 'Needs action', color: 'bg-amber-50' },
      { label: 'Conversion Rate', value: `${convRate.toFixed(1)}%`, icon: <TrendingUp className="w-5 h-5 text-emerald-500" />, trend: 'Good progress', color: 'bg-emerald-50' },
      { label: 'Corporate Leads', value: data.leads.filter((l: any) => l.type === 'Corporate').length, icon: <Building className="w-5 h-5 text-rose-500" />, trend: 'Key focus', color: 'bg-rose-50' },
    ];
  }, [data.leads]);

  // Lead Quality Logic
  const getLeadIntelligence = (lead: any) => {
    let score = 0;
    if (lead.type === 'Corporate') score += 30;
    if (lead.source === 'LinkedIn' || lead.source === 'Referral') score += 25;
    if (lead.status === LeadStatus.INTERESTED) score += 40;
    if (lead.status === LeadStatus.CONTACTED) score += 15;
    
    const finalScore = Math.min(score, 100);
    const temperature = finalScore > 70 ? 'Hot' : finalScore > 40 ? 'Warm' : 'Cold';
    const tempColor = finalScore > 70 ? 'text-rose-500' : finalScore > 40 ? 'text-amber-500' : 'text-sky-500';
    
    return { score: finalScore, temperature, tempColor };
  };

  // Dynamic Filtering Logic
  const filteredLeads = useMemo(() => {
    return data.leads.filter((l: any) => {
      const matchesSearch = l.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            (l.company && l.company.toLowerCase().includes(searchTerm.toLowerCase())) ||
                            l.email.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = filters.status.length === 0 || filters.status.includes(l.status);
      const matchesType = filters.type.length === 0 || filters.type.includes(l.type);
      const matchesSource = filters.source.length === 0 || filters.source.includes(l.source);

      return matchesSearch && matchesStatus && matchesType && matchesSource;
    });
  }, [data.leads, searchTerm, filters]);

  const handleSelectLead = (id: string) => {
    setSelectedLeads(prev => prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]);
  };

  const handleSelectAll = () => {
    if (selectedLeads.length === filteredLeads.length) setSelectedLeads([]);
    else setSelectedLeads(filteredLeads.map((l: any) => l.id));
  };

  const handleExportLeads = async () => {
    if (filteredLeads.length === 0) {
      alert("No leads found to download.");
      return;
    }

    setIsExporting(true);
    await new Promise(resolve => setTimeout(resolve, 1200));

    try {
      const targetLeads = selectedLeads.length > 0 
        ? data.leads.filter((l: any) => selectedLeads.includes(l.id))
        : filteredLeads;

      const headers = ['Lead ID', 'Name', 'Email', 'Phone', 'Type', 'Company', 'Source', 'Status', 'Created At'];
      const rows = targetLeads.map((l: any) => [
        l.id,
        `"${l.name}"`,
        l.email,
        `"${l.phone}"`,
        l.type,
        `"${l.company || 'N/A'}"`,
        l.source,
        l.status,
        new Date(l.createdAt).toLocaleDateString()
      ]);

      const csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `Leads_List_${new Date().toISOString().split('T')[0]}.csv`);
      link.click();
    } catch (error) {
      alert("Something went wrong while downloading the file.");
    } finally {
      setIsExporting(false);
      setSelectedLeads([]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addLead({
      ...formData,
      status: LeadStatus.NEW,
      assignedTo: currentUser.id,
    });
    setShowAddModal(false);
    setFormData({ name: '', email: '', phone: '', type: 'Retail', company: '', source: 'LinkedIn', protocol: 'Email' });
  };

  const toggleFilter = (category: keyof typeof filters, value: string) => {
    setFilters(prev => {
      const current = prev[category];
      const next = current.includes(value) ? current.filter(v => v !== value) : [...current, value];
      return { ...prev, [category]: next };
    });
  };

  const activeFilterCount = filters.status.length + filters.type.length + filters.source.length;

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      {/* Stats Header */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {funnelStats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass p-8 rounded-[3rem] border border-white/60 dark:border-white/5 shadow-xl relative overflow-hidden"
          >
             <div className="flex items-center justify-between mb-6">
                <div className={`p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 shadow-inner`}>
                   {stat.icon}
                </div>
                <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">{stat.trend}</span>
             </div>
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">{stat.label}</p>
             <h3 className="text-3xl font-black text-slate-900 dark:text-white">{stat.value}</h3>
          </motion.div>
        ))}
      </div>

      {/* Main Header */}
      <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-8">
        <div className="space-y-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-indigo-600 dark:text-indigo-400 text-[10px] font-black uppercase tracking-[0.3em]"
          >
            <Sparkles className="w-3 h-3" />
            Lead Management
          </motion.div>
          <h2 className="text-6xl font-black text-slate-900 dark:text-white tracking-tighter leading-[0.9]">
            Manage <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-500">Leads</span>
          </h2>
          <p className="text-slate-500 dark:text-slate-400 font-bold text-xl max-w-2xl leading-relaxed">
            Easily track, manage, and convert your business leads in one place.
          </p>
        </div>
        
        <div className="flex flex-wrap gap-4">
          <motion.button 
            whileHover={{ scale: 1.05, y: -4 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-3 px-10 py-5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-[2rem] shadow-[0_20px_40px_-10px_rgba(0,0,0,0.3)] font-black uppercase tracking-[0.2em] text-[10px] transition-all"
          >
            <div className="p-2 bg-indigo-500 rounded-lg text-white">
              <Plus className="w-4 h-4" />
            </div>
            Add New Lead
          </motion.button>
        </div>
      </div>

      {/* Bulk Action Bar */}
      <AnimatePresence>
        {selectedLeads.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            className="fixed bottom-12 left-1/2 -translate-x-1/2 z-[150] bg-slate-900 text-white p-4 rounded-[2rem] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.5)] flex items-center gap-8 border border-white/10"
          >
             <div className="flex items-center gap-4 pl-4">
                <span className="bg-indigo-600 w-10 h-10 rounded-full flex items-center justify-center font-black text-xs shadow-lg">{selectedLeads.length}</span>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Leads Selected</p>
             </div>
             <div className="h-8 w-px bg-white/10" />
             <div className="flex items-center gap-2">
                <button onClick={handleExportLeads} className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2">
                   <Download className="w-4 h-4" /> Export Selected
                </button>
                <button className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2">
                   <Target className="w-4 h-4" /> Reassign
                </button>
                <button className="px-6 py-3 bg-rose-500/20 text-rose-400 hover:bg-rose-500 hover:text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2">
                   <Trash2 className="w-4 h-4" /> Delete Selected
                </button>
             </div>
             <button onClick={() => setSelectedLeads([])} className="p-3 hover:bg-white/10 rounded-xl text-slate-500 transition-all mr-2">
                <X className="w-5 h-5" />
             </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search and Filters */}
      <div className="glass p-8 rounded-[3.5rem] shadow-2xl border border-white/60 dark:border-white/5 flex flex-col lg:flex-row gap-8 items-center">
        <div className="flex-1 relative group w-full flex items-center gap-4">
          <button 
            onClick={handleSelectAll}
            className={`p-4 rounded-2xl transition-all ${selectedLeads.length === filteredLeads.length && filteredLeads.length > 0 ? 'bg-indigo-600 text-white' : 'bg-slate-50 dark:bg-slate-800 text-slate-300'}`}
          >
            {selectedLeads.length === filteredLeads.length && filteredLeads.length > 0 ? <CheckSquare className="w-6 h-6" /> : <Square className="w-6 h-6" />}
          </button>
          <div className="flex-1 relative">
            <Search className="w-6 h-6 absolute left-8 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-all" />
            <input 
              type="text" 
              placeholder="Search by name, company, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-20 pr-8 py-6 bg-slate-50/50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 rounded-[2rem] focus:ring-8 focus:ring-indigo-500/5 focus:border-indigo-500 outline-none font-bold transition-all dark:text-white text-lg placeholder:text-slate-300"
            />
          </div>
        </div>
        
        <div className="flex items-center gap-4 w-full lg:w-auto">
          <div className="relative">
            <motion.button 
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowFilterDropdown(!showFilterDropdown)}
              className={`flex items-center gap-3 px-8 py-6 border rounded-[2rem] font-black text-[10px] uppercase tracking-widest transition-all group ${
                activeFilterCount > 0 
                ? 'bg-indigo-600 text-white border-indigo-600 shadow-2xl shadow-indigo-200' 
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-100 dark:border-slate-700'
              }`}
            >
              <Filter className={`w-5 h-5 transition-transform ${showFilterDropdown ? 'rotate-180' : ''}`} />
              Filters
              {activeFilterCount > 0 && (
                <span className="flex items-center justify-center w-6 h-6 bg-white text-indigo-600 rounded-full text-[10px] font-black shadow-sm ml-1">
                  {activeFilterCount}
                </span>
              )}
              <ChevronDown className={`w-4 h-4 ml-1 opacity-50 group-hover:opacity-100 transition-all ${showFilterDropdown ? 'rotate-180' : ''}`} />
            </motion.button>

            <AnimatePresence>
              {showFilterDropdown && (
                <motion.div 
                  initial={{ opacity: 0, y: 20, scale: 0.95, filter: 'blur(10px)' }}
                  animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, y: 20, scale: 0.95, filter: 'blur(10px)' }}
                  className="absolute top-full mt-6 right-0 w-[640px] bg-white dark:bg-slate-900 rounded-[3rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.25)] border border-slate-100 dark:border-white/5 p-12 z-[100] backdrop-blur-3xl"
                >
                  <div className="flex items-center justify-between mb-10">
                     <div>
                       <h4 className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter">Filter Leads</h4>
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Narrow down your lead list</p>
                     </div>
                     <button onClick={() => setFilters({status:[], type:[], source:[]})} className="px-6 py-3 bg-rose-50 dark:bg-rose-500/10 text-rose-500 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-500 hover:text-white transition-all flex items-center gap-2">
                       <FilterX className="w-4 h-4" /> Clear Filters
                     </button>
                  </div>

                  <div className="space-y-12">
                    {/* Category: Status */}
                    <div>
                      <div className="flex items-center justify-between mb-6 px-2">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] flex items-center gap-2">
                          <Activity className="w-3.5 h-3.5 text-indigo-500" /> Status
                        </p>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {Object.values(LeadStatus).map(s => {
                          const isActive = filters.status.includes(s);
                          return (
                            <button 
                              key={s}
                              onClick={() => toggleFilter('status', s)}
                              className={`flex items-center justify-between px-5 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border-2 ${
                                isActive 
                                ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-500/20' 
                                : 'bg-slate-50 dark:bg-slate-800/50 text-slate-400 border-transparent hover:border-slate-200 dark:hover:border-slate-700'
                              }`}
                            >
                              <span className="truncate mr-2">{s}</span>
                              {isActive && <Check className="w-3.5 h-3.5 flex-shrink-0" />}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                      {/* Category: Type */}
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] flex items-center gap-2 mb-6 px-2">
                          <Layers className="w-3.5 h-3.5 text-emerald-500" /> Lead Type
                        </p>
                        <div className="grid grid-cols-1 gap-3">
                          {['Retail', 'Corporate'].map(type => {
                            const isActive = filters.type.includes(type);
                            return (
                              <button 
                                key={type}
                                onClick={() => toggleFilter('type', type)}
                                className={`flex items-center justify-between px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border-2 ${
                                  isActive 
                                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-lg shadow-emerald-500/20' 
                                  : 'bg-slate-50 dark:bg-slate-800/50 text-slate-400 border-transparent hover:border-slate-200 dark:hover:border-slate-700'
                                }`}
                              >
                                {type}
                                {isActive && <Check className="w-3.5 h-3.5" />}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Category: Source */}
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] flex items-center gap-2 mb-6 px-2">
                          <Globe className="w-3.5 h-3.5 text-amber-500" /> Lead Source
                        </p>
                        <div className="grid grid-cols-1 gap-3">
                          {['LinkedIn', 'Email', 'Referral', 'Call'].map(src => {
                            const isActive = filters.source.includes(src);
                            return (
                              <button 
                                key={src}
                                onClick={() => toggleFilter('source', src)}
                                className={`flex items-center justify-between px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border-2 ${
                                  isActive 
                                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-500/20' 
                                  : 'bg-slate-50 dark:bg-slate-800/50 text-slate-400 border-transparent hover:border-slate-200 dark:hover:border-slate-700'
                                }`}
                              >
                                {src}
                                {isActive && <Check className="w-3.5 h-3.5" />}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-12 pt-8 border-t border-slate-100 dark:border-white/5">
                    <button 
                      onClick={() => setShowFilterDropdown(false)}
                      className="w-full py-5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-[2rem] font-black text-[10px] uppercase tracking-widest shadow-xl transition-all hover:bg-indigo-600 dark:hover:bg-indigo-500"
                    >
                      Apply Filters
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={isExporting}
            onClick={handleExportLeads}
            className={`flex items-center gap-3 px-10 py-6 rounded-[2rem] font-black text-[10px] uppercase tracking-widest transition-all shadow-xl ${
              isExporting 
              ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
              : 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 hover:bg-indigo-600 dark:hover:bg-indigo-500'
            }`}
          >
            {isExporting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Download className="w-5 h-5" />}
            {isExporting ? 'Preparing...' : 'Download List'}
          </motion.button>
        </div>
      </div>

      {/* Leads List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-8">
        <AnimatePresence mode="popLayout">
          {filteredLeads.map((lead: any, idx: number) => {
            const isSelected = selectedLeads.includes(lead.id);
            const intel = getLeadIntelligence(lead);
            return (
              <motion.div
                key={lead.id}
                layout
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: idx * 0.05, duration: 0.5 }}
                className="group relative"
              >
                <div className={`glass p-10 rounded-[4rem] shadow-xl hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.1)] transition-all duration-700 border flex flex-col h-full overflow-hidden ${isSelected ? 'border-indigo-500 ring-2 ring-indigo-500/20 ring-offset-4 dark:ring-offset-slate-950' : 'border-white/60 dark:border-white/5'}`}>
                  
                  {/* Selection Indicator */}
                  <button 
                    onClick={() => handleSelectLead(lead.id)}
                    className={`absolute top-8 left-8 p-3 rounded-2xl transition-all z-10 ${isSelected ? 'bg-indigo-600 text-white shadow-lg' : 'bg-slate-50 dark:bg-slate-800 text-slate-200 group-hover:text-slate-400'}`}
                  >
                    {isSelected ? <CheckSquare className="w-5 h-5" /> : <Square className="w-5 h-5" />}
                  </button>

                  <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/5 blur-[100px] -mr-12 -mt-12 group-hover:bg-indigo-500/10 transition-colors" />
                  
                  <div className="flex items-start justify-between mb-8 pl-12">
                    <div className="flex flex-col gap-1">
                      <span className={`px-4 py-2 rounded-2xl text-[9px] font-black uppercase tracking-[0.2em] shadow-sm ${
                        lead.status === LeadStatus.NEW ? 'bg-indigo-50 text-indigo-600' :
                        lead.status === LeadStatus.CONVERTED ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-400'
                      }`}>
                        {lead.status}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <div className={`px-3 py-2 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex items-center gap-2 shadow-sm`}>
                         <Thermometer className={`w-4 h-4 ${intel.tempColor}`} />
                         <span className={`text-[10px] font-black uppercase tracking-widest ${intel.tempColor}`}>{intel.temperature}</span>
                      </div>
                      <button className="p-3 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 text-slate-400 hover:text-indigo-600 transition-all shadow-sm"><MoreHorizontal className="w-4 h-4" /></button>
                    </div>
                  </div>

                  <div className="flex flex-col items-center text-center mb-10">
                    <div className="relative mb-8 group-hover:scale-105 transition-transform duration-500">
                      <div className="w-28 h-28 rounded-[3rem] bg-gradient-to-br from-indigo-500 to-violet-600 p-1 shadow-2xl relative overflow-hidden">
                        <div className="w-full h-full bg-white dark:bg-slate-900 rounded-[2.8rem] flex items-center justify-center text-4xl font-black text-indigo-600 overflow-hidden">
                          {lead.avatar ? <img src={lead.avatar} className="w-full h-full object-cover" /> : lead.name.charAt(0)}
                        </div>
                      </div>
                      <div className="absolute -bottom-2 -right-2 p-3 bg-white dark:border-slate-800 rounded-2xl shadow-xl border border-slate-50 dark:border-slate-700">
                        {lead.type === 'Corporate' ? <Building className="w-5 h-5 text-indigo-500" /> : <User className="w-5 h-5 text-indigo-500" />}
                      </div>
                    </div>
                    <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight group-hover:text-indigo-600 transition-colors leading-none">{lead.name}</h3>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-3">{lead.company || 'Private Customer'}</p>
                  </div>

                  {/* Lead Quality Indicator */}
                  <div className="mb-10 space-y-3">
                     <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
                        <span className="text-slate-400">Chance of Closing</span>
                        <span className="text-indigo-600">{intel.score}%</span>
                     </div>
                     <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden p-0.5">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${intel.score}%` }}
                          className={`h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]`}
                        />
                     </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-10">
                    <div className="p-5 bg-slate-50/50 dark:bg-slate-800/50 rounded-[2rem] border border-slate-100 dark:border-slate-700 flex flex-col gap-1 hover:bg-white dark:hover:bg-slate-800 transition-all group/pill">
                      <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Preferred Contact</span>
                      <div className="flex items-center gap-2 mt-1">
                        {lead.protocol === 'WhatsApp' ? <MessageCircle className="w-4 h-4 text-emerald-500" /> : 
                         lead.protocol === 'Chat' ? <MessageSquare className="w-4 h-4 text-sky-500" /> : 
                         <Mail className="w-4 h-4 text-indigo-500" />}
                        <span className="text-[11px] font-black text-slate-700 dark:text-slate-300 uppercase group-hover/pill:text-indigo-600">{lead.protocol || 'Email'}</span>
                      </div>
                    </div>
                    <div className="p-5 bg-slate-50/50 dark:bg-slate-800/50 rounded-[2rem] border border-slate-100 dark:border-slate-700 flex flex-col gap-1 hover:bg-white dark:hover:bg-slate-800 transition-all group/pill">
                      <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Source</span>
                      <div className="flex items-center gap-2 mt-1">
                        <Zap className="w-4 h-4 text-amber-500" />
                        <span className="text-[11px] font-black text-slate-700 dark:text-slate-300 uppercase group-hover/pill:text-indigo-600">{lead.source}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 mb-10 text-center bg-slate-50/30 dark:bg-slate-800/20 p-6 rounded-[2.5rem] border border-slate-100/50 dark:border-white/5">
                    <div className="flex items-center justify-center gap-3 text-sm font-bold text-slate-500 dark:text-slate-400 group/link cursor-pointer">
                      <Mail className="w-4 h-4 text-slate-300 group-hover/link:text-indigo-500 transition-colors" /> <span className="group-hover/link:text-slate-900 dark:group-hover/link:text-white transition-colors">{lead.email}</span>
                    </div>
                    <div className="flex items-center justify-center gap-3 text-sm font-bold text-slate-500 dark:text-slate-400 group/link cursor-pointer">
                      <Phone className="w-4 h-4 text-slate-300 group-hover/link:text-indigo-500 transition-colors" /> <span className="group-hover/link:text-slate-900 dark:group-hover/link:text-white transition-colors">{lead.phone}</span>
                    </div>
                  </div>

                  <div className="mt-auto pt-6 flex gap-3">
                    {lead.status !== LeadStatus.CONVERTED ? (
                      <motion.button 
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => createDealFromLead(lead.id, 5000)}
                        className="flex-1 py-5 bg-indigo-600 text-white rounded-[2rem] font-black text-[10px] uppercase tracking-widest shadow-2xl shadow-indigo-200 hover:bg-indigo-700 transition-all flex items-center justify-center gap-3"
                      >
                        <Zap className="w-4 h-4 fill-white" /> Convert to Deal
                      </motion.button>
                    ) : (
                      <div className="flex-1 py-5 bg-emerald-500/10 text-emerald-600 rounded-[2rem] font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-3 border border-emerald-500/20">
                        <Check className="w-4 h-4" /> Lead Converted
                      </div>
                    )}
                    <button className="p-5 bg-white dark:bg-slate-800 rounded-[2rem] border border-slate-100 dark:border-slate-700 text-slate-300 hover:text-rose-500 hover:border-rose-200 transition-all shadow-sm">
                       <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {filteredLeads.length === 0 && (
          <div className="col-span-full py-60 text-center flex flex-col items-center gap-10">
            <div className="w-32 h-32 bg-slate-100 dark:bg-slate-800 rounded-[3rem] flex items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-700">
               <Target className="w-12 h-12 text-slate-300" />
            </div>
            <div>
              <p className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">No leads found</p>
              <p className="text-xl text-slate-400 font-bold mt-4 uppercase tracking-[0.2em]">Try changing your search or filters</p>
            </div>
          </div>
        )}
      </div>

      {/* Add New Lead Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 overflow-y-auto">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddModal(false)}
              className="absolute inset-0 bg-white/20 dark:bg-slate-900/40 backdrop-blur-xl" 
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 30, filter: 'blur(20px)' }}
              animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              className="bg-white dark:bg-slate-900 rounded-[4rem] w-full max-w-2xl shadow-[0_100px_200px_-50px_rgba(0,0,0,0.5)] overflow-hidden border border-white/20 relative"
            >
              <div className="p-12 border-b border-slate-100 dark:border-white/5 flex items-center justify-between bg-gradient-to-r from-indigo-50/50 to-white dark:from-slate-800/50 dark:to-slate-900">
                <div className="flex items-center gap-8">
                   <div className="w-20 h-20 bg-slate-900 rounded-[2rem] flex items-center justify-center text-white shadow-2xl">
                      <UserPlus className="w-10 h-10" />
                   </div>
                   <div>
                     <h3 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">Add New Lead</h3>
                     <p className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.3em] mt-2">Enter lead information below</p>
                   </div>
                </div>
                <button onClick={() => setShowAddModal(false)} className="p-6 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-3xl transition-all group">
                  <X className="w-8 h-8 group-hover:rotate-90 transition-transform text-slate-400" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-12 space-y-10 max-h-[70vh] overflow-y-auto custom-scrollbar">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 flex items-center gap-2">
                      <User className="w-3 h-3" /> Full Name
                    </label>
                    <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-8 py-5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl outline-none focus:ring-8 focus:ring-indigo-500/5 focus:border-indigo-500 font-bold dark:text-white text-lg" placeholder="Johnathan Wick" />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 flex items-center gap-2">
                      <Layers className="w-3 h-3" /> Lead Category
                    </label>
                    <div className="flex p-1.5 bg-slate-50 dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700">
                      {['Retail', 'Corporate'].map(t => (
                        <button 
                          key={t}
                          type="button"
                          onClick={() => setFormData({...formData, type: t as any})}
                          className={`flex-1 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${formData.type === t ? 'bg-white dark:bg-slate-700 shadow-xl text-indigo-600 dark:text-white' : 'text-slate-400'}`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 flex items-center gap-2">
                    <Send className="w-3 h-3" /> Contact Method
                  </label>
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { id: 'Email', icon: <Mail className="w-5 h-5" />, color: 'text-indigo-500' },
                      { id: 'Chat', icon: <MessageSquare className="w-5 h-5" />, color: 'text-sky-500' },
                      { id: 'WhatsApp', icon: <MessageCircle className="w-5 h-5" />, color: 'text-emerald-500' }
                    ].map((p: any) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => setFormData({...formData, protocol: p.id as any})}
                        className={`p-6 rounded-[2rem] border-2 transition-all flex flex-col items-center gap-3 ${
                          formData.protocol === p.id 
                          ? 'border-indigo-500 bg-indigo-50/30 dark:bg-indigo-500/10' 
                          : 'border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800'
                        }`}
                      >
                        <div className={`p-3 rounded-2xl bg-white dark:bg-slate-700 shadow-sm ${p.color}`}>{p.icon}</div>
                        <span className={`text-[10px] font-black uppercase tracking-widest ${formData.protocol === p.id ? 'text-indigo-600' : 'text-slate-400'}`}>{p.id}</span>
                      </button>
                    ))}
                  </div>
                  <input 
                    required 
                    type={formData.protocol === 'Email' ? 'email' : 'text'} 
                    value={formData.email} 
                    onChange={e => setFormData({...formData, email: e.target.value})} 
                    className="w-full px-8 py-5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl outline-none focus:ring-8 focus:ring-indigo-500/5 focus:border-indigo-500 font-bold dark:text-white text-lg" 
                    placeholder={formData.protocol === 'Email' ? 'name@domain.com' : formData.protocol === 'Chat' ? 'Social handle or username' : '+1 (555) 000-0000'} 
                  />
                </div>

                {formData.type === 'Corporate' && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 flex items-center gap-2">
                      <Building className="w-3 h-3" /> Company Name
                    </label>
                    <input required type="text" value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})} className="w-full px-8 py-5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl outline-none focus:ring-8 focus:ring-indigo-500/5 focus:border-indigo-500 font-bold dark:text-white text-lg" placeholder="Company Ltd." />
                  </motion.div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 flex items-center gap-2">
                      <Phone className="w-3 h-3" /> Phone Number
                    </label>
                    <input required type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full px-8 py-5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl outline-none focus:ring-8 focus:ring-indigo-500/5 focus:border-indigo-500 font-bold dark:text-white text-lg" placeholder="+1..." />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 flex items-center gap-2">
                      <Globe className="w-3 h-3" /> How did they find us?
                    </label>
                    <select value={formData.source} onChange={e => setFormData({...formData, source: e.target.value as any})} className="w-full px-8 py-5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl outline-none focus:ring-8 focus:ring-indigo-500/5 focus:border-indigo-500 font-black dark:text-white uppercase tracking-widest text-[10px] appearance-none">
                      <option value="LinkedIn">LinkedIn</option>
                      <option value="Email">Direct Email</option>
                      <option value="Referral">Referral</option>
                      <option value="Call">Phone Call</option>
                    </select>
                  </div>
                </div>

                <div className="pt-10 flex gap-6">
                  <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 py-6 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-black rounded-3xl uppercase tracking-widest text-[11px] hover:bg-slate-200 transition-all">Cancel</button>
                  <button type="submit" className="flex-1 py-6 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black rounded-3xl shadow-[0_20px_40px_-10px_rgba(0,0,0,0.3)] dark:shadow-none hover:bg-indigo-600 dark:hover:bg-indigo-500 transition-all uppercase tracking-widest text-[11px]">Save Lead</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LeadsPage;