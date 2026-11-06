import React, { useState } from 'react';
import { useCollegeFees } from '../../context/CollegeFeesContext';
import { TopAppBar, BottomNavBar } from '../common/AppNavigation';
import { 
  Search, 
  Filter, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Receipt, 
  Download, 
  ArrowUpRight, 
  Calendar 
} from 'lucide-react';
import { Transaction } from '../../types';

export const PaymentHistoryScreen: React.FC = () => {
  const { currentStudent, transactions, viewReceipt, userRole, goBack } = useCollegeFees();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'success' | 'failed' | 'pending'>('all');

  // Filter transactions
  // In student role, only show student's transactions; in admin, show all
  const baseTransactions = userRole === 'admin' 
    ? transactions 
    : transactions.filter((t) => t.studentId === currentStudent?.id);

  const filteredTransactions = baseTransactions.filter((tx) => {
    const matchesStatus = statusFilter === 'all' || tx.status === statusFilter;
    const matchesSearch = 
      tx.receiptNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.transactionReference.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.feeCategory.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.studentRoll.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const totalAmount = filteredTransactions
    .filter((t) => t.status === 'success')
    .reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="flex-1 flex flex-col justify-between bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100">
      <TopAppBar
        title="Payment History"
        subtitle={userRole === 'admin' ? 'College Central Ledger' : `${currentStudent?.name} (${currentStudent?.rollNumber})`}
        showBack
        onBack={goBack}
      />

      <div className="flex-1 p-4 space-y-4 overflow-y-auto pb-6">
        {/* Search & Filter Bar */}
        <div className="space-y-2">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search receipt #, reference, category..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Status Filters */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            {(['all', 'success', 'pending', 'failed'] as const).map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1 rounded-lg font-medium capitalize whitespace-nowrap transition-colors ${
                  statusFilter === st
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:bg-slate-50'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Ledger Summary Stats */}
        <div className="flex items-center justify-between px-1 text-xs text-slate-500 dark:text-slate-400">
          <span>Showing {filteredTransactions.length} records</span>
          <span className="font-mono tabular-nums">
            Total Settled: <strong className="text-emerald-600 dark:text-emerald-400">₹{totalAmount.toLocaleString('en-IN')}</strong>
          </span>
        </div>

        {/* Transactions Card List */}
        {filteredTransactions.length === 0 ? (
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 border border-slate-200 dark:border-slate-700/80 text-center">
            <Receipt className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
            <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300">No Transactions Found</h4>
            <p className="text-[11px] text-slate-500 mt-1">Try adjusting your search or status filter.</p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {filteredTransactions.map((tx) => {
              const isSuccess = tx.status === 'success';
              const isPending = tx.status === 'pending';

              return (
                <div
                  key={tx.id}
                  onClick={() => viewReceipt(tx)}
                  className="bg-white dark:bg-slate-800 rounded-xl p-3.5 border border-slate-200 dark:border-slate-700/80 shadow-xs hover:border-blue-400 dark:hover:border-blue-600 cursor-pointer transition-all active:scale-[0.99]"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-2.5 min-w-0">
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                          isSuccess
                            ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400'
                            : isPending
                            ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400'
                            : 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400'
                        }`}
                      >
                        {isSuccess ? <CheckCircle2 className="w-4 h-4" /> : isPending ? <Clock className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                      </div>

                      <div className="min-w-0">
                        <span className="font-bold text-xs text-slate-900 dark:text-white truncate block">
                          {tx.feeCategory}
                        </span>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 space-y-0.5">
                          <span className="block font-mono text-[10px] text-slate-400">
                            Ref: {tx.transactionReference}
                          </span>
                          <span className="block">
                            {userRole === 'admin' && `${tx.studentName} (${tx.studentRoll}) · `}
                            {new Date(tx.date).toLocaleDateString('en-IN', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="font-extrabold font-mono tabular-nums text-xs text-slate-900 dark:text-white block">
                        ₹{tx.amount.toLocaleString('en-IN')}
                      </span>
                      <span className="inline-flex items-center gap-0.5 text-[10px] text-blue-600 dark:text-blue-400 font-semibold mt-1">
                        <span>Receipt</span>
                        <ArrowUpRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <BottomNavBar />
    </div>
  );
};
