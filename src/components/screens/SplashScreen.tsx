import React from 'react';
import { useCollegeFees } from '../../context/CollegeFeesContext';
import { 
  GraduationCap, 
  CreditCard, 
  ShieldCheck, 
  Receipt, 
  ArrowRight, 
  Sparkles,
  Smartphone,
  Users
} from 'lucide-react';

export const SplashScreen: React.FC = () => {
  const { navigateTo, login, setIsFlutterModalOpen, collegeInfo } = useCollegeFees();

  return (
    <div className="flex-1 flex flex-col justify-between p-6 bg-gradient-to-b from-blue-700 via-blue-800 to-slate-900 text-white min-h-[700px]">
      {/* Top Header Branding */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
            <GraduationCap className="w-5 h-5 text-blue-200" />
          </div>
          <span className="text-xs font-semibold tracking-wider uppercase text-blue-200">
            KHIT Guntur
          </span>
        </div>
        <div className="text-[11px] px-2 py-0.5 rounded-full bg-white/10 border border-white/15 text-blue-100">
          Android v2.4
        </div>
      </div>

      {/* Center Hero */}
      <div className="my-auto py-8 text-center flex flex-col items-center">
        {/* Animated App Crest Emblem */}
        <div className="relative mb-6">
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-blue-500 to-indigo-400 p-1 shadow-xl shadow-blue-900/50 flex items-center justify-center">
            <div className="w-full h-full bg-blue-900 rounded-[22px] flex items-center justify-center">
              <Receipt className="w-12 h-12 text-blue-200" />
            </div>
          </div>
          <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white p-1.5 rounded-full shadow-md">
            <ShieldCheck className="w-4 h-4" />
          </div>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-2 leading-tight">
          College Fees Manager
        </h1>
        <p className="text-sm text-blue-100/90 max-w-xs mb-6 font-normal leading-relaxed">
          Smart mobile fee payments, instant verified receipts & real-time fee tracking.
        </p>

        {/* Feature Pills */}
        <div className="grid grid-cols-2 gap-2 w-full max-w-xs text-left mb-6">
          <div className="bg-white/10 backdrop-blur-xs p-2.5 rounded-xl border border-white/10 flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-blue-300 shrink-0" />
            <div className="text-[11px] leading-tight">
              <span className="font-semibold block">Instant UPI & Cards</span>
              <span className="text-blue-200 text-[10px]">Zero transaction lag</span>
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-xs p-2.5 rounded-xl border border-white/10 flex items-center gap-2">
            <Receipt className="w-4 h-4 text-emerald-300 shrink-0" />
            <div className="text-[11px] leading-tight">
              <span className="font-semibold block">Digital Receipts</span>
              <span className="text-blue-200 text-[10px]">QR verified & printable</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Launch Actions */}
      <div className="space-y-2.5">
        <button
          type="button"
          onClick={() => navigateTo('login')}
          className="w-full py-3.5 px-4 rounded-xl bg-white text-blue-900 font-bold text-sm shadow-lg hover:bg-blue-50 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
        >
          <span>Open Login & Registration</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => login('student', '24CS089')}
            className="py-2.5 px-3 rounded-lg bg-blue-600/60 hover:bg-blue-600 border border-white/20 text-white text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
          >
            <span>Demo Student</span>
          </button>
          <button
            type="button"
            onClick={() => login('admin', 'admin@apex')}
            className="py-2.5 px-3 rounded-lg bg-blue-600/60 hover:bg-blue-600 border border-white/20 text-white text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
          >
            <span>Demo Admin</span>
          </button>
        </div>

        <button
          type="button"
          onClick={() => navigateTo('team_members')}
          className="w-full py-2.5 px-3 rounded-xl bg-blue-600/70 hover:bg-blue-600 border border-blue-400/40 text-white text-xs font-semibold transition-all flex items-center justify-center gap-1.5 shadow-sm"
        >
          <Users className="w-3.5 h-3.5 text-blue-200" />
          <span>Meet Project Team Members (KHIT)</span>
        </button>

        <button
          type="button"
          onClick={() => setIsFlutterModalOpen(true)}
          className="w-full py-1.5 text-center text-xs text-blue-200/90 hover:text-white transition-colors flex items-center justify-center gap-1.5 pt-0.5"
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span>Flutter 3.35+ Source Code & APK Setup</span>
        </button>
      </div>
    </div>
  );
};
