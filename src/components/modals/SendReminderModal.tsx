import React, { useState } from 'react';
import { useCollegeFees } from '../../context/CollegeFeesContext';
import { X, Bell, Send, CheckCircle2, MessageSquare, Mail, Smartphone } from 'lucide-react';
import { Student } from '../../types';

interface SendReminderModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetStudent?: Student | null;
}

export const SendReminderModal: React.FC<SendReminderModalProps> = ({
  isOpen,
  onClose,
  targetStudent
}) => {
  const { sendFeeReminder, sendBulkFeeReminders, students } = useCollegeFees();
  const [channel, setChannel] = useState<'sms' | 'email' | 'push'>('sms');
  const [successCount, setSuccessCount] = useState<number | null>(null);

  if (!isOpen) return null;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (targetStudent) {
      sendFeeReminder(targetStudent.id, channel);
      setSuccessCount(1);
    } else {
      const count = sendBulkFeeReminders(channel);
      setSuccessCount(count);
    }

    setTimeout(() => {
      setSuccessCount(null);
      onClose();
    }, 1800);
  };

  const pendingStudentsCount = students.filter((s) => {
    const pending = s.feeItems.reduce((acc, curr) => acc + (curr.amount - curr.paidAmount), 0);
    return pending > 0;
  }).length;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-md w-full border border-slate-200 dark:border-slate-700 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-amber-500" />
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              {targetStudent ? `Send Due Reminder: ${targetStudent.name}` : 'Broadcast Fee Due Reminders'}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {successCount !== null ? (
          <div className="p-8 text-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              Fee Reminders Dispatched!
            </h4>
            <p className="text-xs text-slate-500">
              Successfully sent {successCount} automated fee alerts via {channel.toUpperCase()}.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSend} className="p-4 space-y-4 text-xs">
            <div>
              <span className="text-[11px] font-medium text-slate-500 block mb-1">
                Recipient Target:
              </span>
              <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                {targetStudent ? (
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white block">
                      {targetStudent.name} ({targetStudent.rollNumber})
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Pending Dues: ₹
                      {targetStudent.feeItems
                        .reduce((acc, curr) => acc + (curr.amount - curr.paidAmount), 0)
                        .toLocaleString('en-IN')}
                    </span>
                  </div>
                ) : (
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white block">
                      All Students with Outstanding Dues ({pendingStudentsCount} students)
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Automated campus-wide batch broadcast
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Delivery Channel:
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'sms', label: 'SMS Gateway', icon: MessageSquare },
                  { id: 'email', label: 'Official Email', icon: Mail },
                  { id: 'push', label: 'In-App Push', icon: Smartphone },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setChannel(item.id as any)}
                      className={`p-2.5 rounded-xl border text-center flex flex-col items-center gap-1 transition-all ${
                        channel === item.id
                          ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 font-semibold'
                          : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="text-[10px]">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="p-2.5 rounded-lg bg-blue-50/50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900 text-[11px] text-blue-800 dark:text-blue-300">
              <strong>Template Preview:</strong> &ldquo;Dear Student/Parent, Fee dues for Academic Year 2026-27 are pending at Apex Institute. Please clear dues before the deadline on the mobile portal to avoid late fee penalty.&rdquo;
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-400"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-lg bg-blue-600 text-white font-semibold flex items-center gap-1.5 shadow-xs hover:bg-blue-700 transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send Notifications</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
