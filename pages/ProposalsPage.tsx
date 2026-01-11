
import React, { useState } from 'react';
import { Plus, Send, FileText, CheckCircle, XCircle, Clock, Trash2 } from 'lucide-react';

const ProposalsPage: React.FC<{ store: any }> = ({ store }) => {
  const { data, createProposal, acceptProposal } = store;
  const [showCreate, setShowCreate] = useState(false);
  const [selectedDeal, setSelectedDeal] = useState('');

  const [items, setItems] = useState([{ name: '', price: 0, duration: '24 Hours' }]);

  const handleAddItem = () => setItems([...items, { name: '', price: 0, duration: '24 Hours' }]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDeal) return;
    createProposal(selectedDeal, items);
    setShowCreate(false);
    setItems([{ name: '', price: 0, duration: '24 Hours' }]);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-800">Proposals</h2>
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all"
        >
          <Plus className="w-5 h-5" />
          Create Proposal
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.proposals.map((prop: any) => (
          <div key={prop.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-indigo-50 rounded-2xl text-indigo-600">
                <FileText className="w-6 h-6" />
              </div>
              <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${prop.status === 'Accepted' ? 'bg-emerald-100 text-emerald-600' :
                prop.status === 'Rejected' ? 'bg-rose-100 text-rose-600' :
                  'bg-blue-100 text-blue-600'
                }`}>
                {prop.status}
              </span>
            </div>

            <h3 className="text-lg font-bold text-slate-800">{prop.id}</h3>
            <p className="text-sm text-slate-500 mb-6">{prop.clientName}</p>

            <div className="space-y-3 mb-8">
              {prop.courses.map((c: any, i: number) => (
                <div key={i} className="flex items-center justify-between text-xs p-2 bg-slate-50 rounded-lg">
                  <span className="text-slate-600 font-medium truncate max-w-[150px]">{c.name}</span>
                  <span className="text-slate-800 font-bold">${c.price.toLocaleString()}</span>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between pt-6 border-t border-slate-50">
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase">Total Value</p>
                <p className="text-xl font-bold text-slate-800">${prop.totalValue.toLocaleString()}</p>
              </div>
              {prop.status === 'Sent' && (
                <button
                  onClick={() => acceptProposal(prop.id)}
                  className="px-4 py-2 bg-emerald-500 text-white rounded-xl text-xs font-bold hover:bg-emerald-600 shadow-lg shadow-emerald-100"
                >
                  Mark Accepted
                </button>
              )}
            </div>
          </div>
        ))}
        {data.proposals.length === 0 && (
          <div className="col-span-full py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 gap-4">
            <FileText className="w-12 h-12 text-slate-200" />
            <p className="text-lg font-medium">No proposals generated yet</p>
          </div>
        )}
      </div>

      {showCreate && (
        <div className="fixed inset-0 bg-white/20 dark:bg-slate-900/40 backdrop-blur-xl z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h3 className="text-xl font-bold text-slate-800">Draft Training Proposal</h3>
              <button onClick={() => setShowCreate(false)} className="p-2 hover:bg-slate-200 rounded-full transition-colors"><Plus className="w-6 h-6 rotate-45 text-slate-400" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-8">
              <div className="mb-6">
                <label className="text-xs font-bold text-slate-500 uppercase block mb-2">Select Active Deal</label>
                <select
                  required
                  value={selectedDeal}
                  onChange={e => setSelectedDeal(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                  <option value="">Choose a deal to associate...</option>
                  {data.deals.map((d: any) => (
                    <option key={d.id} value={d.id}>{d.title} ({d.clientName})</option>
                  ))}
                </select>
              </div>

              <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto pr-2">
                <p className="text-xs font-bold text-slate-500 uppercase">Courses & Pricing</p>
                {items.map((item, idx) => (
                  <div key={idx} className="grid grid-cols-12 gap-3 items-end bg-slate-50 p-4 rounded-2xl">
                    <div className="col-span-6 space-y-1">
                      <label className="text-[10px] font-bold text-slate-400">Course Name</label>
                      <input
                        type="text"
                        required
                        value={item.name}
                        onChange={e => {
                          const newItems = [...items];
                          newItems[idx].name = e.target.value;
                          setItems(newItems);
                        }}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm"
                        placeholder="e.g., Python Advanced"
                      />
                    </div>
                    <div className="col-span-3 space-y-1">
                      <label className="text-[10px] font-bold text-slate-400">Price ($)</label>
                      <input
                        type="number"
                        required
                        value={item.price}
                        onChange={e => {
                          const newItems = [...items];
                          newItems[idx].price = Number(e.target.value);
                          setItems(newItems);
                        }}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm"
                      />
                    </div>
                    <div className="col-span-3 flex items-center gap-2">
                      <div className="flex-1 space-y-1">
                        <label className="text-[10px] font-bold text-slate-400">Hours</label>
                        <select
                          className="w-full px-2 py-2 bg-white border border-slate-200 rounded-lg text-xs"
                          value={item.duration}
                          onChange={e => {
                            const newItems = [...items];
                            newItems[idx].duration = e.target.value;
                            setItems(newItems);
                          }}
                        >
                          <option>8 Hours</option>
                          <option>24 Hours</option>
                          <option>40 Hours</option>
                        </select>
                      </div>
                      <button
                        type="button"
                        onClick={() => setItems(items.filter((_, i) => i !== idx))}
                        className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg mb-0.5"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={handleAddItem}
                  className="w-full py-3 border-2 border-dashed border-slate-200 rounded-2xl text-slate-500 hover:border-indigo-300 hover:text-indigo-600 transition-all font-medium flex items-center justify-center gap-2 text-sm"
                >
                  <Plus className="w-4 h-4" /> Add Another Course
                </button>
              </div>

              <div className="flex gap-4 pt-4 border-t border-slate-100">
                <button type="button" onClick={() => setShowCreate(false)} className="flex-1 py-3 bg-slate-100 text-slate-600 font-bold rounded-2xl hover:bg-slate-200 transition-colors">Discard Draft</button>
                <button type="submit" className="flex-1 py-3 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 shadow-xl shadow-indigo-100 transition-all flex items-center justify-center gap-2">
                  <Send className="w-4 h-4" /> Generate & Send Proposal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProposalsPage;
