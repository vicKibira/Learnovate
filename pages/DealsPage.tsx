
import React from 'react';
import { Briefcase, ChevronRight, DollarSign, Calendar, Clock, User, CheckCircle2 } from 'lucide-react';
import { DealStage } from '../types';

const DealsPage: React.FC<{ store: any }> = ({ store }) => {
  const { data, updateDealStage } = store;

  const dealsByStage = (stage: DealStage) => data.deals.filter((d: any) => d.stage === stage);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-800">Sales Pipeline</h2>
        <div className="flex gap-4">
           <div className="px-4 py-2 bg-indigo-50 rounded-xl border border-indigo-100 text-indigo-700 font-bold flex items-center gap-2">
             <DollarSign className="w-4 h-4" />
             Total Pipeline: ${data.deals.reduce((acc: number, d: any) => acc + d.value, 0).toLocaleString()}
           </div>
        </div>
      </div>

      {/* Horizontal Pipeline View */}
      <div className="flex gap-4 overflow-x-auto pb-6 scrollbar-thin scrollbar-thumb-slate-200">
        {Object.values(DealStage).slice(0, 5).map((stage) => (
          <div key={stage} className="min-w-[320px] flex-shrink-0 space-y-4">
            <div className="flex items-center justify-between px-2">
              <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                {stage}
                <span className="bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full text-[10px]">{dealsByStage(stage).length}</span>
              </h3>
            </div>
            
            <div className="bg-slate-100/50 p-3 rounded-2xl min-h-[500px] border border-dashed border-slate-200 space-y-3">
              {dealsByStage(stage).map((deal: any) => (
                <div key={deal.id} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all cursor-grab active:cursor-grabbing">
                  <div className="flex items-start justify-between mb-3">
                    <span className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase ${
                      deal.type === 'Corporate' ? 'bg-blue-50 text-blue-500' : 'bg-emerald-50 text-emerald-500'
                    }`}>
                      {deal.type}
                    </span>
                    <button className="text-slate-300 hover:text-slate-600"><Clock className="w-4 h-4" /></button>
                  </div>
                  
                  <h4 className="font-bold text-slate-800 text-sm mb-1">{deal.title}</h4>
                  <p className="text-xs text-slate-500 mb-4">{deal.clientName}</p>

                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-50">
                    <div className="flex items-center gap-1.5 text-slate-800 font-bold text-sm">
                      <DollarSign className="w-3.5 h-3.5 text-emerald-500" />
                      {deal.value.toLocaleString()}
                    </div>
                    <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500">
                      {deal.assignedTo.charAt(0)}
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-1 gap-1">
                    <select 
                      value={deal.stage}
                      onChange={(e) => updateDealStage(deal.id, e.target.value as any)}
                      className="w-full text-[10px] py-1 bg-slate-50 border-none rounded-lg focus:ring-1 focus:ring-indigo-500 text-slate-600 font-medium"
                    >
                      {Object.values(DealStage).map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
              ))}
              {dealsByStage(stage).length === 0 && (
                <div className="h-24 flex items-center justify-center text-slate-300 text-xs italic border border-dashed border-slate-200 rounded-xl">
                  Empty stage
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DealsPage;
