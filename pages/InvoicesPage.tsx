
import React from 'react';
import { 
  CreditCard, DollarSign, Clock, CheckCircle, 
  AlertCircle, Download, ExternalLink, Filter, Search 
} from 'lucide-react';
import { UserRole } from '../types';

const InvoicesPage: React.FC<{ store: any }> = ({ store }) => {
  const { data, confirmPayment, currentUser } = store;

  const isFinance = currentUser.role === UserRole.FINANCE || currentUser.role === UserRole.DIRECTOR;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-800">Invoices & Payments</h2>
        <div className="flex gap-3">
          <div className="px-4 py-2 bg-rose-50 border border-rose-100 rounded-xl flex items-center gap-2">
            <Clock className="w-4 h-4 text-rose-600" />
            <span className="text-sm font-bold text-rose-700">
              Pending: ${data.invoices.filter((i: any) => i.status === 'Pending').reduce((acc: number, i: any) => acc + i.amount, 0).toLocaleString()}
            </span>
          </div>
          <div className="px-4 py-2 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <span className="text-sm font-bold text-emerald-700">
              Paid: ${data.invoices.filter((i: any) => i.status === 'Paid').reduce((acc: number, i: any) => acc + i.amount, 0).toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Invoice #</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Deal</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Amount</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Due Date</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Status</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {data.invoices.map((inv: any) => (
              <tr key={inv.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 font-bold text-slate-700 text-sm">{inv.invoiceNumber}</td>
                <td className="px-6 py-4">
                  <p className="text-sm font-medium text-slate-800">
                    {data.deals.find((d: any) => d.id === inv.dealId)?.title || 'Unknown Deal'}
                  </p>
                </td>
                <td className="px-6 py-4 font-bold text-slate-900 text-sm">${inv.amount.toLocaleString()}</td>
                <td className="px-6 py-4 text-xs text-slate-500 font-medium">{new Date(inv.dueDate).toLocaleDateString()}</td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${
                    inv.status === 'Paid' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'
                  }`}>
                    {inv.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    {inv.status === 'Pending' && isFinance && (
                      <button 
                        onClick={() => confirmPayment(inv.id)}
                        className="px-3 py-1.5 bg-indigo-600 text-white text-[10px] font-bold rounded-lg hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100"
                      >
                        Confirm Payment
                      </button>
                    )}
                    <button className="p-2 text-slate-400 hover:text-slate-600"><Download className="w-4 h-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {data.invoices.length === 0 && (
          <div className="p-20 text-center text-slate-400">
            <CreditCard className="w-12 h-12 text-slate-200 mx-auto mb-4" />
            <p className="font-medium text-lg">No invoices generated</p>
            <p className="text-sm">Invoices are created automatically when proposals are accepted.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default InvoicesPage;
