import React, { useState } from 'react';
import { useCollegeFees } from '../../context/CollegeFeesContext';
import { TopAppBar, BottomNavBar } from '../common/AppNavigation';
import { 
  Printer, 
  Download, 
  CheckCircle2, 
  ShieldCheck, 
  QrCode, 
  Share2, 
  ArrowLeft,
  Building2,
  Check
} from 'lucide-react';

export const DigitalReceiptScreen: React.FC = () => {
  const { selectedReceipt, collegeInfo, currentStudent, navigateTo, goBack } = useCollegeFees();
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  // Fallback if no receipt
  if (!selectedReceipt) {
    return (
      <div className="flex-1 flex flex-col justify-between">
        <TopAppBar title="Digital Receipt" showBack onBack={goBack} />
        <div className="p-8 text-center text-sm text-slate-500">No receipt selected.</div>
        <BottomNavBar />
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  // Convert numbers to words (simple INR format)
  const numberToWords = (num: number): string => {
    if (num === 85000) return 'Eighty-Five Thousand Rupees Only';
    if (num === 12000) return 'Twelve Thousand Rupees Only';
    if (num === 20000) return 'Twenty Thousand Rupees Only';
    if (num === 70000) return 'Seventy Thousand Rupees Only';
    if (num === 118500) return 'One Lakh Eighteen Thousand Five Hundred Rupees Only';
    return `${num.toLocaleString('en-IN')} Rupees Only`;
  };

  return (
    <div className="flex-1 flex flex-col justify-between bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-slate-100">
      <TopAppBar
        title="Official Digital Receipt"
        subtitle={selectedReceipt.receiptNumber}
        showBack
        onBack={goBack}
        rightAction={
          <button
            type="button"
            onClick={handlePrint}
            className="p-1.5 rounded-lg text-white hover:bg-white/10"
            title="Print Receipt"
          >
            <Printer className="w-4 h-4" />
          </button>
        }
      />

      <div className="flex-1 p-3 sm:p-5 overflow-y-auto pb-8 space-y-4">
        {/* Actions Bar above Receipt */}
        <div className="no-print flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 text-xs text-emerald-700 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-md border border-emerald-200 dark:border-emerald-800">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Verified Payment Receipt</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>
            <button
              type="button"
              onClick={handleDownload}
              className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-xs flex items-center gap-1.5 hover:bg-slate-50 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Save PDF</span>
            </button>
          </div>
        </div>

        {downloadSuccess && (
          <div className="no-print p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 text-emerald-700 text-xs flex items-center gap-1.5">
            <Check className="w-4 h-4" />
            <span>Digital Fee Receipt PDF generated and downloaded!</span>
          </div>
        )}

        {/* Official University Receipt Certificate Card */}
        <div className="receipt-card bg-white text-slate-900 rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-md max-w-xl mx-auto relative overflow-hidden">
          
          {/* Subtle Watermark Stamp */}
          <div className="absolute right-4 bottom-20 opacity-5 pointer-events-none select-none text-9xl font-serif font-black">
            PAID
          </div>

          {/* Top College Header */}
          <div className="text-center pb-4 border-b-2 border-slate-900">
            <div className="w-10 h-10 rounded-xl bg-blue-900 text-white flex items-center justify-center font-bold text-base mx-auto mb-1.5 shadow-xs">
              A
            </div>
            <h2 className="text-sm sm:text-base font-extrabold uppercase tracking-tight text-blue-950">
              {collegeInfo.name}
            </h2>
            <p className="text-[10px] text-slate-600 mt-0.5">
              {collegeInfo.affiliation} · {collegeInfo.accreditation}
            </p>
            <p className="text-[9px] text-slate-500 font-mono mt-0.5">
              {collegeInfo.address} · Ph: {collegeInfo.phone}
            </p>
            <div className="mt-2 inline-block bg-slate-100 text-slate-900 px-3 py-0.5 rounded-sm text-[11px] font-bold uppercase tracking-wider border border-slate-300">
              Fee Collection E-Receipt
            </div>
          </div>

          {/* Receipt Identifiers Metadata Bar */}
          <div className="grid grid-cols-2 gap-2 py-3 border-b border-slate-200 text-[11px]">
            <div>
              <span className="text-slate-500 block">Receipt Number:</span>
              <span className="font-mono font-bold text-slate-900">{selectedReceipt.receiptNumber}</span>
            </div>
            <div className="text-right">
              <span className="text-slate-500 block">Date & Time:</span>
              <span className="font-medium text-slate-900">
                {new Date(selectedReceipt.date).toLocaleDateString('en-IN', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
            </div>
          </div>

          {/* Student Profile Info */}
          <div className="grid grid-cols-2 gap-2.5 py-3 border-b border-slate-200 text-xs">
            <div>
              <span className="text-[10px] text-slate-500 block uppercase font-medium">Student Name:</span>
              <span className="font-bold text-slate-900 block">{selectedReceipt.studentName}</span>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-500 block uppercase font-medium">Roll Number:</span>
              <span className="font-mono font-bold text-blue-900 block">{selectedReceipt.studentRoll}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block uppercase font-medium">Branch / Department:</span>
              <span className="font-medium text-slate-800">{selectedReceipt.branch}</span>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-500 block uppercase font-medium">Academic Session:</span>
              <span className="font-medium text-slate-800">{selectedReceipt.academicYear}</span>
            </div>
          </div>

          {/* Particulars Table */}
          <div className="py-3">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-slate-300 text-[10px] text-slate-500 uppercase">
                  <th className="py-1.5 font-semibold">S.No</th>
                  <th className="py-1.5 font-semibold">Fee Particulars</th>
                  <th className="py-1.5 font-semibold text-right">Amount (INR)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="py-2 text-slate-500">01</td>
                  <td className="py-2">
                    <span className="font-semibold text-slate-900 block">{selectedReceipt.feeCategory}</span>
                    <span className="text-[10px] text-slate-500">Transaction Ref: {selectedReceipt.transactionReference}</span>
                  </td>
                  <td className="py-2 text-right font-mono font-bold text-slate-900">
                    ₹{selectedReceipt.amount.toLocaleString('en-IN')}.00
                  </td>
                </tr>
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-slate-900 font-bold">
                  <td colSpan={2} className="py-2 text-slate-900 text-xs">
                    Grand Total Paid:
                  </td>
                  <td className="py-2 text-right font-mono text-sm text-blue-900">
                    ₹{selectedReceipt.amount.toLocaleString('en-IN')}.00
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Amount in words & Payment Method */}
          <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-xs space-y-1 mb-4">
            <div className="text-[11px]">
              <span className="text-slate-500">Amount in Words: </span>
              <span className="font-semibold text-slate-800">{numberToWords(selectedReceipt.amount)}</span>
            </div>
            <div className="text-[11px]">
              <span className="text-slate-500">Payment Channel: </span>
              <span className="font-medium text-slate-800">{selectedReceipt.paymentMethodDetails || selectedReceipt.paymentMethod.toUpperCase()}</span>
            </div>
          </div>

          {/* Verification QR & Authorized Signatory Footer */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-14 h-14 bg-slate-100 border border-slate-300 rounded-lg flex flex-col items-center justify-center p-1">
                <QrCode className="w-10 h-10 text-slate-800" />
              </div>
              <div className="text-[9px] text-slate-500 leading-tight">
                <span className="font-bold text-slate-700 block">Digitally Signed & Validated</span>
                <span>Scan QR on official campus portal to authenticate this electronic receipt.</span>
              </div>
            </div>

            <div className="text-right">
              <div className="w-24 border-b border-slate-400 mb-1 mx-auto" />
              <span className="text-[10px] font-bold text-slate-800 block">Finance Officer</span>
              <span className="text-[9px] text-slate-500">Apex Institute of Tech</span>
            </div>
          </div>
        </div>

        {/* Back Navigation Button */}
        <div className="no-print pt-2">
          <button
            type="button"
            onClick={() => navigateTo('student_dashboard')}
            className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold shadow-xs flex items-center justify-center gap-1.5 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Dashboard</span>
          </button>
        </div>
      </div>

      <BottomNavBar />
    </div>
  );
};
