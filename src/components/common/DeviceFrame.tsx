import React from 'react';
import { useCollegeFees } from '../../context/CollegeFeesContext';
import { 
  Smartphone, 
  Monitor, 
  RotateCcw, 
  Code2, 
  Sun, 
  Moon, 
  UserCheck, 
  ShieldCheck, 
  Layers,
  Users
} from 'lucide-react';
import { ScreenId } from '../../types';

interface DeviceFrameProps {
  children: React.ReactNode;
}

export const DeviceFrame: React.FC<DeviceFrameProps> = ({ children }) => {
  const {
    viewMode,
    toggleViewMode,
    theme,
    toggleTheme,
    userRole,
    login,
    currentScreen,
    navigateTo,
    resetToDemoData,
    setIsFlutterModalOpen
  } = useCollegeFees();

  const screensList: { id: ScreenId; label: string; number: number }[] = [
    { id: 'splash', label: 'Splash Screen', number: 1 },
    { id: 'login', label: 'Login & Register', number: 2 },
    { id: 'student_dashboard', label: 'Student Dashboard', number: 3 },
    { id: 'student_details', label: 'Student Details', number: 4 },
    { id: 'fee_details', label: 'Fee Details', number: 5 },
    { id: 'payment', label: 'Payment Gateway', number: 6 },
    { id: 'payment_history', label: 'Payment History', number: 7 },
    { id: 'digital_receipt', label: 'Digital Receipt', number: 8 },
    { id: 'admin_dashboard', label: 'Admin Dashboard', number: 9 },
    { id: 'reports', label: 'Reports & Analytics', number: 10 },
    { id: 'team_members', label: 'Project Team Members', number: 11 },
  ];

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col transition-colors duration-200">
      {/* Outer Studio Control Toolbar */}
      <header className="no-print bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 py-2.5 shadow-xs sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          {/* Brand & Title */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
              A
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm tracking-tight text-slate-900 dark:text-white">
                  College Fees Manager
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400 hidden sm:inline">
                  Android App & Portal
                </span>
              </div>
            </div>
          </div>

          {/* Quick Screen Selector Dropdown */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-md text-xs border border-slate-200 dark:border-slate-700">
              <Layers className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span className="font-medium text-slate-600 dark:text-slate-300 hidden md:inline">Screen:</span>
              <select
                value={currentScreen}
                onChange={(e) => navigateTo(e.target.value as ScreenId)}
                className="bg-transparent font-medium text-slate-800 dark:text-slate-200 focus:outline-hidden cursor-pointer"
              >
                {screensList.map((s) => (
                  <option key={s.id} value={s.id} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">
                    {s.number}. {s.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Role Switcher */}
            <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-0.5 rounded-md border border-slate-200 dark:border-slate-700 text-xs">
              <button
                type="button"
                onClick={() => login('student', '24CS089')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-sm font-medium transition-colors ${
                  userRole === 'student'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                }`}
                title="Switch to Student view (Rahul Indla)"
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>Student</span>
              </button>
              <button
                type="button"
                onClick={() => login('admin', 'admin@apex')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-sm font-medium transition-colors ${
                  userRole === 'admin'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                }`}
                title="Switch to Admin view (College Accounts)"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Admin</span>
              </button>
            </div>
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2">
            {/* View Mode Toggle: Phone vs Responsive */}
            <button
              type="button"
              onClick={toggleViewMode}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/60 transition-colors"
              title={viewMode === 'mobile' ? 'Switch to Full Responsive Web View' : 'Switch to Android Phone Simulation Frame'}
            >
              {viewMode === 'mobile' ? (
                <>
                  <Monitor className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                  <span className="hidden sm:inline">Desktop View</span>
                </>
              ) : (
                <>
                  <Smartphone className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                  <span className="hidden sm:inline">Android View</span>
                </>
              )}
            </button>

            {/* Project Team Button */}
            <button
              type="button"
              onClick={() => navigateTo('team_members')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold transition-colors shadow-xs ${
                currentScreen === 'team_members'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-50'
              }`}
              title="View Project Development Team (KHIT Students & Faculty Guide)"
            >
              <Users className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span>Project Team</span>
            </button>

            {/* Flutter Code & APK Export Modal Trigger */}
            <button
              type="button"
              onClick={() => setIsFlutterModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-700 transition-colors shadow-xs"
              title="View full Flutter/Dart code files and APK build instructions"
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>Flutter Source & APK</span>
            </button>

            {/* Reset Demo Data */}
            <button
              type="button"
              onClick={resetToDemoData}
              className="p-1.5 rounded-md text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              title="Reset data to initial defaults"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

            {/* Theme Toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              className="p-1.5 rounded-md text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              title="Toggle Dark / Light theme"
            >
              {theme === 'dark' ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Container Area */}
      <main className="flex-1 flex justify-center items-start p-2 sm:p-4 md:p-6 overflow-x-hidden">
        {viewMode === 'mobile' ? (
          /* Android 14 Smartphone Frame Mockup */
          <div className="relative w-full max-w-[412px] h-[860px] max-h-[calc(100vh-80px)] bg-slate-900 rounded-[44px] p-3 shadow-2xl ring-1 ring-slate-800/80 flex flex-col my-auto transition-all">
            {/* Outer phone bezel highlights */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-4 bg-slate-900 rounded-b-xl z-30 pointer-events-none" />
            
            {/* Phone Screen Glass */}
            <div className="relative w-full h-full bg-white dark:bg-slate-950 rounded-[34px] overflow-hidden flex flex-col border border-slate-800/40">
              
              {/* Android Status Bar */}
              <div className="no-print h-7 px-6 bg-blue-600 text-white flex items-center justify-between text-[11px] font-medium tracking-tight shrink-0 select-none z-20">
                <span>09:41</span>
                {/* Punch-hole camera dot */}
                <div className="w-3.5 h-3.5 rounded-full bg-slate-900 mx-auto" />
                <div className="flex items-center gap-1.5 text-[10px]">
                  <span>5G</span>
                  <span>100%</span>
                </div>
              </div>

              {/* Scrollable Android Screen Content */}
              <div className="flex-1 overflow-y-auto overflow-x-hidden relative flex flex-col">
                {children}
              </div>

              {/* Android Bottom Navigation Gestures Bar */}
              <div className="no-print h-5 bg-white dark:bg-slate-950 flex items-center justify-center shrink-0 z-20 select-none">
                <div className="w-28 h-1 bg-slate-300 dark:bg-slate-700 rounded-full" />
              </div>
            </div>
          </div>
        ) : (
          /* Full Desktop / Tablet Responsive View */
          <div className="w-full max-w-6xl bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col min-h-[780px]">
            {children}
          </div>
        )}
      </main>
    </div>
  );
};
