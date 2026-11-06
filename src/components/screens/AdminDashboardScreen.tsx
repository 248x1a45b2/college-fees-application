import React, { useState } from 'react';
import { useCollegeFees } from '../../context/CollegeFeesContext';
import { TopAppBar, BottomNavBar } from '../common/AppNavigation';
import { 
  Users, 
  DollarSign, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle2, 
  Search, 
  Plus, 
  Layers, 
  Bell, 
  FileText, 
  Trash2, 
  Eye, 
  ChevronRight,
  Filter
} from 'lucide-react';
import { AddStudentModal } from '../modals/AddStudentModal';
import { ManageFeeStructureModal } from '../modals/ManageFeeStructureModal';
import { SendReminderModal } from '../modals/SendReminderModal';
import { Student } from '../../types';

export const AdminDashboardScreen: React.FC = () => {
  const { students, feeStructures, transactions, setCurrentStudent, navigateTo, deleteStudent } = useCollegeFees();

  const [searchTerm, setSearchTerm] = useState('');
  const [branchFilter, setBranchFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'cleared' | 'pending'>('all');

  // Modal controls
  const [isAddStudentOpen, setIsAddStudentOpen] = useState(false);
  const [isFeeStructureOpen, setIsFeeStructureOpen] = useState(false);
  const [isReminderOpen, setIsReminderOpen] = useState(false);
  const [targetStudentForReminder, setTargetStudentForReminder] = useState<Student | null>(null);

  // College-wide calculations
  let totalAssessed = 0;
  let totalCollected = 0;

  students.forEach((student) => {
    student.feeItems.forEach((item) => {
      totalAssessed += item.amount;
      totalCollected += item.paidAmount;
    });
  });

  const totalOutstanding = Math.max(0, totalAssessed - totalCollected);
  const collectionRate = totalAssessed > 0 ? Math.round((totalCollected / totalAssessed) * 100) : 0;

  // Filter students
  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.rollNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesBranch = branchFilter === 'all' || s.branch === branchFilter;

    const sTotal = s.feeItems.reduce((acc, curr) => acc + curr.amount, 0);
    const sPaid = s.feeItems.reduce((acc, curr) => acc + curr.paidAmount, 0);
    const isCleared = sPaid >= sTotal && sTotal > 0;

    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'cleared' && isCleared) ||
      (statusFilter === 'pending' && !isCleared);

    return matchesSearch && matchesBranch && matchesStatus;
  });

  const handleOpenStudentView = (student: Student) => {
    setCurrentStudent(student);
    navigateTo('student_details');
  };

  const handleOpenReminder = (student?: Student) => {
    setTargetStudentForReminder(student || null);
    setIsReminderOpen(true);
  };

  return (
    <div className="flex-1 flex flex-col justify-between bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100">
      <TopAppBar
        title="Admin Console"
        subtitle="Finance & Accounts Division"
        rightAction={
          <button
            type="button"
            onClick={() => navigateTo('reports')}
            className="p-1.5 rounded-lg text-white hover:bg-white/10"
            title="View Audit Reports"
          >
            <FileText className="w-4 h-4" />
          </button>
        }
      />

      <div className="flex-1 p-4 space-y-4 overflow-y-auto pb-6">
        {/* KPI Financial Overview Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <div className="bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700/80 shadow-xs">
            <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-medium">Total Assessed</span>
            <span className="text-base font-extrabold font-mono tabular-nums text-slate-900 dark:text-white mt-0.5 block">
              ₹{totalAssessed.toLocaleString('en-IN')}
            </span>
            <span className="text-[10px] text-slate-400 mt-0.5 block">{students.length} Registered Students</span>
          </div>

          <div className="bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700/80 shadow-xs">
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 block font-medium">Total Collected</span>
            <span className="text-base font-extrabold font-mono tabular-nums text-emerald-600 dark:text-emerald-400 mt-0.5 block">
              ₹{totalCollected.toLocaleString('en-IN')}
            </span>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5 block">
              {collectionRate}% Realization
            </span>
          </div>

          <div className="bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700/80 shadow-xs">
            <span className="text-[10px] text-rose-600 dark:text-rose-400 block font-medium">Outstanding Dues</span>
            <span className="text-base font-extrabold font-mono tabular-nums text-rose-600 dark:text-rose-400 mt-0.5 block">
              ₹{totalOutstanding.toLocaleString('en-IN')}
            </span>
            <span className="text-[10px] text-rose-500 mt-0.5 block">Pending Recovery</span>
          </div>

          <div className="bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700/80 shadow-xs">
            <span className="text-[10px] text-blue-600 dark:text-blue-400 block font-medium">Total Transactions</span>
            <span className="text-base font-extrabold font-mono tabular-nums text-blue-600 dark:text-blue-400 mt-0.5 block">
              {transactions.length}
            </span>
            <span className="text-[10px] text-slate-400 mt-0.5 block">Gateway Receipts</span>
          </div>
        </div>

        {/* Quick Management Toolbar */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setIsAddStudentOpen(true)}
            className="flex-1 py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Student</span>
          </button>

          <button
            type="button"
            onClick={() => setIsFeeStructureOpen(true)}
            className="py-2 px-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <Layers className="w-3.5 h-3.5 text-blue-600" />
            <span>Fee Structures</span>
          </button>

          <button
            type="button"
            onClick={() => handleOpenReminder()}
            className="py-2 px-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <Bell className="w-3.5 h-3.5" />
            <span>Broadcast Reminders</span>
          </button>

          <button
            type="button"
            onClick={() => navigateTo('reports')}
            className="py-2 px-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <FileText className="w-3.5 h-3.5 text-slate-500" />
            <span>Audit Reports</span>
          </button>

          <button
            type="button"
            onClick={() => navigateTo('team_members')}
            className="py-2 px-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 hover:bg-blue-100/60 text-blue-700 dark:text-blue-300 text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <Users className="w-3.5 h-3.5" />
            <span>Project Team</span>
          </button>
        </div>

        {/* Search & Filter Controls */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-3 border border-slate-200 dark:border-slate-700/80 shadow-xs space-y-2.5">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search students by Roll Number, Name, or Email..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={branchFilter}
              onChange={(e) => setBranchFilter(e.target.value)}
              className="px-2.5 py-1 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-medium"
            >
              <option value="all">All Branches</option>
              <option value="Computer Science & Engineering">CSE</option>
              <option value="Electronics & Communication">ECE</option>
              <option value="Mechanical Engineering">Mechanical</option>
              <option value="Information Technology">IT</option>
            </select>

            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-900 p-0.5 rounded-lg text-xs">
              <button
                type="button"
                onClick={() => setStatusFilter('all')}
                className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
                  statusFilter === 'all'
                    ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                All
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter('pending')}
                className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
                  statusFilter === 'pending'
                    ? 'bg-white dark:bg-slate-800 text-rose-600 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Pending Dues
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter('cleared')}
                className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
                  statusFilter === 'cleared'
                    ? 'bg-white dark:bg-slate-800 text-emerald-600 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Fully Paid
              </button>
            </div>

            <span className="text-[11px] text-slate-400 ml-auto">
              Found {filteredStudents.length} students
            </span>
          </div>
        </div>

        {/* Student Records List */}
        <div className="space-y-2.5">
          {filteredStudents.length === 0 ? (
            <div className="p-8 text-center bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-xs text-slate-500">
              No student records matched your filters.
            </div>
          ) : (
            filteredStudents.map((student) => {
              const sTotal = student.feeItems.reduce((acc, curr) => acc + curr.amount, 0);
              const sPaid = student.feeItems.reduce((acc, curr) => acc + curr.paidAmount, 0);
              const sPending = Math.max(0, sTotal - sPaid);
              const isCleared = sPaid >= sTotal && sTotal > 0;

              return (
                <div
                  key={student.id}
                  className="bg-white dark:bg-slate-800 rounded-xl p-3.5 border border-slate-200 dark:border-slate-700/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-full bg-blue-100 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 font-bold text-xs flex items-center justify-center shrink-0">
                      {student.name.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-slate-900 dark:text-white truncate">
                          {student.name}
                        </span>
                        <span className="text-[10px] font-mono font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950 px-1.5 py-0.5 rounded-sm">
                          {student.rollNumber}
                        </span>
                        {isCleared ? (
                          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-0.5">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Cleared</span>
                          </span>
                        ) : (
                          <span className="text-[10px] text-rose-600 dark:text-rose-400 font-medium flex items-center gap-0.5">
                            <AlertCircle className="w-3 h-3" />
                            <span>Due: ₹{sPending.toLocaleString('en-IN')}</span>
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        {student.branch} · Year {student.year} (Sec {student.section})
                      </div>
                    </div>
                  </div>

                  {/* Financial Mini Bar & Actions */}
                  <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-700">
                    <div className="text-left sm:text-right text-[11px]">
                      <span className="text-slate-400 block text-[10px]">Paid / Total</span>
                      <span className="font-mono tabular-nums font-semibold text-slate-800 dark:text-slate-200">
                        ₹{sPaid.toLocaleString('en-IN')} / ₹{sTotal.toLocaleString('en-IN')}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleOpenStudentView(student)}
                        className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 text-slate-700 dark:text-slate-300"
                        title="View profile & ledger"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>

                      {sPending > 0 && (
                        <button
                          type="button"
                          onClick={() => handleOpenReminder(student)}
                          className="p-1.5 rounded-lg border border-amber-200 dark:border-amber-800 text-amber-600 hover:bg-amber-50"
                          title="Send fee due reminder"
                        >
                          <Bell className="w-3.5 h-3.5" />
                        </button>
                      )}

                      {students.length > 1 && (
                        <button
                          type="button"
                          onClick={() => deleteStudent(student.id)}
                          className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                          title="Delete student record"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      <BottomNavBar />

      {/* Modals */}
      <AddStudentModal
        isOpen={isAddStudentOpen}
        onClose={() => setIsAddStudentOpen(false)}
      />

      <ManageFeeStructureModal
        isOpen={isFeeStructureOpen}
        onClose={() => setIsFeeStructureOpen(false)}
      />

      <SendReminderModal
        isOpen={isReminderOpen}
        onClose={() => {
          setIsReminderOpen(false);
          setTargetStudentForReminder(null);
        }}
        targetStudent={targetStudentForReminder}
      />
    </div>
  );
};
