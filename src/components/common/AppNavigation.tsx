import React from 'react';
import { useCollegeFees } from '../../context/CollegeFeesContext';
import { 
  ArrowLeft, 
  Home, 
  CreditCard, 
  History, 
  User, 
  PieChart, 
  FileText, 
  Users, 
  Layers, 
  LogOut
} from 'lucide-react';
import { ScreenId } from '../../types';

interface TopAppBarProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  onBack?: () => void;
  rightAction?: React.ReactNode;
}

export const TopAppBar: React.FC<TopAppBarProps> = ({
  title,
  subtitle,
  showBack = false,
  onBack,
  rightAction
}) => {
  const { goBack, logout, userRole } = useCollegeFees();

  return (
    <div className="no-print sticky top-0 z-20 bg-blue-600 text-white shadow-xs px-4 py-3 flex items-center justify-between gap-3">
      <div className="flex items-center gap-3 min-w-0">
        {showBack && (
          <button
            type="button"
            onClick={onBack || goBack}
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/10 active:scale-95 transition-all text-white shrink-0"
            aria-label="Go back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        )}
        <div className="min-w-0">
          <h1 className="text-base font-semibold tracking-tight truncate leading-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="text-[11px] text-blue-100 truncate mt-0.5">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {rightAction}
        <button
          type="button"
          onClick={logout}
          title={`Sign out (${userRole})`}
          className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/15 text-blue-100 hover:text-white transition-colors"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export const BottomNavBar: React.FC = () => {
  const { currentScreen, navigateTo, userRole } = useCollegeFees();

  if (currentScreen === 'splash' || currentScreen === 'login') {
    return null;
  }

  if (userRole === 'admin') {
    const adminNav: { id: ScreenId; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
      { id: 'admin_dashboard', label: 'Dashboard', icon: Home },
      { id: 'reports', label: 'Reports', icon: FileText },
    ];

    return (
      <nav className="no-print border-t border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md sticky bottom-0 z-20 px-3 py-1.5 flex items-center justify-around">
        {adminNav.map((item) => {
          const Icon = item.icon;
          const isActive = currentScreen === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => navigateTo(item.id)}
              className={`flex-1 flex flex-col items-center justify-center py-1 transition-all ${
                isActive
                  ? 'text-blue-600 dark:text-blue-400 font-semibold'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 font-medium'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[11px] mt-1 tracking-tight">{item.label}</span>
            </button>
          );
        })}
      </nav>
    );
  }

  // Student Navigation
  const studentNav: { id: ScreenId; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'student_dashboard', label: 'Home', icon: Home },
    { id: 'fee_details', label: 'Fee Details', icon: PieChart },
    { id: 'payment', label: 'Pay Fees', icon: CreditCard },
    { id: 'payment_history', label: 'History', icon: History },
    { id: 'student_details', label: 'Profile', icon: User },
  ];

  return (
    <nav className="no-print border-t border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md sticky bottom-0 z-20 px-2 py-1.5 flex items-center justify-between">
      {studentNav.map((item) => {
        const Icon = item.icon;
        const isActive = currentScreen === item.id;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => navigateTo(item.id)}
            className={`flex-1 flex flex-col items-center justify-center py-1 transition-all ${
              isActive
                ? 'text-blue-600 dark:text-blue-400 font-semibold'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 font-medium'
            }`}
          >
            <Icon className="w-5 h-5" />
            <span className="text-[10px] mt-1 tracking-tight truncate max-w-[64px]">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
