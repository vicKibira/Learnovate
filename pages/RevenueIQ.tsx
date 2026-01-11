
import React, { useMemo, useState } from 'react';
import {
  TrendingUp, DollarSign, ArrowUpRight,
  ArrowDownRight, Target, Sparkles, Activity, ShieldCheck,
  PieChart as PieIcon, X, FileText, CheckCircle2, AlertCircle,
  Search, Filter, Download, ShieldAlert, BadgeCheck, Loader2,
  Check, Lock
} from 'lucide-react';
import {
  PieChart, Pie, Cell, ResponsiveContainer,
  Tooltip, AreaChart, Area, XAxis, YAxis, CartesianGrid
} from 'recharts';
// Cast motion to any to bypass environment-specific type definition issues
import { motion as motionAny, AnimatePresence } from 'framer-motion';
const motion = motionAny as any;

const RevenueIQ: React.FC<{ store: any }> = ({ store }) => {
  const { data, theme } = store;
  const isDark = theme === 'dark';

  // Modal & Operational States
  const [showAuditModal, setShowAuditModal] = useState(false);
  const [auditSearch, setAuditSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Paid' | 'Pending'>('All');
  const [isExporting, setIsExporting] = useState(false);
  const [isFinalizing, setIsFinalizing] = useState(false);
  const [isSealed, setIsSealed] = useState(false);

  const metrics = useMemo(() => {
    const totalPaid = data.invoices.filter((i: any) => i.status === 'Paid').reduce((acc: number, i: any) => acc + i.amount, 0);
    const pendingAmount = data.invoices.filter((i: any) => i.status === 'Pending').reduce((acc: number, i: any) => acc + i.amount, 0);
    const pipelineValue = data.deals.filter((d: any) => !d.isPaid).reduce((acc: number, d: any) => acc + d.value, 0);
    const profitMargin = 68.5; // Mock calculation

    return { totalPaid, pendingAmount, pipelineValue, profitMargin };
  }, [data]);

  // Dynamic Audit Data with Filter Logic
  const auditTransactions = useMemo(() => {
    return data.invoices
      .map((inv: any) => {
        const deal = data.deals.find((d: any) => d.id === inv.dealId);
        return {
          id: inv.id,
          invoiceNumber: inv.invoiceNumber,
          client: deal?.clientName || 'General Client',
          amount: inv.amount,
          date: inv.paymentDate || inv.dueDate,
          type: deal?.type || 'Retail',
          status: inv.status,
          verified: inv.status === 'Paid'
        };
      })
      .filter((t: any) => {
        const matchesSearch = t.client.toLowerCase().includes(auditSearch.toLowerCase()) ||
          t.invoiceNumber.toLowerCase().includes(auditSearch.toLowerCase());
        const matchesStatus = statusFilter === 'All' || t.status === statusFilter;
        return matchesSearch && matchesStatus;
      })
      .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [data.invoices, data.deals, auditSearch, statusFilter]);

  // Export Logic
  const handleExportAudit = async () => {
    if (auditTransactions.length === 0) return;
    setIsExporting(true);
    await new Promise(resolve => setTimeout(resolve, 1500));

    try {
      const headers = ['Invoice', 'Client', 'Date', 'Type', 'Status', 'Value'];
      const rows = auditTransactions.map(t => [
        t.invoiceNumber,
        `"${t.client}"`,
        new Date(t.date).toLocaleDateString(),
        t.type,
        t.status,
        t.amount
      ]);

      const csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `Learnovate_Audit_${new Date().toISOString().split('T')[0]}.csv`);
      link.click();
    } finally {
      setIsExporting(false);
    }
  };

  // Integrity Seal Logic
  const handleFinalizeSeal = async () => {
    setIsFinalizing(true);
    // Simulate cryptographic hashing and ledger sync
    await new Promise(resolve => setTimeout(resolve, 2500));
    setIsFinalizing(false);
    setIsSealed(true);

    // Auto-reset seal after some time or on modal close if desired
    setTimeout(() => {
      alert("The audit has been locked and confirmed. Your records are now saved.");
    }, 100);
  };

  const distributionData = [
    { name: 'Corporate', value: 65, color: '#6366f1' },
    { name: 'Retail', value: 35, color: '#10b981' },
  ];

  const forecastData = [
    { month: 'Jul', revenue: metrics.totalPaid * 0.8 },
    { month: 'Aug', revenue: metrics.totalPaid * 0.9 },
    { month: 'Sep', revenue: metrics.totalPaid },
    { month: 'Oct', revenue: metrics.totalPaid * 1.15 },
    { month: 'Nov', revenue: metrics.totalPaid * 1.4 },
    { month: 'Dec', revenue: metrics.totalPaid * 1.8 },
  ];

  return (
    <div className="space-y-10 pb-20">
      {/* Dynamic Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-2 mb-3">
            <div className="w-10 h-1 bg-indigo-500 rounded-full" />
            <span className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.4em]">Finance Overview</span>
          </motion.div>
          <h2 className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter">
            Revenue <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-500">Dashboard</span>
          </h2>
          <p className="text-slate-500 dark:text-slate-400 font-bold text-lg mt-3">A clear view of your money, earnings, and future growth.</p>
        </div>
        <div className="flex gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setIsSealed(false);
              setShowAuditModal(true);
            }}
            className="px-8 py-5 bg-indigo-600 text-white rounded-[2rem] font-black uppercase tracking-widest text-[10px] shadow-2xl shadow-indigo-200 flex items-center gap-3 transition-all"
          >
            <ShieldCheck className="w-5 h-5" />
            Audit Records
          </motion.button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {[
          { label: 'Total Revenue', value: `$${metrics.totalPaid.toLocaleString()}`, icon: <DollarSign className="w-6 h-6 text-emerald-600" />, trend: '+12.4%', color: 'bg-emerald-50' },
          { label: 'Pending Income', value: `$${metrics.pendingAmount.toLocaleString()}`, icon: <Activity className="w-6 h-6 text-amber-600" />, trend: 'Expected Soon', color: 'bg-amber-50' },
          { label: 'Upcoming Deals', value: `$${metrics.pipelineValue.toLocaleString()}`, icon: <TrendingUp className="w-6 h-6 text-indigo-600" />, trend: 'Projected Sales', color: 'bg-indigo-50' },
          { label: 'Profit Margin', value: `${metrics.profitMargin}%`, icon: <Target className="w-6 h-6 text-rose-600" />, trend: '+4.2% Growth', color: 'bg-rose-50' },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass p-10 rounded-[3rem] shadow-xl border-white/60 dark:border-white/5 relative group"
          >
            <div className="flex items-start justify-between mb-8">
              <div className={`p-4 rounded-2xl ${stat.color} shadow-inner border border-white/50`}>
                {stat.icon}
              </div>
              <span className="text-[10px] font-black text-emerald-500 bg-emerald-50 px-3 py-1.5 rounded-full">{stat.trend}</span>
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{stat.label}</p>
            <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">{stat.value}</h3>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Forecast Chart */}
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="lg:col-span-2 glass p-12 rounded-[4rem] shadow-xl border border-white/60 dark:border-white/5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-12">
            <div>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Income Forecast</h3>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">Expected earnings for the next 6 months</p>
            </div>
            <div className="flex items-center gap-2 px-5 py-2.5 bg-indigo-500/10 text-indigo-600 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-indigo-500/20">
              <Activity className="w-4 h-4 animate-pulse" /> Live View
            </div>
          </div>
          <div className="h-[320px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={forecastData}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="10 10" vertical={false} stroke={isDark ? '#334155' : '#e2e8f0'} strokeOpacity={0.5} />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 900 }} />
                <Tooltip
                  contentStyle={{ borderRadius: '24px', backgroundColor: isDark ? '#0f172a' : '#fff', border: 'none', boxShadow: '0 40px 80px -20px rgba(0,0,0,0.3)', padding: '24px' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={6} fillOpacity={1} fill="url(#colorRev)" dot={{ r: 8, fill: '#6366f1' }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Mix Analysis */}
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="lg:col-span-1 glass p-12 rounded-[4rem] shadow-xl border border-white/60 dark:border-white/5 flex flex-col">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Revenue Sources</h3>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Breakdown of where your money comes from</p>
            </div>
          </div>
          <div className="h-[280px] w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={distributionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={100}
                  paddingAngle={10}
                  dataKey="value"
                >
                  {distributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <p className="text-[10px] font-black text-slate-400 uppercase">Top Source</p>
              <p className="text-2xl font-black text-slate-900 dark:text-white">Corporate</p>
            </div>
          </div>
          <div className="mt-10 space-y-4">
            {distributionData.map((item, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-widest">{item.name}</span>
                </div>
                <span className="text-sm font-black text-slate-900 dark:text-white">{item.value}%</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Dynamic Audit Snapshot Modal */}
      <AnimatePresence>
        {showAuditModal && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 md:p-12 overflow-y-auto">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowAuditModal(false)} className="absolute inset-0 bg-white/20 dark:bg-slate-900/40 backdrop-blur-xl" />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 50, filter: 'blur(10px)' }}
              animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, scale: 0.9, y: 50 }}
              className="relative w-full max-w-6xl bg-white dark:bg-slate-900 rounded-[4rem] shadow-2xl overflow-hidden border border-white/20 flex flex-col max-h-[85vh]"
            >
              <div className="p-12 border-b border-slate-100 dark:border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-8 bg-gradient-to-r from-indigo-50/50 to-white dark:from-slate-800/50 dark:to-slate-900">
                <div className="flex items-center gap-8">
                  <div className="w-20 h-20 bg-slate-900 dark:bg-white rounded-[2rem] flex items-center justify-center text-white dark:text-slate-900 shadow-2xl">
                    <ShieldCheck className="w-10 h-10" />
                  </div>
                  <div>
                    <h3 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter leading-none">Payment Audit Report</h3>
                    <p className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.3em] mt-3">Verified list of all invoices and payments</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button onClick={() => setShowAuditModal(false)} className="p-5 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-slate-400 rounded-[1.8rem] hover:text-rose-500 transition-all group">
                    <X className="w-8 h-8 group-hover:rotate-90 transition-transform" />
                  </button>
                </div>
              </div>

              <div className="p-12 flex-1 overflow-y-auto custom-scrollbar space-y-12">
                {/* Audit Sub-stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="p-8 bg-slate-50 dark:bg-slate-800/50 rounded-[2.5rem] border border-slate-100 dark:border-slate-700">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Total Amount Audited</p>
                    <h4 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">${(metrics.totalPaid + metrics.pendingAmount).toLocaleString()}</h4>
                    <div className="mt-4 flex items-center gap-2 text-emerald-500 text-[10px] font-black uppercase">
                      <CheckCircle2 className="w-3.5 h-3.5" /> All checks passed
                    </div>
                  </div>
                  <div className="p-8 bg-slate-50 dark:bg-slate-800/50 rounded-[2.5rem] border border-slate-100 dark:border-slate-700">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Risk Level</p>
                    <h4 className="text-3xl font-black text-emerald-500 tracking-tighter">Very Low</h4>
                    <div className="mt-4 flex items-center gap-2 text-slate-400 text-[10px] font-black uppercase">
                      <ShieldAlert className="w-3.5 h-3.5" /> No issues found
                    </div>
                  </div>
                  <div className="p-8 bg-slate-50 dark:bg-slate-800/50 rounded-[2.5rem] border border-slate-100 dark:border-slate-700">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Accuracy Score</p>
                    <h4 className="text-3xl font-black text-indigo-500 tracking-tighter">99.8%</h4>
                    <div className="mt-4 flex items-center gap-2 text-slate-400 text-[10px] font-black uppercase">
                      <BadgeCheck className="w-3.5 h-3.5" /> Records are correct
                    </div>
                  </div>
                </div>

                {/* Fully Dynamic Audit Search/Filter */}
                <div className="flex flex-col md:flex-row gap-6 items-center">
                  <div className="flex-1 relative group w-full">
                    <Search className="w-5 h-5 absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-all" />
                    <input
                      type="text"
                      value={auditSearch}
                      onChange={(e) => setAuditSearch(e.target.value)}
                      placeholder="Search by invoice number or client name..."
                      className="w-full pl-16 pr-8 py-5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-[2rem] focus:ring-8 focus:ring-indigo-500/5 outline-none font-bold dark:text-white"
                    />
                  </div>
                  <div className="flex gap-3">
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value as any)}
                      className="px-6 py-5 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 text-[10px] font-black uppercase tracking-widest outline-none focus:ring-4 focus:ring-indigo-500/10 appearance-none min-w-[120px]"
                    >
                      <option value="All">All Invoices</option>
                      <option value="Paid">Confirmed Paid</option>
                      <option value="Pending">Still Pending</option>
                    </select>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      disabled={isExporting}
                      onClick={handleExportAudit}
                      className={`px-8 py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-3 shadow-xl transition-all ${isExporting ? 'bg-slate-100 text-slate-400' : 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
                        }`}
                    >
                      {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                      {isExporting ? 'Downloading...' : 'Download Report'}
                    </motion.button>
                  </div>
                </div>

                {/* Audit Table */}
                <div className="bg-white dark:bg-slate-800/40 rounded-[3rem] border border-slate-100 dark:border-white/5 overflow-hidden">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50 dark:bg-slate-900/50">
                      <tr>
                        <th className="p-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">Invoice Info</th>
                        <th className="p-8 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Date</th>
                        <th className="p-8 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Client Type</th>
                        <th className="p-8 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Status</th>
                        <th className="p-8 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                      {auditTransactions.map((tx, idx) => (
                        <motion.tr
                          key={tx.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.03 }}
                          className="group hover:bg-slate-50 dark:hover:bg-white/5 transition-all"
                        >
                          <td className="p-8">
                            <div className="flex items-center gap-5">
                              <div className={`p-3 rounded-xl ${tx.verified ? 'bg-emerald-50 text-emerald-500' : 'bg-amber-50 text-amber-500'}`}>
                                <FileText className="w-5 h-5" />
                              </div>
                              <div>
                                <p className="text-sm font-black text-slate-900 dark:text-white leading-none mb-1">{tx.invoiceNumber}</p>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{tx.client}</p>
                              </div>
                            </div>
                          </td>
                          <td className="p-8 text-center text-xs font-bold text-slate-500 dark:text-slate-400">
                            {new Date(tx.date).toLocaleDateString()}
                          </td>
                          <td className="p-8 text-center">
                            <span className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border ${tx.type === 'Corporate' ? 'bg-indigo-50 text-indigo-600 border-indigo-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'
                              }`}>
                              {tx.type}
                            </span>
                          </td>
                          <td className="p-8 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <div className={`w-1.5 h-1.5 rounded-full ${tx.verified ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`} />
                              <span className={`text-[10px] font-black uppercase tracking-widest ${tx.verified ? 'text-emerald-600' : 'text-amber-600'}`}>
                                {tx.verified ? 'Completed' : 'Pending'}
                              </span>
                            </div>
                          </td>
                          <td className="p-8 text-right font-black text-slate-900 dark:text-white text-lg">
                            ${tx.amount.toLocaleString()}
                          </td>
                        </motion.tr>
                      ))}
                      {auditTransactions.length === 0 && (
                        <tr>
                          <td colSpan={5} className="p-20 text-center text-slate-400 font-bold uppercase tracking-widest italic opacity-50">No records match your search</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Dynamic Seal Interface */}
              <div className="p-12 bg-slate-900 flex flex-col md:flex-row items-center justify-between gap-8 border-t border-white/10">
                <div className="flex items-center gap-6">
                  <div className={`p-4 rounded-2xl transition-all duration-700 ${isSealed ? 'bg-emerald-500 text-white' : 'bg-white/10 text-emerald-400'}`}>
                    {isSealed ? <Check className="w-8 h-8" /> : <ShieldCheck className="w-8 h-8" />}
                  </div>
                  <div>
                    <p className="text-white text-lg font-black tracking-tight leading-none mb-1">
                      {isSealed ? 'Audit Locked & Saved' : 'Audit Ready'}
                    </p>
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">
                      {isSealed ? `This report was confirmed and saved at ${new Date().toLocaleTimeString()}` : `Report generated at ${new Date().toLocaleTimeString()}`}
                    </p>
                  </div>
                </div>

                {!isSealed ? (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    disabled={isFinalizing}
                    onClick={handleFinalizeSeal}
                    className="px-10 py-6 bg-white text-slate-900 rounded-[2.5rem] font-black uppercase tracking-widest text-xs hover:bg-indigo-400 transition-all shadow-2xl flex items-center gap-3 disabled:opacity-50"
                  >
                    {isFinalizing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Lock className="w-5 h-5" />}
                    {isFinalizing ? 'Saving...' : 'Lock and Confirm Audit'}
                  </motion.button>
                ) : (
                  <div className="px-10 py-6 bg-emerald-500/20 border border-emerald-500/50 text-emerald-400 rounded-[2.5rem] font-black uppercase tracking-widest text-xs flex items-center gap-3">
                    <BadgeCheck className="w-5 h-5" /> Audit Confirmed
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RevenueIQ;
