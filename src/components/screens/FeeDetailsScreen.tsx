import React, { useState } from 'react';
import { useCollegeFees } from '../../context/CollegeFeesContext';
import { TopAppBar, BottomNavBar } from '../common/AppNavigation';
import { 
  PieChart, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Calendar, 
  CreditCard, 
  Bell, 
  Check, 
  HelpCircle,
  FileCheck
} from 'lucide-react';

export const FeeDetailsScreen: React.FC = () => {
  const { currentStudent, navigateTo, sendFeeReminder, goBack } = useCollegeFees();
  const [reminderSent, setReminderSent] = useState<string | null>(null);

  if (!currentStudent) {
    return (
      <div className="flex-1 flex flex-col justify-between">
        <TopAppBar title="Fee Breakdown" showBack onBack={goBack} />
        <div className="p-6 text-center text-sm text-slate-500">No student profile selected.</div>
        <BottomNavBar />
      </div>
    );
  }

  const totalFees = currentStudent.feeItems.reduce((acc, curr) => acc + curr.amount, 0);
  const totalPaid = currentStudent.feeItems.reduce((acc, curr) => acc + curr.paidAmount, 0);
  const remaining = Math.max(0, totalFees - totalPaid);

  const handleSendReminderSelf = (channel: 'sms' | 'email') => {
    sendFeeReminder(currentStudent.id, channel);
    setReminderSent(`Fee due reminder alert sent to student's registered ${channel.toUpperCase()}!`);
    setTimeout(() => setReminderSent(null), 3500);
  };

  return (
    <div className="flex-1 flex flex-col justify-between bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100">
      <TopAppBar
        title="Fee Details & Structure"
        subtitle={`${currentStudent.rollNumber} · Academic Year 2026-27`}
        showBack
        onBack={goBack}
      />

      <div className="flex-1 p-4 space-y-4 overflow-y-auto pb-6">
        {/* Total Summary Hero Card */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-200 dark:border-slate-700/80 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
              Annual Fees Status
            </span>
            <span className="text-[11px] font-mono bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded-md font-semibold">
              AY 2026-2027
            </span>
          </div>

          <div className="flex items-baseline justify-between mb-3">
            <div>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 block">Total Balance Due</span>
              <span className="text-2xl font-extrabold font-mono tabular-nums text-slate-900 dark:text-white">
                ₹{remaining.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="text-right">
              <span className="text-[11px] text-emerald-600 dark:text-emerald-400 block font-medium">Paid So Far</span>
              <span className="text-lg font-bold font-mono tabular-nums text-emerald-600 dark:text-emerald-400">
                ₹{totalPaid.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-slate-100 dark:bg-slate-700 h-2.5 rounded-full overflow-hidden mb-1">
            <div
              className="h-full bg-blue-600 rounded-full transition-all duration-500"
              style={{ width: `${totalFees > 0 ? (totalPaid / totalFees) * 100 : 0}%` }}
            />
          </div>
          <div className="flex justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-1">
            <span>Overall Total: ₹{totalFees.toLocaleString('en-IN')}</span>
            <span>{totalFees > 0 ? Math.round((totalPaid / totalFees) * 100) : 100}% Completed</span>
          </div>

          {remaining > 0 && (
            <button
              type="button"
              onClick={() =>
                navigateTo('payment', {
                  paymentConfig: {
                    category: 'Total Remaining College Balance',
                    suggestedAmount: remaining
                  }
                })
              }
              className="mt-3 w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-colors"
            >
              <CreditCard className="w-4 h-4" />
              <span>Clear Entire Remaining Balance (₹{remaining.toLocaleString('en-IN')})</span>
            </button>
          )}
        </div>

        {reminderSent && (
          <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 text-blue-700 dark:text-blue-300 text-xs flex items-center gap-2">
            <Check className="w-4 h-4 shrink-0 text-blue-600" />
            <span>{reminderSent}</span>
          </div>
        )}

        {/* Itemized Fee Breakdown List */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Itemized Fee Heads ({currentStudent.feeItems.length})
            </h3>
            <span className="text-[11px] text-slate-500">Official Schedule</span>
          </div>

          {currentStudent.feeItems.map((item) => {
            const isFullyPaid = item.paidAmount >= item.amount;
            const itemPending = Math.max(0, item.amount - item.paidAmount);

            return (
              <div
                key={item.id}
                className="bg-white dark:bg-slate-800 rounded-xl p-3.5 border border-slate-200 dark:border-slate-700/80 shadow-xs transition-all"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-xs text-slate-900 dark:text-white truncate">
                        {item.category} Fee
                      </span>
                      {isFullyPaid ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-1.5 py-0.5 rounded-sm">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Paid</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-1.5 py-0.5 rounded-sm">
                          <Clock className="w-3 h-3" />
                          <span>Pending</span>
                        </span>
                      )}
                    </div>

                    {item.description && (
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-2 leading-relaxed">
                        {item.description}
                      </p>
                    )}

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-slate-500 dark:text-slate-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        <span>Due Date: <strong className="text-slate-700 dark:text-slate-300 font-medium">{item.dueDate}</strong></span>
                      </span>
                      <span>
                        Paid: <strong className="text-emerald-600 font-mono">₹{item.paidAmount.toLocaleString('en-IN')}</strong>
                      </span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-sm font-bold font-mono tabular-nums text-slate-900 dark:text-white block">
                      ₹{item.amount.toLocaleString('en-IN')}
                    </span>
                    {!isFullyPaid && (
                      <span className="text-[10px] font-mono text-rose-600 dark:text-rose-400 block mt-0.5">
                        Due: ₹{itemPending.toLocaleString('en-IN')}
                      </span>
                    )}
                  </div>
                </div>

                {/* Selective Payment or Receipt Action */}
                {!isFullyPaid && (
                  <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between">
                    <span className="text-[11px] text-slate-500">Selective Item Payment:</span>
                    <button
                      type="button"
                      onClick={() =>
                        navigateTo('payment', {
                          paymentConfig: {
                            category: `${item.category} Fee`,
                            suggestedAmount: itemPending,
                            feeItemId: item.id
                          }
                        })
                      }
                      className="px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-xs active:scale-95 transition-all"
                    >
                      Pay ₹{itemPending.toLocaleString('en-IN')}
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Reminders & Notifications Simulator Card */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700/80 shadow-xs">
          <div className="flex items-center gap-2 mb-2">
            <Bell className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Fee Due Reminder System
            </h4>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-3 leading-relaxed">
            Students receive automated SMS, push notifications, and emails 7 days prior to the deadline to avoid late fee penalty charges.
          </p>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleSendReminderSelf('sms')}
              className="py-2 px-3 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-medium transition-colors"
            >
              Test SMS Alert
            </button>
            <button
              type="button"
              onClick={() => handleSendReminderSelf('email')}
              className="py-2 px-3 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-medium transition-colors"
            >
              Test Email Alert
            </button>
          </div>
        </div>
      </div>

      <BottomNavBar />
    </div>
  );
};
