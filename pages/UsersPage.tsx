import React, { useState, useMemo } from 'react';
import { 
  UserCheck, Plus, Search, Filter, Mail, Phone, 
  ShieldCheck, Trash2, Edit3, X, UserPlus, 
  MoreVertical, Shield, ShieldAlert, Check, 
  ToggleLeft, ToggleRight, Loader2, Sparkles,
  Search as SearchIcon, FilterX, Users, 
  Fingerprint, Zap, ShieldQuestion, ChevronDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserRole, User } from '../types';

const UsersPage: React.FC<{ store: any }> = ({ store }) => {
  const { data, setData, currentUser } = store;
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: UserRole.SALES_RETAIL,
    active: true
  });

  const getRoleColor = (role: UserRole) => {
    switch (role) {
      case UserRole.DIRECTOR: return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
      case UserRole.TRAINER: return 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20';
      case UserRole.SALES_RETAIL: 
      case UserRole.SALES_CORPORATE: return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
      case UserRole.FINANCE: return 'bg-rose-500/10 text-rose-500 border-rose-500/20';
      case UserRole.HR: return 'bg-violet-500/10 text-violet-500 border-violet-500/20';
      default: return 'bg-slate-500/10 text-slate-500 border-slate-500/20';
    }
  };

  const users = useMemo(() => {
    return data.users.filter((u: User) => {
      const matchesSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            u.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRole = roleFilter === 'all' || u.role === roleFilter;
      return matchesSearch && matchesRole;
    });
  }, [data.users, searchTerm, roleFilter]);

  const stats = useMemo(() => {
    return [
      { label: 'Total Personnel', value: data.users.length, icon: <Users className="w-5 h-5" />, color: 'bg-indigo-500' },
      { label: 'Verified Nodes', value: data.users.filter((u: any) => u.active).length, icon: <Zap className="w-5 h-5" />, color: 'bg-emerald-500' },
      { label: 'Strategic Ops', value: data.users.filter((u: any) => u.role === UserRole.DIRECTOR).length, icon: <Shield className="w-5 h-5" />, color: 'bg-amber-500' },
      { label: 'Security Alerts', value: data.users.filter((u: any) => !u.active).length, icon: <ShieldAlert className="w-5 h-5" />, color: 'bg-rose-500' },
    ];
  }, [data.users]);

  const handleToggleStatus = (userId: string) => {
    if (userId === currentUser.id) {
      alert("System Conflict: Deactivation of primary session restricted.");
      return;
    }
    setData((prev: any) => ({
      ...prev,
      users: prev.users.map((u: User) => u.id === userId ? { ...u, active: !u.active } : u)
    }));
  };

  const handleOnboardUser = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setTimeout(() => {
      if (isEditing) {
        setData((prev: any) => ({
          ...prev,
          users: prev.users.map((u: User) => u.id === isEditing ? { ...u, ...formData } : u)
        }));
      } else {
        const newUser: User = { ...formData, id: Math.random().toString(36).substr(2, 9) };
        setData((prev: any) => ({ ...prev, users: [...prev.users, newUser] }));
      }
      setIsProcessing(false);
      handleCloseModal();
    }, 800);
  };

  const handleEdit = (user: User) => {
    setFormData({ name: user.name, email: user.email, role: user.role, active: user.active });
    setIsEditing(user.id);
    setIsAddModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsAddModalOpen(false);
    setIsEditing(null);
    setFormData({ name: '', email: '', role: UserRole.SALES_RETAIL, active: true });
  };

  return (
    <div className="space-y-10 pb-20">
      {/* Dynamic Header */}
      <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-8">
        <div>
          <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-2 mb-3">
             <div className="w-10 h-1 bg-indigo-500 rounded-full" />
             <span className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.4em]">Node Registry</span>
          </motion.div>
          <h2 className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter leading-none">
            Registry <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">Command</span>
          </h2>
          <p className="text-slate-500 dark:text-slate-400 font-bold text-lg mt-3">Governance and authorization protocol for global faculty and staff.</p>
        </div>
        <motion.button 
          whileHover={{ scale: 1.05, y: -4 }} 
          whileTap={{ scale: 0.95 }} 
          onClick={() => setIsAddModalOpen(true)} 
          className="px-10 py-5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-[2rem] font-black uppercase tracking-widest text-[10px] shadow-[0_20px_40px_-10px_rgba(0,0,0,0.3)] dark:shadow-none flex items-center gap-3 transition-all"
        >
          <UserPlus className="w-5 h-5" /> Initialize Onboarding
        </motion.button>
      </div>

      {/* Analytics Brief */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map((stat, i) => (
          <motion.div 
            key={i} 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: i * 0.1 }}
            className="glass p-8 rounded-[3rem] neo-shadow relative group overflow-hidden"
          >
            <div className={`absolute -right-4 -bottom-4 w-24 h-24 ${stat.color} opacity-5 blur-3xl`} />
            <div className="flex items-center justify-between mb-8">
               <div className={`p-4 rounded-2xl ${stat.color} text-white shadow-lg`}>
                  {stat.icon}
               </div>
               <ShieldCheck className="w-4 h-4 text-slate-200 dark:text-slate-800" />
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
            <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter leading-none">{stat.value}</h3>
          </motion.div>
        ))}
      </div>

      {/* Control Surface */}
      <div className="glass p-8 rounded-[3.5rem] neo-shadow flex flex-col lg:flex-row gap-8 items-center">
        <div className="flex-1 relative group w-full">
          <Search className="w-6 h-6 absolute left-8 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-all" />
          <input 
            type="text" 
            placeholder="Query node identity or email address..." 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
            className="w-full pl-20 pr-8 py-6 bg-slate-50/50 dark:bg-white/5 border border-slate-100 dark:border-white/5 rounded-[2.5rem] focus:ring-8 focus:ring-indigo-500/5 outline-none font-bold text-lg dark:text-white" 
          />
        </div>
        <div className="flex items-center gap-3 overflow-x-auto pb-2 lg:pb-0 scrollbar-none">
          <div className="flex p-1.5 bg-slate-100/50 dark:bg-white/5 rounded-[2rem] border border-slate-200 dark:border-white/5 whitespace-nowrap">
            {['all', ...Object.values(UserRole)].map(role => (
              <button 
                key={role} 
                onClick={() => setRoleFilter(role)} 
                className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${roleFilter === role ? 'bg-white dark:bg-slate-700 shadow-xl text-indigo-600 dark:text-white' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'}`}
              >
                {role}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Personnel Roster - High Fidelity Table */}
      <div className="glass rounded-[4rem] neo-shadow overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50/50 dark:bg-white/5 border-b border-black/5 dark:border-white/5">
              <th className="p-10 text-[10px] font-black text-slate-400 uppercase tracking-widest">Node Identity</th>
              <th className="p-10 text-[10px] font-black text-slate-400 uppercase tracking-widest">Protocol Group</th>
              <th className="p-10 text-[10px] font-black text-slate-400 uppercase tracking-widest">Signal Status</th>
              <th className="p-10 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Ops</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/5 dark:divide-white/5">
            <AnimatePresence mode="popLayout">
              {users.map((user: User, idx) => (
                <motion.tr 
                  layout 
                  initial={{ opacity: 0, x: -20 }} 
                  animate={{ opacity: 1, x: 0 }} 
                  exit={{ opacity: 0, scale: 0.95 }} 
                  transition={{ delay: idx * 0.03 }} 
                  key={user.id} 
                  className="group hover:bg-white/40 dark:hover:bg-white/5 transition-all duration-500"
                >
                  <td className="p-10">
                    <div className="flex items-center gap-6">
                       <div className="relative">
                          <div className="w-16 h-16 rounded-[1.8rem] bg-gradient-to-tr from-slate-900 to-indigo-900 dark:from-slate-800 dark:to-indigo-800 flex items-center justify-center text-lg font-black text-white shadow-xl overflow-hidden group-hover:scale-110 transition-transform duration-500">
                             {user.avatar ? <img src={user.avatar} className="w-full h-full object-cover" /> : user.name.charAt(0)}
                          </div>
                          <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-4 border-white dark:border-slate-900 ${user.active ? 'bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.5)]' : 'bg-slate-300'}`} />
                       </div>
                       <div>
                          <p className="text-lg font-black text-slate-900 dark:text-white leading-tight mb-1 group-hover:text-indigo-600 transition-colors">{user.name}</p>
                          <p className="text-xs font-bold text-slate-400">{user.email}</p>
                       </div>
                    </div>
                  </td>
                  <td className="p-10">
                    <span className={`px-5 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all ${getRoleColor(user.role)}`}>
                       {user.role}
                    </span>
                  </td>
                  <td className="p-10">
                    <div className="flex items-center gap-6">
                      <label className="switch-toggle" onClick={(e) => { e.stopPropagation(); handleToggleStatus(user.id); }}>
                        <input type="checkbox" checked={user.active} readOnly />
                        <span className="slider"></span>
                      </label>
                      <span className={`text-[10px] font-black uppercase tracking-widest ${user.active ? 'text-emerald-500' : 'text-slate-400'}`}>
                        {user.active ? 'Active' : 'Disabled'}
                      </span>
                    </div>
                  </td>
                  <td className="p-10 text-right">
                    <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300">
                       <button onClick={() => handleEdit(user)} className="p-4 glass dark:bg-white/5 rounded-2xl text-slate-400 hover:text-indigo-600 hover:shadow-xl transition-all"><Edit3 className="w-5 h-5" /></button>
                       <button onClick={() => handleToggleStatus(user.id)} className="p-4 glass dark:bg-white/5 rounded-2xl text-slate-400 hover:text-rose-500 hover:shadow-xl transition-all"><Trash2 className="w-5 h-5" /></button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {/* Global Ingestion Modal - Enhanced Glass */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 md:p-12 overflow-y-auto">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={handleCloseModal} 
              className="absolute inset-0 bg-white/20 dark:bg-slate-900/40 backdrop-blur-xl" 
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 30, filter: 'blur(20px)' }} 
              animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }} 
              exit={{ opacity: 0, scale: 0.9, y: 30 }} 
              className="relative w-full max-w-2xl glass neo-shadow rounded-[4rem] overflow-hidden"
            >
              <div className="p-12 border-b border-black/5 dark:border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-8">
                   <div className="w-20 h-20 bg-indigo-600 rounded-[2.5rem] flex items-center justify-center text-white shadow-2xl">
                      {isEditing ? <Edit3 className="w-10 h-10" /> : <UserPlus className="w-10 h-10" />}
                   </div>
                   <div>
                     <h3 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter leading-none">{isEditing ? 'Sync Profile' : 'Onboard Node'}</h3>
                     <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mt-3">Team Configuration Protocol</p>
                   </div>
                </div>
                <button onClick={handleCloseModal} className="p-5 bg-white/20 dark:bg-white/5 rounded-3xl text-slate-400 hover:text-rose-500 transition-all"><X className="w-8 h-8" /></button>
              </div>

              <form onSubmit={handleOnboardUser} className="p-12 space-y-10">
                <div className="space-y-4">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                     <Fingerprint className="w-3 h-3 text-indigo-500" /> Professional Identity
                   </label>
                   <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-8 py-5 bg-slate-50/50 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-3xl outline-none focus:ring-8 focus:ring-indigo-500/5 font-bold text-lg dark:text-white" placeholder="Full Legal Name" />
                </div>
                <div className="space-y-4">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                     <Mail className="w-3 h-3 text-indigo-500" /> Communication Channel
                   </label>
                   <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full px-8 py-5 bg-slate-50/50 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-3xl outline-none focus:ring-8 focus:ring-indigo-500/5 font-bold text-lg dark:text-white" placeholder="work@learnovate.tech" />
                </div>
                <div className="space-y-4">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                     <Shield className="w-3 h-3 text-indigo-500" /> Strategic Authorization
                   </label>
                   <select value={formData.role} onChange={e => setFormData({...formData, role: e.target.value as any})} className="w-full px-8 py-5 bg-slate-50/50 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-3xl outline-none focus:ring-8 focus:ring-indigo-500/5 font-black uppercase tracking-widest text-[11px] dark:text-white appearance-none">
                     {Object.values(UserRole).map(role => ( <option key={role} value={role} className="dark:bg-slate-900 uppercase">{role}</option> ))}
                   </select>
                </div>

                <div className="pt-8 flex gap-6">
                  <button type="button" onClick={handleCloseModal} className="flex-1 py-6 bg-black/5 dark:bg-white/5 text-slate-500 font-black rounded-3xl uppercase tracking-widest text-[11px] transition-all">Cancel</button>
                  <button type="submit" disabled={isProcessing} className="flex-1 py-6 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black rounded-3xl shadow-2xl flex items-center justify-center gap-3 uppercase tracking-widest text-[11px] hover:bg-indigo-600 dark:hover:bg-indigo-500 transition-all">
                    {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
                    {isEditing ? 'Sync Changes' : 'Initialize Node'}
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

export default UsersPage;