import React, { useState } from 'react';
import { useCollegeFees } from '../../context/CollegeFeesContext';
import { TopAppBar, BottomNavBar } from '../common/AppNavigation';
import { 
  FileText, 
  Download, 
  Printer, 
  BarChart3, 
  PieChart, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowLeft,
  Calendar,
  Building
} from 'lucide-react';

export const ReportsScreen: React.FC = () => {
  const { students, transactions, feeStructures, collegeInfo, goBack } = useCollegeFees();
  const [reportType, setReportType] = useState<'branch' | 'category' | 'defaulters'>('branch');

  // Overall sums
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

  // Branch-wise summary
  const branchMap: Record<string, { branch: string; assessed: number; collected: number; studentCount: number }> = {};
  students.forEach((student) => {
    if (!branchMap[student.branch]) {
      branchMap[student.branch] = {
        branch: student.branch,
        assessed: 0,
        collected: 0,
        studentCount: 0
      };
    }
    branchMap[student.branch].studentCount += 1;
    student.feeItems.forEach((item) => {
      branchMap[student.branch].assessed += item.amount;
      branchMap[student.branch].collected += item.paidAmount;
    });
  });

  const branchReports = Object.values(branchMap);

  // Fee category distribution
  const categoryMap: Record<string, { category: string; total: number; collected: number }> = {};
  students.forEach((student) => {
    student.feeItems.forEach((item) => {
      if (!categoryMap[item.category]) {
        categoryMap[item.category] = { category: item.category, total: 0, collected: 0 };
      }
      categoryMap[item.category].total += item.amount;
      categoryMap[item.category].collected += item.paidAmount;
    });
  });

  const categoryReports = Object.values(categoryMap);

  // Defaulters list (students with pending dues)
  const defaulters = students
    .map((s) => {
      const sTotal = s.feeItems.reduce((acc, curr) => acc + curr.amount, 0);
      const sPaid = s.feeItems.reduce((acc, curr) => acc + curr.paidAmount, 0);
      const sPending = sTotal - sPaid;
      return {
        ...s,
        pendingAmount: sPending,
        totalAmount: sTotal,
        paidAmount: sPaid
      };
    })
    .filter((s) => s.pendingAmount > 0)
    .sort((a, b) => b.pendingAmount - a.pendingAmount);

  // CSV Export handler
  const exportToCSV = () => {
    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += 'Roll Number,Student Name,Branch,Year,Section,Total Fees (INR),Paid Fees (INR),Pending Fees (INR),Status\n';

    students.forEach((s) => {
      const sTotal = s.feeItems.reduce((acc, curr) => acc + curr.amount, 0);
      const sPaid = s.feeItems.reduce((acc, curr) => acc + curr.paidAmount, 0);
      const sPending = sTotal - sPaid;
      const status = sPending === 0 ? 'Fully Paid' : 'Pending Dues';
      csvContent += `"${s.rollNumber}","${s.name}","${s.branch}",${s.year},"${s.section}",${sTotal},${sPaid},${sPending},"${status}"\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `AITS_Fee_Collection_Report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const printReport = () => {
    window.print();
  };

  return (
    <div className="flex-1 flex flex-col justify-between bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100">
      <TopAppBar
        title="Fee Collection Reports"
        subtitle="Audited Financial Summaries"
        showBack
        onBack={goBack}
        rightAction={
          <button
            type="button"
            onClick={printReport}
            className="p-1.5 rounded-lg text-white hover:bg-white/10"
            title="Print Report"
          >
            <Printer className="w-4 h-4" />
          </button>
        }
      />

      <div className="flex-1 p-4 space-y-4 overflow-y-auto pb-6">
        {/* Actions Bar */}
        <div className="no-print flex flex-wrap items-center justify-between gap-2">
          {/* Segmented Report Switcher */}
          <div className="flex bg-white dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700 text-xs shadow-xs">
            <button
              type="button"
              onClick={() => setReportType('branch')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                reportType === 'branch'
                  ? 'bg-blue-600 text-white shadow-xs font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Branch Analysis
            </button>
            <button
              type="button"
              onClick={() => setReportType('category')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                reportType === 'category'
                  ? 'bg-blue-600 text-white shadow-xs font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Fee Heads
            </button>
            <button
              type="button"
              onClick={() => setReportType('defaulters')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                reportType === 'defaulters'
                  ? 'bg-blue-600 text-white shadow-xs font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Dues Defaulters ({defaulters.length})
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={exportToCSV}
              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
            <button
              type="button"
              onClick={printReport}
              className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-xs flex items-center gap-1.5 hover:bg-slate-50 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Sheet</span>
            </button>
          </div>
        </div>

        {/* Audit Header Banner for Print and Screen */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-slate-700/80 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-700 pb-3 mb-3">
            <div>
              <span className="text-xs text-blue-600 dark:text-blue-400 font-bold uppercase tracking-wider block">
                {collegeInfo.name}
              </span>
              <h2 className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                Consolidated Fee Collection Statement (AY 2026-27)
              </h2>
            </div>
            <div className="text-left sm:text-right text-[11px] text-slate-500">
              <span>Report Generated: {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
              <span className="block font-mono">Ledger Code: {collegeInfo.code}</span>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-3 gap-3 text-xs">
            <div>
              <span className="text-[10px] text-slate-400 block uppercase font-medium">Gross Assessed</span>
              <span className="text-base font-bold font-mono tabular-nums text-slate-900 dark:text-white">
                ₹{totalAssessed.toLocaleString('en-IN')}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 block uppercase font-medium">Realized / Collected</span>
              <span className="text-base font-bold font-mono tabular-nums text-emerald-600 dark:text-emerald-400">
                ₹{totalCollected.toLocaleString('en-IN')} ({collectionRate}%)
              </span>
            </div>
            <div>
              <span className="text-[10px] text-rose-600 dark:text-rose-400 block uppercase font-medium">Gross Receivables</span>
              <span className="text-base font-bold font-mono tabular-nums text-rose-600 dark:text-rose-400">
                ₹{totalOutstanding.toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        </div>

        {/* Tab 1: BRANCH-WISE ANALYSIS */}
        {reportType === 'branch' && (
          <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700/80 shadow-xs space-y-4">
            <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Department-Wise Collection Efficiency
            </h3>

            <div className="space-y-4">
              {branchReports.map((br) => {
                const bPct = br.assessed > 0 ? Math.round((br.collected / br.assessed) * 100) : 0;
                const bPending = br.assessed - br.collected;

                return (
                  <div key={br.branch} className="space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-bold text-slate-900 dark:text-white block">{br.branch}</span>
                        <span className="text-[10px] text-slate-500">{br.studentCount} Students Enrolled</span>
                      </div>
                      <div className="text-right">
                        <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                          ₹{br.collected.toLocaleString('en-IN')}
                        </span>
                        <span className="text-[10px] text-slate-400 block">
                          of ₹{br.assessed.toLocaleString('en-IN')} ({bPct}%)
                        </span>
                      </div>
                    </div>

                    <div className="w-full bg-slate-100 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-600 rounded-full"
                        style={{ width: `${bPct}%` }}
                      />
                    </div>

                    <div className="flex justify-between text-[10px] text-slate-400 pt-0.5">
                      <span>Realized: {bPct}%</span>
                      <span>Outstanding: ₹{bPending.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 2: FEE HEADS CATEGORY REPORT */}
        {reportType === 'category' && (
          <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700/80 shadow-xs space-y-3">
            <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Fee Heads Breakdown
            </h3>

            <div className="divide-y divide-slate-100 dark:divide-slate-700/60">
              {categoryReports.map((cat) => {
                const cPct = cat.total > 0 ? Math.round((cat.collected / cat.total) * 100) : 0;
                return (
                  <div key={cat.category} className="py-2.5 flex items-center justify-between">
                    <div>
                      <span className="font-semibold text-xs text-slate-900 dark:text-white block">
                        {cat.category} Fee
                      </span>
                      <span className="text-[10px] text-slate-500">
                        Realized {cPct}% · Balance ₹{(cat.total - cat.collected).toLocaleString('en-IN')}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="font-mono font-bold text-xs text-slate-900 dark:text-white block">
                        ₹{cat.collected.toLocaleString('en-IN')}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        Target: ₹{cat.total.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 3: DEFAULTERS LIST */}
        {reportType === 'defaulters' && (
          <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700/80 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Outstanding Balance Defaulters ({defaulters.length})
              </h3>
              <span className="text-[10px] text-rose-600 font-medium">Sorted by Highest Due</span>
            </div>

            {defaulters.length === 0 ? (
              <div className="py-6 text-center text-xs text-emerald-600">
                All students have fully cleared their college fees!
              </div>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-slate-700/60">
                {defaulters.map((s) => (
                  <div key={s.id} className="py-2.5 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-xs text-slate-900 dark:text-white block">
                        {s.name} ({s.rollNumber})
                      </span>
                      <span className="text-[10px] text-slate-500">
                        {s.branch} · Year {s.year} · Ph: {s.phone}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="font-bold font-mono text-xs tabular-nums text-rose-600 dark:text-rose-400 block">
                        ₹{s.pendingAmount.toLocaleString('en-IN')}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        Paid: ₹{s.paidAmount.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <BottomNavBar />
    </div>
  );
};
