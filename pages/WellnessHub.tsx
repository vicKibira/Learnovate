
import React, { useState, useMemo } from 'react';
import {
  Gift, Heart, Shield, Activity, Sparkles,
  CheckCircle2, Coffee, Zap, User, Star,
  ArrowRight, ExternalLink, Calendar, Plus,
  X, Loader2, Search, Filter, Info, ShieldCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Perk {
  id: string;
  name: string;
  category: 'Health' | 'Lifestyle' | 'Balance';
  description: string;
}

const INITIAL_PERKS: Perk[] = [
  { id: '1', name: 'Full Health Insurance', category: 'Health', description: 'Complete medical, dental, and vision coverage for you and your family.' },
  { id: '2', name: 'Life Insurance Coverage', category: 'Health', description: 'Security and peace of mind with our comprehensive life insurance plan.' },
  { id: '3', name: 'Mental Health Support', category: 'Health', description: 'Free counseling sessions and wellness apps for your mental well-being.' },
  { id: '4', name: 'Work From Home Fund', category: 'Lifestyle', description: 'A yearly budget to help you set up your perfect home office.' },
  { id: '5', name: 'Gym Membership Discount', category: 'Lifestyle', description: 'Special rates at top fitness centers across the city.' },
  { id: '6', name: 'New Laptop Fund', category: 'Lifestyle', description: 'Get the latest tech with our technology refresh program.' },
  { id: '7', name: 'Unlimited Learning Fund', category: 'Balance', description: 'We pay for your courses, books, and certifications.' },
  { id: '8', name: 'Team Trips', category: 'Balance', description: 'Fun getaways and team-building events throughout the year.' },
  { id: '9', name: 'Paid Volunteer Days', category: 'Balance', description: 'Take time off to give back to the causes you care about.' },
];

const WellnessHub: React.FC<{ store: any }> = ({ store }) => {
  const [perks, setPerks] = useState<Perk[]>(INITIAL_PERKS);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAllModal, setShowAllModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [allSearch, setAllSearch] = useState('');

  const [newPerk, setNewPerk] = useState<Omit<Perk, 'id'>>({
    name: '',
    category: 'Health',
    description: ''
  });

  const categories = useMemo(() => [
    {
      id: 'Health',
      title: 'Health & Safety',
      icon: <Shield className="w-8 h-8 text-indigo-500" />,
      items: perks.filter(p => p.category === 'Health'),
      active: 92,
      color: 'bg-indigo-50'
    },
    {
      id: 'Lifestyle',
      title: 'Lifestyle & Tools',
      icon: <Zap className="w-8 h-8 text-amber-500" />,
      items: perks.filter(p => p.category === 'Lifestyle'),
      active: 74,
      color: 'bg-amber-50'
    },
    {
      id: 'Balance',
      title: 'Balance & Fun',
      icon: <Heart className="w-8 h-8 text-rose-500" />,
      items: perks.filter(p => p.category === 'Balance'),
      active: 88,
      color: 'bg-rose-50'
    }
  ], [perks]);

  const handleAddPerk = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    const perk: Perk = { ...newPerk, id: Math.random().toString(36).substr(2, 9) };
    setPerks([...perks, perk]);
    setIsSaving(false);
    setShowAddModal(false);
    setNewPerk({ name: '', category: 'Health', description: '' });
  };

  const filteredAllPerks = perks.filter(p =>
    p.name.toLowerCase().includes(allSearch.toLowerCase()) ||
    p.description.toLowerCase().includes(allSearch.toLowerCase())
  );

  return (
    <div className="space-y-10 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-2 mb-3">
            <div className="w-10 h-1 bg-amber-500 rounded-full" />
            <span className="text-[10px] font-black text-amber-500 uppercase tracking-[0.4em]">Team Rewards</span>
          </motion.div>
          <h2 className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter">
            Wellness <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-rose-500">Hub</span>
          </h2>
          <p className="text-slate-500 dark:text-slate-400 font-bold text-lg mt-3">Manage all company benefits and special perks for our team.</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-8 py-5 bg-amber-600 text-white rounded-[2rem] font-black uppercase tracking-widest text-[10px] shadow-2xl flex items-center gap-3 transition-all hover:bg-amber-700"
        >
          <Plus className="w-5 h-5" /> Add New Perk
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {categories.map((category, i) => (
          <motion.div
            key={i}
            whileHover={{ y: -10 }}
            className="glass p-10 rounded-[4rem] shadow-xl border border-white/60 dark:border-white/5 flex flex-col h-full"
          >
            <div className={`w-16 h-16 rounded-[2rem] ${category.color} flex items-center justify-center mb-8 shadow-inner`}>
              {category.icon}
            </div>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-6 tracking-tight">{category.title}</h3>

            <div className="flex-1 space-y-4 mb-10">
              {category.items.slice(0, 3).map((item, idx) => (
                <div key={idx} className="flex items-center gap-3 group cursor-pointer">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span className="text-sm font-bold text-slate-500 dark:text-slate-400 group-hover:text-indigo-600 transition-colors">{item.name}</span>
                </div>
              ))}
              {category.items.length > 3 && (
                <button onClick={() => setShowAllModal(true)} className="text-[10px] font-black text-indigo-500 uppercase tracking-widest hover:underline">+ {category.items.length - 3} more benefits</button>
              )}
            </div>

            <div className="pt-8 border-t border-slate-100 dark:border-white/5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">How many use this</span>
                <span className="text-sm font-black text-slate-900 dark:text-white">{category.active}%</span>
              </div>
              <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: `${category.active}%` }} className={`h-full bg-gradient-to-r from-amber-500 to-rose-500`} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="glass p-12 rounded-[4rem] shadow-xl border border-white/60 dark:border-white/5 bg-gradient-to-br from-indigo-900 to-slate-900 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-10"><Sparkles className="w-64 h-64" /></div>
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="max-w-xl">
            <h3 className="text-4xl font-black tracking-tighter mb-4">Benefits Summary</h3>
            <p className="text-slate-300 font-bold text-lg leading-relaxed">
              Showing the total value of all team benefits for this year.
            </p>
            <div className="flex gap-6 mt-10">
              <div className="p-6 bg-white/10 rounded-[2rem] border border-white/20">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Total Value</p>
                <p className="text-3xl font-black text-emerald-400">$428,500</p>
              </div>
              <div className="p-6 bg-white/10 rounded-[2rem] border border-white/20">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Impact Score</p>
                <p className="text-3xl font-black text-amber-400">18.4%</p>
              </div>
            </div>
          </div>
          <button
            onClick={() => setShowAllModal(true)}
            className="px-10 py-6 bg-white text-slate-900 rounded-[2.5rem] font-black uppercase tracking-widest text-xs shadow-2xl transition-all hover:bg-emerald-400 hover:text-slate-900 hover:scale-105"
          >
            View All Benefits
          </button>
        </div>
      </div>

      {/* Add Perk Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 md:p-12">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowAddModal(false)} className="absolute inset-0 bg-white/20 dark:bg-slate-900/40 backdrop-blur-xl" />
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 50 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 50 }} className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-[3.5rem] shadow-2xl overflow-hidden border border-white/20">
              <div className="p-10 border-b border-slate-100 dark:border-white/5 flex items-center justify-between bg-gradient-to-r from-amber-50/50 to-white dark:from-slate-800/50 dark:to-slate-900">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 bg-amber-600 rounded-2xl flex items-center justify-center text-white shadow-xl">
                    <Gift className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">Add New Perk</h3>
                    <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest mt-2">Grow our team rewards pool</p>
                  </div>
                </div>
                <button onClick={() => setShowAddModal(false)} className="p-4 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-slate-400 rounded-2xl group">
                  <X className="w-7 h-7 group-hover:rotate-90 transition-transform" />
                </button>
              </div>
              <form onSubmit={handleAddPerk} className="p-10 space-y-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Perk Name</label>
                  <input required value={newPerk.name} onChange={e => setNewPerk({ ...newPerk, name: e.target.value })} className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:ring-4 focus:ring-amber-500/10 font-bold dark:text-white" placeholder="e.g. Free Weekly Lunch" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Category</label>
                  <select value={newPerk.category} onChange={e => setNewPerk({ ...newPerk, category: e.target.value as any })} className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none font-black text-[10px] uppercase tracking-widest dark:text-white">
                    <option value="Health">Health & Safety</option>
                    <option value="Lifestyle">Lifestyle & Tools</option>
                    <option value="Balance">Balance & Fun</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Short Description</label>
                  <textarea rows={3} required value={newPerk.description} onChange={e => setNewPerk({ ...newPerk, description: e.target.value })} className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:ring-4 focus:ring-amber-500/10 font-bold dark:text-white resize-none" placeholder="What is this perk about?" />
                </div>
                <button type="submit" disabled={isSaving} className="w-full py-5 bg-amber-600 text-white font-black rounded-2xl uppercase tracking-widest text-[11px] shadow-2xl flex items-center justify-center gap-3">
                  {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
                  {isSaving ? 'Adding...' : 'Launch New Perk'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* View All Benefits Modal */}
      <AnimatePresence>
        {showAllModal && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 md:p-12 overflow-y-auto">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowAllModal(false)} className="absolute inset-0 bg-white/20 dark:bg-slate-900/40 backdrop-blur-xl" />
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 50 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 50 }} className="relative w-full max-w-4xl bg-white dark:bg-slate-900 rounded-[4rem] shadow-2xl overflow-hidden border border-white/20 flex flex-col max-h-[85vh]">
              <div className="p-12 border-b border-slate-100 dark:border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-8 bg-gradient-to-r from-indigo-50/50 to-white dark:from-slate-800/50 dark:to-slate-900">
                <div className="flex items-center gap-8">
                  <div className="w-20 h-20 bg-indigo-600 rounded-[2rem] flex items-center justify-center text-white shadow-2xl">
                    {/* Added missing ShieldCheck icon usage */}
                    <ShieldCheck className="w-10 h-10" />
                  </div>
                  <div>
                    <h3 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">Team Benefits</h3>
                    <p className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.3em] mt-3">Full roster of active company perks</p>
                  </div>
                </div>
                <button onClick={() => setShowAllModal(false)} className="p-5 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-slate-400 rounded-3xl hover:text-rose-500 transition-all group">
                  <X className="w-8 h-8 group-hover:rotate-90 transition-transform" />
                </button>
              </div>

              <div className="p-12 space-y-8 flex-1 overflow-y-auto custom-scrollbar">
                <div className="relative group">
                  <Search className="w-5 h-5 absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-all" />
                  <input
                    type="text"
                    value={allSearch}
                    onChange={(e) => setAllSearch(e.target.value)}
                    placeholder="Search perks or descriptions..."
                    className="w-full pl-16 pr-8 py-5 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-[2rem] outline-none focus:ring-8 focus:ring-indigo-500/5 font-bold dark:text-white"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredAllPerks.map((perk) => (
                    <motion.div
                      key={perk.id}
                      layout
                      className="p-8 bg-slate-50/50 dark:bg-slate-800/50 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 flex flex-col group hover:shadow-xl transition-all"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <span className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest ${perk.category === 'Health' ? 'bg-indigo-50 text-indigo-600' :
                            perk.category === 'Lifestyle' ? 'bg-amber-50 text-amber-600' : 'bg-rose-50 text-rose-600'
                          }`}>
                          {perk.category}
                        </span>
                        <div className="p-2 bg-white dark:bg-slate-700 rounded-lg shadow-sm text-emerald-500">
                          <CheckCircle2 className="w-4 h-4" />
                        </div>
                      </div>
                      <h4 className="text-xl font-black text-slate-900 dark:text-white mb-2">{perk.name}</h4>
                      <p className="text-sm font-medium text-slate-500 dark:text-slate-400 leading-relaxed flex-1">{perk.description}</p>
                      <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
                        <button className="text-[10px] font-black text-indigo-500 uppercase tracking-widest hover:underline flex items-center gap-2">
                          How to Claim <ArrowRight className="w-3 h-3" />
                        </button>
                        <Info className="w-4 h-4 text-slate-300" />
                      </div>
                    </motion.div>
                  ))}
                </div>

                {filteredAllPerks.length === 0 && (
                  <div className="py-20 text-center">
                    <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-3xl flex items-center justify-center mx-auto mb-6 text-slate-300">
                      <Search className="w-10 h-10" />
                    </div>
                    <p className="text-xl font-black text-slate-900 dark:text-white">No benefits found</p>
                    <p className="text-sm font-medium text-slate-500 mt-2">Try searching for something else.</p>
                  </div>
                )}
              </div>

              <div className="p-10 bg-slate-900 border-t border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-amber-500/20 text-amber-400 rounded-xl">
                    <Gift className="w-5 h-5" />
                  </div>
                  <p className="text-white text-xs font-black uppercase tracking-widest">Team Success & Wellness Pool</p>
                </div>
                <button onClick={() => setShowAllModal(false)} className="px-10 py-4 bg-white text-slate-900 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-emerald-400 transition-all shadow-xl">Close View</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default WellnessHub;
