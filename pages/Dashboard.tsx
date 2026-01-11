
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
  UserPlus, Mail, Phone
} from 'lucide-react';
import { UserRole, DealStage, LeadStatus } from '../types';
import { motion as motionAny, AnimatePresence } from 'framer-motion';

const motion = motionAny as any;

const Dashboard: React.FC<{ store: any }> = ({ store }) => {
  const { data, currentUser, theme, setData, addLead } = store;
  const isDark = theme === 'dark';

  // --- LOCAL UI STATE ---
  const [filterType, setFilterType] = useState<'All' | 'Retail' | 'Corporate'>('All');
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [showAddLeadModal, setShowAddLeadModal] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  
  // NEW LEAD FORM STATE
  const [addLeadForm, setAddLeadForm] = useState({
    name: '',
    email: '',
    phone: '',
    type: 'Retail' as 'Retail' | 'Corporate',
    source: 'LinkedIn' as any,
    company: ''
  });

  // --- DYNAMIC DATA FILTERING ---
  
  const filteredDeals = useMemo(() => {
    return data.deals.filter((d: any) => filterType === 'All' || d.type === filterType);
  }, [data.deals, filterType]);

  const filteredInvoices = useMemo(() => {
    return data.invoices.filter((i: any) => {
      const deal = data.deals.find((d: any) => d.id === i.dealId);
      return filterType === 'All' || deal?.type === filterType;
    });
  }, [data.invoices, data.deals, filterType]);

  const filteredLeads = useMemo(() => {
    return data.leads.filter((l: any) => filterType === 'All' || l.type === filterType);
  }, [data.leads, filterType]);

  // --- BUSINESS DATA CALCULATIONS ---
  
  const totalRevenue = useMemo(() => filteredInvoices.filter((i: any) => i.status === 'Paid').reduce((a: number, b: any) => a + b.amount, 0), [filteredInvoices]);
  const closedDealsCount = useMemo(() => filteredDeals.filter((d: any) => d.stage === DealStage.CLOSED_WON || d.isPaid).length, [filteredDeals]);
  const activeLeadsCount = useMemo(() => filteredLeads.filter((l: any) => l.status !== LeadStatus.CONVERTED && l.status !== LeadStatus.NOT_INTERESTED).length, [filteredLeads]);
  const winRate = useMemo(() => {
    const total = filteredDeals.length;
    if (total === 0) return 0;
    return Math.round((closedDealsCount / total) * 100);
  }, [filteredDeals, closedDealsCount]);

  const pipelineData = useMemo(() => [
    { name: 'Prospecting', value: filteredDeals.filter((d: any) => d.stage === DealStage.QUALIFICATION).length },
    { name: 'Qualified', value: filteredDeals.filter((d: any) => d.stage === DealStage.PROPOSAL_SENT).length },
    { name: 'Proposal', value: filteredDeals.filter((d: any) => d.stage === DealStage.PROPOSAL_ACCEPTED).length },
    { name: 'Negotiation', value: filteredDeals.filter((d: any) => d.stage === DealStage.INVOICE_SENT).length },
  ], [filteredDeals]);

  const segmentData = [
    { name: 'Enterprise', value: 85 },
    { name: 'Mid-Market', value: 65 },
    { name: 'SMB', value: 45 },
    { name: 'Gov', value: 55 },
    { name: 'Edu', value: 30 },
  ];

  const COLORS = ['#6366f1', '#818cf8', '#a5b4fc', '#c7d2fe'];

  // --- ACTION HANDLERS ---

  const handleExport = async () => {
    setIsExporting(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const headers = ['Company', 'Contact', 'Value', 'Stage', 'Type', 'Date'];
    const rows = filteredDeals.map((d: any) => [
      `"${d.clientName}"`,
      `"${d.title.split('-')[0]}"`,
      d.value,
      d.stage,
      d.type,
      new Date(d.expectedClose).toLocaleDateString()
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Dashboard_Report_${filterType}.csv`;
    a.click();
    setIsExporting(false);
  };

  const handleAddLeadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    addLead({
      ...addLeadForm,
      assignedTo: currentUser.id
    });

    setShowAddLeadModal(false);
    setAddLeadForm({ name: '', email: '', phone: '', type: 'Retail', source: 'LinkedIn', company: '' });
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-10">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pt-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight leading-none">
            Sales Dashboard
          </h2>
          <p className="text-slate-500 dark:text-slate-400 font-bold text-sm mt-3">
             Overview of your performance and business pipeline.
          </p>
        </div>
        <div className="flex items-center gap-3 relative">
          {/* DYNAMIC FILTER */}
          <div className="relative">
            <button 
              onClick={() => setShowFilterMenu(!showFilterMenu)}
              className={`px-5 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold flex items-center gap-2 hover:bg-slate-50 transition-all ${filterType !== 'All' ? 'text-indigo-600 ring-2 ring-indigo-500/20' : 'text-slate-600 dark:text-slate-300'}`}
            >
              <ListFilter className="w-4 h-4" /> Filter: {filterType}
            </button>
            <AnimatePresence>
              {showFilterMenu && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-100 dark:border-slate-800 z-50 p-2"
                >
                  {['All', 'Retail', 'Corporate'].map(t => (
                    <button 
                      key={t}
                      onClick={() => { setFilterType(t as any); setShowFilterMenu(false); }}
                      className={`w-full text-left px-4 py-2 rounded-lg text-xs font-bold transition-all ${filterType === t ? 'bg-indigo-50 text-indigo-600' : 'text-slate-500 hover:bg-slate-50'}`}
                    >
                      {t}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* DYNAMIC EXPORT */}
          <button 
            onClick={handleExport}
            disabled={isExporting}
            className="px-5 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 flex items-center gap-2 hover:bg-slate-50 transition-all disabled:opacity-50"
          >
            {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />} Export
          </button>

          {/* DYNAMIC ADD LEAD */}
          <button 
            onClick={() => setShowAddLeadModal(true)}
            className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-bold flex items-center gap-2 hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200"
          >
            <UserPlus className="w-4 h-4" /> Add New Lead
          </button>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <SimpleStatCard 
          label="TOTAL REVENUE" 
          value={`$${totalRevenue.toLocaleString()}`} 
          trend="+12.5%" 
          isUp={true} 
          icon={<DollarSign className="w-5 h-5 text-indigo-500" />} 
        />
        <SimpleStatCard 
          label="DEALS CLOSED" 
          value={closedDealsCount} 
          trend="+8.2%" 
          isUp={true} 
          icon={<Briefcase className="w-5 h-5 text-indigo-500" />} 
        />
        <SimpleStatCard 
          label="WIN RATE" 
          value={`${winRate}%`} 
          trend="-2.1%" 
          isUp={false} 
          icon={<Target className="w-5 h-5 text-indigo-500" />} 
        />
        <SimpleStatCard 
          label="ACTIVE LEADS" 
          value={activeLeadsCount} 
          trend="+15.3%" 
          isUp={true} 
          icon={<Users className="w-5 h-5 text-indigo-500" />} 
        />
      </div>

      {/* Middle Row: Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Performance Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white">Revenue Overview</h3>
            <select className="bg-slate-50 dark:bg-slate-800 border-none rounded-lg text-xs font-bold text-slate-500 py-2 px-3 outline-none">
              <option>This Year</option>
              <option>Last Year</option>
            </select>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={[
                {m:'Jan', v:4000, p:2500}, {m:'Feb', v:3200, p:1800}, {m:'Mar', v:2100, p:10000}, 
                {m:'Apr', v:2800, p:4000}, {m:'May', v:2500, p:4800}, {m:'Jun', v:3500, p:4200},
                {m:'Jul', v:4200, p:3800}, {m:'Aug', v:4800, p:4500}, {m:'Sep', v:5500, p:5000},
                {m:'Oct', v:6800, p:5800}, {m:'Nov', v:7800, p:6500}, {m:'Dec', v:8800, p:7200}
              ]}>
                <defs>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? '#334155' : '#f1f5f9'} />
                <XAxis dataKey="m" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11}} tickFormatter={(v) => `$${v/1000}k`} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                <Area type="monotone" dataKey="v" stroke="#6366f1" strokeWidth={3} fill="url(#revGrad)" />
                <Area type="monotone" dataKey="p" stroke="#94a3b8" strokeWidth={2} strokeDasharray="5 5" fill="transparent" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pipeline Donut */}
        <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-8">Deal Pipeline</h3>
          <div className="flex-1 relative min-h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pipelineData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pipelineData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <p className="text-[10px] font-bold text-slate-400 uppercase">Current</p>
              <p className="text-2xl font-black text-slate-800 dark:text-white">{filteredDeals.length}</p>
            </div>
          </div>
          <div className="mt-6 space-y-2">
            {pipelineData.map((item, i) => (
              <div key={i} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                  <span className="text-slate-500 font-medium">{item.name}</span>
                </div>
                <span className="text-slate-800 dark:text-white font-bold">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Row: Segment and Table */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales by Segment */}
        <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-8">Sales by Segment</h3>
          <div className="space-y-6">
            {segmentData.map((seg, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between text-[11px] font-bold">
                  <span className="text-slate-500">{seg.name}</span>
                </div>
                <div className="h-3 w-full bg-slate-50 dark:bg-slate-800 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }} 
                    animate={{ width: `${seg.value}%` }} 
                    className="h-full bg-indigo-500 rounded-full" 
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Deals Table */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col">
          <div className="p-8 pb-4 flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white">Recent Deals</h3>
            <button className="text-xs font-bold text-indigo-600 hover:underline">View All</button>
          </div>
          <div className="flex-1 overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 dark:bg-slate-800/50 border-y border-slate-100 dark:border-slate-800">
                <tr>
                  <th className="px-8 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Company</th>
                  <th className="px-8 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Contact</th>
                  <th className="px-8 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Value</th>
                  <th className="px-8 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Stage</th>
                  <th className="px-8 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                {filteredDeals.slice(0, 8).map((deal: any, i: number) => (
                  <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="px-8 py-4 text-sm font-bold text-slate-800 dark:text-white">{deal.clientName}</td>
                    <td className="px-8 py-4 text-sm text-slate-500">{deal.title.split('-')[0]}</td>
                    <td className="px-8 py-4 text-sm font-bold text-slate-800 dark:text-white">${deal.value.toLocaleString()}</td>
                    <td className="px-8 py-4">
                      <span className={`px-3 py-1 rounded-full text-[9px] font-bold uppercase ${
                        deal.stage === DealStage.CLOSED_WON ? 'bg-emerald-50 text-emerald-600' : 'bg-indigo-50 text-indigo-600'
                      }`}>
                        {deal.stage.split(' ')[0]}
                      </span>
                    </td>
                    <td className="px-8 py-4 text-sm text-slate-400 text-right">{new Date(deal.expectedClose).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</td>
                  </tr>
                ))}
                {filteredDeals.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-20 text-center text-slate-400 italic font-medium">No results matching your filter criteria.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ADD NEW LEAD MODAL */}
      <AnimatePresence>
        {showAddLeadModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            {/* LIGHTENED BACKDROP AS REQUESTED */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowAddLeadModal(false)} className="absolute inset-0 bg-white/20 dark:bg-slate-800/10 backdrop-blur-md" />
            
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-[2rem] shadow-2xl overflow-hidden border border-slate-100 dark:border-slate-800">
               <div className="p-8 border-b border-slate-100 dark:border-white/5 flex items-center justify-between">
                  <h3 className="text-xl font-black text-slate-900 dark:text-white">Add New Lead</h3>
                  <button onClick={() => setShowAddLeadModal(false)} className="p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors"><X className="w-5 h-5 text-slate-400" /></button>
               </div>
               <form onSubmit={handleAddLeadSubmit} className="p-8 space-y-6">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                       <Target className="w-3 h-3" /> Full Name
                    </label>
                    <input required type="text" value={addLeadForm.name} onChange={e => setAddLeadForm({...addLeadForm, name: e.target.value})} className="w-full px-5 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl outline-none font-bold focus:ring-4 focus:ring-indigo-500/5 dark:text-white" placeholder="e.g. Robert Smith" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                       <Mail className="w-3 h-3" /> Email Address
                    </label>
                    <input required type="email" value={addLeadForm.email} onChange={e => setAddLeadForm({...addLeadForm, email: e.target.value})} className="w-full px-5 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl outline-none font-bold focus:ring-4 focus:ring-indigo-500/5 dark:text-white" placeholder="r.smith@domain.com" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                         <Phone className="w-3 h-3" /> Phone
                      </label>
                      <input required type="tel" value={addLeadForm.phone} onChange={e => setAddLeadForm({...addLeadForm, phone: e.target.value})} className="w-full px-5 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl outline-none font-bold focus:ring-4 focus:ring-indigo-500/5 dark:text-white" placeholder="+1 (555) 000-0000" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Type</label>
                      <select value={addLeadForm.type} onChange={e => setAddLeadForm({...addLeadForm, type: e.target.value as any})} className="w-full px-5 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl outline-none font-bold focus:ring-4 focus:ring-indigo-500/5 dark:text-white">
                        <option value="Retail">Retail</option>
                        <option value="Corporate">Corporate</option>
                      </select>
                    </div>
                  </div>
                  {addLeadForm.type === 'Corporate' && (
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Company</label>
                      <input required type="text" value={addLeadForm.company} onChange={e => setAddLeadForm({...addLeadForm, company: e.target.value})} className="w-full px-5 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl outline-none font-bold focus:ring-4 focus:ring-indigo-500/5 dark:text-white" placeholder="Company Name" />
                    </div>
                  )}
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Discovery Source</label>
                    <select value={addLeadForm.source} onChange={e => setAddLeadForm({...addLeadForm, source: e.target.value as any})} className="w-full px-5 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl outline-none font-bold focus:ring-4 focus:ring-indigo-500/5 dark:text-white">
                      <option value="LinkedIn">LinkedIn</option>
                      <option value="Email">Direct Email</option>
                      <option value="Referral">Referral</option>
                      <option value="Call">Phone Call</option>
                    </select>
                  </div>
                  <button type="submit" className="w-full py-4 bg-indigo-600 text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-xl shadow-indigo-200 hover:bg-indigo-700 transition-all flex items-center justify-center gap-2">
                    <Save className="w-4 h-4" /> Save Lead
                  </button>
               </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

/**
 * REUSABLE SIMPLE STAT CARD
 */
const SimpleStatCard = ({ label, value, trend, isUp, icon }: any) => {
  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</p>
        <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded-lg">
          {icon}
        </div>
      </div>
      <div>
        <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">{value}</h3>
        <div className="flex items-center gap-2 mt-1">
          <span className={`flex items-center gap-0.5 text-[10px] font-black ${isUp ? 'text-emerald-500' : 'text-rose-500'}`}>
            {isUp ? <TrendingUp className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
            {trend}
          </span>
          <span className="text-[10px] font-medium text-slate-400">vs last month</span>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
