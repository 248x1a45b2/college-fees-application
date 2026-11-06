import React from 'react';
import { useCollegeFees } from '../../context/CollegeFeesContext';
import { TopAppBar, BottomNavBar } from '../common/AppNavigation';
import { 
  CreditCard, 
  ArrowUpRight, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Receipt, 
  ChevronRight, 
  FileText, 
  GraduationCap,
  Calendar,
  Sparkles,
  Users
} from 'lucide-react';

export const StudentDashboardScreen: React.FC = () => {
  const { currentStudent, navigateTo, transactions, viewReceipt, teamMembers } = useCollegeFees();

  if (!currentStudent) {
    return (
      <div className="flex-1 flex flex-col justify-between">
        <TopAppBar title="Student Dashboard" />
        <div className="p-6 text-center text-sm text-slate-500">No student profile selected.</div>
        <BottomNavBar />
      </div>
    );
  }

  // Calculations
  const totalFees = currentStudent.feeItems.reduce((acc, curr) => acc + curr.amount, 0);
  const paidFees = currentStudent.feeItems.reduce((acc, curr) => acc + curr.paidAmount, 0);
  const pendingFees = Math.max(0, totalFees - paidFees);
  const paymentPercentage = totalFees > 0 ? Math.round((paidFees / totalFees) * 100) : 100;

  // Find nearest pending fee item
  const pendingItems = currentStudent.feeItems.filter((f) => f.paidAmount < f.amount);
  const nextDueItem = pendingItems.length > 0 ? pendingItems[0] : null;

  // Student recent transactions
  const studentTx = transactions.filter((t) => t.studentId === currentStudent.id).slice(0, 3);

  return (
    <div className="flex-1 flex flex-col justify-between bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100">
      <TopAppBar
        title={currentStudent.name}
        subtitle={`${currentStudent.rollNumber} · ${currentStudent.branch}`}
        rightAction={
          <button
            type="button"
            onClick={() => navigateTo('student_details')}
            className="w-8 h-8 rounded-full bg-blue-700 text-white flex items-center justify-center font-bold text-xs ring-1 ring-white/30"
            title="View Full Profile"
          >
            {currentStudent.name.charAt(0)}
          </button>
        }
      />

      <div className="flex-1 p-4 space-y-4 overflow-y-auto pb-6">
        {/* Academic Card */}
        <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 rounded-2xl p-4 text-white shadow-md relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center justify-between text-xs text-blue-100 mb-1">
              <span>B.Tech · Year {currentStudent.year} (Sem {currentStudent.semester})</span>
              <span className="font-mono bg-white/15 px-2 py-0.5 rounded-sm text-[11px]">
                Sec {currentStudent.section}
              </span>
            </div>
            <div className="text-xl font-bold tracking-tight mb-3">
              {currentStudent.name}
            </div>

            {/* Micro Stats inside Card */}
            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-white/15">
              <div>
                <span className="text-[10px] text-blue-200 block uppercase font-medium">Pending Dues</span>
                <span className="text-xl font-extrabold font-mono tabular-nums tracking-tight">
                  ₹{pendingFees.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-blue-200 block uppercase font-medium">Fee Clearance</span>
                <span className="text-base font-bold font-mono text-emerald-300">
                  {paymentPercentage}% Paid
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Pending Fee Alert Banner (if pending > 0) */}
        {pendingFees > 0 && nextDueItem && (
          <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 rounded-xl p-3 flex items-start justify-between gap-3 shadow-xs">
            <div className="flex items-start gap-2.5">
              <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <div>
                <div className="text-xs font-bold text-amber-900 dark:text-amber-200">
                  {nextDueItem.category} Fee Due: ₹{(nextDueItem.amount - nextDueItem.paidAmount).toLocaleString('en-IN')}
                </div>
                <div className="text-[11px] text-amber-700 dark:text-amber-400 mt-0.5 flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  <span>Due by {nextDueItem.dueDate} (Avoid late fee fine)</span>
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() =>
                navigateTo('payment', {
                  paymentConfig: {
                    category: nextDueItem.category,
                    suggestedAmount: nextDueItem.amount - nextDueItem.paidAmount,
                    feeItemId: nextDueItem.id
                  }
                })
              }
              className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold shrink-0 shadow-xs active:scale-95 transition-all"
            >
              Pay Now
            </button>
          </div>
        )}

        {/* 3 KPI Stats Grid */}
        <div className="grid grid-cols-3 gap-2.5">
          <div className="bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700/80 shadow-xs">
            <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-medium">Total Fees</span>
            <span className="text-sm sm:text-base font-bold font-mono tabular-nums text-slate-900 dark:text-white mt-0.5 block">
              ₹{totalFees.toLocaleString('en-IN')}
            </span>
          </div>
          <div className="bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700/80 shadow-xs">
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 block font-medium">Total Paid</span>
            <span className="text-sm sm:text-base font-bold font-mono tabular-nums text-emerald-600 dark:text-emerald-400 mt-0.5 block">
              ₹{paidFees.toLocaleString('en-IN')}
            </span>
          </div>
          <div className="bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700/80 shadow-xs">
            <span className="text-[10px] text-rose-600 dark:text-rose-400 block font-medium">Remaining</span>
            <span className="text-sm sm:text-base font-bold font-mono tabular-nums text-rose-600 dark:text-rose-400 mt-0.5 block">
              ₹{pendingFees.toLocaleString('en-IN')}
            </span>
          </div>
        </div>

        {/* Fee Category Progress Breakdown */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700/80 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Fee Category Status
            </h3>
            <button
              type="button"
              onClick={() => navigateTo('fee_details')}
              className="text-[11px] text-blue-600 dark:text-blue-400 font-medium hover:underline flex items-center gap-0.5"
            >
              <span>View Breakdown</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {currentStudent.feeItems.map((item) => {
              const itemPct = item.amount > 0 ? Math.round((item.paidAmount / item.amount) * 100) : 100;
              const isCleared = item.paidAmount >= item.amount;
              return (
                <div key={item.id} className="text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-slate-800 dark:text-slate-200">{item.category}</span>
                    <span className="font-mono tabular-nums text-slate-600 dark:text-slate-400 text-[11px]">
                      ₹{item.paidAmount.toLocaleString('en-IN')} / ₹{item.amount.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isCleared ? 'bg-emerald-500' : itemPct > 0 ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-600'
                      }`}
                      style={{ width: `${itemPct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Action Navigation Grid */}
        <div className="grid grid-cols-2 gap-2.5">
          <button
            type="button"
            onClick={() => navigateTo('payment')}
            className="p-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs flex items-center justify-between shadow-xs transition-all active:scale-[0.98]"
          >
            <div className="flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-blue-200" />
              <span>Make Fee Payment</span>
            </div>
            <ArrowUpRight className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => navigateTo('payment_history')}
            className="p-3.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-800 dark:text-white border border-slate-200 dark:border-slate-700 font-semibold text-xs flex items-center justify-between shadow-xs transition-all active:scale-[0.98]"
          >
            <div className="flex items-center gap-2">
              <Receipt className="w-4 h-4 text-slate-500 dark:text-slate-400" />
              <span>Payment Receipts</span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>
        </div>

        {/* Recent Transactions List */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700/80 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Recent Transactions
            </h3>
            <button
              type="button"
              onClick={() => navigateTo('payment_history')}
              className="text-[11px] text-blue-600 dark:text-blue-400 font-medium hover:underline"
            >
              See All
            </button>
          </div>

          {studentTx.length === 0 ? (
            <div className="py-6 text-center text-xs text-slate-500">
              No payment transactions recorded yet.
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-700/60">
              {studentTx.map((tx) => (
                <div
                  key={tx.id}
                  onClick={() => viewReceipt(tx)}
                  className="py-2.5 flex items-center justify-between hover:bg-slate-50/60 dark:hover:bg-slate-700/30 cursor-pointer rounded-lg px-1 transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-semibold text-xs text-slate-900 dark:text-white block">
                        {tx.feeCategory}
                      </span>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                        {new Date(tx.date).toLocaleDateString('en-IN', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric'
                        })} · {tx.receiptNumber}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-bold font-mono text-xs tabular-nums text-emerald-600 dark:text-emerald-400 block">
                      +₹{tx.amount.toLocaleString('en-IN')}
                    </span>
                    <span className="text-[10px] text-blue-600 dark:text-blue-400 font-medium">
                      Receipt &rarr;
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Project Team Members Card */}
        <div
          onClick={() => navigateTo('team_members')}
          className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-800/80 rounded-xl p-3.5 border border-blue-200/80 dark:border-slate-700 shadow-xs cursor-pointer hover:border-blue-400 transition-colors flex items-center justify-between gap-3"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-xs text-slate-900 dark:text-white block">
                KHIT Project Team & Guide
              </span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400">
                Lead: Rahul Indla · {teamMembers.length} Contributors
              </span>
            </div>
          </div>

          <span className="text-[11px] text-blue-600 dark:text-blue-400 font-semibold flex items-center gap-0.5">
            <span>View Team</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>

      <BottomNavBar />
    </div>
  );
};
